const stripe = require("stripe")(
  "sk_test_51OyW8kFeO7aw5wH94zmD7uVAHDdl4nDA20QyglMPicPVn88yPcKSEcUhBRyUe6fx2fFdRmHc0eG3b3DzO7u1pPB900LFzBrFJP"
);
const express = require("express");
const router = express();

router.use(express.json()); // Parse JSON bodies

router.post("/create-checkout-session", async (req, res) => {
  try {
    const product = await stripe.products.create({
      name: req.body.product,
    });

    if (!product) {
      throw new Error("Product creation failed");
    }

    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: req.body.amount * 100,
      currency: "inr",
    });

    if (!price) {
      throw new Error("Price creation failed");
    }

    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      customer_email: "sjsr1995@gmail.com",
      mode: "payment",
      success_url: `https://testreact.marutisurakshaa.com/return?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: "https://testreact.marutisurakshaa.com/cancel",
    });

    console.log(session);
    res.json({ clientSecret: session.client_secret });
  } catch (error) {
    console.error("Error in creating checkout session:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/session-status", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(
      req.query.session_id
    );
    console.log(session);
    res.json({
      status: session.status,
      customer_email: session.customer_details.email,
    });
  } catch (error) {
    console.error("Error in retrieving session status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
