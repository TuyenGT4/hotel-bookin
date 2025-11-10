// Import necessary modules and functions
import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Booking from "@/model/booking";
import paypal from "@paypal/checkout-server-sdk"; // PayPal SDK

// Configure PayPal environment (Sandbox mode)
let environment = new paypal.core.SandboxEnvironment(
  "AceW9nJb3-RlOq1F9qpl40eCvABcWpTtxCO5rTu47RpdFOoAiQGJSRRKqAPVodkMWTUbVCAyNpBRaZDL", // Client ID (sandbox)
  "EHGdvjb7JZ2dnhivVEyI_LAJPEWLxOzkxcFkcivqc_HH4nnqUbcYscfqVsOLwxbqiFY7OqHMJkluJoT0"  // Client Secret (sandbox)
);

// Create a PayPal client
let client = new paypal.core.PayPalHttpClient(environment);

export async function GET(req, context) {
  // Connect to the database
  await dbConnect();
  console.log("✅ Connected to database");

  const { id } = context?.params || {};
  console.log("🆔 Received PayPal order ID:", id);

  if (!id) {
    console.log("❌ Missing PayPal order ID in request");
    return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
  }

  try {
    // Create a request to capture the order
    const request = new paypal.orders.OrdersCaptureRequest(id);
    request.requestBody({}); // Required by SDK, even if empty
    console.log("📦 Created PayPal capture request");

    // Execute PayPal request
    const response = await client.execute(request);
    console.log("✅ PayPal response received:", JSON.stringify(response, null, 2));

    // Extract reference (booking) ID
    const bookingId = response?.result?.purchase_units?.[0]?.reference_id;
    const status = response?.result?.status;
    console.log("📄 Payment Status:", status);
    console.log("📎 Booking ID (from reference_id):", bookingId);

    // Proceed if payment is completed
    if (status === "COMPLETED") {
      const updatedBooking = await Booking.findByIdAndUpdate(
        bookingId,
        {
          transaction_id: response.result.id,
          payment_status: "1",
        },
        { new: true }
      );

      if (!updatedBooking) {
        console.log("❌ Booking not found with ID:", bookingId);
        return NextResponse.json({ error: "Booking not found" }, { status: 404 });
      }

      console.log("✅ Booking updated successfully:", updatedBooking);

      return NextResponse.json(
        { success: "Payment successful and booking updated" },
        { status: 200 }
      );
    } else {
      console.log("❌ Payment not completed. Status:", status);
      return NextResponse.json(
        { failed: "Payment failed, try again" },
        { status: 500 }
      );
    }
  } catch (err) {
    console.log("💥 Error during payment capture:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
