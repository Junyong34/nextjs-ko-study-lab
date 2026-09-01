# 05. Zone / 데모 추가 체크리스트

이 저장소에 zone(독립 Next.js 앱)이나 데모를 새로 추가할 때 따르는 절차입니다. zone 추가는 드물고, 데모 추가는 일상 작업입니다.

## 1. zone 추가 체크리스트

zone을 하나 늘릴 때마다 손대야 하는 곳입니다. **하나라도 빠지면 그 zone은 사이트에서 보이지 않습니다.**

> zone에는 **앱 이름**(`demo-cache-components`)과 **슬러그**(`cache`) 두 이름이 있고 서로 대체할 수 없습니다.

- [ ] `nextjs-app/apps/{앱이름}/` 생성. **`--turbopack`은 넘기지 않습니다**
- [ ] 생성물 정리 — 앱 폴더의 `pnpm-workspace.yaml` 삭제, `package.json`의 `packageManager` 필드 삭제
- [ ] `package.json` 이름 `@study/{앱이름}`, 의존성 `catalog:`, dev 포트 고정, `check-types` 스크립트
- [ ] `next.config.ts`에 `assetPrefix: '/demo-static/{슬러그}'` 설정 및 공유 패키지 사용 시 `transpilePackages` 명시
- [ ] 라우트를 `src/app/zone/{슬러그}/` 아래에 배치 (밑줄 `_zone` 금지 — 라우팅에서 제외됨)
- [ ] `not-found.tsx`에 iframe 안에서 읽힐 폴백 작성
- [ ] **셸의 `next.config.ts`에 rewrites 2줄 추가** — `/zone/{슬러그}/:path*` + `/demo-static/{슬러그}/:path*`. **정적 자산은 접두사를 벗기지 말고 그대로 통과**시킵니다
- [ ] **`assetPrefix`가 안 붙는 두 경로를 피했는지 확인** — 데모 앱에는 `public/`을 두지 않고, `next/image`는 `unoptimized` 또는 zone별 `images.path`를 지정합니다
- [ ] **셸의 `.env.local`에 `ZONE_{슬러그 대문자}_URL` 추가**
- [ ] (배포 시) Vercel 프로젝트 생성 + 셸 프로젝트에 환경변수 추가 — 절차는 [04. Vercel 배포 계획](./04-vercel-deployment-plan.md) 참고

## 2. 데모 추가 체크리스트

zone 추가는 드물고, **데모 추가가 일상 작업**입니다. 훨씬 짧습니다.

- [ ] `demos.yaml`에 항목 추가 — `url` · `title` · `doc` · `zone` · `status: stub`
  - `url`은 `{문서 파일명}/{데모명}`이 관습입니다. 이미 쓰이는 이름과 겹치면 다른 이름을 줍니다
- [ ] `pnpm --filter @study/demos gen-stubs` — 진입점 라우트 생성
- [ ] 데모 내용 작성. `status: wip`
  - 캐시 태그·`cacheLife` 프로파일 이름에 **데모 접두사**를 붙입니다 — 같은 zone 안 데모끼리 캐시를 서로 지우지 않도록 하기 위해서입니다
  - 스토리지 키·쿠키에 `demo_{슬러그}_*` 접두사를 붙입니다 — 모든 zone이 동일 오리진이라 접두사가 없으면 다른 zone(셸 포함)의 상태를 덮어씁니다
  - 화면 하단에 **기대 / 실제**(Expected/Actual) 패널을 둡니다 ([03. 4단 표준 레이아웃](./03-demo-standard-and-layout-pattern.md))
- [ ] 본문에서 가리킬 데모라면 md에 `demo` 코드펜스 삽입 (`path`, 필요하면 `caption`)
- [ ] `pnpm --filter @study/demos lint` 통과
- [ ] `status: done`으로 전환 — **이때 `doc`의 md 상태가 완료여야 합니다**

`status`를 `done`으로 바꾸는 것이 곧 공개입니다. 그 전까지는 색인에도, 문서 하단 목록에도, 본문 링크 카드에도, 검색 결과에도 나타나지 않습니다.
