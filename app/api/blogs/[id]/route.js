import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import BlogPost from "@/model/blog";
import Category from "@/model/category";

export async function GET(req, context) {
  await dbConnect();
  const { id } = await context.params;

  try {
    // Get the main blog post with category populated
    const post = await BlogPost.findOne({ slug: id })
      .populate('categories') // Populate the category
      .lean();

    if (!post) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    // Get similar posts (from the same category)
    let similarPosts = [];
    if (post.categories) {
      similarPosts = await BlogPost.find({
        _id: { $ne: post._id }, // Exclude current post
        categories: post.categories._id // Match the same category
      })
      .limit(4)
      .select('title slug image views likes createdAt') // Only select needed fields
      .lean();
    }

    // Get all categories with counts
    const categories = await Category.aggregate([
      {
        $lookup: {
          from: "blogposts",
          localField: "_id",
          foreignField: "categories",
          as: "posts"
        }
      },
      {
        $project: {
          name: 1,
          count: { $size: "$posts" }
        }
      },
      { $sort: { count: -1 } }
    ]);

    return NextResponse.json({
      post: {
        ...post,
        // Transform single category to array for frontend consistency
        categories: post.categories ? [post.categories] : []
      },
      similarPosts,
      categories
    }, { status: 200 });

  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}