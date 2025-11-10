import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import {
  CircularProgress,
  Alert,
  Box,
  Chip,
  Typography,
  Grid,
} from "@mui/material";
import { Edit, Delete, Favorite, Visibility } from "@mui/icons-material";

import { fetchBlogPosts, deleteBlogPost } from "@/slice/blogSlice";
import {
  StyledContainer,
  StyledCard,
  StyledCardMedia,
  StyledCardContent,
  StyledTitle,
  StyledChipContainer,
  StyledActionBox,
  StyledReadMore,
  StyledIconButton,
} from "./BlogStyles";
import EditBlogModal from './EditBlogModal';

const BlogPostsList = () => {
  const { list: blogs, loading } = useSelector((state) => state.blogs);

  const dispatch = useDispatch();

  const [error, setError] = useState(null);

  const [editModalOpen, setEditModalOpen] = useState(false);

  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    dispatch(fetchBlogPosts());
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("are you sure  you want  to delete  this post ?")) {
      try {
        await dispatch(deleteBlogPost(id)).unwrap();
      } catch (error) {
        setError(error.message || "failed to delete post");
      }
    }
  };

  const handleEditClick = (post) => {
    setSelectedPost(post);

    setEditModalOpen(true);
       dispatch(fetchBlogPosts());
  };

  const handleCloseModal = () => {
    setEditModalOpen(false);
    setSelectedPost(null);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <StyledContainer maxWidth="md">
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </StyledContainer>
    );
  }

  return (
    <>
      <StyledContainer maxWidth="lg">
        <Grid container spacing={3}>
          {blogs.map((post) => (
            <Grid item xs={12} sm={6} md={4} key={post._id}>
              <StyledCard>
                <Link href={`/blog/${post.slug}`} passHref>
                  <StyledCardMedia
                    component="img"
                    image={post.image}
                    alt={post.title}
                  />
                </Link>

                <StyledCardContent>
                  <Link href="#" passHref>
                    <StyledTitle gutterBottom variant="h5" component="div">
                      {post.title}
                    </StyledTitle>
                  </Link>

                  <Typography variant="body2" color="text.secondary">
                    {post.description.length > 100
                      ? `${post.description.substring(0, 100)}...`
                      : post.description}
                  </Typography>

                  <StyledActionBox>
                    <Link href="#" passHref>
                      <StyledReadMore component="div" color="primary">
                        Read More
                      </StyledReadMore>
                    </Link>

                    <Box>
                      <StyledIconButton
                        aria-label="edit"
                        onClick={() => handleEditClick(post)}
                        color="primary"
                      >
                        <Edit />
                      </StyledIconButton>
                      <StyledIconButton
                        aria-label="delete"
                        onClick={() => handleDelete(post._id)}
                        color="error"
                      >
                        <Delete />
                      </StyledIconButton>
                    </Box>
                  </StyledActionBox>
                </StyledCardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </StyledContainer>

      <EditBlogModal
        open={editModalOpen}
        onClose={handleCloseModal}
        post={selectedPost}
      />
    </>
  );
};

export default BlogPostsList;
