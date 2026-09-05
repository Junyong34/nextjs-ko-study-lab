# 05. Zone / 데모 추가 체크리스트

이 저장소에 zone(독립 Next.js 앱)이나 데모를 새로 추가할 때 따르는 절차입니다. zone 추가는 드물고, 데모 추가는 일상 작업입니다.

## 1. zone 추가 체크리스트

zone을 하나 늘릴 때마다 손대야 하는 곳입니다. 각 항목이 설정·라우팅·빌드에 미치는 영향을 확인합니다. 모든 명령은 저장소 루트에서 실행합니다.

> zone에는 **앱 이름**(`demo-cache-components`)과 **슬러그**(`cache`) 두 이름이 있고 서로 대체할 수 없습니다.

- [ ] `nextjs-app/apps/{앱이름}/` 생성. **`--turbopack`은 넘기지 않습니다**
- [ ] 생성물 정리 — 앱 폴더의 `pnpm-workspace.yaml` 삭제, `package.json`의 `packageManager` 필드 삭제
- [ ] `package.json` 이름 `@study/{앱이름}`, 의존성 `catalog:`, dev 포트 고정, `check-types` 스크립트
- [ ] `next.config.ts`에 `assetPrefix: '/demo-static/{슬러그}'` 설정 및 공유 패키지 사용 시 `transpilePackages` 명시
- [ ] 라우트를 `src/app/zone/{슬러그}/` 아래에 배치 (밑줄 `_zone` 금지 — 라우팅에서 제외됨)
- [ ] `not-found.tsx`에 iframe 안에서 읽힐 폴백 작성
- [ ] **셸의 `next.config.ts`에 rewrites 2줄 추가** — `/zone/{슬러그}/:path*` + `/demo-static/{슬러그}/:path*`. **정적 자산은 접두사를 벗기지 말고 그대로 통과**시킵니다
- [ ] **`assetPrefix`가 안 붙는 두 경로를 피했는지 확인** — 데모 앱에는 `public/`을 두지 않고, `next/image`는 `unoptimized` 또는 zone별 `images.path`를 지정합니다
- [ ] **셸의 `.env.local`에 `ZONE_{슬러그 대문자}_URL` 추가**. 데모 앱의 `PUBLIC_ORIGIN`에는 스킴 없는 셸 host를 설정
- [ ] 데모 타입·빌더·린터·스텁 생성기의 zone enum과 앱 디렉토리 매핑, 공유 메타데이터의 zone 처리를 함께 확인
- [ ] 관련 앱의 `vercel.json` 프로젝트 ID와 `next.config.ts`의 `projectName` 연결 확인
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
- [ ] 대상 기능의 로컬·필요한 배포 환경 검증 결과 기록. **연결 학습 문서의 md 상태도 완료여야 합니다**
- [ ] 검증 후 `status: done`으로 전환하고 lint 재확인
- [ ] `pnpm --filter @study/demos build`로 매니페스트 재생성 후 `pnpm test:manifest` 확인
- [ ] 앱 빌드·배포 후 화면별 공개 상태 확인. 변경 파일만 명시해 스테이징

상태 변경만으로 배포가 즉시 바뀌지는 않습니다. 준비 중 항목도 일부 목록에 표시됩니다. 상태 정의·화면별 노출·운영 검증은 [09. 공개 운영 가이드](./09-demo-status-and-stepwise-release-guide.md)를 따릅니다.
