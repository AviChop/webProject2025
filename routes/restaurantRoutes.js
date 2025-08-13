const express = require("express");
const router = express.Router();
const db = require("../data-access/restaurantDB");
const auth = require("../auth/auth");

// Protect POST route with JWT authentication
router.post("/", auth.verifyToken, async (req, res) => {
  try {
    const newRestaurant = await db.addNewRestaurant(req.body);
    res.status(201).json(newRestaurant);
  } catch (err) {
    console.error("POST /api/restaurants failed:", err.message);
    res.status(500).json({ error: "Failed to add restaurant" });
  }
});

router.get("/", async (req, res) => {
  const { page, perPage, borough } = req.query;
  try {
    const data = await db.getAllRestaurants(Number(page), Number(perPage), borough);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const restaurant = await db.getRestaurantById(req.params.id);
    if (!restaurant) return res.status(404).json({ error: "Not found" });
    res.json(restaurant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", auth.verifyToken, async (req, res) => {
  try {
    await db.updateRestaurantById(req.body, req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", auth.verifyToken, async (req, res) => {
  try {
    await db.deleteRestaurantById(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
