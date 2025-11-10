import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Chip,
  Stack,
  CircularProgress,
  Divider,
  Tooltip,
  IconButton,
} from "@mui/material";
import { runAi } from "@/ai/ai";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { styles, chipColors, animations } from "./AICategoryGeneratorstyles";

const AICategoryGenerator = ({ onSelectCategory, onAddCategory }) => {
  const [loading, setLoading] = useState(false);
  const [generatedCategories, setGeneratedCategories] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");

  const [generationCount, setGenerationCount] = useState(0);

  const [error, setError] = useState(null);

  const generateCategories = async () => {
    setLoading(true);
    setError(null);

    try {
      const prompt = `Generate 5 completely unique hotel room category names for batch ${
        generationCount + 1
      } that would appeal to modern travelers.
      
      Guidelines:
      1. Mix categories for different traveler types (business, families, couples, solo, luxury, budget)
      2. Vary by room size, view quality, and special amenities
      3. Use appealing modifiers (Premium, Deluxe, Executive, Cozy, Spacious)
      4. Include at least one innovative concept (like "Smart Rooms" or "Eco Suites")
      5. Never repeat categories from previous batches
      6. Ensure names are clear but distinctive
      
      Format requirements:
      - Comma-separated only
      - No numbering or bullets
      - Each category 2-4 words
      - Example format: "Panorama Luxury Suite, Urban Explorer Pod, Family Bunk Room"`;

      const response = await runAi(prompt);


       console.log("response", response)
      let categories = response
        .split(",")
        .map((cat) => cat.trim())
        .filter((cat) => cat.length > 0);

      if (categories.length !== 5) {
        throw new Error(`expected 5 categories, got ${categories.length}`);
      }


       console.log(" categories", categories)
      setGeneratedCategories(categories);

      setGenerationCount((prev) => prev + 1);
    } catch (error) {
      setError("Failed to genrated  categories .please try  again");
      setGeneratedCategories([]);
    } finally {
      setLoading(false);
    }
  };





 const  handleSelect=(category)=>{
setSelectedCategory(category)
onSelectCategory(category)
 }


 const  handleAdd=()=>{
 if(selectedCategory){
    onAddCategory(selectedCategory)
    setSelectedCategory("")
 }

 }


  const clearGenerated=()=>{
    setGeneratedCategories([])
    setSelectedCategory("")
  }



  return (
    <Box sx={styles.container}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="h6" sx={styles.header}>
            AI Category Generator
          </Typography>
          <Tooltip title="Generates fresh, unique categories each time">
            <ShuffleIcon
              fontSize="small"
              sx={{
                color: "#FD79A8",
                animation: loading ? "spin 2s linear infinite" : "none",
                ...animations.spin,
              }}
            />
          </Tooltip>
        </Box>
        {generatedCategories.length > 0 && (
          <IconButton
          onClick={clearGenerated}
            size="small"
            sx={styles.closeButton}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      <Button
        startIcon={!loading && <ShuffleIcon />}
        variant="contained"
        onClick={generateCategories}
        disabled={loading}
        fullWidth
        sx={styles.generateButton}
      >
        {loading ? (
          <CircularProgress size={24} sx={{ color: "#FFFFFF" }} />
        ) : (
          "Generate New Categories"
        )}
      </Button>

      {error && (
        <Box sx={styles.errorBox}>
          <Typography variant="body2" sx={styles.errorText}>
            <CloseIcon fontSize="small" />
            {error}
          </Typography>
        </Box>
      )}

      {generatedCategories.length > 0 && (
        <>
          <Divider sx={styles.divider} />

          <Typography variant="subtitle1" sx={styles.suggestionsTitle}>
            <span style={{ color: "#FD79A8" }}>✦</span> AI Suggestions (Select
            one):
          </Typography>

          <Stack direction="row" sx={styles.chipsContainer}>
            {generatedCategories.map((category, index) => (
              <Chip
                key={index}
                label={category}
            onClick={() => handleSelect(category)}
                variant={selectedCategory === category ? "filled" : "outlined"}
                sx={styles.chip(
                  chipColors[index % chipColors.length],
                  selectedCategory === category
                )}
              />
            ))}
          </Stack>

          <Box display="flex" justifyContent="flex-end">
            <Button
              startIcon={<AddIcon />}
              variant="contained"
           onClick={handleAdd}
              disabled={!selectedCategory}
              sx={styles.addButton}
            >
              Add to Categories
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default AICategoryGenerator;
