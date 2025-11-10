// Import necessary modules and functions
import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import User from "@/model/user";

// GET handler for fetching monthly user counts
export async function GET(req) {
  await dbConnect();

  try {
    // Aggregate users by month
    const monthlyUsers = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1
        }
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          count: 1
        }
      }
    ]);

   
    const formattedData = monthlyUsers.map(item => {
      const date = new Date(item.year, item.month - 1);
      return {
        name: date.toLocaleString('default', { month: 'short' }) + ' ' + item.year,
        users: item.count,
        monthYear: date.toLocaleString('default', { month: 'short', year: 'numeric' })
      };
    });

   

     console.log("(formattedData" ,formattedData)
    return NextResponse.json(formattedData);
  } catch (err) {
    console.log(err);
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}