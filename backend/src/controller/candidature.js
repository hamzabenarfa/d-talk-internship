const { PrismaClient, Status } = require("@prisma/client");
const { createResources } = require("./resource");
const prisma = new PrismaClient();
const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
const { sendEmail } = require("../lib/mailer");
const { error } = require("console");

const getCandidatureById = async (req, res) => {
  const { id } = req.params;
  try {
    const candidature = await prisma.candidature.findUnique({
      where: { id: parseInt(id) },
    });
    if (candidature) {
      res.json(candidature);
    } else {
      res.status(404).json({ error: "Candidature not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch candidature" });
  }
};

const getCandidatures = async (req, res) => {
  try {
    const candidatures = await prisma.candidature.findMany({
      include: {
        user: {
          select: {
            prenom: true,
            nom: true,
            email: true,
            telephone: true,
            role: true,
          },
        },
        sujet: {
          select: {
            titre: true,
          },
        },
      },
    });
    res.json(candidatures);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch candidatures" });
  }
};

const createCandidatures = async (req, res) => {
  const candidature = req.params.id;
  const userId = req.user.id;
  const role = req.user.role;
  const files = req.files;
  try {
    if (role !== "CANDIDAT") {
      return res.status(403).json({ error: "Unauthorized" });
    }
    const existingCandidature = await prisma.candidature.findFirst({
      where: {
        sujetId: parseInt(candidature),
        userId,
      },
    });
    if (existingCandidature) {
      return res.status(400).json({ error: "Candidature deja inscri" });
    }
    const newCandidature = await prisma.candidature.create({
      data: {
        sujetId: parseInt(candidature),
        userId,
      },
    });

    const candidatures = await createResources(
      files,
      "CANDIDATURE",
      newCandidature.id
    );
    res.status(201).json({
      candidature: newCandidature,
      resources: candidatures,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to create candidature" });
  }
};

const refuseCandidature = async (req, res) => {
  const { id } = req.params;
  try {
    const candidature = await prisma.candidature.findFirst({
      where: {
        id: parseInt(id),
      },
      include: {
        user: {
          select: {
            nom: true,
            email: true,
          },
        },
      },
    });

    const candidatureAlreadyAccepted = await prisma.candidature.findFirst({
      where: {
        userId: candidature.userId,
        status: "ACCEPTE",
      },
    });
    if (candidatureAlreadyAccepted) {
      return res
        .status(400)
        .json({ error: "Candidature deja accepté au autre stage" });
    }
    const updatedCandidature = await prisma.candidature.update({
      where: { id: parseInt(id) },
      data: { status: "REFUSE" },
    });
    res.json(updatedCandidature);
  } catch (error) {
    console.log("🚀 ~ refuseCandidature ~ error:", error);
    res.status(500).json({ error: "Failed to refuse candidature" });
  }
};

const acceptCandidature = async (req, res) => {
  const { id } = req.params;
  try {
    const candidature = await prisma.candidature.findFirst({
      where: {
        id: parseInt(id),
      },
      include: {
        user: {
          select: {
            nom: true,
            email: true,
          },
        },
      },
    });

    const candidatureAlreadyAccepted = await prisma.candidature.findFirst({
      where: {
        userId: candidature.userId,
        status: "ACCEPTE",
      },
    });
    if (candidatureAlreadyAccepted) {
      return res
        .status(400)
        .json({ error: "Candidature deja accepté au autre stage" });
    }
    const updatedCandidature = await prisma.candidature.update({
      where: { id: parseInt(id) },
      data: { status: "ACCEPTE" },
      include: {
        sujet: {
          select: {
            titre: true,
          },
        },
      },
    });
    const email = candidature.user.email;
    const name = candidature.user.nom;

    const sujetName = updatedCandidature.sujet.titre;

    await sendEmail(email, "stage affecté", name, sujetName);
    res.json(updatedCandidature);
  } catch (error) {
    // res.status(500).json({ error: "Failed to accept candidature" });
  }
};

const deleteCandidatures = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.candidature.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Candidature deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete candidature" });
  }
};

const getMyCandidatures = async (req, res) => {
  const userId = req.user.id;
  try {
    const candidatures = await prisma.candidature.findMany({
      where: {
        userId,
      },
    });
    res.json(candidatures);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch candidatures" });
  }
};

const getCandidatureResources = async (req, res) => {
  const candidatureId = parseInt(req.params.id);

  try {
    const candidatureExist = await prisma.candidature.findFirst({
      where: {
        id: candidatureId,
      },
    });
    if (!candidatureExist) {
      return res.status(400).json({ error: "Candidature n'existe pas" });
    }
    const candidature = await prisma.candidature.findUnique({
      where: { id: candidatureId },
      include: {
        Resource: true, // Include related resources
      },
    });

    if (!candidature) {
      throw new Error("Candidature not found");
    }

    res.status(200).json(candidature);
  } catch (error) {
    console.error("Error fetching candidature with resources:", error);
    res.status(500).json({ error: "Failed to fetch candidature resources" });
  }
};

const downloadAllResources = async (req, res) => {
  const { candidatureId } = req.params;

  try {
    const resources = await prisma.resource.findMany({
      where: { candidatureId: parseInt(candidatureId) },
    });

    if (!resources.length) {
      return res
        .status(404)
        .json({
          error: "Il n'y a aucun document disponible pour cet utilisateur.",
        });
    }

    const archive = archiver("zip", { zlib: { level: 9 } });
    res.attachment("resources.zip");
    archive.pipe(res);

    resources.forEach(({ filename }) => {
      const filePath = path.resolve("public/docs", filename);
      if (fs.existsSync(filePath)) {
        archive.file(filePath, { name: filename });
      } else {
        console.warn(`File missing: ${filePath}`);
      }
    });

    archive.finalize();
  } catch (error) {
    res.status(500).send({ error: error });
  }
};

const getAllAcceptedCandidatures = async (req, res) => {
  try {
    const candidatures = await prisma.candidature.findMany({
      where: {
        status: "ACCEPTE",
      },
      include: {
        user: {
          select: {
            id: true,
            prenom: true,
            nom: true,
            email: true,
            telephone: true,
            role: true,
          },
        },
        sujet: {
          select: {
            titre: true,
          },
        },
      },
    });
    res.json(candidatures);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch candidatures" });
  }
};

const assignSupervisor = async (req, res) => {
  const { supervisorId, internId, sujetId } = req.params;
  try {
    const assigned = await prisma.candidature.update({
      where: {
        sujetId_userId: {
          sujetId: parseInt(sujetId),
          userId: parseInt(internId),
        },
      },
      data: {
        supervisorId: parseInt(supervisorId),
      },
    });

    res.status(200).json(assigned);
  } catch (error) {
    res.status(500).json({ error: "Failed to assign supervisor" });
  }
};

const getMyAvancement = async (req, res) => {
  const userId = req.user.id;
  try {
    const candidature = await prisma.candidature.findFirst({
      where: {
        userId,
        status: Status.ACCEPTE,
      },
      include: {
        sujet: {
          select: {
            titre: true,
          },
        },
      },
    });
    if (!candidature) {
      return res.status(404).json({ error: "Aucun Stage " });
    }
    res.json(candidature);
  } catch (error) {
    console.log("🚀 ~ getMyAvancement ~ error:", error);
    res.status(500).json({ error: "Failed to fetch candidatures" });
  }
};
const getAvancementBySupervisor = async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await prisma.candidature.findMany({
      where: {
        supervisorId: userId,
      },
      include: {
        user: {
          select: {
            prenom: true,
            nom: true,
            email: true,
            telephone: true,
            role: true,
          },
        },
        sujet: {
          select: {
            titre: true,
          },
        },
      },
    });
    return res.status(200).json(result);
  } catch (error) {
    console.log("🚀 ~ getAvancementBySupervisor ~ error:", error);
    res.status(500).json({ error: "Failed to fetch candidatures" });
  }
};

