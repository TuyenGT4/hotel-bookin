const fs = require("fs");
const path = require("path");
const glob = require("glob");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

const ARGS = process.argv.slice(2);
function getArg(name, def) {
  const i = ARGS.indexOf(name);
  if (i >= 0) {
    if (typeof def === "boolean") return true;
    if (i + 1 < ARGS.length) return ARGS[i + 1];
  }
  return def;
}

const ROOT = path.resolve(getArg("--root", process.cwd()));
const OUT_DIR = path.resolve(
  getArg("--out", path.join(process.cwd(), "i18n-extract"))
);
const GLOBS_RAW = getArg("--globs", "**/*.{js,jsx,ts,tsx}");
const KEEP_LANG_NAMES =
  String(getArg("--keepLangNames", "true")).toLowerCase() !== "false";

const IGNORE = [
  "**/node_modules/**",
  "**/.next/**",
  "**/dist/**",
  "**/build/**",
  "**/coverage/**",
  "**/.turbo/**",
  "**/.git/**",
];

// Allowlist of JSX attributes that commonly carry user-facing text
const ATTR_ALLOW = new Set([
  "placeholder",
  "title",
  "alt",
  "aria-label",
  "ariaLabel",
  "ariaTitle",
  "label",
  "header",
  "caption",
  "helperText",
  "tooltip",
  "aria-placeholder",
  "ariaDescription",
  "aria-description",
  "aria-roledescription",
]);

function parseGlobs(raw) {
  const parts = [];
  for (let i = 0; i < ARGS.length; i++) {
    if (ARGS[i] === "--globs" && i + 1 < ARGS.length) {
      parts.push(
        ...String(ARGS[i + 1])
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      );
    }
  }
  if (parts.length === 0) {
    parts.push(
      ...String(raw)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    );
  }
  return parts.length ? parts : ["**/*.{js,jsx,ts,tsx}"];
}

const LANG_NAME_RE =
  /\b(english|vietnamese|viet|arabic|german|french|spanish|chinese|japanese|korean|thai|hindi)\b/i;

