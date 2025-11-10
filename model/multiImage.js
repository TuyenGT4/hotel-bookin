import mongoose from "mongoose";

import Room from "./room";

const multiImageSchema = new mongoose.Schema(
  {
    room_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    },

    multi_image: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.MultiImage ||
  mongoose.model("MultiImage", multiImageSchema);
