import { NextResponse } from 'next/server';
import fs from 'fs';
import { Readable } from 'stream';

export async function GET(request: Request) {
  const filePath = process.env.VIDEO_FILE_PATH;

  if (!filePath) {
    return NextResponse.json({ error: 'Video file is not configured.' }, { status: 404 });
  }

  try {
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = request.headers.get('range');

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = (end - start) + 1;
      const fileStream = fs.createReadStream(filePath, { start, end });
      const webStream = Readable.toWeb(fileStream);

      return new Response(webStream as ReadableStream, {
        status: 206,
        headers: {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunkSize.toString(),
          'Content-Type': 'video/mp4',
        },
      });
    }

    const fileStream = fs.createReadStream(filePath);
    const webStream = Readable.toWeb(fileStream);

    return new Response(webStream as ReadableStream, {
      status: 200,
      headers: {
        'Content-Length': fileSize.toString(),
        'Content-Type': 'video/mp4',
      },
    });
  } catch (error) {
    console.error('Video stream error:', error);
    return NextResponse.json({ error: 'Video not found or inaccessible.' }, { status: 404 });
  }
}
