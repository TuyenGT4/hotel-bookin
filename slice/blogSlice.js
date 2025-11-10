import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { toast } from "react-toastify";

export const fetchBlogPosts = createAsyncThunk(
  "blogs/fetchBlogPosts",

  async () => {
    try {
      const response = await fetch(`${process.env.API}/admin/blog`);

      if (!response.ok) {
        throw new Error(`failed to fetch blog posts ${response.status}`);
      }

      const data = await response.json();

      return data;
    } catch (error) {
      toast.error(`error loading blog post ${error.message}`);

      throw error;
    }
  }
);

export const fetchBlogPostById = createAsyncThunk(
  "blogs/fetchBlogPostById",
  async (id) => {
    try {
      const response = await fetch(`${process.env.API}/admin/blog/${id}`);

      if (!response.ok) {
        throw new Error(`failed to  fetch blog post  ${response.status}`);
      }

      const data = await response.json();

      return data;
    } catch (error) {
      toast.error(`error loadin  blog post ${error.message}`);

      throw error;
    }
  }
);

export const createBlogPost = createAsyncThunk(
  "blogs/createBlogPost",

  async (blogData) => {
    try {
      const response = await fetch(`${process.env.API}/admin/blog`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(blogData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create blog post ${response.status}`);
      }

      const data = await response.json();

      toast.success("blog post created succesfully");
    } catch (error) {
      toast.error(`error creating blog post ${error.message}`);
      throw error;
    }
  }
);

export const updateBlogPost = createAsyncThunk(
  "blogs/updateBlogPost",

  async ({ id, ...blogData }) => {
    try {
      const response = await fetch(`${process.env.API}/admin/blog/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(blogData),
      });

      if (!response.ok) {
        throw new Error(`Failed to updated blog post ${response.status}`);
      }

      const data = await response.json();

      toast.success("blog  post  updated successfuuly");

      return data;
    } catch (error) {
      toast.error(` error updating blog post  ${error.message}`);

      throw error;
    }
  }
);

export const deleteBlogPost = createAsyncThunk(
  "blogs/deleteBlogPost",
  async (id) => {
    try {
      const response = await fetch(`${process.env.API}/admin/blog/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(` failed to  delete blog post ${response.status}`);
      }

      toast.error("Blog post deleted successfully");

      return id;
    } catch (error) {
      toast.error(`error deleting blog post  ${error.message}`);

      throw error;
    }
  }
);

const blogSlice = createSlice({
  name: "blogs",
  initialState: {
    list: [],
    currenPost: null,
    loading: false,
    error: null,
  },

  reducers: {
    clearCurrentPost: () => {
      state.currenPost = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchBlogPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })

      .addCase(fetchBlogPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchBlogPostById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchBlogPostById.fulfilled, (state, action) => {
        state.loading = false;
        state.currenPost = action.payload;
      })

      .addCase(fetchBlogPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(createBlogPost.pending, (state) => {
        state.loading = false;
        state.error = null;
      })

      .addCase(createBlogPost.fulfilled, (state, action) => {
        state.loading = true;

        state.list.unshift(action.payload);
      })

      .addCase(createBlogPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(updateBlogPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateBlogPost.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex(
          (post) => post._id === action.payload._id
        );
        if (index !== -1) {
          state.list[index] = action.payload;
        }

        if (state.currenPost._id === action.payload._id) {
          state.currenPost = action.payload;
        }
      })

      .addCase(updateBlogPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(deleteBlogPost.pending, (state) => {
        state.loading = false;
        state.error = null;
      })

      .addCase(deleteBlogPost.fulfilled, (state, action) => {
        state.loading = false;

        state.list = state.list.filter((post) => post?._id !== action.payload);

        if (state.currenPost?._id === action.payload) {
          state.currenPost = null;
        }
      })

      .addCase(deleteBlogPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearCurrentPost } = blogSlice.actions;

export default blogSlice.reducer;
