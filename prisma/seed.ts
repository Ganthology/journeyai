import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create default agents
  await prisma.agent.createMany({
    skipDuplicates: true,
    data: [
      {
        id: 'ideation',
        name: 'Ideation Agent',
        description: 'AI agent for brainstorming and exploring new ideas',
      },
      {
        id: 'reflection',
        name: 'Reflection Agent',
        description: 'AI agent for daily reflection and thought processing',
      },
    ],
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