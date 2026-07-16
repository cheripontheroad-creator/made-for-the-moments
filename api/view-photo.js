const crypto = require("crypto");
const { Readable } = require("node:stream");

function signPhoto(pathname, expires) {
  const secret = process.env.PHOTO_LINK_SECRET;

  if (!secret) {
    throw new Error(
      "PHOTO_LINK_SECRET is not configured."
    );
  }

  return crypto
    .createHmac("sha256", secret)
    .update(`${pathname}|${expires}`)
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

function getQueryValue(value) {
  return Array.isArray(value) ? value[0] : value;
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");

    return res.status(405).json({
      error: "Method not allowed."
    });
  }

  try {
    const pathname = getQueryValue(
      req.query.pathname
    );

    const expiresText = getQueryValue(
      req.query.expires
    );

    const suppliedSignature = getQueryValue(
      req.query.signature
    );

    if (
      !pathname ||
      !expiresText ||
      !suppliedSignature
    ) {
      return res.status(400).send(
        "This photo link is incomplete."
      );
    }

    if (!pathname.startsWith("orders/")) {
      return res.status(403).send(
        "This photo link is not authorized."
      );
    }

    const expires = Number(expiresText);

    if (
      !Number.isFinite(expires) ||
      expires < Math.floor(Date.now() / 1000)
    ) {
      return res.status(403).send(
        "This photo link has expired."
      );
    }

    const expectedSignature = signPhoto(
      pathname,
      expires
    );

    if (
      !safeEqual(
        suppliedSignature,
        expectedSignature
      )
    ) {
      return res.status(403).send(
        "This photo link is not valid."
      );
    }

    const { get } = await import("@vercel/blob");

    const result = await get(pathname, {
      access: "private",
      useCache: false
    });

    if (!result || result.statusCode !== 200) {
      return res.status(404).send(
        "The photo could not be found."
      );
    }

    const filename =
      pathname.split("/").pop()
      || "order-photo";

    res.setHeader(
      "Content-Type",
      result.blob.contentType
      || "application/octet-stream"
    );

    res.setHeader(
      "Content-Disposition",
      `inline; filename="${filename.replaceAll('"', "")}"`
    );

    res.setHeader(
      "Cache-Control",
      "private, no-store"
    );

    res.setHeader(
      "X-Content-Type-Options",
      "nosniff"
    );

    Readable
      .fromWeb(result.stream)
      .pipe(res);
  } catch (error) {
    console.error("View photo error:", error);

    if (!res.headersSent) {
      return res.status(500).send(
        "The photo could not be opened."
      );
    }
  }
};
