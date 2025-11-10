"use client";

import { configureStore } from "@reduxjs/toolkit";

import categoryReducer from "@/slice/categorySlice";
import blogReducer from "@/slice/blogSlice";
export const store = configureStore({
  reducer: {
    categories: categoryReducer,

    blogs: blogReducer,
  },
});
