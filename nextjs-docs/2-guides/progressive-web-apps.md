# PWAs

- 공식 문서: [PWAs](https://nextjs.org/docs/app/guides/progressive-web-apps)
- 상위 메뉴: [Guides](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- Next.js PWA의 manifest, 설치, Web Push 구성 요소를 설명한다.
- Service Worker와 Server Action을 연결해 push 구독 생명주기를 설계한다.
- VAPID 키, HTTPS, 브라우저 권한을 올바르게 구성하고 로컬에서 검증한다.
- Service Worker 전용 보안·캐시 헤더와 점진적 향상 원칙을 적용한다.

## 핵심 개념 및 설명

Progressive Web Application(PWA)은 웹의 접근성과 배포 방식에 네이티브 앱 같은 설치·알림 경험을 더한다. 하나의 코드베이스로 여러 플랫폼을 지원하고 앱 스토어 승인 없이 업데이트할 수 있다. 홈 화면 설치와 push 알림 같은 기능도 제공한다.

### Next.js로 PWA 만들기

#### 1. Web App Manifest 만들기

App Router는 정적 또는 다이나믹 [web app manifest](../3-api-reference/3.1-file-conventions/3.1.21-metadata/manifest.md)를 지원한다. `app/manifest.ts`나 `app/manifest.json`에 이름, 아이콘, 시작 URL, 표시 방식을 적는다.

```ts
import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Next.js PWA',
    short_name: 'NextPWA',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      { src: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  }
}
```

아이콘 세트는 `public/`에 둔다. 올바른 manifest는 사용자가 PWA를 홈 화면에 설치하는 데 필요한 정보를 제공한다.

#### 2. Web Push 알림 구현하기

Web Push는 홈 화면에 설치된 iOS 16.4 이상, macOS 13 이상의 Safari 16, Chromium 계열, Firefox에서 지원된다. 오프라인 지원 없이도 설치 prompt를 유도할 수 있다.

Client Component는 `serviceWorker`와 `PushManager` 지원 여부를 확인하고 Service Worker를 등록한다. 준비된 registration의 `pushManager.subscribe()`에 공개 VAPID 키를 전달해 구독을 만든다. 구독은 직렬화해 Server Action에 저장한다.

```tsx
'use client'

async function subscribeToPush() {
  const registration = await navigator.serviceWorker.ready
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
    ),
  })
  await subscribeUser(JSON.parse(JSON.stringify(subscription)))
}
```

지원하지 않는 브라우저에는 대체 안내를 표시한다. iOS에는 공유 메뉴의 “홈 화면에 추가” 절차를 안내하되 이미 standalone으로 실행 중이면 설치 안내를 숨긴다.

#### 3. Server Action 구현하기

`app/actions.ts`의 Server Action은 구독 생성·삭제와 알림 발송을 담당한다. `web-push`에 공개 키와 비공개 키를 설정한다.

```ts
'use server'

import webpush from 'web-push'

webpush.setVapidDetails(
  '<mailto:your-email@example.com>',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)
```

공식 예제는 이해를 돕기 위해 구독 하나를 메모리에 보관한다. 운영 환경에서는 서버 재시작과 여러 사용자에 대응하도록 데이터베이스에 구독을 영속화한다.

#### 4. VAPID 키 생성하기

Web Push API에는 VAPID 키 쌍이 필요하다.

```bash
pnpm add -g web-push
web-push generate-vapid-keys
```

공개 키는 `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, 비공개 키는 `VAPID_PRIVATE_KEY`로 설정한다. 비공개 키에는 `NEXT_PUBLIC_`을 붙이지 않는다.

#### 5. Service Worker 만들기

`lib/service-worker.js`는 `push` 이벤트 payload를 알림으로 표시하고 `notificationclick`에서 알림을 닫은 뒤 지정한 URL을 연다.

```js
self.addEventListener('push', function (event) {
  if (!event.data) return
  const data = event.data.json()
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon || '/icon.png',
      badge: '/badge.png',
      vibrate: [100, 50, 100],
    })
  )
})

