import { SEGMENT_PATH } from '../constants'

// public/ 없이 서비스 워커를 서빙한다 — 데모 앱은 public/ 파일이 셸 rewrites에 걸리지 않기 때문이다.
// 이 문자열이 그대로 브라우저가 내려받아 실행하는 sw.js 본문이다.
const SW_SOURCE = `
// 즉시 활성화하고 열려 있는 페이지를 바로 제어한다(clients.claim이 없으면 새로고침 전까지 controller가 null).
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()))

// 요청을 가로채지 않고 네트워크로 그대로 통과시킨다. 일부 브라우저의 설치 가능성 판단이
// fetch 핸들러 유무를 보는 경우가 있어 둔다(브라우저·버전별로 다르며 이 데모가 보장하지 않는다).
self.addEventListener('fetch', () => {})

// 페이지가 보낸 'ping'에 이 서비스 워커가 실제로 받은 scope로 답한다.
self.addEventListener('message', (event) => {
  if (event.data === 'ping') {
    event.source.postMessage({ type: 'pong', scope: self.registration.scope })
  }
})
`

export async function GET() {
  return new Response(SW_SOURCE, {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      // 오래된 sw.js가 캐시에 남아 갱신을 막지 않도록 한다(공식 문서의 서비스 워커 보안·캐시 헤더 권장).
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      // 기본 허용 scope는 스크립트가 놓인 디렉터리(`${SEGMENT_PATH}/`)다. 이 페이지는 슬래시 없는
      // `${SEGMENT_PATH}`로 열리므로 그대로면 페이지가 scope 밖이 된다. 이 헤더로 허용 범위를
      // 페이지 경로 하나로만 넓힌다 — 그보다 위(부모 경로)로는 여전히 등록할 수 없다.
      'Service-Worker-Allowed': SEGMENT_PATH,
    },
  })
}
