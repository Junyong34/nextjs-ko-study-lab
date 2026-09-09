# typedRoutes

- 공식 문서: [typedRoutes](https://nextjs.org/docs/app/api-reference/config/next-config-js/typedRoutes)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- `typedRoutes` 옵션의 정적 타입 라우팅(Statically Typed Links) 원리와 설정 방법을 이해한다.
- Next.js가 `.next/types/link.d.ts`에 라우트 타입을 자동 생성(typegen)하는 과정을 파악한다.
- `<Link>` 컴포넌트와 `useRouter().push()`에서 오타 방지와 자동 완성, 다이나믹 라우트 검증 기법을 설명할 수 있다.

## 핵심 개념 및 설명

`typedRoutes`는 애플리케이션의 실제 라우트 파일 구조를 스캔하여 정적 TypeScript 타입을 자동 생성하는 옵션이다. 이 기능을 활성화하면 `<Link>` 컴포넌트와 `useRouter().push()` 등 내비게이션 API에 전달하는 경로 문자열의 유효성을 컴파일 시점에 검증할 수 있다.

과거 실험적 옵션(`experimental.typedRoutes`)으로 제공되던 기능이 정식 안정화(stable)되어, 별도의 외부 플러그인 없이도 오타 때문에 잘못된 링크로 이동하는 일을 미리 방지할 수 있다.

### 기본 설정 구조

`next.config.ts`, `next.config.mjs`, 또는 `next.config.js` 파일의 최상위 설정 객체에서 불리언(boolean) 값으로 활성화한다:

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  typedRoutes: true,
}

export default nextConfig
```

```js filename="next.config.mjs" switcher
/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: true,
}

export default nextConfig
```

### 옵션 명세

| 속성명 | 타입 | 기본값 | 필수 여부 | 설명 |
|---|---|---|---|---|
| `typedRoutes` | `boolean` | `false` | 선택 | 정적으로 타이핑된 라우트(Statically Typed Links) 기능 활성화 여부. |

### 동작 원리 및 타입 생성 (Typegen)

`typedRoutes: true`를 설정한 후 `next dev`, `next build`, 또는 `next typegen` 명령을 실행하면 Next.js가 자동으로 라우트 구조를 분석한다:

1. **파일 시스템 라우트 스캔**: App Router(`app/**/page.tsx`)와 Pages Router(`pages/**/*.tsx`) 내의 모든 페이지 엔트리를 탐색한다.
2. **선언 파일 생성**: 탐색한 경로를 유니온 타입(`Route<T>`, `RouteImpl<T>`)으로 묶어 `.next/types/link.d.ts` 파일에 생성한다.
3. **컴파일러 타입 검증**: 프로젝트의 `tsconfig.json`이 `.next/types/**/*.ts`를 참조하므로 편집기(IDE) 내 자동 완성과 `tsc` 빌드 검증에 반영된다.

### 정적 라우트 및 다이나믹 라우트 검증

#### 정적 라우트 검증

존재하는 경로를 입력하면 IDE에서 경로 목록이 자동 완성된다. 존재하지 않는 경로를 입력하면 TypeScript 컴파일 오류가 발생한다:

```tsx filename="app/components/navigation.tsx"
'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

export function Navigation() {
  const router = useRouter()

  return (
    <nav>
      {/* ⭕ 올바른 라우트: 정상 컴파일 및 자동 완성 제공 */}
      <Link href="/dashboard">대시보드</Link>

      {/* ❌ 존재하지 않는 라우트: TypeScript 컴파일 에러 발생 */}
      <Link href="/dashbord">오타 경로</Link>

      <button onClick={() => router.push('/settings')}>설정 페이지로 이동</button>
    </nav>
  )
}
```

#### 다이나믹 라우트 및 외부 URL 처리

다이나믹 세그먼트를 포함하는 다이나믹 라우트(예: `/blog/[slug]`)라면 템플릿 리터럴 문자열을 작성하거나 명시적인 URL 객체 형태로 전달할 수 있다:

```tsx filename="app/components/post-link.tsx"
import Link from 'next/link'
import type { Route } from 'next'

interface PostLinkProps {
  slug: string
}

export function PostLink({ slug }: PostLinkProps) {
  // 다이나믹 라우트 경로 매핑
  const href = `/blog/${slug}` as Route

  return <Link href={href}>게시글 보기</Link>
}

