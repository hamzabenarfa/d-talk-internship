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
    // Fetch all candidatures from the database
    const candidatures = await prisma.candidature.findMany({
      select: {
        createdAt: true, // Only fetch the createdAt field
      },
    });

    // Group candidatures by month using date-fns
    const groupedByMonth = candidatures.reduce((acc, candidature) => {
      const monthKey = format(new Date(candidature.createdAt), "yyyy-MM"); // Format as YYYY-MM
      acc[monthKey] = (acc[monthKey] || 0) + 1; // Increment count for the month
      return acc;
    }, {});

    // Convert the grouped data into an array format for the frontend
    const formattedData = Object.keys(groupedByMonth).map((month) => ({
      month,
      count: groupedByMonth[month],
    }));

    // Sort the data chronologically
    formattedData.sort((a, b) => a.month.localeCompare(b.month));

    res.json(formattedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
})

router.get('/candidatureBySujet', async(req, res) => {
  try {
    const result = await prisma.candidature.groupBy({
      by: ["sujetId"],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
    });

    // Fetch sujet titles for better readability
    const sujetIds = result.map((item) => item.sujetId);
    const sujets = await prisma.sujet.findMany({
      where: { id: { in: sujetIds } },
      select: { id: true, titre: true },
    });

    // Map sujet titles to the result
    const formattedData = result.map((item) => {
      const sujet = sujets.find((s) => s.id === item.sujetId);
      return {
        sujet: sujet ? sujet.titre : "Unknown",
        count: item._count.id,
      };
    });

    res.json(formattedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
})

module.exports = router;
