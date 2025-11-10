import { NextResponse } from "next/server";

import dbConnect from "@/utils/dbConnect";

import Room from "@/model/room";
import RoomType from "@/model/roomtype";
import Facility from "@/model/facility";
import MultiImage from "@/model/multiImage";
import RoomNumber from "@/model/roomnumber";

export async function GET() {
  await dbConnect();

  try {
    const rooms = await Room.find({})
      .populate({
        path: "roomtype_id",
        model: RoomType,
        select: "name",
      })
      .lean();

    const roomIds = rooms.map((room) => room._id);

    const roomFacilities = await Facility.find({
      room_id: {
        $in: roomIds,
      },
    }).lean();

    const roomImages = await MultiImage.find({
      room_id: {
        $in: roomIds,
      },
    }).lean();

    const roomNumbers = await RoomNumber.find({
      room_id: {
        $in: roomIds,
      },
    }).lean();

    const facilitiesMap = roomFacilities.reduce((map, facility) => {
      if (!map[facility.room_id]) {
        map[facility.room_id] = [];
      }

      map[facility.room_id].push(facility.facility_name);
      return map;
    }, {});

    const imagesMap = roomImages.reduce((map, image) => {
      if (!map[image.room_id]) {
        map[image.room_id] = [];
      }

      map[image.room_id].push(image.multi_image);
      return map;
    }, {});

    const roomNumbersMap = roomNumbers.reduce((map, roomNumber) => {
      if (!map[roomNumber.room_id]) {
        map[roomNumber.room_id] = [];
      }

      map[roomNumber.room_id].push(roomNumber);
      return map;
    }, {});

    const responseData = rooms.map((room) => ({
      ...room,
      facilities: facilitiesMap[room._id] || [],
      gallery_images: imagesMap[room._id] || [],
      room_numbers: roomNumbersMap[room._id] || [],
    }));

    return NextResponse.json(responseData);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch rooms" },
      { status: 500 }
    );
  }
}
