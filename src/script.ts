import { PrismaClient } from './generated/prisma'

const prisma = new PrismaClient()

async function main() {
    const allProducts = await prisma.product.findMany()
    console.log(allProducts)
}

main()
.catch(error => {
    throw error
})
.finally(async () => {
    await prisma.$disconnect()
})
