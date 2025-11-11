import { useState, useEffect } from "react";
import { Container, Grid, Box, CircularProgress } from "@mui/material";
import { useSession } from "next-auth/react";
import BillingDetails from "./BillingDetails";
import BookingSummary from "./BookingSummary";
import PaymentGateways from "./PaymentGateways";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation("component/checkout/Checkout");

  const [loading, setLoading] = useState(false);
  const [billingDetails, setBillingDetails] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [pricingData, setPricingData] = useState(null);

  const { data } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const alldata = {
        roomId: params.get("roomId"),
        checkIn: params.get("checkIn"),
        checkOut: params.get("checkOut"),
        guests: parseInt(params.get("guests")),
        rooms: parseInt(params.get("rooms")),
      };
      fetchPricingData(alldata);
    }
  }, []);

  const fetchPricingData = async (bookingData) => {
    try {
      const response = await fetch(`${process.env.API}/user/checkoutdetails`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        throw new Error(t("fetch_failed", "Failed to fetch pricing"));
      }

      const result = await response.json();

      setPricingData({
        pricePerNight: result.pricePerNight,
        nights: result.nights,
        subtotal: result.subtotal,
        discountPercent: result.discountPercent,
        discountAmount: result.discountAmount,
        total: result.total,
        rooms: result.rooms,
        guests: result.guests,
        roomTypeName: result.roomTypeName,
        room_id: result?.room_id,
        checkIn: result?.checkIn,
        checkOut: result?.checkOut,
        image: result.image,
      });
    } catch (error) {
      console.log("error", error);
      toast.error(t("pricing_error", "Unable to fetch room pricing"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    const loadHandler = () => {
      console.log(t("razorpay_loaded", "Razorpay script loaded"));
    };

    script.addEventListener("load", loadHandler);
    document.body.appendChild(script);

    return () => {
      script.removeEventListener("load", loadHandler);
      document.body.removeChild(script);
    };
  }, []);

  const handleRazorpay = async (orderData) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.API}/user/payment/razorpaypayment/razorpay`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        }
      );

      const data = await response.json();
      const options = {
        key: process.env.RAZORPAY_KEY_ID,
        amount: data && data?.amount * 100,
        currency: "INR",
        name: "Hotel Hub",
        description: t("test_payment", "Test Payment"),
        order_id: data && data.id,
        handler: function (response) {
          alert(response);
          verifyPayment(response.razorpay_payment_id);
          setLoading(false);
        },
        prefill: {
          name: data && data.name,
          email: data && data.email,
        },
        notes: { address: t("your_address", "Your address") },
        theme: { color: "red" },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
      setLoading(false);
    } catch (error) {
      console.log("error initiating payment", error);
      toast.error(t("payment_failed", "Payment initiation failed"));
      setLoading(false);
    }
  };

  const verifyPayment = async (paymentId) => {
    try {
      const response = await fetch(
        `${process.env.API}/user/payment/razorpaypayment/razorpayverify`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ razorpay_payment_id: paymentId }),
        }
      );

      const data = await response.json();

      if (data?.err) {
        router.push("/cancel");
        setLoading(false);
      } else {
        toast.success(
          data?.success || t("payment_success", "Payment successful")
        );
        router.push("/dashboard/user");
        setLoading(false);
      }
    } catch (error) {
      console.log("error", error);
      setLoading(false);
    }
  };

  const handleStripe = async (orderData) => {
    try {
      const response = await fetch(
        `${process.env.API}/user/payment/stripepayment/stripe`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.err || t("stripe_failed", "Stripe payment failed"));
      } else {
        window.location.href = data.id;
      }
    } catch (error) {
      console.log("error", error);
      toast.error(t("stripe_error", "Unable to initiate Stripe payment"));
    }
  };

  const handlePaypal = async (orderData) => {
    try {
      const response = await fetch(
        `${process.env.API}/user/payment/paypalpayment/paypal`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        toast.error(t("paypal_failed", "PayPal payment failed"));
      } else {
        router.push(data.id);
      }
    } catch (error) {
      console.log(error);
      toast.error(t("paypal_error", "Unable to initiate PayPal payment"));
    }
  };

  const handleVNPay = async (orderData) => {
    try {
      const response = await fetch(
        `${process.env.API}/user/payment/vnpaypayment/vnpay`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        toast.error(t("vnpay_failed", "VN Pay payment failed"));
      } else {
        window.location.href = data.paymentUrl; // Redirect đến VN Pay
      }
    } catch (error) {
      console.log("error", error);
      toast.error(t("vnpay_error", "Unable to initiate VN Pay payment"));
    }
  };
  const handlePlaceOrder = async () => {
    if (!billingDetails?.isValid) {
      const errorField = Object.entries(billingDetails?.data || {}).find(
        ([key, value]) => key !== "country" && (!value || value.trim() === "")
      );

      if (errorField) {
        alert(
          t("fill_field", "Please fill in") +
            ` ${errorField[0]} ` +
            t("correctly", "correctly")
        );
      } else {
        alert(
          t("fill_required", "Please fill in all required fields correctly")
        );
      }
      return;
    }

    if (!selectedPaymentMethod) {
      alert(t("select_payment", "Please select a payment method"));
      return;
    }

    const orderData = {
      ...pricingData,
      billingDetails: billingDetails.data,
      paymentMethod: selectedPaymentMethod,
    };

    try {
      switch (selectedPaymentMethod.toLocaleLowerCase()) {
        case "stripe":
          await handleStripe(orderData);
          break;
        case "razorpay":
          await handleRazorpay(orderData);
          break;
        case "paypal":
          await handlePaypal(orderData);
          break;
        default:
          const response = await fetch(`${process.env.API}/user/place-order`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderData),
          });

          if (!response.ok) {
            const errordata = await response.json();
            throw new Error(errordata.message);
          }

          await response.json();
          alert(t("order_success", "Order placed successfully"));
      }
    } catch (error) {
      alert(t("order_failed", "Order failed") + `: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "black",
        }}
      >
        <CircularProgress
          size={80}
          sx={{
            color: "purple",
            animation: "spin 2s linear infinite",
          }}
        />
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              50% { transform: rotate(180deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <BillingDetails onBillingDetailsChange={setBillingDetails} />
        </Grid>
        <Grid item xs={12} md={6}>
          <BookingSummary pricingData={pricingData} />
          <PaymentGateways
            selectedPaymentMethod={selectedPaymentMethod}
            setSelectedPaymentMethod={setSelectedPaymentMethod}
            handlePlaceOrder={handlePlaceOrder}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
