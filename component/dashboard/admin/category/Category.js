import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  InputAdornment,
} from "@mui/material";
import { Delete, Edit, Search } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "@/slice/categorySlice";
import { styles } from "./Categorystyles";
import AICategoryGenerator from "./AICategoryGenerator";
const CategoryManager = () => {
  const dispatch = useDispatch();

  const { list: categories, loading } = useSelector(
    (state) => state.categories
  );

  const [filteredCategories, setFilteredCategories] = useState([]);

  const [newCategory, setNewCategory] = useState("");

  const [searchTerm, setSerchTerm] = useState("");

  const [editing, setEditing] = useState({
    id: null,
    name: "",
  });

  useEffect(() => {
    setFilteredCategories(categories);
  }, [categories]);
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleSaveCategory = () => {
    if (editing.id) {
      dispatch(
        updateCategory({
          id: editing.id,
          name: editing.name,
        })
      );
    } else {
      dispatch(addCategory(newCategory));

      setEditing({ id: null, name: "" });

      setNewCategory("");
    }
  };

  const handleSearch = (term) => {
    setSerchTerm(term);

    if (term === "") {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter((cat) =>
        cat.name.toLowerCase().includes(term.toLowerCase())
      );

      setFilteredCategories(filtered);
    }
  };

  const handleDeleteCategory = (id) => {
    dispatch(deleteCategory(id));
  };

  const handleAICategorySelect = (category) => {
    setNewCategory(category);

    setEditing({ id: null, name: "" });
  };

  const handleAIAddCategory = (category) => {
    dispatch(category);

    setNewCategory("");
  };

  return (
    <Box sx={styles.container}>
      <Typography variant="h4" gutterBottom>
        Category
      </Typography>

      <Box display="flex" gap={2} mb={3}>
        <TextField
          label="Search Categories"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={styles.searchIcon} />
              </InputAdornment>
            ),
          }}
          InputLabelProps={styles.inputLabel}
          sx={styles.searchInput}
        />
      </Box>

      <Box display="flex" gap={2} mb={3}>
        <TextField
          label={editing.id ? "Edit Category" : "Add Category"}
          variant="outlined"
          value={editing.id ? editing.name : newCategory}
          onChange={(e) =>
            editing.id
              ? setEditing({ ...editing, name: e.target.value })
              : setNewCategory(e.target.value)
          }
          fullWidth
          InputLabelProps={styles.inputLabel}
          sx={styles.searchInput}
        />
        <Button
          variant="contained"
          disabled={!newCategory.trim() && !editing.name.trim()}
          sx={styles.addButton}
          onClick={handleSaveCategory}
        >
          {editing.id ? "Update" : "Add"}
        </Button>
      </Box>

      <AICategoryGenerator
        onSelectCategory={handleAICategorySelect}
        onAddCategory={handleAIAddCategory}
      />

      <List>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : filteredCategories?.length > 0 ? (
          filteredCategories.map((category) => (
            <ListItem key={category?._id} divider sx={styles.listItem}>
              <ListItemText primary={category?.name} />
              <ListItemSecondaryAction>
                <IconButton edge="end">
                  <Edit
                    onClick={() =>
                      setEditing({ id: category?._id, name: category?.name })
                    }
                    style={{ color: "green" }}
                  />
                </IconButton>
                <IconButton edge="end" color="error">
                  <Delete onClick={() => handleDeleteCategory(category?._id)} />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))
        ) : (
          <Typography variant="body1" sx={{ textAlign: "center", mt: 2 }}>
            {searchTerm
              ? "No categories match your search"
              : "You don't have any hotel categories yet. Please create one."}
          </Typography>
        )}
      </List>
    </Box>
  );
};

export default CategoryManager;
