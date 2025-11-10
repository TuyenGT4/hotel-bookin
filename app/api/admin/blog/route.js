import { NextResponse } from "next/server";

import dbConnect from "@/utils/dbConnect";

import BlogPost from "@/model/blog";

import slugify from "slugify";

export async function GET() {
  await dbConnect();

  try {
    const posts = await BlogPost.find({}).sort({
      createdAt: -1,
    });

    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  await dbConnect();

  const body = await req.json();

  const { title, description, image, category } = body;

  console.log("body" , body)

  try {
    const post = await BlogPost.create({
      title,
      slug: slugify(title, { lower: true }),
      description,
      image,
      categories: category,
    });

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}
