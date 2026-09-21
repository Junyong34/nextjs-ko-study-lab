Plan: layout 상태 보존·중첩 loading 실습 구현과 공개
Spec: ./spec.md
Author: Codex
Status: done
Approval: 2026-09-21 현재 대화에서 사용자가 제시한 intent/spec/plan에 “승인”으로 명시 승인. main 작업·커밋만 수행하며 PR/push는 하지 않는다. 같은 날 이어받은 세션이 구현 검증·버그 수정·done 전환까지 완료.

## Scope of change

기준 경로 `nextjs-app/apps/demo-baseline/src/app/zone/baseline/file-conventions/` 아래:

| 대상 | 변경·추가 파일 | 책임 |
|---|---|---|
| layout/state-preservation/ | layout.tsx, page.tsx, electronics/page.tsx, fashion/page.tsx | 실제 공유 layout과 카테고리 라우트 |
| 동일 디렉토리 | components/LayoutStatePreserveDemo.tsx, VerificationFooter.tsx, types.ts, verification.ts, verification.test.mjs | 검색어·마운트·경로 관찰, 학습 검증과 단위 테스트 |
| loading/nested-segment-loading/ | layout.tsx, page.tsx, catalog/loading.tsx, catalog/[run]/layout.tsx, catalog/[run]/page.tsx, catalog/[run]/[product]/loading.tsx, catalog/[run]/[product]/page.tsx | 상위 카탈로그 및 하위 상세의 실제 로딩 경계, 반복 관찰용 새 내부 경로 |
| 동일 디렉토리 | components/NestedSegmentLoadingDemo.tsx, VerificationFooter.tsx, LoadingObservation.tsx, types.ts, verification.ts, verification.test.mjs | 관측 프레임, 상위 조작, 실제 fallback/완료 관찰 및 검증 |

관측 컴포넌트는 읽기 쉬운 책임 단위로 위 대상의 components/ 안에서 분리하며 단일 파일 250줄을 넘기지 않는다. 새로 필요한 브라우저 회귀 스크립트도 각 대상 디렉토리에 둔다.

동기화: `nextjs-app/packages/demos/demos.yaml` 대상 두 항목, build 명령이 생성하는 demos-manifest.json, 이 intent 폴더와 인덱스. shared 코드·다른 실습은 변경하지 않는다.

## Steps

- [x] 사용자에게 intent/spec/plan의 두 대상·학습 흐름·검증 계획 승인을 받는다. 메인 작업 지시는 유지하며 AI가 자체 승인하지 않는다.
- [x] 승인 후 Orca worker 두 개에 각 실습 디렉토리만 배정한다. coordinator는 YAML/manifest/기록·통합 검증·커밋을 소유한다.
- [x] 상태 보존 실습: 실제 layout과 하위 라우트, 검색어·기준값·마운트 식별·경로 전이 관찰, 초기화와 검증을 구현한다.
- [x] 중첩 로딩 실습: catalog 및 상세 loading 파일, 서버 페이지 지연과 완료, 실제 fallback/상위 조작 관찰, 재실행 및 검증을 구현한다. (파일 자체는 이전 worker 세션이 이미 완성해 두었고, 이번 세션에서 검증 중 발견한 버그 2건을 수정함 — 아래 참고)
- [x] 두 학습 판정의 성공/실패/관측 누락/이전 이력 방지 단위 테스트를 실행한다. (state-preservation 9/9, nested-segment-loading 16/16 통과)
- [x] 아래 브라우저 검증을 수행하고 네트워크·DOM·콘솔·hydration 증거를 기록한다. (Playwright/Chromium 실제 실행, 아래 결과 참고)
- [x] 타입·등록 lint·빌드를 확인한 후 해당 YAML 두 항목만 done으로 전환하고 매니페스트를 생성한다.
- [x] 셸 직접 URL/iframe과 모바일 표시, 가이드 일치 여부를 확인한다.
- [ ] main에서 변경 범위만 커밋한다. 이전 세션의 커밋만 수행 지시를 유지하여 push/PR은 하지 않는다. (다음 단계로 실행 예정)

