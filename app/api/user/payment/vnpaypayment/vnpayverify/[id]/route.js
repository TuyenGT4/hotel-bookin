import crypto from "crypto";
import { vnpayConfig } from "@/config/config.vnpay";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const vnp_Params = Object.fromEntries(searchParams.entries());
    const secureHash = vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    const sorted = Object.keys(vnp_Params)
      .sort()
      .reduce((acc, key) => ({ ...acc, [key]: vnp_Params[key] }), {});

    const signData = Object.entries(sorted)
      .map(([k, v]) => `${k}=${v}`)
      .join("&");

    const hmac = crypto.createHmac("sha512", vnpayConfig.hashSecret);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    if (secureHash === signed) {
      if (vnp_Params["vnp_ResponseCode"] === "00") {
        return Response.json({
          message: "✅ Thanh toán thành công",
          orderId: vnp_Params["vnp_TxnRef"],
          amount: vnp_Params["vnp_Amount"] / 100,
        });
      } else {
        return Response.json({
          message: "❌ Thanh toán thất bại",
          code: vnp_Params["vnp_ResponseCode"],
        });
      }
    } else {
      return Response.json({ error: "Invalid signature" }, { status: 400 });
    }
  } catch (err) {
    console.error("VNPay verify error:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
