# manifest.json

- 공식 문서: [manifest.json](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest)
- 상위 메뉴: [Metadata Files](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- Web App Manifest를 정적 파일 또는 타입 안전한 함수로 제공한다.
- 파일 위치와 caching 조건을 이해한다.

## 핵심 개념 및 설명

`manifest.json|webmanifest`는 `app` root에 두고 Web Manifest 표준에 맞춰 앱 이름, 시작 URL, 표시 방식, 색상, icon을 설명한다.

코드가 필요하면 `manifest.js|ts`의 default 함수에서 `MetadataRoute.Manifest` 객체를 반환한다.

```ts
import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return { name: 'Next.js App', start_url: '/', display: 'standalone' }
}
```

이 특수 Route Handler는 Request-time API나 다이나믹 설정을 사용하지 않으면 기본적으로 캐시된다. Manifest 표준은 확장될 수 있으므로 최신 field는 TypeScript type이나 MDN을 확인한다.

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