self.addEventListener('notificationclick', function (event) {
  event.notification.close()
  event.waitUntil(clients.openWindow('https://your-website.com'))
})
```

알림 아이콘·badge·진동·추가 데이터는 기기와 브라우저별로 충분히 시험한다. callback URL도 실제 앱 주소로 바꾼다.

#### 6. 홈 화면에 추가하기

설치 가능하려면 유효한 manifest와 HTTPS가 필요하다. 조건을 만족하면 최신 브라우저가 사용자에게 설치 prompt를 자동으로 표시한다. `beforeinstallprompt`로 사용자 정의 버튼을 만들 수 있지만 Safari iOS를 포함한 모든 브라우저·플랫폼에서 동작하지 않으므로 공식 문서는 권장하지 않는다.

#### 7. 로컬에서 테스트하기

로컬 알림은 [HTTPS 개발 서버](../3-api-reference/3.6-cli/next.md)에서 시험한다.

```bash
next dev --experimental-https
```

브라우저 알림 권한을 허용하고, 브라우저 전체 설정에서 알림이 꺼지지 않았는지 확인한다. 문제가 계속되면 다른 브라우저에서도 재현한다.

#### 8. 애플리케이션 보호하기

전역 응답에는 MIME sniffing, clickjacking, referrer 노출을 줄이는 헤더를 둘 수 있다. Service Worker에는 올바른 JavaScript 콘텐츠 유형과 캐시 방지, 같은 origin 스크립트만 허용하는 CSP를 설정한다.

```js
module.exports = {
  async headers() {
    return [{
      source: '/sw.js',
      headers: [
        { key: 'Content-Type', value: 'application/javascript; charset=utf-8' },
        { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
        { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self'" },
      ],
    }]
  },
}
```

전역에서는 `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`을 사용할 수 있다. CSP 구성은 [Content Security Policy](./content-security-policy.md)를 참고한다.

### PWA 확장하기

1. **PWA 기능 탐색**: Background Sync, Periodic Background Sync, File System Access API 같은 Web API를 검토한다.
2. **[정적 export](./static-exports.md)**: 서버 없이 배포하면 Server Action을 외부 API 호출로 옮기고 헤더 설정도 배포 proxy로 옮긴다.
3. **오프라인 지원**: 실험적인 [`useOffline`](../3-api-reference/3.3-functions/use-offline.md)과 [`experimental.useOffline`](../3-api-reference/3.5-config/3.5.1-next-config-js/useOffline.md)은 연결 상태 UI와 실패한 내비게이션·Server Action 재시도를 제공한다. 전체 Service Worker 캐싱에는 Serwist 같은 통합 도구를 고려한다.
4. **보안**: HTTPS를 사용하고 push 메시지 출처를 검증하며 오류를 안전하게 처리한다.
5. **사용자 경험**: 기능을 지원하지 않는 브라우저에서도 핵심 흐름이 동작하도록 점진적 향상을 적용한다.

#### manifest.json

manifest 파일 규칙은 [manifest.json API Reference](../3-api-reference/3.1-file-conventions/3.1.21-metadata/manifest.md)를 참고한다.

## 예제 및 데모 설계

- Phase 2에서 manifest와 아이콘을 제공하고 데스크톱·모바일의 설치 가능 상태를 확인한다.
- push 구독·해지·테스트 알림 UI와 데이터베이스 기반 구독 저장 흐름을 만든다.
- Service Worker 갱신 시 `Cache-Control` 헤더가 오래된 worker를 남기지 않는지 검증한다.
- 지원하지 않는 브라우저, 권한 거부, 잘못된 VAPID 키에서 대체 UI와 오류 처리를 확인한다.

## 연습 문제

1. PWA 설치 가능성의 기본 조건 두 가지는 무엇인가?

   - A. 유효한 manifest와 HTTPS
   - B. Server Action과 데이터베이스
   - C. 정적 export와 WebSocket

   <details><summary>정답 보기</summary>

   정답: A. 홈 화면 설치에는 앱 정보를 담은 manifest와 보안 연결이 필요하다.

   </details>

2. VAPID 비공개 키의 환경 변수 이름으로 적절한 것은 무엇인가?

   - A. `NEXT_PUBLIC_VAPID_PRIVATE_KEY`
   - B. `VAPID_PRIVATE_KEY`
   - C. `PUBLIC_KEY`

   <details><summary>정답 보기</summary>

   정답: B. 비공개 키는 브라우저 번들에 노출되는 `NEXT_PUBLIC_` 접두사를 사용하면 안 된다.

   </details>

3. Service Worker 응답에 캐시 방지 헤더를 두는 이유는 무엇인가?

   - A. 사용자가 최신 worker를 받게 한다.
   - B. 알림 권한을 자동 승인한다.
   - C. manifest를 자동 생성한다.

   <details><summary>정답 보기</summary>

   정답: A. 오래된 Service Worker가 캐시에 남아 새 동작의 적용을 막지 않게 한다.

   </details>

## 챕터 요약

- Next.js PWA는 manifest, 설치 경험, Service Worker, Web Push를 조합한다.
- push 구독은 브라우저에서 만들고 운영 환경에서는 서버 데이터베이스에 영속화한다.
- VAPID 비공개 키는 서버에만 두고 설치와 알림은 HTTPS에서 시험한다.
- Service Worker의 콘텐츠 유형, 캐시, CSP 헤더를 명시적으로 관리한다.
- 브라우저별 지원 차이를 고려해 점진적 향상과 대체 UI를 제공한다.
