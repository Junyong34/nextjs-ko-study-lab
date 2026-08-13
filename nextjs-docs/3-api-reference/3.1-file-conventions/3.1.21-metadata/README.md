# Metadata Files

- 공식 문서: [Metadata Files](https://nextjs.org/docs/app/api-reference/file-conventions/metadata)
- 상위 메뉴: [File-system conventions](../README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- route segment에 특수 metadata 파일을 추가해 head와 crawler 응답을 생성합니다.
- 정적 파일과 코드로 생성하는 variant를 구분합니다.
- caching과 Proxy matcher의 상호작용을 이해합니다.

## 핵심 개념 및 설명

Metadata Files는 icon, manifest, social image, robots, sitemap을 파일 규칙으로 정의합니다. 정적 image·text·XML 파일을 놓거나 `.js|ts|tsx`에서 코드를 실행해 생성할 수 있습니다. Next.js는 production caching을 위해 URL에 hash를 붙여 제공하고 관련 `<link>`·`<meta>` 요소를 파일 type과 크기에 맞게 갱신합니다.

특수 Route Handler인 `sitemap.ts`, `opengraph-image.tsx`, `icon.tsx` 등은 기본적으로 캐시됩니다. `proxy.ts`와 함께 쓰면 matcher에서 metadata 요청을 제외해 crawler와 브라우저가 직접 접근할 수 있게 합니다.

## 학습 순서

- 3.1.21.1 [favicon, icon, and apple-icon](./app-icons.md)
- 3.1.21.2 [manifest.json](./manifest.md)
- 3.1.21.3 [opengraph-image and twitter-image](./opengraph-image.md)
- 3.1.21.4 [robots.txt](./robots.md)
- 3.1.21.5 [sitemap.xml](./sitemap.md)

## 예제 및 데모 설계

- Phase 2에서 각 metadata 파일을 하나씩 추가하고 head tag와 직접 URL 응답을 검사합니다.
- Proxy matcher가 metadata URL을 가로채지 않는지 network log로 확인합니다.

## 연습 문제

1. 코드로 만든 metadata Route Handler의 기본 caching은?
   - A. 기본적으로 캐시된다.
   - B. 절대 캐시되지 않는다.
   - C. 브라우저 localStorage만 사용한다.

<details><summary>정답 보기</summary>

정답: A. Request-time API나 다이나믹 설정을 쓰지 않으면 기본적으로 캐시됩니다.
</details>

## 챕터 요약

- Metadata Files는 파일 기반 metadata API입니다.
- 정적 파일과 코드 생성 variant를 지원합니다.
- Next.js가 URL·type·size에 맞는 head 요소를 만듭니다.
- 코드 기반 특수 handler는 기본적으로 캐시됩니다.
- Proxy matcher에서 metadata 경로를 제외합니다.
