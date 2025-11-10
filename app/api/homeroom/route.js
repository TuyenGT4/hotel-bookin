import { NextResponse } from "next/server";

import dbConnect from "@/utils/dbConnect";

import Room from "@/model/room";
import RoomType from "@/model/roomtype";

export async function GET() {
  await dbConnect();

  try {
    const rooms = await Room.find({})
      .populate({
        path: "roomtype_id",
        model: RoomType,
        select: "name",
      })
      .lean();

 //console.log(" rooms", rooms)


    return NextResponse.json(rooms);
  } catch (error) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }
}
