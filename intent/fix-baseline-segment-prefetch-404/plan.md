Plan: baseline segment prefetch 404 수정 및 배포 검증
Spec: ./intent.md#requirements
Author: Codex
Status: done
Approval: 2026-10-01 현재 대화의 “구현 검증”, “메인에 머지해줘”, “메인에서 진행”으로 로컬 구현·main 반영·push·Production 검증을 승인했다. PR 없이 main에 직접 반영했고 Production 완료 기준을 충족했다.

## Objective and authority

실제 배포된 셸을 거친 baseline `<Link>` prefetch가 올바른 RSC 응답을 받고 실습 로그의 prefetch 404가 사라지는 것이 목표다. 통합 intent의 요구사항과 완료 기준을 변경하지 않는다.

2026-10-01 사용자의 “승인”은 통합 intent에 대한 승인이다. 이 plan의 승인은 로컬 구현·검증을 진행하는 근거로 삼으며, 커밋·push·Preview 배포·Production 반영은 각각 사용자 지시가 있을 때 수행한다. 요청되지 않은 PR 생성이나 외부 서비스 설정 변경을 포함하지 않는다.

근거: [통합 intent](./intent.md), [조사 기록](./investigation.md), [수정 전 증거](./evidence.json), `nextjs-app/docs/04-vercel-deployment-plan.md`.

## Scope of change

| 대상 | 변경 | 목적 |
|---|---|---|
| `nextjs-app/apps/shell/next.config.ts` | 수정 | zone 외부 rewrite를 `beforeFiles`로 이동 |
| `nextjs-app/apps/shell/scripts/check-zone-prefetch.mjs` | 추가 예정 | 실제 HTTP 응답을 확인하는 재사용 가능한 회귀 검증 |
| `nextjs-app/docs/04-vercel-deployment-plan.md` | 수정 | rewrite 순서와 segment prefetch 운영 검증 항목 기록 |
| `intent/fix-baseline-segment-prefetch-404/verification.md` | 추가 예정 | 환경·커밋·명령·실제 결과·한계 기록 |
| `intent/fix-baseline-segment-prefetch-404/verification-evidence.json` | 추가 예정 | 수정 후 필요한 요청·응답 필드 보존 |
| 이 폴더의 `intent.md`, `plan.md`, `investigation.md`와 `intent/README.md` | 동기화 | 승인·진행·검증 상태 반영 |

baseline/cache의 페이지, `proxy.ts`, `<Link>`, recorder, `cacheComponents`, Related Projects 및 환경변수 조회 로직은 변경 대상에서 제외한다. `config/*` 병행 변경과 기존 수정 전 `evidence.json`을 보존한다. 새 의존성이나 테스트 프레임워크를 추가하지 않는다.

## Decisions

1. zone rewrite만 `beforeFiles`로 이동한다. 원래 경로와 헤더를 소유 zone으로 먼저 전달해 중복 변환을 막는다. 사용자가 원인·미검증 한계를 확인한 뒤 승인한 통합 intent의 설계를 따른다. Proxy 제거·prefetch 비활성화·캐시 삭제는 현재 증거가 뒷받침하지 않는다.
2. `/demo-static/*` 자산 rewrite는 `afterFiles`에 유지한다. 자산 전송에는 이번 segment 변환 조건이 없으므로 수정 범위를 줄인다. `fallback`은 비워 둔다.
3. 회귀 검증은 실제 HTTP 요청으로 한다. 기존 객체 복사 테스트나 설정 문자열 검사만으로 Vercel의 동작을 검증했다고 판단하지 않는다. 수정 전에 기존 공개 배포의 실패를 스크립트로 기록하고 수정 후 같은 검사를 반복한다.
4. 로컬 통과와 배포 통과를 구분한다. 로컬에서는 수정 전에도 200이었으므로 Preview와 공개 서비스의 실측 없이 해결 완료로 기록하지 않는다.

## Steps

### U1. 실제 요청 회귀 검증 준비

대상: 추가 예정 `nextjs-app/apps/shell/scripts/check-zone-prefetch.mjs`. 요구사항 1·2·4·5와 완료 기준 1·2·4를 검증한다. 의존 단계 없음.

- 셸 origin과 접근 가능한 baseline 직접 origin을 필수 인자로 받는다. 조사에서 캡처한 정상 상품·목록·정적/동적 라우트와 정확한 헤더 조합을 사용한다. Next.js 16.3.2의 `_rsc` 계산과 대조하며 router tree를 임의로 만들지 않는다.
- segment prefetch, 일반 RSC, HTML navigation을 비교한다. 예상 200·`text/x-component`·올바른 `x-matched-path`를 확인하고, 로컬처럼 해당 헤더가 없는 환경에서는 RSC 본문으로 정상 대상을 확인한다. `shoes`처럼 HTTP 200이어도 전송 접미사가 params로 들어간 잘못된 트리는 실패 처리한다.
- 인증 리다이렉트, 네트워크 오류, HTML 404, 대상 불일치는 성공으로 처리하지 않는다. TLS 검증을 유지하고 환경의 인증서 문제는 검증 불가로 기록한다.
- 쿠키·인증 헤더 없이 필요한 요청·응답 필드만 출력한다. HTTP 오류 응답이 있으면 실패 종료해 배포 회귀 검사에 재사용할 수 있게 한다. 파일은 250줄 이내로 유지한다.

