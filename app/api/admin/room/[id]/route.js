import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Room from "@/model/room";
import Facility from "@/model/facility";

import MultiImage from "@/model/multiImage";
import RoomNumber from "@/model/roomnumber";

export async function PUT(req, context) {
  await dbConnect();

  const { id } = await context.params;



   console.log("******id", id)

  
  if (!id) {
    return NextResponse.json(
      { error: "Room ID is required." },
      { status: 400 }
    );
  }

  const body = await req.json();
  console.log("Received update data:", body);

  try {
    const facilities = body.facilities || [];
    const galleryImages = body.gallery_images || [];
    delete body.facilities;
    delete body.gallery_images;

    const updateData = {};
    for (const key in body) {
      if (body[key] !== null && body[key] !== undefined && body[key] !== "") {
        updateData[key] = body[key];
      }
    }

    console.log("Filtered update data:", updateData);

    const updatingRoom = await Room.findByIdAndUpdate(
      id,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatingRoom) {
      return NextResponse.json({ error: "Room not found." }, { status: 404 });
    }

    if (facilities.length > 0) {
      await Facility.deleteMany({ room_id: id });

      const facilityPromises = facilities.map((facilityName) =>
        Facility.create({
          room_id: id,
          facility_name: facilityName,
        })
      );
      await Promise.all(facilityPromises);
    } else {
      await Facility.deleteMany({ room_id: id });
    }

    if (galleryImages.length > 0) {
      await MultiImage.deleteMany({ room_id: id });

      const imagePromises = galleryImages.map((imageUrl) =>
        MultiImage.create({
          room_id: id,
          multi_image: imageUrl,
        })
      );
      await Promise.all(imagePromises);
    } else {
      await MultiImage.deleteMany({ room_id: id });
    }

    return NextResponse.json({ success: "successfully updated" });
  } catch (err) {
    console.error("Error updating Room:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
