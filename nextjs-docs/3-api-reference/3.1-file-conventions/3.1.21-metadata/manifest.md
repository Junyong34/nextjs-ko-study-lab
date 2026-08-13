# manifest.json

- 공식 문서: [manifest.json](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest)
- 상위 메뉴: [Metadata Files](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- Web App Manifest를 정적 파일 또는 타입 안전한 함수로 제공한다.
- 파일 위치와 caching 조건을 이해한다.

## 핵심 개념 및 설명

`app` 디렉터리의 **루트**에 [웹 매니페스트 사양](https://developer.mozilla.org/docs/Web/Manifest)과 일치하는 `manifest.(json|webmanifest)` 파일을 추가하거나 생성하여 브라우저에 웹 애플리케이션에 대한 정보를 제공한다.

<a id="static-manifest-file"></a>
### 정적 매니페스트 파일

```json filename="app/manifest.json | app/manifest.webmanifest"
{
  "name": "My Next.js Application",
  "short_name": "Next.js App",
  "description": "An application built with Next.js",
  "start_url": "/"
  // ...
}
```

<a id="generate-a-manifest-file"></a>
### 매니페스트 파일 생성

[`Manifest` 객체](#manifest-object)를 반환하는 `manifest.js` 또는 `manifest.ts` 파일을 추가한다.

> **알아두면 좋은 점**: `manifest.js`는 [요청 시점 API](../../../4-glossary/README.md#request-time-apis) 또는 [동적 구성](../../../2-guides/caching-without-cache-components.md#dynamic) 옵션을 사용하지 않는 한 기본적으로 캐시되는 특수 Route Handler이다.

```ts filename="app/manifest.ts" switcher
import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Next.js App',
    short_name: 'Next.js App',
    description: 'Next.js App',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
```

```js filename="app/manifest.js" switcher
export default function manifest() {
  return {
    name: 'Next.js App',
    short_name: 'Next.js App',
    description: 'Next.js App',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
```

<a id="manifest-object"></a>
#### 매니페스트 객체

매니페스트 객체에는 새로운 웹 표준으로 인해 업데이트될 수 있는 광범위한 옵션 목록이 포함되어 있다. 현재 모든 옵션에 대한 자세한 내용은 [TypeScript](../../3.5-config/typescript.md#ide-plugin)를 사용하는 경우 코드 편집기에서 `MetadataRoute.Manifest` 유형을 참조하거나 [MDN](https://developer.mozilla.org/docs/Web/Manifest) 문서를 참조한다.

## 예제 및 데모 설계

- Phase 2에서 정적 manifest와 TypeScript 함수 variant를 번갈아 적용해 browser application panel을 확인한다.

## 연습 문제

1. `manifest` 파일의 위치는?
   - A. `app` root
   - B. 모든 nested segment
   - C. `.next` 폴더

<details><summary>정답 보기</summary>

정답: A. Web App Manifest는 `app` root에 둔다.
</details>

## 챕터 요약

- manifest는 웹 앱 정보를 브라우저에 제공한다.
- 정적 JSON/webmanifest 또는 JS/TS 함수로 정의한다.
- TypeScript에서는 `MetadataRoute.Manifest`를 사용한다.
- Request-time API가 없으면 기본적으로 캐시된다.
