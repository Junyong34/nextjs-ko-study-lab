import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import yaml from 'js-yaml'
import { z } from 'zod'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DemoZoneSchema = z.enum(['baseline', 'cache', 'prefetch', 'export', 'proxy'])
const DemoStatusSchema = z.enum(['stub', 'wip', 'done'])

const DemoSchema = z.object({
  url: z.string().min(1, 'url은 비어있을 수 없습니다'),
  title: z.string().min(1, 'title은 비어있을 수 없습니다'),
  doc: z.string().min(1, 'doc은 비어있을 수 없습니다'),
  zone: DemoZoneSchema,
  status: DemoStatusSchema,
})

const DemosListSchema = z.array(DemoSchema)

const packageRoot = path.resolve(__dirname, '..')
const yamlPath = path.join(packageRoot, 'demos.yaml')
const manifestPath = path.join(packageRoot, 'demos-manifest.json')

function buildManifest() {
  console.log(`[build-manifest] demos.yaml 읽는 중: ${yamlPath}`)

  if (!fs.existsSync(yamlPath)) {
    console.error(`[build-manifest] 오류: demos.yaml을 찾을 수 없습니다: ${yamlPath}`)
    process.exit(1)
  }

  const rawYaml = fs.readFileSync(yamlPath, 'utf-8')
  let parsedRaw
  try {
    parsedRaw = yaml.load(rawYaml)
  } catch (err) {
    console.error(`[build-manifest] YAML 파싱 실패:`, err)
    process.exit(1)
  }

  const result = DemosListSchema.safeParse(parsedRaw)
  if (!result.success) {
    console.error(`[build-manifest] Zod 유효성 검증 실패:`)
    console.error(JSON.stringify(result.error.format(), null, 2))
    process.exit(1)
  }

  const demos = result.data
  const jsonContent = JSON.stringify(demos, null, 2) + '\n'
  fs.writeFileSync(manifestPath, jsonContent, 'utf-8')

  console.log(`[build-manifest] ✅ demos-manifest.json 생성 완료 (${demos.length}개 데모 등록됨)`)
}

buildManifest()
