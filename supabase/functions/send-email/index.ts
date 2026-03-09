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
    const { type, customer_email, customer_name, service_name, booking_date, booking_time, price } = await req.json();

    const resendKey = Deno.env.get("RESEND_API_KEY");
    const adminEmail = Deno.env.get("ADMIN_EMAIL") || "hello@zehra-glam.com";

    if (!resendKey) {
      console.log("RESEND_API_KEY not set — skipping email send");
      console.log("Would send:", { type, customer_email, customer_name, service_name, booking_date, booking_time });
      return new Response(JSON.stringify({ sent: false, reason: "no_api_key" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const emails: { from: string; to: string; subject: string; html: string }[] = [];

    if (type === "booking_confirmation") {
      // Customer confirmation email
      emails.push({
        from: "Zehra Glam <bookings@zehra-glam.com>",
        to: customer_email,
        subject: `Booking Confirmed — ${service_name}`,
        html: `
          <div style="font-family: 'Helvetica Neue', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <h1 style="font-size: 28px; font-weight: 300; color: #2d1f14; margin-bottom: 24px;">Booking Confirmed</h1>
            <p style="color: #6b5c50; line-height: 1.6;">Dear ${customer_name},</p>
            <p style="color: #6b5c50; line-height: 1.6;">Your appointment has been confirmed. Here are the details:</p>
            <div style="background: #faf8f5; padding: 24px; margin: 24px 0; border-left: 3px solid #c8956c;">
              <p style="margin: 8px 0; color: #2d1f14;"><strong>Service:</strong> ${service_name}</p>
              <p style="margin: 8px 0; color: #2d1f14;"><strong>Date:</strong> ${booking_date}</p>
              <p style="margin: 8px 0; color: #2d1f14;"><strong>Time:</strong> ${booking_time}</p>
              <p style="margin: 8px 0; color: #2d1f14;"><strong>Price:</strong> €${price}</p>
            </div>
            <p style="color: #6b5c50; line-height: 1.6;"><strong>Location:</strong> Rue d'Arlon 25, Ixelles</p>
            <p style="color: #6b5c50; line-height: 1.6;">We look forward to seeing you!</p>
            <p style="color: #c8956c; margin-top: 32px;">— Zehra Glam Team</p>
          </div>
        `,
      });

      // Admin notification email
      emails.push({
        from: "Zehra Glam <bookings@zehra-glam.com>",
        to: adminEmail,
        subject: `New Booking: ${customer_name} — ${service_name}`,
        html: `
          <div style="font-family: 'Helvetica Neue', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <h1 style="font-size: 28px; font-weight: 300; color: #2d1f14;">New Booking Received</h1>
            <div style="background: #faf8f5; padding: 24px; margin: 24px 0; border-left: 3px solid #c8956c;">
              <p style="margin: 8px 0; color: #2d1f14;"><strong>Customer:</strong> ${customer_name}</p>
              <p style="margin: 8px 0; color: #2d1f14;"><strong>Email:</strong> ${customer_email}</p>
              <p style="margin: 8px 0; color: #2d1f14;"><strong>Service:</strong> ${service_name}</p>
              <p style="margin: 8px 0; color: #2d1f14;"><strong>Date:</strong> ${booking_date}</p>
              <p style="margin: 8px 0; color: #2d1f14;"><strong>Time:</strong> ${booking_time}</p>
              <p style="margin: 8px 0; color: #2d1f14;"><strong>Price:</strong> €${price}</p>
            </div>
          </div>
        `,
      });
    }

    const results = await Promise.all(
      emails.map((email) =>
        fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendKey}`,
          },
          body: JSON.stringify(email),
        })
      )
    );

    const allOk = results.every((r) => r.ok);

    return new Response(
      JSON.stringify({ sent: allOk, count: emails.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
