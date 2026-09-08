Plan: 실습 5개의 실제 동작과 학습 절차 개선
Spec: ./spec.md
Author: Codex
Status: approved
Approval: 현재 대화에서 사용자 승인. https://github.com/Junyong34/nextjs-ko-study-lab/pull/5 (머지 시 구현 진입 효력 발생)

## Scope of change

아래 경로는 저장소 루트 기준이다. 새 파일 이름은 구현 단위를 명확히 하기 위한 계획이며 실제 생성 후 이 목록을 맞춘다. 단일 파일은 250줄 이하로 유지하고 page는 고수준 조립에 집중한다.

| 대상 | 변경·추가 파일 | 목적 |
|---|---|---|
| Form | `nextjs-app/apps/demo-baseline/src/app/zone/baseline/components/form-component/page.tsx`, `layout.tsx`(추가), `components/FormSearchClient.tsx`, `components/VerificationFooter.tsx`, `components/SearchLayoutState.tsx`(추가) | 실제 Form·서버 검색, 공유 상태 관측, URL과 결과 연결 |
| 병렬 라우트 | `nextjs-app/apps/demo-baseline/src/app/zone/baseline/file-conventions/parallel-routes/layout.tsx`, `page.tsx`, `default.tsx`(추가), `@analytics/details/page.tsx`(추가), `@analytics/page.tsx`, `@analytics/default.tsx`, `@team/page.tsx`, `@team/default.tsx`, `components/VerificationFooter.tsx`, `components/TeamNote.tsx`(추가), `components/ParallelPracticeFrame.tsx`(추가) | 실제 슬롯 이동, 상태 유지, 기본 화면, 하위 예제와 실습 프레임 분리 |
| 접근성 | `nextjs-app/apps/demo-baseline/src/app/zone/baseline/architecture/accessibility/form-aria-support/page.tsx`, `components/ArchA11yFormDemo.tsx`, `card-format.ts`(추가) | 입력 형식과 DOM 연결 검증, 사례·초기화 |
| CSRF | `nextjs-app/apps/demo-baseline/src/app/zone/baseline/architecture/server-action-security/csrf-protection/page.tsx`, `actions.ts`, `types.ts`, `components/ArchServerActionCsrfDemo.tsx`, `components/LocalCsrfGuide.tsx`(추가) | 정상 요청 관측, 액션 도달 기록, 실제 차단 실습 안내 |
| Turbopack | `nextjs-app/apps/demo-baseline/src/app/zone/baseline/architecture/turbopack/incremental-harness/page.tsx`, `components/ArchTurbopackHmrDemo.tsx`, `components/LocalRefreshGuide.tsx`(추가) | hydration 수정, 비교 시작·관측·초기화, 프로덕션 안내 |
| 운영 | `nextjs-app/apps/AGENTS.md`, `nextjs-app/docs/09-demo-status-and-stepwise-release-guide.md`, `nextjs-app/packages/demos/demos.yaml`, `nextjs-app/packages/demos/demos-manifest.json`(생성) | iframe 내부 URL 예외, 실행 환경·검증 기록, 등록 설명 동기화 |
| 검사 | `nextjs-app/packages/test-suite/src/tier1-feature-coverage/23-architecture-demo-authenticity.test.ts`, `24-demo-learning-fidelity.test.ts`(추가) | 기존 소스 계약 갱신, 초과·문자 입력 회귀 검사 |
| 작업 기록 | `intent/demo-learning-fidelity/intent.md`, `spec.md`, `plan.md`, `verification.md`(추가), `intent/README.md` | 승인·범위·실제 검증 결과 기록 |

`hmr-marker.ts`는 검증 때만 잠깐 수정하고 원문으로 복원한다. 공통 ExpectedActualPanel API, baseline의 allowedOrigins, 패키지 버전은 변경하지 않는다. 연관 학습 문서의 문구가 등록 설명과 충돌하면 해당 부분만 확인해 계획에 경로를 추가한다.

## Steps

