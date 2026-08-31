import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { describe, it } from 'node:test'
import { NEXTJS_APP_ROOT } from '../utils/test-helpers.ts'

const primitivesRoot = path.join(NEXTJS_APP_ROOT, 'packages/ui/src/primitives')
const perspectiveBookPath = path.join(primitivesRoot, 'PerspectiveBook.tsx')
const perspectiveBookContentPath = path.join(primitivesRoot, 'PerspectiveBookContent.tsx')
const primitivesIndexPath = path.join(primitivesRoot, 'index.ts')
const stylesPath = path.join(NEXTJS_APP_ROOT, 'packages/ui/src/styles.ts')

function readSource(filePath: string): string {
  assert.ok(fs.existsSync(filePath), `${path.basename(filePath)} must exist`)
  return fs.readFileSync(filePath, 'utf-8')
}

describe('Tier 1: PerspectiveBook shared primitive contract', () => {
  it('exports the primitive, content helpers, and wrapper-safe surface classes', () => {
    const source = readSource(perspectiveBookPath)
    const content = readSource(perspectiveBookContentPath)
    const barrel = readSource(primitivesIndexPath)

    assert.match(source, /export (?:function|const) PerspectiveBook\b/)
    assert.match(source, /export function bookSurfaceClass\b/)
    assert.match(source, /bookSurfaceClass\(\{[\s\S]*tone[\s\S]*trigger[\s\S]*pages/)
    assert.match(source, /children\??:/)
    assert.match(source, /className\??:/)
    assert.match(source, /tone\??:/)
    assert.match(source, /depth\??:/)
    assert.match(source, /width\??:/)
    assert.match(source, /pages\??:/)
    assert.match(source, /trigger\??:/)
    assert.match(content, /export (?:function|const) PerspectiveBookHeader\b/)
    assert.match(content, /export (?:function|const) PerspectiveBookTitle\b/)
    assert.match(content, /export (?:function|const) PerspectiveBookDescription\b/)
    assert.match(content, /as\??:/)
    assert.match(barrel, /export \* from '\.\/PerspectiveBook'/)
    assert.match(barrel, /export \* from '\.\/PerspectiveBookContent'/)
    assert.doesNotMatch(source, /(?:rawColor|textColor|variant\??:\s*['"](?:default|simple))/)
    assert.doesNotMatch(content, /<(?:a|Link)\b|status/i)
  })

  it('renders the front, pages/spine, and back in a preserved 3D context', () => {
    const source = readSource(perspectiveBookPath)

    assert.match(source, /aspect-\[49\/60\]/)
    assert.match(source, /\[transform-style:preserve-3d\]/)
    assert.match(source, /translateZ\(calc\(var\(--book-d\)_\/_2\)\)/)
    assert.match(source, /translateZ\(calc\(var\(--book-d\)_\/_-2\)\)/)
    assert.match(source, /rotateY\(180deg\)/)
    assert.match(source, /rotateY\(90deg\)/)
    assert.match(source, /aria-hidden/)
  })

  it('keeps trigger paths literal and sends geometry only through CSS variables', () => {
    const source = readSource(perspectiveBookPath)

    assert.match(source, /hover:[^'"`]+focus-visible:/)
    assert.match(source, /group-hover:[^'"`]+group-focus-visible:/)
    assert.match(source, /'--book-w':\s*width/)
    assert.match(source, /'--book-d':\s*depth/)
    assert.match(source, /w-\[var\(--book-w\)\]/)
    assert.match(source, /motion-reduce:transition-none/)
    assert.match(source, /pointer-events-none/)
    assert.doesNotMatch(source, /useState|useEffect|onMouse|onFocus/)
    assert.doesNotMatch(source, /w-\[\$\{|\[--book-[wd]:\$\{/)
  })

  it('uses zinc cover surfaces and reserves semantic colors for book accents', () => {
    const styles = readSource(stylesPath)
    const tonesMatch = styles.match(/export const BOOK_TONES\s*=\s*\{([\s\S]*?)\n\}\s+as const/)

    assert.ok(tonesMatch, 'BOOK_TONES must be statically defined')
    const tones = tonesMatch[1]
    assert.match(tones, /cover:\s*['"][^'"]*zinc-/)
    assert.doesNotMatch(tones, /cover:\s*['"][^'"]*(?:blue|emerald|purple|rose)-/)
    assert.match(tones, /accent:\s*['"][^'"]*(?:blue|emerald|purple|rose)-/)
  })

  it('avoids unapproved UI dependencies and image transport in the primitive', () => {
    const source = readSource(perspectiveBookPath)

    assert.doesNotMatch(
      source,
      /lucide-react|@radix-ui|class-variance-authority|@\/lib\/utils|next\/image|data:image\//,
    )
  })
})