export function ExternalLink() {
  // 외부 URL은 프로토콜을 포함하여 정상 처리된다
  return <Link href="https://nextjs.org">공식 웹사이트</Link>
}
```

> **알아두면 좋은 점**:
>
> - **안정화 옵션 사용**: 이 옵션은 정식 안정화되었으므로 `experimental.typedRoutes` 대신 최상위의 `typedRoutes`를 사용해야 한다.
> - **TypeScript 사전 요구**: 프로젝트에 TypeScript가 구성되어 있어야 하며 `tsconfig.json` 파일이 존재해야 한다.
> - **`tsconfig.json` include 확인**: Next.js가 자동 생성하는 타입 선언을 인식하려면 `tsconfig.json`의 `include` 배열에 `.next/types/**/*.ts`가 등록되어 있어야 한다 (`next dev` 실행 시 자동으로 구성된다).
> - **`next typegen` CLI 지원**: 전체 애플리케이션을 빌드하지 않고도 CI 파이프라인에서 라우트 타입만 생성해 타입 체킹(`next typegen && tsc --noEmit`)을 수행할 수 있다.

### Version Changes

| 버전 | 변경 사항 |
|---|---|
| `v15.0.0` | `typedRoutes` 최상위 설정 옵션으로 안정화 |
| `v13.2.0` | `experimental.typedRoutes` 실험적 기능으로 최초 도입 |

## 예제 및 데모 설계

- 데모 가능 여부: 불가 (컴파일 시점 정적 TypeScript 타입 체킹 기능으로 브라우저 런타임에 직접 영향 없음)
- `typedRoutes`는 개발 및 빌드 단계의 정적 분석 도구로, 브라우저에서 동적으로 변화하는 UI 동작이 없다.
- VS Code 등 에디터에서 `<Link href="..." />`를 작성할 때 지원되는 인라인 자동 완성 목록과, 오타가 있을 때 터미널 `next build` 과정에서 나타나는 타입 컴파일 오류(`Type '"/dashbord"' is not assignable to type 'RouteImpl<"/dashbord">'`)로 기능을 검증한다.

## 연습 문제

1. `typedRoutes: true`를 설정했을 때의 동작에 대한 설명으로 옳은 것은?
   - A. 클라이언트 런타임에 잘못된 경로로 이동할 때 브라우저 화면에 팝업 경고를 띄운다.
   - B. `<Link>` 또는 `router.push()`에 유효하지 않은 라우트 경로를 전달하면 TypeScript 컴파일 타임에 오류를 발생시킨다.
   - C. 모든 서버 라우트를 정적 HTML 파일로 자동 변환하여 배포한다.
   - D. 외부 사이트로 연결되는 링크를 보안을 위해 완전히 차단한다.

<details><summary>정답 보기</summary>

정답: **B**  
해설: `typedRoutes`는 실제 라우트 구조를 바탕으로 TypeScript 타입을 자동 생성하여, 오타가 있거나 존재하지 않는 경로를 코드 작성 및 빌드 시점에 즉시 감지할 수 있도록 보장한다.
</details>

2. `typedRoutes`가 생성하는 라우트 선언 파일의 기본 경로로 옳은 것은?
   - A. `src/types/routes.d.ts`
   - B. `.next/types/link.d.ts`
   - C. `node_modules/@types/next-routes.d.ts`
   - D. `public/route-manifest.d.ts`

<details><summary>정답 보기</summary>

정답: **B**  
해설: Next.js는 라우트 타입 선언을 `.next/types/link.d.ts` 파일에 생성하며, 이 선언은 `tsconfig.json`을 통해 프로젝트 전체에 연결된다.
</details>

## 챕터 요약

- `typedRoutes`는 프로젝트의 라우트 구조를 기반으로 경로 문자열의 타입을 생성하여 내비게이션 오타를 컴파일 타임에 방지한다.
- Next.js 15부터 최상위 안정화 옵션으로 정식 제공된다.
- `next dev`, `next build`, 또는 `next typegen` 실행 시 `.next/types/link.d.ts`에 유효한 라우트 유니온 타입이 자동 생성된다.
- `<Link>` 컴포넌트뿐만 아니라 `useRouter().push()` 메서드 호출 시에도 동일하게 정적 타입 검증이 적용된다.
- 다이나믹 라우트는 `Route` 타입 단언이나 템플릿 리터럴로 경로를 안전하게 조합할 수 있다.
