const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = 'teste@teste.com';
    const password = '123';
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(`Fixing user: ${email} with password '123'`);

    const user = await prisma.user.upsert({
        where: { email },
        update: { password: hashedPassword },
        create: {
            email,
            name: 'Test User',
            password: hashedPassword,
        },
    });

    console.log('User guaranteed in DB:', user);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
