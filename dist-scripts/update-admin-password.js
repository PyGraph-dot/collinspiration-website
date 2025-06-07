"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// scripts/update-admin-password.ts
require("dotenv/config");
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function updateAdminPassword() {
    const adminEmail = 'admin@collinspiration.com';
    const newPassword = 'admin123';
    const adminName = 'Admin User';
    const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
    try {
        let user = await prisma.user.findUnique({
            where: { email: adminEmail }
        });
        if (user) {
            console.log(`User with email ${adminEmail} found. Updating password and role.`);
            await prisma.user.update({
                where: { email: adminEmail },
                data: { password: hashedPassword, role: 'ADMIN' }, // <-- CHANGE 'admin' to 'ADMIN' here
            });
            console.log(`Successfully updated password and role for admin: ${adminEmail}`);
        }
        else {
            console.log(`User with email ${adminEmail} not found. Creating new admin user.`);
            await prisma.user.create({
                data: {
                    email: adminEmail,
                    password: hashedPassword,
                    role: 'ADMIN', // <-- CHANGE 'admin' to 'ADMIN' here
                    name: adminName,
                },
            });
            console.log(`Successfully created new admin user: ${adminEmail}`);
        }
    }
    catch (error) {
        console.error('Error in admin password update/creation:', error);
    }
    finally {
        await prisma.$disconnect();
    }
}
updateAdminPassword();
