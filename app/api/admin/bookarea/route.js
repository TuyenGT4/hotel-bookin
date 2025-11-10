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

export async function PUT(req) {
  await dbConnect();

  try {
    const body = await req.json();

    const { shortTitle, mainTitle, shortDesc, linkUrl, photoUrl } = body;

    let promo = await BookArea.findOne();

    if (promo) {
      promo.shortTitle = shortTitle,
        promo.mainTitle = mainTitle,
        promo.shortDesc = shortDesc,
        promo.linkUrl = linkUrl,
        promo.photoUrl = photoUrl,

      await promo.save();
    } else {
      promo = await BookArea.create({
        shortTitle,
        mainTitle,
        shortDesc,
        linkUrl,
        photoUrl,
      });
    }

    return NextResponse.json({ message: "Promo updated successfullu", promo });
  } catch (error) {
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}
