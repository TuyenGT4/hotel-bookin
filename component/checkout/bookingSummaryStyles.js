export const bookingSummaryStyles = {
  card: {
    borderRadius: '18px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    background: 'white',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 15px 35px rgba(0,0,0,0.15)'
    }
  },
  media: {
    height: '420px',
    objectFit: 'cover',
    borderBottom: '3px solid #f8f9fa'
  },
  header: {
    py: 2.5,
    px: 3,
    background: 'linear-gradient(135deg,rgb(218, 16, 16) 0%, #764ba2 100%)',
    color: 'white',
    fontWeight: '700',
    letterSpacing: '0.5px',
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: '24px',
      width: '50px',
      height: '4px',
      background: 'rgba(255,255,255,0.7)',
      borderRadius: '4px'
    }
  },
  iconContainer: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '10px',
    marginRight: '12px'
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    py: 2,
    px: 3,
    '&:nth-of-type(odd)': {
      background: 'rgba(245, 245, 245, 0.5)'
    }
  },
  detailLabel: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    color: '#5a5a5a',
    fontWeight: '500'
  },
  detailValue: {
    fontWeight: '600',
    color: '#2d3748',
    minWidth: '80px',
    textAlign: 'right'
  },
  priceHighlight: {
    display: 'inline-block',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)',
    borderRadius: '14px',
    padding: '8px 16px',
    margin: '12px 0',
    fontWeight: '700',
    color: '#3a7bd5',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
    '& span': {
      fontSize: '0.9rem',
      opacity: 0.8,
      marginLeft: '4px'
    }
  },
  discountBadge: {
    background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    color: 'white',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: '700',
    marginLeft: '8px',
    boxShadow: '0 2px 8px rgba(67, 233, 123, 0.3)'
  },
  totalContainer: {
    background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)',
    padding: '16px 24px',
    borderRadius: '0 0 18px 18px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '8px'
  },
  totalLabel: {
    fontWeight: '700',
    color: '#5a5a5a'
  },
  totalValue: {
    fontWeight: '800',
    fontSize: '1.5rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  }
};







export const styles = {
  card: {
    mt: 4,
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
    border: 'none',
    background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
    overflow: 'hidden',
    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1)',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 15px 35px rgba(0,0,0,0.12)'
    }
  },
  cardHeader: {
    background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)',
    color: 'white',
    py: 2,
    px: 3,
    fontSize: '1.3rem',
    fontWeight: '700',
    letterSpacing: '0.5px'
  },
  paymentOption: {
    display: 'flex',
    alignItems: 'center',
    mb: 1.5,
    p: 2,
    borderRadius: '12px',
    background: 'white',
    boxShadow: '0 3px 10px rgba(0,0,0,0.04)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateX(5px)',
      boxShadow: '0 5px 15px rgba(0,0,0,0.08)'
    },
    '&.Mui-selected': {
      borderLeft: '4px solid #6a11cb'
    }
  },
  paymentIcon: {
    ml: 2,
    fontSize: '2rem',
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
  },
  radio: {
    '& .MuiSvgIcon-root': {
      fontSize: '1.8rem',
      color: '#6a11cb'
    }
  },
  placeOrderButton: {
    mt: 3,
    py: 1.5,
    fontSize: '1.1rem',
    fontWeight: '700',
    borderRadius: '12px',
    background: 'linear-gradient(45deg, #FF416C 0%, #FF4B2B 100%)',
    boxShadow: '0 4px 15px rgba(255, 65, 108, 0.3)',
    textTransform: 'none',
    letterSpacing: '0.5px',
    transition: 'all 0.4s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      background: 'linear-gradient(45deg, #FF416C 0%, #FF4B2B 100%)',
      boxShadow: '0 8px 20px rgba(255, 65, 108, 0.4)'
    }
  },
  formLabel: {
    px: 2,
    mb: 2,
    fontSize: '1rem',
    fontWeight: '600',
    color: '#6a11cb',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  }
};

export const iconColors = {
  cod: 'linear-gradient(135deg, #FF9A9E 0%, #FAD0C4 100%)',
  stripe: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  razorpay: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
  paypal: 'linear-gradient(135deg, #0070ba 0%, #00a8e8 100%)'
};