import mongoose from "mongoose";

import Room from "./room";

import User from "./user";

const bookingSchema = new mongoose.Schema(
  {
    rooms_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    check_in: {
      type: String,
      default: null,
    },

    check_out: {
      type: String,
      default: null,
    },

    person: {
      type: String,
      default: null,
    },
    number_of_rooms: {
      type: String,
      default: null,
    },

    total_night: {
      type: Number,
      default: 0,
    },
    actual_price: {
      type: Number,
      default: 0,
    },

    subtotal: {
      type: Number,
      default: 0,
    },

    discount: {
      type: Number,
      default: 0,
    },

    total_price: {
      type: Number,
      default: 0,
    },
    payment_method: {
      type: String,
      default: null,
    },
    transaction_id: {
      type: String,
      default: null,
    },

    payment_status: {
      type: String,
      default: null,
    },

    name: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      default: null,
    },
    country: {
      type: String,
      default: null,
    },

    state: {
      type: String,
      default: null,
    },
    zip_code: {
      type: String,
      default: null,
    },

    address: {
      type: String,
      default: null,
    },

    code: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Booking ||
  mongoose.model("Booking", bookingSchema);
