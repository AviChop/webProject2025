const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const db = require("../data-access/restaurantDB");
const restaurantRoutes = require("../routes/restaurantRoutes");
const authRoutes = require("../routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

app.use("/api/restaurants", restaurantRoutes);
app.use("/auth", authRoutes);

// UI Routes
app.get("/", (req, res) => res.render("publicHome"));
app.get("/login", (req, res) => res.render("login"));
app.get("/register", (req, res) => res.render("register"));
app.get("/restaurants/search", (req, res) => res.render("form"));

app.get("/restaurants/form", async (req, res) => {
  const { page = 1, perPage = 5, borough = "" } = req.query;
  try {
    const restaurants = await db.getAllRestaurants(Number(page), Number(perPage), borough);
    res.render("results", { restaurants, borough });
  } catch (err) {
    console.error("Error loading restaurants:", err.message);
    res.status(500).send("Error loading restaurants");
  }
});

app.get("/logout", (req, res) => {
  res.redirect("/");
});

// Connect to MongoDB
db.initialize(process.env.MONGODB_CONN_STRING)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

module.exports = app;
module.exports.handler = serverless(app);
