# nextjs-app 핵심 설계 문서 및 ADR

Next.js 학습 랩(`nextjs-app`)의 시스템 아키텍처, UI 설계, 코드베이스 데이터 흐름 및 데모 제작 표준 지침입니다.

---

## 📌 핵심 설계 문서

| 번호 | 문서명 | 주요 내용 및 목적 |
|---|---|---|
| **01** | [**화면 구성과 UI 설계**](./01-ui-and-screen-design.md) | • 페이지 타입 5종 (랜딩, 문서 SSG, 데모 색인, 데모 플레이어, 학습 기록)<br>• 헤더/사이드바/ToC/피드백 UI 및 shadcn 기반 디자인 토큰 체계 |
| **02** | [**코드베이스 심층 분석 및 데이터 흐름 가이드**](./02-codebase-deep-dive-guide.md) | • 모노레포 파일 토폴로지 & YAML 파이프라인<br>• 패키지 격리 정책 (`@study/ui` vs `@study/demo-kit`)<br>• 셸/데모 뼈대 간 네비게이션 및 Seam 아키텍처 |
| **03** | [**데모 표준 구조 및 4단 레이아웃 패턴**](./03-demo-standard-and-layout-pattern.md) | • **No-Simulation 원칙** (진짜 Next.js 파일 라우팅 및 런타임 구현)<br>• 4단 표준 레이아웃 (`DemoGuideCard` ➔ `실습 화면` ➔ `ExpectedActualPanel` ➔ `DemoDeepDiveCard`) |
| **04** | [**Vercel 배포 계획**](./04-vercel-deployment-plan.md) | • zone당 프로젝트 분리, Related Projects로 프리뷰 URL 문제 해결<br>• Ignored Build Step·원격 캐시·첫 배포 검증 절차 (아직 미실행) |
| **05** | [**Zone / 데모 추가 체크리스트**](./05-zone-onboarding-checklist.md) | • zone을 새로 추가할 때 손대야 하는 지점 전체<br>• 일상적인 데모 추가 절차 |
| **06** | [**학습 기록 기능 설계**](./06-learning-progress-design.md) | • 셸 소유의 `localStorage` 기반 학습 진도 및 완료 표시 동기화 엔진<br>• `LearningProgressProvider` 및 통계 대시보드 화면 설계 |
| **07** | [**SEO 작업 계획**](./07-seo-plan.md) | • robots/sitemap/구조화 데이터/OG 등 기술적 SEO 체크리스트<br>• Google·네이버 등록 절차와 도메인 확정 전/후 실행 순서 |
| **08** | [**향후 콘텐츠 아이디어 백로그**](./08-future-content-ideas.md) | • 문서 번역·데모 실습 이후 추가할 콘텐츠 후보 10종 목록<br>• 새 콘텐츠 기획 시 참고하는 백로그(실행 계획 아님) |
| **09** | [**실습 예제 상태 관리 및 단계별 오픈 가이드**](./09-demo-status-and-stepwise-release-guide.md) | • 미검증 예제 품질 리스크 방어 체계 및 `stub`/`done` 상태 관리<br>• 사이드바·색인·데모 뷰어의 화면 노출 규칙 및 단계별 추가 오픈 절차 |

---

## 📜 아키텍처 의사결정 기록 (ADR)

| 번호 | 결정 사항 및 링크 | 핵심 요약 |
|---|---|---|
| [**0001**](./adr/0001-config-axis-as-app-boundary.md) | 설정 충돌을 앱 경계로 삼고 Multi-Zones로 결합 | `cacheComponents` 등 충돌 설정을 3001(Baseline)과 3002(Cache) 존으로 격리 |
| [**0002**](./adr/0002-pnpm-turborepo-catalog-pinning.md) | pnpm workspaces + Turborepo, 기준 버전 catalog 고정 | Next.js 16 및 React 19 버전을 중앙 catalog에서 일괄 고정하여 버전 불일치 방지 |
| [**0003**](./adr/0003-demo-directive-in-markdown.md) | 문서와 데모는 md 본문의 ````demo``` 지시자로 연결 | 본문 지시자를 통해 문서와 데모를 느슨하게 연결 (0006에 의해 링크 카드로 렌더) |
| [**0004**](./adr/0004-demo-list-as-source-of-truth.md) | 데모의 단일 원본(SSOT)은 `demos.yaml`로 관리 | 241개 데모 메타데이터 및 Zod 검증을 `demos.yaml` 단일 원본에서 통제 |
| [**0005**](./adr/0005-hide-zone-from-learner-url.md) | 학습자 URL에서 zone을 감추고 `/zone/*`으로 분리 | 주소창에는 `/demo/*`만 노출하고 백그라운드에서 Rewrites 프록시로 존 연결 |
| [**0006**](./adr/0006-shadcn-ui-as-ui-foundation.md) | UI 기반은 shadcn/ui로 하고 문서 프레임워크 배제 | 문서 내 Iframe 직접 삽입 금지 (apps/shell/AGENTS.md 규칙 2, 링크 카드) 및 순수 RSC 마크다운 엔진 구축 |
| [**0007**](./adr/0007-ecommerce-domain-and-demo-phasing.md) | 이커머스 도메인 및 4단계 판정 검증 체계 | 가상 시나리오 대신 이커머스 실무 도메인 키트 도입 |
| [**0008**](./adr/0008-shell-owned-client-learning-progress.md) | 셸이 브라우저 기반 학습 기록을 소유 | 하위 존 오염 없이 셸 상위 레이어에서 클라이언트 학습 기록 통합 관리 |
| [**0009**](./adr/0009-classify-demo-verification-by-evidence.md) | 데모 검증은 증거와 확인 방식으로 분류 | 기능군이 아닌 브라우저 관찰 증거 기반 검증 패널 체계화 |

---

## 🏛️ 시스템 아키텍처 상세

전체 시스템 구조도, Multi-zones Rewrites 라우팅 프록시, Iframe postMessage 리사이즈 브리지 및 상세 시퀀스 다이어그램은 상위의 [**`nextjs-app/ARCHITECTURE.md`**](../ARCHITECTURE.md)를 참조하세요.
