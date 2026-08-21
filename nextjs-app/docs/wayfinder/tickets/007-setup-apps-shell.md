# [T07] apps/shell 앱 생성 및 라우팅/rewrites 결합

- **라벨**: `wayfinder:task`
- **상위 지도**: [Wayfinder Map](../map.md)
- **상태**: Blocked
- **선행 티켓**:
  - [T04. 모노레포 워크스페이스 루트 및 @study/docs 패키지 뼈대 구성](./004-setup-monorepo-workspace-root.md)
  - [T05. @study/demos 패키지 구성 및 유효성 검사기 구현](./005-setup-packages-demos.md)
  - [T06. @study/ui 및 @study/docs-render 패키지 구현](./006-setup-shared-ui-and-render-packages.md)
- **차단 중**:
  - [T10. 로컬 및 Vercel 배포 종합 배관 검증 통과](./010-verify-local-and-deployment-plumbing.md)

## Question

학습자에게 단일 사이트로 보이게 하는 정문 역할의 셸(`@study/shell`) 앱을 표준 절차([01. 3-3])에 따라 생성하고 결합 라우팅을 구성한다.

### 작업 목록
1. **셸 앱 초기화**:
   - `create-next-app` 기반 초기화 후 워크스페이스 표준화 (버전 `catalog:` 치환, 포트 3000 고정)
2. **`apps/shell/next.config.ts` 설정**:
   - `outputFileTracingRoot` 워크스페이스 루트 지정
   - `rewrites` 2종 설정:
     - `/zone/:slug/:path*` → `${ZONE_URL}/zone/:slug/:path*`
     - `/demo-static/:slug/:path*` → `${ZONE_URL}/demo-static/:slug/:path*`
3. **라우트 구성**:
   - `src/app/page.tsx`: 루트 README 렌더링
   - `src/app/[...slug]/page.tsx`: 번호 제거 URL 매핑으로 전체 284개 학습 문서 동적 렌더링 (`generateStaticParams`)
   - `src/app/demo/page.tsx`: `/demo` 전체 데모 색인 화면
   - `src/app/demo/[...slug]/page.tsx`: 데모 독립 열람 chrome (제목, 설명, "문서로 돌아가기", iframe 임베드)
4. **환경변수 파일**: `.env.local`에 `ZONE_BASELINE_URL=http://localhost:3001`, `ZONE_CACHE_URL=http://localhost:3002` 선언
