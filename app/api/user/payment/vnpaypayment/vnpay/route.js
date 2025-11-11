import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import User from "@/model/user";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import { VNPay } from "vnpay";
import Booking from "@/model/booking";
import RoomBookedDate from "@/model/roomBookedDate";
import { config } from "@/config"; // Import config.js nếu cần, hoặc sử dụng process.env

const vnpay = new VNPay({
  tmnCode: config.VNPAY.TMN_CODE || process.env.VNP_TMNCODE,
  secureSecret: config.VNPAY.SECRET_KEY || process.env.VNP_SECRET,
  vnpayHost: config.VNPAY.VNPAY_HOST,
  testMode: true, // Đặt false khi production
  hashAlgorithm: "SHA512",
});

function generateBookingCode(length = 8) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from(
    { length },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

function generateDateRange(startDate, endDate) {
  const dates = [];
  const current = new Date(startDate);
  while (current <= new Date(endDate)) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

export async function POST(req) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session?.user?._id) {
    return NextResponse.json({ err: "Not authenticated" }, { status: 401 });
  }

  const user = await User.findOne({ _id: session?.user._id });
  if (!user) {
    return NextResponse.json({ err: "User not found" }, { status: 500 });
  }

  try {
    const {
      pricePerNight,
      nights,
      subtotal,
      discountPercent,
      discountAmount,
      total,
      rooms,
      guests,
      roomTypeName,
      room_id,
      checkIn,
      checkOut,
      billingDetails,
      paymentMethod = "vn_pay", // Đặt mặc định là vn_pay
    } = await req.json();

    const { country, name, email, phone, address, state, zipCode } =
      billingDetails;

    // Tạo booking như các phương thức khác
    const newBooking = new Booking({
      rooms_id: room_id,
      user_id: session?.user._id,
      check_in: checkIn,
      check_out: checkOut,
      person: guests,
      number_of_rooms: rooms,
      total_night: nights,
      actual_price: pricePerNight,
      subtotal,
      discount: discountAmount,
      total_price: parseFloat(total.toFixed(2)),
      payment_method: paymentMethod,
      transaction_id: "",
      payment_status: 0,
      name,
      email,
      phone,
      country,
      state,
      zip_code: zipCode,
      address,
      code: generateBookingCode(),
      status: "inactive",
    });

    await newBooking.save();

    const dates = generateDateRange(checkIn, checkOut);
    const bookedDates = dates.map((date) => ({
      booking_id: newBooking?._id,
      room_id,
      book_date: date,
    }));
    await RoomBookedDate.insertMany(bookedDates);

    // Tạo URL thanh toán VN Pay
    const paymentUrl = vnpay.buildPaymentUrl({
      vnp_Amount: total * 100, // VN Pay yêu cầu nhân 100 cho VND
      vnp_IpAddr: req.headers.get("x-forwarded-for") || req.ip || "127.0.0.1",
      vnp_ReturnUrl: config.VNPAY.RETURN_URL,
      vnp_TxnRef: newBooking._id.toString(),
      vnp_OrderInfo: `Thanh toán đặt phòng: ${roomTypeName}`,
      vnp_OrderType: "billpayment",
      vnp_Locale: "vn",
    });

    return NextResponse.json({ paymentUrl });
  } catch (err) {
    console.error("VN Pay order creation error:", err);
    return NextResponse.json(
      { err: err.message || "Failed to create VN Pay order" },
      { status: 500 }
    );
  }
}
