import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { workspace_id, content_snapshot, scan_types } = body;

    // Simple AI scan implementation
    const taskId = `task_${Date.now()}`;

    // Analyze content
    let suggestions = [];
    try {
      const blocks = JSON.parse(content_snapshot);
      blocks.forEach((block: any, index: number) => {
        if (block.type === 'TextBlock' && block.payload?.content) {
          const text = block.payload.content;
          // Check for long sentences
          const sentences = text.split('.');
          sentences.forEach((sentence: string, sIndex: number) => {
            if (sentence.length > 100) {
              suggestions.push({
                suggestion_id: `sug_${taskId}_${index}_${sIndex}`,
                content_id: 'content_1',
                block_id: block.id,
                type: 'readability',
                confidence: 0.8,
                summary: 'Shorten long sentence for better readability',
                diff_preview: {
                  before: sentence.trim(),
                  after: sentence.trim().substring(0, 50) + '...',
                },
                risk_level: 'low',
                auto_apply_allowed: false,
                ui_flags: { show_preview: true },
              });
            }
          });
        }
        if (block.type === 'ImageBlock' && !block.accessibility_meta?.alt_text) {
          suggestions.push({
            suggestion_id: `sug_${taskId}_${index}_alt`,
            content_id: 'content_1',
            block_id: block.id,
            type: 'accessibility',
            confidence: 0.95,
            summary: 'Add alt text to image for accessibility',
            diff_preview: {
              before: 'No alt text',
              after: 'Descriptive alt text',
            },
            risk_level: 'medium',
            auto_apply_allowed: false,
            ui_flags: { show_preview: false },
          });
        }
      });
    } catch (e) {
      // If not JSON, treat as text
      const text = content_snapshot;
      if (text.length > 500) {
        suggestions.push({
          suggestion_id: `sug_${taskId}_length`,
          type: 'readability',
          confidence: 0.7,
          summary: 'Content is long, consider breaking into sections',
          risk_level: 'low',
        });
      }
    }

    // For demo, return done immediately
    const results = {
      task_id: taskId,
      status: 'done',
      results: { suggestions },
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