import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Booking from "@/model/booking";
import { VNPay } from "vnpay";
import { config } from "@/config";

const vnpay = new VNPay({
  tmnCode: config.VNPAY.TMN_CODE || process.env.VNP_TMNCODE,
  secureSecret: config.VNPAY.SECRET_KEY || process.env.VNP_SECRET,
  vnpayHost: config.VNPAY.VNPAY_HOST,
  testMode: true,
});

export async function GET(req, context) {
  await dbConnect();

  const { id } = await context?.params; // id là booking ID từ callback

  try {
    const url = new URL(req.url);
    const queryParams = Object.fromEntries(url.searchParams);

    // Verify callback từ VN Pay
    const result = vnpay.verifyReturnUrl(queryParams);

    if (result.isSuccess() && result.vnp_TxnRef === id) {
      // So sánh với booking ID
      await Booking.findByIdAndUpdate(
        id,
        {
          transaction_id: result.vnp_TransactionNo,
          payment_status: "1", // Paid
        },
        { new: true }
      );

      return NextResponse.json({
        success: "Thanh toán thành công và booking đã cập nhật",
        bookingId: id,
      });
    } else {
      return NextResponse.json(
        {
          failed: "Thanh toán thất bại, thử lại",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("VN Pay verification error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
