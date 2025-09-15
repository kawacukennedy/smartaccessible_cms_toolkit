import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const contentBlock = await prisma.contentBlock.findFirst(); // Fetch the first content block

    if (!contentBlock) {
      return NextResponse.json({ message: 'No content block found' }, { status: 404 });
    }

    return NextResponse.json(contentBlock);
  } catch (error) {
    console.error('Error fetching content block:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
