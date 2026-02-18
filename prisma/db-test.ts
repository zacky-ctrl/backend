import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const company = await prisma.company.findFirst();
    const accountTypes = await prisma.accountType.findMany();

    console.log("Company:", company);
    console.log("Account Types:", accountTypes.map(a => a.code));
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
