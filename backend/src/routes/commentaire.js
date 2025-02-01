const express = require("express");
const router = express.Router();

const {
  getCommentaires,
  createCommentaire,
  deleteCommentaire,
  updateCommentaire,
  getAllCommentaires,
} = require("../controller/commentaire");

router.get("/get/task/:id", getCommentaires);
router.get("/getAll/task/:id", getAllCommentaires);
router.post("/create/:id", createCommentaire);
router.put("/update/:id", updateCommentaire);
router.delete("/delete/:id", deleteCommentaire);

module.exports = router;
