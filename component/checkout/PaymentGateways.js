import { styles, iconColors } from "./bookingSummaryStyles";
import {
  Card,
  CardHeader,
  CardContent,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Box,
  Avatar,
} from "@mui/material";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { useTranslation } from "react-i18next";

const PaymentGateways = ({
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  handlePlaceOrder,
}) => {
  const { t } = useTranslation("component/checkout/PaymentGateways");

  const paymentMethods = [
    // {
    //   value: "cod",
    //   label: t("cash_on_delivery", "Cash on Delivery"),
    //   icon: <LocalAtmIcon />,
    //   color: iconColors.cod,
    // },

    {
      value: "VN Pay",
      label: "Ví điện tử VN Pay",
      icon: <CreditCardIcon />,
      // color: iconColors.stripe,
    },
    // Uncomment if needed
    // {
    //   value: "stripe",
    //   label: t("credit_card", "Credit/Debit Card"),
    //   icon: <CreditCardIcon />,
    //   color: iconColors.stripe,
    // },
    // {
    //   value: "razorpay",
    //   label: t("razorpay_wallet", "Razorpay Wallet"),
    //   icon: <AccountBalanceWalletIcon />,
    //   color: iconColors.razorpay,
    // },
    // {
    //   value: "paypal",
    //   label: t("paypal", "PayPal"),
    //   icon: <AccountBalanceIcon />,
    //   color: iconColors.paypal,
    // },
  ];

  return (
    <Card sx={styles.card}>
      <CardHeader
        title={t("payment_method", "Payment Method")}
        sx={styles.cardHeader}
        titleTypographyProps={{ variant: "h6" }}
      />
      <CardContent>
        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend" sx={styles.formLabel}>
            {t("choose_payment", "Choose your preferred payment")}
          </FormLabel>
          <RadioGroup
            aria-label="payment-method"
            name="payment-method"
            value={selectedPaymentMethod}
            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
          >
            {paymentMethods.map((method) => (
              <Box
                key={method.value}
                sx={{
                  ...styles.paymentOption,
                  ...(selectedPaymentMethod === method.value && {
                    borderLeft: "4px solid #6a11cb",
                    backgroundColor: "rgba(106, 17, 203, 0.05)",
                  }),
                }}
              >
                <FormControlLabel
                  value={method.value}
                  control={<Radio sx={styles.radio} />}
                  label={method.label}
                  sx={{ flexGrow: 1 }}
                />
                <Avatar
                  sx={{
                    ...styles.paymentIcon,
                    background: method.color,
                    color: "white",
                  }}
                >
                  {method.icon}
                </Avatar>
              </Box>
            ))}
          </RadioGroup>
        </FormControl>
        <Button
          variant="contained"
          sx={styles.placeOrderButton}
          onClick={handlePlaceOrder}
          fullWidth
          size="large"
          endIcon={
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 12H19"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 5L19 12L12 19"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
        >
          {t("confirm_pay", "Confirm & Pay Now")}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PaymentGateways;
