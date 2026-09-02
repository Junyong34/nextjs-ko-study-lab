import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const REPO_ROOT = path.resolve(__dirname, '../../../../..')
const DEMO_ROOT = path.join(
  REPO_ROOT,
  'nextjs-app/apps/demo-baseline/src/app/zone/baseline/images/image-optimization',
)
const CLIENT_PATH = path.join(DEMO_ROOT, 'components/ImageComparisonClient.tsx')
const ASSET_PATH = path.join(DEMO_ROOT, 'assets/keyboard.webp')

test('image optimization demo ships a local WebP asset for both image renderers', () => {
  assert.ok(fs.existsSync(ASSET_PATH), `Missing demo asset: ${ASSET_PATH}`)

  const asset = fs.readFileSync(ASSET_PATH)
  assert.equal(asset.subarray(0, 4).toString('ascii'), 'RIFF')
  assert.equal(asset.subarray(8, 12).toString('ascii'), 'WEBP')

  const clientSource = fs.readFileSync(CLIENT_PATH, 'utf-8')
  assert.match(clientSource, /import keyboardImage from '..\/assets\/keyboard\.webp'/)
  assert.match(clientSource, /src=\{SAMPLE_IMAGE_URL\}/)
  assert.match(clientSource, /<Image[\s\S]*src=\{keyboardImage\}/)
})
