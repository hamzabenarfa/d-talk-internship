const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker'); // Import Faker.js
const prisma = new PrismaClient();

// Function to hash passwords
async function hashPassword(password) {
  const saltRounds = 10; // Number of salt rounds for hashing
  return await bcrypt.hash(password, saltRounds);
}

// Helper function to generate unique combinations of sujetId and userId
function getUniqueCandidatureCombination(users, sujets, existingCombinations) {
  let sujet, user;
  let maxAttempts = 100; // Prevent infinite loops
  let attempts = 0;

  do {
    sujet = sujets[Math.floor(Math.random() * sujets.length)];
    user = users[Math.floor(Math.random() * users.length)];

    attempts++;
    if (attempts > maxAttempts) {
      throw new Error('Unable to generate a unique sujetId-userId combination after 100 attempts.');
    }
  } while (existingCombinations.has(`${sujet.id}-${user.id}`));

  // Mark this combination as used
  existingCombinations.add(`${sujet.id}-${user.id}`);

  return { sujet, user };
}

async function main() {
  // Create Users
  const users = [];
  for (let i = 1; i <= 15; i++) {
    const email = faker.internet.email(); // Generate a random email
    const password = faker.internet.password(); // Generate a random password
    const nom = faker.person.lastName(); // Generate a random last name
    const prenom = faker.person.firstName(); // Generate a random first name

    const user = await prisma.user.create({
      data: {
        email,
        password: await hashPassword(password), // Hashed password
        nom,
        prenom,
        telephone:22121222,
        role: i % 3 === 0 ? 'PROF_SUPERVISOR' : 'CANDIDAT', // Mix roles
        dateDeNaissance: faker.date.birthdate({ min: 18, max: 25, mode: 'age' }), // Candidates are typically 18-25 years old
      },
    });
    users.push(user);
  }

  // Create Categories (Internship Focus Areas)
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

  // Create Sujets (Internship Topics)
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

  // Create Candidatures (Applications)
  const candidatures = [];
  const existingCombinations = new Set(); // Track used combinations of sujetId and userId

  for (let i = 0; i < 20; i++) {
    const supervisor = users.find((u) => u.role === 'PROF_SUPERVISOR');
    const { sujet, user } = getUniqueCandidatureCombination(users, sujets, existingCombinations);

    const candidature = await prisma.candidature.create({
      data: {
        sujetId: sujet.id,
        userId: user.id,
        supervisorId: supervisor.id,
        status: ['EN_ATTENTE', 'ACCEPTE', 'REFUSE'][Math.floor(Math.random() * 3)],
      },
    });
    candidatures.push(candidature);
  }

  // Create Tasks
  const tasks = [];
  for (let i = 0; i < 25; i++) {
    const candidature = candidatures[Math.floor(Math.random() * candidatures.length)];
    const user = users[Math.floor(Math.random() * users.length)];

    const task = await prisma.task.create({
      data: {
        name: faker.lorem.words(4), // Random task name
        description: faker.lorem.sentence(), // Random description
        deadline: faker.date.future({ years: 1 }), // Random future date
        valide: Math.random() > 0.5, // Randomly set to true/false
        userId: user.id,
        candidatureId: candidature.id
      },
    });
    tasks.push(task);
  }

  // Create Resources
  for (let i = 0; i < 30; i++) {
    const resourceType = ['USER', 'CANDIDATURE', 'SUJET'][Math.floor(Math.random() * 3)];
    const candidature = candidatures[Math.floor(Math.random() * candidatures.length)];
    const sujet = sujets[Math.floor(Math.random() * sujets.length)];
    const user = users[Math.floor(Math.random() * users.length)];

    await prisma.resource.create({
      data: {
        filename: faker.system.fileName(), // Random file name
        type: faker.system.mimeType(), // Random MIME type
        resourceType,
        userId: resourceType === 'USER' ? user.id : null,
        candidatureId: resourceType === 'CANDIDATURE' ? candidature.id : null,
        sujetId: resourceType === 'SUJET' ? sujet.id : null,
      },
    });
  }

  // Create Commentaires (Comments)
  for (let i = 0; i < 40; i++) {
    const task = tasks[Math.floor(Math.random() * tasks.length)];
    const user = users[Math.floor(Math.random() * users.length)];

    await prisma.commentaire.create({
      data: {
        date: faker.date.recent({ days: 30 }), // Random recent date
        content: faker.lorem.sentence(), // Random comment
        auteurID: user.id,
        tacheID: task.id,
      },
    });
  }

  console.log('Seed data created successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });