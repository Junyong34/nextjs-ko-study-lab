# basePath

- 공식 문서: [basePath](https://nextjs.org/docs/app/api-reference/config/next-config-js/basePath)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- 도메인의 특정 하위 경로(예: `/docs`) 아래에 Next.js 애플리케이션을 배포할 때 `basePath` 옵션의 역할과 구성 방식을 이해한다.
- `next/link`와 클라이언트 라우터 내비게이션에서 `basePath`가 자동으로 접두사로 붙는 원리를 파악한다.
- `next/image` 컴포넌트를 사용할 때 경로를 수동으로 지정해야 하는 요구사항과 빌드 타임에 값이 인라인으로 주입되는 특성을 학습한다.

## 핵심 개념 및 설명

`basePath`는 도메인의 서브패스(하위 경로) 아래에 Next.js 애플리케이션을 배포할 수 있게 해주는 설정 옵션이다. 예를 들어 `https://example.com/docs`와 같이 동일 도메인의 일부 경로에 애플리케이션을 호스팅해야 할 때 사용한다.

### 기본 설정 구조

`basePath`는 반드시 슬래시(`/`)로 시작해야 하며 끝에 슬래시(trailing slash)를 붙여서는 안 된다.

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  basePath: '/docs',
}

export default nextConfig
```

### 속성 사양

| 속성 | 타입 | 기본값 | 설명 |
|---|---|---|---|
| `basePath` | `string` | `''` (빈 문자열) | 전체 애플리케이션의 하위 경로 접두사(예: `'/docs'`). 반드시 `/`로 시작해야 한다. |

> **알아두면 좋은 점**:
>
> - `basePath` 값은 빌드 시점(`next build`)에 클라이언트 JavaScript 번들에 직접 인라인(inlined)된다. 따라서 런타임 환경 변수로 동적 변경할 수 없으며 값을 변경하려면 반드시 애플리케이션을 다시 빌드해야 한다.
> - `basePath`는 `''`(빈 문자열)이 기본값이며 설정 시 끝에 슬래시를 붙이면 파싱 에러가 발생한다.

### 링크 동작 (Links)

Next.js의 `<Link>` 컴포넌트(`next/link`)와 `useRouter` 훅의 내비게이션 메서드(`router.push`, `router.replace`)는 `basePath`를 자동으로 감지하고 경로 앞에 붙여준다.

```tsx filename="app/page.tsx"
import Link from 'next/link'

export default function Page() {
  return (
    <div>
      {/* basePath가 '/docs'라면 실제 렌더링 결과는 <a href="/docs/about">...</a>가 된다 */}
      <Link href="/about">소개 페이지</Link>
    </div>
  )
}
```

클라이언트 라우터가 페이지를 이동할 때도 `basePath`를 자동으로 적용해 `/docs/about`으로 요청을 라우팅한다.

만약 `basePath`를 벗어난 도메인의 최상위 루트나 다른 서브패스로 이동해야 한다면 일반 `<a>` 태그를 사용해야 한다.

```tsx filename="app/page.tsx"
export default function Page() {
  return (
    <div>
      {/* basePath를 건너뛰고 도메인 루트로 이동한다 */}
      <a href="/">메인 사이트로 이동</a>
    </div>
  )
}
```

### 이미지 컴포넌트 동작 (Images)

`next/image` 컴포넌트는 `<Link>`와 달리 `basePath`를 **자동으로 추가하지 않는다**.

공용 폴더(`/public`)에 있는 정적 이미지를 로드할 때는 개발자가 `src` 속성에 `basePath`를 직접 명시해야 한다.

```tsx filename="app/page.tsx"
import Image from 'next/image'

