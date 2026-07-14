const { Resend } = require("resend");
const crypto = require("crypto");

const resend = new Resend(process.env.RESEND_API_KEY);

const BUSINESS_EMAIL = "yourmadeforthemoments@gmail.com";
const FROM_EMAIL =
  "Made for the Moments <orders@madeforthemomentspersonal.com>";

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function displayValue(value) {
  const cleaned = String(value ?? "").trim();
  return cleaned || "Not provided";
}

function createOrderNumber() {
  const date = new Date();
  const datePart = date.toISOString().slice(0, 10).replaceAll("-", "");
  const randomPart = crypto.randomBytes(3).toString("hex").toUpperCase();

  return `MFTM-${datePart}-${randomPart}`;
}

function row(label, value) {
  return `
    <tr>
      <td style="
        width: 190px;
        padding: 10px 12px;
        border-bottom: 1px solid #eadde7;
        vertical-align: top;
        font-weight: 700;
        color: #7b2c58;
      ">
        ${escapeHtml(label)}
      </td>

      <td style="
        padding: 10px 12px;
        border-bottom: 1px solid #eadde7;
        vertical-align: top;
        color: #2c2430;
        white-space: pre-wrap;
      ">
        ${escapeHtml(displayValue(value))}
      </td>
    </tr>
  `;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const order = req.body || {};

    const customerName = displayValue(order.customerName);
    const customerEmail = String(order.customerEmail || "")
      .trim()
      .toLowerCase();

    const product = displayValue(order.product);
    const productName = displayValue(order.productName);
    const orderNumber = order.orderNumber || createOrderNumber();

    if (!customerEmail || !customerEmail.includes("@")) {
      return res.status(400).json({
        error: "A valid customer email address is required."
      });
    }

    if (!order.product) {
      return res.status(400).json({
        error: "A product selection is required."
      });
    }

    const mailingAddress = [
      order.mailName,
      order.street,
      order.apt,
      order.city,
      order.state,
      order.zip
    ]
      .filter(Boolean)
      .join("\n");

    const ownerEmailHtml = `
      <!DOCTYPE html>
      <html lang="en">
        <body style="
          margin: 0;
          padding: 24px;
          background: #fff7fa;
          font-family: Arial, Helvetica, sans-serif;
          color: #251d2b;
        ">
          <div style="
            max-width: 760px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 18px;
            overflow: hidden;
            box-shadow: 0 12px 30px rgba(74, 38, 70, 0.12);
          ">
            <div style="
              padding: 28px;
              text-align: center;
              background: #eef7ff;
              border-bottom: 4px solid #d94370;
            ">
              <h1 style="
                margin: 0 0 8px;
                color: #7b2c58;
                font-size: 28px;
              ">
                New Made for the Moments Order
              </h1>

              <p style="
                margin: 0;
                color: #5f5265;
                font-size: 17px;
              ">
                Order ${escapeHtml(orderNumber)}
              </p>
            </div>

            <div style="padding: 28px;">
              <div style="
                background: #fff3f9;
                border-left: 5px solid #d94370;
                border-radius: 12px;
                padding: 16px;
                margin-bottom: 24px;
              ">
                <strong>Product:</strong>
                ${escapeHtml(productName)}
                <br>

                <strong>Price:</strong>
                ${escapeHtml(displayValue(order.price))}
                <br>

                <strong>Payment:</strong>
                Customer is being redirected to Stripe Checkout
              </div>

              <h2 style="color: #7b2c58;">Customer Information</h2>

              <table style="
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 26px;
              ">
                ${row("Customer Name", order.customerName)}
                ${row("Customer Email", order.customerEmail)}
                ${row("Phone Number", order.customerPhone)}
              </table>

              <h2 style="color: #7b2c58;">Recipient and Occasion</h2>

              <table style="
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 26px;
              ">
                ${row("Recipient", order.recipientName)}
                ${row("Occasion", order.occasion)}
                ${row("Other Occasion", order.otherOccasion)}
                ${row("Needed By", order.requestedDate)}
              </table>

              <h2 style="color: #7b2c58;">Story</h2>

              <div style="
                white-space: pre-wrap;
                background: #fffaf5;
                border: 1px solid #ead9c4;
                border-radius: 12px;
                padding: 18px;
                line-height: 1.65;
                margin-bottom: 26px;
              ">
                ${escapeHtml(displayValue(order.sharedStory))}
              </div>

              ${
                product === "song" || product === "bundle"
                  ? `
                    <h2 style="color: #7b2c58;">Song Details</h2>

                    <table style="
                      width: 100%;
                      border-collapse: collapse;
                      margin-bottom: 26px;
                    ">
                      ${row("Song Style", order.songStyle)}
                      ${row("Other Song Style", order.otherSongStyle)}
                      ${row("Mood", order.songMood)}
                      ${row("Preferred Singer", order.vocalStyle)}
                      ${row("Do Not Include", order.songAvoid)}
                    </table>
                  `
                  : ""
              }

              ${
                product === "card" || product === "bundle"
                  ? `
                    <h2 style="color: #7b2c58;">Greeting Card Details</h2>

                    <table style="
                      width: 100%;
                      border-collapse: collapse;
                      margin-bottom: 26px;
                    ">
                      ${row("Card Style", order.cardStyle)}
                      ${row("Favorite Colors", order.favoriteColors)}
                      ${row("Delivery Choice", order.mailChoice)}
                      ${row(
                        "Photo Files Selected",
                        Array.isArray(order.photoNames)
                          ? order.photoNames.join(", ")
                          : order.photoNames
                      )}
                    </table>

                    <h2 style="color: #7b2c58;">Mailing or Walgreens Address</h2>

                    <div style="
                      white-space: pre-wrap;
                      background: #fffaf5;
                      border: 1px solid #ead9c4;
                      border-radius: 12px;
                      padding: 18px;
                      line-height: 1.65;
                      margin-bottom: 26px;
                    ">
                      ${escapeHtml(displayValue(mailingAddress))}
                    </div>
                  `
                  : ""
              }

              <h2 style="color: #7b2c58;">Additional Requests</h2>

              <div style="
                white-space: pre-wrap;
                background: #fffaf5;
                border: 1px solid #ead9c4;
                border-radius: 12px;
                padding: 18px;
                line-height: 1.65;
              ">
                ${escapeHtml(displayValue(order.additionalNotes))}
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const customerEmailHtml = `
      <!DOCTYPE html>
      <html lang="en">
        <body style="
          margin: 0;
          padding: 24px;
          background: #fff7fa;
          font-family: Arial, Helvetica, sans-serif;
          color: #251d2b;
        ">
          <div style="
            max-width: 620px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 18px;
            overflow: hidden;
            box-shadow: 0 12px 30px rgba(74, 38, 70, 0.12);
          ">
            <div style="
              padding: 28px;
              text-align: center;
              background: #eef7ff;
              border-bottom: 4px solid #d94370;
            ">
              <h1 style="
                margin: 0;
                color: #7b2c58;
                font-size: 28px;
              ">
                Thank You for Your Order
              </h1>
            </div>

            <div style="
              padding: 30px;
              line-height: 1.65;
            ">
              <p>Hi ${escapeHtml(customerName)},</p>

              <p>
                Thank you for choosing Made for the Moments.
                We received the information for your personalized creation.
              </p>

              <div style="
                background: #fff3f9;
                border-left: 5px solid #d94370;
                border-radius: 12px;
                padding: 18px;
                margin: 22px 0;
              ">
                <strong>Order number:</strong>
                ${escapeHtml(orderNumber)}
                <br>

                <strong>Product:</strong>
                ${escapeHtml(productName)}
                <br>

                <strong>Needed by:</strong>
                ${escapeHtml(displayValue(order.requestedDate))}
              </div>

              <p>
                You will be taken to Stripe's secure checkout page to
                complete payment. Your order will begin after payment
                has been successfully completed.
              </p>

              <p>
                Please keep your order number for your records. If I
                have questions about your story, song, greeting card,
                photos, or delivery information, I will contact you.
              </p>

              <p style="margin-top: 28px;">
                Thank you,<br>
                <strong>Made for the Moments</strong><br>
                Personalized Songs &amp; Greeting Cards
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    const ownerResult = await resend.emails.send({
      from: FROM_EMAIL,
      to: [BUSINESS_EMAIL],
      replyTo: customerEmail,
      subject: `New Order ${orderNumber}: ${productName}`,
      html: ownerEmailHtml
    });

    if (ownerResult.error) {
      console.error("Owner email error:", ownerResult.error);

      return res.status(500).json({
        error: "The order email could not be sent."
      });
    }

    const customerResult = await resend.emails.send({
      from: FROM_EMAIL,
      to: [customerEmail],
      replyTo: BUSINESS_EMAIL,
      subject: `Your Made for the Moments Order ${orderNumber}`,
      html: customerEmailHtml
    });

    if (customerResult.error) {
      console.error(
        "Customer confirmation email error:",
        customerResult.error
      );

      // The business email was already sent, so do not discard the order.
      return res.status(200).json({
        success: true,
        orderNumber,
        warning:
          "The order was received, but the customer confirmation email could not be sent."
      });
    }

    return res.status(200).json({
      success: true,
      orderNumber
    });
  } catch (error) {
    console.error("Send order error:", error);

    return res.status(500).json({
      error: "Unable to send the order information."
    });
  }
};
