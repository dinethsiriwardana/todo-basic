const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const todoRoutes = require("./routes/todos");

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/todos", todoRoutes);

// Home route with API documentation
app.get("/", (req, res) => {
  return res.status(200).json({ message: "/" });
});

// Server start
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
