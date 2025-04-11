const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker'); // Import Faker.js
const prisma = new PrismaClient();

async function seedCategories() {
  const categories = [];
  const categoryNames = [
    'Frontend Development',
    'Backend Development',
    'Mobile App Development',
    'DevOps',
    'Data Science',
    'Machine Learning',
    'AI Research',
    'Cloud Computing',
    'Cybersecurity',
    'UI/UX Design',
  ];
  for (const name of categoryNames) {
    const category = await prisma.category.create({
      data: {
        name,
      },
    });
    categories.push(category);
  }
  console.log(`Seeded ${categories.length} categories.`);
  return categories;
}

async function seedSujets(categories) {
  const sujets = [];
  const sujetTitles = [
    'Build a REST API with Node.js',
    'Develop a React Frontend',
    'Train a Machine Learning Model',
    'Design a Mobile App in Flutter',
    'Set up CI/CD Pipelines',
    'Analyze Big Data with Spark',
    'Create a Chatbot with NLP',
    'Optimize Cloud Infrastructure',
    'Secure a Web Application',
    'Redesign UI for Accessibility',
  ];
  for (const title of sujetTitles) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const sujet = await prisma.sujet.create({
      data: {
        titre: title,
        description: faker.lorem.paragraph(), // Random description
        duration: `${Math.floor(Math.random() * 6 + 3)} months`, // Duration between 3-9 months
        deadline: faker.date.future({ years: 1 }), // Random future date
        work: ['ONSITE', 'REMOTE', 'HYBRID'][Math.floor(Math.random() * 3)], // Random work arrangement
        location: faker.location.city(), // Random city
        categoryId: category.id,
      },
    });
    sujets.push(sujet);
  }
  console.log(`Seeded ${sujets.length} sujets.`);
  return sujets;
}


async function main() {
  const categories = await seedCategories();
 await seedSujets(categories);


}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });