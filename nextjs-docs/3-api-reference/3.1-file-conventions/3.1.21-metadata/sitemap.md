# sitemap.xml

- 공식 문서: [sitemap.xml](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)
- 상위 메뉴: [Metadata Files](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- 정적 XML 또는 코드로 검색 엔진용 URL 목록을 제공한다.
- image·video·localized URL과 여러 sitemap 생성 방법을 이해한다.

## 핵심 개념 및 설명

작은 앱은 `app/sitemap.xml`을 직접 작성한다. 코드가 필요하면 `sitemap.js|ts`의 default 함수가 `MetadataRoute.Sitemap` 배열을 반환한다. 각 항목은 `url`, `lastModified`, `changeFrequency`, `priority`, `alternates`, `images`, `videos` 등을 담을 수 있다.

```ts
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: 'https://acme.com', lastModified: new Date(), priority: 1 }]
}
```

image sitemap은 `images`, video sitemap은 `videos`, 다국어 URL은 `alternates.languages`로 생성한다. URL 수가 많으면 `generateSitemaps`에서 id 목록을 반환하고 각 id별 sitemap을 만든다. `sitemap.js`는 Request-time API나 다이나믹 설정이 없으면 기본적으로 캐시된다.

`generateSitemaps`가 반환하는 `id`는 함수의 Promise prop으로 전달된다. sitemap 하나의 URL 수 제한 등 crawler 제약에 맞춰 데이터 range를 나누고 각 결과에는 고유 URL만 포함한다.

## 예제 및 데모 설계

- Phase 2에서 blog 데이터를 URL 배열로 변환하고 XML 결과를 검사한다.
- localized URL과 image/video entry, 여러 sitemap id를 추가한다.

## 연습 문제

1. 매우 많은 URL을 여러 sitemap으로 나누는 함수는?
   - A. `generateMetadata`
   - B. `generateSitemaps`
   - C. `generateStaticParams`

<details><summary>정답 보기</summary>

정답: B. sitemap id별 응답을 생성하도록 분할한다.
</details>

## 챕터 요약

- sitemap은 crawler의 URL 발견을 돕는다.
- 정적 XML과 타입 안전한 코드 생성을 지원한다.
- image, video, localized URL metadata를 담을 수 있다.
- `generateSitemaps`로 큰 목록을 나눈다.
- Request-time API가 없으면 기본적으로 캐시된다.
