import { NextResponse } from "next/server";

import dbConnect from "@/utils/dbConnect";



import RoomNumber from "@/model/roomnumber";

export async function POST(req) {
  await dbConnect();

  const body = await req.json();

  try {
    const { status, roomNumber, room_id, roomtype_id } = body;

    const roomNumberData = {
      room_id: room_id,
      roomtype_id: roomtype_id,
      room_no: roomNumber,
      status: 1,
    };

    await RoomNumber.create(roomNumberData);

    return NextResponse.json({ success: "successfully updated" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
