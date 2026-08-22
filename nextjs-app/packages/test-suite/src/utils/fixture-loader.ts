import fs from 'node:fs'
import path from 'node:path'
import { REPO_ROOT, getAllFiles, DOCS_ROOT, normalizeDocPath } from './test-helpers.ts'

export interface MarkdownCodeBlock {
  language: string
  content: string
  filePath: string
  lineNumber: number
}

export function extractCodeBlocksFromMarkdown(filePath: string): MarkdownCodeBlock[] {
  if (!fs.existsSync(filePath)) return []
  const text = fs.readFileSync(filePath, 'utf-8')
  const lines = text.split(/\r?\n/)
  const blocks: MarkdownCodeBlock[] = []
  let inBlock = false
  let language = ''
  let blockLines: string[] = []
  let startLine = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (!inBlock && line.startsWith('```')) {
      inBlock = true
      language = line.replace(/^```/, '').trim()
      blockLines = []
      startLine = i + 1
    } else if (inBlock && line.startsWith('```')) {
      inBlock = false
      blocks.push({
        language,
        content: blockLines.join('\n'),
        filePath,
        lineNumber: startLine,
      })
    } else if (inBlock) {
      blockLines.push(line)
    }
  }

  return blocks
}

export function getAllMarkdownFiles(): string[] {
  return getAllFiles(DOCS_ROOT, ['.md'])
}

export function readTextSafe(filePath: string): string {
  if (!fs.existsSync(filePath)) return ''
  return fs.readFileSync(filePath, 'utf-8')
}
