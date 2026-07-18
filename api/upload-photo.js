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

    const jsonResponse = await handleUpload({
      body: req.body,
      request: req,

      onBeforeGenerateToken: async (
        pathname,
        clientPayload
      ) => {
        let payload = {};

        try {
          payload = clientPayload
            ? JSON.parse(clientPayload)
            : {};
        } catch {
          throw new Error(
            "The photo upload information is invalid."
          );
        }

        const orderNumber = String(
          payload.orderNumber || ""
        );

        if (
          !/^MFTM-\d{8}-[A-Z0-9]{6}$/.test(
            orderNumber
          )
        ) {
          throw new Error(
            "The photo upload has an invalid order number."
          );
        }

        const requiredPrefix =
          `orders/${orderNumber}/`;

        if (!pathname.startsWith(requiredPrefix)) {
          throw new Error(
            "The photo storage path is invalid."
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
            orderNumber
          })
        };
      },

      onUploadCompleted: async ({
        blob,
        tokenPayload
      }) => {
        console.log(
          "Order photo successfully uploaded:",
          {
            pathname: blob.pathname,
            tokenPayload
          }
        );
      }
    });

    return res.status(200).json(
      jsonResponse
    );
  } catch (error) {
    console.error(
      "Photo upload authorization error:",
      error
    );

    return res.status(400).json({
      error:
        error instanceof Error
          ? error.message
          : "The photo could not be uploaded."
    });
  }
};
