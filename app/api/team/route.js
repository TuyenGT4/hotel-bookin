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
