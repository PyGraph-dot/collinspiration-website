// scripts/update-admin-password.ts
import 'dotenv/config';
import { PrismaClient, Role } from '@prisma/client'; // <--- ADD 'Role' HERE
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function updateAdminPassword() {
  const adminEmail = 'admin@collinspiration.com';
  const newPassword = 'admin123';
  const adminName = 'Admin User';

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  try {
    let user = await prisma.user.findUnique({
      where: { email: adminEmail }
    });

    if (user) {
      console.log(`User with email ${adminEmail} found. Updating password and role.`);
      await prisma.user.update({
        where: { email: adminEmail },
        data: { password: hashedPassword, role: Role.ADMIN }, // <--- USE Role.ADMIN HERE
      });
      console.log(`Successfully updated password and role for admin: ${adminEmail}`);
    } else {
      console.log(`User with email ${adminEmail} not found. Creating new admin user.`);
      await prisma.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          role: Role.ADMIN, // <--- USE Role.ADMIN HERE
          name: adminName,
        },
      });
      console.log(`Successfully created new admin user: ${adminEmail}`);
    }
  } catch (error) {
    console.error('Error in admin password update/creation:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateAdminPassword();