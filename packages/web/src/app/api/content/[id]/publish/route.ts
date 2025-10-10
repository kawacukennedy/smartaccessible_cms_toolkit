import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const body = await request.json();
    const { content } = body;

    // Run validations: accessibility, broken links, required fields
    // Simple validation: check if content exists
    if (!content) {
      return NextResponse.json({ message: 'Content required' }, { status: 400 });
    }

    // Parse blocks and validate
    let issues = [];
    try {
      const blocks = JSON.parse(content);
      blocks.forEach((block: any) => {
        if (block.type === 'ImageBlock' && !block.accessibility_meta?.alt_text) {
          issues.push('Missing alt text for image');
        }
      });
    } catch (e) {
      issues.push('Invalid content format');
    }

    if (issues.length > 0) {
      return NextResponse.json({ message: 'Validation failed', issues }, { status: 400 });
    }

    const updatedContent = await prisma.contentBlock.update({
      where: { id },
      data: { content, type: 'published' },
    });

    return NextResponse.json(updatedContent);
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}