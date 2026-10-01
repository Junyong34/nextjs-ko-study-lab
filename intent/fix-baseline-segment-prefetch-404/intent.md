Intent: baseline zone의 segment prefetch 404 원인 규명과 해결
Author: Codex (사용자 요청 초안)
Status: approved
Approval: 2026-10-01 현재 대화에서 사용자가 원인 설명을 확인한 뒤 “승인”으로 통합 intent의 요구사항·설계·완료 기준을 승인했다. PR 없음. 이번 승인은 plan 작성의 근거이며 구현·push·배포 승인은 아니다.

## Problem

배포된 baseline zone에서 `<Link>`가 보내는 `rsc: 1`, `next-router-prefetch: 1`, `next-router-segment-prefetch: /_tree` 요청이 HTML 404로 응답한다. 클릭 이동은 200이므로 화면은 열리지만 사전 가져오기가 실패하고 실습의 실제 관측 로그에도 404가 남는다.

사용자 보고상 여러 baseline 라우트에서 재현되며 로컬 production에서는 zone 직접 요청과 셸 경유 요청이 모두 200이다. cache zone과 셸은 배포 환경에서도 같은 종류의 요청이 200이다. 앱 코드의 결함이나 Proxy 탓으로 미리 단정하지 않는다.

2026-10-01 읽기 전용 재확인: 실제 Chrome의 상품 1·2 prefetch가 HTML 404였다. 상품 1의 요청을 그대로 재전송하면 공개 셸은 404, baseline 직접 Production 별칭과 로컬 production의 직접·셸 경유 요청은 모두 200이었다. 조사 과정과 증거의 한계는 [조사 기록](./investigation.md)에 남겼다.

셸의 `afterFiles` 외부 rewrite는 Vercel이 이미 segment 전송 경로로 바꾼 URL을 다음 zone으로 전달한다. 다음 zone이 같은 헤더로 경로를 다시 바꾸는 중복 변환이 원인이다. 공개 어댑터 소스와 명시적 전송 경로 비교로 확인했으며 내부 rewrite trace와 배포 어댑터 버전은 직접 확인하지 않았다.

## Proposed outcome

- 브라우저 요청부터 셸 rewrite, Vercel 라우팅, baseline 응답까지 실패 지점을 증거로 특정하고 원인과 미검증 가설을 구분한다.
- 원인에 맞는 최소 변경으로 baseline의 segment prefetch를 복구한다. `prefetch={false}`나 로그 필터로 증상을 숨기지 않는다.
- 배포 환경에서 실제 브라우저와 같은 헤더 조합의 요청이 200으로 응답하고, 실습 화면에서 prefetch 404가 사라진 것을 확인한다.

## Affected users and systems

- 사용자: baseline 실습을 이용하는 학습자와 배포 운영자.
- 시스템: `apps/demo-baseline`, `apps/shell`의 zone rewrite, Vercel 프로젝트의 빌드·라우팅 산출물. 구체적인 수정 파일은 원인 규명 후 spec/plan에서 확정한다.

## Requirements

1. 사용자 전달 결과, 이번 조사에서 재확인한 사실, 추론·가설, 미검증 항목을 구별한다. 상태 코드뿐 아니라 Content-Type, 일치 경로, 캐시 헤더, 응답 본문 종류를 비교한다.
2. 실패 라우트와 성공 라우트를 비교하고, 가능하면 baseline 직접 배포 URL과 셸 경유 URL을 같은 요청으로 대조한다.
3. Proxy matcher 밖의 실패와 로컬 production의 200을 설명할 수 있어야 원인 확정으로 기록한다.
4. `_rsc`·segment 헤더 유무·명시적 `.rsc`/`.segments` URL을 대조해 해시 검증, 전송 경로 변환, CDN 응답을 구분한다. `HIT`만으로 캐시 오염을 확정하지 않는다.
5. 해결 검증은 실패한 대표 라우트와 baseline의 다른 정적·동적 라우트를 포함한다. navigation, cache zone, 셸 및 Proxy 데모의 기존 동작도 확인한다.

## Design (spec 통합)

셸의 `/zone/*` 외부 rewrite를 `beforeFiles`로 옮겨 원래 경로와 prefetch 헤더를 소유 zone에 먼저 전달한다. zone에서만 전송 경로로 변환하도록 한다. Related Projects와 환경변수 목적지를 유지한다. 자산 rewrite의 구체적인 배치와 회귀 검증 파일은 plan에서 확정한다. 로컬 구현·검증은 완료됐으며 배포 후 효과는 미검증이다.

## Acceptance criteria (spec 통합)

- [ ] 실제 Chrome에서 캡처한 상품 1·2 prefetch가 배포된 셸 경유에서도 200과 `text/x-component`를 반환한다.
- [ ] 목록 페이지·다른 정상 정적/동적 baseline 라우트에서도 segment 요청이 올바른 대상 경로·RSC 트리에 도달한다. 정상 페이지가 없는 `/zone/baseline` 자체의 404는 성공 기준에서 제외한다.
- [ ] 실습 화면의 실제 관측 로그에서 prefetch 404가 사라지고 클릭 navigation이 정상 동작한다.
- [ ] 셸·cache zone·자산·Proxy 데모의 기존 동작을 확인한다. 조사 시 현재 cache zone도 같은 요청에서 404였다는 결과를 회귀 기준에 반영한다.
- [x] 로컬 검증과 배포 검증을 구분해 기록하고 임시물을 정리한다.

## Constraints

- 구현은 plan 승인 후 시작한다. 통합 intent와 plan의 로컬 구현·검증은 사용자 승인 상태다.
- Preview 포함 배포, 외부 서비스 설정 변경, push는 별도 사용자 허가 후 진행한다. Proxy 제거 배포 실험 역시 이 조건을 따른다.
- `config/*` 데모 등 병행 작업을 수정·스테이징·되돌리기하지 않는다. 2026-10-01 조사 시작 시 현재 `main` 작업 트리는 깨끗했다.
- `cacheComponents` 설정 축, 학습자 URL, 실제 `<Link>` 동작, recorder의 관측 사실을 보존한다.
- 임시 서버·빌드·CDP 파일은 소유 관계와 활성 상태를 확인한 뒤 정리한다. 다른 작업의 프로세스·파일을 임의로 삭제하지 않는다.
- 커밋·push·배포 없이 초안을 검토할 수 있게 제공한다.

## Open questions

- 실제 Vercel 배포의 어댑터 버전·라우팅 산출물은 인증된 계정에서 확인하지 못했다. 현재 직접 Production 별칭은 정상이며 Proxy 제거 배포 실험의 필요성은 낮다.
- 이전 cache zone 200 관찰과 현재 404의 차이가 어느 배포·헤더 차이에서 생겼는지는 미확정이다.
- 수정 확인용 Preview 배포의 프로젝트 조합·허가·되돌리기는 plan에서 별도로 합의한다.
