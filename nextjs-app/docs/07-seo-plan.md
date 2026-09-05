# 07. SEO 작업 계획

기술적 SEO의 현재 구현과 남은 운영 검증을 관리한다. 2026-09-05 소스 기준이며 검색 서비스 등록·색인·성능 실측은 이번 문서 점검에서 확인하지 않았다.

## 1. 현재 상태 진단

| 항목 | 소스에서 확인한 상태 |
|---|---|
| 사이트 URL | `packages/demos/src/metadata.ts`의 `siteUrl`: `NEXT_PUBLIC_SITE_URL` 또는 `https://www.learn-nextjs-lab.space` |
| 셸 메타데이터 | `apps/shell/src/lib/seo/`의 config·metadata·json-ld 헬퍼 사용 |
| robots | `/zone/`, `/demo-static/` 크롤링 제외 설정 |
| sitemap | 문서 매니페스트의 비어 있지 않은 slug와 `done` 데모 직접 URL, 홈·색인 포함 |
| JSON-LD | `WebSite`, `LearningResource`, `BreadcrumbList` 생성 코드 존재 |
| OG 이미지 | 셸 기본 `/og-image.png`, 상세 `/og`; zone은 `/zone/{zone}/og` |
| 아이콘 | `icon.svg`, `apple-icon.tsx` |
| 학습 기록 페이지 | `noindex` 설정 |

구현 코드가 있다는 사실은 배포 응답, 검색 색인 또는 검색 결과 노출을 보증하지 않는다.

## 2. 설정 책임과 변경 흐름

- 공유 도메인·locale·OG 크기·형식: `packages/demos/src/metadata.ts`. 셸과 두 zone이 함께 사용한다.
- 셸 이름·설명·제목 템플릿·기본 OG 경로·크롤링 제외 목록: `apps/shell/src/lib/seo/config.ts`.
- 셸 메타데이터와 구조화 데이터: 같은 디렉토리의 `metadata.ts`, `json-ld.ts` 및 `components/seo/JsonLd.tsx`.
- zone별 메타데이터: 공유 `getDemoMetadata()`와 각 앱의 OG 라우트. 현재 zone OG의 page URL은 `/zone/{zone}/...`로 생성된다.

도메인을 변경할 때 공유 기본값과 각 배포 환경의 `NEXT_PUBLIC_SITE_URL` 재정의를 함께 확인한다. 세 앱을 재빌드·재배포한 뒤 canonical·OG·sitemap의 실제 host를 대조한다. 변수 형식과 배포 절차는 [04](./04-vercel-deployment-plan.md)를 따른다.

## 3. 기술적 SEO 체크리스트

아래 항목은 완료 증거를 확보한 뒤 결과·환경·날짜와 함께 갱신한다.

- [ ] 공개 도메인의 metadataBase, canonical, robots, sitemap 응답 확인
- [ ] 셸 `/og`, 두 zone의 OG 라우트와 기본 이미지 응답 확인
- [ ] `/zone/*` 직접 접근과 `/demo/*` 사이의 중복 콘텐츠·canonical 정책 확인. robots disallow만으로 색인 제거가 증명되지는 않음 ([Google 공식 설명](https://developers.google.com/search/docs/crawling-indexing/robots/intro), 확인: 2026-09-05)
- [ ] Google Search Console 등록·소유권·사이트맵 제출 상태 확인
- [ ] 네이버 서치어드바이저 등록·소유권·사이트맵 제출 상태 확인
- [ ] 구조화 데이터 유효성 검사 및 검색엔진 지원 유형 확인
- [ ] LCP·INP·CLS 실측, 폰트·이미지 로딩 점검
- [ ] 404·리다이렉트·미공개 데모 URL 처리 확인

## 4. 콘텐츠 최적화 체크리스트

- [ ] 제목·설명의 의미와 실제 페이지 내용 일치 여부 확인
- [ ] H1/H2 위계, 이미지 alt, 관련 문서·데모 링크 확인
- [ ] 최종 수정일 표시의 필요성과 근거 데이터 검토

학습 본문 변경은 별도 콘텐츠 작업이다. 이번 개발·운영 문서 최신화에서는 수행하지 않는다.

## 5. 보류한 항목

PWA manifest, 작성자 `Organization`·`Person` 스키마, 키워드 마케팅·뉴스레터·경쟁사 분석은 현재 구현 범위에 포함하지 않는다. AI 크롤러의 개별 허용·차단 정책도 운영상 필요가 생길 때 별도 결정한다.

## 6. 실행 순서

1. 현재 배포의 URL·메타데이터·OG·sitemap 응답을 먼저 확인한다.
2. 검색 서비스 등록 여부를 확인하고 미완료 작업을 진행한다.
3. 색인·중복 콘텐츠·성능을 관찰하고 결과에 따라 후속 작업을 정한다.

## 7. 확인 기록

2026-09-01 SEO 구현 기록은 현재 소스와 구분해 보존한다. 당시 도메인 미확정을 전제로 나눴던 계획은 현재 공유 URL 설정과 맞지 않아 위 순서로 정리했다. 검색 서비스 등록 여부는 코드에서 알 수 없으므로 “미착수”로 단정하지 않고 확인 필요로 남겼다.
