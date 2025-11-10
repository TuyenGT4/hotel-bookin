import { NextResponse } from "next/server";

import dbConnect from "@/utils/dbConnect";

import RoomType from "@/model/roomtype";
import Room from "@/model/room";

export async function GET() {
  await dbConnect();

  try {
    const roomtype = await RoomType.find({});

    return NextResponse.json(roomtype);
  } catch (error) {
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  await dbConnect();

  const body = await req.json();

  const { name } = body;

  console.log({ name });
  
  try {
    const roomtype = await RoomType.create({ name });
    console.log("roomtype", roomtype);
    const room = await Room.create({
      roomtype_id: roomtype?._id,
    });
    console.log("room", room);
    return NextResponse.json({
      roomtype,
      room,
    });
  } catch (error) {
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}