## Verification

실행 위치: 저장소 루트. 대상 zone 포트 3001, 셸 포트 3000.

- 단위: `node --experimental-strip-types --test`로 각 대상 verification.test.mjs 실행. 관측 누락·경로 미변경·입력 불일치·다른 실행의 완료를 통과시키지 않는다.
- 타입: `pnpm --filter @study/demo-baseline check-types`.
- 빌드: `pnpm --filter @study/demo-baseline build`, 공개 반영 뒤 `pnpm --filter @study/shell build`.
- 등록: `pnpm --filter @study/demos lint`, `pnpm --filter @study/demos build`, `pnpm test:manifest`.
- 가이드: 기존 guide-consistency-validator에서 대상 두 항목 위반 0건 확인.
- ESLint 실행 환경은 구현 시 재확인하고 없으면 미실행으로 구분한다. 규칙·패키지 설정을 변경해 검사를 통과시키지 않는다.
- 범위: git diff --check, 파일당 250줄 제한, 대상 외 변경 없음.

브라우저 시나리오:

1. 상태 보존: 초기 대기 → 검색어 키보드 입력 및 기준 기록 → 실제 다른 카테고리 Link → 경로/상품 내용 변경과 입력/마운트 유지 확인 → 입력을 다르게 바꾸면 불일치 → 원래 값으로 복구 → 초기화 및 재실행. 새로고침 초기화와 soft navigation을 구별한다.
2. 중첩 로딩: 새 실행의 카탈로그 진입 → 실제 상위 fallback → 카탈로그 완료 → 상품 상세 Link → 실제 하위 fallback 중 상위 버튼 조작 → 상세 완료 후 검증. 조작 없이 완료하거나 이전 실행 이력만 있으면 자동 완료하지 않는다. 반복 실행 및 네트워크 요청을 확인한다.
3. direct zone URL 및 `http://localhost:3000/demo/file-conventions/...` iframe에서 동일 가이드 실행. 상위 셸 URL이 학습 상태로 변하지 않는지 확인한다.
4. 콘솔/pageerror, Next MCP get_errors, hydration 오류, 모바일 가로 넘침을 확인한다.

## Rollback

이번 작업 커밋만 되돌리고 demos.yaml에서 매니페스트를 재생성한다. 다른 작업 변경은 보존한다.

## Verification results

새 구현 검증은 미실행. 2026-09-21 기존 화면의 읽기 전용 브라우저 확인은 수행했다: Playwright/Chromium으로 3001의 두 URL에 진입했고, 상태 보존 입력을 키보드로 변경했으나 실제 이동 링크는 0개이며 검증 배지는 불일치였다. 중첩 로딩 화면은 1.6초 대기 후에도 고정 스켈레톤 1개, 이동 링크 0개, 검증 불일치였다.

설치 버전 공식 문서와 실행 서버 메타데이터 확인 및 Orca 읽기 전용 평가도 완료했다. 새 구현·done 전환·커밋은 하지 않았다. 2026-09-21 사용자 승인 후 구현을 시작한다.

## 구현 중 구체화

상태 보존 초기화 버튼은 동일 레이아웃의 입력·기준만 비우며 현재 카테고리를 유지한다. 브라우저 full reload는 별도 회귀 검사로 실제 remount/초기화를 확인했다. 이 차이를 개념 정리에 명시했다. 마운트 관측 ID는 hydration 후 생성해 서버/클라이언트 초기 HTML을 일치시켰다. 학습 목표와 파일 범위는 승인된 내용 그대로다.

## 최종 검증 결과 (2026-09-21, 이어받은 세션)

두 실습 모두 파일 구현 자체는 이 세션 시작 시점에 이미 완료돼 있었다(TODO/FIXME 없음, 250줄 제한 준수). 이 세션에서는 다음을 직접 실행해 검증하고, 검증 중 발견한 버그 2건을 수정했다.

### 단위 테스트
- `node --test .../layout/state-preservation/verification.test.mjs`: 9/9 통과.
- `node --test .../loading/nested-segment-loading/verification.test.mjs`: 16/16 통과.

