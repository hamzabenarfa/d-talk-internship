const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getSujetById = async (req, res) => {
  const { id } = req.params;
  try {
    const sujet = await prisma.sujet.findUnique({
      where: { id: parseInt(id) },
    });
    if (sujet) {
      res.json(sujet);
    } else {
      res.status(404).json({ error: "Sujet not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sujet" });
  }
};

const getSujet = async (req, res) => {
  try {
    const sujet = await prisma.sujet.findMany();
    res.json(sujet);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sujet" });
  }
};
const createSujet = async (req, res) => {
  const sujets = req.body;
  const userId = req.user.id;
  const role = req.user.role;
  try {
    if (role !== "RESPONSABLE") {
      return res
        .status(401)
        .json({ error: "Unauthorized Only ADMIN can add sujet" });
    }

    const sujet = await prisma.sujet.create({
      data: {
        ...sujets,

        userId,
      },
    });
    res.status(201).json(sujet);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create sujet" });
  }
};

const updateSujet = async (req, res) => {
  const { id } = req.params;
  const sujet = req.body;
  try {
    const updatedSujet = await prisma.sujet.update({
      where: { id: parseInt(id) },
      data: sujet,
    });
    res.json(updatedSujet);
  } catch (error) {
    res.status(500).json({ error: "Failed to update sujet" });
  }
};

const deleteSujet = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.sujet.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Sujet deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete sujet" });
  }
};

const getMySujet = async (req, res) => {
  const userId = req.user.id;
  try {
    const sujet = await prisma.sujet.findMany({
      where: {
        userId,
      },
    });
    res.json(sujet);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sujet" });
  }
};

module.exports = {
  getSujetById,
  getSujet,
  createSujet,
  updateSujet,
  deleteSujet,
  getMySujet,
};
