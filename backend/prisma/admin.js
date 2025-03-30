const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const bcrypt = require('bcrypt');

async function main() {
    const adminEmail = 'hamza@admin.com';
    const adminPassword = 'hamza@admin.com'; 
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    const existingUser = await prisma.user.findFirst({
      where: {
        email: adminEmail,
      },
    }); 

    if (existingUser) {
      console.log('Admin user already exists');
      return;
    }
  
    const adminUser = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        role: 'RESPONSABLE',
        nom: 'hamza',
        prenom: 'benarfa',
        telephone:22633345,
        dateDeNaissance: new Date('2000-11-04'),
      },
    });
  }
  
  main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })