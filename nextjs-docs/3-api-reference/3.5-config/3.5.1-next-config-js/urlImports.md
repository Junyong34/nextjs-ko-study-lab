# urlImports

- 공식 문서: [urlImports](https://nextjs.org/docs/app/api-reference/config/next-config-js/urlImports)
- 상위 메뉴: [next.config.js](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

> **Experimental**: 이 기능은 현재 experimental 상태이며 변경될 수 있다. production 환경에는 권장하지 않는다. 사용해 보고 [GitHub](https://github.com/vercel/next.js/issues)에 피드백을 남길 수 있다.

## 학습 목표

- 외부 서버에서 모듈을 직접 가져오는 URL Imports의 동작을 이해한다.
- `experimental.urlImports`에 허용할 URL prefix를 지정하는 방법을 익힌다.
- `next.lock` 디렉터리와 보안 모델이 production 빌드에 미치는 영향을 파악한다.

## 핵심 개념 및 설명

이 기능은 현재 experimental이며 변경될 수 있다. production에서 사용하는 것은 권장하지 않는다. URL Imports는 로컬 디스크 대신 외부 서버에서 모듈을 직접 import하는 기능이다.

> **주의**: 코드를 다운로드해 실행할 도메인은 신뢰할 수 있을 때만 사용한다. 이 기능이 stable로 표시될 때까지 신중하게 판단한다.

사용하려면 `next.config.js`의 `experimental.urlImports`에 허용할 URL prefix를 추가한다.

```js filename="next.config.js"
module.exports = {
  experimental: {
    urlImports: ['https://example.com/assets/', 'https://cdn.skypack.dev'],
  },
}
```

그러면 URL에서 모듈을 직접 import할 수 있다.

```js
import { a, b, c } from 'https://example.com/assets/some/module.js'
```

URL Imports는 일반 package import가 가능한 모든 곳에서 사용할 수 있다.

## 보안 모델 (Security Model)

이 기능은 보안을 최우선에 두고 설계되고 있다. 현재는 URL Imports를 허용할 도메인을 명시적으로 지정하는 experimental flag가 필요하다. 향후에는 [Edge Runtime](https://nextjs.org/docs/app/api-reference/edge)을 사용해 URL Imports가 브라우저 sandbox에서만 실행되도록 제한하는 방향으로 확장할 수 있다.

## Lockfile

URL Imports를 사용하면 Next.js가 `next.lock` 디렉터리를 만들어 가져온 asset과 lockfile을 담는다. 이 디렉터리는 `.gitignore`로 무시하지 말고 Git에 커밋해야 한다.

- `next dev`를 실행하면 새로 발견한 URL Imports를 다운로드해 lockfile에 추가한다.
- `next build`를 실행하면 lockfile만 사용해 production 빌드를 만든다.

일반적으로 빌드 중 네트워크 요청은 필요하지 않다. 오래된 lockfile이 있으면 빌드가 실패한다. 예외적으로 `Cache-Control: no-cache`로 응답하는 리소스는 lockfile에 `no-cache` 항목으로 기록되며 매 빌드마다 네트워크에서 다시 가져온다.

## 예제 (Examples)

### Skypack

```tsx
import confetti from 'https://cdn.skypack.dev/canvas-confetti'
import { useEffect } from 'react'

export default () => {
  useEffect(() => {
    confetti()
  })
  return <p>Hello</p>
}
```

### 정적 이미지 import (Static Image Imports)

```tsx
import Image from 'next/image'
import logo from 'https://example.com/assets/logo.png'

export default () => (
  <div>
    <Image src={logo} placeholder="blur" />
  </div>
)
```

### CSS의 URL (URLs in CSS)

```css
.className {
  background: url('https://example.com/assets/hero.jpg');
}
```

### Asset import (Asset Imports)

```js
const logo = new URL('https://example.com/assets/file.txt', import.meta.url)

console.log(logo.pathname)

// "/_next/static/media/file.a9727b5d.txt"를 출력한다.
```

## 예제 및 데모 설계

- 데모 가능 여부: 가능
- 허용된 CDN의 모듈과 정적 이미지를 import하는 페이지를 만들고 `next dev`와 `next build`에서 동작을 확인한다.
- `next.lock`이 생성되고 production 빌드가 lockfile만 사용하는지 확인한다.

## 연습 문제

1. URL Imports를 허용하려면 무엇을 설정해야 하는가?
   - A. `experimental.urlImports`에 허용할 URL prefix를 추가한다.
   - B. `images.remotePatterns`만 추가한다.
   - C. `webpack`에 모든 외부 URL을 등록한다.
   - D. `.gitignore`에 `next.lock`을 추가한다.

<details><summary>정답 보기</summary>

정답: **A**  
해설: `experimental.urlImports` 배열에 허용할 URL prefix를 등록해야 해당 URL에서 모듈을 import할 수 있다.
</details>

2. URL Imports를 사용할 때 `next.lock` 디렉터리는 어떻게 관리해야 하는가?
   - A. 항상 `.gitignore`에 추가한다.
   - B. Git에 커밋한다.
   - C. production에서 삭제한다.
   - D. 매번 수동으로 비운다.

<details><summary>정답 보기</summary>

정답: **B**  
해설: `next dev`는 새 URL Imports를 lockfile에 기록하고 `next build`는 lockfile을 사용해 빌드하므로 Git에 커밋해야 한다.
</details>

## 챕터 요약

- URL Imports는 외부 서버에서 모듈과 asset을 직접 import하는 experimental 기능이다.
- 실행할 도메인을 `experimental.urlImports`에 명시적으로 허용해야 한다.
- `next.lock`은 Git에 커밋하고 production 빌드에서 사용한다.
- 신뢰할 수 있는 외부 도메인만 허용해야 한다.
