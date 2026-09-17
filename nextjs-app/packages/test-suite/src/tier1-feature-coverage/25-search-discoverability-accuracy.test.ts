import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { describe, it } from 'node:test'
import {
  deriveDocumentSeo,
  normalizeInlineMarkdown,
} from '../../../../../nextjs-docs/scripts/manifest-seo.mjs'
import { isPublicIndexingAllowed } from '../../../../apps/shell/src/lib/seo/indexability.ts'
import { DOCS_ROOT, NEXTJS_APP_ROOT, loadDemosYaml } from '../utils/test-helpers.ts'

describe('Tier 1: Feature 25 - Search discoverability and public accuracy', () => {
  describe('25.1 Document SEO manifest', () => {
    it('keeps Markdown text intact while deriving a learning-goal description', () => {
      const normalized = normalizeInlineMarkdown(
        '[공식 문서](https://example.com)와 `node_modules`의 `cache_tag`, <Image>를 확인한다.',
      )

      assert.strictEqual(normalized, '공식 문서와 node_modules의 cache_tag, <Image>를 확인한다.')
    })

    it('uses a source-backed fallback and disambiguates duplicate H1 values by parent README', () => {
      const docs = deriveDocumentSeo([
        { path: 'guides/README.md', title: 'Guides', content: '# Guides' },
        {
          path: 'guides/caching.md',
          title: 'Caching',
          content: '# Caching\n\n## 학습 목표\n\n- `node_modules`의 캐시 동작을 설명한다.\n',
        },
        { path: 'api/README.md', title: 'API Reference', content: '# API Reference' },
        {
          path: 'api/caching.md',
          title: 'Caching',
          content: '# Caching\n\n## 학습 목표\n\n- 캐시 API의 적용 범위를 설명한다.\n',
        },
        { path: 'migration/README.md', title: 'Migrating', content: '# Migrating\n\n## 학습 순서\n' },
      ])

      const guidesCaching = docs.find((doc) => doc.path === 'guides/caching.md')
      const apiCaching = docs.find((doc) => doc.path === 'api/caching.md')
      const migration = docs.find((doc) => doc.path === 'migration/README.md')

      assert.strictEqual(guidesCaching?.seoTitle, 'Caching — Guides')
      assert.strictEqual(apiCaching?.seoTitle, 'Caching — API Reference')
      assert.strictEqual(guidesCaching?.description, 'Caching — Guides: node_modules의 캐시 동작을 설명한다.')
      assert.strictEqual(
        migration?.description,
        'Migrating에서 다루는 Next.js App Router 항목과 학습 순서를 정리한 한국어 가이드입니다.',
      )
    })

    it('fails rather than inventing a path-based title when duplicate H1 values have no parent README', () => {
      assert.throws(
        () => deriveDocumentSeo([
          { path: 'one.md', title: 'Duplicate', content: '# Duplicate\n\n## 학습 목표\n\n- 첫 설명이다.' },
          { path: 'two.md', title: 'Duplicate', content: '# Duplicate\n\n## 학습 목표\n\n- 두 번째 설명이다.' },
        ]),
        /상위 README/,
      )
    })

    it('writes non-empty, unique SEO fields for every non-root manifest document', () => {
      const manifest = JSON.parse(fs.readFileSync(path.join(DOCS_ROOT, 'docs-manifest.json'), 'utf-8'))
      const detailDocs = manifest.docs.filter((doc: { url: string }) => doc.url !== '/')
      const seoTitles = detailDocs.map((doc: { seoTitle?: string }) => doc.seoTitle)
      const descriptions = detailDocs.map((doc: { description?: string }) => doc.description)

      assert.strictEqual(detailDocs.length, 283)
      assert.ok(seoTitles.every((title: unknown) => typeof title === 'string' && title.length > 0))
      assert.ok(descriptions.every((description: unknown) => typeof description === 'string' && description.length > 0))
      assert.strictEqual(new Set(seoTitles).size, detailDocs.length)
      assert.strictEqual(new Set(descriptions).size, detailDocs.length)
    })
  })

  describe('25.2 Deployment indexing policy', () => {
    it('allows only production Vercel values, or a deployment without Vercel variables', () => {
      assert.strictEqual(isPublicIndexingAllowed({}), true)
      assert.strictEqual(isPublicIndexingAllowed({ targetEnv: 'production', vercelEnv: 'production' }), true)
      assert.strictEqual(isPublicIndexingAllowed({ vercelEnv: 'production' }), true)
      assert.strictEqual(isPublicIndexingAllowed({ vercelEnv: 'preview' }), false)
      assert.strictEqual(isPublicIndexingAllowed({ targetEnv: 'staging', vercelEnv: 'preview' }), false)
      assert.strictEqual(isPublicIndexingAllowed({ targetEnv: 'production', vercelEnv: 'preview' }), false)
      assert.strictEqual(isPublicIndexingAllowed({ targetEnv: 'unknown-environment' }), false)
    })

    it('applies the shared policy to root metadata, page metadata, and robots output', () => {
      const shellSrc = path.join(NEXTJS_APP_ROOT, 'apps/shell/src')
      const metadataSource = fs.readFileSync(path.join(shellSrc, 'lib/seo/metadata.ts'), 'utf-8')
      const layoutSource = fs.readFileSync(path.join(shellSrc, 'app/layout.tsx'), 'utf-8')
      const robotsSource = fs.readFileSync(path.join(shellSrc, 'app/robots.ts'), 'utf-8')

      assert.match(metadataSource, /isPublicIndexingAllowed\(\)/)
      assert.match(metadataSource, /robots: \{ index: false, follow: false \}/)
      assert.match(layoutSource, /isPublicIndexingAllowed\(\)/)
      assert.match(layoutSource, /robots: \{ index: false, follow: false \}/)
      assert.match(robotsSource, /if \(!isPublicIndexingAllowed\(\)\)/)
      assert.match(robotsSource, /disallow: '\/'/)
      assert.doesNotMatch(robotsSource.match(/if \(!isPublicIndexingAllowed\(\)\)[\s\S]*?return \{([\s\S]*?)\n  \}/)?.[1] ?? '', /sitemap:/)
    })
  })

  describe('25.3 Home demo availability', () => {
    it('keeps the source totals separate and routes live claims through done demos', () => {
      const demos = loadDemosYaml()
      const doneDemos = demos.filter((demo) => demo.status === 'done')
      const homePage = fs.readFileSync(
        path.join(DOCS_ROOT, '../nextjs-app/apps/shell/src/app/page.tsx'),
        'utf-8',
      )
      const hero = fs.readFileSync(
        path.join(DOCS_ROOT, '../nextjs-app/apps/shell/src/components/home/RoadmapHero.tsx'),
        'utf-8',
      )
      const featured = fs.readFileSync(
        path.join(DOCS_ROOT, '../nextjs-app/apps/shell/src/components/home/FeaturedDemosSection.tsx'),
        'utf-8',
      )

      assert.strictEqual(demos.length, 240)
      assert.strictEqual(doneDemos.length, 58)
      assert.match(homePage, /allDemos\.filter\(\(demo\) => demo\.status === 'done'\)/)
      assert.match(homePage, /availableDemoCount=\{availableDemoCount\}/)
      assert.match(hero, /\{availableDemoCount\} Live Demos/)
      assert.match(hero, /전체 등록 \{registeredDemoCount\}개/)
      assert.match(featured, /new Set\(availableDemos\.map\(\(demo\) => demo\.url\)\)/)
    })
  })
})
