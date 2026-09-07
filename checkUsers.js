const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log("USERS IN DB:", users.length);
  for (const user of users) {
    const isValid = await bcrypt.compare("password123", user.passwordHash);
    console.log(`User: ${user.email} | Role: ${user.role} | Valid password123: ${isValid}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
