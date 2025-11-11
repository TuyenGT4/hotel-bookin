import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import i18n from "@/i18n";

// const { t } = useTranslation("slice/blogSlice");
const t = i18n.getFixedT(null, "component/slice/blogSlice");

// Fetch all blog posts
export const fetchBlogPosts = createAsyncThunk(
  "blogs/fetchBlogPosts",
  async () => {
    try {
      const response = await fetch(`${process.env.API}/admin/blog`);
      if (!response.ok) {
        throw new Error(
          t("fetch_failed", `Failed to fetch blog posts (${response.status})`)
        );
      }
      const data = await response.json();
      return data;
    } catch (error) {
      toast.error(
        t("error_loading_posts", `Error loading blog posts: ${error.message}`)
      );
      throw error;
    }
  }
);

// Fetch single blog post by ID
export const fetchBlogPostById = createAsyncThunk(
  "blogs/fetchBlogPostById",
  async (id) => {
    try {
      const response = await fetch(`${process.env.API}/admin/blog/${id}`);
      if (!response.ok) {
        throw new Error(
          t(
            "fetch_single_failed",
            `Failed to fetch blog post (${response.status})`
          )
        );
      }
      const data = await response.json();
      return data;
    } catch (error) {
      toast.error(
        t("error_loading_post", `Error loading blog post: ${error.message}`)
      );
      throw error;
    }
  }
);

// Create new blog post
export const createBlogPost = createAsyncThunk(
  "blogs/createBlogPost",
  async (blogData) => {
    try {
      const response = await fetch(`${process.env.API}/admin/blog`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blogData),
      });

      if (!response.ok) {
        throw new Error(
          t("create_failed", `Failed to create blog post (${response.status})`)
        );
      }

      const data = await response.json();
      toast.success(t("create_success", "Blog post created successfully"));
      return data;
    } catch (error) {
      toast.error(
        t("error_creating", `Error creating blog post: ${error.message}`)
      );
      throw error;
    }
  }
);

// Update existing blog post
export const updateBlogPost = createAsyncThunk(
  "blogs/updateBlogPost",
  async ({ id, ...blogData }) => {
    try {
      const response = await fetch(`${process.env.API}/admin/blog/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blogData),
      });

      if (!response.ok) {
        throw new Error(
          t("update_failed", `Failed to update blog post (${response.status})`)
        );
      }

      const data = await response.json();
      toast.success(t("update_success", "Blog post updated successfully"));
      return data;
    } catch (error) {
      toast.error(
        t("error_updating", `Error updating blog post: ${error.message}`)
      );
      throw error;
    }
  }
);

// Delete blog post
export const deleteBlogPost = createAsyncThunk(
  "blogs/deleteBlogPost",
  async (id) => {
    try {
      const response = await fetch(`${process.env.API}/admin/blog/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(
          t("delete_failed", `Failed to delete blog post (${response.status})`)
        );
      }

      toast.success(t("delete_success", "Blog post deleted successfully"));
      return id;
    } catch (error) {
      toast.error(
        t("error_deleting", `Error deleting blog post: ${error.message}`)
      );
      throw error;
    }
  }
);

// Redux slice
const blogSlice = createSlice({
  name: "blogs",
  initialState: {
    list: [],
    currenPost: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentPost: (state) => {
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
      .addCase(createBlogPost.fulfilled, (state, action) => {
        state.loading = false;
        state.list.unshift(action.payload);
      })
      .addCase(updateBlogPost.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex(
          (post) => post._id === action.payload._id
        );
        if (index !== -1) state.list[index] = action.payload;
        if (state.currenPost?._id === action.payload._id)
          state.currenPost = action.payload;
      })
      .addCase(deleteBlogPost.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((post) => post._id !== action.payload);
        if (state.currenPost?._id === action.payload) state.currenPost = null;
      });
  },
});

export const { clearCurrentPost } = blogSlice.actions;
export default blogSlice.reducer;
