// prisma/seed.js
// Description: Script to seed initial admin user

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  await prisma.user.upsert({
    where: { email: 'admin@r3.com' },
    update: {},
    create: {
      email: 'admin@r3.com',
      username: 'admin',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN'
    }
  });

  console.log('Seed completed successfully');
}

main()
  .catch(e => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });