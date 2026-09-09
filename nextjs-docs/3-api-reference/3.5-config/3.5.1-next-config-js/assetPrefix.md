# assetPrefix

- 공식 문서: [assetPrefix](https://nextjs.org/docs/app/api-reference/config/next-config-js/assetPrefix)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- Next.js의 정적 빌드 자산(`/_next/static/...`)을 외부 CDN에서 서빙하기 위해 `assetPrefix`를 구성하는 목적과 동작 방식을 이해한다.
- `assetPrefix`와 `basePath`의 기능 차이점, 그리고 개발 환경과 프로덕션 환경을 나누는 조건부 설정 방법을 학습한다.
- CDN 배포 시 서버 코드 노출을 방지하는 보안 수칙과 `/public` 폴더 파일의 동작 범위를 파악한다.

## 핵심 개념 및 설명

`assetPrefix`는 JavaScript, CSS 등 Next.js가 생성하는 정적 애셋(Asset)에 별도의 CDN(Content Delivery Network) 도메인 접두사를 지정할 때 사용하는 옵션이다.

기본적으로 Next.js는 정적 애셋을 `/_next/static/...` 경로에서 로드한다. `assetPrefix`를 설정하면 스크립트와 스타일 링크를 외부 CDN URL(예: `https://cdn.example.com/_next/static/...`)로 생성하고, 브라우저는 정적 번들을 그 주소에서 직접 다운로드한다.

### 기본 설정 구조

일반적으로 로컬 개발 서버(`next dev`)에서는 로컬 파일 시스템에서 정적 파일을 서빙하고, 프로덕션 빌드에서만 CDN 주소를 적용하도록 환경을 분기한다.

```ts filename="next.config.ts"
import type { NextConfig } from 'next'
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants'

export default (phase: string) => {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER

  const nextConfig: NextConfig = {
    assetPrefix: isDev ? undefined : 'https://cdn.example.com',
  }

  return nextConfig
}
```

### 속성 사양

| 속성 | 타입 | 기본값 | 설명 |
|---|---|---|---|
| `assetPrefix` | `string \| undefined` | `undefined` | 정적 자산 로드 시 앞에 붙을 CDN 도메인 URL(예: `'https://cdn.example.com'`). |

### CDN 설정 (Set up a CDN)

CDN을 설정할 때는 Next.js가 렌더링하는 HTML 파일과 CDN에 호스팅되는 정적 파일의 흐름을 이해해야 한다.

1. 사용자가 웹 사이트에 접속하면 Next.js 오리진 서버가 HTML 문서를 응답으로 반환한다.
2. HTML 문서 내부에 주입된 `<script src="...">`와 `<link rel="stylesheet">` 태그에는 `assetPrefix`로 지정한 CDN URL이 접두사로 포함된다.
3. 브라우저는 JavaScript 번들과 스타일시트를 Next.js 서버가 아닌 CDN 에지(Edge) 서버로 요청해 빠르게 내려받는다.

#### assetPrefix와 basePath의 차이

두 옵션은 URL 접두사를 추가한다는 점에서 유사해 보이지만 용도가 명확히 다르다.

- **`basePath`**: 애플리케이션 전체 라우팅 경로를 하위 서브패스(예: `/docs`)로 옮길 때 사용한다. 라우트 URL, 링크, API 엔드포인트 모두에 영향을 미친다.
- **`assetPrefix`**: 오직 `/_next/static/...` 내부의 정적 자산 로드 URL만 변경한다. 애플리케이션 라우팅 경로에는 일절 관여하지 않는다.

> **알아두면 좋은 점**:
>
> - 애플리케이션을 `/docs` 같은 하위 경로에 호스팅하려는 목적이라면 `assetPrefix`가 아니라 `basePath`를 사용해야 한다.
> - Vercel 플랫폼에 배포하면 글로벌 Edge CDN이 기본으로 자동 구성되므로 `assetPrefix`를 수동으로 설정할 필요가 없다.

#### `/public` 폴더 정적 파일에 대한 제한

`assetPrefix`는 Next.js가 빌드 시 컴파일하는 `/_next/static/` 내부의 파일에만 적용된다.

프로젝트의 `public` 디렉토리에 있는 정적 파일(예: `public/favicon.ico`, `public/images/logo.png`)에는 **`assetPrefix`가 적용되지 않는다**. 이 파일은 계속 애플리케이션 오리진 도메인 경로(`/favicon.ico`, `/images/logo.png`)에서 서빙된다.

#### CDN 업로드 시 보안 주의사항

정적 자산을 외부 CDN 스토리지(S3, Cloud Storage 등)에 업로드해 배포할 때는 반드시 `.next/static/` 디렉토리 내용만 업로드해야 한다.

```bash
# ⭕ 올바른 업로드: .next/static 폴더 내용만 CDN의 _next/static 경로로 배포한다
aws s3 sync .next/static s3://my-cdn-bucket/_next/static --delete

# ❌ 절대 금지: .next 전체 디렉토리를 CDN에 공개해서는 안 된다
# .next 내부에는 서버 컴파일 코드, 환경 변수, 서버 전용 런타임 파일이 포함되어 있어 치명적인 정보 유출이 발생한다
```

## 예제 및 데모 설계

- 데모 가능 여부: 가능 (DevTools Network 탭에서 정적 JS/CSS 파일 로드 URL 접두사 관찰 가능)
- 사용자가 확인할 화면과 결과:
  - `next.config.ts`에 `assetPrefix: 'https://cdn.example.com'`을 지정하고 프로덕션 빌드 후 실행한다 (`next build && next start`).
  - 브라우저로 페이지에 접근한 뒤 페이지 소스 보기(View Source)를 연다.
  - HTML 내부 `<script>` 태그와 `<link>` 태그의 `src`, `href` 속성이 `https://cdn.example.com/_next/static/chunks/...`처럼 CDN 주소를 포함하는지 확인한다.
  - 브라우저 DevTools의 Network 탭에서 자바스크립트와 CSS 파일이 해당 CDN 도메인으로 요청되는지 관찰한다.

## 연습 문제

1. `next.config.js`의 `assetPrefix` 옵션에 대한 설명 중 올바르지 않은 것은 무엇인가?
   - A. `assetPrefix`는 JavaScript 번들과 CSS 파일 등 `/_next/static/` 경로의 자산 URL에 접두사를 부여한다.
   - B. 프로젝트 루트의 `public` 디렉토리에 위치한 정적 이미지와 파비콘 파일에도 `assetPrefix`가 자동으로 적용된다.
   - C. Vercel 플랫폼에 배포할 때는 자체 글로벌 CDN이 기본 동작하므로 `assetPrefix`를 직접 구성할 필요가 없다.
   - D. 애플리케이션 전체를 `/blog` 같은 하위 경로로 호스팅하고자 할 때는 `assetPrefix` 대신 `basePath`를 사용해야 한다.

<details><summary>정답 보기</summary>

정답: **B**
해설: `assetPrefix`는 Next.js 빌드 시 생성되는 `/_next/static/` 경로의 자산에만 적용되며, `public` 디렉토리 내부의 정적 파일에는 적용되지 않는다.
</details>

2. CDN 배포를 위해 `.next` 빌드 산출물을 외부 스토리지에 업로드할 때 가장 주의해야 할 보안 수칙은 무엇인가?
   - A. `.next/standalone` 디렉토리 전체를 CDN에 업로드해야 한다.
   - B. 오직 `.next/static` 디렉토리만 CDN의 `_next/static` 경로로 업로드해야 하며, `.next` 전체를 공개해서는 안 된다.
   - C. `assetPrefix` 설정 시 HTTPS 프로토콜을 사용할 수 없다.
   - D. 클라이언트 번들은 CDN에 업로드하고 HTML 문서는 CDN에 캐시하지 않아야 한다.

<details><summary>정답 보기</summary>

정답: **B**
해설: `.next` 디렉토리 전체에는 Server Component 실행 코드, API 핸들러, 서버 설정 및 환경 정보가 포함되어 있다. 따라서 정적 파일이 위치한 `.next/static` 폴더만 CDN에 업로드해야 하며, `.next` 전체를 업로드하면 서버 코드가 외부에 노출되는 보안 사고가 발생한다.
</details>

## 챕터 요약

- `assetPrefix`는 JavaScript 및 CSS 번들이 위치한 `/_next/static/` 경로에 외부 CDN URL 접두사를 부여하는 설정이다.
- 로컬 개발 시에는 미지정(`undefined`)하고 프로덕션 빌드 시에만 CDN 도메인을 지정하는 조건부 패턴이 널리 쓰인다.
- 애플리케이션을 하위 서브패스로 호스팅하는 `basePath`와는 목적이 완전히 분리돼 있다.
- `public` 폴더 내부의 정적 파일은 `assetPrefix`의 영향을 받지 않고 오리진 도메인에서 서빙된다.
- CDN 스토리지 배포 시 서버 로직 노출을 막기 위해 오직 `.next/static` 디렉토리만 선별해 업로드해야 한다.
