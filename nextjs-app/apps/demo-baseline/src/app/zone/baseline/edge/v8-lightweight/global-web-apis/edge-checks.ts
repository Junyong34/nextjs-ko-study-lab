import type { ApiCheck, ProbeResponse } from './types'
import { base64FromUtf8, sha256Hex, utf8Bytes, utf8FromBase64, UUID_V4 } from './web-std'

// probe/route.ts(runtime = 'edge')에서만 호출한다. 공식 문서의 Edge Runtime 지원 API 목록에 있는
// Web 표준 전역만 실제로 호출하고, 결과를 그대로 반환한다. 외부 네트워크(fetch)는 쓰지 않는다 —
// 데모가 외부 서비스 가용성에 좌우되지 않도록, 네트워크 계열은 Request/Response/Headers를 메모리 안에서 왕복한다.

type EdgeGlobal = typeof globalThis & { EdgeRuntime?: unknown }

function check(api: string, group: ApiCheck['group'], call: string, value: string, ok: boolean): ApiCheck {
  return { api, group, call, value, ok }
}

/** setTimeout으로 abort()를 예약하고, 'abort' 이벤트가 실제로 도착할 때까지 기다린다. */
function abortAfter(ms: number): Promise<{ aborted: boolean; reason: string; elapsed: number }> {
  const controller = new AbortController()
  const started = Date.now()
  return new Promise((resolve) => {
    controller.signal.addEventListener('abort', () => {
      const reason = controller.signal.reason
      resolve({
        aborted: controller.signal.aborted,
        reason: reason instanceof DOMException ? reason.name : String(reason),
        elapsed: Date.now() - started,
      })
    })
    setTimeout(() => controller.abort(), ms)
  })
}

async function upperCaseViaStreams(input: string): Promise<string> {
  const source = new ReadableStream<string>({
    start(controller) {
      for (const ch of Array.from(input)) controller.enqueue(ch)
      controller.close()
    },
  })
  const upper = new TransformStream<string, string>({
    transform(chunk, controller) {
      controller.enqueue(chunk.toUpperCase())
    },
  })
  // Response 생성자는 ReadableStream<Uint8Array>를 받아 .text()로 다시 모은다.
  return new Response(source.pipeThrough(upper).pipeThrough(new TextEncoderStream())).text()
}

export async function runEdgeChecks(request: Request): Promise<ProbeResponse> {
  const started = Date.now()
  const g = globalThis as EdgeGlobal

  // Network: 들어온 Request의 URL을 표준 URL/URLSearchParams로 파싱
  const url = new URL(request.url)
  const input = url.searchParams.get('input') ?? ''
  const rebuilt = new URLSearchParams({ input }).toString()

  const headers = new Headers({ 'x-demo': 'first' })
  headers.append('X-Demo', 'second')

  const echoed = await new Response(JSON.stringify({ input }), {
    headers: { 'content-type': 'application/json' },
  }).json()
  const posted = await new Request('https://edge.invalid/echo', { method: 'POST', body: input }).text()

  // Encoding
  const bytes = utf8Bytes(input)
  const decoded = new TextDecoder().decode(bytes)
  const base64 = base64FromUtf8(input)
  const roundTrip = utf8FromBase64(base64)

  // Crypto
  const hex = await sha256Hex(input)
  const uuid = crypto.randomUUID()

  // Streams
  const streamed = await upperCaseViaStreams(input)

  // Web Standard
  const original = { at: new Date(0), tags: new Map([['k', ['v']]]), nested: { n: 1 } }
  const cloned = structuredClone(original)
  cloned.nested.n = 2
  // instanceof 대신 Object.prototype.toString으로 태그를 본다 — 로컬 Edge 샌드박스(vm 컨텍스트)에서는
  // structuredClone 결과가 다른 realm의 Date/Map으로 만들어져 instanceof가 false가 될 수 있다(실측).
  const tagOf = (v: unknown) => Object.prototype.toString.call(v).slice(8, -1)
  const cloneOk =
    original.nested.n === 1 &&
    cloned.nested.n === 2 &&
    tagOf(cloned.at) === 'Date' &&
    cloned.at.getTime() === 0 &&
    tagOf(cloned.tags) === 'Map' &&
    cloned.tags !== original.tags &&
    cloned.tags.get('k')?.[0] === 'v'
  const abort = await abortAfter(30)

  const checks: ApiCheck[] = [
    check('URL / URLSearchParams', 'Network', "new URL(request.url).searchParams.get('input')", `pathname 끝=${url.pathname.split('/').pop()}, 입력 ${Array.from(input).length}자 수신`, url.pathname.endsWith('/probe') && new URLSearchParams(rebuilt).get('input') === input),
    check('Headers', 'Network', "h.append('X-Demo','second'); h.get('x-demo')", String(headers.get('x-demo')), headers.get('x-demo') === 'first, second'),
    check('Response', 'Network', 'await new Response(JSON.stringify({input})).json()', `input 왕복 ${echoed.input === input ? '일치' : '불일치'}`, echoed.input === input),
    check('Request', 'Network', "await new Request(url, { method: 'POST', body }).text()", `body 왕복 ${posted === input ? '일치' : '불일치'}`, posted === input),
    check('TextEncoder / TextDecoder', 'Encoding', 'new TextDecoder().decode(new TextEncoder().encode(input))', `${bytes.byteLength} bytes → 왕복 ${decoded === input ? '일치' : '불일치'}`, decoded === input),
    check('btoa / atob', 'Encoding', 'btoa(utf8 이진 문자열) → atob → TextDecoder', base64, roundTrip === input),
    check('crypto.subtle.digest', 'Crypto', "await crypto.subtle.digest('SHA-256', bytes)", hex, /^[0-9a-f]{64}$/.test(hex)),
    check('crypto.randomUUID', 'Crypto', 'crypto.randomUUID()', uuid, UUID_V4.test(uuid)),
    check('ReadableStream / TransformStream', 'Streams', 'stream.pipeThrough(upper).pipeThrough(new TextEncoderStream())', streamed, streamed === input.toUpperCase()),
    check('structuredClone', 'Web Standard', 'structuredClone({ Date, Map, nested })', `원본 n=${original.nested.n}, 복제 n=${cloned.nested.n}, at=${tagOf(cloned.at)}, tags=${tagOf(cloned.tags)}`, cloneOk),
    check('AbortController + setTimeout', 'Web Standard', 'setTimeout(() => controller.abort(), 30)', `aborted=${abort.aborted}, reason=${abort.reason}, ${abort.elapsed}ms 후`, abort.aborted && abort.reason === 'AbortError'),
  ]

  return {
    nextRuntime: process.env.NEXT_RUNTIME ?? null,
    edgeRuntimeGlobal: typeof g.EdgeRuntime,
    input,
    sha256Hex: hex,
    utf8ByteLength: bytes.byteLength,
    base64,
    checks,
    handlerMs: Date.now() - started,
    measuredAt: new Date().toISOString(),
  }
}
