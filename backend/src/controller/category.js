const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create a new category
const createCategory = async (req, res) => {
  const data = req.body;

  const role = req.user.role;

  try {
    if (role !== "RESPONSABLE") {
      return res
        .status(401)
        .json({ error: "Unauthorized: Only RESPONSABLE can add categories" });
    }

    const category = await prisma.category.create({
      data: {
        ...data,
      },
    });

    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create category" });
  }
};

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

// Get a single category by ID
const getCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
    });
    res.status(200).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch category" });
  }
};

// Update a category by ID
const updateCategory = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const role = req.user.role;

  try {
    if (role !== "RESPONSABLE") {
      return res.status(401).json({
        error: "Unauthorized: Only RESPONSABLE can update categories",
      });
    }

    const updatedCategory = await prisma.category.update({
      where: { id: parseInt(id) },
      data: {
        ...data,
      },
    });

    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update category" });
  }
};

// Delete a category by ID
const deleteCategory = async (req, res) => {
  const { id } = req.params;

  const role = req.user.role;

  try {
    if (role !== "RESPONSABLE") {
      return res.status(401).json({
        error: "Unauthorized: Only RESPONSABLE can delete categories",
      });
    }

    const deletedCategory = await prisma.category.delete({
      where: { id: parseInt(id) },
    });

    res
      .status(200)
      .json({ message: "Category deleted successfully", deletedCategory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete category" });
  }
};

module.exports = {
  getAllCategories,
  deleteCategory,
  updateCategory,
  createCategory,
  getCategoryById,
};
