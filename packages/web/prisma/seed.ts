import { PrismaClient } from '@prisma/client';
import path from 'path';
import { promises as fs } from 'fs';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  const projectJsonPath = path.join(process.cwd(), '..', '..', 'project.json');
  const fileContents = await fs.readFile(projectJsonPath, 'utf8');
  const projectData = JSON.parse(fileContents);
  const mockContentBlock = projectData.mock_data.ContentBlock.sample;

  // Create ContentBlock
  const contentBlock = await prisma.contentBlock.create({
    data: {
      id: mockContentBlock.id,
      type: mockContentBlock.type,
      content: mockContentBlock.content,
      locale: mockContentBlock.locale,
      metadata: mockContentBlock.metadata,
      seo_score: mockContentBlock.seo_score,
      accessibility_score: mockContentBlock.accessibility_score,
      inclusivity_score: mockContentBlock.inclusivity_score,
      version: mockContentBlock.version,
    },
  });
  console.log(`Created ContentBlock with id: ${contentBlock.id}`);

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
