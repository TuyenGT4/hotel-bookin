import { NextResponse } from "next/server";

import dbConnect from "@/utils/dbConnect";

import { getServerSession } from "next-auth/next";

import { authOptions } from "@/utils/authOptions";

import Booking from "@/model/booking";
export async function GET(req) {
  await dbConnect();

  const session = await getServerSession(authOptions);

  try {
    if (!session?.user?._id) {
      return NextResponse.json({ err: "not authenticated" });
    }

    const userId = session.user._id;

    const bookings = await Booking.find({ user_id: userId });

    console.log("booking", bookings);

    return NextResponse.json(bookings);
  } catch (error) {
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}
