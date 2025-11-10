import { NextResponse } from "next/server";

import dbConnect from "@/utils/dbConnect";

import Room from "@/model/room";
import RoomType from "@/model/roomtype";

import RoomNumber from "@/model/roomnumber";

import Booking from "@/model/booking";

import BookingRoomList from "@/model/bookingroomlist";

import RoomBookedDate from "@/model/roomBookedDate";

export async function GET() {
  await dbConnect();

  try {
    // Fetch bookings and populate single room + roomtype
    const bookings = await Booking.find({}).populate({
      path: "rooms_id",
      populate: {
        path: "roomtype_id",
        model: "RoomType",
      },
    });

    const enrichedBookings = [];

    for (const booking of bookings) {
      const checkIn = new Date(booking.check_in);
      const checkOut = new Date(booking.check_out);

      // Generate date array
      const dt_array = [];
      for (
        let d = new Date(checkIn);
        d <= checkOut;
        d.setDate(d.getDate() + 1)
      ) {
        dt_array.push(new Date(d).toISOString().split("T")[0]);
      }

      // Get all booking IDs made during these dates
      const bookingIds = await RoomBookedDate.find({
        book_date: { $in: dt_array },
      }).distinct("booking_id");

      const room = booking.rooms_id;

      // Defensive check if room exists
      if (!room) {
        enrichedBookings.push({
          ...booking.toObject(),
          availableRooms: 0,
        });
        continue;
      }

      // Count total active room numbers
      const totalRoomNumbers = await RoomNumber.countDocuments({
        room_id: room._id,
        status: 1,
      });

      // Count booked ones
      const bookedCount = await BookingRoomList.countDocuments({
        booking_id: { $in: bookingIds },
        room_id: room._id,
      });

      const availableRoomCount = totalRoomNumbers - bookedCount;

      enrichedBookings.push({
        ...booking.toObject(),
        availableRooms: availableRoomCount,
      });
    }

    return NextResponse.json(enrichedBookings);
  } catch (err) {
    console.error(" Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}