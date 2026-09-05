# 개발·운영 문서 최신화 기록

- 확인일: 2026-09-05
- 코드 기준: `bf7290f` (작업 시작 HEAD)
- 범위: 루트·앱 안내 및 작업 규칙, 설계 문서 01~09, ADR·용어·디자인·기여/지원 안내
- 방법: 코드·설정·원본/생성 매니페스트·기존 배포 기록과 공식 자료 대조
- 한계: 새 브라우저 QA, 실제 배포·대시보드·검색 서비스 등록 상태는 확인하지 않았다. 코드·설정·데모 상태·학습 본문은 변경하지 않았다.

## 변경 근거

| 기존 설명 | 근거 | 수정 | 확인 수준 |
|---|---|---|---|
| 전체 데모 done·공개 | `packages/demos/demos.yaml`, `demos-manifest.json`: 241건 중 done 25, stub 216 | 상태 대표 문서 09로 통합 | 두 데이터 대조 |
| 첫 배포 미검증 | 04에 남은 2026-09-01 수동 환경변수 해결 기록 | 첫 배포 기록과 Preview 미확인 분리 | 과거 기록. 현재 환경 재검증 아님 |
| Related Projects 자동 연결이 현재 유일 절차 | 세 앱 next.config와 공식 발표 | 수동 폴백·실제 host 처리·Preview 과제 구분 | 소스 및 공식 자료 |
| 미공개 목록 완전 숨김 | demo-index, DocDemoList, 본문 카드, 허브 | 화면별 목록·실행 분기 표 작성 | 정적 코드 대조 |
| 홈 iframe·전역 검색·테마 토글 구현 | HomePage, RoadmapHero, Header | 현재 UI와 과거 설계 분리 | 정적 코드 대조 |
| 데모 화면 사이드바 없음 | AppFrame, DocTree | 홈·학습 기록만 숨김으로 수정 | 정적 코드 대조 |
| 도메인 미확정·셸 한 파일이 전체 설정 원본 | `packages/demos/src/metadata.ts`, 셸 seo/config | 공유 값·셸 값·환경 재정의 구분 | 정적 코드 대조 |
| 모든 화면에서 오래된 학습 기록 제외 | LearningProgressWidget, inventory, state | 홈과 Drawer 집계 차이 기록 | 정적 코드 대조 |
| 가이드 예시가 isMatched=true 고정 | ExpectedActualPanelProps | 관찰값을 받는 조립 예시로 변경 | 컴포넌트 API 대조 |
| 생성 JSON이 모든 화면의 입력 | demos/src/index.ts의 loadDemos와 metadata.ts import | YAML 직접 조회·생성 JSON 소비를 구분 | 정적 코드 대조 |
| 생성기 경로가 demo-${zone} | gen-stubs의 zone 매핑 | 앱 이름과 zone 슬러그 구분 | 스크립트 대조 |

01~09를 검토했다. 08은 이미 백로그로 명시돼 있어 내용은 유지했다. ADR 9건은 기존 상태를 보존하고 구현 차이가 있는 0006·0007·0008에 메모를 추가했다. DESIGN·기여·triage 안내는 연결 설명을 정리했고 SUPPORT·SECURITY의 정책은 유지했다.

## 공식 출처

확인: 2026-09-05. 공식 기능 설명은 아래 출처, 이 저장소의 실제 동작은 소스·배포 기록을 근거로 삼았다.

- [Related Projects 공식 발표](https://vercel.com/changelog/sync-projects-with-vercel-related-projects): 연결 프로젝트 배포 URL 조회. 저장소의 주입 실패를 제품 전체 제약으로 일반화하지 않음.
- [Git Configuration](https://vercel.com/docs/project-configuration/git-configuration#git.deploymentenabled): 패턴과 복수 규칙 처리. 실제 브랜치 배포 결과는 미확인.

- [Google robots.txt 안내](https://developers.google.com/search/docs/crawling-indexing/robots/intro): 크롤링 제한과 검색 색인 제외의 차이.

## 코드 변경이 필요한 후속 항목

| 우선순위 | 항목 | 다음 검증 시나리오 |
|---|---|---|
| P1 | 문서별 허브 `?run=`의 공개·소속 재검사 없음 | 공개 데모가 있는 허브에서 stub·다른 문서·없는 URL을 각각 선택 |
| P2 | 홈 추천 고정 목록에 상태 필터 없음 | 추천 대상의 공개 상태를 변경한 경우 카드·실행 연결 확인 |
| P2 | 홈 학습 완료 수가 현재 inventory로 제한되지 않음 | 삭제·비공개 전환 기록이 남을 때 Drawer와 홈의 집계 비교 |
| P2 | 히어로가 등록 총수를 Live Demos로 표시 | 등록 수·공개 수를 구분하는 UI 문구와 데이터 검토 |
| P2 | test:guide-audit의 과거 보고서 경로 | runner의 상대 경로 해석·출력 위치를 정비하고 문서 색인과 연결 |
| 확인 필요 | NEXT_PUBLIC_SITE_URL의 빌드 캐시 반영 | 프레임워크 추론·캐시 입력·세 앱의 재배포 메타데이터 확인 |

위 항목은 이번 문서 변경으로 해결됐다고 처리하지 않는다.

## 검증 기록

- 변경 문서의 상대 링크와 해당 문서로 들어오는 링크·앵커 152개: 누락 없음. 코드펜스를 제외한 Markdown 링크를 파일 존재·heading 기준으로 검사했다.
- 02번 코드 탐색 표의 경로 21개: 파일·디렉토리 존재 확인.
- YAML과 생성 JSON 241건: 스키마 6개 필드 전체 일치, done 25·stub 216·wip 0.
- 문서 매니페스트: totalDocs와 docs 배열 길이 모두 284. 학습 기록 대상 수나 상세 라우트 수로 대체하지 않음.
- 문서화한 루트·demos 명령: package.json 스크립트 이름과 실행 위치 대조. 명령을 실행해 기능 통과를 확인한 것은 아님.
- `git diff --check`: 통과.
- 변경 범위: Markdown 24개(기존 23개 수정·이 기록 1개 추가). 학습 본문·코드·설정·생성 JSON은 변경하지 않음.
- 문서만 변경했으므로 앱 빌드·기능 테스트·브라우저 QA·배포는 실행하지 않음.
