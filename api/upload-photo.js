const crypto = require("crypto");

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

function safeEqual(left, right) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(
    leftBuffer,
    rightBuffer
  );
}

function verifyUploadToken(token) {
  const parts = String(token || "").split(".");

  if (parts.length !== 2) {
    throw new Error("Invalid upload authorization.");
  }

  const [encodedPayload, suppliedSignature] = parts;
  const expectedSignature = sign(encodedPayload);

  if (
    !safeEqual(
      suppliedSignature,
      expectedSignature
    )
  ) {
    throw new Error("Invalid upload authorization.");
  }

  const payload = JSON.parse(
    Buffer.from(
      encodedPayload,
      "base64url"
    ).toString("utf8")
  );

  if (
    !payload.expires ||
    payload.expires < Math.floor(Date.now() / 1000)
  ) {
    throw new Error("The upload authorization has expired.");
  }

  return payload;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");

    return res.status(405).json({
      error: "Method not allowed."
    });
  }

  try {
    const { handleUpload } = await import(
      "@vercel/blob/client"
    );

    const body = req.body;

    const jsonResponse = await handleUpload({
      body,
      request: req,

      onBeforeGenerateToken: async (
        pathname,
        clientPayload
      ) => {
        if (!clientPayload) {
          throw new Error(
            "Missing upload authorization."
          );
        }

        let suppliedData;

        try {
          suppliedData = JSON.parse(clientPayload);
        } catch {
          throw new Error(
            "Invalid upload information."
          );
        }

        const authorization = verifyUploadToken(
          suppliedData.uploadToken
        );

        if (
          suppliedData.orderNumber !==
          authorization.orderNumber
        ) {
          throw new Error(
            "The upload does not match this order."
          );
        }

        const requiredPrefix =
          `orders/${authorization.orderNumber}/`;

        if (!pathname.startsWith(requiredPrefix)) {
          throw new Error(
            "Invalid photo storage location."
          );
        }

        return {
          allowedContentTypes: [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/heic",
            "image/heif"
          ],

          maximumSizeInBytes:
            25 * 1024 * 1024,

          addRandomSuffix: true,

          tokenPayload: JSON.stringify({
            orderNumber:
              authorization.orderNumber,

            customerEmail:
              authorization.customerEmail
          })
        };
      },

      onUploadCompleted: async ({
        blob,
        tokenPayload
      }) => {
        console.log(
          "Private order photo uploaded:",
          {
            pathname: blob.pathname,
            tokenPayload
          }
        );
      }
    });

    return res.status(200).json(jsonResponse);
  } catch (error) {
    console.error("Photo upload error:", error);

    return res.status(400).json({
      error:
        error.message ||
        "The photo could not be uploaded."
    });
  }
};
