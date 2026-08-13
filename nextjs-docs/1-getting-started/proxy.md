# Proxy

- 공식 문서: [Proxy](https://nextjs.org/docs/app/getting-started/proxy)
- 상위 메뉴: [Getting Started](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- Proxy가 요청 완료 전에 개입하는 위치와 적합한 사용 사례를 설명할 수 있다.
- `proxy.ts` 파일 규칙과 `matcher`로 실행 범위를 지정할 수 있다.
- 단순 redirect, 느린 데이터 조회, 인증 전체 구현에 Proxy를 오용하지 않을 수 있다.

## 핵심 개념 및 설명

### Proxy

> **알아두면 좋은 점**: Next.js 16부터 Middleware는 목적을 더 정확히 드러내기 위해 Proxy로 이름이 바뀌었다. 기능은 같다.

Proxy는 요청이 완료되기 전에 코드를 실행한다. 들어온 요청을 기준으로 응답을 rewrite하거나 redirect하고, 요청·응답 헤더를 바꾸거나 직접 응답할 수 있다.

#### 사용 사례

- 전체 또는 일부 페이지의 헤더 수정
- A/B 테스트나 실험에 따른 다른 페이지 rewrite
- 요청 속성에 따른 프로그래밍 방식 redirect

단순 redirect라면 먼저 `next.config.ts`의 [`redirects`](../3-api-reference/3.5-config/3.5.1-next-config-js/redirects.md)를 고려한다. 요청 데이터 접근이나 더 복잡한 로직이 필요할 때 Proxy를 사용한다.

Proxy는 느린 데이터 fetching을 위한 기능이 아니다. 권한에 따른 redirect 같은 낙관적 검사는 할 수 있지만, 완전한 세션 관리나 인가 해결책으로 사용해서는 안 된다. Proxy 안에서는 `fetch`의 `options.cache`, `options.next.revalidate`, `options.next.tags`가 아무 효과가 없다.

#### 파일 규칙

프로젝트 루트에 `proxy.ts` 또는 `proxy.js`를 만든다. `src`를 사용한다면 `src` 안에서 `app`이나 `pages`와 같은 레벨에 둔다.

> **참고**: 프로젝트당 `proxy.ts`는 하나만 지원한다. 라우트별 로직은 별도 `.ts` 또는 `.js` 모듈로 나눈 뒤 하나의 `proxy.ts`에서 import할 수 있다. 단일 진입점은 충돌과 중복 Proxy 계층을 피하면서 설정을 단순하게 한다.

#### 예제

Proxy 함수는 기본 export 또는 이름 있는 `proxy` export로 제공한다. `matcher`는 Proxy가 실행될 경로를 제한한다.

```ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 내부에서 await를 사용한다면 async 함수로 만들 수 있다
export function proxy(request: NextRequest) {
  return NextResponse.redirect(new URL('/home', request.url))
}

export const config = {
  matcher: '/about/:path*',
}
```

세부 경로 매칭은 [Proxy API 참조](../3-api-reference/3.1-file-conventions/proxy.md)를, 프런트엔드와 함께 쓰는 방식은 [Backend for Frontend](../2-guides/backend-for-frontend.md)를 참고한다.

## 예제 및 데모 설계

- 데모 가능 여부: 가능 (Phase 1에서는 설계만 작성)
- 데모 목적: `/about` 요청만 `/home`으로 redirect하고 다른 경로는 그대로 통과시킨다.
- 사용자가 확인할 화면과 상호작용: 두 URL에 직접 접속해 주소와 응답 헤더를 비교한다.
- 관찰할 결과: `matcher`에 포함된 요청만 응답이 바뀐다.

## 연습 문제

**Q1. (단일 선택) 정적인 URL redirect를 여러 개 선언할 때 우선 고려할 것은?**

1. `generateMetadata`
2. `next.config.ts`의 `redirects`
3. Route Handler의 `POST`
4. 느린 데이터 fetching을 수행하는 Proxy

<details><summary>정답 보기</summary>

**정답: 2** — 단순 redirect는 Proxy보다 `redirects` 설정을 먼저 고려한다.

</details>

**Q2. (복수 선택) Proxy에 적합한 작업을 모두 고르시오.**

- [ ] 요청 헤더에 따른 rewrite
- [ ] 모든 세션과 인가 로직의 완전한 구현
- [ ] A/B 테스트 분기
- [ ] 요청 속성에 따른 redirect

<details><summary>정답 보기</summary>

**정답: 1, 3, 4** — Proxy는 요청 기반의 빠른 분기에 적합하지만 완전한 세션·인가 해결책은 아니다.

</details>

## 요약

- Proxy는 요청 완료 전 응답·요청을 바꾸는 단일 진입점이다.
- Next.js 16에서 Middleware가 Proxy로 이름이 바뀌었고 기능은 유지된다.
- 단순 redirect에는 `redirects` 설정을 먼저 고려한다.
- Proxy는 느린 데이터 fetching이나 완전한 세션·인가 구현에 적합하지 않다.
- 프로젝트당 하나의 `proxy.ts`를 두고 `matcher`와 별도 모듈로 범위를 관리한다.
