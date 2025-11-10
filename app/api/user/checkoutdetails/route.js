import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Room from "@/model/room";
import { differenceInDays, parseISO } from "date-fns"; // Optional: use this for better date handling
import RoomType from "@/model/roomtype"; // Import the RoomType model

export async function POST(req, context) {
  await dbConnect();

  try {
    const body = await req.json();

    const { checkIn, checkOut, roomId, rooms, guests } = body;

    console.log("Parsed******** parameters:", {
      checkIn,
      checkOut,
      roomId,
      rooms,
      guests,
    });

    // Calculate number of nights
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.max(1, differenceInDays(checkOutDate, checkInDate));

    // Fetch the room details

    const room = await Room.findById(roomId).populate({
      path: "roomtype_id",
      model: RoomType,
      select: "name", // Only select the name field from RoomType
    });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const pricePerNight = room.price;
    const discountPercent = room.discount || 0;

    const subtotal = pricePerNight * nights * rooms;
    const discountAmount = (subtotal * discountPercent) / 100;
    const total = subtotal - discountAmount;

    const result = {
      pricePerNight,
      nights,
      subtotal,
      discountPercent,
      discountAmount,
      total,
      rooms,
      guests,
      roomTypeName: room.roomtype_id.name,
      room_id: room?._id,
      checkIn,
      checkOut,
      image: room?.image,
    };

    console.log("calculate result ", result);

    return NextResponse.json(result);
  } catch (err) {
    console.log("Error fetching room details or calculating prices:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch room pricing" },
      { status: 500 }
    );
  }
}
