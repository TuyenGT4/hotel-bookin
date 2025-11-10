import mongoose from "mongoose";

const bookareaSchema = new mongoose.Schema(
  {
    shortTitle: {
      type: String,
      default: "",
    },

    mainTital: {
      type: String,
      default: "",
    },

    shortDesc: {
      type: String,
      default: "",
    },

    linkUrl: {
      type: String,
      default: "",
    },

    photoUrl: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.BookArea ||
  mongoose.model("BookArea", bookareaSchema);
