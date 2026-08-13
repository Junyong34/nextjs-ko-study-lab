# Metadata Files

- 공식 문서: [Metadata Files](https://nextjs.org/docs/app/api-reference/file-conventions/metadata)
- 상위 메뉴: [File-system conventions](../README.md)
- 전체 목차: [Next.js 학습 문서](../../../README.md)

## 학습 목표

- route segment에 특수 metadata 파일을 추가해 head와 crawler 응답을 생성합니다.
- 정적 파일과 코드로 생성하는 variant를 구분합니다.
- caching과 Proxy matcher의 상호작용을 이해합니다.

## 핵심 개념 및 설명

문서의 이 섹션에서는 **메타데이터 파일 규칙**을 다룹니다. 라우트 세그먼트에 특수 메타데이터 파일을 추가하여 파일 기반 메타데이터를 정의할 수 있습니다.

각 파일 규칙은 정적 파일(예:`opengraph-image.jpg`) 또는 코드를 사용하여 파일을 생성하는 동적 변형(예:`opengraph-image.js`)을 사용하여 정의할 수 있습니다.

파일이 정의되면 Next.js는 자동으로 파일을 제공하고(캐싱을 위한 프로덕션 해시 포함) 관련 헤드 요소를 자산의 URL, 파일 유형 및 이미지 크기와 같은 올바른 메타데이터로 업데이트합니다.

> **알아두면 좋은 점**:
>
> - [`sitemap.ts`](sitemap.md), [`opengraph-image.tsx`](opengraph-image.md), [`icon.tsx`](app-icons.md) 및 기타 [메타데이터 파일](README.md)과 같은 특수 Route Handler는 기본적으로 캐시됩니다.
> - [`proxy.ts`](../proxy.md)와 함께 사용하는 경우 [매처를 구성](../proxy.md#matcher)하여 메타데이터 파일을 제외합니다.

## 예제 및 데모 설계

- Phase 2에서 각 metadata 파일을 하나씩 추가하고 head tag와 직접 URL 응답을 검사합니다.
- Proxy matcher가 metadata URL을 가로채지 않는지 network log로 확인합니다.

## 연습 문제

1. 코드로 만든 metadata Route Handler의 기본 caching은?
   - A. 기본적으로 캐시됩니다.
   - B. 절대 캐시되지 않습니다.
   - C. 브라우저 localStorage만 사용합니다.

<details><summary>정답 보기</summary>

정답: A. Request-time API나 다이나믹 설정을 쓰지 않으면 기본적으로 캐시됩니다.
</details>

## 챕터 요약

- Metadata Files는 파일 기반 metadata API입니다.
- 정적 파일과 코드 생성 variant를 지원합니다.
- Next.js가 URL·type·size에 맞는 head 요소를 만듭니다.
- 코드 기반 특수 handler는 기본적으로 캐시됩니다.
- Proxy matcher에서 metadata 경로를 제외합니다.
