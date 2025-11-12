import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

const languageDetectorOptions = {
  order: ["localStorage", "navigator"],
  caches: ["localStorage"],
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "vi",
    debug: false,
    detection: languageDetectorOptions,
    backend: {
      // ⚡ Cho phép load nhiều namespace ở các thư mục con
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
    ns: ["common"], // namespace mặc định
    defaultNS: "common",
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
    // Load translation trước khi init
    initImmediate: false,
  });

export default i18n;
