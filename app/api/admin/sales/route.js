import { NextResponse } from "next/server";

import dbConnect from "@/utils/dbConnect";

import Booking from "@/model/booking";

export async function GET() {
  await dbConnect();

  try {
    const revenueData = await Booking.aggregate([
      {
        $group: {
          _id: {
            year: {
              $year: "$createdAt",
            },

            month: {
              $month: "$createdAt",
            },
          },

          totalRevenue: {
            $sum: "$total_price",
          },
          count: { $sum: 1 },
        },
      },

      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);



      console.log("revenueData" ,revenueData)
    return NextResponse.json(revenueData);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
