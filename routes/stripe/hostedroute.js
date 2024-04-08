const express = require("express");
const stripe = require("stripe")(
  "sk_test_51OyW8kFeO7aw5wH94zmD7uVAHDdl4nDA20QyglMPicPVn88yPcKSEcUhBRyUe6fx2fFdRmHc0eG3b3DzO7u1pPB900LFzBrFJP"
);
const router = express.Router();

router.post("/create-checkout-session", async (req, res) => {
  try {
    const product = await stripe.products.create({
      name: req.body.product_name,
    });

    if (!product) {
      throw new Error("Failed to create product");
    }

    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: req.body.amount * 100,
      currency: "usd",
    });

    if (!price) {
      throw new Error("Failed to create price");
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "https://nodetest.marutisurakshaa.com/hosted/success",
      cancel_url: "https://nodetest.marutisurakshaa.com/hosted/cancel",
    });
    res.status(200);
    res.json({ sessionUrl: session?.url });
    // return res.redirect(303, session?.url);
  } catch (error) {
    console.error("Error creating checkout session:", error.message);
    res.status(500).json({ error: error.message });
  }
});

router.get("/success", async (req, res) => {
  try {
    return res.redirect("https://testreact.marutisurakshaa.com/success");
  } catch (error) {
    console.error("error in success", error);
    return res.status(500).json({ message: "internal server error" });
  }
});

router.get("/cancel", async (req, res) => {
  try {
    return res.redirect("https://testreact.marutisurakshaa.com/failure");
  } catch (error) {
    console.error("error in cancel", error);
    return res.status(500).json({ message: "internal server error" });
  }
});

module.exports = router;
