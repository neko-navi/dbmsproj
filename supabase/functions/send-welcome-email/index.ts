import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

serve(async (req) => {
  const { email, businessName } = await req.json();

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: 'ShipMe <noreply@shipme.com>',
      to: email,
      subject: 'Welcome to ShipMe!',
      html: `
        <h1>Welcome to ShipMe, ${businessName}!</h1>
        <p>Thank you for registering with ShipMe. We're excited to help you manage your shipping needs.</p>
        <p>Here's what you can do with your account:</p>
        <ul>
          <li>Manage warehouses</li>
          <li>Create and track orders</li>
          <li>Get shipping quotes</li>
          <li>View shipping history</li>
        </ul>
        <p>If you have any questions, please don't hesitate to contact our support team.</p>
        <p>Best regards,<br>The ShipMe Team</p>
      `,
    }),
  });

  const data = await res.json();

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
    status: res.status,
  });
});