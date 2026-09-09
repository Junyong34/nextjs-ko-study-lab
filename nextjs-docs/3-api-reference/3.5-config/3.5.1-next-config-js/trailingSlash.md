# trailingSlash

- 공식 문서: [trailingSlash](https://nextjs.org/docs/app/api-reference/config/next-config-js/trailingSlash)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- Next.js의 URL 트레일링 슬래시(Trailing Slash, `/`) 기본 처리 동작과 `trailingSlash` 옵션의 역할을 이해한다.
- `trailingSlash: true` 설정 시 발생하는 308 영구 리다이렉트 동작과 예외 경로(정적 파일, `.well-known`)를 파악한다.
- 정적 내보내기(`output: "export"`) 시 산출물 HTML 파일 구조(`/about.html` vs `/about/index.html`)에 미치는 영향을 설명할 수 있다.

## 핵심 개념 및 설명

기본적으로 Next.js는 끝에 슬래시가 붙은 URL 요청을 슬래시가 없는 URL로 리다이렉트한다. 예를 들어 사용자가 `/about/` 경로로 접근하면 자동으로 `/about`으로 리다이렉트된다.

SEO 정책이나 특정 웹 서버 환경의 요구에 따라 이 동작을 정반대로 구성할 수 있다. 즉, 끝에 슬래시가 없는 URL을 슬래시가 붙은 URL로 자동 리다이렉트하도록 설정할 수 있다.

### 기본 설정 구조

`next.config.js`에 `trailingSlash` 설정을 추가한다:

```ts filename="next.config.ts" switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  trailingSlash: true,
}

export default nextConfig
```

```js filename="next.config.mjs" switcher
/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
}

export default nextConfig
```

이 옵션을 활성화하면 사용자가 `/about` 경로로 접근할 때 HTTP 308 상태 코드와 함께 `/about/` 경로로 영구 리다이렉트된다.

---

### 트레일링 슬래시가 추가되지 않는 예외 경로

`trailingSlash: true`를 설정해도 다음 유형의 URL에는 끝에 슬래시가 붙지 않고 원본 경로가 그대로 유지된다:

1. **확장자가 있는 정적 파일 URL**:
   파일 확장자가 붙은 리소스 경로는 슬래시 추가 대상에서 빠진다 (예: `/file.txt`, `images/photos/picture.png`).
2. **`.well-known/` 하위 경로**:
   웹 표준과 보안 프로토콜(SSL 인증서 갱신, 오픈ID 디스커버리 등)에서 사용하는 `.well-known/` 하위의 모든 경로는 변경되지 않는다 (예: `.well-known/subfolder/config.json`).

---

### 정적 HTML 내보내기(`output: "export"`)와의 상호작용

Next.js에서 정적 내보내기([`output: "export"`](../../../2-guides/static-exports.md))를 사용할 때 `trailingSlash` 옵션은 생성되는 HTML 파일의 디렉토리 구조를 직접 결정한다:

- **`trailingSlash: false` (기본값)**:
  `/about` 라우트는 `/about.html` 단일 파일로 생성된다.
- **`trailingSlash: true`**:
  `/about` 라우트는 `/about/index.html` 디렉토리와 파일 구조로 생성된다.

> **알아두면 좋은 점**:
> Amazon S3 정적 웹 호스팅, Nginx, Apache 등 많은 표준 웹 서버는 디렉토리에 접근하면 `index.html`을 기본 문서로 찾는 방식을 선호한다. 따라서 정적 호스팅 환경과 호환성을 높이려면 `trailingSlash: true`를 함께 설정하기를 권장한다.

---

### 버전 기록 (Version History)

| 버전 | 변경 사항 |
|---|---|
| `v9.5.0` | `trailingSlash` 옵션이 추가됨. |

---

## 예제 및 데모 설계

- 데모 가능 여부: 가능 (URL 끝에 슬래시 유무에 따른 308 자동 리다이렉트 브라우저 관찰 가능)
- 브라우저 주소창에 `/about`을 입력해 요청을 보내면 주소창이 즉시 `/about/`으로 바뀌는지 확인한다.
- 개발자 도구의 Network 탭에서 첫 번째 `/about` 요청이 `308 Permanent Redirect` 상태 코드를 반환하고 `Location: /about/` 응답 헤더를 통해 정상 리다이렉트되는지 검증한다.
- `/favicon.ico`나 `/robots.txt` 같은 파일 확장자 경로 또는 `/.well-known/...` 경로를 요청할 때는 리다이렉트 없이 원본 경로 그대로 서빙되는 예외 동작을 확인한다.

---

## 연습 문제

1. `next.config.js`에 `trailingSlash: true`를 설정했을 때, 끝에 슬래시가 붙지 않고 원본 형태가 유지되는 요청 경로는 무엇인가?
   - A. `/products`
   - B. `/blog/post-1`
   - C. `/assets/logo.png`
   - D. `/dashboard`

<details><summary>정답 보기</summary>

정답: **C**
해설: `trailingSlash: true` 설정 시에도 파일 확장자가 포함된 정적 파일 URL(예: `/assets/logo.png`)과 `.well-known/` 하위 경로는 슬래시가 붙지 않는 예외 대상이다.
</details>

2. Next.js에서 `output: "export"`와 함께 `trailingSlash: true`를 지정했을 때, `/contact` 페이지가 빌드되어 생성되는 정적 파일 경로는 무엇인가?
   - A. `out/contact.html`
   - B. `out/contact/index.html`
   - C. `out/contact.json`
   - D. `out/contact/page.html`

<details><summary>정답 보기</summary>

정답: **B**
해설: `trailingSlash: true`가 적용된 정적 내보내기 빌드에서는 각 라우트 이름의 디렉토리가 생성되고 그 내부에 `index.html` 파일이 생성되므로 `/contact/index.html` 구조로 출력된다.
</details>

---

## 챕터 요약

- `trailingSlash: true`는 슬래시 없는 URL을 슬래시가 있는 경로(예: `/about` → `/about/`)로 308 영구 리다이렉트한다.
- 파일 확장자를 포함한 정적 리소스 파일과 `.well-known/` 하위 시스템 경로는 리다이렉트 예외라서 슬래시가 붙지 않는다.
- 정적 내보내기(`output: "export"`) 모드에서 `trailingSlash: true`를 적용하면 각 페이지가 `라우트/index.html` 구조로 생성되어 표준 정적 호스팅 서버와 호환성이 높아진다.
- URL 정규화(Canonical URL)와 일관된 SEO 주소 체계를 구축할 때 유용하다.
