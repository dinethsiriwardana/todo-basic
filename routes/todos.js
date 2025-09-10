const express = require("express");
const router = express.Router();
const sampleTodos = require("../data/todos");

// Initialize todos with sample data
let todos = [...sampleTodos];
let idCounter =
  todos.length > 0 ? Math.max(...todos.map((todo) => todo.id)) + 1 : 1;

// GET all todos with pagination, sorting, and filtering
router.get("/", (req, res) => {
  const userId = req.headers["user-id"] || req.headers["userid"];
  if (!userId) {
    return res.status(401).json({ message: "User ID required in header" });
  }

  // Pagination parameters
  const page = parseInt(req.query.page) || 1; // Default page is 1
  const limit = parseInt(req.query.limit) || 10; // Default limit is 10

  // Filtering parameters
  const { completed, search } = req.query;

  // Sorting parameters
  const sortBy = req.query.sortBy || "createdAt"; // Default sort by createdAt
  const sortOrder =
    req.query.sortOrder?.toLowerCase() === "asc" ? "asc" : "desc"; // Default sort order is descending

  // Filter todos if needed
  let filteredTodos = todos.filter((todo) => todo.userId === userId);

  // Filter by completion status if provided
  if (completed !== undefined) {
    const isCompleted = completed === "true";
    filteredTodos = filteredTodos.filter(
      (todo) => todo.completed === isCompleted
    );
  }

  // Filter by search term if provided
  if (search) {
    const searchTerm = search.toLowerCase();
    filteredTodos = filteredTodos.filter((todo) =>
      todo.title.toLowerCase().includes(searchTerm)
    );
  }

  // Sort todos
  filteredTodos.sort((a, b) => {
    if (sortOrder === "asc") {
      return a[sortBy] > b[sortBy] ? 1 : -1;
    } else {
      return a[sortBy] < b[sortBy] ? 1 : -1;
    }
  });

  // Calculate start and end indices
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  // Prepare pagination result
  const paginatedResult = {};

  // Add pagination metadata
  if (endIndex < filteredTodos.length) {
    paginatedResult.next = {
      page: page + 1,
      limit: limit,
    };
  }

  if (startIndex > 0) {
    paginatedResult.previous = {
      page: page - 1,
      limit: limit,
    };
  }

  // Add total count
  paginatedResult.total = filteredTodos.length;
  paginatedResult.totalPages = Math.ceil(filteredTodos.length / limit);
  paginatedResult.currentPage = page;

  // Add paginated data
  paginatedResult.data = filteredTodos.slice(startIndex, endIndex);

  res.json(paginatedResult);
});

// GET a specific todo by ID
router.get("/:id", (req, res) => {
  const userId = req.headers["user-id"] || req.headers["userid"];
  if (!userId) {
    return res.status(401).json({ message: "User ID required in header" });
  }

  const id = parseInt(req.params.id);
  const todo = todos.find((todo) => todo.id === id && todo.userId === userId);

  if (!todo) {
    return res.status(404).json({ message: "Todo not found" });
  }

  res.json(todo);
});

// POST create a new todo
router.post("/", (req, res) => {
  const userId = req.headers["user-id"] || req.headers["userid"];
  if (!userId) {
    return res.status(401).json({ message: "User ID required in header" });
  }

  const { title, completed = false } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  const newTodo = {
    id: idCounter++,
    userId,
    title,
    completed,
    createdAt: new Date(),
  };

  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// PUT update a todo
router.put("/:id", (req, res) => {
  const userId = req.headers["user-id"] || req.headers["userid"];
  if (!userId) {
    return res.status(401).json({ message: "User ID required in header" });
  }

  const id = parseInt(req.params.id);
  const { title, completed } = req.body;

  const todoIndex = todos.findIndex(
    (todo) => todo.id === id && todo.userId === userId
  );

  if (todoIndex === -1) {
    return res.status(404).json({ message: "Todo not found" });
  }

  const updatedTodo = {
    ...todos[todoIndex],
    ...(title && { title }),
    ...(completed !== undefined && { completed }),
    updatedAt: new Date(),
  };

  todos[todoIndex] = updatedTodo;
  res.json(updatedTodo);
});

// DELETE a todo
router.delete("/:id", (req, res) => {
  const userId = req.headers["user-id"] || req.headers["userid"];
  if (!userId) {
    return res.status(401).json({ message: "User ID required in header" });
  }

  const id = parseInt(req.params.id);
  const todoIndex = todos.findIndex(
    (todo) => todo.id === id && todo.userId === userId
  );

  if (todoIndex === -1) {
    return res.status(404).json({ message: "Todo not found" });
  }

  const deletedTodo = todos[todoIndex];
  todos = todos.filter((todo) => todo.id !== id);

  res.json(deletedTodo);
});

// DELETE clear all cached todos (reset to sample data)
router.delete("/clear/all", (req, res) => {
  // Reset todos to original sample data
  todos = [];
  idCounter = 1;

  res.json({ message: "All cached todos cleared and reset to sample data" });
});

module.exports = router;