const getCandidatCandidatures = async (req, res) => {
  const userId = req.user.id;
  try {
    const candidatures = await prisma.candidature.findMany({
      where: {
        userId: parseInt(userId),
      },
      include: {
        sujet: {
          select: {
            titre: true,
          },
        },
      },
    });
    res.json(candidatures);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch candidatures" });
  }
};

const getValidationStage = async (req, res) => {
  const supervisorId = req.user.id;

  try {
    // Fetch candidatures for the supervisor
    const candidatures = await prisma.candidature.findMany({
      where: {
        supervisorId: supervisorId,
      },
      include: {
        sujet: {
          select: {
            titre: true,
          },
        },
        user: {
          select: {
            id: true, // Fetch user ID to calculate percentage for each user
            nom: true,
          },
        },
      },
    });

    // Create an array to store results with percentage for each user
    const resultsWithPercentage = await Promise.all(
      candidatures.map(async (candidature) => {
        const userId = req.user.id;
        // Fetch total tasks for the user
        const totalTache = await prisma.task.count({
          where: {
            userId,
            candidatureId: candidature.id,
          },
        });

        // Fetch total valid tasks for the user
        const totalValide = await prisma.task.count({
          where: {
            userId,
            valide: true,

            candidatureId: candidature.id,
          },
        });

        // Calculate percentage of valid tasks
        const pourcentageValide =
          totalTache > 0 ? (totalValide / totalTache) * 100 : 0;

        // Return candidature with percentage
        return {
          ...candidature,
          pourcentageValide,
        };
      })
    );

    // Send the results with validation percentage for each user
    res.status(200).json(resultsWithPercentage);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch candidatures" });
  }
};

