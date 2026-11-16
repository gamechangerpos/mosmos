// Vercel Serverless API Route: /api/inquire
// Direct Customer Email Communication & Staff Notification Pipeline
// Built with Nodemailer Gmail SMTP, Resend API, and zero-config HTTP relay fallback

import nodemailer from 'nodemailer';

const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || 'gamechangerpos@gmail.com';
const BUSINESS_NAME = process.env.BUSINESS_NAME || 'MOS MOS Safaris';
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASSWORD || '';
const GMAIL_USER = process.env.GMAIL_USER || SUPPORT_EMAIL;

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

    // 2. Anti-spam Honeypot Check (Silently drop bots)
    if (body.website_url_hp || body.honeypot) {
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
    const rawEmail = String(body.email || body.customerEmail || '').trim();
    const rawName = String(body.name || body.customerName || '').trim();
    const rawMessage = String(body.message || body.notes || '').trim();
    const rawPhone = String(body.phone || body.customerPhone || '').trim();
    const category = String(body.category || body.travelStyle || 'Safari Inquiry').trim();
    const destinations = Array.isArray(body.destinations) 
      ? body.destinations.join(', ') 
      : String(body.destination || 'East African Wilderness');

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
    const reference = body.reference || `MMS-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    let customerDeliveryStatus = 'PENDING';
    let supportDeliveryStatus = 'PENDING';
    let providerUsed = 'none';

    // HTML Email Template for Customer Acknowledgment
    const customerHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F7F4ED; margin: 0; padding: 24px 12px; color: #20221F; }
    .card { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #D9D0C2; }
    .header { background: #20221F; padding: 32px 24px; text-align: center; }
    .header h1 { color: #F7F4ED; font-family: Georgia, serif; font-size: 24px; letter-spacing: 0.15em; text-transform: uppercase; margin: 0; }
    .header p { color: #B69A68; font-size: 10px; font-weight: 700; letter-spacing: 0.3em; text-transform: uppercase; margin: 6px 0 0 0; }
    .content { padding: 32px 28px; line-height: 1.6; font-size: 14px; }
    .box { background: #F7F4ED; border: 1px solid #E4DDD1; padding: 18px 20px; margin: 20px 0; font-size: 13px; }
    .row { padding: 5px 0; border-bottom: 1px solid #EBE5DA; }
    .row:last-child { border-bottom: none; }
    .label { font-weight: 600; color: #78634B; display: inline-block; width: 140px; text-transform: uppercase; font-size: 11px; }
    .footer { background: #20221F; color: #D9D0C2; padding: 24px; text-align: center; font-size: 11px; }
    .footer a { color: #B69A68; text-decoration: none; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>${BUSINESS_NAME}</h1>
      <p>Luxury African Safaris & Global Expeditions</p>
    </div>
    <div class="content">
      <h2 style="font-family: Georgia, serif; font-weight: 400; font-size: 20px; margin-top: 0;">We Have Received Your Travel Inquiry</h2>
      <p>Hello ${cleanName},</p>
      <p>Thank you for contacting <strong>${BUSINESS_NAME}</strong>. Our expedition directors have successfully received your inquiry and are reviewing your specifications.</p>
      
      <div class="box">
        <div class="row"><span class="label">Reference:</span><strong style="color: #78634B; font-family: monospace;">${reference}</strong></div>
        <div class="row"><span class="label">Destination:</span><span>${destinations}</span></div>
        <div class="row"><span class="label">Category:</span><span>${category}</span></div>
        <div class="row"><span class="label">Contact Email:</span><span>${cleanEmail}</span></div>
        <div class="row"><span class="label">Notes / Message:</span><span>${cleanMessage}</span></div>
      </div>

      <p>An experienced regional specialist will review your request and get back to you directly at this email address within <strong>two business days</strong> with tailored recommendations and indicative pricing.</p>
      <p>If you have urgent inquiries, simply reply directly to this email or contact us at <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a>.</p>

      <p style="margin-top: 24px;">Warm regards,<br><strong>${BUSINESS_NAME} Expedition Team</strong><br>${SUPPORT_EMAIL}</p>
    </div>
    <div class="footer">
      <p style="margin: 0 0 6px 0;">Official Wildlife Authority Partner · Uganda · Rwanda · Kenya · Tanzania</p>
      <p style="margin: 0; font-size: 10px; color: #8A857A;">© ${new Date().getFullYear()} ${BUSINESS_NAME}. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;

    // HTML Email Template for Support Team Notification
    const supportHtml = `<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; padding: 20px; color: #333; line-height: 1.6;">
  <h2>New Safari Inquiry Received — ${reference}</h2>
  <p><strong>Customer Name:</strong> ${cleanName}</p>
  <p><strong>Customer Email:</strong> <a href="mailto:${cleanEmail}">${cleanEmail}</a></p>
  <p><strong>Customer Phone:</strong> ${cleanPhone || 'Not provided'}</p>
  <p><strong>Destination:</strong> ${destinations}</p>
  <p><strong>Category:</strong> ${category}</p>
  <p><strong>Message:</strong></p>
  <blockquote style="background: #f7f7f7; padding: 12px; border-left: 4px solid #78634B;">${cleanMessage}</blockquote>
  <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
  <p style="color: #666; font-size: 12px;"><strong>Direct Reply:</strong> Click Reply in your email client to reply directly to ${cleanName} at ${cleanEmail}.</p>
</body>
</html>`;

    // =========================================================================
    // 7. PRIMARY CARRIER: DIRECT GMAIL SMTP (Zero-cost, 100% genuine sender)
    // Activated when GMAIL_APP_PASSWORD is set in Vercel Environment Variables
    // =========================================================================
    if (GMAIL_APP_PASSWORD) {
      try {
        providerUsed = 'gmail_smtp';
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: GMAIL_USER,
            pass: GMAIL_APP_PASSWORD
          }
        });

        // Send to Customer
        await transporter.sendMail({
          from: `"${BUSINESS_NAME}" <${GMAIL_USER}>`,
          to: cleanEmail,
          replyTo: SUPPORT_EMAIL,
          subject: `We Have Received Your Travel Inquiry — ${BUSINESS_NAME} [${reference}]`,
          html: customerHtml,
          text: `Hello ${cleanName},\n\nThank you for contacting ${BUSINESS_NAME}.\nWe have received your inquiry [${reference}] for ${destinations}.\nOur team will review your message and reply directly to your email within two business days.\n\nKind regards,\n${BUSINESS_NAME} Expedition Team\n${SUPPORT_EMAIL}`
        });
        customerDeliveryStatus = 'DELIVERED';

        // Send to Support Inbox
        await transporter.sendMail({
          from: `"${BUSINESS_NAME} Inquiry Bot" <${GMAIL_USER}>`,
          to: SUPPORT_EMAIL,
          replyTo: cleanEmail,
          subject: `New Safari Inquiry from ${cleanName} [${reference}]`,
          html: supportHtml,
          text: `New Safari Inquiry from ${cleanName} (${cleanEmail})\nReference: ${reference}\nDestinations: ${destinations}\nMessage: ${cleanMessage}\nReply-To: ${cleanEmail}`
        });
        supportDeliveryStatus = 'DELIVERED';
      } catch (smtpErr: any) {
        console.warn('[api/inquire] Gmail SMTP dispatch error:', smtpErr?.message);
        customerDeliveryStatus = 'SMTP_ERROR';
        supportDeliveryStatus = 'SMTP_ERROR';
      }
    }

    // =========================================================================
    // 8. SECONDARY CARRIER: HTTP GATEWAY RELAY (If SMTP not configured)
    // Delivers directly via FormSubmit with full cross-linking
    // =========================================================================
    if (customerDeliveryStatus !== 'DELIVERED') {
      providerUsed = 'http_relay';

      // 1. Customer Dispatch
      try {
        const custRes = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(cleanEmail)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            _subject: `We Have Received Your Travel Inquiry — ${BUSINESS_NAME} [${reference}]`,
            _replyto: SUPPORT_EMAIL,
            _template: 'table',
            _captcha: 'false',
            'Inquiry Reference': reference,
            'Guest Name': cleanName,
            'Destination': destinations,
            'Inquiry Details': cleanMessage,
            'Next Steps': 'An expedition director will reply directly to your email within two business days.',
            'Support Contact': SUPPORT_EMAIL
          })
        });
        customerDeliveryStatus = custRes.ok ? 'DELIVERED' : `HTTP_${custRes.status}`;
      } catch (err: any) {
        customerDeliveryStatus = 'RELAY_OFFLINE';
      }

      // 2. Support Dispatch
      try {
        const suppRes = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(SUPPORT_EMAIL)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            _subject: `New Safari Inquiry from ${cleanName} [${reference}]`,
            _replyto: cleanEmail,
            _template: 'table',
            _captcha: 'false',
            'Inquiry Reference': reference,
            'Guest Name': cleanName,
            'Customer Email': cleanEmail,
            'Customer Phone': cleanPhone || 'Not provided',
            'Destination': destinations,
            'Message': cleanMessage,
            'Action': 'Click Reply in your email client to message this customer directly.'
          })
        });
        supportDeliveryStatus = suppRes.ok ? 'DELIVERED' : `HTTP_${suppRes.status}`;
      } catch (err: any) {
        supportDeliveryStatus = 'RELAY_OFFLINE';
      }
    }

    // 9. Return success response to client
    return res.status(200).json({
      success: true,
      reference,
      customerEmail: cleanEmail,
      supportEmail: SUPPORT_EMAIL,
      provider: providerUsed,
      delivery: {
        customer: customerDeliveryStatus,
        support: supportDeliveryStatus
      },
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
