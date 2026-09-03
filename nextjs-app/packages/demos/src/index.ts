import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import yaml from 'js-yaml'
import { z } from 'zod'

export const DemoZoneSchema = z.enum(['baseline', 'cache', 'prefetch', 'export', 'proxy'])
export type DemoZone = z.infer<typeof DemoZoneSchema>

export const DemoStatusSchema = z.enum(['stub', 'wip', 'done'])
export type DemoStatus = z.infer<typeof DemoStatusSchema>

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

export interface DemoFilterOptions {
  zone?: DemoZone
  status?: DemoStatus
}

export function getDefaultYamlPath(): string {
  try {
    const currentDir =
      typeof __dirname !== 'undefined'
        ? __dirname
        : path.dirname(fileURLToPath(import.meta.url))
    const candidate = path.resolve(currentDir, '../demos.yaml')
    if (fs.existsSync(/*turbopackIgnore: true*/ candidate)) {
      return candidate
    }
  } catch {
    // fallback to cwd checks
  }

  const candidates = [
    path.resolve(process.cwd(), '../../packages/demos/demos.yaml'),
    path.resolve(process.cwd(), '../../../nextjs-app/packages/demos/demos.yaml'),
    path.resolve(process.cwd(), 'packages/demos/demos.yaml'),
    path.resolve(process.cwd(), 'nextjs-app/packages/demos/demos.yaml'),
    path.resolve(process.cwd(), 'demos.yaml'),
  ]

  for (const candidate of candidates) {
    if (fs.existsSync(/*turbopackIgnore: true*/ candidate)) {
      return candidate
    }
  }

  return candidates[0]
}

export function parseDemos(yamlContent: string): Demo[] {
  const parsed = yaml.load(yamlContent)
  return DemosListSchema.parse(parsed)
}

export function loadDemos(yamlFilePath?: string): Demo[] {
  const targetPath = yamlFilePath ?? getDefaultYamlPath()
  const content = fs.readFileSync(/*turbopackIgnore: true*/ targetPath, 'utf-8')
  return parseDemos(content)
}

export function getDemos(options?: DemoFilterOptions): Demo[]
export function getDemos(demos: Demo[], options?: DemoFilterOptions): Demo[]
export function getDemos(
  demosOrOptions?: Demo[] | DemoFilterOptions,
  options?: DemoFilterOptions,
): Demo[] {
  const demos = Array.isArray(demosOrOptions) ? demosOrOptions : loadDemos()
  const opts = Array.isArray(demosOrOptions) ? options : demosOrOptions
  if (!opts) return demos
  return demos.filter((demo) => {
    if (opts.zone && demo.zone !== opts.zone) return false
    if (opts.status && demo.status !== opts.status) return false
    return true
  })
}

export function getDemoByUrl(url: string, demos: Demo[] = loadDemos()): Demo | undefined {
  return demos.find((d) => d.url === url)
}

function normalizeDocPath(p: string): string {
  return p
    .replace(/^\/?(nextjs-docs\/)?/, '')
    .replace(/(^|\/)(\d+(\.\d+)*-)/g, '$1')
}

export function getDemosByDoc(doc: string, demos: Demo[] = loadDemos()): Demo[] {
  const normalizedTarget = normalizeDocPath(doc)
  return demos.filter((d) => {
    if (d.doc === doc) return true
    return normalizeDocPath(d.doc) === normalizedTarget
  })
}

export { getDemoMetadata, siteUrl, locale, ogImageSize, ogImageContentType } from './metadata'
export type { DemoMetadataOptions, DemoMetadataZone } from './metadata'
