const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const newAdmin = await prisma.member.upsert({
    where: { nim: '231240001452' },
    update: {
      name: 'Muhammad Verri Andika Pratama',
      isAdmin: true,
    },
    create: {
      name: 'Muhammad Verri Andika Pratama',
      nim: '231240001452',
      isAdmin: true,
    }
  });

  console.log("Admin account created/updated successfully:");
  console.log(newAdmin);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
