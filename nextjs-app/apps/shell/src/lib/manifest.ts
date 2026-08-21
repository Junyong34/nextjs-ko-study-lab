import fs from 'node:fs'
import path from 'node:path'
import type { TreeNode } from '@study/ui'
import { getDocsRoot } from './docs-root'

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

export interface DocsManifest {
  $schema?: string
  generatedAt: string
  totalDocs: number
  docs: DocEntry[]
  urlMap: Record<string, DocEntry>
  tree: TreeNode[]
}

/** `@study/docs`의 빌드가 만들어 둔 문서 색인을 읽습니다. */
export function getManifest(): DocsManifest {
  const manifestPath = path.join(getDocsRoot(), 'docs-manifest.json')
  if (fs.existsSync(manifestPath)) {
    const raw = fs.readFileSync(manifestPath, 'utf-8')
    return JSON.parse(raw) as DocsManifest
  }
  throw new Error(`docs-manifest.json을 찾을 수 없습니다: ${manifestPath}`)
}

/** slug 배열로 문서 항목을 찾습니다. */
export function getDocBySlug(slug: string[]): DocEntry | undefined {
  const manifest = getManifest()
  const url = '/' + slug.join('/')
  if (manifest.urlMap[url]) {
    return manifest.urlMap[url]
  }

  // urlMap에 없으면 slug를 직접 맞춰본다
  const slugStr = slug.join('/')
  return manifest.docs.find((d) => d.slug.join('/') === slugStr)
}

/** 문서 상대 경로(`1-getting-started/caching.md`)로 마크다운 원문을 읽습니다. */
export function getDocContent(relPath: string): string {
  const fullPath = path.join(getDocsRoot(), relPath)
  if (fs.existsSync(fullPath)) {
    return fs.readFileSync(fullPath, 'utf-8')
  }
  throw new Error(`문서 파일을 찾을 수 없습니다: ${fullPath}`)
}

/** 데모의 `doc` 값으로 문서 항목을 찾습니다. 경로 끝만 맞아도 인정합니다. */
export function findDocForDemo(manifest: DocsManifest, demoDoc: string): DocEntry | undefined {
  return manifest.docs.find((d) => d.path === demoDoc || d.path.endsWith(demoDoc))
}
