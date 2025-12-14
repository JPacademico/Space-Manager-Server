import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@space.com' },
    update: {},
    create: {
      email: 'admin@space.com',
      name: 'Super Admin',
      password: password,
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin created');
}

main()
  .catch(() => process.exit(1))
  .finally(async () => await prisma.$disconnect());