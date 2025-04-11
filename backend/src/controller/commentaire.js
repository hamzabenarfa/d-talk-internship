const { PrismaClient } = require("@prisma/client");
const { WebSocketServerInstance } = require("../lib/websocket");
const prisma = new PrismaClient();

const getCommentaires = async (req, res) => {
  const { id } = req.params;
  try {
    const commentaires = await prisma.commentaire.findMany({
      where: { tacheID: parseInt(id) },
    });
    res.json(commentaires);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch commentaires" });
  }
};

const createCommentaire = async (req, res) => {
  const { id } = req.params; // Assuming `id` refers to `tacheID` in the schema
  const commentaireDate = new Date();
  const { content } = req.body;
  const auteurID = req.user.id;
  try {
    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }

    const commentaire = await prisma.commentaire.create({
      data: {
        tacheID: parseInt(id), // Correct field name
        content,
        date: commentaireDate,
        auteurID,
      },
    });

    WebSocketServerInstance.broadcast(
      JSON.stringify({
        event: "new-comment",
        data: {
          taskId: parseInt(id),
          comment: commentaire,
        },
      })
    );
    res.json(commentaire);
  } catch (error) {
    res.status(500).json({ error: "Failed to create commentaire" });
  }
};

const deleteCommentaire = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.commentaire.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Commentaire deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete commentaire" });
  }
};

const updateCommentaire = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const commentaire = await prisma.commentaire.update({
      where: { id: parseInt(id) },
      data: { content },
    });
    res.json(commentaire);
  } catch (error) {
    res.status(500).json({ error: "Failed to update commentaire" });
  }
};
const getAllCommentaires = async (req, res) => {
  const { id } = req.params;
  try {
    const commentaires = await prisma.commentaire.findMany({
      where: { tacheID: parseInt(id) },
    });
    res.json(commentaires);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch commentaires" });
    console.log("🚀 ~ getCommentaires ~ error:", error);
  }
};
module.exports = {
  getCommentaires,
  createCommentaire,
  deleteCommentaire,
  updateCommentaire,
  getAllCommentaires,
};
