import { execFile } from 'node:child_process'
import { createHash } from 'node:crypto'
import { parseArgs, promisify } from 'node:util'

const run = promisify(execFile)
const BASE = '/zone/baseline'
const HOVER = `${BASE}/guides/adopting-partial-prefetching/hover-shell`
const routes = [
  { path: HOVER },
  { path: `${HOVER}/products/1`, page: `${HOVER}/products/[id]` },
  { path: `${HOVER}/products/2`, page: `${HOVER}/products/[id]` },
  { path: `${BASE}/architecture/fast-refresh-boundary` },
  { path: `${BASE}/file-conventions/dynamic-segments/single-param/items/1`,
    page: `${BASE}/file-conventions/dynamic-segments/single-param/items/[id]` },
  { path: `${BASE}/file-conventions/layout/dynamic-category-layout/shoes`,
    page: `${BASE}/file-conventions/layout/dynamic-category-layout/[category]`, modes: ['segment', 'rsc'] },
  { path: `${BASE}/file-conventions/layout/dynamic-category-layout/electronics`,
    page: `${BASE}/file-conventions/layout/dynamic-category-layout/[category]` },
]
const cacheRoutes = [
  { path: '/zone/cache/revalidating/time-based-isr' },
  { path: '/zone/cache/guides/isr-cache-components/cache-life-hours' },
]
const selectedHeaders = ['content-type', 'x-matched-path', 'x-vercel-cache', 'location']

function origin(value, name) {
  if (!value) throw new Error(`${name} 인자가 필요합니다.`)
  const url = new URL(value)
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password ||
      url.pathname !== '/' || url.search || url.hash) {
    throw new Error(`${name}에는 인증 정보·경로·쿼리 없는 HTTP origin을 지정하세요.`)
  }
  return url.origin
}

function requestHeaders(mode) {
  if (mode === 'html') return {}
  return {
    rsc: '1',
    ...(mode === 'segment' ? {
      'next-router-prefetch': '1',
      'next-router-segment-prefetch': '/_tree',
      'next-url': HOVER,
    } : {}),
  }
}

function requestUrl(host, path, headers) {
  const url = new URL(path, host)
  if (headers.rsc) {
    // Next.js 16.3.2: 이 네 헤더의 SHA-256 앞 12바이트를 base64url로 인코딩한다.
    const values = ['next-router-prefetch', 'next-router-segment-prefetch',
      'next-router-state-tree', 'next-url'].map((key) => headers[key] ?? '0')
    const hash = values.every((value) => value === '0') ? '' :
      createHash('sha256').update(values.join(',')).digest().subarray(0, 12).toString('base64url')
    url.searchParams.set('_rsc', hash)
  }
  return url
}

async function get(url, headers) {
  // 시스템 curl의 인증서 검증을 사용한다. 리다이렉트는 따라가지 않고 실패로 기록한다.
  const args = ['--silent', '--show-error', '--include', '--max-time', '25',
    '--proto', '=http,https', url.href]
  for (const [key, value] of Object.entries(headers)) args.push('--header', `${key}: ${value}`)
  const { stdout } = await run('curl', args, { encoding: 'buffer', maxBuffer: 8 * 1024 * 1024 })
  let remaining = stdout
  let status = 0
  let responseHeaders = {}
  // HTTPS CONNECT나 1xx 응답 뒤의 실제 응답 헤더까지 읽는다.
  while (remaining.subarray(0, 5).toString() === 'HTTP/') {
    const end = remaining.indexOf('\r\n\r\n')
    if (end < 0) throw new Error('HTTP 응답 헤더를 읽지 못했습니다.')
    const [line, ...lines] = remaining.subarray(0, end).toString().split('\r\n')
    status = Number(line.split(' ')[1])
    responseHeaders = Object.fromEntries(lines.flatMap((header) => {
      const colon = header.indexOf(':')
      return colon < 0 ? [] : [[header.slice(0, colon).toLowerCase(), header.slice(colon + 1).trim()]]
    }))
    remaining = remaining.subarray(end + 4)
  }
  return { status, headers: responseHeaders, body: remaining.toString() }
}

