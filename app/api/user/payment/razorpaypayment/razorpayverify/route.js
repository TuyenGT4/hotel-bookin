import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import User from "@/model/user";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";

import Booking from "@/model/booking";

import RoomBookedDate from "@/model/roomBookedDate";
import Razorpay from "razorpay";

// Initialize Razorpay instance using the key and secret from environment variables
var razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  await dbConnect();

  const body = await req.json();
  const { razorpay_payment_id } = body;

  try {
    // Fetch the payment details from Razorpay
    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    console.log("payment razorpay", payment);

    // Get the booking ID from payment notes
    const bookingId = payment.notes.booking_id;

    // Check if payment is successful
    if (payment && payment.status === "captured") {
      // Update the booking with payment details
      const updatedBooking = await Booking.findByIdAndUpdate(
        bookingId,
        {
          transaction_id: payment.id, // Use payment._id or payment.id as transaction_id
          payment_status: "1", // Or you can use "completed", "success", etc.
        },
        { new: true } // Return the updated document
      );

      if (!updatedBooking) {
        return NextResponse.json(
          { error: "Booking not found" },
          { status: 404 }
        );
      }

      console.log("Updated booking:", updatedBooking);
      
      console.log("Payment successful and booking updated")
      return NextResponse.json(
        { success: "Payment successful and booking updated" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { failed: "Payment failed, try again" },
        { status: 500 }
      );
    }
  } catch (err) {
    console.log("payment error", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}