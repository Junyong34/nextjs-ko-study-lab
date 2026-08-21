# Data Security

- 공식 문서: [Data Security](https://nextjs.org/docs/app/guides/data-security)
- 상위 메뉴: [Guides](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- 프로젝트 성격에 맞는 데이터 fetching 접근 방식을 선택한다.
- Server Component에서 Client Component로 전달할 데이터를 최소화한다.
- Server Action을 공개 POST 진입점으로 보고 입력·인증·인가를 검증한다.
- DAL, `server-only`, React Taint API가 제공하는 방어층과 한계를 설명한다.

## 핵심 개념 및 설명

React Server Components는 데이터 fetching을 단순화하지만, 프런트엔드 앱에서 데이터가 접근되는 위치와 방식도 바꾼다. Server Component가 서버에서 실행된다는 사실만으로 모든 데이터 흐름이 안전해지는 것은 아니다. 서버 전용 코드의 경계를 만들고, 렌더링 컨텍스트와 클라이언트로 나가는 값을 최소화해야 한다.

### 데이터 fetching 접근 방식

Next.js는 프로젝트의 규모와 연혁에 따라 세 가지 접근을 권장한다.

- **외부 HTTP API**: 기존 보안 체계와 별도 백엔드 팀이 있는 대규모 애플리케이션에 적합하다.
- **Data Access Layer(DAL)**: 새 프로젝트에 권장한다.
- **컴포넌트 수준 데이터 접근**: 프로토타입과 학습에 적합하다.

한 프로젝트에서는 한 접근을 선택하고 섞지 않는 것을 권장한다. 개발자와 보안 감사자가 데이터 접근 규칙을 예측하기 쉬워진다.

#### 외부 HTTP API

기존 프로젝트에 Server Component를 도입할 때는 Zero Trust 모델을 따른다. Client Component에서 하던 것처럼 REST나 GraphQL API를 `fetch`로 호출하되, 기존 API의 인증·인가 검사를 그대로 유지한다.

```tsx filename="app/page.tsx"
import { cookies } from 'next/headers'

export default async function Page() {
  const token = (await cookies()).get('AUTH_TOKEN')?.value
  const response = await fetch('https://api.example.com/profile', {
    headers: { Cookie: `AUTH_TOKEN=${token}` },
  })
  const profile = await response.json()
  return <p>{profile.name}</p>
}
```

#### Data Access Layer

DAL은 데이터에 언제 어떻게 접근하고 렌더링 컨텍스트로 무엇을 전달할지 제어하는 서버 전용 라이브러리다. 인가를 수행하고 안전한 최소 Data Transfer Object(DTO)를 반환한다. 데이터 접근을 중앙화하면 인가 누락을 줄이고 한 요청 안에서 메모리 캐시를 공유할 수 있다.

```ts filename="data/auth.ts"
import 'server-only'
import { cache } from 'react'
import { cookies } from 'next/headers'

export const getCurrentUser = cache(async () => {
  const token = (await cookies()).get('AUTH_TOKEN')
  const session = await decryptAndValidate(token)
  return { id: session.userId, role: session.role }
})

export async function getProfileDTO(slug: string) {
  const viewer = await getCurrentUser()
  const user = await db.user.findUnique({ where: { slug } })

  return {
    username: user.username,
    phoneNumber: viewer.role === 'admin' ? user.phoneNumber : null,
  }
}
```

> **알아두면 좋은 점**: 비밀 키는 환경 변수에 저장하되 `process.env` 접근도 DAL에 한정한다. 그러면 앱의 다른 영역에 비밀이 퍼지는 것을 줄일 수 있다.

#### 컴포넌트 수준 데이터 접근

Server Component에서 직접 데이터베이스를 조회하는 방식은 빠른 프로토타입에 편리하다. 하지만 전체 레코드를 Client Component prop으로 넘기기 쉬워 비공개 필드가 노출될 위험이 커진다. 클라이언트에는 렌더링에 필요한 좁은 타입과 정제된 객체만 전달한다.

```tsx filename="data/user-dto.tsx"
// 전체 User 레코드 대신 공개 필드만 반환한다.
async function getPublicUser(slug: string) {
  const user = await db.user.findUnique({ where: { slug } })
  return { name: user.name }
}

export default async function Page({ params }: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <Profile user={await getPublicUser(slug)} />
}
```

### 데이터 읽기

#### 서버에서 클라이언트로 데이터 전달하기

최초 로드에서는 Server Component와 Client Component가 모두 서버에서 HTML 생성에 참여하지만 서로 분리된 모듈 시스템에서 실행된다.

- Server Component는 서버에서만 실행되며 환경 변수, 비밀, 데이터베이스, 내부 API에 접근할 수 있다.
- Client Component는 prerendering 때 서버에서도 실행되지만 브라우저 코드와 같은 보안 가정을 따라야 한다. 특권 데이터와 서버 전용 모듈에 접근해서는 안 된다.

기본 경계가 있어도 prop이나 반환값으로 비공개 데이터를 전달하면 노출될 수 있다.

#### React Taint API

React의 `experimental_taintObjectReference`는 객체를, `experimental_taintUniqueValue`는 특정 값을 클라이언트로 전달하지 못하게 표시한다. Next.js에서는 `experimental.taint` 옵션을 켠다.

```js filename="next.config.js"
module.exports = {
  experimental: {
    taint: true,
  },
}
```

Taint API는 추가 방어층이다. DAL에서 데이터를 필터링하고 정제하는 작업을 대체하지 않는다.

> **알아두면 좋은 점**: 환경 변수는 기본적으로 서버에서만 사용할 수 있지만 `NEXT_PUBLIC_` 접두사가 붙으면 클라이언트 번들에 노출된다. 함수와 클래스는 기본적으로 Client Component에 전달할 수 없다.

#### 서버 전용 코드의 클라이언트 실행 막기

서버 전용 모듈에는 `import 'server-only'`를 추가한다. Client Component가 이 모듈을 import하면 빌드 오류가 발생하므로 내부 비즈니스 로직과 비밀 접근이 서버에 남는다. Next.js는 `server-only` import를 내부적으로 처리한다. 린터가 외부 의존성 누락으로 판단하는 경우에는 패키지를 설치할 수 있다.

### 데이터 변경

#### Server Action의 기본 보안 기능

export한 Server Action은 UI에서 import하지 않았더라도 직접 POST 요청으로 접근할 수 있다. Next.js는 두 기능으로 노출 위험을 줄인다.

- **보안 Action ID**: 클라이언트가 Action을 참조하도록 암호화된 비결정적 ID를 만들고 빌드 사이에 주기적으로 다시 계산한다.
- **dead code elimination**: 사용되지 않는 Server Action을 클라이언트 번들에서 제거한다.

Action ID는 컴파일 때 만들어져 최대 14일 캐시되고, 새 빌드나 빌드 캐시 무효화 때 다시 생성된다. 이 기능은 인증 누락 위험을 줄일 뿐이다. 모든 Action을 직접 호출 가능한 것으로 보고 내부에서 인증·인가해야 한다.

> **알아두면 좋은 점**: Action ID가 숨겨져 있고 주기적으로 바뀌어도 접근 제어 수단은 아니다.

#### 클라이언트 입력 검증

클라이언트의 폼 데이터, URL params, 헤더, `searchParams`는 수정될 수 있으므로 신뢰하지 않는다. 서버에서 값을 다시 검증하고, 쿠키나 데이터베이스처럼 신뢰할 수 있는 원본에서 권한 정보를 읽는다.

#### Authentication과 Authorization

페이지 수준 인증 검사는 그 안의 Server Action으로 이어지지 않는다. Action에서 사용자를 다시 인증하고, 해당 리소스의 소유자인지도 확인해야 IDOR 취약점을 막을 수 있다.

```ts filename="app/actions.ts"
'use server'

import { auth } from '@/lib/auth'

export async function deletePost(postId: string) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  const post = await db.post.findUnique({ where: { id: postId } })
  if (!post || post.authorId !== session.user.id) {
    throw new Error('Forbidden')
  }

  await db.post.delete({ where: { id: postId } })
}
```

#### mutation에 DAL 사용하기

변경 로직도 `server-only` DAL에 두고 `"use server"` Action은 위임만 하게 만들 수 있다.

> **알아두면 좋은 점**: DAL과 `"use server"` 파일 모두 `server-only`를 사용할 수 있다. Action을 Client Component에서 `useActionState` 등에 전달해도 `"use server"` 모듈은 서버 전용 webpack 계층에서 해석된다.

#### 반환값 제어하기

Server Action 반환값은 직렬화되어 클라이언트로 전달된다. 전체 데이터베이스 레코드 대신 `{ success: true }`처럼 UI에 필요한 값만 반환한다.

#### rate limiting

이메일 전송이나 데이터베이스 쓰기처럼 비용이 큰 동작에는 [rate limiting](./backend-for-frontend.md)을 검토한다.

#### 클로저와 암호화

컴포넌트 안에 정의한 Server Action은 렌더링 시점의 외부 변수를 캡처할 수 있다. 호출 때 이 값을 클라이언트로 보냈다가 서버로 돌려보내야 하므로 Next.js는 캡처 값을 자동 암호화한다. 빌드마다 새 개인 키가 만들어져 Action은 특정 빌드에서만 호출할 수 있다.

> **알아두면 좋은 점**: 암호화만으로 민감한 값의 클라이언트 노출을 막으려 하지는 않는다.

#### 암호화 키 덮어쓰기(고급)

여러 서버에 self-hosting할 때는 `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY`로 빌드 사이의 키를 맞출 수 있다. 값은 base64로 인코딩해야 하고 디코딩 길이는 AES 키 크기인 16, 24, 32바이트 중 하나여야 한다. Next.js 기본 키는 32바이트다. 키 교체와 서명 같은 일반 보안 관행도 적용한다.

```bash
openssl rand -base64 32
```

#### 허용 origin과 CSRF

Server Action은 `POST`만 허용하고 `Origin`과 `Host` 또는 `X-Forwarded-Host` 헤더를 비교한다. 값이 다르면 요청을 중단한다. reverse proxy 때문에 공개 도메인과 서버 API 도메인이 다르면 [`serverActions.allowedOrigins`](../3-api-reference/3.5-config/3.5.1-next-config-js/serverActions.md)에 안전한 origin 목록을 지정하는 것을 권장한다.

```js filename="next.config.js"
module.exports = {
  experimental: {
    serverActions: {
      allowedOrigins: ['my-proxy.com', '*.my-proxy.com'],
    },
  },
}
```

#### 렌더링 중 부수 효과 피하기

렌더링 중 로그아웃, 데이터베이스 갱신, 캐시 무효화를 부수 효과로 실행해서는 안 된다. Next.js는 렌더링 메서드에서 쿠키 설정과 캐시 revalidation을 막는다. 변경은 Server Action으로 처리한다.

> **알아두면 좋은 점**: Next.js는 mutation에 `POST` 요청을 사용한다. 따라서 `GET` 요청에서 우발적인 부수 효과가 발생하는 일을 막고 CSRF 위험을 줄인다.

### 보안 감사 체크리스트

- DAL 밖에서 데이터베이스 패키지와 환경 변수를 import하지 않는지 확인한다.
- `"use client"` 파일의 prop 타입이 비공개 데이터나 지나치게 넓은 객체를 받지 않는지 확인한다.
- `"use server"` 파일에서 입력, 인증, 역할, 리소스 소유권을 확인하고 반환값을 최소화하는지 살핀다.
- `/<param>/` 형태의 경로는 사용자 입력이므로 params를 검증한다.
- `proxy.ts`와 `route.ts`는 권한이 크므로 전통적인 감사 기법, 침투 테스트, 취약점 스캔을 개발 수명 주기에 맞춰 수행한다.

### 다음 단계

[Authentication](./authentication.md), [Content Security Policy](./content-security-policy.md), [Forms](./forms.md), [Server Actions](./server-actions.md)를 이어서 학습한다.

## 예제 및 데모 설계

- 데모 가능 여부: 가능 (Phase 2에서 구현 예정)
- 데모 목적: 서버 데이터가 DAL과 DTO를 거쳐 클라이언트로 전달되고 Server Action에서 다시 검증되는 과정을 보여준다.
- 사용자가 확인할 화면과 상호작용:
  - 전체 사용자 레코드와 최소 DTO가 RSC Payload에 남기는 차이를 비교한다.
  - 다른 사용자의 게시물 ID로 삭제를 요청했을 때 소유권 검사가 `Forbidden`으로 막는지 확인한다.
  - `server-only` 모듈을 Client Component에서 import했을 때 빌드 오류를 확인한다.

## 연습 문제

1. 새 프로젝트에 권장되는 데이터 접근 방식은 무엇인가?

   - A. 모든 Client Component에서 직접 데이터베이스 조회
   - B. Data Access Layer
   - C. 세 접근 방식의 무작위 혼합

   <details><summary>정답 보기</summary>

   정답: B. DAL은 데이터 접근과 인가, 최소 DTO 반환을 중앙화한다.

   </details>

2. React Taint API에 관한 설명으로 맞는 것은 무엇인가?

   - A. DAL의 필터링을 완전히 대체한다.
   - B. 객체나 값의 클라이언트 전달을 막는 추가 방어층이다.
   - C. 모든 `NEXT_PUBLIC_` 값을 비밀로 만든다.

   <details><summary>정답 보기</summary>

   정답: B. Taint API를 사용해도 DAL에서 데이터 최소화와 정제를 계속해야 한다.

   </details>

3. Server Action에서 반드시 다시 확인해야 하는 것을 모두 고르시오.

   - A. 클라이언트 입력
   - B. 사용자 인증과 역할
   - C. 대상 리소스 소유권

   <details><summary>정답 보기</summary>

   정답: A, B, C. Server Action은 독립된 공개 POST 진입점으로 취급한다.

   </details>

## 챕터 요약

- 프로젝트 전체에서 예측 가능한 한 가지 데이터 접근 방식을 선택한다.
- DAL은 서버에서 인가하고 클라이언트에는 최소 DTO만 반환한다.
- `server-only`와 Taint API는 데이터 최소화를 보완하는 방어층이다.
- Server Action은 입력·인증·인가·소유권을 내부에서 다시 검증한다.
- 반환값, 환경 변수, 클로저, origin, 렌더링 부수 효과까지 감사 범위에 포함한다.