통과 기준: 기존 공개 셸의 재현 요청은 실패하고, 같은 요청의 baseline 직접 응답은 200으로 기록된다. 이는 재현 스크립트의 확인이며 수정 검증은 아니다.

### U2. 셸 rewrite 순서 수정과 로컬 확인

대상: `nextjs-app/apps/shell/next.config.ts`. U1 이후 진행하며 통합 intent의 Design과 완료 기준 1·2·4를 따른다.

- 구현 시작 직전에 HEAD·작업 트리·활성 서버를 확인하고 병행 변경을 구분한다. `devPark/fix-baseline-segment-prefetch-404` 브랜치의 격리된 체크아웃을 사용한다. 단계별 문서 승인 기록을 보존하며 코드 변경을 외부에 게시하지 않는다.
- `rewrites()`의 반환을 단계별 객체로 바꾸고 위 Decisions의 zone/자산 배치를 적용한다. URL 생성과 환경별 목적지는 기존 로직을 유지한다. 한국어 주석으로 순서의 이유를 설명한다.
- 셸 타입 검사·빌드를 실행한다. 새 manifest에 zone 두 규칙이 `beforeFiles`, 자산 두 규칙이 `afterFiles`로 등록되는지 확인한다. 경로·목적지·쿼리를 함께 비교한다.
- 로컬 production의 baseline 직접 요청과 셸 경유 요청에 U1 검사를 실행한다. 셸 페이지·iframe·자산과 Proxy 데모를 실제로 연다.

통과 기준: 로컬 RSC/navigation·자산·Proxy 동작에 회귀가 없고 manifest의 배치가 의도와 같다. 로컬 결과만으로 배포 404가 해결됐다고 기록하지 않는다.

### U3. 허가받은 배포 검증과 운영 기록

대상: Scope of change의 운영 문서와 검증 기록. U2 및 별도 배포 허가 이후 진행한다.

- Preview 배포 전에 배포할 셸 커밋, 연결될 baseline/cache 배포 URL·커밋, 허용 origin, 인증 접근 방법과 되돌리기 대상을 사용자에게 제시한다. `preview/*` push는 자동 배포를 유발할 수 있으므로 외부 작업 허가 없이 수행하지 않는다.
- 이 변경의 최소 배포 단위는 셸이다. zone 재배포나 환경변수 변경이 필요하면 이유와 대상까지 추가로 허가받는다. Related Projects가 예상 zone을 선택했는지 실제 빌드 목적지로 확인한다.
- Preview에서 U1 검사와 실제 Chrome 관측을 실행한다. 뷰포트 prefetch, hover, 클릭 이동, 다시 목록으로 이동하는 흐름을 확인한다. 실습 로그의 응답 상태와 Network 상태를 대조한다.
- 별도 Production 반영 허가 후 공개 도메인에서 같은 검증을 반복한다. Preview 통과를 공개 서비스의 해결로 바꿔 기록하지 않는다.
- 결과·실패·미검증을 `verification.md`에 기록하고 필요한 필드만 `verification-evidence.json`에 남긴다. 운영 문서에 적용된 rewrite 순서와 필수 검증을 반영한다.

## Verification

타입·빌드·스크립트 명령은 저장소 루트에서 실행한다. 아래는 검증 방법이며 실행 결과는 Verification results와 `verification.md`에 기록했다.

| 검증 | 명령 또는 방법 | 통과 조건 |
|---|---|---|
| 타입 | `pnpm --filter @study/shell check-types` | 변경에 따른 타입 오류 없음. 기존 오류면 수정 전 비교와 원인 별도 기록 |
| 빌드 | `pnpm exec turbo run build --filter=@study/shell` | 공유 패키지 포함 셸 빌드 성공, zone 목적지 정상, manifest 배치 확인 |
| 실제 HTTP | `node nextjs-app/apps/shell/scripts/check-zone-prefetch.mjs --shell-origin <검증할 셸 origin> --baseline-origin <접근 가능한 baseline origin>` | 정상 라우트 segment 요청 200·RSC·대상 일치, 일반 RSC·HTML navigation 정상 |
| 브라우저 | 별도 임시 Chrome 프로필, 실제 실습의 iframe Network 및 관측 로그 | 상품 1·2 prefetch에 404 없음, hover·click navigation 정상 |
| 자산·셸 | `/`, `/demo/guides/adopting-partial-prefetching`, 각 zone에서 실제 사용 중인 `/demo-static/*` JS/CSS | 200과 올바른 응답 종류, 문서·iframe·스타일·콘솔 정상 |
| Proxy | 기존 `/zone/baseline/functions/headers/user-agent-device`, `/zone/baseline/guides/authentication/middleware-guard`, `/zone/baseline/functions/next-response/rewrite-virtual` 실습 | 기존 헤더 주입·가드·rewrite 흐름 유지 |
| 기록·정리 | 변경 범위·문서 링크·민감 필드·임시물 확인 | 다른 작업 변경 없음, 검증 결과 분리, 생성한 서버·파일 정리 |