1. 승인 기록을 정리한다. 현재 대화의 spec 승인과 plan 검토 대기를 구분하고, 저장소 규칙에 따른 앞 단계 PR 머지와 plan 승인을 확인한 후 구현을 시작한다. 브랜치는 저장소가 정한 단계별 이름을 사용한다. 명시적 절차 예외가 없다면 로컬 대화 승인을 PR 머지로 기록하지 않는다.
2. 구현 전 작업 트리와 실행 중 서버를 확인한다. 필요한 하위 AGENTS와 공식 번들 문서, 프런트엔드 관련 스킬을 읽는다. 기존 서버·사용자 수정은 덮어쓰지 않는다. baseline 3001·shell 3000을 기준으로 현재 오류를 기록한다.
3. Turbopack의 최초 렌더 불일치를 먼저 고친다. 브라우저 관측 전에는 준비 상태를 사용하고 실제 비교 시작·marker 갱신·카운터 유지·초기화를 연결한다. 개발·프로덕션 안내를 나눈다.
4. Form을 실제 next/form으로 바꾼다. 서버에서 입력을 정규화하고 필터링한다. 공유 레이아웃 상태와 iframe URL을 검증값에 연결한다. 검색 0건을 실패로 처리하지 않는다.
5. 병렬 라우트에 analytics 상세 경로와 children 기본 화면을 만든다. team에 실제 입력을 두고 Link 이동과 iframe 새로고침의 차이를 관측한다. 프레임에서 정확한 대상 경로만 감싸 하위 예제의 가이드 중복을 방지한다. URL 분기는 가이드 범위에만 쓰고 실제 슬롯 전환을 흉내 내지 않는다.
6. 접근성 형식 검사를 분리하고 숫자를 자르는 로직을 제거한다. ARIA 대상 ID·설명·label을 실제 DOM에서 읽는다. 입력 예시, 첫 제출 후 수정, 초기화를 안내와 맞춘다.
7. CSRF 정상 액션은 헤더와 실행 결과만 반환한다. 관측용 로그는 현재 데모의 요청 구분값만 남기며 쿠키나 인증 헤더를 출력하지 않는다. 로컬 정상 요청을 확보하고 Origin만 변경해 실제 차단을 재현한다. 가이드는 개발자 도구의 Copy as cURL로 복사한 요청을 로컬 터미널에서 실행하도록 명시한다. 브라우저 JavaScript에서 Origin을 임의 설정하는 방식은 쓰지 않는다.
8. 대상 페이지 문구와 등록 설명을 다듬고 규칙·운영 문서를 동기화한다. 로컬 전용 단계를 실행 완료로 보이게 하지 않는다. manifest는 생성 명령으로 갱신한다.
9. 아래 검증을 수행하고 verification.md에 실제 결과와 미검증 범위를 남긴다. 수정한 경로 밖의 기존 오류는 구분한다. 실패한 완료 기준은 수정 후 재검증하며, 통과한 검사를 이유 없이 반복하지 않는다.
10. 변경 파일·가이드·검증 증거를 대조한다. 구현 완료를 보고하되 구현 PR 머지 전에는 작업 상태를 done으로 올리지 않는다.

## Verification

### 자동 검사

모든 명령은 저장소 루트에서 실행한다. 실제 명령·종료 코드·실패 원인은 verification.md에 남긴다.

| 명령 | 연결 기준 | 통과 조건 |
|---|---|---|
| `pnpm --filter @study/demos lint` | Q2·Q3 | 등록·문서·라우트 연결 오류 없음. 경고는 영향 확인 |
| `pnpm --filter @study/demos build` | Q3 | manifest 생성 성공, 대상 외 의도하지 않은 변경 없음 |
| `pnpm test:manifest` | Q3 | 매니페스트 일관성 통과 |
| `pnpm test:guide` | Q2·Q3 | 가이드 검사 통과. 기존 실패가 있으면 대상 변경과 분리 |
| `pnpm test:no-static-matched` | Q2·Q3 | 고정 성공 판정 검사 통과 |
| `pnpm --filter @study/demo-baseline check-types` | Q3 | 타입 오류 없음 |
| `pnpm --filter @study/shell check-types` | Q3 | 타입 오류 없음 |
| `pnpm test:tier1` | A1·Q3 | 관련 계약과 새 입력 회귀 검사 통과. 기존 실패는 분리 |
| `pnpm --filter @study/demo-baseline build` | T2·Q3 | 프로덕션 빌드 성공 |
| `pnpm --filter @study/shell build` | Q3 | 셸 빌드 성공 |
| `git diff --check` | Q3 | 공백 오류 없음 |

새 테스트는 입력 유효성의 경계값처럼 회귀 위험이 있는 동작을 검사한다. 소스에 특정 문자열이 있다는 사실을 기능 동작 증거로 추가하지 않는다. 브라우저 테스트는 사용 가능한 Playwright 도구로 수행하고 실제 관측 결과를 기록한다. 새 테스트 프레임워크 설치는 전제로 삼지 않는다.

### 브라우저 및 로컬 실행

