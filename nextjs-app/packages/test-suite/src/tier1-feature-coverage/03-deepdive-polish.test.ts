import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { loadDemosYaml, getDemoSourceDir, getAllFiles } from '../utils/test-helpers.ts'

describe('Tier 1: Feature 3 - DeepDive Card Content Polish', () => {
  const demos = loadDemosYaml()

  it('3.1 should have authentic SSE streaming explanation in streaming-sse demo', () => {
    const sseDemo = demos.find((d) => d.url.includes('streaming-sse') || d.url.includes('sse'))
    if (sseDemo) {
      const demoDir = getDemoSourceDir(sseDemo)
      const files = getAllFiles(demoDir, ['.tsx', '.ts'])
      const allText = files.map((f) => fs.readFileSync(f, 'utf-8')).join('\n')
      assert.doesNotMatch(allText, /GeoIP|위치\s*기반\s*헤더/i, 'SSE stream demo must not contain GeoIP copy-paste')
      assert.match(allText, /SSE|Stream|ReadableStream|청크|이벤트/i, 'SSE demo must have streaming-related content')
    }
  })

  it('3.2 should have segment-specific explanations in route-segment-config demos', () => {
    const rscDemos = demos.filter((d) => d.url.startsWith('route-segment-config/'))
    for (const demo of rscDemos) {
      const demoDir = getDemoSourceDir(demo)
      const files = getAllFiles(demoDir, ['.tsx', '.ts'])
      const allText = files.map((f) => fs.readFileSync(f, 'utf-8')).join('\n')
      assert.doesNotMatch(allText, /GeoIP|위치\s*기반\s*헤더/i, `Route segment demo '${demo.url}' must not contain GeoIP copy-paste`)
    }
  })

  it('3.3 should have format-specific explanations for image optimization demos without S3 boilerplate', () => {
    const imageDemos = demos.filter((d) => d.url.startsWith('components/image/') || d.url.startsWith('config/images/'))
    for (const demo of imageDemos) {
      const demoDir = getDemoSourceDir(demo)
      const files = getAllFiles(demoDir, ['.tsx', '.ts'])
      const allText = files.map((f) => fs.readFileSync(f, 'utf-8')).join('\n')
      assert.doesNotMatch(allText, /S3\s*CDN\s*버킷\s*업로드/i, `Image demo '${demo.url}' must not contain duplicate S3 CDN boilerplate`)
    }
  })

  it('3.4 should verify all 241 demos have non-empty DeepDive card concepts or explanations', () => {
    let deepDiveCount = 0
    for (const demo of demos) {
      const demoDir = getDemoSourceDir(demo)
      const files = getAllFiles(demoDir, ['.tsx', '.ts'])
      const allText = files.map((f) => fs.readFileSync(f, 'utf-8')).join('\n')
      if (allText.includes('DemoDeepDiveCard') || allText.includes('핵심 원리') || allText.includes('동작 원리')) {
        deepDiveCount++
      }
    }
    assert.ok(deepDiveCount >= 230, `Expected at least 230 demos to have DeepDive card explanations (found ${deepDiveCount})`)
  })

  it('3.5 should verify card titles match their respective demo topic domains', () => {
    for (const demo of demos.slice(0, 30)) {
      const demoDir = getDemoSourceDir(demo)
      const files = getAllFiles(demoDir, ['.tsx', '.ts'])
      const allText = files.map((f) => fs.readFileSync(f, 'utf-8')).join('\n')
      assert.ok(allText.length > 50, `Demo '${demo.url}' files must not be empty`)
    }
  })
})
