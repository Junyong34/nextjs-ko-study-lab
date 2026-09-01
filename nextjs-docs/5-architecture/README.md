# 5. 아키텍처 (Architecture)

> Next.js의 내부 동작 원리, 컴파일러 구조, 성능 최적화 시스템을 다루는 아키텍처 가이드입니다.

---

## 학습 목표

- Next.js 컴파일러와 Turbopack의 번들링 아키텍처를 이해합니다.
- Fast Refresh의 HMR 동작 원리와 상태 보존 메커니즘을 파악합니다.
- 접근성(A11y) 및 브라우저 호환성 정책을 학습합니다.

---

## 학습 목차

- 5.1 [Accessibility](./accessibility.md): 라우트 변경 시 포커스 관리 및 스크린 리더 지원
- 5.2 [Fast Refresh](./fast-refresh.md): 실시간 모듈 핫 리로딩 및 상태 보존 원리
- 5.3 [Next.js Compiler](./nextjs-compiler.md): Rust 기반 SWC 컴파일러 최적화
- 5.4 [Supported Browsers](./supported-browsers.md): 지원 브라우저 및 Polyfill 아키텍처
