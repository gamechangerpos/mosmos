import { BusinessSettings, TripInquiry, TourBookingInquiry, InquiryStatus } from '../types';

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  text: string;
}

// Brand helper wrapper for luxury responsive HTML email
function wrapHtmlEmail(title: string, contentHtml: string, settings: BusinessSettings): string {
  const businessName = settings.businessName || 'MOS MOS Safaris';
  const supportEmail = settings.supportEmail || 'gamechangerpos@gmail.com';
  const websiteUrl = settings.websiteUrl || 'https://mosmossafaris.com';
  const year = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #F7F4ED; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #20221F; line-height: 1.6; }
    table { border-collapse: collapse; }
    .container { max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #D9D0C2; }
    .header { background-color: #20221F; padding: 36px 30px; text-align: center; }
    .brand-wordmark { font-family: Georgia, serif; font-size: 26px; letter-spacing: 0.2em; color: #F7F4ED; text-transform: uppercase; margin: 0; }
    .brand-subtitle { font-size: 10px; font-weight: 700; letter-spacing: 0.35em; color: #B69A68; text-transform: uppercase; margin-top: 4px; }
    .body { padding: 36px 32px; }
    .h1 { font-family: Georgia, serif; font-size: 24px; font-weight: 400; color: #20221F; margin: 0 0 16px 0; }
    .h2 { font-family: Georgia, serif; font-size: 18px; font-weight: 400; color: #78634B; margin: 24px 0 12px 0; border-bottom: 1px solid #E8E3D9; padding-bottom: 6px; }
    .lead { font-size: 15px; color: #20221F; margin-bottom: 20px; font-weight: 300; }
    .details-box { background-color: #F7F4ED; border: 1px solid #E4DDD1; padding: 18px 20px; margin: 20px 0; }
    .detail-row { padding: 6px 0; border-bottom: 1px solid #EBE5DA; font-size: 13px; }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { font-weight: 600; color: #78634B; display: inline-block; width: 140px; text-transform: uppercase; font-size: 11px; letter-spacing: 0.05em; }
    .detail-value { color: #20221F; }
    .badge { display: inline-block; padding: 4px 10px; font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; background-color: #20221F; color: #F7F4ED; }
    .badge-pending { background-color: #BA5F27; color: #FFFFFF; }
    .badge-confirmed { background-color: #2B6E4F; color: #FFFFFF; }
    .cta-button { display: inline-block; background-color: #20221F; color: #FFFFFF !important; text-decoration: none; padding: 12px 28px; font-size: 11px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; margin-top: 16px; }
    .disclaimer-box { background-color: #FFFDF9; border-left: 3px solid #B69A68; padding: 12px 16px; margin: 24px 0; font-size: 12px; color: #555555; }
    .footer { background-color: #20221F; color: #D9D0C2; padding: 28px 24px; text-align: center; font-size: 11px; line-height: 1.8; }
    .footer a { color: #B69A68; text-decoration: none; }
  </style>
</head>
<body>
  <div style="padding: 24px 12px;">
    <div class="container">
      <div class="header">
        <h1 class="brand-wordmark">${businessName}</h1>
        <div class="brand-subtitle">Private African Expeditions</div>
      </div>
      <div class="body">
        ${contentHtml}
      </div>
      <div class="footer">
        <p style="margin: 0 0 8px 0; font-weight: 600; color: #FFFFFF;">${businessName}</p>
        <p style="margin: 0 0 8px 0;">Official Wildlife Authority Direct Partner · Uganda · Rwanda · Kenya · Tanzania</p>
        <p style="margin: 0 0 12px 0;">Need immediate assistance? Contact <a href="mailto:${supportEmail}">${supportEmail}</a></p>
        <p style="margin: 0; font-size: 10px; color: #8A857A;">© ${year} ${businessName}. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

export const EmailTemplates = {
  // ============================================================================
  // PART 2 — CUSTOMER INQUIRY CONFIRMATION
  // ============================================================================
  customerInquiry(inquiry: TripInquiry, settings: BusinessSettings): EmailPayload {
    const businessName = settings.businessName || 'MOS MOS Safaris';
    const supportEmail = settings.supportEmail || 'gamechangerpos@gmail.com';
    const destinationStr = inquiry.destinations && inquiry.destinations.length > 0
      ? inquiry.destinations.join(', ')
      : 'East African Safari';

    const subject = `We Have Received Your Travel Inquiry — ${businessName}`;

    const text = `Hello ${inquiry.customerName},

Thank you for contacting ${businessName}.

We are pleased to let you know that our support team has successfully received your inquiry.

Here are the details of your submission:

Inquiry Reference: ${inquiry.reference}
Travel Interest: ${inquiry.travelStyle || 'Custom Safari Expedition'}
Destination: ${destinationStr}
Travel Dates: ${inquiry.travelDates || 'Flexible'}
Message: ${inquiry.notes || 'Custom itinerary requested'}

Our team will carefully review your inquiry and get back to you within two business days.

If we need additional information, a member of our team may contact you using the email address or phone number you provided.

Thank you for considering us for your travel experience.

Kind regards,

${businessName} Support Team
${supportEmail}`;

    const htmlContent = `
      <h2 class="h1">We Have Received Your Travel Inquiry</h2>
      <p class="lead">Hello ${inquiry.customerName},</p>
      <p>Thank you for contacting <strong>${businessName}</strong>.</p>
      <p>We are pleased to let you know that our support team has successfully received your safari inquiry.</p>

      <div class="details-box">
        <div class="detail-row">
          <span class="detail-label">Inquiry Reference:</span>
          <span class="detail-value" style="font-family: monospace; font-weight: 700; color: #78634B;">${inquiry.reference}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Travel Interest:</span>
          <span class="detail-value">${inquiry.travelStyle || 'Custom Expedition'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Destination:</span>
          <span class="detail-value">${destinationStr}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Travel Dates:</span>
          <span class="detail-value">${inquiry.travelDates || 'Flexible'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Message:</span>
          <span class="detail-value">${inquiry.notes || 'Tailored proposal requested'}</span>
        </div>
      </div>

      <p>Our expedition architects will carefully review your inquiry and get back to you within <strong>two business days</strong> with confirmed availability, vehicle allocations, and gorilla permit advisory.</p>
      <p>If we need additional information, a member of our team may contact you using the email address or phone number you provided.</p>

      <p style="margin-top: 24px;">Thank you for considering us for your travel experience.</p>

      <p style="margin-top: 24px; line-height: 1.4;">
        Kind regards,<br>
        <strong>${businessName} Support Team</strong><br>
        <span style="color: #78634B;">${supportEmail}</span>
      </p>
    `;

    return {
      to: inquiry.customerEmail,
      subject,
      text,
      html: wrapHtmlEmail(subject, htmlContent, settings)
    };
  },

  // ============================================================================
  // PART 2 — INTERNAL SUPPORT INQUIRY NOTIFICATION
  // ============================================================================
  supportInquiry(inquiry: TripInquiry, settings: BusinessSettings, customerId?: string): EmailPayload {
    const businessName = settings.businessName || 'MOS MOS Safaris';
    const supportEmail = settings.supportEmail || 'gamechangerpos@gmail.com';
    const websiteUrl = settings.websiteUrl || 'https://mosmossafaris.com';
    const adminUrl = `${websiteUrl}/admin`;

    const subject = `New Customer Inquiry — ${inquiry.reference}`;

    const text = `INTERNAL SUPPORT NOTIFICATION
=====================================================
New Customer Inquiry Received — ${inquiry.reference}
=====================================================

Customer Name: ${inquiry.customerName}
Customer Email: ${inquiry.customerEmail}
Customer Phone: ${inquiry.customerPhone || 'Not provided'}
Customer Account ID: ${customerId || 'Unregistered Guest'}
Inquiry Reference: ${inquiry.reference}
Inquiry Subject: ${inquiry.travelStyle || 'Safari Inquiry'}
Destination: ${inquiry.destinations?.join(', ') || 'Custom'}
Travel Dates: ${inquiry.travelDates || 'Not specified'}
Number of Travelers: ${inquiry.adultsCount} Adults, ${inquiry.childrenCount} Children
Budget Range: ${inquiry.budgetRange || 'Not specified'}
Submission Date/Time: ${new Date(inquiry.createdAt).toLocaleString()}

Full Customer Message:
${inquiry.notes || 'None provided'}

Secure Admin Link:
${adminUrl}
`;

    const htmlContent = `
      <div style="background-color: #20221F; color: #B69A68; padding: 10px 16px; font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 20px;">
        Internal Support Notification
      </div>
      <h2 class="h1">New Customer Inquiry — ${inquiry.reference}</h2>
      <p class="lead">A new customer inquiry has been submitted through the website.</p>

      <div class="details-box">
        <div class="detail-row">
          <span class="detail-label">Customer Name:</span>
          <span class="detail-value"><strong>${inquiry.customerName}</strong></span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Customer Email:</span>
          <span class="detail-value"><a href="mailto:${inquiry.customerEmail}">${inquiry.customerEmail}</a></span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Phone:</span>
          <span class="detail-value">${inquiry.customerPhone || 'Not provided'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Account ID:</span>
          <span class="detail-value font-mono">${customerId || 'Guest (Not Logged In)'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Destinations:</span>
          <span class="detail-value">${inquiry.destinations?.join(', ') || 'Custom'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Travel Dates:</span>
          <span class="detail-value">${inquiry.travelDates || 'Flexible'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Travelers:</span>
          <span class="detail-value">${inquiry.adultsCount} Adults ${inquiry.childrenCount ? `, ${inquiry.childrenCount} Children` : ''}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Submitted At:</span>
          <span class="detail-value">${new Date(inquiry.createdAt).toLocaleString()}</span>
        </div>
      </div>

      <div style="margin: 20px 0;">
        <p style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #78634B; margin-bottom: 6px;">Customer Message:</p>
        <div style="background-color: #F7F4ED; border-left: 3px solid #78634B; padding: 12px 16px; font-size: 13px; font-style: italic;">
          "${inquiry.notes || 'Custom itinerary requested'}"
        </div>
      </div>

      <div style="text-align: center; margin-top: 28px;">
        <a href="${adminUrl}" class="cta-button">Open in Admin Console</a>
      </div>
    `;

    return {
      to: supportEmail,
      subject,
      text,
      html: wrapHtmlEmail(subject, htmlContent, settings)
    };
  },

  // ============================================================================
  // PART 3 — CUSTOMER BOOKING CONFIRMATION
  // ============================================================================
  customerBooking(booking: TourBookingInquiry, settings: BusinessSettings, extra?: { destination?: string; experience?: string; duration?: string }): EmailPayload {
    const businessName = settings.businessName || 'MOS MOS Safaris';
    const supportEmail = settings.supportEmail || 'gamechangerpos@gmail.com';

    const subject = `Your Travel Booking Request Has Been Received — ${businessName}`;

    const destination = extra?.destination || 'East Africa';
    const tourName = booking.tourTitle || 'Custom Safari Expedition';
    const experience = extra?.experience || 'Primate Tracking & Classic Savanna';
    const travelDate = booking.preferredDate || 'To be scheduled';
    const duration = extra?.duration || '7-12 Days';
    const travelers = booking.travelersCount || 2;
    const specialRequests = booking.specialRequests || 'None';

    const text = `Hello ${booking.customerName},

Thank you for choosing ${businessName}.

We are happy to confirm that your travel booking request has been successfully submitted and received by our team.

Your booking is currently UNDER REVIEW.

Here are the details of your requested trip:

Booking Reference: ${booking.reference}
Destination: ${destination}
Tour or Package: ${tourName}
Travel Experience: ${experience}
Preferred Travel Date: ${travelDate}
Duration: ${duration}
Number of Travelers: ${travelers}
Additional Requests: ${specialRequests}
Booking Status: PENDING REVIEW

Our travel team will carefully review your request and contact you within two business days to discuss availability, arrangements, pricing, and the next steps.

Please note that this email confirms receipt of your booking request. It does not mean that your trip has been approved, reserved, or paid for.

We look forward to helping you plan an unforgettable experience.

Kind regards,

${businessName} Travel Team
${supportEmail}`;

    const htmlContent = `
      <h2 class="h1">Your Booking Request Has Been Received</h2>
      <p class="lead">Hello ${booking.customerName},</p>
      <p>Thank you for choosing <strong>${businessName}</strong>.</p>
      <p>We are happy to confirm that your travel booking request has been successfully submitted and received by our team.</p>

      <div style="margin: 16px 0;">
        <span class="badge badge-pending">Status: PENDING REVIEW</span>
      </div>

      <div class="details-box">
        <div class="detail-row">
          <span class="detail-label">Booking Reference:</span>
          <span class="detail-value" style="font-family: monospace; font-weight: 700; color: #78634B;">${booking.reference}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Destination:</span>
          <span class="detail-value">${destination}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Tour / Package:</span>
          <span class="detail-value"><strong>${tourName}</strong></span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Experience:</span>
          <span class="detail-value">${experience}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Preferred Date:</span>
          <span class="detail-value">${travelDate}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Duration:</span>
          <span class="detail-value">${duration}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Travelers:</span>
          <span class="detail-value">${travelers} Guests</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Special Requests:</span>
          <span class="detail-value">${specialRequests}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Booking Status:</span>
          <span class="detail-value font-bold" style="color: #BA5F27;">PENDING REVIEW</span>
        </div>
      </div>

      <p>Our travel team will carefully review your request and contact you within <strong>two business days</strong> to discuss availability, arrangements, pricing, and the next steps.</p>

      <div class="disclaimer-box">
        <strong>Important Booking Notice:</strong><br>
        Please note that this email confirms receipt of your booking request. It does not mean that your trip has been approved, reserved, or paid for. Primate permits and lodge allocations are secured once deposit is confirmed.
      </div>

      <p>We look forward to helping you plan an unforgettable experience.</p>

      <p style="margin-top: 24px; line-height: 1.4;">
        Kind regards,<br>
        <strong>${businessName} Travel Team</strong><br>
        <span style="color: #78634B;">${supportEmail}</span>
      </p>
    `;

    return {
      to: booking.customerEmail,
      subject,
      text,
      html: wrapHtmlEmail(subject, htmlContent, settings)
    };
  },

  // ============================================================================
  // PART 3 — INTERNAL SUPPORT BOOKING NOTIFICATION
  // ============================================================================
  supportBooking(booking: TourBookingInquiry, settings: BusinessSettings, customerId?: string, extra?: { destination?: string }): EmailPayload {
    const businessName = settings.businessName || 'MOS MOS Safaris';
    const supportEmail = settings.supportEmail || 'gamechangerpos@gmail.com';
    const websiteUrl = settings.websiteUrl || 'https://mosmossafaris.com';
    const adminUrl = `${websiteUrl}/admin`;

    const subject = `NEW BOOKING REQUEST — ${booking.reference}`;

    const text = `INTERNAL SUPPORT NOTIFICATION
=====================================================
NEW BOOKING REQUEST — ${booking.reference}
=====================================================

Booking Reference: ${booking.reference}
Customer Name: ${booking.customerName}
Customer Email: ${booking.customerEmail}
Customer Phone: ${booking.customerPhone || 'Not provided'}
Customer Account ID: ${customerId || 'Unregistered Guest'}
Selected Tour / Package: ${booking.tourTitle}
Destination: ${extra?.destination || 'East Africa'}
Requested Travel Date: ${booking.preferredDate}
Number of Travelers: ${booking.travelersCount}
Special Requests: ${booking.specialRequests || 'None'}
Submission Timestamp: ${new Date(booking.createdAt).toLocaleString()}
Current Booking Status: PENDING_REVIEW

Secure Admin Link:
${adminUrl}
`;

    const htmlContent = `
      <div style="background-color: #BA5F27; color: #FFFFFF; padding: 10px 16px; font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 20px;">
        High Priority: New Booking Submission
      </div>
      <h2 class="h1">NEW BOOKING REQUEST — ${booking.reference}</h2>
      <p class="lead">A guest has submitted a booking reservation request awaiting review.</p>

      <div class="details-box">
        <div class="detail-row">
          <span class="detail-label">Booking Reference:</span>
          <span class="detail-value font-mono font-bold" style="color: #BA5F27;">${booking.reference}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Customer:</span>
          <span class="detail-value"><strong>${booking.customerName}</strong></span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Email:</span>
          <span class="detail-value"><a href="mailto:${booking.customerEmail}">${booking.customerEmail}</a></span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Phone:</span>
          <span class="detail-value">${booking.customerPhone || 'Not provided'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Account ID:</span>
          <span class="detail-value font-mono">${customerId || 'Guest'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Tour / Package:</span>
          <span class="detail-value"><strong>${booking.tourTitle}</strong></span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Travel Date:</span>
          <span class="detail-value">${booking.preferredDate}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Travelers:</span>
          <span class="detail-value">${booking.travelersCount} Guests</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Status:</span>
          <span class="badge badge-pending">PENDING_REVIEW</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Submitted At:</span>
          <span class="detail-value">${new Date(booking.createdAt).toLocaleString()}</span>
        </div>
      </div>

      <div style="margin: 20px 0;">
        <p style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #78634B; margin-bottom: 6px;">Special Requirements:</p>
        <div style="background-color: #F7F4ED; border-left: 3px solid #BA5F27; padding: 12px 16px; font-size: 13px;">
          ${booking.specialRequests || 'No special requests provided'}
        </div>
      </div>

      <div style="text-align: center; margin-top: 28px;">
        <a href="${adminUrl}" class="cta-button">Review Booking in Admin Console</a>
      </div>
    `;

    return {
      to: supportEmail,
      subject,
      text,
      html: wrapHtmlEmail(subject, htmlContent, settings)
    };
  },

  // ============================================================================
  // PART 4 — BOOKING STATUS UPDATES
  // ============================================================================
  statusUpdate(inquiry: TripInquiry, oldStatus: InquiryStatus, newStatus: InquiryStatus, settings: BusinessSettings, adminMessage?: string): EmailPayload {
    const businessName = settings.businessName || 'MOS MOS Safaris';
    const supportEmail = settings.supportEmail || 'gamechangerpos@gmail.com';
    const websiteUrl = settings.websiteUrl || 'https://mosmossafaris.com';
    const trackerUrl = `${websiteUrl}/booking/${inquiry.reference}`;

    const subject = `Update Regarding Your Safari Reservation [${inquiry.reference}] — ${businessName}`;

    let statusDescription = 'Your expedition status has been updated by our safari architects.';
    if (newStatus === 'APPROVED' || newStatus === 'Confirmed') {
      statusDescription = 'We are thrilled to let you know that your safari itinerary and provisional permits have been approved!';
    } else if (newStatus === 'AWAITING_PAYMENT' || newStatus === 'Deposit pending') {
      statusDescription = 'Your quotation is prepared and permits are provisionally locked. A 30% deposit is requested to finalize all national park allocations.';
    } else if (newStatus === 'REJECTED' || newStatus === 'Cancelled') {
      statusDescription = 'Regarding your reservation request, we regret to inform you that we are currently unable to confirm this specific arrangement due to seasonal park quotas or lodge availability.';
    }

    const text = `Hello ${inquiry.customerName},

We are writing with an update regarding your travel reservation with ${businessName}.

Booking Reference: ${inquiry.reference}
Previous Status: ${oldStatus}
New Status: ${newStatus}

${statusDescription}

${adminMessage ? `Specialist Note:\n${adminMessage}\n` : ''}
${inquiry.quotedAmount ? `Quoted Total: $${inquiry.quotedAmount.toLocaleString()} USD\n` : ''}

You can review your complete itinerary and live status online at:
${trackerUrl}

If you have any questions, our support team is available at ${supportEmail}.

Kind regards,

${businessName} Expedition Directorate
${supportEmail}`;

    const htmlContent = `
      <h2 class="h1">Safari Expedition Status Update</h2>
      <p class="lead">Hello ${inquiry.customerName},</p>
      <p>We are writing to provide an update regarding your safari reservation with <strong>${businessName}</strong>.</p>

      <div class="details-box">
        <div class="detail-row">
          <span class="detail-label">Reference Code:</span>
          <span class="detail-value font-mono font-bold" style="color: #78634B;">${inquiry.reference}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Updated Status:</span>
          <span class="detail-value font-bold" style="color: #20221F; text-transform: uppercase;">${newStatus}</span>
        </div>
        ${inquiry.quotedAmount ? `
        <div class="detail-row">
          <span class="detail-label">Quotation:</span>
          <span class="detail-value font-bold" style="color: #20221F;">$${inquiry.quotedAmount.toLocaleString()} USD</span>
        </div>` : ''}
      </div>

      <p>${statusDescription}</p>

      ${adminMessage ? `
      <div style="background-color: #F7F4ED; border-left: 3px solid #78634B; padding: 14px 18px; margin: 20px 0; font-size: 13px;">
        <strong>Specialist Notes:</strong><br>
        "${adminMessage}"
      </div>` : ''}

      <div style="text-align: center; margin: 30px 0;">
        <a href="${trackerUrl}" class="cta-button">View Live Expedition Tracker</a>
      </div>

      <p style="font-size: 12px; color: #666666;">
        If you have questions regarding this update, reply directly to this message or contact <a href="mailto:${supportEmail}">${supportEmail}</a>.
      </p>

      <p style="margin-top: 24px; line-height: 1.4;">
        Kind regards,<br>
        <strong>${businessName} Expedition Directorate</strong><br>
        <span style="color: #78634B;">${supportEmail}</span>
      </p>
    `;

    return {
      to: inquiry.customerEmail,
      subject,
      text,
      html: wrapHtmlEmail(subject, htmlContent, settings)
    };
  },

  // ============================================================================
  // TEST NOTIFICATION FOR ADMINS
  // ============================================================================
  testEmail(settings: BusinessSettings, adminEmail: string): EmailPayload {
    const businessName = settings.businessName || 'MOS MOS Safaris';
    const subject = `[TEST] Email Delivery Verification — ${businessName}`;

    const text = `This is a test notification generated from the ${businessName} Admin Dashboard.
Timestamp: ${new Date().toISOString()}
Configured Support Email: ${settings.supportEmail}
Configured Admin Email: ${settings.adminEmail}
Status: System operational.`;

    const htmlContent = `
      <h2 class="h1">Email Delivery Verification</h2>
      <p class="lead">This is an automated test notification generated from the <strong>${businessName}</strong> Admin Dashboard.</p>
      
      <div class="details-box">
        <div class="detail-row">
          <span class="detail-label">Timestamp:</span>
          <span class="detail-value font-mono">${new Date().toISOString()}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Support Email:</span>
          <span class="detail-value">${settings.supportEmail}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Admin Email:</span>
          <span class="detail-value">${settings.adminEmail}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Delivery Provider:</span>
          <span class="detail-value">${settings.providerType}</span>
        </div>
      </div>

      <p>If you are receiving this message, your email notification configuration is active and communicating properly.</p>
    `;

    return {
      to: adminEmail,
      subject,
      text,
      html: wrapHtmlEmail(subject, htmlContent, settings)
    };
  }
};
