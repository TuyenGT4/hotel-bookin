// components/BookingComponentStyles.js
export const bookingStyles = {
    container: {
      maxWidth: "xl",
    },
    loadingText: {
      padding: 4,
      textAlign: 'center',
    },
    bookingFormContainer: {
      padding: 3,
      borderRight: "3px solid red",
    },
    bookingFormTitle: {
      marginBottom: 2,
    },
    bookNowButton: {
      backgroundColor: "red",
      "&:hover": {
        backgroundColor: "red",
      },
      marginTop: 2,
    },
    imageContainer: {
      overflow: "hidden",
      borderRadius: 2,
      boxShadow: 3,
      "&:hover img": {
        transform: "scale(1.03)",
      },
    },
    imageStyle: {
      transition: "transform 0.5s ease",
      objectFit: "cover",
    },
    roomCard: {
      p: 3,
      mt: 3,
      backgroundColor: "background.paper",
      borderRadius: 2,
      boxShadow: 3,
      transition: "all 0.3s ease",
      "&:hover": {
        boxShadow: 6,
      },
    },
    roomTitle: {
      fontWeight: 700,
      background: "linear-gradient(45deg, #ff4d4d, #f9cb28)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      display: "inline-block",
      animation: "pulse 2s infinite",
    },
    priceContainer: {
      display: "flex",
      alignItems: "center",
      mb: 3,
      gap: 2,
    },
    originalPriceChip: {
      fontSize: "1.1rem",
      fontWeight: 700,
      px: 2,
      py: 1,
      backgroundColor: "primary.main",
      color: "white",
     
    },
    discountedPriceChip: {
      fontSize: "1.1rem",
      fontWeight: 700,
      px: 2,
      py: 1,
    },
    descriptionBox: {
      mb: 4,
      animation: "fadeIn 1s ease",
    },
    descriptionText: {
      p: 3,
      mb: 3,
      borderLeft: "4px solid",
      borderColor: "primary.main",
      backgroundColor: "rgba(255, 77, 77, 0.05)",
      borderRadius: "0 8px 8px 0",
      lineHeight: 1.8,
      "&:hover": {
        backgroundColor: "rgba(255, 77, 77, 0.1)",
      },
    },
    longDescriptionText: {
      p: 3,
      borderLeft: "4px solid",
      borderColor: "primary.main",
      backgroundColor: "rgba(255, 77, 77, 0.05)",
      borderRadius: "0 8px 8px 0",
      lineHeight: 1.8,
      "&:hover": {
        backgroundColor: "rgba(255, 77, 77, 0.1)",
      },
    },
    amenityItem: {
      p: 1.5,
      mb: 1,
      borderRadius: 1,
      transition: "all 0.3s",
      "&:hover": {
        backgroundColor: "rgba(255, 77, 77, 0.1)",
        transform: "translateX(5px)",
      },
    },
    amenitiesContainer: {
      p: 3,
      mb: 4,
      borderTop: "1px solid",
      borderBottom: "1px solid",
      borderColor: "divider",
      borderRadius: 1,
    },
    facilitiesTitle: {
      fontWeight: 600,
    },
    facilityChip: {
      backgroundColor: "rgba(255, 77, 77, 0.1)",
      color: "text.primary",
      "&:hover": {
        backgroundColor: "primary.main",
        color: "white",
      },
    },
    detailCard: {
      p: 3,
      border: "1px solid",
      borderColor: "divider",
      borderRadius: 2,
      transition: "all 0.3s",
      "&:hover": {
        borderColor: "primary.main",
        boxShadow: 2,
      },
    },
    reviewSection: {
      p: 3,
      border: "1px solid",
      borderColor: "divider",
      borderRadius: 2,
      backgroundColor: "rgba(255, 255, 255, 0.7)",
      backdropFilter: "blur(10px)",
    },
    reviewTitle: {
      fontWeight: 600,
    },
    reviewTextField: {
      mt: 2,
      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          borderColor: "divider",
          borderRadius: 1,
        },
        "&:hover fieldset": {
          borderColor: "primary.main",
        },
      },
    },
    submitReviewButton: {
      mt: 2,
      px: 4,
      py: 1.5,
      fontWeight: 600,
      background: "linear-gradient(45deg, #ff4d4d, #f9cb28)",
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: 2,
      },
    },








    skeletonForm: {
        p: 3,
        borderRight: "3px solid #e0e0e0",
      },
      skeletonImage: {
        width: '100%',
        height: 400,
        transform: 'none', // Disable scale animation for skeleton
      },
      skeletonText: {
        mb: 2,
      },
      skeletonTitle: {
        width: '60%',
        height: 60,
        mb: 3,
      },
      skeletonPrice: {
        width: '30%',
        height: 40,
        mb: 2,
      },
      skeletonDescription: {
        width: '100%',
        height: 100,
        mb: 2,
      },
      skeletonAmenity: {
        width: '80%',
        height: 20,
        mb: 1.5,
      },
      skeletonDetailCard: {
        p: 2,
        mb: 2,
        height: 120,
      },


  };
  
  export const globalStyles = `
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    @keyframes pulse {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
      }
      100% {
        transform: scale(1);
      }
    }
  `;





  export const skeletonAnimation = {
    pulse: 'pulse 1.5s ease-in-out 0.5s infinite',
    wave: 'wave 1.5s linear 0.5s infinite',
  };









  // styles/PricingSummaryStyles.js
export const pricingSummaryStyles = {
  container: {
    mt: 3,
    p: 3,
    border: '1px solid',
    borderColor: 'divider',
    borderRadius: 2,
    backgroundColor: 'background.paper',
    boxShadow: '0px 2px 8px rgba(0,0,0,0.05)'
  },
  title: {
    mb: 2,
    fontWeight: 'bold',
    color: 'text.primary',
    fontSize: '1.1rem'
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    mb: 1.5,
    alignItems: 'center'
  },
  label: {
    color: 'text.secondary',
    fontSize: '0.9rem'
  },
  value: {
    fontWeight: '500',
    fontSize: '0.9rem'
  },
  discountValue: {
    color: 'error.main',
    fontWeight: '500'
  },
  divider: {
    my: 2,
    borderColor: 'divider'
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mt: 1
  },
  totalLabel: {
    fontWeight: 'bold',
    color: 'text.primary'
  },
  totalValue: {
    fontWeight: 'bold',
    color: 'primary.main',
    fontSize: '1.1rem'
  }
};