const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const prices = {
  song: "price_1TpzbsCXR2zkvmzjzbnwyrAN",
  card: "price_1TpzdcCXR2zkvmzjGi5bG8hE",
  bundle: "price_1TpzegCXR2zkvmzjnnH3PoOR"
};

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { product } = req.body;

    if (!product || !prices[product]) {
      return res.status(400).json({ error: "Invalid product selected." });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price: prices[product],
          quantity: 1
        }
      ],
      success_url: "https://madeforthemomentspersonal.com/success.html",
      cancel_url: "https://madeforthemomentspersonal.com/cancel.html"
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
