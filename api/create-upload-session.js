const crypto = require("crypto");

const TOKEN_LIFETIME_SECONDS = 15 * 60;

function sign(value) {
  const secret = process.env.PHOTO_LINK_SECRET;

  if (!secret) {
    throw new Error("PHOTO_LINK_SECRET is not configured.");
  }

  return crypto
    .createHmac("sha256", secret)
    .update(value)
    .digest("base64url");
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");

    return res.status(405).json({
      error: "Method not allowed."
    });
  }

  try {
    const {
      orderNumber,
      customerEmail,
      product
    } = req.body || {};

    if (
      !orderNumber ||
      !/^MFTM-\d{8}-[A-Z0-9]{6}$/.test(orderNumber)
    ) {
      return res.status(400).json({
        error: "Invalid order number."
      });
    }

    const normalizedEmail = String(customerEmail || "")
      .trim()
      .toLowerCase();

    if (
      !normalizedEmail ||
      !normalizedEmail.includes("@")
    ) {
      return res.status(400).json({
        error: "A valid email address is required."
      });
    }

    if (!["card", "bundle"].includes(product)) {
      return res.status(400).json({
        error: "Photo uploads are not required for this product."
      });
    }

    const expires = Math.floor(Date.now() / 1000)
      + TOKEN_LIFETIME_SECONDS;

    const payload = {
      orderNumber,
      customerEmail: normalizedEmail,
      product,
      expires
    };

    const encodedPayload = Buffer.from(
      JSON.stringify(payload)
    ).toString("base64url");

    const signature = sign(encodedPayload);

    return res.status(200).json({
      success: true,
      uploadToken: `${encodedPayload}.${signature}`,
      expires
    });
  } catch (error) {
    console.error("Create upload session error:", error);

    return res.status(500).json({
      error: "Unable to authorize the photo upload."
    });
  }
};
