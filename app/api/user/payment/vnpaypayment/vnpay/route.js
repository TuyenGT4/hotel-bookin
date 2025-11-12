import crypto from "crypto";
import qs from "qs";
import config from "@/config";

console.log("VNPay route loaded:", __filename);

export async function GET() {
  // Trả JSON cho GET để tránh Next trả trang HTML 405
  return Response.json(
    { error: "Method Not Allowed. Use POST to create payment URL." },
    { status: 405 }
  );
}

export async function POST(req) {
  try {
    console.log("VNPay POST hit");
    const body = await req.json();
    const {
      orderId,
      amount,
      orderInfo,
      orderType = "other",
      locale = "vn",
    } = body;

    if (!orderId || !amount) {
      return Response.json(
        { error: "orderId and amount required" },
        { status: 400 }
      );
    }

    const date = new Date();
    const pad = (n) => (n < 10 ? "0" + n : n);
    const createDate = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(
      date.getDate()
    )}${pad(date.getHours())}${pad(date.getMinutes())}${pad(
      date.getSeconds()
    )}`;

    const vnp_Params = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: config.VNP_TMNCODE,
      vnp_Amount: Number(amount) * 100,
      vnp_CurrCode: "VND",
      vnp_TxnRef: String(orderId),
      vnp_OrderInfo: orderInfo || `Thanh toan don ${orderId}`,
      vnp_OrderType: orderType,
      vnp_Locale: locale,
      vnp_ReturnUrl: config.VNP_RETURN_URL,
      vnp_IpAddr: req.headers.get("x-forwarded-for") || "127.0.0.1",
      vnp_CreateDate: createDate,
    };

    // sort keys lexicographically
    const sorted = Object.keys(vnp_Params)
      .sort()
      .reduce((acc, key) => {
        acc[key] = vnp_Params[key];
        return acc;
      }, {});

    const signData = Object.entries(sorted)
      .map(([k, v]) => `${k}=${v}`)
      .join("&");
    const hmac = crypto.createHmac("sha512", config.VNP_SECRET);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
    const query = qs.stringify(sorted, { encode: true });
    const paymentUrl = `${config.VNP_HOST}?${query}&vnp_SecureHash=${signed}`;

    console.log("✅ VNPay URL created:", paymentUrl);
    return Response.json({ url: paymentUrl });
  } catch (error) {
    console.error("VNPay create error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
