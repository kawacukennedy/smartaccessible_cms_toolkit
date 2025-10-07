import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // const body = await request.json();
    // const { workspace_id, content_snapshot, scan_types } = body;

    // Simulate AI scan processing
    // In real implementation, call AI service
    const taskId = `task_${Date.now()}`;

    // Mock response
    const results = {
      task_id: taskId,
      status: 'queued',
      estimated_completion: new Date(Date.now() + 5000).toISOString(),
    };

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const taskId = searchParams.get('taskId');

  if (!taskId) {
    return NextResponse.json({ error: 'Task ID required' }, { status: 400 });
  }

  // Mock polling response
  const mockResults = {
    task_id: taskId,
    status: 'done',
    results: {
      suggestions: [
        {
          suggestion_id: 'sug_1',
          content_id: 'content_1',
          block_id: 'block_1',
          type: 'readability',
          confidence: 0.87,
          summary: 'Shorten sentence in paragraph 2 to improve readability',
          diff_preview: {
            before: 'This is an overly long sentence that confuses readers and should be shortened for clarity.',
            after: 'Shorten this sentence to improve clarity.',
          },
          risk_level: 'low',
          auto_apply_allowed: false,
          ui_flags: { show_preview: true, highlight_range: [120, 190] },
        },
      ],
    },
  };

  return NextResponse.json(mockResults);
}