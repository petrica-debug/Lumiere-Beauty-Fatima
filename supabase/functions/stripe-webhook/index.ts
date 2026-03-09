import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  try {
    const body = await req.text();
    const sig = req.headers.get("stripe-signature");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

    // In production, verify the webhook signature
    // For now, parse the event directly
    const event = JSON.parse(body);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const metadata = session.metadata || {};

      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

      // Create the booking
      const bookingRes = await fetch(`${supabaseUrl}/rest/v1/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          service_id: metadata.service_id,
          booking_date: metadata.booking_date,
          booking_time: metadata.booking_time,
          customer_name: metadata.customer_name,
          customer_email: session.customer_email,
          customer_phone: metadata.customer_phone || "",
          status: "confirmed",
          stripe_payment_id: session.payment_intent,
          stripe_payment_status: "paid",
        }),
      });

      if (!bookingRes.ok) {
        console.error("Failed to create booking:", await bookingRes.text());
      }

      // Send confirmation email
      try {
        await fetch(`${supabaseUrl}/functions/v1/send-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({
            type: "booking_confirmation",
            customer_email: session.customer_email,
            customer_name: metadata.customer_name,
            service_name: session.line_items?.data?.[0]?.description || "Beauty Service",
            booking_date: metadata.booking_date,
            booking_time: metadata.booking_time,
            price: (session.amount_total / 100).toFixed(2),
          }),
        });
      } catch (e) {
        console.error("Email send failed:", e);
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
});