export default function Page() {
  return (
    <div>
      {/* ❌ 잘못된 예: /docs가 누락되어 이미지를 찾지 못하고 404가 발생한다 */}
      <Image src="/profile.png" alt="프로필" width={100} height={100} />

      {/* ⭕ 올바른 예: basePath를 직접 명시해야 한다 */}
      <Image src="/docs/profile.png" alt="프로필" width={100} height={100} />
    </div>
  )
}
```

정적 임포트(`import profilePic from '../public/profile.png'`)를 사용하면 Next.js가 빌드 시점에 올바른 경로를 계산하므로 수동으로 접두사를 붙이지 않아도 된다.

### 라우팅 규칙과의 연동

`basePath`가 설정되면 `next.config.js`에 정의된 라우팅 설정에도 자동으로 적용된다.

1. **`headers`**: `source` 패턴 앞에 `basePath`가 자동으로 추가되어 매칭된다.
2. **`redirects`**: `source`와 `destination` 모두에 자동으로 `basePath`가 붙는다.
3. **`rewrites`**: `source`와 `destination` 모두에 자동으로 `basePath`가 붙는다.

외부 도메인이나 서브패스 외부와 연동해야 하는 규칙에는 `basePath: false`를 명시하여 이 동작을 제외할 수 있다.

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  basePath: '/docs',
  async redirects() {
    return [
      {
        // /docs/old-doc -> /docs/new-doc 으로 리다이렉트된다
        source: '/old-doc',
        destination: '/new-doc',
        permanent: true,
      },
      {
        // basePath 없이 외부 사이트로 직접 리다이렉트된다
        source: '/external',
        destination: 'https://example.com',
        basePath: false,
        permanent: false,
      },
    ]
  },
}

export default nextConfig
```

## 예제 및 데모 설계

- 데모 가능 여부: 가능 (하위 경로 접두사 기반 라우팅과 페이지 링크 동작 관찰 가능)
- 사용자가 확인할 화면과 결과:
  - `next.config.ts`에 `basePath: '/docs'`를 지정하고 서버를 구동한다.
  - 브라우저로 `http://localhost:3000/docs`에 접근하여 홈 페이지가 정상 서빙되는지 확인한다 (`http://localhost:3000/` 접속 시 404 발생 확인).
  - 페이지 내 `<Link href="/about">` 요소의 실제 HTML DOM을 검사하여 `<a href="/docs/about">`으로 `basePath`가 자동 합성되었는지 확인한다.
  - 정적 자산 로딩 확인: Network 탭에서 스크립트와 CSS 번들이 `/docs/_next/static/...` 경로에서 정상 다운로드되는지 관찰한다.

## 연습 문제

1. `next.config.js`의 `basePath` 옵션에 대한 설명 중 올바르지 않은 것은 무엇인가?
   - A. `basePath` 설정값은 빌드 시점에 클라이언트 번들에 인라인 주입되므로 변경 시 재빌드가 필요하다.
   - B. `<Link>` 컴포넌트에 `href="/about"`을 지정하면 렌더링 시 자동으로 `<a href="/docs/about">` 형태가 된다.
   - C. `next/image` 컴포넌트는 `/public`의 정적 이미지를 로드할 때 `basePath`를 자동으로 `src` 앞에 붙여준다.
   - D. `redirects`와 `rewrites`의 `source` 및 `destination` 경로에도 `basePath`가 기본적으로 자동 결합된다.

<details><summary>정답 보기</summary>

정답: **C**
해설: `next/image` 컴포넌트는 `<Link>`와 달리 `basePath`를 자동으로 붙여주지 않는다. 따라서 정적 이미지를 문자열 경로로 참조할 때는 개발자가 `src="/docs/profile.png"`와 같이 `basePath`를 수동으로 명시해야 한다.
</details>

2. `basePath` 설정 시 문법 규칙으로 올바른 것은 무엇인가?
   - A. 시작과 끝에 모두 슬래시가 있어야 한다 (예: `'/docs/'`).
   - B. 반드시 슬래시로 시작해야 하며, 끝에는 슬래시가 없어야 한다 (예: `'/docs'`).
   - C. 상대 경로 형식이어야 한다 (예: `'./docs'`).
   - D. 프로토콜을 포함한 전체 URL이어야 한다 (예: `'https://example.com/docs'`).

<details><summary>정답 보기</summary>

정답: **B**
해설: Next.js의 `basePath`는 반드시 앞선 슬래시(`/`)로 시작해야 하며, 끝에는 슬래시(trailing slash)가 포함되지 않아야 한다.
</details>

## 챕터 요약

- `basePath`는 동일 도메인의 하위 서브패스(예: `/docs`)에 Next.js 앱을 배포하기 위한 핵심 설정이다.
- 값은 빌드 타임에 클라이언트 JavaScript에 인라인되므로 변경하려면 전체 애플리케이션을 재빌드해야 한다.
- `<Link>`와 클라이언트 라우터 메서드는 자동으로 `basePath`를 경로 앞에 합성한다.
- `next/image`는 `basePath`를 자동 추가하지 않으므로 문자열 `src` 지정 시 개발자가 수동으로 하위 경로를 포함해야 한다.
- `headers`, `redirects`, `rewrites` 등의 라우팅 규칙도 `basePath`가 기본 적용되며 `basePath: false`를 통해 개별 해제할 수 있다.