function flightTrees(body) {
  const pages = new Set()
  const invalidParams = new Set()
  const params = new Set(['d', 'c', 'oc', 'di', 'ci', 'oci'])
  function visit(value) {
    if (!value || typeof value !== 'object') return
    if (Array.isArray(value)) {
      const [segment, slots] = value
      if ((typeof segment === 'string' || Array.isArray(segment)) && slots &&
          typeof slots === 'object' && !Array.isArray(slots)) walk(value, [])
      for (const child of value) visit(child)
    } else {
      if (typeof value.name === 'string' && 'slots' in value) walkObject(value, [])
      for (const child of Object.values(value)) visit(child)
    }
  }
  // 정적 segment의 name/slots 객체 트리와 일반 Flight 배열 트리를 구분한다.
  function walkObject(node, parent) {
    const part = node.name
    const path = part && !part.startsWith('__PAGE__') && !part.startsWith('(') ? [...parent, part] : parent
    if (part.startsWith('__PAGE__')) pages.add(`/${path.join('/')}`)
    for (const child of Object.values(node.slots ?? {})) walkObject(child, path)
  }
  function walk(tree, parent) {
    const [segment, slots] = tree
    let part = segment
    if (Array.isArray(segment) && params.has(segment[2])) {
      const [name, value, kind] = segment
      let decoded = value
      try { decoded = decodeURIComponent(value) } catch {}
      if (/\.segments(?:\/|$)|_tree\.segment/.test(decoded)) invalidParams.add(`${name}=${decoded}`)
      part = kind.startsWith('oc') ? `[[...${name}]]` : kind.startsWith('c') ? `[...${name}]` : `[${name}]`
    }
    if (typeof part !== 'string') return
    const path = part && !part.startsWith('__PAGE__') && !part.startsWith('(') ? [...parent, part] : parent
    if (part.startsWith('__PAGE__')) pages.add(`/${path.join('/')}`)
    for (const child of Object.values(slots ?? {})) {
      if (Array.isArray(child)) walk(child, path)
    }
  }
  for (const line of body.split('\n')) {
    const match = line.match(/^[\da-f]+:([\[{].*)$/)
    if (!match) continue
    try { visit(JSON.parse(match[1])) } catch {}
  }
  return { pages: [...pages], invalidParams: [...invalidParams] }
}

async function check(host, route, mode, target) {
  const headers = requestHeaders(mode)
  const url = requestUrl(host, route.path, headers)
  const result = { target, mode, url: url.href, requestHeaders: headers, passed: false }
  try {
    const response = await get(url, headers)
    const expected = route.page ?? route.path
    const contentType = response.headers['content-type'] ?? ''
    const matched = response.headers['x-matched-path']
    const matchPage = matched?.replace(/\.segments\/.*$|(?:\.prefetch)?\.rsc$/, '')
    const errors = []
    if (response.status !== 200) errors.push(`HTTP ${response.status} (기대: 200)`)
    if (!contentType.startsWith(mode === 'html' ? 'text/html' : 'text/x-component')) {
      errors.push(`응답 종류 불일치: ${contentType}`)
    }
    if (matched && matchPage !== expected) errors.push(`대상 경로 불일치: ${matched}`)
    const trees = mode === 'html' ? null : flightTrees(response.body)
    if (trees) {
      if (trees.invalidParams.length) errors.push(`잘못된 전송 경로 params: ${trees.invalidParams.join(', ')}`)
      if (!trees.pages.includes(expected)) errors.push(`RSC 트리에 기대한 페이지가 없음: ${expected}`)
    }
    Object.assign(result, { status: response.status,
      responseHeaders: Object.fromEntries(selectedHeaders.filter((key) => response.headers[key])
        .map((key) => [key, response.headers[key]])),
      bodySha256: createHash('sha256').update(response.body).digest('hex'), trees,
      errors, passed: errors.length === 0 })
  } catch (error) {
    // curl stderr나 전체 헤더를 출력하지 않는다. 인증 정보가 증거에 섞이지 않게 한다.
    result.errors = [`요청 실패: ${error.code ?? error.name}`]
  }
  return result
}

try {
  const { values } = parseArgs({ options: {
    'shell-origin': { type: 'string' }, 'baseline-origin': { type: 'string' },
  } })
  const shell = origin(values['shell-origin'], '--shell-origin')
  const baseline = origin(values['baseline-origin'], '--baseline-origin')
  const tasks = []
  for (const [host, target] of [[shell, 'shell'], [baseline, 'baseline-direct']]) {
    for (const route of routes) for (const mode of route.modes ?? ['segment', 'rsc', 'html']) {
      tasks.push([host, route, mode, target])
    }
  }
  for (const route of cacheRoutes) for (const mode of ['segment', 'rsc', 'html']) {
    tasks.push([shell, route, mode, 'shell-cache'])
  }
  const results = []
  // 서버와 CDN에 과도한 동시 요청을 보내지 않는다.
  for (let offset = 0; offset < tasks.length; offset += 4) {
    results.push(...await Promise.all(tasks.slice(offset, offset + 4).map((task) => check(...task))))
  }
  const failed = results.filter((result) => !result.passed).length
  console.log(JSON.stringify({ checkedAt: new Date().toISOString(), shellOrigin: shell,
    baselineOrigin: baseline, total: results.length, failed, results }, null, 2))
  process.exitCode = failed ? 1 : 0
} catch (error) {
  console.error(`검증 인자 오류: ${error.message}`)
  process.exitCode = 2
}
