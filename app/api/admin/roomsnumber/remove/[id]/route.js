import dbConnect from "@/utils/dbConnect";

import BookingRoomList from "@/model/bookingroomlist";

import RoomNumber from "@/model/roomnumber";

import { NextResponse } from "next/server";

export async function DELETE(req, context) {
  await dbConnect();

  try {
    const { id } = await context?.params;

    const params = new URLSearchParams(id);

    const bookingId = params.get("bookingId");

    const roomsId = params.get("roomsId");

    const roomNumberId = params.get("roomNumber");

    if (!bookingId || !roomsId || !roomNumberId) {
      return NextResponse.json(
        {
          message: "missing require parameter",
        },
        { status: 400 }
      );
    }

    const deletedBookingRoom = await BookingRoomList.findOneAndDelete({
      booking_id: bookingId,
      room_id: roomsId,
    });

    let updatedRoom = null;

    if (deletedBookingRoom?.room_number_id) {
      updatedRoom = await RoomNumber.findByIdAndUpdate(
        deletedBookingRoom?.room_number_id,
        {
          status: 1,
        },
        { new: true }
      );
    }

    return NextResponse.json({
      message: "room status updated and  booking  entry deleted",
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "server  error",
      },
      { status: 500 }
    );
  }
}
