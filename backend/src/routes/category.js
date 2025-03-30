const express = require("express");
const router = express.Router();

// Import the CRUD functions
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controller/category");
const authenticateToken = require("../middleware/authenticationToken");

// Middleware to authenticate and authorize us

// Routes
router.post("/", authenticateToken, createCategory); // Create a new category
router.get("/", getAllCategories); // Get all categories
router.get("/:id", authenticateToken, getCategoryById); // Get a category by ID
router.put("/:id", authenticateToken, updateCategory); // Update a category by ID
router.delete("/:id", authenticateToken, deleteCategory); // Delete a category by ID

module.exports = router;