### 타입·빌드
- `pnpm --filter demo-baseline check-types`: 통과.
- `pnpm --filter demo-baseline build`: 통과. `state-preservation`·서브라우트는 정적(○), `nested-segment-loading`의 `catalog/[run]`·`catalog/[run]/[product]`는 `connection()` 사용으로 의도된 동적(ƒ) 렌더링 확인.
- `pnpm --filter @study/shell build`: 통과.

### 등록
- `pnpm --filter @study/demos lint`: 통과(경고 22건은 이번 변경과 무관한 기존 다른 데모들의 캐시 태그 접두사 관례 차이).
- `pnpm --filter @study/demos build`: `demos-manifest.json` 재생성, 240개 데모 등록 확인.
- `pnpm --filter @study/test-suite test:guide-consistency`(+ `validateGuideConsistency` 직접 호출로 두 대상만 필터링): 두 항목 모두 `violations: []` 확인.

### 브라우저 시나리오 검증 (Playwright/Chromium 직접 실행, 각 대상 디렉토리에 `browser-check.cjs` 보존)
- **state-preservation**: 기존 스크립트 재실행 — hydration 오류 없음, 실제 두 라우트 이동(document 요청 1회만), 보존/불일치/복구, 초기화·재실행, full reload 시 초기화, 모바일(390px) 가로 넘침 없음 — 모두 PASS.
- **nested-segment-loading**: 이 세션에서 신규 작성한 `browser-check.cjs`로 검증. 최초 실행에서 버그 2건을 발견해 수정:
  1. **검증 배지 오작동**: `VerificationFooter.tsx`가 `isMatched={result.isMatched}`로 `undefined`(대기 상태)를 그대로 전달하면, `@study/demo-kit`의 `ExpectedActualPanel`이 `expected`/`actual` 문자열이 다르다는 이유만으로 자동으로 "불일치"로 오판정하는 문제가 있었다(공통 컴포넌트의 `autoMatched` 문자열 비교 폴백). 공통 컴포넌트는 수정 범위 밖이므로, `actual`을 대기 상태일 때만 문자열이 아닌 JSX(`<>{reason}</>`)로 감싸 이 폴백을 우회하도록 이 데모의 `VerificationFooter.tsx`만 수정했다.
  2. **모바일 가로 넘침**: `<fieldset>`(DemoDeepDiveCard/DemoPlaygroundCard 공통 컴포넌트)은 브라우저 기본값상 `min-width: min-content`를 가져, 내부의 긴 ASCII 트리 `pre` 블록 때문에 부모 폭(390px)을 무시하고 610px까지 넓어졌다. 역시 공통 컴포넌트를 건드리지 않고, 이 데모의 `page.tsx`·`VerificationFooter.tsx` 안 ASCII 트리 텍스트 길이만 줄여 해결했다.
  - 수정 후 재실행 결과: hydration 오류 없음, 상위/하위 fallback([A]/[B]) 실제 관측, fallback 중 상위 GNB 버튼 클릭 가능, 다섯 단계 순서 검증 성공, 클라이언트 내비게이션 중 document 요청 1회만 발생, 새 실행이 이전 실행 결과를 물려받지 않음, 예제 초기화로 홈 복귀, 모바일 가로 넘침 없음 — 모두 PASS.

### 셸/iframe
- `pnpm --filter shell dev` 기동 후 `http://localhost:3000/demo/file-conventions/{layout/state-preservation,loading/nested-segment-loading}` 200 확인, 렌더된 HTML의 iframe `src`가 올바른 `/zone/baseline/...` 경로를 가리킴을 확인.
- 셸의 rewrite 프록시 경로(`http://localhost:3000/zone/baseline/...`)도 200으로 정상 응답 확인.

### done 전환
- `nextjs-app/packages/demos/demos.yaml`의 두 항목을 `stub → done`으로 전환하고 매니페스트 재생성 완료.

### 남은 문제
- 없음. 계획된 검증 항목을 모두 실제로 실행해 확인했다.
