import { NextRequest, NextResponse } from 'next/server'
import fs from 'node:fs'
import path from 'node:path'
import { getDocsRoot } from '@/lib/docs'

// 지원하는 이미지 확장자별 MIME 타입
const MIME_TYPES: Record<string, string> = {
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.avif': 'image/avif',
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: pathSegments } = await params
  if (!pathSegments || pathSegments.length === 0) {
    return new NextResponse('Asset path required', { status: 400 })
  }

  // 경로 조합 및 경로 탈출(Directory Traversal) 방지
  const relPath = path.normalize(pathSegments.join('/'))
  if (relPath.startsWith('..') || path.isAbsolute(relPath)) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  const docsRoot = getDocsRoot()
  const filePath = path.join(docsRoot, relPath)

  if (!fs.existsSync(filePath)) {
    return new NextResponse(`Asset not found: ${relPath}`, { status: 404 })
  }

  try {
    const ext = path.extname(filePath).toLowerCase()
    const contentType = MIME_TYPES[ext] || 'application/octet-stream'
    const fileBuffer = fs.readFileSync(filePath)

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (err) {
    console.error(`Failed to serve doc asset: ${filePath}`, err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
