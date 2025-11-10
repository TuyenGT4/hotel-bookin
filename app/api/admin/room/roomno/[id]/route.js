import { NextResponse } from "next/server";

import dbConnect from "@/utils/dbConnect";

import RoomNumber from "@/model/roomnumber";

export async function PUT(req, context) {
  await dbConnect();

  const { id } = await context?.params;

  if (!id) {
    return NextResponse.json({ error: "Room Id is required" }, { status: 400 });
  }

  const body = await req.json();

  try {
    const updatedRoomNumber = await RoomNumber.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (!updatedRoomNumber) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: "Room successfully updated",
      data: updatedRoomNumber,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  await dbConnect();

  const { id } = await context?.params;

  try {
    const deletingRoomNumber = await RoomNumber.findByIdAndDelete(id);

    return NextResponse.json(deletingRoomNumber);
  } catch (error) {
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}
