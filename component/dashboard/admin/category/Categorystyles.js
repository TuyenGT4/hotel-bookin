export const styles = {
  container: {
    p: 3,
    maxWidth: "900px",
    mx: "auto"
  },
  searchInput: {
    input: { color: 'white' },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#8A12FC',
      },
      '&:hover fieldset': {
        borderColor: '#8A12FC',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#8A12FC',
      },
    },
  },
  inputLabel: {
    style: { color: '#8A12FC' }
  },
  addButton: {
    backgroundColor: "#8A12FC",
    '&:hover': {
      backgroundColor: "#6a0bc9",
    }
  },
  listItem: {
    borderColor: '#8A12FC',
    '&:hover': {
      backgroundColor: "rgba(138, 18, 252, 0.1)",
    }
  },
  searchIcon: {
    color: '#8A12FC'
  }
};