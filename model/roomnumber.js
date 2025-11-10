import mongoose from "mongoose";

import RoomType from "./roomtype";

import Room from "./room";

const roomNumberSchema = new mongoose.Schema(
  {
    room_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    },
    roomtype_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RoomType",
    },

    room_no: {
      type: String,
      default: null,
    },

    status: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.RoomNumber ||
  mongoose.model("RoomNumber", roomNumberSchema);
