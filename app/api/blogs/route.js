import { NextResponse } from "next/server";

import dbConnect from "@/utils/dbConnect";

import BlogPost from "@/model/blog";

export async function GET() {
  await dbConnect();

  try {
    const posts = await BlogPost.find({}).sort({ createdAt: -1 });

    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}
