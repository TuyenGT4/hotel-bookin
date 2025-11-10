import { NextResponse } from "next/server";

import dbConnect from "@/utils/dbConnect";

import bcrypt from "bcrypt";

import User from "@/model/user";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";

export async function PUT(req) {
  await dbConnect();

  const body = await req.json();
  const { oldPassword, newPassword } = body;
  console.log("oldPassword, newPassword ");
  console.log({ oldPassword, newPassword });

  const session = await getServerSession(authOptions);

  try {
    let user = await User.findOne({ _id: session.user._id });
    if (!user) {
      return NextResponse.json({ err: "user  not  found" }, { status: 404 });
    }

    const passwordMatch = await bcrypt.compare(oldPassword, user.password);

    if (!passwordMatch) {
      return NextResponse.json(
        {
          err: "Incorrect old  password",
        },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    return NextResponse.json(
      { msg: "password  changed successfully" },

      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}
