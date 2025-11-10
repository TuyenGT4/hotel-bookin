import { NextResponse } from "next/server";

import dbConnect from "@/utils/dbConnect";

import RoomType from "@/model/roomtype";

export async function GET() {
  await dbConnect();

  try {
    const roomtype = await RoomType.find({}).sort({ createdAt: -1 });

    return NextResponse.json(roomtype);
  } catch (error) {
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}
