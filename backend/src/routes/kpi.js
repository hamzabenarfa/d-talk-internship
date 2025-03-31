const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


router.get('/candidatures/monthly',async (req, res) => {
    try {
      const results = await prisma.$queryRaw`
        SELECT EXTRACT(MONTH FROM "createdAt") as month, COUNT(*) as count
        FROM "Candidature"
        GROUP BY month
      `;
  
      const candidaturesCountByMonth = {};
  
      results.forEach(result => {
        const month = result.month;
        const count = result.count;
        const monthName = getMonthName(month);
        candidaturesCountByMonth[monthName] = count;
      });
      console.log(candidaturesCountByMonth)
      return res.json(candidaturesCountByMonth);
    } catch (error) {
      console.error(error);
      return res.status(500).send('Error fetching data');
    }
  })

router.get('/candidatureBySujet')

router.get('/task/valide-nonvalide')
router.get('/sujet/countByCategorie')


router.get('/non-valid-stages')
router.get('/valid-stages')



module.exports = router;
