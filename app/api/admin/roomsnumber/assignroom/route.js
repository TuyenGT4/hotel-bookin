import dbConnect from "@/utils/dbConnect";

import Booking from "@/model/booking";

import BookingRoomList from "@/model/bookingroomlist";

import RoomNumber from "@/model/roomnumber";

import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();

  const { bookingId, roomsId, roomNumber } = body;

  try {
    await dbConnect();

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return NextResponse.json({
        message: "Booking not found",
      });
    }

    const assignedCount = await BookingRoomList.countDocuments({
      booking_id: bookingId,
    });

    if (assignedCount < booking.number_of_rooms) {
      const assignData = new BookingRoomList({
        booking_id: bookingId,
        room_id: roomsId,
        room_number_id: roomNumber,
      });

      await assignData.save();

      await RoomNumber.findByIdAndUpdate(roomNumber, {
        $set: { status: 0 },
      });

      return NextResponse.json({
        message: "room assigned successfully",
      });
    } else {
      return NextResponse.json({
        message: "room  already assigned ",
      });
    }
  } catch (error) {
    return NextResponse.json({
      message: "server error ",
    });
  }
}
