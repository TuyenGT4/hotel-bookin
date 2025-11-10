import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Room from "@/model/room";
import { differenceInDays } from "date-fns"; // Optional: use this for better date handling

export async function GET(req, context) {
  await dbConnect();

  try {
    const { id } = await context.params;

    // Parse the parameters from the id string
    const params = new URLSearchParams(id);
    const checkIn = params.get("checkIn");
    const checkOut = params.get("checkOut");
    const roomId = params.get("roomId");
    const rooms = parseInt(params.get("rooms") || 1); // Default to 1 room
    const guests = parseInt(params.get("guests") || 1); // Default to 1 guest

    console.log("Parsed parameters:", {
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
    const room = await Room.findById(roomId);

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const pricePerNight = room.price;
    const discountPercent = room.discount || 0;

    const subtotal = pricePerNight * nights * rooms;
    const discountAmount = (subtotal * discountPercent) / 100;
    const total = subtotal - discountAmount;

    const result = {
     
      subtotal,
      discountPercent,
      discountAmount,
      total,
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

