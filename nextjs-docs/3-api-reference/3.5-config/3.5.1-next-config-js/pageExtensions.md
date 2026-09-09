# pageExtensions

- 공식 문서: [pageExtensions](https://nextjs.org/docs/app/api-reference/config/next-config-js/pageExtensions)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- `pageExtensions` 옵션의 역할과 Next.js 라우트 파일 확장자 인식 원리를 이해한다.
- 마크다운 및 MDX(`.md`, `.mdx`) 확장자 추가를 통한 문서 페이지 라우팅 구성 방식을 파악한다.
- App Router의 특수 파일 규약(`page.tsx`)과 Pages Router에서의 비페이지 파일 코로케이션(Colocation) 동작 차이를 설명할 수 있다.

## 핵심 개념 및 설명

`pageExtensions`는 Next.js가 라우팅 진입점 파일로 인식할 파일 확장자 목록을 확장하거나 제한하는 설정이다. 기본값은 `['tsx', 'ts', 'jsx', 'js']`로 지정되어 있다.

이 옵션은 주로 MDX와 같은 마크다운 문서를 직접 라우트로 서빙하기 위해 확장자를 추가하거나, Pages Router 환경에서 테스트 파일과 컴포넌트가 라우트로 잘못 노출되지 않도록 엔트리 파일 확장자를 엄격하게 한정할 때 활용한다.

### 기본 설정 구조

MDX 지원 패키지(`@next/mdx`)와 함께 구성하여 `.md` 및 `.mdx` 확장자를 라우팅 시스템에 추가하는 전형적인 설정 예제다:

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'
import createMDX from '@next/mdx'

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
}

const withMDX = createMDX({
  // 필요 시 마크다운 플러그인 옵션 추가
})

export default withMDX(nextConfig)
```

```js filename="next.config.mjs" switcher
import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
}

const withMDX = createMDX({
  // 필요 시 마크다운 플러그인 옵션 추가
})

export default withMDX(nextConfig)
```

### 옵션 명세

| 속성명 | 타입 | 기본값 | 설명 |
|---|---|---|---|
| `pageExtensions` | `string[]` | `['tsx', 'ts', 'jsx', 'js']` | Next.js가 페이지 및 라우트 파일로 인식할 파일 확장자 목록. |

### MDX 및 마크다운 페이지 확장

`pageExtensions` 목록에 `md`와 `mdx`를 등록하면 개발자가 별도의 변환기 없이도 마크다운 파일을 일반 페이지나 레이아웃처럼 직접 라우트로 활용할 수 있다:

- **App Router**: `app/blog/page.mdx` 파일을 생성하면 `/blog` 경로에서 마크다운 콘텐츠가 자동으로 렌더링된다.
- **Pages Router**: `pages/about.mdx` 파일을 생성하면 `/about` URL로 해당 페이지가 서빙된다.

### Pages Router에서의 비페이지 파일 코로케이션 (Colocation)

Pages Router 환경에서는 `pages/` 디렉토리 하위에 위치한 모든 파일이 기본적으로 URL 경로로 매핑된다. 이로 인해 컴포넌트, 유틸리티 함수, 테스트 코드를 같은 폴더에 두고 관리(코로케이션)하기 어려웠다.

`pageExtensions`를 복합 확장자로 제한하면 이 문제를 해결할 수 있다:

```ts filename="next.config.ts"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // .page.tsx 및 .page.js 형식만 라우트로 인식하도록 제한
  pageExtensions: ['page.tsx', 'page.ts', 'page.jsx', 'page.js'],
}

