import { NextResponse } from "next/server";

import dbConnect from "@/utils/dbConnect";

import Booking from "@/model/booking";

export async function GET() {
  await dbConnect();

  try {
    const countryData = await Booking.aggregate([
      {
        $group: {
          _id: "$country",
          count: { $sum: 1 },
        },
      },
    ]);

    return NextResponse.json(countryData);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
