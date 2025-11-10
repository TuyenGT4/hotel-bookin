import { NextResponse } from "next/server";

import dbConnect from "@/utils/dbConnect";

import Team from "@/model/team";

export async function PUT(req, context) {
  await dbConnect();

  const { id } = await context?.params;

  if (!id) {
    return NextResponse.json({ error: "Team member id required" });
  }

  try {
    const body = await req.json();

    const updatingTeam = await Team.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (!updatingTeam) {
      return NextResponse.json({ error: "Team memer not found" });
    }

    return NextResponse.json(updatingTeam);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  await dbConnect();

  try {
    const deleteingTeam = await Team.findByIdAndDelete(context.params.id);


     console.log("deleteingTeam",deleteingTeam)
    return NextResponse.json(deleteingTeam);
  } catch (error) {
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}
