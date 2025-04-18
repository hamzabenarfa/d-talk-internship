const express = require("express");
const router = express.Router();

const multer = require("multer");
const { DocMulterConfig } = require("../config/multer");
const {
  getCandidatureById,
  getCandidatures,
  createCandidatures,
  refuseCandidature,
  acceptCandidature,
  deleteCandidatures,
  getMyCandidatures,
  getCandidatureResources,
  downloadAllResources,
  getAllAcceptedCandidatures,
  assignSupervisor,
  getValidationStage,
  getMyAvancement,
  getAvancementBySupervisor,
  getCandidatCandidatures,
  validerCandidature,
} = require("../controller/candidature");

router.get("/avancement/supervisor", getAvancementBySupervisor);
router.get("/", getCandidatures);

router.get("/allAvancements", getAllAcceptedCandidatures);
router.get("/my-avancement", getMyAvancement);
router.get("/my-Candidatures", getMyCandidatures);

router.get("/validation-stage", getValidationStage);

router.get("/candidat", getCandidatCandidatures);

router.get("/resource/:id", getCandidatureResources);

router.get("/resources/download/:candidatureId", downloadAllResources);
router.get("/:id", getCandidatureById);

router.post(
  "/:id",
  multer(DocMulterConfig).array("files", 10),
  createCandidatures
);

router.put("/accepter/:id", acceptCandidature);
router.put("/rejeter/:id", refuseCandidature);
router.put("/valider/:id", validerCandidature);

router.put(
  "/encadrant/:supervisorId/candidat/:internId/sujet/:sujetId",
  assignSupervisor
);
router.delete("/:id", deleteCandidatures);

module.exports = router;
