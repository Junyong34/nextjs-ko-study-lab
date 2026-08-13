# nextjs-app 작업 규칙 (Phase 2 예정)

이 폴더는 아직 착수하지 않은 Next.js 데모 앱 자리다. 착수 조건이 충족되기 전까지 실행 코드를 만들지 않는다.

## 착수 조건

[`nextjs-docs/PROGRESS.md`](../nextjs-docs/PROGRESS.md)의 항목이 대부분 "완료"가 되어야 한다 ([루트 Phase Gate](../AGENTS.md#phase-gate) 참고).

## 예정 스택

- Next.js App Router
- TypeScript
- Tailwind CSS

## 예정 구조

`nextjs-docs/`의 학습 카테고리(Getting Started, Guides, API Reference 등)와 대응하는 라우트로 각 개념의 데모를 구성한다. 세부 라우팅 구조는 착수 시점에 확정한다.

## 착수 시 챙길 것 — nextjs-docs 참조

이 앱의 페이지가 `nextjs-docs/`의 md·이미지를 화면에 그려야 하는 경우, 형제 폴더 구조 자체는 문제없지만 아래 두 가지를 함께 설정한다.

1. **배포 시 파일 추적(output file tracing)**: `next.config.js`에 `outputFileTracingRoot`(레포 루트)와 `outputFileTracingIncludes`(예: `../nextjs-docs/**/*.md`)를 명시해야 한다. 기본값은 이 앱의 프로젝트 폴더만 tracing root로 잡기 때문에, 명시하지 않으면 `output: "standalone"` 빌드나 Vercel 배포 산출물에서 `nextjs-docs` 파일이 누락될 수 있다.
2. **이미지 자산 서빙**: `nextjs-docs/*/assets/*.webp`는 md의 상대 경로만으로는 브라우저에서 그려지지 않는다. `public/`으로 복사하는 빌드 스크립트나, 해당 경로를 스트리밍하는 라우트 핸들러가 필요하다.

## 이미지 포맷

`nextjs-docs`의 캡쳐 이미지는 PNG가 아니라 무손실 WebP(`.webp`)로 저장돼 있다. 이 앱에서 새로 캡쳐하거나 처리하는 이미지도 동일하게 WebP를 쓴다.
