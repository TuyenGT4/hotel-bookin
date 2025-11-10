import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';


// Async thunks for API calls with error handling and notifications
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async () => {
    try {
      const response = await fetch(`${process.env.API}/admin/categories`);
      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.status}`);
      }
      const data = await response.json();
     // toast.success('Categories loaded successfully!');
      return data;
    } catch (error) {
     // toast.error(`Error loading categories: ${error.message}`);
      throw error;
    }
  }
);

export const addCategory = createAsyncThunk(
  'categories/addCategory',
  async (newCategory) => {
    try {
      const response = await fetch(`${process.env.API}/admin/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategory }),
      });
      if (!response.ok) {
        throw new Error(`Failed to add category: ${response.status}`);
      }
      const data = await response.json();
      toast.success('Category added successfully!');
      return data;
    } catch (error) {
      toast.error(`Error adding category: ${error.message}`);
      throw error;
    }
  }
);

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, name }) => {
    try {
      const response = await fetch(`${process.env.API}/admin/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name }),
      });
      if (!response.ok) {
        throw new Error(`Failed to update category: ${response.status}`);
      }
      const data = await response.json();
      toast.success('Category updated successfully!');
      return data;
    } catch (error) {
      toast.error(`Error updating category: ${error.message}`);
      throw error;
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id) => {
    try {
      const response = await fetch(`${process.env.API}/admin/categories/${id}`, { 
        method: 'DELETE' 
      });
      if (!response.ok) {
        throw new Error(`Failed to delete category: ${response.status}`);
      }
      toast.success('Category deleted successfully!');
      return id;
    } catch (error) {
      toast.error(`Error deleting category: ${error.message}`);
      throw error;
    }
  }
);

const categorySlice = createSlice({
  name: 'categories',
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

      .addCase(addCategory.pending, (state) => {
        state.error = null;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.error = action.error.message;
      })

      .addCase(updateCategory.pending, (state) => {
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.list.findIndex((cat) => cat._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.error = action.error.message;
      })

      .addCase(deleteCategory.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.list = state.list.filter((cat) => cat._id !== action.payload);
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default categorySlice.reducer;