const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker'); // Import the faker library

const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

// Get the number of users, sujets, and tasks from command-line arguments, with default values
const numUsers = parseInt(process.argv[2], 10) || 10;
const numSujetsPerUser = parseInt(process.argv[3], 10) || 2;
const numTasksPerCandidature = parseInt(process.argv[4], 10) || 3;
const maxAcceptedCandidatures = Math.floor(numUsers * numSujetsPerUser * 0.3); // Limit accepted candidatures to 30%

async function main() {
    const hashedPassword = await bcrypt.hash("password", 10);

    // Predefined categories for 'sujets'
    const categories = ['BigData', 'Devops', 'CLOUD', 'Moblie', 'DEV'];

    let acceptedCandidaturesCount = 0;
    const currentYear = new Date().getFullYear();

    // Seed Users
    for (let i = 0; i < numUsers; i++) {
        const user = await prisma.user.create({
            data: {
                email: faker.internet.email(),
                password: hashedPassword,
                nom: faker.person.lastName(),
                prenom: faker.person.firstName(),
                telephone: faker.number.int({ min: 10000000, max: 99999999 }), // Generate an 8-digit integer
                role: faker.helpers.arrayElement(['CANDIDAT', 'PROF_SUPERVISOR']),
                dateDeNaissance: faker.date.birthdate({ min: 18, max: 60, mode: 'age' }),
            },
        });

        // Seed Sujet for each user
        for (let j = 0; j < numSujetsPerUser; j++) {
            const sujet = await prisma.sujet.create({
                data: {
                    titre: faker.lorem.sentence(3),
                    description: faker.lorem.paragraph(),
                    category: faker.helpers.arrayElement(categories), // Assign one of the predefined categories
                    userId: user.id,
                },
            });

            // Seed Candidature for each user and sujet
            const candidatureStatus = (() => {
                if (acceptedCandidaturesCount < maxAcceptedCandidatures) {
                    acceptedCandidaturesCount++;
                    return 'ACCEPTE';  // Accept some candidatures
                }
                return faker.helpers.arrayElement(['EN_ATTENTE', 'REFUSE']); // Others are either pending or refused
            })();
            const randomMonth = faker.number.int({ min: 0, max: 11 }); // Month is 0-indexed
            const randomDay = faker.number.int({ min: 1, max: 28 }); // Avoid issues with month-end days
            const createdAt = new Date(currentYear, randomMonth, randomDay);

            const candidature = await prisma.candidature.create({
                data: {
                    userId: user.id,
                    sujetId: sujet.id,
                    supervisorId: faker.number.int({ min: 1, max: 10 }), // Assuming supervisor ID is within this range
                    status: candidatureStatus,
                    createdAt:createdAt
                },
            });

            // Seed Tasks for each candidature
            for (let k = 0; k < numTasksPerCandidature; k++) {
                await prisma.task.create({
                    data: {
                        name: faker.lorem.words(2),
                        description: faker.lorem.sentence(),
                        deadline: faker.date.future(),
                        valide: faker.datatype.boolean(),
                        candidatureId: candidature.id,
                        userId: user.id,
                    },
                });
            }
        }
    }

    console.log(`Seeding completed: ${numUsers} users, ${numSujetsPerUser} sujets per user, ${numTasksPerCandidature} tasks per candidature.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
