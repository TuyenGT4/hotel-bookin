import mongoose from "mongoose";

const roomtypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.RoomType ||
  mongoose.model("RoomType", roomtypeSchema);
