const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getProfesseurs,
  myProfile,
  changePassword,
  updateprofile,
  deleteAccount
} = require("../controller/user");

router.get("/", getUsers);

router.get("/professeurs", getProfesseurs);

router.get("/profile", myProfile);

router.get("/:id", getUser);

router.post("/", createUser);

router.put("/update/:id", updateUser);
router.put("/update-profile", updateprofile);
router.put("/change-password", changePassword);
router.delete("/delete/:id", deleteUser);
router.delete("/delete-account", deleteAccount);

module.exports = router;
