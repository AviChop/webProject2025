const express = require("express");
const router = express.Router();
const auth = require("../auth/auth");

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    await auth.register(username, password);
    res.status(201).json({ message: "User registered" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const token = await auth.login(username, password);
    res.json({ token });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

module.exports = router;
