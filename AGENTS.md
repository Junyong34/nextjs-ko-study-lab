# nextjs-ko-study-lab 작업 규칙

Next.js App Router 공식 문서(nextjs.org/docs/app)를 한국어 학습 커리큘럼으로 재구성하고, 이후 데모 앱으로 확장하는 저장소다.

## 디렉토리별 규칙

작업 대상이 하위 디렉토리에 속하면, 그 디렉토리의 `AGENTS.md`(Claude Code는 `CLAUDE.md`를 통해 동일 내용을 읽는다)가 이 파일보다 우선한다.

| 디렉토리 | 상태 | 규칙 |
|---|---|---|
| [`nextjs-docs/`](./nextjs-docs/AGENTS.md) | Phase 1, 완료 | 문서 작성 규칙 |
| [`nextjs-app/`](./nextjs-app/AGENTS.md) | Phase 2, 구현 완료 | 실행 코드 작업 규칙 |

## Phase Gate

**Phase 1(문서화)은 완료됐다** ([`nextjs-docs/PROGRESS.md`](./nextjs-docs/PROGRESS.md) 전부 "완료"). `nextjs-app/`은 셸과 데모 존 2개를 운영하며 데모를 단계적으로 공개한다. 등록·공개 상태는 [공개 운영 가이드](./nextjs-app/docs/09-demo-status-and-stepwise-release-guide.md)가 관리한다. 첫 Vercel 배포 검증 기록은 있으며 Preview 등 후속 운영 검증은 남아 있다 ([`nextjs-app/docs/04-vercel-deployment-plan.md`](./nextjs-app/docs/04-vercel-deployment-plan.md) 참고). 새 코드는 [`nextjs-app/AGENTS.md`](./nextjs-app/AGENTS.md)의 규칙을 따른다.

## Intent 기반 작업 흐름 (intent/spec/plan)

- 사소한 오타·문구 수정을 제외한 작업은 시작 전에 [intent 운영 규칙](./intent/README.md)을 반드시 읽고 따른다. 상세 절차·양식·승인·상태 규칙은 해당 문서에서 관리한다.
- 작업 인덱스에서 기능명·대상 경로로 관련 문서를 찾는다. 후보가 없거나 불명확하면 `intent/` 본문을 검색한다.
- 관련 폴더의 모든 문서와 승인 기록을 확인한다. 기존 작업이 없으면 운영 규칙에 따라 intent 초안부터 작성한다.
- 구현은 plan 승인 후 시작한다. 완료된 작업의 승인을 새 요구사항의 승인으로 취급하지 않는다.

## 커밋 작성 규칙

커밋 메시지는 다음 형식을 사용합니다.

```text
[$GIT_BRANCH_NAME][prefix]: title

- code update message
```

- `$GIT_BRANCH_NAME`: 현재 작업 중인 Git 브랜치 이름
- `prefix`: 변경 사항의 성격을 나타내는 접두사
- `title`: 변경 내용을 간결하게 요약한 제목
- `code update message`: 변경한 내용을 설명하는 본문

### Prefix 목록

| Prefix | 설명 |
| --- | --- |
| `feat` | 새로운 기능 추가 |
| `add` | 모듈 및 라이브러리 추가 |
| `fix` | 오류 및 오타 수정 |
| `docs` | 마크다운 및 문서 작업 |
| `refactor` | 코드 리팩토링 |
| `perf` | 성능 개선 |
| `test` | 테스트 코드 관련 작업 |
| `build` | 빌드 시스템 관련 작업 |
| `ci` | CI 관련 설정 작업 |
| `revert` | 이전 작업 취소 |

### 작성 예시

```text
[feature/login][feat]: 로그인 기능 추가

- 로그인 폼과 인증 요청 로직을 추가했습니다.
```

## 참고

- [루트 README.md](./README.md) — 저장소 구조와 Phase 개요
- [디자인 가이드](./DESIGN.md) — 디자인 가이드
- [`intent/README.md`](./intent/README.md) — intent/spec/plan 폴더 규칙과 기록별 기준

