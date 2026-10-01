# baseline segment prefetch 404 조사

조사일: 2026-10-01 (한국 시간)  
상태: 원인 조사 및 로컬·Production 구현·검증 완료
체크아웃: `main`, `8166967` (`git status --short`는 조사 시작 시 비어 있었음)

## 결론과 증거 수준

셸의 zone 외부 rewrite가 `afterFiles`에 있어서 Vercel의 segment prefetch URL 변환을 거친 경로를 다음 zone에 전달한다. 다음 zone도 같은 prefetch 헤더를 보고 전송 접미사를 붙인다. `.segments/_tree.segment.rsc`가 중복된 경로는 정상 리소스와 일치하지 않아 HTML 404로 끝난다.

실제 배포의 직접 요청·셸 경유 요청·명시적 전송 경로 비교와 Vercel 공식 어댑터의 처리 순서가 이 원인과 일치한다. 아래 중간 경로는 어댑터 소스와 응답 비교에서 도출한 값이다. Vercel 내부 rewrite trace를 열어 직접 캡처한 값은 아니다. 배포가 사용한 정확한 어댑터 버전은 아직 확인하지 않았다. 수정 후 Production 검증은 `verification.md`에 별도로 기록했다.

## 실제 Chrome 요청 재현

별도 임시 프로필의 headless Chrome으로 사용자가 지정한 공개 실습 URL에 접속했다. hover나 클릭 없이 iframe 안 상품 1·2의 뷰포트 prefetch가 모두 HTML 404로 응답했다. `Runtime.exceptionThrown` 이벤트는 없었다.

상품 1의 요청을 캡처한 그대로 네 환경에 재전송했다.

```http
GET /zone/baseline/guides/adopting-partial-prefetching/hover-shell/products/1?_rsc=YCuvbfS_CHCPmpKA
rsc: 1
next-router-prefetch: 1
next-router-segment-prefetch: /_tree
next-url: /zone/baseline/guides/adopting-partial-prefetching/hover-shell
```

이 요청에는 `next-router-state-tree`가 없다. 임의의 router tree를 만들어 넣지 않았다. `_rsc` 값은 설치된 Next.js 16.3.2의 해시 계산으로 구한 값과 같다.

캡처한 요청·응답의 필요한 필드와 비교 결과는 [evidence.json](./evidence.json)에 보존했다. 인증·쿠키 헤더는 수집 대상에서 제외했다.

| 환경 | 상태 | Content-Type | x-matched-path |
|---|---|---|---|
| 공개 셸 `www.learn-nextjs-lab.space` | 404 | `text/html; charset=utf-8` | `/404` |
| baseline Production 별칭 `demo-baseline.vercel.app` | 200 | `text/x-component` | `…/hover-shell/products/[id].rsc` |
| 기존 빌드의 로컬 baseline `localhost:3001` | 200 | `text/x-component` | 헤더 없음 |
| 기존 빌드의 로컬 셸 `localhost:3198` | 200 | `text/x-component` | 헤더 없음 |

로컬 두 응답의 본문 SHA-256도 서로 같다. 새 빌드를 만들거나 설정을 바꾸지 않고 기존 `.next`로 실행했다. 따라서 로컬 서버의 200은 이번 조사에서도 재확인했다.

