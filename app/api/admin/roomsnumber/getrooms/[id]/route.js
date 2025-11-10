import dbConnect from "@/utils/dbConnect";

import Booking from "@/model/booking";

import BookingRoomList from "@/model/bookingroomlist";

import { NextResponse } from "next/server";

export async function GET(req, context) {
  const { id } = await context.params;

 console.log("id" , id)



  try {
    await dbConnect();

    const booking = await Booking.findById(id);

    if (!booking) {
      return NextResponse.json(
        {
          message: "Booking not found",
        },
        { status: 404 }
      );
    }

    const roomList = await BookingRoomList.find({ booking_id: id }).populate(
      "room_number_id"
    );

    console.log("roomlist", roomList);
    return NextResponse.json(roomList);
  } catch (error) {
    return NextResponse.json(
      {
        message: "server error",
        alertType: "error",
      },
      { status: 500 }
    );
  }
}
