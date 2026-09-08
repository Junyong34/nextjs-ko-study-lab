import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { describe, it } from 'node:test'
import {
  NEXTJS_APP_ROOT,
  getAllFiles,
  loadDemosManifest,
  loadDemosYaml,
} from '../utils/test-helpers.ts'

const demoRoot = path.join(
  NEXTJS_APP_ROOT,
  'apps/demo-baseline/src/app/zone/baseline/architecture',
)
const targets = [
  'architecture/accessibility/form-aria-support',
  'architecture/accessibility/modal-focus-trap',
  'architecture/compiler-optimization/react-compiler',
  'architecture/server-action-security/csrf-protection',
]

function read(relativePath: string) {
  return fs.readFileSync(path.join(NEXTJS_APP_ROOT, relativePath), 'utf-8')
}

function readDemo(relativePath: string) {
  return getAllFiles(path.join(demoRoot, relativePath), ['.ts', '.tsx'])
    .map((file) => fs.readFileSync(file, 'utf-8'))
    .join('\n')
}

describe('Tier 1: architecture demos use authentic mechanisms', () => {
  it('publishes the remaining selected entries in YAML and generated manifest', () => {
    for (const demos of [loadDemosYaml(), loadDemosManifest()]) {
      for (const url of targets) {
        assert.equal(demos.find((demo) => demo.url === url)?.status, 'done', url)
      }
    }
  })

  it('observes dynamic form ARIA attributes from the rendered DOM', () => {
    const source = readDemo('accessibility/form-aria-support')
    assert.match(source, /getAttribute\('aria-invalid'\)/)
    assert.match(source, /aria-invalid=\{hasError \|\| undefined\}/)
    assert.match(source, /aria-describedby=\{hasError \? 'card-number-error' : 'card-number-help'\}/)
    assert.match(source, /role="alert"/)
  })

  it('uses a real modal dialog and observes focus restoration', () => {
    const source = readDemo('accessibility/modal-focus-trap')
    assert.match(source, /<dialog/)
    assert.match(source, /\.showModal\(\)/)
    assert.match(source, /onCancel=/)
    assert.match(source, /document\.activeElement === triggerRef\.current/)
  })

  it('configures the native Rust React Compiler in annotation mode', () => {
    const config = read('apps/demo-baseline/next.config.ts')
    const settings = read('apps/demo-baseline/src/config/react-compiler-settings.ts')
    const component = readDemo('compiler-optimization/react-compiler')
    const packageJson = read('apps/demo-baseline/package.json')
    assert.match(config, /reactCompiler: REACT_COMPILER_SETTINGS/)
    assert.match(config, /turbopackRustReactCompiler: USE_TURBOPACK_RUST_REACT_COMPILER/)
    assert.match(settings, /compilationMode: 'annotation'/)
    assert.match(settings, /USE_TURBOPACK_RUST_REACT_COMPILER = true/)
    assert.match(component, /'use memo'/)
    assert.doesNotMatch(component, /\buseMemo\(|\buseCallback\(/)
    assert.doesNotMatch(packageJson, /"babel-plugin-react-compiler"/)
  })

  it('executes a real Server Action and reads request headers on the server', () => {
    const source = readDemo('server-action-security/csrf-protection')
    assert.match(source, /'use server'/)
    assert.match(source, /await headers\(\)/)
    assert.match(source, /useActionState\(/)
    assert.match(source, /<form action=\{formAction\}/)
    assert.doesNotMatch(source, /Origin: https:\/\/shop\.com/)
    assert.doesNotMatch(source, /100% 원천 차단/)
  })

  it('excludes the repository-dependent Turbopack exercise from public demos', () => {
    for (const demos of [loadDemosYaml(), loadDemosManifest()]) {
      assert.equal(demos.some(demo => demo.url === 'architecture/turbopack/incremental-harness'), false)
    }
    assert.equal(fs.existsSync(path.join(demoRoot, 'turbopack/incremental-harness/page.tsx')), false)
  })
})
