import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import yaml from 'js-yaml'
import { z } from 'zod'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const REPO_ROOT = path.resolve(__dirname, '../../../../..')
export const NEXTJS_APP_ROOT = path.join(REPO_ROOT, 'nextjs-app')
export const DOCS_ROOT = path.join(REPO_ROOT, 'nextjs-docs')
export const DEMOS_YAML_PATH = path.join(NEXTJS_APP_ROOT, 'packages/demos/demos.yaml')
export const DEMOS_MANIFEST_PATH = path.join(NEXTJS_APP_ROOT, 'packages/demos/demos-manifest.json')

export const ZONE_APP_DIR_MAP: Record<string, string> = {
  baseline: 'apps/demo-baseline',
  cache: 'apps/demo-cache-components',
  prefetch: 'apps/demo-prefetch',
  export: 'apps/demo-export',
  proxy: 'apps/demo-proxy',
}

export const DemoZoneSchema = z.enum(['baseline', 'cache', 'prefetch', 'export', 'proxy'])
export const DemoStatusSchema = z.enum(['stub', 'wip', 'done'])

export const DemoSchema = z.object({
  url: z.string().min(1),
  title: z.string().min(1),
  doc: z.string().min(1),
  zone: DemoZoneSchema,
  status: DemoStatusSchema,
})

export type Demo = z.infer<typeof DemoSchema>
export const DemosListSchema = z.array(DemoSchema)
export type DemosList = z.infer<typeof DemosListSchema>

export function loadDemosYaml(): Demo[] {
  if (!fs.existsSync(DEMOS_YAML_PATH)) {
    throw new Error(`demos.yaml not found at: ${DEMOS_YAML_PATH}`)
  }
  const raw = fs.readFileSync(DEMOS_YAML_PATH, 'utf-8')
  const parsed = yaml.load(raw)
  return z.array(DemoSchema).parse(parsed)
}

export function loadDemosManifest(): Demo[] {
  if (!fs.existsSync(DEMOS_MANIFEST_PATH)) {
    throw new Error(`demos-manifest.json not found at: ${DEMOS_MANIFEST_PATH}`)
  }
  const raw = fs.readFileSync(DEMOS_MANIFEST_PATH, 'utf-8')
  const parsed = JSON.parse(raw)
  return z.array(DemoSchema).parse(parsed)
}

export function getAllFiles(dir: string, exts: string[] = ['.ts', '.tsx', '.js', '.jsx', '.md', '.json']): string[] {
  if (!fs.existsSync(dir)) return []
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const files: string[] = []
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...getAllFiles(fullPath, exts))
    } else if (exts.includes(path.extname(entry.name))) {
      files.push(fullPath)
    }
  }
  return files
}

export function normalizeDocPath(p: string): string {
  return p
    .replace(/^\/?(nextjs-docs\/)?/, '')
    .replace(/(^|\/)(\d+(\.\d+)*-)/g, '$1')
}

export function resolveDocFile(docPath: string): string | null {
  const directPath = path.join(DOCS_ROOT, docPath)
  if (fs.existsSync(directPath)) {
    return directPath
  }

  const allDocFiles = getAllFiles(DOCS_ROOT, ['.md'])
  const normalizedTarget = normalizeDocPath(docPath)

  for (const file of allDocFiles) {
    const rel = path.relative(DOCS_ROOT, file)
    if (normalizeDocPath(rel) === normalizedTarget) {
      return file
    }
  }

  const targetBase = path.basename(docPath)
  for (const file of allDocFiles) {
    if (path.basename(file) === targetBase) {
      return file
    }
  }

  return null
}

export function getDemoSourceDir(demo: Demo): string {
  const appDir = ZONE_APP_DIR_MAP[demo.zone] || `apps/demo-${demo.zone}`
  return path.join(NEXTJS_APP_ROOT, appDir, 'src/app/zone', demo.zone, demo.url)
}

export function computeExpectedActualMatch(expected: unknown, actual: unknown): boolean | undefined {
  if (expected === undefined || actual === undefined) return undefined
  if (typeof expected === 'string' && typeof actual === 'string') {
    return expected.trim() === actual.trim()
  }
  if (typeof expected === 'number' && typeof actual === 'number') {
    return expected === actual
  }
  if (typeof expected === 'boolean' && typeof actual === 'boolean') {
    return expected === actual
  }
  if (typeof expected === 'object' && typeof actual === 'object') {
    return JSON.stringify(expected) === JSON.stringify(actual)
  }
  return undefined
}
