const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

app.use(express.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded form data

// Import routes
const hostedRoute = require("./routes/stripe/hostedroute");
const embeddedRoute = require("./routes/stripe/embedded");

const allowedOrigins = [
  "https://nextgenautosparts.com",
  "http://localhost:3000",
];

// Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified origin.";
        return callback(new Error(msg), false);
      }

      return callback(null, true);
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204,
  })
); // Use CORS

app.get("/", (req, res) => {
  console.log("header host = ", req.headers.host);
  res.status(200).send("hello from backend.");
});

// Use routes
app.use("/hosted", hostedRoute);
app.use("/embedded", embeddedRoute);

// Starting Server on port provided by environment or default to 5002 for local development
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
