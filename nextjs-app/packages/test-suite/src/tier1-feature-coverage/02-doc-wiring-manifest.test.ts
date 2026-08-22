import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { loadDemosYaml, loadDemosManifest, resolveDocFile } from '../utils/test-helpers.ts'

describe('Tier 1: Feature 2 - Doc Wiring & Manifest Integrity', () => {
  const demos = loadDemosYaml()
  const manifest = loadDemosManifest()

  it('2.1 should correctly map React compiler demo to compiler docs', () => {
    const demo = demos.find((d) => d.url === 'architecture/compiler-optimization/react-compiler')
    assert.ok(demo, 'React compiler demo should be defined in demos.yaml')
    assert.doesNotMatch(demo.doc, /fast-refresh\.md$/, 'React compiler must not point to fast-refresh.md')
    const docFile = resolveDocFile(demo.doc)
    assert.ok(docFile, `Doc file must exist for: ${demo.doc}`)
  })

  it('2.2 should correctly map CSRF protection demo to security docs', () => {
    const demo = demos.find((d) => d.url === 'architecture/server-action-security/csrf-protection')
    assert.ok(demo, 'CSRF demo should be defined in demos.yaml')
    assert.doesNotMatch(demo.doc, /fast-refresh\.md$/, 'CSRF protection must not point to fast-refresh.md')
    const docFile = resolveDocFile(demo.doc)
    assert.ok(docFile, `Doc file must exist for: ${demo.doc}`)
  })

  it('2.3 should correctly map Turbopack demo to turbopack docs', () => {
    const demo = demos.find((d) => d.url === 'architecture/turbopack/incremental-harness')
    assert.ok(demo, 'Turbopack demo should be defined in demos.yaml')
    assert.doesNotMatch(demo.doc, /fast-refresh\.md$/, 'Turbopack harness must not point to fast-refresh.md')
    const docFile = resolveDocFile(demo.doc)
    assert.ok(docFile, `Doc file must exist for: ${demo.doc}`)
  })

  it('2.4 should match manifest and yaml entry count (241 total)', () => {
    assert.strictEqual(demos.length, 241, 'demos.yaml must contain exactly 241 demos')
    assert.strictEqual(manifest.length, 241, 'demos-manifest.json must contain exactly 241 demos')
  })

  it('2.5 should verify every demo URL follows valid kebab-case slug structure', () => {
    const slugRegex = /^[a-z0-9-]+(\/[a-z0-9-]+)*$/
    for (const demo of demos) {
      assert.match(demo.url, slugRegex, `Demo URL '${demo.url}' must follow kebab-case format without trailing slashes`)
    }
  })
})
