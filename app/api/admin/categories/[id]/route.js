import { NextResponse } from "next/server";

import dbConnect from "@/utils/dbConnect";

import Category from "@/model/category";

export async function PUT(req, context) {
  await dbConnect();

  const body = await req.json();

  const { id } = await context?.params;

  try {
    const { _id, ...updateBody } = body;

    const updatingCategory = await Category.findByIdAndUpdate(
      id,

      updateBody,
      { new: true }
    );

    return NextResponse.json(updatingCategory);
  } catch (error) {
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  await dbConnect();

  const { id } = await context?.params;

  try {
    const deletingCategory = await Category.findByIdAndDelete(id);

    return NextResponse.json(deletingCategory);
  } catch (error) {
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}
