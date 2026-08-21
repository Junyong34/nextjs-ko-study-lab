import fs from 'node:fs'
import path from 'node:path'
import { getDemos, getDemoByUrl, getDemosByDoc, type Demo } from '@study/demos'

export interface DocEntry {
  path: string
  url: string
  slug: string[]
  title: string
  demos: Array<{
    path: string
    mode?: 'inline' | 'fullscreen'
    height?: number
    caption?: string
  }>
}

export interface TreeNode {
  title: string
  url: string
  path: string
  order?: string
  section?: string
  demos?: any[]
  children?: TreeNode[]
}

export interface DocsManifest {
  $schema?: string
  generatedAt: string
  totalDocs: number
  docs: DocEntry[]
  urlMap: Record<string, DocEntry>
  tree: TreeNode[]
}

/**
 * nextjs-docs 디렉토리의 절대 경로를 탐색합니다.
 */
export function getDocsRoot(): string {
  const candidates = [
    path.resolve(process.cwd(), '../../../nextjs-docs'),
    path.resolve(process.cwd(), '../../nextjs-docs'),
    path.resolve(process.cwd(), '../nextjs-docs'),
    path.resolve(process.cwd(), 'nextjs-docs'),
    path.resolve(__dirname, '../../../../nextjs-docs'),
  ]

  for (const candidate of candidates) {
    if (fs.existsSync(path.join(candidate, 'docs-manifest.json'))) {
      return candidate
    }
  }

  return candidates[0]
}

/**
 * docs-manifest.json을 로드합니다.
 */
export function getManifest(): DocsManifest {
  const docsRoot = getDocsRoot()
  const manifestPath = path.join(docsRoot, 'docs-manifest.json')
  if (fs.existsSync(manifestPath)) {
    const raw = fs.readFileSync(manifestPath, 'utf-8')
    return JSON.parse(raw) as DocsManifest
  }
  throw new Error(`docs-manifest.json을 찾을 수 없습니다: ${manifestPath}`)
}

/**
 * slug 배열로 해당 문서 항목을 탐색합니다.
 */
export function getDocBySlug(slug: string[]): DocEntry | undefined {
  const manifest = getManifest()
  const url = '/' + slug.join('/')
  if (manifest.urlMap[url]) {
    return manifest.urlMap[url]
  }

  // fallback: slug 일치 항목 탐색
  const slugStr = slug.join('/')
  return manifest.docs.find((d) => d.slug.join('/') === slugStr)
}

/**
 * 문서 상대 경로(예: '1-getting-started/caching.md')로 마크다운 원문을 읽습니다.
 */
export function getDocContent(relPath: string): string {
  const docsRoot = getDocsRoot()
  const fullPath = path.join(docsRoot, relPath)
  if (fs.existsSync(fullPath)) {
    return fs.readFileSync(fullPath, 'utf-8')
  }
  throw new Error(`문서 파일을 찾을 수 없습니다: ${fullPath}`)
}

export { getDemos, getDemoByUrl, getDemosByDoc, type Demo }