- F1·F2: 셸의 Form 페이지에서 공유 상태를 바꾸고 일치·빈 검색·공백·없는 검색어를 제출한다. iframe URL, 서버 검색어, 목록 수를 대조한다. 제출 후 상태 유지와 iframe 새로고침 후 초기화를 비교하고 셸 URL 불변을 확인한다.
- P1·P2: team에 문구를 입력한 뒤 analytics 상세로 이동한다. team 입력과 슬롯 선택값을 확인한다. iframe을 새로고침해 team·children 기본 화면을 확인하고 처음으로 돌아간다. 상세 URL 직접 진입도 확인한다.
- P3: 기존 independent-tabs와 conditional-slot을 열어 부모 변경으로 인한 중복 가이드·404·레이아웃 이상을 확인한다.
- A1·A2: 빈 값, 15자리, 16자리, 17자리, 16자리+문자, 공백·하이픈 포함을 확인한다. DOM 속성과 설명 문구·label을 읽어 판정과 대조한다. 오류 수정·초기화·키보드 조작을 확인한다. 스크린 리더 미사용 시 그 범위는 검증 제외로 명시한다.
- C1·C2: baseline 직접 요청과 셸 경유 요청을 각각 정상 실행한다. 로컬 서버에 전송한 유효한 POST를 복사하고 Origin만 `https://csrf-demo.invalid`로 변경해 로컬 대상에 재전송한다. 프레임워크 차단 로그와 응답, 액션 도달 로그 부재를 함께 확인한다. 이 주소는 헤더 값이며 해당 도메인으로 요청하지 않는다. 정상 요청을 다시 보내 복구를 확인한다. 실패 시 기대한 차단인지 다른 오류인지 구분한다.
- T1: 개발 서버에서 카운터를 올리고 비교를 시작한다. marker 파일 원문을 보관하고 문구를 수정·저장한다. 실제 문구 변경과 카운터 유지가 표시되는지 확인한다. 편집 전 성공이 아닌지도 확인한다. 마지막에 원문을 복원한다.
- T2: iframe 새로고침·초기화로 상태와 관측 기록이 초기화되는지 확인한다. 빌드 후 기존 개발 서버와 산출물이 충돌하지 않는 별도 임시 작업 디렉토리에서 프로덕션을 실행해 로컬 단계 실행 불가 안내를 확인한다. 기존 서버를 임의로 종료하지 않는다.
- Q1·Q2: 5개 페이지에서 새 브라우저 세션으로 첫 렌더와 가이드 전 단계를 확인한다. 콘솔·서버 진단에서 hydration 오류가 사라졌는지 확인한다. 의도한 CSRF 차단 기록과 예상 밖 오류를 분리한다. 좁은 화면에서 버튼·긴 경로·검증값이 잘리지 않는지 확인한다.

### 문구·검토

korean-humanizer 기준으로 번역체, 과장, 불필요한 영어 병기, 줄표를 검사한다. 기존 사실을 보존하는 윤문과 잘못된 설명의 교체를 구분한다. 화면을 읽지 않고 소스만 보고 자연스럽다고 판정하지 않는다.

기대값이 실제값과 같은 React 상태에서 계산됐다는 이유만으로 성공하는지, 환경값만으로 기능 완료를 선언하는지, 초기화 후 이전 결과가 남는지 반례를 점검한다. 모든 성공 표시는 무엇을 관측했는지 추적할 수 있어야 한다.

## Rollback

- 단위별 변경을 분리해 원인 페이지와 등록·설명 변경을 함께 되돌릴 수 있게 한다. 사용자 변경은 포함하지 않는다.
- 검증용 marker 편집은 테스트 종료 시 원문과 대조해 복원한다. 전체 파일 초기화나 작업 트리 일괄 삭제로 되돌리지 않는다.
- 빌드 실패가 기존 환경 제약이면 실패 로그와 미검증 항목을 남긴다. 가짜 결과·검증 생략으로 공개 완료를 유지하지 않는다.
- 기존 URL을 유지하므로 별도 삭제 URL 복구는 필요 없다. 운영상 비공개 전환이 필요해지면 그 변경을 별도로 검토한다.

## Verification results

- 현재 상태: 계획 작성만 완료. 위 자동·브라우저 검증은 아직 미실행.
- 사전 진단: 이전 spec 조사에서 baseline 포트 3001의 기존 브라우저 세션에 Turbopack SSR 값 차이로 hydration 오류가 기록돼 있었다. 구현 후 새 세션에서 재검증한다.
- 문서 검증: git diff --check를 실행하고 결과를 확인한다.
- 승인 PR·머지 기록: 없음. 대화상 방향 승인과 공식 단계 진입을 구분한다.
