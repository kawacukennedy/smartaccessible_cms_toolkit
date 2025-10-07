import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (id) {
    try {
      const content = await prisma.contentBlock.findUnique({ where: { id } });
      if (!content) {
        return NextResponse.json({ message: 'Content not found' }, { status: 404 });
      }
      return NextResponse.json(content);
    } catch (error) {
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
  }

  // List all content
  try {
    const contents = await prisma.contentBlock.findMany();
    return NextResponse.json(contents);
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const content = await prisma.contentBlock.create({ data: body });
    return NextResponse.json(content, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ message: 'ID required' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const content = await prisma.contentBlock.update({ where: { id }, data: body });
    return NextResponse.json(content);
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
