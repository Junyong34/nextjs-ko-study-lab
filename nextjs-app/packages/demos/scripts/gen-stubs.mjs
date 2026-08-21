import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import yaml from 'js-yaml'
import { z } from 'zod'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const packageRoot = path.resolve(__dirname, '..')
const repoRoot = path.resolve(packageRoot, '../../..')
const yamlPath = path.join(packageRoot, 'demos.yaml')

const ZONE_APP_DIR_MAP = {
  baseline: 'apps/demo-baseline',
  cache: 'apps/demo-cache-components',
  prefetch: 'apps/demo-prefetch',
  export: 'apps/demo-export',
  proxy: 'apps/demo-proxy',
}

const DemoZoneSchema = z.enum(['baseline', 'cache', 'prefetch', 'export', 'proxy'])
const DemoStatusSchema = z.enum(['stub', 'wip', 'done'])

const DemoSchema = z.object({
  url: z.string().min(1),
  title: z.string().min(1),
  doc: z.string().min(1),
  zone: DemoZoneSchema,
  status: DemoStatusSchema,
})

const DemosListSchema = z.array(DemoSchema)

function generateStubContent(demo) {
  const normalizedTag = `${demo.url.replace(/\//g, '-')}:sample`

  return `/**
 * Demo: ${demo.title}
 * URL: /demo/${demo.url}
 * Internal: /zone/${demo.zone}/${demo.url}
 * Doc: ${demo.doc}
 * Status: ${demo.status}
 */

import { DemoContainer, ExpectedActualPanel } from '@study/demo-kit'

export default function DemoPage() {
  const timestamp = new Date().toLocaleTimeString('ko-KR')

  return (
    <DemoContainer className="p-4 sm:p-6 max-w-2xl mx-auto space-y-4 sm:space-y-6">
      {/* 제목·설명·zone은 셸이 그린다 (규칙 12). 여기는 데모 본체와 조작만 둔다. */}

      {/* 데모 상호작용 및 실증 영역 */}
      <div className="p-4 rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 space-y-4 shadow-xs">
        <div className="p-4 bg-zinc-50 dark:bg-zinc-800/60 rounded border border-zinc-200/80 dark:border-zinc-700/60 text-sm space-y-2">
          <p className="font-medium text-zinc-900 dark:text-zinc-100">데모 실행 공간</p>
          <p className="text-zinc-600 dark:text-zinc-400">
            이곳에 [\${demo.title}] 실증 코드를 작성하세요.
          </p>
          {/* 캐시 태그 규칙 예시 주석: cacheTag('\${normalizedTag}') */}
        </div>
      </div>

      {/* 기대 / 실제 관찰 결과 (03. 결합 구조 설계 §4-8) */}
      <ExpectedActualPanel
        title="\${demo.title} 실증 검증"
        description="데모 조작 시 명시된 사양에 따른 정상 동작 및 상태 변화 관찰"
        expected="데모 조작 시 명시된 사양에 따른 정상 동작 및 상태 변화 관찰"
        actual={\`렌더링 완료 (\${timestamp})\`}
        isMatched={true}
      />
    </DemoContainer>
  )
}
`
}

function generateStubs() {
  console.log(`[gen-stubs] demos.yaml 읽는 중: ${yamlPath}`)

  if (!fs.existsSync(yamlPath)) {
    console.error(`[gen-stubs] 오류: demos.yaml을 찾을 수 없습니다: ${yamlPath}`)
    process.exit(1)
  }

  const rawYaml = fs.readFileSync(yamlPath, 'utf-8')
  let parsedRaw
  try {
    parsedRaw = yaml.load(rawYaml)
  } catch (err) {
    console.error(`[gen-stubs] YAML 파싱 실패:`, err.message)
    process.exit(1)
  }

  const parseResult = DemosListSchema.safeParse(parsedRaw)
  if (!parseResult.success) {
    console.error(`[gen-stubs] 스키마 검증 실패:`)
    console.error(JSON.stringify(parseResult.error.format(), null, 2))
    process.exit(1)
  }

  const demos = parseResult.data
  let createdCount = 0
  let skippedCount = 0

  for (const demo of demos) {
    const appDir = ZONE_APP_DIR_MAP[demo.zone]
    if (!appDir) {
      console.warn(`[gen-stubs] ⚠️ 알 수 없는 zone 건너뜀: ${demo.zone} (데모: ${demo.url})`)
      continue
    }

    const demoRouteDir = path.join(
      repoRoot,
      'nextjs-app',
      appDir,
      'src/app/zone',
      demo.zone,
      demo.url,
    )
    const entryPageFile = path.join(demoRouteDir, 'page.tsx')

    if (fs.existsSync(entryPageFile)) {
      console.log(`[gen-stubs] ⏩ 이미 존재함 (건너뜀): ${path.relative(repoRoot, entryPageFile)}`)
      skippedCount++
      continue
    }

    fs.mkdirSync(demoRouteDir, { recursive: true })
    const stubCode = generateStubContent(demo)
    fs.writeFileSync(entryPageFile, stubCode, 'utf-8')
    console.log(`[gen-stubs] ➕ 스텁 생성: ${path.relative(repoRoot, entryPageFile)}`)
    createdCount++
  }

  console.log(`----------------------------------------`)
  console.log(`[gen-stubs] 완료: ${createdCount}개 생성, ${skippedCount}개 건너뜀 (총 ${demos.length}개)`)
}

generateStubs()
