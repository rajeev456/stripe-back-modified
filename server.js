// Import necessary modules
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

// Create an Express application
const app = express();

// Automatically parse JSON bodies
app.use(express.json());

// Automatically parse URL-encoded form data
app.use(bodyParser.urlencoded({ extended: true }));

// Define the list of allowed origins for CORS
const allowedOrigins = [
  "https://nextgenautosparts.com",
  "https://testreact.marutisurakshaa.com",
  "http://localhost:3000",
];

// Configure and use CORS middleware to handle cross-origin requests
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Block requests from origins not listed in the allowedOrigins array
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = "The CORS policy for this site does not allow access from the specified Origin.";
      return callback(new Error(msg), false);
    }

    // Allow requests from origins found in the allowedOrigins array
    return callback(null, true);
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allowed HTTP methods
  credentials: true, // Allow cookies and credentials
  optionsSuccessStatus: 204 // Status to send for successful OPTIONS requests
}));

// Import routes
const hostedRoute = require("./routes/stripe/hostedroute");
const embeddedRoute = require("./routes/stripe/embedded");

// Basic route for home page
app.get("/", (req, res) => {
  res.status(200).send("Hello from backend.");
});

// Use imported routes
app.use("/hosted", hostedRoute);
app.use("/embedded", embeddedRoute);

// Start the server on the specified port or default to 5000 for local development
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
