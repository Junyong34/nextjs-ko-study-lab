# 개발·운영 문서 최신화 기록 (2026-10-02)

- 확인일: 2026-10-02
- 코드 기준: `7595126`(main). `5d985c8`(마지막 stub 9개 전환) 이후 `demos.yaml` 제목 3건 정정과 두 데모의 개념 정리 문구 수정이 이 커밋에 들어 있다
- 범위: 09 공개 운영 가이드, 02·03·04·05·08, ARCHITECTURE, CONTEXT, 루트 README, 두 데모 앱의 AGENTS, 문서 색인
- 방법: `demos.yaml`의 커밋별 `done`·`stub` 수 계산, 설정·계측 파일 직접 읽기, 이번 작업의 검증 기록과 대조
- 한계: 새 브라우저 QA와 배포는 하지 않았다. 문서만 고쳤고 코드·설정·데모 상태는 이 문서 작업에서 바꾸지 않았다. 직접 다시 대조하지 않은 문서는 아래 "대조하지 않은 문서"에 적었다
- 이전 기록: [2026-09-05 최신화](./2026-09-05-documentation-refresh.md)

## 변경 근거

| 기존 설명 | 근거 | 수정 | 확인 수준 |
|---|---|---|---|
| 등록 240, `done` 58, `stub` 182 (09의 1절) | `demos.yaml`: 241개 모두 `done`, `stub` 0. baseline 211, cache 30 | 수치와 경과를 09의 1절·7절에 기록 | YAML과 생성 JSON 대조 |
| 등록 합계는 240으로 고정 | 커밋 이력에서 2026-09-29에 +2, 2026-10-02에 Sass 실습 삭제로 -1 | 변경 시점을 09에 기록 | `git log` 이력 |
| 준비 중 예제가 목록에 있다 (루트 README) | 위와 같음 | 모든 예제가 공개 대상이고 일부는 설명형이라는 서술로 교체 | YAML 대조 |
| `?run=`이 미공개 데모를 선택할 수 있다 (09의 5절) | `apps/shell/src/app/demo/[...slug]/page.tsx`의 `?run=` 처리를 2026-10-02에 다시 읽음. 소속·상태 재검사는 여전히 없음 | 미공개 위험은 현재 데이터에서 발생하지 않고, 소속 검증 부재는 유지된다고 구분 | 정적 코드 대조 |
| 설명형 데모와 전역 설정 데모의 기준이 문서에 없음 | 커밋 `ebb4dc6`, `6117767`과 `apps/AGENTS.md` 규칙 10 | 03에 실측형·설명형 구분을 추가하고 CONTEXT에 용어 추가 | 커밋·코드 대조. ADR 0009는 proposed이므로 상태를 바꾸지 않음 |
| 데모별 설정 조각·`NEXT_DIST_DIR`·MDX·OTel 구조가 문서에 없음 | `next.config.ts`, `src/config/demo-next-config/`, `instrumentation.ts`, `lib/otel-setup.ts` | 02의 5.4절, 05, ARCHITECTURE 5절, 두 앱의 AGENTS에 추가 | 소스 직접 읽기 |
| `ZONE_CACHE_URL`은 셸만 사용 (04) | baseline `rewrites-cross-zone.ts`가 `withRelatedProject('study-cache')`를 사용. baseline `vercel.json`의 `relatedProjects`에는 셸만 있음 | 04의 3-1, 3-2, 8절에 추가 | 소스와 `vercel.json` 대조. 배포 환경은 확인하지 않음 |
| 외부 라이브러리 연동은 미착수 (08의 3번) | SWR·TanStack Query·third-parties·MDX·OTel 데모 9개를 baseline에 추가 | 진행 상황과 미착수 범위를 08에 기록 | 커밋 `5d985c8` |

## 대조하지 않은 문서

다음 문서는 이번에 다시 대조하지 않았고 내용을 바꾸지 않았다. 최신이라는 뜻이 아니다.

- `01-ui-and-screen-design.md`, `06-learning-progress-design.md`, `07-seo-plan.md`: 이번 작업 범위의 코드와 겹치지 않는다고 판단해 검토하지 않았다. 01은 다른 세션이 2026-10-02에 수정했다
- `ga-content-analytics.md`, ADR 0001~0009, `nextjs-docs/` 전체
- `DESIGN.md`, `CONTEXT-MAP.md`, `.github/` 안내
- `nextjs-app/docs/15-done-demos-browser-audit-report.md`, `ORIGINAL_REQUEST.md`: 이 문서 작업의 대상이 아니었고 건드리지 않았다. 이후 사용자 지시로 삭제했다(아래 "삭제한 문서")

## 삭제한 문서

2026-10-02에 사용자가 후보 목록을 검토하고 지시해 다음 3개를 삭제했다. `14`는 `.gitignore` 대상이라 커밋에 나타나지 않고, 나머지 `ORIGINAL_REQUEST.md`는 이 문서와 같은 커밋에서 삭제했다. `15`는 미추적 파일이었다.

