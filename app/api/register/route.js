import { NextResponse } from "next/server";

import dbConnect from "@/utils/dbConnect";

import User from "@/model/user";

import bcrypt from "bcrypt";

export async function POST(req) {
  await dbConnect();

  const body = await req.json();

  const { name, phone, email, password } = body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { err: "Email  already  in use" },
        { status: 500 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await new User({
      name,
      email,
      password: hashedPassword,
      mobileNumber: phone,
    }).save();

    console.log("user", user);

    return NextResponse.json({ msg: "user registred successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        err: error.message,
      },
      { status: 500 }
    );
  }
}
