const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const categories = [
    { title: "Planejamento Inicial", order: 1 },
    { title: "Passagens & Transporte", order: 2 },
    { title: "Hospedagem", order: 3 },
    { title: "Documentos", order: 4 },
    { title: "Financeiro", order: 5 },
    { title: "Bagagem", order: 6 },
    { title: "Tecnologia", order: 7 },
    { title: "Saúde & Segurança", order: 8 },
    { title: "Planejamento no Destino", order: 9 },
    { title: "Antes de Sair de Casa", order: 10 },
]

async function main() {
    console.log('Start seeding...')
    for (const cat of categories) {
        const category = await prisma.checklistCategory.upsert({
            where: { id: cat.title }, // This might fail if ID is UUID. We should use findFirst or similar logic if we don't have static IDs. 
            // Actually, my schema has UUID for ID. So upsert by ID is tricky if I don't know it.
            // I'll check if it exists by title, if not create.
            create: cat,
            update: {},
        }).catch(async () => {
            // Fallback since 'id' is required for where in upsert, but I don't have it.
            // Let's use findFirst
            const existing = await prisma.checklistCategory.findFirst({ where: { title: cat.title } })
            if (!existing) {
                return prisma.checklistCategory.create({ data: cat })
            }
        })
    }

    // A cleaner way for the seed:
    // Since I don't have a unique constraint on title (I should probably have added one, but it's okay), I'll just check existence.

}

// Redoing main to be correct with current schema
async function mainCorrect() {
    console.log('Start seeding...')
    for (const cat of categories) {
        const existing = await prisma.checklistCategory.findFirst({
            where: { title: cat.title }
        })

        if (!existing) {
            await prisma.checklistCategory.create({
                data: cat
            })
            console.log(`Created category: ${cat.title}`)
        } else {
            console.log(`Category already exists: ${cat.title}`)
        }
    }
    console.log('Seeding finished.')
}

mainCorrect()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
