const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function main() {
  const members = JSON.parse(fs.readFileSync('members.json', 'utf8'));
  
  const adminNames = ["Mohamad Alfan Ni’am", "Novita Sari"];
  
  for (const m of members) {
    await prisma.member.upsert({
      where: { nim: m.nim },
      update: {},
      create: {
        name: m.name,
        nim: m.nim,
        isAdmin: adminNames.includes(m.name)
      }
    });
  }
  console.log("Database seeded with members.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
