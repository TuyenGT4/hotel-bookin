import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import User from "@/model/user";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import Stripe from "stripe";
import Booking from "@/model/booking";

import RoomBookedDate from "@/model/roomBookedDate";

const stripeInstance = new Stripe("");

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
  console.log("sessionxxxxxxxxxxxxxxxxx", session);

  if (!session?.user?._id) {
    return NextResponse.json({ err: "Not authenticated" }, { status: 401 });
  }

  const user = await User.findOne({ _id: session?.user?._id });

  if (!user) {
    return NextResponse.json({ err: "user not found" }, { status: 500 });
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
      image,
      billingDetails,
      paymentMethod,
    } = await req.json();

    const { country, name, email, phone, address, state, zipCode } =
      billingDetails;

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

    if (!room_id || !newBooking?._id || !checkIn || !checkOut) {
      return NextResponse.json({ message: "Missing fields" });
    }

    const dates = generateDateRange(checkIn, checkOut);

    const bookedDates = dates.map((date) => ({
      booking_id: newBooking?._id,
      room_id,
      book_date: date,
    }));

    await RoomBookedDate.insertMany(bookedDates);

    const sessions = await stripeInstance.checkout.sessions.create({
      payment_method_types: ["card"],

      line_items: [
        {
          price_data: {
            currency: "INR",
            product_data: {
              name: roomTypeName,
            },
            unit_amount: Math.round(total * 100),
          },
          quantity: 1,
        },
      ],

      mode: "payment",

      success_url:
        "http://localhost:3000/dashboard/user/stripe/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:3000/dashboard/user/stripe/cancel",

      customer_email: user?.email,
      metadata: {
        booking_id: newBooking?._id.toString(),
      },
    });

    console.log("sessions", sessions);

    return NextResponse.json({ id: sessions.url });
  } catch (err) {
    console.error("Order creation error:", err);
    return NextResponse.json(
      { err: err.message || "Failed to create order" },
      { status: 500 }
    );
  }
}