const validerCandidature = async (req, res) => {
  const { candidatureId } = req.params;

  try {
    // Étape 1 : Vérifier si la candidature existe
    const candidatureExist = await prisma.candidature.findUnique({
      where: {
        id: +candidatureId,
      },
    });

    if (!candidatureExist) {
      return res.status(404).json({ error: "La candidature n'existe pas" });
    }

    if (candidatureExist.status !== Status.ACCEPTE) {
      return res.status(401).json({ error: "La candidature doit être acceptée avant d'être validée" });
    }

    // Étape 2 : Récupérer toutes les tâches liées à cette candidature
    const tasks = await prisma.task.findMany({
      where: {
        candidatureId: candidatureExist.id,
      },
    });

    if (tasks.length === 0) {
      return res.status(400).json({ error: "Aucune tâche trouvée pour cette candidature" });
    }

    // Étape 3 : Compter les tâches valides
    const validTasks = tasks.filter(task => task.valide === true);
    const validPercentage = (validTasks.length / tasks.length) * 100;

    // Étape 4 : Valider le pourcentage
    if (validPercentage < 80) {
      return res.status(400).json({
        error: `Seulement ${validPercentage.toFixed(2)}% des tâches sont valides. Un minimum de 80% est requis.`,
      });
    }

    // Étape 5 : Mettre à jour la candidature comme validée
    const updatedCandidature = await prisma.candidature.update({
      where: {
        id: candidatureExist.id,
      },
      data: {
        valide: true,
      },
    });

    return res.status(200).json({
      message: "Candidature validée avec succès",
      candidature: updatedCandidature,
    });

  } catch (error) {
    console.error("Erreur lors de la validation de la candidature :", error);
    return res.status(500).json({ error: "Échec de la validation de la candidature" });
  }
};

module.exports = {
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
  getMyAvancement,
  getAvancementBySupervisor,
  getValidationStage,
  getCandidatCandidatures,
  validerCandidature,
};
