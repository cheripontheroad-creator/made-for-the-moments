const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const prices = {
  song: "price_1TpzbsCXR2zkvmzjzbnwyrAN",
  card: "price_1TpzdcCXR2zkvmzjGi5bG8hE",
  bundle: "price_1TpzegCXR2zkvmzjnnH3PoOR"
};

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      product,
      orderNumber,
      customerEmail,
      customerName
    } = req.body || {};

    if (!product || !prices[product]) {
      return res.status(400).json({
        error: "Invalid product selected."
      });
    }

    if (!orderNumber) {
      return res.status(400).json({
        error: "Missing order number."
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      line_items: [
        {
          price: prices[product],
          quantity: 1
        }
      ],

      customer_email: customerEmail || undefined,

      client_reference_id: orderNumber,

      metadata: {
        order_number: orderNumber,
        product,
        customer_name: String(customerName || "").slice(0, 500),
        customer_email: String(customerEmail || "").slice(0, 500)
      },

      payment_intent_data: {
        metadata: {
          order_number: orderNumber,
          product
        }
      },

      success_url:
        "https://madeforthemomentspersonal.com/success.html?session_id={CHECKOUT_SESSION_ID}",

      cancel_url:
        "https://madeforthemomentspersonal.com/cancel.html"
    });

    return res.status(200).json({
      url: session.url,
      orderNumber
    });
  } catch (error) {
    console.error("Stripe Checkout error:", error);

    return res.status(500).json({
      error: "Unable to create the secure checkout session."
    });
  }
};
