/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function main() {
  const members = JSON.parse(fs.readFileSync('members.json', 'utf8'));
  
  const adminNames = ["Mohamad Alfan Ni'am", "Novita Sari", "Muhamad Verri Andika Pratama", "Muhammad Verri Andika Pratama"];
  
  for (const m of members) {
    const isMemberAdmin = Boolean(m.isAdmin || adminNames.includes(m.name));
    await prisma.member.upsert({
      where: { nim: m.nim },
      update: {
        name: m.name,
        isAdmin: isMemberAdmin
      },
      create: {
        name: m.name,
        nim: m.nim,
        isAdmin: isMemberAdmin
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
