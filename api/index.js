require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("../data-access/restaurantDB");
const restaurantRoutes = require("../routes/restaurantRoutes");
const authRoutes = require("../routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// API routes
app.use("/api/restaurants", restaurantRoutes);
app.use("/auth", authRoutes);

// UI Routes
app.get("/", (req, res) => {
  res.render("publicHome");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/restaurants/search", (req, res) => {
  // Ideally check token here to allow access only to logged in users.
  res.render("form");
});

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

// Logout route
app.get("/logout", (req, res) => {
  // For JWT stored in localStorage, backend can't clear it.
  // But if you use cookies, clear here.
  // Just redirect to home page.
  res.redirect("/");
});

db.initialize(process.env.MONGODB_CONN_STRING)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize DB:", err);
  });
