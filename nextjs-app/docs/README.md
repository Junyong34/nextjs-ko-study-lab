# 개발·운영 문서 색인

2026-09-05 기준으로 현재 구현 설명, 운영 절차, 과거 결정, 백로그를 구분한다. 문서의 확인일은 코드·기록 대조일이며 별도 표시가 없으면 새 브라우저·배포 검증일이 아니다.

## 문서별 역할

| 문서 | 역할 | 확인 기준 |
|---|---|---|
| [앱 README](../README.md) | 개발자 진입·로컬 실행 | 루트 package.json과 앱 구성 |
| [ARCHITECTURE](../ARCHITECTURE.md) | 시스템·패키지 경계와 요청 흐름 | 앱 설정과 패키지 의존 관계 |
| [01. 화면 구성](./01-ui-and-screen-design.md) | 현재 UI와 미구현 설계 구분 | 홈·AppFrame·헤더·문서·데모 코드 |
| [02. 코드 탐색](./02-codebase-deep-dive-guide.md) | 코드 위치·데이터 흐름·명령 안내 | 원본·생성 스크립트·package.json |
| [03. 데모 제작 표준](./03-demo-standard-and-layout-pattern.md) | 제작 기준과 공통 컴포넌트 예시 | demo-kit API. 전수 통과 보고서가 아님 |
| [04. 배포 계획](./04-vercel-deployment-plan.md) | Production 절차·과거 기록·Preview 과제 | next.config/vercel.json, 공식 자료, 기존 배포 기록 |
| [05. Zone·데모 추가](./05-zone-onboarding-checklist.md) | 일상적인 등록·검증·공개 절차 | 생성기·린터·앱 설정과 09번 |
| [06. 학습 기록](./06-learning-progress-design.md) | 저장 계약·화면별 집계 차이 | inventory·storage·provider·홈 위젯 |
| [07. SEO 계획](./07-seo-plan.md) | 현재 설정 위치·남은 운영 확인 | 공유 metadata, 셸 SEO, OG 라우트 |
| [08. 콘텐츠 아이디어](./08-future-content-ideas.md) | 향후 후보 백로그 | 착수 시 별도 조사 필요 |
| [09. 공개 운영 가이드](./09-demo-status-and-stepwise-release-guide.md) | 공개 상태·집계·화면별 노출의 대표 문서 | YAML·생성 JSON·상태 분기 코드 |
| [CONTEXT](../CONTEXT.md) | 용어 정의 | 위 문서들과 의미 정합성 |

## 유지관리 기준

- 공개 상태를 바꾸면 YAML·매니페스트를 대조하고 09번의 기준일·집계를 갱신한다. 다른 문서는 상태 규칙을 복제하지 않고 09번을 참조한다.
- 설정·UI·저장 계약을 바꾸면 담당 문서를 함께 갱신한다. 번호·파일 경로를 유지하고 제목 변경 시 링크·앵커를 확인한다.
- ADR은 당시 이유와 대안을 보존한다. 구현 차이는 날짜가 있는 후속 메모로 남기며, proposed를 임의로 accepted로 바꾸지 않는다.
- 배포 기록은 대상 커밋·환경·관찰 결과와 함께 남긴다. 코드 존재나 정적 검사 성공을 실제 배포 성공으로 옮겨 적지 않는다.
- [이번 최신화 근거와 후속 항목](./maintenance/2026-09-05-documentation-refresh.md)을 참조한다.

## 📜 아키텍처 의사결정 기록 (ADR)

| 번호 | 결정 사항 및 링크 | 핵심 요약 |
|---|---|---|
| [**0001**](./adr/0001-config-axis-as-app-boundary.md) | 설정 충돌을 앱 경계로 삼고 Multi-Zones로 결합 | `cacheComponents` 등 충돌 설정을 3001(Baseline)과 3002(Cache) 존으로 격리 |
| [**0002**](./adr/0002-pnpm-turborepo-catalog-pinning.md) | pnpm workspaces + Turborepo, 기준 버전 catalog 고정 | Next.js 16 및 React 19 버전을 중앙 catalog에서 일괄 고정하여 버전 불일치 방지 |
| [**0003**](./adr/0003-demo-directive-in-markdown.md) | 문서와 데모는 md 본문의 `demo` 코드펜스로 연결 | 본문 지시자를 통해 문서와 데모를 느슨하게 연결 (0006에 의해 링크 카드로 렌더) |
| [**0004**](./adr/0004-demo-list-as-source-of-truth.md) | 데모의 단일 원본(SSOT)은 `demos.yaml`로 관리 | 데모 메타데이터 및 Zod 검증을 `demos.yaml` 단일 원본에서 통제 |
| [**0005**](./adr/0005-hide-zone-from-learner-url.md) | 학습자 URL에서 zone을 감추고 `/zone/*`으로 분리 | 주소창에는 `/demo/*`만 노출하고 백그라운드에서 Rewrites 프록시로 존 연결 |
| [**0006**](./adr/0006-shadcn-ui-as-ui-foundation.md) | UI 기반은 shadcn/ui로 하고 문서 프레임워크 배제 | 문서 내 Iframe 직접 삽입 금지 (apps/shell/AGENTS.md 규칙 2, 링크 카드) 및 순수 RSC 마크다운 엔진 구축 |
| [**0007**](./adr/0007-ecommerce-domain-and-demo-phasing.md) | 이커머스 도메인 및 4단계 판정 검증 체계 | 가상 시나리오 대신 이커머스 실무 도메인 키트 도입 |
| [**0008**](./adr/0008-shell-owned-client-learning-progress.md) | 셸이 브라우저 기반 학습 기록을 소유 | 하위 존 오염 없이 셸 상위 레이어에서 클라이언트 학습 기록 통합 관리 |
| [**0009**](./adr/0009-classify-demo-verification-by-evidence.md) | 데모 검증은 증거와 확인 방식으로 분류 (proposed) | 기능군이 아닌 브라우저 관찰 증거 기반 검증 패널 체계화 |

---
