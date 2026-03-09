import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { service_id, service_name, price, booking_date, booking_time, customer_name, customer_email, customer_phone } = await req.json();

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");

    if (!stripeKey) {
      // Stub mode: create booking directly without Stripe
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

      const bookingRes = await fetch(`${supabaseUrl}/rest/v1/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          service_id,
          booking_date,
          booking_time,
          customer_name,
          customer_email,
          customer_phone,
          status: "confirmed",
          stripe_payment_status: "paid",
          notes: "Stripe stub mode - no real payment",
        }),
      });

      if (!bookingRes.ok) {
        throw new Error(`Booking insert failed: ${await bookingRes.text()}`);
      }

      // Trigger email notification
      try {
        await fetch(`${supabaseUrl}/functions/v1/send-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({
            type: "booking_confirmation",
            customer_email,
            customer_name,
            service_name,
            booking_date,
            booking_time,
            price,
          }),
        });
      } catch { /* email is best-effort */ }

      const origin = req.headers.get("origin") || "https://zehra-glam.com";
      return new Response(
        JSON.stringify({ url: `${origin}/booking/success` }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Real Stripe checkout
    const stripeRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        "payment_method_types[0]": "card",
        "line_items[0][price_data][currency]": "eur",
        "line_items[0][price_data][product_data][name]": service_name,
        "line_items[0][price_data][unit_amount]": String(Math.round(price * 100)),
        "line_items[0][quantity]": "1",
        mode: "payment",
        success_url: `${req.headers.get("origin") || "https://zehra-glam.com"}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.get("origin") || "https://zehra-glam.com"}/booking`,
        customer_email,
        "metadata[service_id]": service_id,
        "metadata[booking_date]": booking_date,
        "metadata[booking_time]": booking_time,
        "metadata[customer_name]": customer_name,
        "metadata[customer_phone]": customer_phone,
      }),
    });

    const session = await stripeRes.json();

    if (session.error) {
      throw new Error(session.error.message);
    }

    return new Response(
      JSON.stringify({ url: session.url }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
