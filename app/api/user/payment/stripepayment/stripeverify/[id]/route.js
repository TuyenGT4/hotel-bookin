import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import User from "@/model/user";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import Stripe from "stripe";
import Booking from "@/model/booking";

import RoomBookedDate from "@/model/roomBookedDate";

const stripeInstance = new Stripe("");

export async function GET(req, context) {
  await dbConnect();

  const { id } = await context?.params;

  try {
    const stripesession = await stripeInstance.checkout.sessions.retrieve(id);
    const bookingId = stripesession?.metadata?.booking_id;

    if (stripesession && stripesession?.payment_status === "paid") {
      const updatedBooking = await Booking.findByIdAndUpdate(
        bookingId,
        {
          transaction_id: stripesession.id,
          payment_status: "1",
        },

        { new: true }
      );

      if (!updatedBooking) {
        return NextResponse.json(
          { error: "booking not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          success: "payment succcessfull and boking updated",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { failed: "payment  failed try  again" },

        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
