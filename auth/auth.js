const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;
const JWT_SECRET = process.env.JWT_SECRET || "yourSuperSecretJWTKey";

// In-memory users
const users = [];

async function register(username, password) {
  if (users.find((u) => u.username === username)) {
    throw new Error("User already exists");
  }
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  users.push({ username, password: hashedPassword });
  return true;
}

async function login(username, password) {
  const user = users.find((u) => u.username === username);
  if (!user) throw new Error("Invalid username or password");

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) throw new Error("Invalid username or password");

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });
  return token;
}

// Middleware to verify JWT in Authorization header
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1]; // Expecting "Bearer TOKEN"
  if (!token) return res.status(401).json({ error: "Malformed token" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });

    req.user = decoded; // Add decoded payload to request object
    next();
  });
}

module.exports = {
  register,
  login,
  verifyToken,
  users // export users for session login check
};
