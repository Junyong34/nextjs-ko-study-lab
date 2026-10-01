import { ICON_SIZES } from '../constants'
import type { Check, ManifestReport } from '../types'

const DISPLAY_MODES = ['standalone', 'fullscreen', 'minimal-ui']

interface ManifestIcon {
  src?: string
  sizes?: string
  type?: string
}

interface ManifestJson {
  name?: string
  short_name?: string
  start_url?: string
  scope?: string
  display?: string
  icons?: ManifestIcon[]
}

const check = (id: string, label: string, ok: boolean, detail: string): Check => ({ id, label, ok, detail })

// 아이콘을 실제로 내려받아 디코딩해 선언한 크기와 같은지 본다 — 선언만 믿지 않는다.
async function inspectIcon(icon: ManifestIcon | undefined, size: number, base: string): Promise<Check> {
  const id = `icon-${size}`
  const label = `아이콘 ${size}x${size} PNG`
  if (!icon?.src) return check(id, label, false, 'icons[]에 해당 크기 선언이 없습니다')
  try {
    const res = await fetch(new URL(icon.src, base), { cache: 'no-store' })
    const type = res.headers.get('content-type') ?? ''
    const bitmap = await createImageBitmap(await res.blob())
    const actual = `${bitmap.width}x${bitmap.height}`
    const ok = res.ok && type.includes('image/png') && actual === `${size}x${size}`
    return check(id, label, ok, `${icon.src} → ${res.status} ${type}, 실제 ${actual}`)
  } catch (error) {
    return check(id, label, false, `내려받기/디코딩 실패: ${(error as Error).message}`)
  }
}

export async function inspectManifest(): Promise<ManifestReport> {
  const link = document.querySelector<HTMLLinkElement>('link[rel="manifest"]')
  const linkHref = link?.href ?? null
  const checks: Check[] = [
    check('link', '<link rel="manifest"> 존재', Boolean(linkHref), linkHref ?? '문서 head에 manifest 링크가 없습니다'),
  ]
  if (!linkHref) return { linkHref, status: null, contentType: null, checks, allOk: false }

  let res: Response
  try {
    res = await fetch(linkHref, { cache: 'no-store' })
  } catch (error) {
    checks.push(check('response', 'manifest 응답', false, `fetch 실패: ${(error as Error).message}`))
    return { linkHref, status: null, contentType: null, checks, allOk: false }
  }
  const contentType = res.headers.get('content-type')
  checks.push(
    check(
      'response',
      '응답 200 + application/manifest+json',
      res.status === 200 && Boolean(contentType?.includes('manifest+json')),
      `${res.status} ${contentType ?? '(Content-Type 없음)'}`,
    ),
  )

  let json: ManifestJson
  try {
    json = (await res.json()) as ManifestJson
  } catch {
    checks.push(check('json', 'JSON 파싱', false, '응답 본문이 JSON이 아닙니다'))
    return { linkHref, status: res.status, contentType, checks, allOk: false }
  }

  checks.push(check('name', 'name / short_name', Boolean(json.name || json.short_name), `${json.name ?? '-'} / ${json.short_name ?? '-'}`))

  // start_url은 scope 안에 있어야 한다. scope를 생략하면 start_url의 디렉터리가 기본 scope가 된다.
  const start = new URL(json.start_url ?? '', linkHref)
  const scope = json.scope ? new URL(json.scope, linkHref) : new URL('.', start)
  const inScope = start.origin === scope.origin && start.pathname.startsWith(scope.pathname)
  checks.push(check('scope', 'start_url이 scope 안', inScope, `start_url ${start.pathname}${start.search} · scope ${scope.pathname}`))

  checks.push(
    check('display', 'display 설치형 모드', DISPLAY_MODES.includes(json.display ?? ''), `display: ${json.display ?? '(없음)'}`),
  )

  const icons = json.icons ?? []
  const iconChecks = await Promise.all(
    ICON_SIZES.map((size) =>
      inspectIcon(icons.find((icon) => icon.sizes?.split(' ').includes(`${size}x${size}`)), size, linkHref),
    ),
  )
  checks.push(...iconChecks)

  return { linkHref, status: res.status, contentType, checks, allOk: checks.every((item) => item.ok) }
}
