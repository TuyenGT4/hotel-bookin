import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import i18n from "@/i18n";

const t = i18n.getFixedT(null, "component/slice/categorySlice");

// Fetch categories
export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async () => {
    try {
      const response = await fetch(`${process.env.API}/admin/categories`);
      if (!response.ok) {
        throw new Error(t("fetch_failed", { status: response.status }));
      }
      const data = await response.json();
      // toast.success(t('fetch_success'));
      return data;
    } catch (error) {
      // toast.error(t('fetch_error', { message: error.message }));
      throw error;
    }
  }
);

// Add category
export const addCategory = createAsyncThunk(
  "categories/addCategory",
  async (newCategory) => {
    try {
      const response = await fetch(`${process.env.API}/admin/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategory }),
      });
      if (!response.ok) {
        throw new Error(t("add_failed", { status: response.status }));
      }
      const data = await response.json();
      toast.success(t("add_success", "Category added successfully!"));
      return data;
    } catch (error) {
      toast.error(t("add_error", { message: error.message }));
      throw error;
    }
  }
);

// Update category
export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async ({ id, name }) => {
    try {
      const response = await fetch(
        `${process.env.API}/admin/categories/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, name }),
        }
      );
      if (!response.ok) {
        throw new Error(t("update_failed", { status: response.status }));
      }
      const data = await response.json();
      toast.success(t("update_success", "Category updated successfully!"));
      return data;
    } catch (error) {
      toast.error(t("update_error", { message: error.message }));
      throw error;
    }
  }
);

// Delete category
export const deleteCategory = createAsyncThunk(
  "categories/deleteCategory",
  async (id) => {
    try {
      const response = await fetch(
        `${process.env.API}/admin/categories/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error(t("delete_failed", { status: response.status }));
      }
      toast.success(t("delete_success", "Category deleted successfully!"));
      return id;
    } catch (error) {
      toast.error(t("delete_error", { message: error.message }));
      throw error;
    }
  }
);

const categorySlice = createSlice({
  name: "categories",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.list.findIndex(
          (cat) => cat._id === action.payload._id
        );
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.list = state.list.filter((cat) => cat._id !== action.payload);
      });
  },
});

export default categorySlice.reducer;
