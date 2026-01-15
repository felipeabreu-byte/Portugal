
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        console.log("Connecting to database...")
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true
            }
        })

        console.log(`Found ${users.length} users:`)
        users.forEach(u => {
            console.log(`- ID: ${u.id}, Email: '${u.email}', Name: ${u.name}`)
        })

    } catch (e) {
        console.error("Error connecting to database:", e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
