# opengraph-image and twitter-image

- 공식 문서: [opengraph-image and twitter-image](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image)
- 상위 메뉴: [Metadata Files](./README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- route segment별 social sharing image와 alt text를 정의한다.
- 정적 파일의 type·용량 제한과 코드 생성 방식을 이해한다.

## 핵심 개념 및 설명

`opengraph-image`와 `twitter-image`는 공유 링크에 표시할 image를 segment별로 설정한다. 정적 파일은 `.jpg|jpeg|png|gif`를 지원하며 같은 이름의 `.alt.txt`로 대체 텍스트를 제공한다. Twitter image는 5MB, Open Graph image는 8MB를 넘으면 빌드가 실패한다.

Next.js는 image metadata를 읽어 `og:image` 또는 `twitter:image`의 URL, type, width, height, alt meta tag를 생성한다. 숫자 suffix로 여러 파일을 둘 수 있고 lexical order로 정렬된다.

코드 variant `opengraph-image.js|ts|tsx`, `twitter-image.js|ts|tsx`는 `ImageResponse`, `Blob`, `ArrayBuffer`, `TypedArray`, `DataView`, `ReadableStream`, `Response`를 반환할 수 있다. Promise `params`와 `size`, `contentType`, `alt` config를 사용할 수 있고 여러 결과에는 `generateImageMetadata`를 쓴다.

정적 파일과 코드 variant는 현재 segment부터 가장 가까운 파일이 하위 route에 적용되는 방식으로 계층화된다. 코드 생성은 기본적으로 빌드 때 최적화되지만 Request-time API나 uncached dependency를 사용하면 요청 시점에 생성된다.

## 예제 및 데모 설계

- Phase 2에서 blog slug별 Open Graph image와 alt를 생성하고 meta tag를 검사한다.
- 제한을 넘는 파일의 빌드 오류와 여러 image의 정렬을 확인한다.

## 연습 문제

1. Twitter image의 최대 파일 크기는?
   - A. 1MB
   - B. 5MB
   - C. 8MB

<details><summary>정답 보기</summary>

정답: B. Twitter image는 5MB, Open Graph image는 8MB 제한이다.
</details>

## 챕터 요약

- social image는 route segment별로 정의할 수 있다.
- 정적 image와 코드 생성 variant를 지원한다.
- `.alt.txt`로 접근 가능한 설명을 제공한다.
- Twitter 5MB, Open Graph 8MB 제한이 있다.
- `generateImageMetadata`로 여러 image를 만들 수 있다.
