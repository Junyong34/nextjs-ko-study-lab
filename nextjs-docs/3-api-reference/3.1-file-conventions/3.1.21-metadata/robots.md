# robots.txt

- 공식 문서: [robots.txt](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots)
- 상위 메뉴: [Metadata Files](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- crawler별 접근 규칙을 정적 text 또는 `MetadataRoute.Robots`로 생성한다.
- 표준·비표준 directive와 caching 조건을 이해한다.

## 핵심 개념 및 설명

`app` root의 `robots.txt`는 검색 crawler가 접근할 수 있는 URL을 지정한다. 코드 variant `robots.js|ts`는 `MetadataRoute.Robots`를 반환하고 `rules`, `sitemap`, `host`를 직렬화한다.

```ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: '*', allow: '/', disallow: '/private/' } }
}
```

여러 crawler를 다르게 처리하려면 `rules` 배열을 사용한다. `Request-Rate`, `Clean-param` 같은 비표준 directive는 rule의 `other`에 넣으며 key casing과 배열의 여러 줄 출력이 보존된다. 함수는 Request-time API나 다이나믹 설정이 없으면 기본적으로 캐시된다.

`Robots` 객체는 단일 또는 여러 `userAgent`, `allow`, `disallow`, `crawlDelay`와 top-level `sitemap`, `host`를 표현한다. 문자열 또는 배열을 사용해 하나의 directive를 여러 줄로 출력할 수 있다.

## 예제 및 데모 설계

- Phase 2에서 Googlebot과 Bingbot 규칙, sitemap, 비표준 directive를 생성하고 raw text를 검증한다.

## 연습 문제

1. crawler별 다른 규칙을 정의하는 방법은?
   - A. `rules` 배열
   - B. `children` prop
   - C. `ImageResponse`

<details><summary>정답 보기</summary>

정답: A. user agent별 rule 객체를 배열에 둔다.
</details>

## 챕터 요약

- robots 파일은 `app` root에 둔다.
- 정적 text와 코드 생성 방식을 지원한다.
- `MetadataRoute.Robots`로 타입을 검사한다.
- `rules` 배열로 crawler를 구분한다.
- 비표준 directive는 `other`에 보존할 수 있다.
