Plan: 시뮬레이션 상태 stub 실습 10개 실동작 재구성
Status: done
Approval: 2026-09-29 대화 승인(intent.md와 동일 대화). 같은 날 사용자 지시로 `done` 전환 범위를 claude 지정 4개(#7~#10)로 한정했다.

## 진행 기록

### 실행 방식과 변경점

- 사용자 지시는 codex 6 + claude 4였다. codex 워커 6개는 Orca `agent_readiness` 단계에서 `timeout`(`session_not_reported`)으로 반복 실패했다. 240초 대기와 기존 터미널 재사용으로도 재현돼 재시도를 멈췄고, 사용자 승인(2026-09-29)을 받아 #1~#6도 claude 워커로 대체했다. 결과적으로 10개 모두 claude 워커가 수행했다.
- 워커는 모두 같은 main 워크트리에서 동시에 작업했다. 워커 종료 후 확인한 변경 105건은 전부 각자 지정 디렉토리 안이고, 공유 파일(`next.config.ts`, `proxy.ts`, `.env`, 공유 패키지) 변경과 250줄 초과 파일은 없다. escalation은 없었다.

- **`done` 전환 범위 (사용자 지시, 2026-09-29~30)**: codex 지정이던 #1~#6은 codex가 시작되지 않아 claude가 먼저 구현했고, 사용자 지시로 `stub`으로 되돌렸다. 이후 codex 6개가 각자 데모를 검토·보강(아래 '2차 codex 검토')하고 코디네이터가 재검증한 뒤 10개 모두 `done`으로 전환했다.

### 항목별 결과

| # | 대상 | 판정 | 검증 요약 |
|---|---|---|---|
| 1 | `guides/caching-legacy/fetch-cache` | REBUILD | 원본 route의 `sourceCount`로 force-cache 고정·no-store 증가·revalidate 10초·태그 무효화를 브라우저에서 확인, 다른 세션 무효화로 불일치 유도 |
| 2 | `guides/environment-variables/runtime-env` | REBUILD | `connection()` 뒤 `process.env` 읽기, 성공(`NEXT_PUBLIC_*` 같다)과 실패(서버 전용 값 같다) 예측 판정을 브라우저에서 확인 |
| 3 | `file-conventions/default/parallel-fallback` | REBUILD | 실제 `@cart`/`@promo`와 `default.tsx`, `strict/` 하위 트리의 `notFound()` 폴백. 소프트/하드 로드 차이와 `default.tsx`를 임시로 null 반환으로 바꿔 불일치를 유도한 뒤 원복 |
| 4 | `file-conventions/parallel-routes/conditional-slot` | REBUILD | 쿠키 `demo_role`로 layout이 슬롯 선택. 쿠키만 admin으로 위조해 불일치를 유도. 미선택 슬롯도 RSC payload에 실림(공식 문서와 일치)을 curl로 확인 |
| 5 | `file-conventions/parallel-routes/independent-tabs` | REBUILD | 실제 `@dashboard`/`@metrics` 슬롯. `Link` 이동은 다른 슬롯 상태 유지, 일반 `<a>` 이동은 초기화(불일치)를 브라우저에서 확인 |
| 6 | `guides/i18n/subpath-routing` | REBUILD | 실제 `[lang]` 세그먼트. 코디네이터가 브라우저로 성공, `/en` 500 강제 시 불일치, 초기화를 확인. 이때 초기 배지가 '불일치'로 뜨는 버그를 찾아 수정 |
| 7 | `guides/data-security/react-taint-api` | REBUILD | `experimental.taint`는 기존 설정으로 이미 켜져 있음. 객체·값 taint 차단과 파생 문자열의 유출 한계를 브라우저에서 확인 |
| 8 | `guides/auth-cache-components/private-cache-user` | REBUILD | `'use cache: private'` + `cookies()`. 사용자 A/B 격리, 쿠키 변조 불일치, 초기화를 브라우저와 curl로 확인 |
| 9 | `edge/v8-lightweight/nodejs-modules-bailout` | REBUILD | `node`/`edge` Route Handler 2개. 코디네이터가 브라우저로 성공, 없는 파일 불일치, 초기화, 콘솔 오류 없음을 확인 |
| 10 | `guides/analytics/custom-beacon` | REBUILD | 수신 `route.ts`와 실제 `sendBeacon`. 정상 전송은 서버 목록에 도착, 잘못된 엔드포인트는 반환값 true인데 서버에 없음(불일치)을 브라우저에서 확인 |

### 코디네이터 통합 검증

- `pnpm --filter demo-baseline check-types` 0건, `pnpm --filter demo-cache-components check-types` 0건. 첫 실행 때 baseline의 `.next/types/validator.ts` 10건은 과거 dev가 남긴 생성 타입 오류였고, 빌드가 재생성한 뒤 사라졌다.
- `pnpm --filter demo-baseline build`, `pnpm --filter demo-cache-components build` 통과. 새 라우트가 모두 산출물에 포함됐고, baseline의 유일한 경고는 예상된 `The Edge Runtime is deprecated`다.
- `pnpm --filter @study/demos lint`(기존 `[캐시 태그 규칙]` 경고 16건은 이번 10개와 무관) 통과, `pnpm --filter @study/demos build`로 매니페스트 242개 재생성, 10개 모두 `done`.
- `demos.yaml`은 10개 모두 `done`이다(stub 잔여 44개). 매니페스트 242개 재생성. 참고: `fetch-cache` 제목이 실제 내용과 어긋난다(Route Segment revalidate는 `segment-revalidate` 담당)는 점은 #1 재개 시 정정 후보로 남긴다.

### 검증 중 발견한 버그

- `subpath-routing`: `isMatched`가 `undefined`(대기)일 때 공용 `ExpectedActualPanel`이 `expected`/`actual` 문자열 두 개를 자동 비교해 조작 전에 '불일치'를 표시했다. 워커 보고는 '대기 중'이라고 했지만 브라우저에서 실제 확인한 결과와 달랐다. 다른 워커들이 쓴 방식대로 `<span>`으로 감싸 고쳤다(데모 자체 파일만 수정).

### 2차 codex 검토 (2026-09-30, #1~#6)

codex 6개가 기존 구현을 검토했다. 판정과 수정: #1 IMPROVE(`page.tsx` 안내 문구), #2 KEEP, #3 IMPROVE(`judge.ts`·`types.ts`·`useSlotObservation.ts`·`PracticeFrame.tsx`, `judge.test.mjs` 신규 — 하드 로드 후 소프트 이동을 오판하던 검증 수정), #4 IMPROVE(`@admin`·`@user` metadata 제거로 탭 제목 고정, `ADMIN ONLY`→`ADMIN VIEW`), #5 KEEP, #6 IMPROVE(제목 검증이 3개 언어 제목 모두 존재할 때만 통과). 코디네이터가 수정 시각으로 변경 파일을 대조해 보고와 일치함을 확인했고, `judge.test.mjs` 2건·`check-types` 0건·baseline 빌드 통과, 6개 모두 브라우저에서 초기 '대기 중'·성공·불일치·초기화·콘솔 오류 없음을 직접 확인했다(`fetch-cache`는 성공·초기화만 직접 확인, 태그 무효화·10초 만료는 codex 보고에 의존). 미확인: 프로덕션·배포 환경, 셸 iframe 경유 화면. 앱에 lint 스크립트가 없어 ESLint는 실행하지 못했다. `fetch-cache`의 `demos.yaml` 제목(`Next.js 14 … Route Segment revalidate`)은 실제 내용과 어긋나며 사용자 결정 대기다.

### 남은 문제 (검증하지 못한 항목)

- 워커의 브라우저 검증은 `agent-browser`로 했다. Claude in Chrome 확장은 연결되지 않아 사용하지 못했다.
- `next start`나 실제 배포(Preview 포함) 환경의 동작은 확인하지 못했다. `fetch-cache`의 Data Cache, `runtime-env`의 빌드 시점 값 고정 관찰, `custom-beacon`의 서버리스 메모리 한계는 dev 서버 기준이다.
- ESLint는 데모 앱 단위로 실행하지 않았다(`@study/demos` 린트만 실행).
- `private-cache-user`의 브라우저 메모리 캐시 재사용(`stale: 60`, 뒤로 가기)은 관찰하지 못했다. 화면의 `bodyRuns`는 dev의 중복 렌더로 실제 요청 수보다 클 수 있어 증가 여부만 근거로 쓴다.
- `custom-beacon`의 페이지 이탈(unload) 전송 시나리오와 서버 터미널 로그 확인은 하지 못했다. `subpath-routing`의 Accept-Language 리다이렉트는 `proxy.ts` 변경이 필요해 범위에서 제외하고 개념 카드에 명시했다.
- Orca 정리: `private-cache-user` 워커 터미널은 사용자 조작 감지(`user_takeover`)로 retained 상태이고, 실패한 codex 시도 4건은 `unverifiable`로 남아 있다. 종료 근거가 없어 건드리지 않았다.

## Steps

1. 코디네이터가 Orca Run을 만들고 워커 10개를 한 번에 시작한다. 구성은 codex 6개(#1~#6)와 claude 4개(#7~#10)다.
2. 각 워커는 `.claude/skills/practice-page-refiner/SKILL.md` 절차 전체(Step 1~9)를 따른다. 자기 데모 디렉토리만 수정하고, 판정과 근거를 담은 3문장 요약으로 `worker_done`을 보낸다.
3. 코디네이터는 워커 보고를 받아 각 항목의 변경 파일과 판정을 독립적으로 확인한다.
4. 코디네이터가 통합 검증을 한 번 실행한다.
   - `pnpm --filter demo-baseline check-types`, `pnpm --filter demo-cache-components check-types`
   - `pnpm --filter demo-baseline build`, `pnpm --filter demo-cache-components build`
   - `pnpm --filter @study/demos lint && pnpm --filter @study/demos build`(매니페스트 재생성)
5. 검증을 통과한 항목만 `demos.yaml`을 `stub → done`으로 바꾸고 매니페스트를 재생성한다.
6. 이 문서와 `intent.md`를 `done`으로 전환하고 `intent/README.md` 인덱스를 갱신한다. 검증하지 못한 항목이 있으면 `approved`로 유지하고 사유를 남긴다.

## Verification

- 워커별: `check-types` 통과(자기 디렉토리 기준), 실행 중인 dev 서버(3001/3002)에서 가이드가 요구하는 조작을 실제로 수행한 관찰 결과.
- 통합: 위 Step 4의 명령 전체 통과.
- 완료 처리: 검증하지 못한 항목은 `done`으로 올리지 않고 사유를 기록한다.
