const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      omit: {
        password: true,
      },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving users" });
  }
};

const myProfile = async (req, res) => {
  const { id } = req.user;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const { password, ...rest } = user;
    res.json(rest);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving user" });
  }
};

const changePassword = async (req, res) => {
  const { id } = req.user;
  const { currentPassword, newPassword, confirmPassword } = req.body;
  console.log(req.body);
  try {
    if (currentPassword === newPassword) {
      return res
        .status(400)
        .json({ error: "New password must be different from old password" });
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res
        .status(400)
        .json({
          error:
            "Current password, new password and confirm password are required",
        });
    }

    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ error: "Password and confirm password must be the same" });
    }
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Old password is incorrect" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
    res.status(204).json();
  } catch (error) {
    console.log("🚀 ~ changePassword ~ error:", error);
    res.status(500).json({ error: "Error updating password" });
  }
};

const getUserByEmail = async (email) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  } catch (error) {
    throw error;
  }
};
const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving user" });
  }
};

const createUser = async (req, res) => {
  const { email, name, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role,
      },
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Error creating user" });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: parseInt(id) }, // Ensure id is an integer
    });

    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) }, // Ensure id is an integer
      data: { ...data, dateDeNaissance: new Date(data.dateDeNaissance) },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error); // Log the actual error
    res.status(500).json({ error: "Error updating user" });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    await prisma.user.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).json();
  } catch (error) {
    console.log("🚀 ~ deleteUser ~ error:", error);
    res.status(500).json({ error: "Error deleting user" });
  }
};

const getProfesseurs = async (req, res) => {
  try {
    const professeurs = await prisma.user.findMany({
      where: { role: "PROF_SUPERVISOR" },
      select: {
        id: true,
        nom: true,
        prenom: true,
      },
    });
    res.json(professeurs);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving professeurs" });
  }
};

const updateprofile = async (req, res) => {
  const { id } = req.user;
  const data = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { ...data },
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Error updating user" });
  }
};

const deleteAccount = async (req, res) => {
  const { id } = req.user;
  try {
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    await prisma.user.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    console.log("🚀 ~ deleteAccount ~ error:", error);
    res.status(500).json({ error: "Error deleting user" });
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmail,
  getProfesseurs,
  myProfile,
  changePassword,
  deleteAccount,
  updateprofile,
};
