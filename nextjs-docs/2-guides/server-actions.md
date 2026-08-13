# Server Actions

- 공식 문서: [Server Actions](https://nextjs.org/docs/app/guides/server-actions)
- 상위 메뉴: [Guides](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- Server Action의 호출 방식과 클라이언트 순차 디스패치를 설명할 수 있다.
- 하나의 응답에 Action 반환값과 새 RSC Payload가 함께 오는 조건을 구분할 수 있다.
- Server Action을 신뢰할 수 없는 POST 진입점으로 취급하고 방어할 수 있다.
- mutation 이후 `updateTag`, `revalidateTag`, `revalidatePath`, `refresh`를 선택할 수 있다.

## 핵심 개념 및 설명

### Server Actions와 mutation

Server Action은 `<form action>`, `<button formAction>`, 클라이언트 전환 같은 React action 메커니즘을 통해 호출되는 React Server Function이다. 함수 또는 모듈에 `'use server'`를 추가하고 폼, 이벤트 핸들러, `startTransition`으로 감싼 `useEffect`에서 호출한다. 기본 작성법은 [데이터 변경](../1-getting-started/mutating-data.md)과 [Forms](./forms.md)를 참고한다.

### 클라이언트의 순차 디스패치

Next.js는 클라이언트 하나당 Server Action을 한 번에 하나씩 디스패치한다. 세 Action을 빠르게 호출하면 두 번째는 첫 번째가 끝날 때까지, 세 번째는 두 번째가 끝날 때까지 기다린다. 이는 Action 결과와 다시 렌더링된 서버 트리를 일관되게 유지한다.

클라이언트에서 `Promise.all`로 Server Action을 병렬화할 수 있다고 가정하면 안 된다. 병렬 작업은 하나의 Action 내부에서 수행하거나 Server Component에서 병렬 fetch하고, mutation이 아닌 요청은 [Route Handler](./backend-for-frontend.md)를 고려한다.

> **알아두면 좋은 점**: 순차성은 클라이언트 디스패처의 속성이다. 서버에서 실행되는 Server Function 자체는 일반 async 함수처럼 병렬 작업을 할 수 있다.

### 데이터와 UI를 함께 운반하는 단일 응답

Server Action이 즉시 캐시를 무효화하면 한 HTTP 요청 안에서 Action 실행과 현재 라우트의 서버 렌더링이 이어진다. 같은 Flight 스트림에는 Action 반환값과 새 RSC Payload가 함께 담긴다.

다음 호출은 같은 응답에 다시 렌더링된 UI를 포함한다.

- `updateTag` 또는 `revalidatePath`: 캐시된 데이터를 즉시 무효화한다.
- `refresh`: 현재 라우트의 RSC Payload를 다시 가져온다.
- `cookies()`로 쿠키 설정·삭제: 새 값을 반영하도록 현재 페이지를 다시 렌더링한다.
- `redirect`: 목적지로 이동하며 그곳의 RSC Payload를 스트리밍한다.

```tsx
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPost(formData: FormData) {
  await db.post.create({ data: { title: String(formData.get('title')) } })
  revalidatePath('/posts')
  redirect('/posts')
}
```

`redirect`는 제어 흐름 예외를 던지므로 이후 코드는 실행되지 않는다. 목적지에 최신 데이터가 필요하면 revalidation을 먼저 호출한다. 반면 `revalidateTag(tag, 'max')`는 stale-while-revalidate 방식으로 백그라운드 갱신하므로 Action 응답에 즉시 다시 렌더링한 UI를 포함하지 않는다. 위 동작을 하나도 하지 않으면 현재 라우트는 다시 렌더링되지 않고 반환값만 전달된다.

### 보안

Server Action은 자신을 호출한 페이지에 대한 POST 요청으로 실행된다. 컴파일러는 구현 대신 Action ID와 디스패처 참조를 클라이언트 번들에 넣지만, 같은 POST를 보낼 수 있는 누구에게나 진입점은 도달 가능하다. 모든 Action을 신뢰할 수 없는 공개 API처럼 다룬다.

Next.js는 다음 프레임워크 보호를 제공한다.

- **CSRF 검사**: `Origin`과 `Host` 또는 `X-Forwarded-Host`를 비교한다. 프록시 도메인은 `serverActions.allowedOrigins`에 설정한다.
- **본문 크기 제한**: 기본 1MB이며 `serverActions.bodySizeLimit`으로 바꾼다.
- **암호화된 Action ID와 dead code elimination**: 사용하지 않는 Server Function은 클라이언트 번들에서 제거된다.
- **클로저 변수 암호화**: 클라이언트로 전달되는 클로저 값은 암호화되지만 비밀을 캡처하는 설계를 대신할 수 없다.

각 Action에서 인증, 인가, 입력 검증, 속도 제한을 수행한다. 스키마 검증은 입력 모양만 확인하며 행의 소유권은 증명하지 않는다. 클라이언트에서는 대상 ID와 변경 내용만 받고, 세션을 기준으로 신뢰할 수 있는 저장소에서 소유권을 다시 조회한다.

```tsx
'use server'

export async function completeItem(itemId: string) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')
  const item = await db.item.findFirst({
    where: { id: itemId, ownerId: session.user.id },
  })
  if (!item) throw new Error('Forbidden')
  await db.item.update({ where: { id: item.id }, data: { completed: true } })
}
```

실험적인 `authInterrupts`를 활성화했다면 `unauthorized()`와 `forbidden()`으로 대응 파일의 UI를 렌더링할 수 있다.

### 캐시 업데이트 선택

| API | 사용할 때 | 다음 서버 읽기 |
| --- | --- | --- |
| `updateTag(tag)` | Server Action의 쓰기를 사용자에게 즉시 보여야 할 때 | 새 데이터를 기다림 |
| `revalidateTag(tag, 'max')` | 오래된 값이 잠시 허용되고 백그라운드 갱신이 적합할 때 | 오래된 값을 제공하며 갱신 |
| `revalidatePath(path)` | 특정 URL 경로만 영향받을 때 | 해당 경로를 무효화 |
| `refresh()` | 캐시를 무효화하지 않고 현재 RSC Payload만 다시 읽을 때 | 현재 라우트를 다시 fetch |

`updateTag`, `revalidatePath`, `refresh`는 예외를 던지지 않아 호출 뒤 값을 반환할 수 있다. 기반 모델은 [How revalidation works](./how-revalidation-works.md)를 참고한다.

### 설정

`next.config.js`의 `serverActions`로 허용 origin과 본문 크기를 설정한다.

```js
module.exports = {
  experimental: {
    serverActions: {
      allowedOrigins: ['my-proxy.com', '*.my-proxy.com'],
      bodySizeLimit: '2mb',
    },
  },
}
```

여러 배포 인스턴스에서 클로저 암호화 키를 공유하려면 `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY`를 배포 환경에 설정한다.

### 배포 고려사항

각 Server Action은 빌드 산출물의 Action ID로 식별된다. 새 배포는 보통 새 ID를 만들고, 소스가 같아도 Next.js는 최대 14일마다 ID를 교체한다. 이전 빌드를 실행 중인 클라이언트가 사라진 ID를 호출하면 `Failed to find Server Action` 오류가 난다.

- 사용자가 mutation 도중일 수 있으면 급격한 전환보다 롤링 배포를 선호한다.
- 모든 인스턴스에서 `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY`를 안정적으로 유지한다.
- 오류를 강제 종료가 아닌 새로고침·재시도 경로로 표시한다.

### 다음 단계

- 작성과 호출: [데이터 변경](../1-getting-started/mutating-data.md), [Forms](./forms.md)
- 보안: [Data Security](./data-security.md), [`use server`](../3-api-reference/3.4-directives/use-server.md)
- 갱신과 이동: [`revalidatePath`](../3-api-reference/3.3-functions/revalidatePath.md), [`revalidateTag`](../3-api-reference/3.3-functions/revalidateTag.md), [`redirect`](../3-api-reference/3.3-functions/redirect.md), [`refresh`](../3-api-reference/3.3-functions/refresh.md)

## 예제 및 데모 설계

- Phase 2에서 게시물 생성 Action과 목록 UI를 만든다.
- 연속 세 번 제출했을 때 서버 로그로 순차 디스패치를 확인한다.
- `updateTag`와 `revalidateTag('max')`를 전환해 같은 왕복에서 UI가 갱신되는지 비교한다.
- 권한 없는 ID로 POST를 보내 서버의 소유권 검사가 차단하는지 확인한다.

## 연습 문제

1. 클라이언트가 여러 Server Action을 빠르게 호출하면 어떻게 되는가?

   - A. 항상 병렬 실행된다.
   - B. 클라이언트별로 순차 디스패치된다.
   - C. 마지막 Action만 실행된다.

   <details><summary>정답 보기</summary>

   정답: B. 앞 Action이 끝나야 다음 Action이 디스패치된다.

   </details>

2. 쓰기 결과를 같은 Action 응답의 UI에 즉시 반영할 때 적합한 것은 무엇인가?

   - A. `updateTag`
   - B. `revalidateTag(tag, 'max')`
   - C. 아무 호출도 하지 않음

   <details><summary>정답 보기</summary>

   정답: A. `updateTag`는 다음 읽기가 새 데이터를 기다리게 한다.

   </details>

3. Server Action 입력 검증으로 충분하지 않은 것은 무엇인가?

   - A. 스키마 모양 검사만 하고 소유권 확인을 생략한다.
   - B. 세션에서 사용자 ID를 얻는다.
   - C. 서버 저장소에서 대상 소유권을 다시 조회한다.

   <details><summary>정답 보기</summary>

   정답: A. 유효한 모양의 입력도 다른 사용자의 행을 가리킬 수 있다.

   </details>

## 챕터 요약

- Server Action은 React action 메커니즘으로 호출되는 서버의 POST 진입점이다.
- 클라이언트는 Action을 순차 디스패치하지만 Action 내부 서버 작업은 병렬화할 수 있다.
- 즉시 무효화·새로고침·쿠키 변경·redirect는 반환값과 새 UI를 같은 응답에 실을 수 있다.
- 모든 Action에서 인증·인가·입력·소유권을 검증해야 한다.
- 배포가 바뀌어도 Action ID와 암호화 키가 어떻게 이어지는지 고려해야 한다.
