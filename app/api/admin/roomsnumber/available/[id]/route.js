import { NextResponse } from "next/server";

import dbConnect from "@/utils/dbConnect";

import RoomNumber from "@/model/roomnumber";

export async function GET(req, context) {
  await dbConnect();

  try {
    const { id } = await context?.params;

    const [roomId, roomType] = id.split("&").map((param) => {
      const [key, value] = param.split("=");
      return value;
    });

    console.log("parsed parameters", { roomId, roomType });

    if (!roomId || !roomType) {
      return NextResponse.json(
        {
          error: "missing required parameters",
        },
        { status: 400 }
      );
    }

    const availablrRooms = await RoomNumber.find({
      room_id: roomId,
      roomtype_id: roomType,
    });

    return NextResponse.json(availablrRooms);
  } catch (error) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }
}
