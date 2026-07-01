import { agentMarginService } from './src/services/agent-margin.service';
import { prisma } from './src/config';

async function main() {
  console.log('Calculating margins...');
  try {
    const created = await agentMarginService.calculateAgentMargins(6, 2026);
    console.log('Created margins:', created);
  } catch (error) {
    console.error('Error calculating margins:', error);
  }

  const all = await prisma.agentMargin.findMany();
  console.log('All margins in DB:', all);
}

main().finally(() => prisma.$disconnect());
