import fs from 'node:fs'
import path from 'node:path'
import { loadDemosManifest, getDemoSourceDir } from '../packages/test-suite/src/utils/test-helpers.ts'
import { parseGuideCardFromTsx, validateGuideConsistency } from '../packages/test-suite/src/runners/guide-consistency-validator.ts'

const demos = loadDemosManifest()

// 1. List of 38 zero-interactive demos to convert to 2 steps (Observation / Config / Static)
const ZERO_INTERACTIVE_URLS = new Set([
  'file-conventions/metadata-app-icons/dynamic-favicon',
  'file-conventions/metadata-manifest/dynamic-pwa-manifest',
  'file-conventions/metadata-og/discount-banner-og',
  'file-conventions/metadata-robots/dynamic-crawler-rules',
  'file-conventions/metadata-sitemap/split-index-sitemaps',
  'file-conventions/route-segment-config/runtime-nodejs-edge',
  'file-conventions/loading/nested-segment-loading',
  'file-conventions/route-groups/shop-vs-admin-roots',
  'file-conventions/parallel-routes/conditional-slot',
  'file-conventions/parallel-routes/independent-tabs',
  'file-conventions/intercepting-routes/direct-vs-modal',
  'file-conventions/instrumentation/client-timing-metrics',
  'functions/use-selected-layout-segments/breadcrumb',
  'functions/cache-tag/multi-tag-binding',
  'functions/headers/custom-auth-token',
  'functions/image-response/dynamic-receipt',
  'functions/generate-metadata/parent-inheritance',
  'functions/generate-static-params/multiple-segments',
  'functions/server-runtime/edge-vs-nodejs',
  'functions/use-report-web-vitals/telemetry',
  'directives/use-client/boundary-declaration',
  'directives/use-cache/private-profile-cache',
  'config/base-path/subpath-routing',
  'config/redirects/header-query-condition',
  'config/stale-times/router-cache-tuning',
  'edge/v8-lightweight/global-web-apis',
  'architecture/server-action-security/csrf-protection',
  'architecture/turbopack/incremental-harness',
  'guides/json-ld/product-schema',
  'guides/scripts/strategy-order',
  'guides/third-party-libraries/youtube-embed',
  'guides/bff/response-shaping',
  'guides/opentelemetry/trace-span',
  'guides/environment-variables/public-vs-server',
  'guides/css-in-js/style-registry',
  'guides/server-and-client-boundary/props-serialization',
  'guides/auth-cache-components/static-layout-session-context',
  'guides/prefetching/viewport-vs-hover',
  'guides/optimizing-prefetching/bandwidth-saver',
])

function convertTo2Step(dir: string): boolean {
  const rootEntries = [path.join(dir, 'page.tsx'), path.join(dir, 'layout.tsx')]
  let targetFile = ''
  let content = ''
  for (const entry of rootEntries) {
    if (fs.existsSync(entry)) {
      const text = fs.readFileSync(entry, 'utf-8')
      if (text.includes('DemoGuideCard')) {
        targetFile = entry
        content = text
        break
      }
    }
  }
  if (!targetFile) return false

  const guide = parseGuideCardFromTsx(content)
  if (!guide || guide.steps.length !== 3) return false

  const s1 = guide.steps[0]
  const s2 = guide.steps[1]
  const s3 = guide.steps[2]

  const combinedTitle = `${s1.title} 및 ${s2.title}`
  const combinedDesc = `${s1.description} ${s2.description}`

  const newSteps = [
    {
      step: 1,
      title: combinedTitle,
      description: combinedDesc,
      actionBadge: s1.actionBadge || '설정 점검',
    },
    {
      step: 2,
      title: s3.title,
      description: s3.description,
      actionBadge: s3.actionBadge || '동작 검증',
      observe: s3.observe,
      observeAt: s3.observeAt || 'verification',
    },
  ]

  const stepsStr = JSON.stringify(newSteps, null, 10)
  const stepsMatch = content.match(/steps=\{([\s\S]*?)\}(?=\s*(?:\/>|<\/DemoGuideCard>))/g)
  if (!stepsMatch) return false

  const updatedContent = content.replace(/steps=\{[\s\S]*?\}(?=\s*(?:\/>|<\/DemoGuideCard>))/, `steps={${stepsStr}}`)
  fs.writeFileSync(targetFile, updatedContent, 'utf-8')
  return true
}

let count2 = 0
for (const demo of demos) {
  if (ZERO_INTERACTIVE_URLS.has(demo.url)) {
    const dir = getDemoSourceDir(demo)
    if (convertTo2Step(dir)) {
      count2++
    }
  }
}

console.log(`Converted ${count2} zero-interactive demos to 2-step.`)

// Run validation
const res = validateGuideConsistency()
const counts: Record<number, number> = {}
for (const a of res.audits) {
  const steps = a.guide ? a.guide.steps.length : 0
  counts[steps] = (counts[steps] || 0) + 1
}
console.log('Step Distribution:', counts)
const threeStepCount = counts[3] || 0
console.log('3-step count:', threeStepCount, 'Ratio:', ((threeStepCount / res.totalDemos) * 100).toFixed(2) + '%')
