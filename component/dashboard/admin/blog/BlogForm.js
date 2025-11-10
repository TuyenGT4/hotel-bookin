// components/BlogForm.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Alert,
  Avatar,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Description,
  Title,
  Category,
  AddPhotoAlternate,
  AutoFixHigh,
} from "@mui/icons-material";
import {
  formContainerStyles,
  titleStyles,
  textFieldStyles,
  selectStyles,
  menuItemStyles,
  submitButtonStyles,
  iconStyles,
  categoryIconStyles,
  alertStyles,
} from "./blogFormStyles";

import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "@/slice/categorySlice";
import { createBlogPost } from "@/slice/blogSlice";
import { runAi } from "@/ai/ai";

const BlogForm = () => {
  const dispatch = useDispatch();

  const { list: categories, loading: categoriesLoading } = useSelector(
    (state) => state.categories
  );

  const {
    loading,
    blogLoading,
    error: blogError,
  } = useSelector((state) => state.blogs);

  const [formData, setFormDate] = useState({
    title: "",
    description: "",
    category: "",
    image: "",
  });

  const [imagePreview, setImagePreview] = useState("");

  const [imageFile, setImageFile] = useState(null);

  const [localError, setLocalError] = useState("");

  const [localSuccess, setLocalSuccess] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormDate((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const generateAIContent = async (type) => {
    if (!formData.category) {
      setLocalError("please select a category firt to generated  content");
      return;
    }

    setIsGenerating(true);
    setLocalError("");

    try {
      const selectedCategory = categories.find(
        (cat) => cat._id === formData.category
      );

      const categoryName = selectedCategory?.name || "";

      const categoryDescription = selectedCategory.description || "";

      let prompt = "";

      if (type === "title") {
        prompt = `Generate 3 compelling blog post title options about "${categoryName}" with these specifications:
      - Each title must be 5-9 words exactly
      - SEO-optimized with primary keyword "${categoryName}"
      - Include power words (Ultimate, Essential, Proven, etc.)
      - Title case formatting
      - Spark curiosity while being clear
      - Avoid clickbait or misleading phrases
      
      Context: ${categoryDescription || "No additional context provided"}
      
      Return ONLY the 3 titles as a numbered list, nothing else.`;
      } else {
        prompt = `Write a detailed blog post description about "${categoryName}" with these requirements:
      - Exactly 300-600 words (9 concise paragraphs)
      - First paragraph: Hook and thesis statement
      - Second paragraph: 3-5 key benefits/features with examples
      - Third paragraph: Conclusion with call-to-action
      - Include secondary keywords: "${categoryName} tips", "${categoryName} guide"
      - Maintain a ${formData.tone || "professional"} tone
      - End with a thought-provoking question
      
      Category context: ${categoryDescription || "General category"}
      Target audience: ${formData.audience || "general readers"}
      
      Return ONLY the description content, no introductory text.`;
      }

      const aiResponse = await runAi(prompt);

      const processedResponse =
        type === "title"
          ? aiResponse
              .split("\n")[0]
              .replace(/^\d+\.\s*/, "")
              .trim()
          : aiResponse;

      setFormDate((prev) => ({
        ...prev,
        [type]: processedResponse,
      }));
    } catch (error) {
      setLocalError(
        `failed to genrated ${type} , ${
          error.message || "please try  again later"
        }`
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const uploadImageToCloudinary = async (imageFile) => {
    const formData = new FormData();

    formData.append("file", imageFile);
    formData.append("upload_preset", "ml_default");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }
      console.log("imag  response", response);
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.log("error uploading image", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLocalError();
    setLocalSuccess();

    console.log(formData);

    if (!formData.title || !formData.description || !formData.category) {
      setLocalError("please  fill in all required fiedl");
      return;
    }

    try {
      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadImageToCloudinary(imageFile);
      }

      const blogPostData = {
        ...formData,
        image: imageUrl,
      };

      await dispatch(createBlogPost(blogPostData)).unwrap();

      setLocalError(true);
      setFormDate({
        title: "",
        description: "",
        category: "",
        image: "",
      });

      setImagePreview("");
      setImageFile(null);
       setLocalError("")
    } catch (error) {
      setLocalError(error.message || "Failed to create blog post");
    }
  };

  return (
    <Box sx={formContainerStyles}>
      <Typography variant="h4" component="h1" gutterBottom sx={titleStyles}>
        New Blog Post
      </Typography>

      {(localError || blogError) && (
        <Alert severity="error" sx={alertStyles}>
          {localError || blogError}
        </Alert>
      )}

      {localSuccess && (
        <Alert severity="success" sx={alertStyles}>
          Blog post submitted successfully!
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        {/* Image Upload Section */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="blog-image-upload"
            type="file"
            onChange={handleImageChange}
          />
          <label htmlFor="blog-image-upload">
            <IconButton component="span">
              {imagePreview ? (
                <Avatar
                  src={imagePreview}
                  sx={{ width: 1000, height: 400 }}
                  variant="rounded"
                />
              ) : (
                <Box
                  sx={{
                    width: 150,
                    height: 150,
                    border: "2px dashed #8A12FC",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 1,
                  }}
                >
                  <AddPhotoAlternate sx={{ fontSize: 40, color: "#8A12FC" }} />
                </Box>
              )}
            </IconButton>
          </label>
        </Box>

        <Box sx={{ display: "flex", alignItems: "flex-start", mb: 3 }}>
          <Title sx={iconStyles} />
          <Box sx={{ flex: 1, position: "relative" }}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              variant="outlined"
              size={isSmallScreen ? "small" : "medium"}
              disabled={isLoading}
              sx={textFieldStyles}
            />
            <Tooltip title="Generate title with AI">
              <IconButton
                onClick={() => generateAIContent("title")}
                disabled={isGenerating || isLoading}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                {isGenerating ? (
                  <CircularProgress size={24} />
                ) : (
                  <AutoFixHigh
                    sx={{
                      color: "yellow",
                    }}
                  />
                )}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "flex-start", mb: 3 }}>
          <Description sx={iconStyles} />
          <Box sx={{ flex: 1, position: "relative" }}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              multiline
              rows={isSmallScreen ? 4 : 10}
              variant="outlined"
              disabled={isLoading}
              sx={textFieldStyles}
            />
            <Tooltip title="Generate description with AI">
              <IconButton
                onClick={() => generateAIContent("description")}
                disabled={isGenerating || isLoading}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: isSmallScreen ? 8 : 16,
                }}
              >
                {isGenerating ? (
                  <CircularProgress size={24} />
                ) : (
                  <AutoFixHigh
                    sx={{
                      color: "yellow",
                    }}
                  />
                )}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <Category sx={categoryIconStyles} />
          <FormControl
            fullWidth
            required
            disabled={isLoading || categories.length === 0}
            sx={selectStyles}
          >
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              id="category"
              name="category"
              value={formData.category}
              label="Category"
              onChange={handleChange}
              size={isSmallScreen ? "small" : "medium"}
              sx={{
                color: "#ffffff",
                "& .MuiSelect-select": {
                  display: "flex",
                  alignItems: "center",
                },
              }}
            >
              {categories.map((cat) => (
                <MenuItem
                  key={cat._id || cat}
                  value={cat._id || cat}
                  sx={menuItemStyles}
                >
                  {cat.name || cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            fullWidth
            type="submit"
            variant="contained"
            size={isSmallScreen ? "medium" : "large"}
            sx={submitButtonStyles}
            disabled={isLoading || isGenerating}
            startIcon={
              isLoading ? <CircularProgress size={20} color="inherit" /> : null
            }
          >
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default BlogForm;
