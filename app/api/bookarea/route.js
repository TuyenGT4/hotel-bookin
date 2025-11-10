import { NextResponse } from "next/server";

import dbConnect from "@/utils/dbConnect";

import BookArea from "@/model/bookarea";

export async function GET(req) {
  await dbConnect();
  try {
    let promo = await BookArea.findOne();

    if (!promo) {
      promo = {
        shortTitle: "",
        mainTitle: "",
        shortDesc: "",
        linkUrl: "",

        photoUrl: "",
      };
    }

    return NextResponse.json(promo);
  } catch (error) {
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}
