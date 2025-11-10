import mongoose from "mongoose";

import Room from "./room";

const facilitySchema = new mongoose.Schema(
  {
    room_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    },

    facility_name: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Facility ||
  mongoose.model("Facility", facilitySchema);