export default nextConfig
```

위 설정을 적용하면 `pages/` 폴더 내부가 다음과 같이 동작한다:

- `pages/blog/index.page.tsx` → `/blog` 라우트로 정상 매핑된다.
- `pages/blog/BlogCard.tsx` → 라우트로 매핑되지 않아 일반 컴포넌트로 안전하게 재사용할 수 있다.
- `pages/blog/index.test.ts` → 테스트 코드가 라우트로 서빙되지 않는다.

### App Router에서의 동작 차이점

App Router는 파일 이름 자체를 기반으로 하는 특수 파일 컨벤션(`page.tsx`, `layout.tsx`, `route.ts`, `loading.tsx` 등)을 채택하고 있다.

따라서 App Router 환경에서는 `pageExtensions`를 `page.tsx`처럼 복합 확장자로 변경하지 않아도, `app/` 디렉토리 내부에 테스트 파일, 컴포넌트, 스타일시트 등을 자유롭게 함께 배치하는 코로케이션이 별도 설정 없이(out of the box) 기본 지원된다.

App Router에서 `pageExtensions`는 주로 `.mdx`와 같은 커스텀 확장자 파일을 `page.mdx` 형태로 인식시키고자 할 때 사용한다.

> **알아두면 좋은 점**:
>
> - **표준 확장자 누락 주의**: `pageExtensions`를 새로 정의할 때 기존 표준 확장자(`tsx`, `ts`, `jsx`, `js`)를 누락하면, 기존의 일반 TypeScript/JavaScript 라우트 파일이 빌드 대상에서 제외될 수 있으므로 반드시 함께 명시해야 한다.
> - **특수 파일 확장자 적용**: App Router에서 `pageExtensions`에 추가된 확장자는 `page`뿐만 아니라 `layout`, `route` 등 다른 특수 파일에도 동일하게 매칭된다.

### Version Changes

| 버전 | 변경 사항 |
|---|---|
| `v9.0.3` | `pageExtensions` 설정 옵션 공식 도입 |

## 예제 및 데모 설계

- 데모 가능 여부: 가능 (지정된 커스텀 확장자 파일만 라우트로 서빙되고 테스트 파일 등이 라우트에서 제외되는 동작 확인 가능)
- Pages Router 구조에서 `pageExtensions: ['page.tsx', 'page.ts']`를 구성하고 `pages/about.page.tsx`와 `pages/about.test.ts` 파일을 생성한다.
- 브라우저에서 `/about` 경로로 접근 시 페이지가 정상 렌더링되고, `/about.test` 접근 시 404 Not Found 응답이 반환되는 것을 확인한다.
- App Router 환경에서 `pageExtensions`에 `mdx`를 추가하고 `app/markdown-demo/page.mdx`를 생성하여 브라우저에서 마크다운 문서가 직접 렌더링되는 결과를 관찰한다.

## 연습 문제

1. Pages Router 환경에서 `pageExtensions: ['page.tsx', 'page.ts']` 설정을 도입하는 주된 이유는?
   - A. 웹 브라우저의 캐싱 성능을 향상시키기 위해
   - B. `pages/` 폴더 내에 컴포넌트와 테스트 파일을 라우트 노출 없이 안전하게 코로케이션하기 위해
   - C. TypeScript 컴파일 단계를 생략하기 위해
   - D. API 라우트의 보안 암호화를 강화하기 위해

<details><summary>정답 보기</summary>

정답: **B**
해설: Pages Router는 기본적으로 `pages/` 내의 모든 파일을 URL 경로로 취급하므로, `pageExtensions`를 특정 확장자로 한정하여 테스트나 일반 컴포넌트가 라우트로 생성되지 않도록 코로케이션할 수 있다.
</details>

2. Next.js에 MDX 지원을 추가할 때 `pageExtensions` 배열을 작성하는 가장 적절한 방법은?
   - A. `pageExtensions: ['mdx', 'md']` (마크다운 확장자만 지정)
   - B. `pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx']` (기존 표준 확장자와 함께 지정)
   - C. `pageExtensions: ['*.mdx']` (글로브 와일드카드 사용)
   - D. `pageExtensions: ['all']` (모든 파일 허용)

<details><summary>정답 보기</summary>

정답: **B**
해설: 기존 표준 확장자(`js`, `jsx`, `ts`, `tsx`)를 생략하면 프로젝트 내 기존 라우트 파일들이 인식되지 않으므로, 새 확장자를 추가할 때는 반드시 기존 표준 확장자 목록을 함께 유지해야 한다.
</details>

## 챕터 요약

- `pageExtensions`는 Next.js가 라우팅 진입점 파일로 인식할 확장자 목록을 정의한다 (기본값: `['tsx', 'ts', 'jsx', 'js']`).
- `@next/mdx`와 연계하여 `.md`, `.mdx`를 추가함으로써 마크다운 파일을 페이지로 직접 서빙할 수 있다.
- Pages Router에서는 `['page.tsx', 'page.ts']` 설정을 통해 `pages/` 디렉토리 내에 테스트와 컴포넌트를 코로케이션할 수 있다.
- App Router는 특수 파일 컨벤션 기반으로 설계되어 별도 복합 확장자 설정 없이도 파일 코로케이션이 기본 제공된다.
- 커스텀 확장자 등록 시 표준 확장자를 누락하지 않도록 주의해야 한다.
