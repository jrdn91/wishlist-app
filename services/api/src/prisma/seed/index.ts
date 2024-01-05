import "dotenv/config"

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // create initial user
  await prisma.user.create({
    data: {
      id: "fbbbb321-eb88-4fc6-9258-f3d71ff328c9",
      username: "Jordan",
    },
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
