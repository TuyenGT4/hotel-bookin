import { NextResponse } from "next/server";

import dbConnect from "@/utils/dbConnect";

import BlogPost from "@/model/blog";

import slugify from "slugify";

export async function PUT(req, context) {
  await dbConnect();

  const { id } = await context.params;

  const body = await req.json();

  try {
    const { _id, slug, ...updateBody } = body;

    if (updateBody.title) {
      updateBody.slug = slugify(updateBody.title, { lower: true });
    }

    const updatedPost = await BlogPost.findByIdAndUpdate(id, updateBody, {
      new: true,
    });

    if (!updatedPost) {
      return NextResponse.json(
        { err: "Blog post  not  found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedPost);
  } catch (error) {
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  await dbConnect();

  const { id } =await  context.params;

  try {
    const deletedPost = await BlogPost.findByIdAndDelete(id);

    if (!deletedPost) {
      return NextResponse.json({ err: "blof post not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "blog post  deleted  successfully",
      deletedPost,
    });
  } catch (error) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
