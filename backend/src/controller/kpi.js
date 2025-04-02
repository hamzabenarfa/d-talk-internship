// Controller for /candidatures/monthly
const getCandidaturesByMonth = async (req, res) => {
  try {
    const result = await prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('month', "createdAt") AS month,
          COUNT(*) AS count
        FROM "candidature"
        GROUP BY DATE_TRUNC('month', "createdAt")
        ORDER BY month ASC
      `;

    // Format the result for the frontend
    const formattedData = result.map((row) => ({
      month: row.month.toISOString().slice(0, 7), // Extract YYYY-MM format
      count: Number(row.count),
    }));

    res.json(formattedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller for /candidatureBySujet
const getCandidaturesBySujet = async (req, res) => {
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
}; // Controller for /task/valide-nonvalide
const getTaskValidationStatus = async (req, res) => {
  try {
    const result = await prisma.task.groupBy({
      by: ["valide"],
      _count: {
        id: true,
      },
    });

    // Format the result for the frontend
    const formattedData = result.map((row) => ({
      status: row.valide ? "Validé" : "Non validé",
      count: Number(row._count.id),
    }));

    res.json(formattedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}; 
// Controller for /sujet/countByCategorie
const getSujetsByCategory = async (req, res) => {
  try {
    const result = await prisma.sujet.groupBy({
      by: ["categoryId"],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
    });

    // Fetch category names for better readability
    const categoryIds = result.map((item) => item.categoryId);
    const categories = await prisma.category.findMany({
      where: { id: { in: categoryIds } },
      select: { id: true, name: true },
    });

    // Map category names to the result
    const formattedData = result.map((item) => {
      const category = categories.find((c) => c.id === item.categoryId);
      return {
        category: category ? category.name : "Uncategorized",
        count: item._count.id,
      };
    });

    res.json(formattedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}; // Controller for /non-valid-stages
const getNonValidStages = async (req, res) => {
  try {
    const result = await prisma.candidature.count({
      where: {
        status: "REFUSE", // Assuming "REFUSE" means non-validated
      },
    });

    res.json({ count: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}; // Controller for /valid-stages
const getValidStages = async (req, res) => {
  try {
    const result = await prisma.candidature.count({
      where: {
        status: "ACCEPTE", // Assuming "ACCEPTE" means validated
      },
    });

    res.json({ count: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
    getCandidaturesByMonth,
    getCandidaturesBySujet,
    getTaskValidationStatus,
    getSujetsByCategory,
    getNonValidStages,
    getValidStages,
};