const express = require("express");
const router = express.Router();

const multer = require('multer');
const multerConfig = require('../config/multer');
const authenticateToken = require('../middleware/authenticationToken');
const {
  getSujetById,
  getSujet,
  createSujet,
  updateSujet,
  deleteSujet,
  getMySujet,
} = require("../controller/sujet");

router.get("/", getSujet);

router.get("/my-Sujet", authenticateToken,getMySujet);

router.get("/:id", getSujetById);
router.post('/create', authenticateToken, createSujet); 

// router.post('/', multer(multerConfig).array('files', 10), createSujet); 

router.put("/update/:id", authenticateToken,updateSujet);

router.delete("/delete/:id", authenticateToken,deleteSujet);

module.exports = router;
