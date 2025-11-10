import { NextResponse } from "next/server";

import dbConnect from "@/utils/dbConnect";

import User from "@/model/user";

import bcrypt from "bcrypt";

import { getServerSession } from "next-auth/next";

import { authOptions } from "@/utils/authOptions";

export async function POST(req) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const {
    name,
    email,
    password,
    profileImage,
    mobileNumber,
    address,
    country,
  } = await req.json();

  try {
    if (!session?.user?._id) {
      return NextResponse.json({ err: "not authenticated" }, { status: 401 });
    }

    let updatedUser = await User.findByIdAndUpdate(
      session?.user?._id,

      {
        name,
        password: await bcrypt.hash(password, 10),
        image: profileImage,
        mobileNumber,
        address,
        country,
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ err: "user not found" }, { status: 404 });
    }

    return NextResponse.json(
      { msg: "user updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  await dbConnect();

  const session = await getServerSession(authOptions);

  try {
    if (!session?.user?._id) {
      return NextResponse.json({ err: "Not authenticated" }, { status: 401 });
    }

    const user = await User.findOne({ _id: session?.user?._id });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}
