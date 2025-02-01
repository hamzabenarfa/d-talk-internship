const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getUserByEmail } = require("./user");

const register = async (req, res) => {
  const { password, ...rest } = req.body;
  try {
    if (!rest.email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const existingUser = await getUserByEmail(rest.email);
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        ...rest,
        role: rest.role.toUpperCase() || "CANDIDAT",
        telephone: parseInt(rest.telephone),
        password: hashedPassword,
        dateDeNaissance: new Date(rest.dateDeNaissance),
      },
    });
    const accessToken = jwt.sign(
      { user: { id: user.id, role: user.role } },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "3d" }
    );

    const userInfo = { ...user, password: undefined };
    return res.status(200).json({ user: userInfo, accessToken });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: "Error creating user" });
  }
};

const login = async (req, res) => {
  const userData = req.body;
  try {
    if (!userData.email || !userData.password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await getUserByEmail(userData.email);
    if (!user) {
      return res.status(400).json({ error: "Email doesnt exist " });
    }

    // if(!user.enabled){
    //   return res.status(400).json({ error: "Le compte est déactive" });
    // }

    const match = await bcrypt.compare(userData.password, user.password);
    if (!match) {
      return res.status(400).json({ error: "Invalid password " });
    }

    const accessToken = jwt.sign(
      { user: { id: user.id, role: user.role } },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "3d" }
    );

    const userInfo = { ...user, password: undefined };
    return res.status(200).json({ user: userInfo, accessToken });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json(error);
  }
};

module.exports = { register, login };
