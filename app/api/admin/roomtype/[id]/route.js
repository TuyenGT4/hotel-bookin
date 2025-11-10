import { NextResponse } from "next/server";

import dbConnect from "@/utils/dbConnect";

import Room from "@/model/room";
import Facility from "@/model/facility";
import MultiImage from "@/model/multiImage";
import RoomNumber from "@/model/roomnumber";

import RoomType from "@/model/roomtype";

export async function DELETE(req, context) {
  await dbConnect();

  const { id } = await context.params;

  try {
    const deletedRoomType = await RoomType.findByIdAndDelete(id);

    if (!deletedRoomType) {
      return NextResponse.json(
        {
          success: false,
          error: "Room Type not Found",
        },
        { status: 404 }
      );
    }

    const rooms = await Room.find({ roomtype_id: id });

    const roomDeletionPromises = rooms.map(async (room) => {
      await Facility.deleteMany({ room_id: room._id });

      await MultiImage.deleteMany({ room_id: room._id });

     await RoomNumber.deleteMany({ room_id: room._id });
      return Room.findByIdAndDelete(room._id);
    });

    await Promise.all(roomDeletionPromises);

    console.log("delete successfully");
    return NextResponse.json({
      success: true,
      message: "Room Type and all associated data deleted successfully",
      deletedRoomType: deletedRoomType,
      deletedRoomType: rooms.length,
    });
  } catch (error) {
    console.log("error", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
