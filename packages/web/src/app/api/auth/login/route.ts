import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Mock login
    const jwt = 'mock_jwt_token';
    const refreshToken = 'mock_refresh_token';

    return NextResponse.json({ jwt, refresh_token: refreshToken });
  } catch (error) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}