// styles/blogFormStyles.js
export const formContainerStyles = {
  maxWidth: 1200,
  mx: 'auto',
  p: { xs: 2, md: 4 },
  backgroundColor: '#000000',
  color: '#ffffff',
  minHeight: '100vh'
};

export const titleStyles = {
  mb: 3,
  textAlign: 'center',
  color: 'inherit'
};

export const textFieldStyles = {
  '& .MuiInputBase-input': {
    color: '#ffffff',
  },
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
  '& .MuiInputLabel-root': {
    color: '#8A12FC',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#8A12FC',
  }
};

export const selectStyles = {
  '& .MuiInputLabel-root': {
    color: '#8A12FC',
  },
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
  '& .MuiSelect-icon': {
    color: '#8A12FC',
  }
};

export const menuItemStyles = {
  color: '#000000',
  '&:hover': {
    backgroundColor: 'rgba(138, 18, 252, 0.1)',
  },
  '&.Mui-selected': {
    backgroundColor: 'rgba(138, 18, 252, 0.2)',
  }
};

export const submitButtonStyles = {
  px: 4,
  backgroundColor: '#8A12FC',
  color: '#ffffff',
  '&:hover': {
    backgroundColor: '#7A0BEC',
  },
  '&:disabled': {
    backgroundColor: 'rgba(138, 18, 252, 0.5)',
  }
};

export const iconStyles = {
  mr: 1,
  mt: 1,
  color: '#8A12FC'
};

export const categoryIconStyles = {
  mr: 1,
  color: '#8A12FC'
};

export const alertStyles = {
  mb: 3,
  '& .MuiAlert-icon': {
    color: '#8A12FC'
  }
};