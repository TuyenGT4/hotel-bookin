import { NextResponse } from "next/server";

import dbConnect from "@/utils/dbConnect";

import Booking from "@/model/booking";

import RoomBookedDate from "@/model/roomBookedDate";

import BookingRoomList from "@/model/bookingroomlist";

import { eachDayOfInterval, subDays } from "date-fns";

export async function PUT(req, context) {
  await dbConnect();

  const { id } = await context?.params;

  try {
    const body = await req.json();

    if (
      !body.payment_status &&
      !body.status &&
      !body.check_in &&
      !body.check_out
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "at  least  one field must be provied for updated",
        },
        { status: 400 }
      );
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      );
    }

    if (body.payment_status !== undefined) {
      booking.payment_status = body.payment_status;
    }

    if (body.status !== undefined) {
      booking.status = body.status;
    }

    if (body.check_in || body.check_out) {
      const newCheckIn = body.check_in
        ? new Date(body.check_in)
        : booking.check_in;
      const newCheckOut = body.check_out
        ? new Date(body.check_out)
        : booking.check_out;

      const rooms_id = body.rooms_id || booking.rooms_id._id;

      booking.check_in = newCheckIn;
      booking.check_out = newCheckOut;
      booking.rooms_id = rooms_id;

      await BookingRoomList.deleteMany({ booking_id: id });

      await RoomBookedDate.deleteMany({ booking_id: id });

      const checkOutDateMinusOne = subDays(newCheckOut - 1);

      const period = eachDayOfInterval({
        start: newCheckIn,
        end: checkOutDateMinusOne,
      });

      const newDates = period.map((date) => ({
        booking_id: booking._id,
        room_id: rooms_id,
        book_date: date,
      }));

      await RoomBookedDate.insertMany(newDates);
    }
    await booking.save();

    return NextResponse.json({
      success: true,
      date: booking,
      message: "Booking Updated successfully",
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