필수 HTTP 라우트:

- baseline: `…/guides/adopting-partial-prefetching/hover-shell`, 그 아래 `products/1`, `products/2`.
- baseline: `…/architecture/fast-refresh-boundary`, `…/file-conventions/dynamic-segments/single-param/items/1`.
- baseline: `…/file-conventions/layout/dynamic-category-layout/shoes`의 segment 응답은 category 트리여야 한다. item 트리의 200은 실패다. 코드 대조 결과 `shoes`는 유효 category가 아니므로 HTML 이동 검증은 `electronics`로 수행한다.
- cache: `/zone/cache/revalidating/time-based-isr`, `/zone/cache/guides/isr-cache-components/cache-life-hours`도 셸 경유 segment 응답을 확인한다.

실제 Chrome의 `/_tree` 요청은 `rsc: 1`, `next-router-prefetch: 1`, `next-router-segment-prefetch: /_tree`, 현재 iframe 경로의 `next-url`을 사용한다. 수정 전 상품 요청의 `_rsc`는 `YCuvbfS_CHCPmpKA`였다. 새 브라우저 요청의 헤더·해시가 달라지면 그 실제 값을 기록하며 이전 값을 무조건 고정하지 않는다.

## Rollback

- 로컬 검증이 실패하면 이 작업의 zone rewrite 변경만 되돌리고 원인을 조사한다. 사용자·다른 작업의 파일을 reset하거나 checkout 전체를 정리하지 않는다.
- Preview 실패 시 Production에는 반영하지 않는다. 실험한 셸 배포·zone 연결을 기록하고 마지막 정상 Preview 구성으로 되돌리는 작업도 사용자 허가 후 수행한다.
- Production 회귀 시 사전에 기록한 셸 배포로 되돌린다. 도메인 전환·배포 promote·환경변수 복구는 외부 변경이므로 허가 없이 실행하지 않는다. 기존 Production은 prefetch 실패 상태였다는 점도 함께 기록한다.
- 생성한 서버·브라우저만 종료한다. 작업에서 만든 별도 빌드·CDP·로그 파일만 제거하고 활성 런타임·기존 `.next`·병행 작업 산출물은 보존한다.

## Risks and deferred checks

- 배포 내부 rewrite trace와 정확한 어댑터 버전은 미확인이다. `beforeFiles` 변경 후에도 실패하면 다른 설정을 연쇄 수정하지 않고 요청·응답·빌드 목적지부터 다시 확인한다.
- Vercel 인증·Related Projects·Preview 조합은 로컬 구현을 막는 조건은 아니지만 배포 검증의 선행 조건이다. 접근을 확보하지 못하면 배포 검증 미완료로 남긴다. 인증을 우회하거나 Production zone 연결을 Preview 성공으로 오인하지 않는다.
- cache zone의 이전 200 관찰과 현재 404 차이는 미확정이다. 이번 수정의 회귀 검사에 포함하되 과거 원인을 추정해 덮어쓰지 않는다.
- 셸 빌드·검증 중 새로 생긴 타입·manifest·로그 파일은 소유 범위를 확인한다. 병행 작업 파일을 통째로 복구하지 않는다.

## Completion criteria

통합 intent의 모든 완료 기준을 충족해야 기능 해결을 보고한다. Preview만 통과했거나 Production 검증 허가·접근이 없으면 로컬/Preview 검증 완료와 공개 서비스 미검증을 구분한다. 문서 `done`은 저장소의 승인·Git 반영 규칙까지 충족한 뒤 적용하며 AI가 스스로 머지·완료 승인을 만들지 않는다.

## Verification results

- 상태: 로컬 및 Production 검증 완료. Production HTTP 46/46, Chrome prefetch·hover·navigation·관측 로그 및 자산·Proxy 검증 통과. 별도 Preview는 미실행.
- 수정 전 조사 결과: `investigation.md`, `evidence.json`. 이 결과는 수정의 통과 증거가 아니다.
- 문서 점검: 일관성·실행 가능성·수정 범위 검토 완료. baseline 직접 origin의 필수 입력 여부를 수정 전 비교 기준과 일치시켰고 Proxy 검증 경로를 전체 경로로 명시했다. 남은 문서 검토 지적은 없으며 실제 수행 결과는 `verification.md`와 `verification-evidence.json`에 기록한다.
- Git 반영 승인: 2026-10-01 사용자 “메인에 머지해줘” 지시로 커밋과 로컬 main 반영 승인. 후속 사용자 “메인에서 진행” 지시로 원격 push·Production 반영 승인 및 수행 완료. 별도 Preview는 이번 완료 주장에 포함하지 않는다.

전체 테스트 스위트나 새 baseline 빌드는 이번 단계의 필수 검증으로 늘리지 않는다. 구현 중 새 실패나 영향 범위가 발견되면 필요한 검사만 추가하고 근거를 기록한다.
