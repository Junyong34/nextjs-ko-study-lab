# Multi-tenant

- 공식 문서: [Multi-tenant](https://nextjs.org/docs/app/guides/multi-tenant)
- 상위 메뉴: [Guides](./README.md)
- 전체 목차: [Next.js 학습 문서](../README.md)

## 학습 목표

- 하나의 Next.js 앱이 여러 tenant를 제공하는 구조를 식별한다.
- 공식 예제의 권장 아키텍처를 출발점으로 tenant 분리 기준을 검토한다.
- 문서에 없는 구현 세부를 Next.js 공식 권장으로 오해하지 않는다.

## 핵심 개념 및 설명

Multi-tenant 앱은 하나의 Next.js 애플리케이션이 여러 tenant를 제공한다. 공식 문서는 App Router 기반 권장 아키텍처를 보여주는 [Platforms Starter Kit](https://vercel.com/templates/next.js/platforms-starter-kit)을 예제로 안내한다.

공식 페이지는 이 예제 링크만 제공한다. tenant 식별, 데이터 분리, 도메인 연결, 인증·인가 같은 세부 설계는 애플리케이션 요구사항과 예제 구현을 별도로 검토해 결정해야 한다. 이 문서에서는 원문에 없는 특정 구현을 Next.js의 필수 동작으로 단정하지 않는다.

## 예제 및 데모 설계

- Phase 2에서 Platforms Starter Kit을 검토한 뒤 최소 두 tenant가 서로 다른 콘텐츠를 제공하는 흐름을 설계한다.
- tenant A의 URL·데이터·브랜딩이 tenant B와 섞이지 않는지 화면과 네트워크 요청에서 확인한다.
- 존재하지 않는 tenant와 권한 없는 tenant 데이터 요청의 오류 경계를 정의한다.

## 연습 문제

1. 공식 Multi-tenant 문서가 직접 제공하는 것은 무엇인가?

   - A. 모든 tenant 데이터베이스 구현의 상세 규격
   - B. 권장 아키텍처를 보여주는 예제 링크
   - C. Multi-Zones의 `assetPrefix` 설정

   <details><summary>정답 보기</summary>

   정답: B. 공식 페이지는 Platforms Starter Kit 예제를 안내하며 상세 설계는 예제와 요구사항을 별도로 검토해야 한다.

   </details>

2. 예제 검토 시 우선 확인할 격리 항목은 무엇인가?

   - A. tenant 사이의 URL·데이터·브랜딩 분리
   - B. 모든 tenant가 같은 비밀번호를 쓰는지
   - C. 모든 경로를 하나의 정적 파일로 만드는지

   <details><summary>정답 보기</summary>

   정답: A. 여러 tenant를 한 앱에서 제공할 때 서로의 요청과 콘텐츠가 섞이지 않아야 한다.

   </details>

## 챕터 요약

- Multi-tenant는 하나의 Next.js 애플리케이션이 여러 tenant를 제공하는 구조다.
- 공식 문서는 App Router 기반 Platforms Starter Kit을 권장 예제로 연결한다.
- 공식 페이지 자체에는 tenant 식별과 데이터 분리의 상세 구현이 없다.
- 실제 설계는 예제 코드와 제품 요구사항, 보안 경계를 함께 검토해야 한다.
- 데모에서는 tenant별 URL·데이터·브랜딩 격리를 검증한다.
