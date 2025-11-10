// import { NextResponse } from "next/server";

// import dbConnect from "@/utils/dbConnect";

// import Room from "@/model/room";
// import RoomNumber from "@/model/roomnumber";
// import RoomBookedDate from "@/model/roomBookedDate";
// import BookingRoomList from "@/model/bookingroomlist";

// export async function GET(req, context) {
//   await dbConnect();

//   const { id } = await context.params;

//   const params = new URLSearchParams(id);
//   const check_in = params.get("checkIn");
//   const check_out = params.get("checkOut");
//   const guests = parseInt(params.get("guests") || "1");

//   try {
   
//     const sdate = new Date(check_in);
//     const edate = new Date(check_out);

//     const dt_array = [];
//     const current = new Date(sdate);
//     while (current < edate) {
//       dt_array.push(new Date(current).toISOString().split("T")[0]);
//       current.setDate(current.getDate() + 1);
//     }

    
//     const bookingDates = await RoomBookedDate.find({
//       book_date: { $in: dt_array },
//     }).distinct("booking_id");

//     // 2. Get all active rooms
//     const rooms = await Room.find({ status: 1 }).populate('roomtype_id');

//     const availableRooms = [];

//     // 3. Calculate availability for each room
//     for (const room of rooms) {
//       const roomNumbersCount = await RoomNumber.countDocuments({
//         room_id: room._id,
//         status: 1,
//       });

//       const bookedRooms = await BookingRoomList.find({
//         booking_id: { $in: bookingDates },
//         room_id: room._id,
//       });

//       const totalBooked = bookedRooms.length;
//       const availableRoom = roomNumbersCount - totalBooked;

   
//       if (availableRoom > 0 && guests <= parseInt(room?.total_adult)) {
//         availableRooms.push({
//           ...room.toObject(),
//           availableRoom,
//         });
//       }
//     }

//     console.log(" availableRoom ", availableRooms);

//     return NextResponse.json(availableRooms);


//   } catch (error) {
//     console.error("Room availability check error:", error);
//     return NextResponse.json({ message: "Server error" }, { status: 500 });
//   }
// }




import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Room from "@/model/room";
import RoomNumber from "@/model/roomnumber";
import RoomBookedDate from "@/model/roomBookedDate";
import BookingRoomList from "@/model/bookingroomlist";

export async function GET(req, context) {
  await dbConnect();
  console.log("✅ Database connected");

  const { id } = await context.params;
  console.log("🆔 Raw ID from params:", id);

  const params = new URLSearchParams(id);
  const check_in = params.get("checkIn");
  const check_out = params.get("checkOut");
  const guests = parseInt(params.get("guests") || "1");

  console.log("📅 Check-in:", check_in, "Check-out:", check_out, "Guests:", guests);

  try {
    const sdate = new Date(check_in);
    const edate = new Date(check_out);

    const dt_array = [];
    const current = new Date(sdate);
    while (current < edate) {
      dt_array.push(new Date(current).toISOString().split("T")[0]);
      current.setDate(current.getDate() + 1);
    }

    console.log("📆 Date range for booking:", dt_array);

    const bookingDates = await RoomBookedDate.find({
      book_date: { $in: dt_array },
    }).distinct("booking_id");

    console.log("📌 Conflicting booking IDs:", bookingDates);

    const rooms = await Room.find({ status: 1 }).populate('roomtype_id');
    console.log("🏨 Total active rooms fetched:", rooms.length);

    const availableRooms = [];

    for (const room of rooms) {
      const roomNumbersCount = await RoomNumber.countDocuments({
        room_id: room._id,
        status: 1,
      });

      const bookedRooms = await BookingRoomList.find({
        booking_id: { $in: bookingDates },
        room_id: room._id,
      });

      const totalBooked = bookedRooms.length;
      const availableRoom = roomNumbersCount - totalBooked;

      console.log(`➡️ Room: ${room.name || room._id}`);
      console.log("   ↪️ Total room numbers:", roomNumbersCount);
      console.log("   ↪️ Booked room numbers:", totalBooked);
      console.log("   ↪️ Available:", availableRoom);

      if (availableRoom > 0 && guests <= parseInt(room?.total_adult)) {
        availableRooms.push({
          ...room.toObject(),
          availableRoom,
        });
      }
    }

    //console.log("✅ Final Available Rooms:", availableRooms.length);

    return NextResponse.json(availableRooms);

  } catch (error) {
   // console.error("❌ Room availability check error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
