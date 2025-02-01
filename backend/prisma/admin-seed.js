const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const bcrypt = require('bcrypt');

async function main() {
    const adminEmail = 'tasnim@admin.com';
    const adminPassword = 'tasnim@admin.com'; 
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
        role: 'ADMIN',
        nom: 'tasnim',
        prenom: 'tasnim',
        telephone:12312312,
        dateDeNaissance: new Date('1997-02-24'),
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