function isLikelyTranslatable(str) {
  if (!str) return false;
  const s = String(str).replace(/\s+/g, " ").trim();
  if (!s) return false;

  // Skip template placeholders
  if (s.includes("${")) return false;

  // Skip code-ish identifiers / long keys
  if (/^[A-Z0-9_]+$/.test(s)) return false; // ENUM/CONST
  if (/^[a-z0-9_.$-]+$/.test(s) && s.includes(".")) return false; // obj.path
  if (/^[a-z0-9_]+$/.test(s) && s.length > 24) return false; // long key-like

  // Skip URLs/emails
  if (/^https?:\/\//i.test(s)) return false;
  if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(s)) return false;

  // Skip numeric/currency-only
  if (/^[\d\s.,\-+/()₫$€£¥%]+$/.test(s)) return false;

  // Skip CSS/tailwind-ish tokens
  if (
    /\b(text|flex|bg|border|justify|items|gap|rounded|shadow|font|p-|m-|w-|h-|grid|col|row|inline|mx-|my-|px-|py-|pt-|pr-|pb-|pl-|sm:|md:|lg:|xl:)\b/i.test(
      s
    )
  )
    return false;

  // Skip hex colors (#fff, #ffffff, #4caf50) possibly quoted
  if (/^#?[0-9a-f]{3,8}$/i.test(s)) return false;

  // Skip dimensions: 100vh, 80px, 1.25rem, 50%
  if (/^\d+(\.\d+)?(px|vh|vw|rem|em|%)$/i.test(s)) return false;

  // Skip common file paths / images
  if (/[\\/](images?|img|assets)[\\/].+\.(png|jpg|jpeg|svg|webp|gif)$/i.test(s))
    return false;
  if (/\.(png|jpg|jpeg|svg|webp|gif)$/i.test(s)) return false;

  // Skip simple tag tokens
  if (/^(div|span|img|p|button|input|label|h[1-6]|ul|li|a|svg|path)$/i.test(s))
    return false;

  // Skip obvious SVG path data (e.g., "M12 5L19 12L12 19")
  if (/^M\d+/.test(s)) return false;

  // Optionally keep/remove language names
  if (!KEEP_LANG_NAMES && LANG_NAME_RE.test(s)) return false;

  // Require at least one A-Z letter
  if (!/[A-Za-z]/.test(s)) return false;

  // Consider UI-like if has spaces OR Capitalized word OR punctuation
  if (/\s/.test(s) || /[A-Z][a-z]/.test(s) || /[.!?]/.test(s)) return true;

  // Otherwise be conservative
  return false;
}

function hash(str) {
  const crypto = require("crypto");
  return crypto.createHash("md5").update(str).digest("hex").slice(0, 8);
}
function keyFromText(s) {
  const base = s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return base.slice(0, 60) || `key_${hash(s)}`;
}

function parseFile(filepath) {
  const code = fs.readFileSync(filepath, "utf8");
  let ast;
  try {
    ast = parser.parse(code, {
      sourceType: "unambiguous",
      plugins: [
        "jsx",
        "decorators-legacy",
        "classProperties",
        "classPrivateProperties",
        "classPrivateMethods",
        "dynamicImport",
        "importMeta",
        "topLevelAwait",
        "objectRestSpread",
        "optionalChaining",
        "nullishCoalescingOperator",
      ],
    });
  } catch (e) {
    return { entries: [], error: e.message };
  }

  const entries = [];
  traverse(ast, {
    JSXText(p) {
      const txt = String(p.node.value).replace(/\s+/g, " ").trim();
      if (isLikelyTranslatable(txt)) {
        entries.push({
          text: txt,
          kind: "JSXText",
          loc: p.node.loc && { start: p.node.loc.start },
        });
      }
    },
    JSXAttribute(p) {
      const name = p.node.name && p.node.name.name;
      if (!name || !ATTR_ALLOW.has(String(name))) return;
      const v = p.node.value;
      if (!v) return;
      if (v.type === "StringLiteral") {
        const txt = v.value;
        if (isLikelyTranslatable(txt)) {
          entries.push({
            text: txt,
            kind: `JSXAttr:${name}`,
            loc: v.loc && { start: v.loc.start },
          });
        }
      } else if (v.type === "JSXExpressionContainer") {
        const ex = v.expression;
        if (!ex) return;
        if (ex.type === "StringLiteral") {
          const txt = ex.value;
          if (isLikelyTranslatable(txt)) {
            entries.push({
              text: txt,
              kind: `JSXAttrExpr:${name}`,
              loc: v.loc && { start: v.loc.start },
            });
          }
        } else if (
          ex.type === "TemplateLiteral" &&
          ex.expressions.length === 0
        ) {
          const raw = ex.quasis.map((q) => q.value.cooked).join("");
          if (isLikelyTranslatable(raw)) {
            entries.push({
              text: raw,
              kind: `JSXAttrTpl:${name}`,
              loc: v.loc && { start: v.loc.start },
            });
          }
        }
      }
    },
    JSXExpressionContainer(p) {
      const ex = p.node.expression;
      if (!ex) return;
      if (ex.type === "StringLiteral") {
        const txt = ex.value;
        if (isLikelyTranslatable(txt)) {
          entries.push({
            text: txt,
            kind: "JSXExpr:String",
            loc: p.node.loc && { start: p.node.loc.start },
          });
        }
      } else if (ex.type === "TemplateLiteral" && ex.expressions.length === 0) {
        const raw = ex.quasis.map((q) => q.value.cooked).join("");
        if (isLikelyTranslatable(raw)) {
          entries.push({
            text: raw,
            kind: "JSXExpr:Tpl",
            loc: p.node.loc && { start: p.node.loc.start },
          });
        }
      }
    },
  });
  return { entries };
}

function main() {
  console.log(`[i18n-extract v3.2] Root: ${ROOT}`);
  const globs = parseGlobs(GLOBS_RAW);
  console.log(`[i18n-extract v3.2] Globs: ${globs.join(", ")}`);

  const options = {
    cwd: ROOT,
    ignore: IGNORE,
    nodir: true,
    windowsPathsNoEscape: true,
  };
  const filesSet = new Set();
  for (const g of globs) {
    const matched = glob.sync(g, options);
    matched.forEach((rel) => filesSet.add(path.resolve(ROOT, rel)));
  }
  const files = Array.from(filesSet);
  console.log(`[i18n-extract v3.2] Matched ${files.length} code files.`);

  const textMap = new Map();
  let parseErrors = 0;

  for (const file of files) {
    const rel = path.relative(ROOT, file);
    const { entries, error } = parseFile(file);
    if (error) {
      parseErrors++;
      continue;
    }
    for (const e of entries) {
      const text = e.text;
      if (!textMap.has(text))
        textMap.set(text, { key: keyFromText(text), occurrences: [] });
      const line = e.loc && e.loc.start && e.loc.start.line;
      textMap
        .get(text)
        .occurrences.push({ file: rel, kind: e.kind, line: line || null });
    }
  }

  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  const messages = Array.from(textMap.entries())
    .map(([text, info]) => ({
      key_suggestion: info.key,
      text_en: text,
      files: Array.from(new Set(info.occurrences.map((o) => o.file))).sort(),
    }))
    .sort((a, b) => a.text_en.localeCompare(b.text_en));

  fs.writeFileSync(
    path.join(OUT_DIR, "messages.json"),
    JSON.stringify(messages, null, 2),
    "utf8"
  );
  const viScaffold = {};
  messages.forEach((m) => (viScaffold[m.key_suggestion] = ""));
  fs.writeFileSync(
    path.join(OUT_DIR, "vi.todo.json"),
    JSON.stringify(viScaffold, null, 2),
    "utf8"
  );

  console.log(
    `[i18n-extract v3.2] Found ${messages.length} unique UI strings.`
  );
  console.log(`[i18n-extract v3.2] Wrote:`);
  console.log(` - ${path.join(OUT_DIR, "messages.json")}`);
  console.log(` - ${path.join(OUT_DIR, "vi.todo.json")}`);
}

if (require.main === module) main();
