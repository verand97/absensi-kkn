/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Cari member berdasarkan nama (case-insensitive)
  const member = await prisma.member.findFirst({
    where: {
      name: {
        contains: 'Indra Pratama',
        mode: 'insensitive',
      },
    },
  });

  if (!member) {
    console.error('Member "Indra Pratama" tidak ditemukan di database!');
    process.exit(1);
  }

  console.log('Member ditemukan:', member);

  const updated = await prisma.member.update({
    where: { id: member.id },
    data: { isAdmin: true },
  });

  console.log('\n✅ Berhasil dijadikan admin:');
  console.log(updated);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