| 경로 | 상태 | 삭제 사유와 복구 가능성 |
|---|---|---|
| `nextjs-app/docs/14-demo-guide-audit-report.md` | `.gitignore` 대상의 생성 산출물 | 2026-10-01 스냅샷(242개 스캔)이라 현재와 다르다. `test:guide-audit`로 다시 만들 수 있다. 02의 71행은 스크립트 인자가 이 경로를 쓴다는 설명이라 그대로 유효하다 |
| `ORIGINAL_REQUEST.md` | 추적 파일 | 문서가 아니라 AI 작업 요청 로그로 보였고 다른 문서의 참조가 없었다. 커밋된 버전은 git에서 복구할 수 있다. 미커밋 변경 59줄은 복구할 수 없다 |
| `nextjs-app/docs/15-done-demos-browser-audit-report.md` | 미추적 파일 | 다른 세션이 만든 감사 보고서(72KB)였다. git에 없어 복구할 수 없다 |

위 두 복구 불가 항목은 삭제 직전 사본을 이 작업 세션의 임시 폴더에만 남겼다. 세션 임시 폴더는 보존이 보장되지 않는다. `AI-Hero/`(저장소 루트의 로컬 폴더)는 사용자가 로컬에서 쓰고 있어 삭제하지 않았다.

## 문서와 코드가 다르지만 고치지 않은 것

| 항목 | 차이 | 이유 |
|---|---|---|
| 데모 앱의 `public/` | `apps/AGENTS.md` 규칙 5와 05는 데모 앱에 `public/`을 두지 않는다고 한다. 세 앱 모두 `public/og-image.png`가 있고 `layout.tsx`·`page.tsx` 메타데이터가 참조한다 | 규칙은 셸 rewrites에 걸리지 않는 경로를 피하려는 것이다. 이 이미지는 zone 직접 접근용으로 보이나 확인하지 않았다. 정책 판단이 필요하다 |
| 09의 6절 | "다음 5개를 선택해"라고 하고 항목은 4개만 나열한다. 같은 절에서 Turbopack 항목 제외를 말한다 | 5개 선택, 4개 공개로 읽히나 원문 의도를 확인할 수 없어 유지했다 |
| `test:guide-audit` | 02는 출력이 `docs/14-demo-guide-audit-report.md`라고 한다. 그 파일은 `.gitignore` 대상(생성 산출물)이다 | 별도 구현 후속 항목이다 |

## 코드·결정이 필요한 후속 항목

위 항목은 이번 문서 변경으로 해결됐다고 처리하지 않는다.

| 우선순위 | 항목 | 다음 확인 |
|---|---|---|
| P1 | baseline의 `ZONE_CACHE_URL`·Related Projects 연결 | baseline `vercel.json`에 cache 프로젝트 ID를 추가하거나 `ZONE_CACHE_URL`을 등록한 뒤 `config/rewrites/cross-zone-proxy`를 배포 환경에서 확인 |
| P1 | 설명형 14개를 `done`으로 공개할지 | 일부를 `stub`으로 되돌리면 준비 중으로 표시되고 학습 기록·sitemap에서 빠진다(09의 3절) |
| P2 | `guides/adopting-partial-prefetching/hover-shell`의 제목과 내용 불일치 | 제목을 바꾸거나 `cacheComponents`가 켜진 zone으로 옮기기. 현재는 알려진 한계로 유지 |
| P2 | `server-register-hook`의 `console.error` 전역 패치 | `instrumentation.ts`를 직접 수정하는 방식과 비교 |
| P2 | `@study/demos lint`의 캐시 태그 접두사 경고 16건 | 모두 cache zone의 이전 데모다. 이번 작업과 무관하게 이미 있었다 |
| P2 | `?run=` 소속 검증과 홈 추천 목록의 상태 대조 | 09의 5절 |
| 확인 필요 | 셸 `/demo/{url}` iframe 경유 화면과 배포 환경에서의 241개 | 지금까지의 확인은 zone 직접 접근(3001·3002)이었다 |

## 검증 기록

- 변경 문서의 상대 링크와 해당 문서로 들어오는 링크·앵커 123개: 누락 없음. 코드펜스와 인라인 코드를 제외한 Markdown 링크를 파일 존재·heading 기준으로 검사했다
- 09 문서의 수치(241·211·30·0), 설명형 14개 목록: `demos.yaml`과 대조해 일치. 생성 JSON도 241건
- 09의 `done` 추이(59, 65, 71, 87, 110, 133, 153, 183, 198, 222, 232, 241)와 커밋 날짜·해시: `git show`로 커밋별 YAML을 읽어 대조. 처음 쓴 날짜 1건(`6117767`)이 틀려 정정했다
- 02·04·05·ARCHITECTURE·AGENTS에 적은 경로와 설정 키: `next.config.ts`, `index.ts`, `instrumentation.ts`, `otel-setup.ts`, `mdx-components.tsx`, `vercel.json`을 직접 읽어 확인
- `git diff --check`: 이번에 추가한 줄에서 통과
- 두 앱의 AGENTS는 추가만 했고 삭제 줄은 0이다. `next dev`가 다시 쓰는 자동 생성 블록은 건드리지 않았다
- 변경 범위: 기존 Markdown 13개 수정, 이 기록 1개 추가. 코드·설정·생성 JSON은 이 문서 작업에서 바꾸지 않았다
- 문서만 변경했으므로 앱 빌드·기능 테스트·브라우저 QA·배포는 실행하지 않았다
