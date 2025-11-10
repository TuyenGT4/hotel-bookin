import mongoose from "mongoose";
import Booking from "./booking";
const roomBookedDateSchema = new mongoose.Schema(
  {
    booking_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },

    room_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    },
    book_date: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.RoomBookedDate ||
  mongoose.model("RoomBookedDate", roomBookedDateSchema);
