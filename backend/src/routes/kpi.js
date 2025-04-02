const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/valid-stages", async (req, res, next) => {
  try {
    // Get all accepted candidatures
    const acceptedCandidatures = await prisma.candidature.findMany({
      where: {
        status: "ACCEPTE",
      },
      include: {
        Task: true,
      },
    });

    // Count candidatures where all tasks are validated
    let validStagesCount = 0;

    for (const candidature of acceptedCandidatures) {
      if (candidature.Task.length > 0) {
        const allTasksValidated = candidature.Task.every((task) => task.valide);
        if (allTasksValidated) {
          validStagesCount++;
        }
      }
    }

    res.json(validStagesCount);
  } catch (error) {
    next(error);
  }
});
// Get count of non-valid stages (candidatures with status ACCEPTE but not all tasks validated)
router.get("/non-valid-stages", async (req, res, next) => {
  try {
    // Get all accepted candidatures
    const acceptedCandidatures = await prisma.candidature.findMany({
      where: {
        status: "ACCEPTE",
      },
      include: {
        Task: true,
      },
    });

    // Count candidatures where not all tasks are validated
    let nonValidStagesCount = 0;

    for (const candidature of acceptedCandidatures) {
      if (candidature.Task.length > 0) {
        const allTasksValidated = candidature.Task.every((task) => task.valide);
        if (!allTasksValidated) {
          nonValidStagesCount++;
        }
      } else {
        // If there are no tasks, consider it as non-valid
        nonValidStagesCount++;
      }
    }

    res.json(nonValidStagesCount);
  } catch (error) {
    next(error);
  }
});
router.get("/countByCategorie", async (req, res, next) => {
  try {
    // Get all categories
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { sujets: true },
        },
      },
    });

    // Format the data for the chart
    const result = {};
    categories.forEach((category) => {
      result[category.name] = category._count.sujets;
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/byCandidature/:candidatureId", async (req, res, next) => {
  try {
    const { candidatureId } = req.params;

    const tasks = await prisma.task.findMany({
      where: {
        candidatureId: Number(candidatureId),
      },
      include: {
        User: true,
        Commentaire: true,
      },
    });

    res.json(tasks);
  } catch (error) {
    next(error);
  }
});

// Get count of validated and non-validated tasks
router.get("/valide-nonvalide", async (req, res, next) => {
  try {
    const valideCount = await prisma.task.count({
      where: {
        valide: true,
      },
    });

    const nonValideCount = await prisma.task.count({
      where: {
        valide: false,
      },
    });

    res.json({
      valideCount,
      nonValideCount,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/candidatures/monthly', async (req, res) => {
  try {
    const result = await prisma.$queryRaw`
      SELECT 
        DATE_FORMAT("createdAt", '%Y-%m') AS month,
        COUNT(*) AS count
      FROM "candidature"
      GROUP BY DATE_FORMAT("createdAt", '%Y-%m')
      ORDER BY month ASC
    `;

    // Format the result for the frontend
    const formattedData = result.map((row) => ({
      month: row.month, // YYYY-MM format
      count: Number(row.count),
    }));

    res.json(formattedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
})

module.exports = router;