공개 [GitHub 배포 기록](https://api.github.com/repos/Junyong34/nextjs-ko-study-lab/deployments/6775459508/statuses)에서 baseline 배포 URL과 성공 기록을 읽었다. 기록의 커밋은 `52fbb5e17d5959f197bc3e301d8168d33d2bdca3`, 성공 시각은 2026-10-01 12:29:13 KST다. 고정 배포 URL `demo-baseline-2v66utflf-junyong34s-projects.vercel.app`은 직접 요청 시 Vercel 인증으로 302를 반환해 비교 대상으로 사용하지 않았다. 사용자 제공 Production 별칭으로 비교했다. 별칭의 현재 배포 커밋을 인증된 Vercel API로 확정한 것은 아니다.

## 한 변수씩 바꾼 비교

아래 `P`는 상품 1의 정상 경로, `S`는 `.segments/_tree.segment.rsc`다. “세 헤더”는 `rsc`, `next-router-prefetch`, `next-router-segment-prefetch`를 뜻한다. 기본 비교의 `_rsc`는 Next.js 16.3.2 방식으로 계산했다.

| 요청 | 셸 경유 | baseline 직접 |
|---|---|---|
| `P` + 세 헤더 | HTML 404 | RSC 200 |
| `P` + 세 헤더 + 브라우저의 `next-url` | HTML 404 | RSC 200 |
| `P` + `rsc: 1` | RSC 200 | RSC 200 |
| `P` + `rsc: 1`, `next-router-prefetch: 1` | RSC 200 | RSC 200 |
| `P` + `rsc: 1`, segment 헤더, prefetch 헤더 없음 | RSC 200 | RSC 200 |
| `P.rsc` + 전송 헤더 없음 | RSC 200 | RSC 200 |
| `P + S` + 전송 헤더 없음 | RSC 200 | RSC 200 |
| `P + S` + 세 헤더 | HTML 404 | HTML 404 |
| `P + S + S` + 전송 헤더 없음 | HTML 404 | HTML 404 |

정적 목록 라우트에서도 같은 비교를 실행했다.
`hover-shell` 목록 페이지의 `P + S`는 셸 경유와 baseline 직접 요청 모두 동일한 RSC 본문(해시 `e82b45add2a1…`)을 반환했다. 두 번 붙인 경로와 원래 셸의 실패 요청은 같은 404 본문을 반환했다.

404 본문 SHA-256:

```text
4e3d0ce68418ca19a06f9beff1c0781add7c8d0352b98109fb34b932f23bd21d
```

해시 일치만으로 원인을 확정하지는 않는다. 직접 배포 200, 한 번 붙인 경로 200, 그 경로에 헤더를 더했을 때 404, 어댑터의 경로 변환 순서를 함께 근거로 삼는다.

## 처리 순서와 로컬 차이

저장소의 `nextjs-app/apps/shell/next.config.ts:27`은 `rewrites()`에서 배열을 반환한다. 기존 셸 빌드의 `routes-manifest.json`에서도 `/zone/baseline/:path*`와 `/zone/cache/:path*`가 `afterFiles`에 있다. 배열의 rewrite를 파일 확인 뒤 처리한다는 동작은 [Next.js rewrites 문서](https://nextjs.org/docs/app/api-reference/config/next-config-js/rewrites)에 명시돼 있다.

Vercel 공식 공개 어댑터 소스를 커밋 `a69c714628bf9c95c804c3c3f03793f6bc3f254d`에 고정해 확인했다.

- [server-build.ts:2283](https://github.com/vercel/vercel/blob/a69c714628bf9c95c804c3c3f03793f6bc3f254d/packages/next/src/server-build.ts#L2283): `beforeFilesRewrites`를 먼저 배치한다.
- [server-build.ts:2355](https://github.com/vercel/vercel/blob/a69c714628bf9c95c804c3c3f03793f6bc3f254d/packages/next/src/server-build.ts#L2355): 세 헤더가 일치하면 경로를 `/$path.segments/$segmentPath.segment.rsc`로 바꾼다. 이미 `.segments`인 경로를 제외하는 조건은 이 규칙에 없다.
- [server-build.ts:2511](https://github.com/vercel/vercel/blob/a69c714628bf9c95c804c3c3f03793f6bc3f254d/packages/next/src/server-build.ts#L2511): filesystem 확인.
- [server-build.ts:2553](https://github.com/vercel/vercel/blob/a69c714628bf9c95c804c3c3f03793f6bc3f254d/packages/next/src/server-build.ts#L2553): 그 뒤 `afterFilesRewrites`를 배치한다.
- [server-build.ts:356](https://github.com/vercel/vercel/blob/a69c714628bf9c95c804c3c3f03793f6bc3f254d/packages/next/src/server-build.ts#L356): `afterFiles` rewrite가 `.rsc`와 `.segments` 전송 접미사도 다음 목적지로 전달하도록 가공한다.

이 순서에서 셸 경유 요청은 다음 경로로 진행한다.

```text
브라우저: P + prefetch 헤더
→ 셸 Vercel: P + S
→ 셸 afterFiles 외부 rewrite: baseline에 P + S와 헤더 전달
→ baseline Vercel: P + S + S
→ 유효한 전송 리소스와 불일치
→ /404 HTML 응답
```

navigation과 일반 RSC 요청에는 이 segment 변환 조건이 성립하지 않는다. 일반 RSC 변환에는 이미 `.rsc`인 경로를 제외하는 조건이 있어 같은 방식으로 중복되지 않는다.

로컬 `next start`에는 Vercel 어댑터의 CDN 라우팅 규칙이 없다. 설치된 Next.js의 `dist/server/base-server.js:185`는 정상 경로의 헤더를 요청 메타데이터로 읽고, 셸은 정상 경로를 외부 rewrite로 전달한다. 이번 실제 헤더 재전송에서도 로컬 직접·경유 응답이 모두 200이었다.

## 초기 관찰에서 달라진 점

- **Proxy 실행 가설:** 직접 baseline이 같은 헤더에서 정상 응답한다. 실패한 경로는 matcher 밖이며, 셸 경유 여부만 바꾸면 실패한다. Proxy를 제거한 배포 실험은 현재 증거상 필요하지 않다. Proxy 존재의 모든 빌드 영향을 A/B 배포로 배제한 것은 아니다.
- **cacheComponents 설정 가설:** segment 변환의 사용 여부를 baseline 전용 설정으로만 설명할 수 없다. 어댑터는 Next.js 버전으로 client segment cache도 활성화한다. 현재 셸 경유 `/zone/cache/revalidating/time-based-isr`와 `/zone/cache/guides/isr-cache-components/cache-life-hours`는 HTML·일반 RSC 요청에서 200, 세 헤더 요청에서는 HTML 404였다. 이전에 cache zone이 200이었다는 사용자 관찰을 지우지 않고, 현재 재검증 결과를 별도로 기록한다. 어떤 배포·헤더 차이로 결과가 달라졌는지는 미확정이다.
- **`shoes`의 200:** 정상 category 응답이라는 뜻이 아니다. 직접 요청은 `…/[category].rsc`, 셸 경유는 `…/[category]/[item].rsc`에 일치했다. 셸의 응답 RSC 트리에는 category `%5Bcategory%5D.segments`, item `_tree.segment`가 들어 있었다. 전송 접미사를 다른 동적 라우트가 받아 HTTP 200을 반환한 사례다. 상태 코드뿐 아니라 트리·대상 경로를 검증해야 한다.
- **`/zone/baseline`의 404:** 현재 직접 배포에서도 일반 RSC 요청이 404다. 정상 페이지가 없는 경로의 404를 이번 수정의 성공 기준에 넣지 않는다.
- **CDN 캐시 오염 가설:** 잘못 변환한 경로가 공통 `/404` 리소스에 도달하면 `_rsc`가 달라도 같은 HTML과 `HIT`가 나오는 관찰을 설명한다. `HIT`만으로 query 무시나 캐시 오염을 단정할 수 없다. 유효한 단일 전송 경로는 같은 시점에도 200이므로 캐시 삭제가 우선 해결책은 아니다.
- **앱 recorder 오류 가설:** Chrome Network에서도 실습의 상품 1·2 요청이 실제 404였다. 앱 관측 로그를 고쳐 숨길 근거가 없다.

## 수정 방향과 권장 검증

최소 수정 후보는 셸의 zone 외부 rewrite를 `beforeFiles`로 옮기는 것이다. 그러면 셸의 전송 경로 변환 전에 원래 경로와 헤더를 소유 zone에 전달한다. Related Projects, 환경변수 목적지, assetPrefix, baseline의 Proxy·설정 축·Link·recorder는 보존했다. 승인된 plan에 따라 자산 rewrite는 afterFiles에 유지했다.

기존 `packages/test-suite/src/tier1-feature-coverage/09-proxy-instrumentation.test.ts`의 9.4는 메모리 안 객체 복사만 확인한다. 실제 셸·Vercel rewrite를 호출하지 않으므로 이 문제를 잡을 수 없다.

승인된 계획의 검증 항목:

1. 셸 build manifest에서 zone rewrite가 `beforeFiles`에 등록되는지 확인한다. 타입·정적 검증은 배포 성공의 대체 증거로 쓰지 않는다.
2. 로컬 production 직접·셸 경유 요청, navigation, `/demo-static/*` 자산을 확인한다.
3. 사용자 허가를 받은 Preview에서 이번 Chrome 캡처와 같은 요청을 재전송한다. 실패하던 정상 정적·동적 라우트의 200, `text/x-component`, 올바른 대상 경로·트리를 확인한다.
4. 실제 실습 화면의 뷰포트·hover prefetch와 클릭 navigation을 기록한다. recorder에서 prefetch 404가 사라져야 한다.
5. cache zone과 셸 라우트, Proxy 헤더·인증·rewrite 데모의 기존 동작을 비교한다.

수정 후 로컬 및 실제 Production 검증을 통과했다. [구현·검증 기록](./verification.md)을 참고한다. 원인 설명의 신뢰도는 **높음**이며, 어댑터 내부 trace와 실제 배포 버전 확인은 증거의 한계로 남긴다. 배포 후 위 검증이 통과하기 전에는 해결 완료로 기록하지 않는다.

## 작업 상태와 정리

사용자가 통합 intent와 plan의 로컬 구현·검증을 승인한 뒤 격리 worktree에서 셸 rewrite·HTTP 검사 스크립트를 구현했다. 로컬 검증 후 사용자 지시로 main 반영·push·Production 배포 검증까지 수행했다. 수정 전 조사 결과와 증거는 그대로 보존한다.

조사에 사용한 로컬 서버를 종료했고 3001·3198 포트에 listener가 없음을 확인했다. Chrome과 임시 프로필·요청 파일도 정리했다. 사용자 지정 `.next-probe-prefetch`, `/tmp/cdp-*`, `/tmp/zone.log`, `/tmp/shell.log`는 남아 있지 않다. 기존 `.next` 빌드는 이번 조사에서 만든 것이 아니므로 보존했다.
