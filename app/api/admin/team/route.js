import { NextResponse } from "next/server";

import dbConnect from "@/utils/dbConnect";

import Team from "@/model/team";

export async function GET() {
  await dbConnect();

  try {
    const team = await Team.find({});

    return NextResponse.json(team);
  } catch (error) {
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  await dbConnect();
  const body = await req.json();

  const { name, image, position } = body;

  
  try {
    const team = await Team.create({
      name,
      image,
      position,
    });

    console.log("team", team);

    return NextResponse.json(team);
  } catch (error) {

     console.log(error)
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}
