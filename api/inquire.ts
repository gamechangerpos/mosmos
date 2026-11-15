// Vercel Serverless API Route: /api/inquire
// Secure server-side validation, anti-spam honeypot, and email dispatch for customer inquiries

const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || 'gamechangerpos@gmail.com';
const BUSINESS_NAME = 'MOS MOS Safaris';

// In-memory rate limiting map (IP -> timestamp)
const rateLimitMap = new Map<string, number>();

export default async function handler(req: any, res: any) {
  // 1. Method check
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';

    // 2. Anti-spam Honeypot Check (Bots fill out hidden fields, humans never do)
    if (body.website_url_hp || body.honeypot) {
      // Return a 200 OK so bots think they succeeded, but do nothing
      return res.status(200).json({
        success: true,
        reference: `MMS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        message: 'Inquiry received.'
      });
    }

    // 3. Server-side Rate Limiting (1 request per 10 seconds per IP)
    const now = Date.now();
    const lastRequest = rateLimitMap.get(String(clientIp)) || 0;
    if (now - lastRequest < 10000) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests. Please wait a few moments before submitting again.'
      });
    }
    rateLimitMap.set(String(clientIp), now);

    // 4. Server-side Input Validation
    const rawEmail = String(body.email || '').trim();
    const rawName = String(body.name || '').trim();
    const rawMessage = String(body.message || '').trim();
    const rawPhone = String(body.phone || '').trim();
    const category = String(body.category || 'Safari Inquiry').trim();
    const destinations = Array.isArray(body.destinations) ? body.destinations.join(', ') : String(body.destination || 'East Africa');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!rawEmail || !emailRegex.test(rawEmail)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email address provided.'
      });
    }

    if (!rawMessage || rawMessage.length < 5) {
      return res.status(400).json({
        success: false,
        error: 'Message content is required (minimum 5 characters).'
      });
    }

    // 5. Sanitize text
    const cleanEmail = rawEmail.slice(0, 150);
    const cleanName = (rawName || 'Valued Guest').slice(0, 100);
    const cleanMessage = rawMessage.slice(0, 3000).replace(/<[^>]*>?/gm, '');
    const cleanPhone = rawPhone.slice(0, 40);

    // 6. Generate Internal Reference
    const reference = `MMS-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    // 7. Server-side Email Dispatch via FormSubmit gateway
    // Delivers directly to support mailbox with Reply-To set to the customer's email address
    try {
      const supportEndpoint = `https://formsubmit.co/ajax/${encodeURIComponent(SUPPORT_EMAIL)}`;
      const supportPayload = {
        _subject: `New Safari Inquiry — ${reference} — ${cleanName}`,
        _replyto: cleanEmail,
        _template: 'table',
        _captcha: 'false',
        Reference: reference,
        'Customer Name': cleanName,
        'Customer Email': cleanEmail,
        'Customer Phone': cleanPhone || 'Not provided',
        Category: category,
        Destination: destinations,
        Message: cleanMessage,
        'Reply Instruction': 'Click Reply in your email client to reply directly to this customer.'
      };

      await fetch(supportEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(supportPayload)
      });
    } catch (emailErr) {
      console.warn('[api/inquire] Server-side support notification failed:', emailErr);
    }

    // 8. Return success response to client
    return res.status(200).json({
      success: true,
      reference,
      customerEmail: cleanEmail,
      message: 'Your inquiry has been received. Our team will review your message and reply directly to your email within two business days.'
    });
  } catch (err: any) {
    console.error('[api/inquire] Unexpected error:', err);
    return res.status(500).json({
      success: false,
      error: 'An unexpected error occurred while processing your inquiry.'
    });
  }
}
