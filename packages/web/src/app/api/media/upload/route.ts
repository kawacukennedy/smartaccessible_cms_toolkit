import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Handle multipart upload
    // For now, mock
    const cdnUrl = 'https://cdn.example.com/uploaded-file.jpg';
    const id = 'media_' + Date.now();

    return NextResponse.json({ cdn_url: cdnUrl, id });
  } catch (error) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}