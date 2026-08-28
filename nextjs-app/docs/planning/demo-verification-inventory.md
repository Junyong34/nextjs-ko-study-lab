# 데모 검증 전수 인벤토리

[데모 검증 유형 분석 및 개선 설계](../17-demo-verification-type-design.md)와 [전수 점검 절차](../18-demo-verification-audit-playbook.md)에 따른 실행 기록이다. 이 문서는 10개 단위로 누적한다.

## 점검 실행 정보

| 항목 | 값 |
|---|---|
| Git 커밋 | 62ac1a6 |
| 브랜치 | main |
| Next.js 기준 버전 | 16.3.2 |
| 실행 모드 | development |
| 브라우저 | Playwright Chromium, Chrome 151.0.0.0 |
| 운영체제 | macOS 26.0.1 (25A362) |
| 실행 zone·포트 | baseline: 3001, cache: 3002 |
| 캐시 설정 | cacheComponents: true |
| 점검 시작·종료 | 2026-08-28 15:14–15:27 KST (B01) |
| 점검자 | Codex |

실행은 각 URL을 새로 열어 시작했다. 서버 메모리 상태를 쓰는 1번은 끝에서 목록 초기화를 수행했다. 개발 서버의 Network, 브라우저 콘솔, Next DevTools 진단과 접근성 스냅샷을 함께 사용했으며, B01의 정상·실패 증거는 각 상세 기록에 서술했다.

## 작업 배치

| 배치 | 데모 번호 | 상태 |
|---|---:|---|
| B01 | 1–10 | 완료 |
| B02 | 11–20 | 대기 |
| B03 | 21–30 | 대기 |
| B04 | 31–40 | 대기 |
| B05 | 41–50 | 대기 |
| B06 | 51–60 | 대기 |
| B07 | 61–70 | 대기 |
| B08 | 71–80 | 대기 |
| B09 | 81–90 | 대기 |
| B10 | 91–100 | 대기 |
| B11 | 101–110 | 대기 |
| B12 | 111–120 | 대기 |
| B13 | 121–130 | 대기 |
| B14 | 131–140 | 대기 |
| B15 | 141–150 | 대기 |
| B16 | 151–160 | 대기 |
| B17 | 161–170 | 대기 |
| B18 | 171–180 | 대기 |
| B19 | 181–190 | 대기 |
| B20 | 191–200 | 대기 |
| B21 | 201–210 | 대기 |
| B22 | 211–220 | 대기 |
| B23 | 221–230 | 대기 |
| B24 | 231–240 | 대기 |
| B25 | 241 | 대기 |

## 집계

| 항목 | 개수 |
|---|---:|
| 전체 데모 | 241 |
| 점검 완료 | 10 |
| verified | 1 |
| mismatch | 8 |
| unverifiable | 0 |
| execution-error | 0 |
| blocked-by-environment | 1 |

## 데모 목록

| URL | 대표 유형 후보 | 실행 결과 | 가이드 | 데모 예제 | 검증 | 개념 정리 | 최고 심각도 |
|---|---|---|---|---|---|---|---|
| server-actions/basic | 값 비교 | verified | 정상 | 정상 | 정상 | 수정 필요 | low |
| caching/basic | 전후 변화 | mismatch | 수정 반영 | 수정 필요 | 수정 필요 | 수정 반영 | high |
| layouts-and-pages/nested-layouts | 화면 관찰 | mismatch | 정상 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| layouts-and-pages/template-lifecycle | 전후 변화 | mismatch | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| layouts-and-pages/route-groups-layouts | 화면 관찰 | mismatch | 정상 | 정상 | 수정 필요 | 정상 | medium |
| linking-and-navigating/soft-navigation | 화면 관찰 | mismatch | 정상 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| linking-and-navigating/router-prefetch | 외부 도구·환경 확인 | blocked-by-environment | 수정 필요 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| server-client-components/composition | 값 비교 | mismatch | 정상 | 수정 필요 | 수정 필요 | 수정 필요 | high |
| server-client-components/serialization | 값 비교 | mismatch | 정상 | 정상 | 수정 필요 | 수정 필요 | high |
| fetching-data/parallel-fetching | 전후 변화 | mismatch | 정상 | 정상 | 수정 필요 | 수정 필요 | medium |

## 데모별 상세 기록

### server-actions/basic — Server Actions 기본 폼 처리 및 상태 변경

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 2-guides/server-actions.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/server-actions/basic/page.tsx |
| 대표 검증 유형 후보 | 값 비교 |
| 실행 결과 | verified |
| 초기화 방법 | 새 URL 진입 후 목록 초기화 버튼 실행 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | 텍스트를 입력 | “감사 서버 액션 항목” 입력 | 실습 영역 | 예 | 입력값 반영 |
| 2 | 항목 추가 | 항목 추가 버튼 클릭 | 실습 영역·Network | 예 | POST 200 |
| 3 | 등록 목록과 응답 확인 | 목록 1개, 최신 항목, 성공 상태 확인 | 실습·검증 영역 | 예 | 이후 목록 초기화 |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | 서버 Action 호출 | 항목 하나가 서버 응답으로 반영 | 등록된 항목 수 1개와 입력 텍스트 표시 | 값 비교 | 실습 화면 | 등록 목록 | 예 | pass |
| 2 | Action 전송 | POST 요청 성공 | POST /zone/baseline/server-actions/basic → 200 | 외부 도구·환경 확인 | Network | 브라우저 요청 목록 | 예 | pass |

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 아니오 | none | — | 현재 절차 유지 |
| 데모 예제 | 아니오 | none | — | 실제 Server Action과 서버 메모리 응답 사용 |
| 검증 | 아니오 | none | — | 런타임 Network 증거가 화면 결과를 보강함 |
| 개념 정리 | 예 | low | C01 | “0ms 체감 속도”를 제거하거나 측정 범위를 명시 |

#### 증거 파일

- 스크린샷: 별도 저장 없음. 접근성 스냅샷의 전후 목록 상태로 기록.
- Network·콘솔·서버 로그: POST 200, 콘솔 오류 없음.
- 빌드·설정 산출물: baseline Next DevTools 컴파일 이슈 없음.

#### 종합 메모

- 최종 유형 검토 사항: 서버 응답값과 Network 상태를 함께 보여 주는 값 비교형 골든 샘플 후보다.
- 공통화 후보: POST 상태와 반환 레코드 수를 같은 패널에서 항목별로 표현하는 계약.

### caching/basic — use cache 기본 동작 및 revalidateTag 무효화

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | cache |
| 근거 문서 | 1-getting-started/caching.md |
| 진입점 | apps/demo-cache-components/src/app/zone/cache/caching/basic/page.tsx |
| 대표 검증 유형 후보 | 전후 변화 |
| 실행 결과 | mismatch |
| 초기화 방법 | 새 URL 진입, 최초 캐시 ID 기록 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | 초기 캐시 ID 확인 | #8J4LC6 기록 | 실습 영역 | 예 | 생성 시각도 함께 기록 |
| 2 | 새로고침 | ID와 시각 유지 | 실습 영역 | 예 | 캐시 유지 통과 |
| 3 | 캐시 무효화 후 즉시 새 ID 확인 | Action 실행 후 첫 재방문에서는 기존 ID 유지, 다음 재방문에서 #RZ1H43로 변경 | 실습·Network | 예 | 가이드의 “즉시”와 불일치 |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | 일반 새로고침 | 캐시 ID 유지 | #8J4LC6 유지 | 전후 변화 | 실습 화면 | Cache ID | 예 | pass |
| 2 | revalidateTag 후 첫 재방문 | 즉시 새 ID | 기존 #8J4LC6 유지 | 전후 변화 | 실습 화면 | Cache ID | 예 | fail |
| 3 | 재검증 수명주기 | 이후 새 데이터 생성 | 다음 재방문에서 #RZ1H43 | 전후 변화 | 실습 화면·소스 | Cache ID, revalidateTag의 max 프로필 | 예 | observe |
| 4 | Action 요청 | Server Action 성공 | POST /zone/cache/caching/basic → 200 | 외부 도구·환경 확인 | Network | 브라우저 요청 목록 | 예 | pass |

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G03 | max 프로필의 stale-while-revalidate 순서와 재방문 조건을 단계에 명시 |
| 데모 예제 | 예 | medium | D03 | Action 직후·첫 재방문·후속 재방문의 상태 신호를 노출 |
| 검증 | 예 | high | V02, V04 | 캐시 ID가 존재한다는 사실만으로 성공 처리하지 말고 두 행동을 별도 항목으로 비교 |
| 개념 정리 | 예 | high | C01, C02, C03 | “0ms·즉시 삭제”를 수정하고 cacheComponents 기준 설정으로 갱신 |

#### 증거 파일

- 스크린샷: 별도 저장 없음. ID 전후 값은 위 표에 기록.
- Network·콘솔·서버 로그: 무효화 Action POST 200, 브라우저 콘솔 오류 없음.
- 빌드·설정 산출물: cache Next DevTools 컴파일 이슈 없음.

#### 종합 메모

- 최종 유형 검토 사항: 전후 변화형 골든 샘플 후보다. 재검증 완료는 버튼 클릭 시점이 아니라 관찰 순서로 표현해야 한다.
- 외부 근거: 설치된 Next.js 16.3.2 문서는 revalidateTag(tag, “max”)를 stale-while-revalidate로 설명한다.

#### 내용 보강 반영 (2026-08-28)

- 데모의 가이드와 개념 정리에서 “영구 캐싱”, “0ms 지연”, “즉시 새 캐시 ID” 표현을 제거했다.
- 가이드는 무효화 → 첫 재방문(stale 값 반환·백그라운드 재검증 시작) → 재검증 뒤 다음 요청(fresh 값 반환)의 다섯 단계로 보강했다.
- 재현 증거: Action POST 200 뒤 캐시 ID가 #0BBVUG → 첫 재방문 #0BBVUG → 다음 재방문 #J8QVTV 순서로 변했다.
- 캐시 동작은 변경하지 않았다. 즉시 일관성이 학습 목표라면 별도 데모에서 updateTag를 사용하고, 이 데모는 revalidateTag(tag, “max”)의 stale-while-revalidate 사례로 유지한다.
- 남은 수정 대상: 현재 검증 패널은 ID 존재 여부만으로 성공을 표시하므로, 전후 ID와 관찰 단계를 연결하는 검증 UI 보강이 필요하다.

### layouts-and-pages/nested-layouts — 쇼핑몰 GNB 및 사이드바 중첩 레이아웃 (Partial Rendering)

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 1-getting-started/layouts-and-pages.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/layouts-and-pages/nested-layouts/layout.tsx |
| 대표 검증 유형 후보 | 화면 관찰 |
| 실행 결과 | mismatch |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | 검색어 입력 | “러닝화” 입력 | GNB | 예 | 입력값 유지 |
| 2 | 신발 카테고리 이동 | 신발(Shoes) 클릭 | URL·콘텐츠 | 예 | /shoes 이동 |
| 3 | 상위 상태 보존 관찰 | 검색어와 GNB/사이드바 유지 확인 | GNB·사이드바·본문 | 예 | 핵심 화면 동작은 통과 |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | 중첩 레이아웃 상태 | 카테고리 이동 뒤 검색어 유지 | “러닝화”가 /shoes에서도 유지 | 화면 관찰 | 실습 화면 | GNB와 본문 | 아니오 | observe |
| 2 | 런타임 안정성 | hydration 오류 없음 | 서버·클라이언트 시간 포맷 불일치 오류 발생 | 외부 도구·환경 확인 | 브라우저 콘솔 | GnbHeader 렌더링 | 예 | fail |
| 3 | 검증 패널 | 조작 결과를 실제값으로 표시 | 조작 뒤에도 “인터랙션 대기 중” | 화면 관찰 | 검증 패널 | Actual 영역 | 아니오 | fail |

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 아니오 | none | — | 화면 관찰 절차는 실행 가능 |
| 데모 예제 | 예 | high | D01 | 서버·클라이언트에서 다른 locale 시간 렌더링을 제거 |
| 검증 | 예 | medium | V01, V03, V05 | boolean 성공 대신 관찰 대상과 위치를 제시 |
| 개념 정리 | 예 | low | C01 | “완전히·즉각” 같은 측정 불가 단정을 축소 |

#### 증거 파일

- 스크린샷: 별도 저장 없음. /shoes 이동 후 스냅샷에 검색어 유지.
- Network·콘솔·서버 로그: hydration mismatch 콘솔 오류.
- 빌드·설정 산출물: baseline 컴파일 이슈 없음.

#### 종합 메모

- 최종 유형 검토 사항: 화면 관찰형. 보존 여부를 수치 통과로 축약하지 않는 패널이 필요하다.

### layouts-and-pages/template-lifecycle — template.tsx 생명주기 및 인스턴스 재생성

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 1-getting-started/layouts-and-pages.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/layouts-and-pages/template-lifecycle/layout.tsx |
| 대표 검증 유형 후보 | 전후 변화 |
| 실행 결과 | mismatch |
| 초기화 방법 | 새 URL 진입 후 현재 인스턴스 ID 기록 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | 후기 입력·별점 선택 | “template 감사 후기”, 5점 선택 | 실습 영역 | 예 | 글자 수 14자 |
| 2 | 다른 상품 탭 이동 | 오버핏 기모 맨투맨 클릭 | URL·인스턴스 카드 | 예 | /product-2 이동 |
| 3 | 새 인스턴스와 상태 초기화 확인 | #LRZ6S → #JV3CC, 후기 입력 초기화 | 실습 영역 | 예 | 핵심 변화 관찰 |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | template 인스턴스 | 경로 이동 시 새 ID·초기 상태 | 인스턴스 ID 교체, 후기 0자 | 전후 변화 | 실습 화면 | 인스턴스 카드·입력창 | 예 | pass |
| 2 | 가이드 라벨 | 지시 라벨이 실제와 일치 | “2.” 접두어와 점수 표기가 실제 버튼과 다름 | 화면 관찰 | 가이드·실습 | 조작 버튼 | 아니오 | fail |
| 3 | 런타임 안정성 | hydration 오류 없음 | 난수 ID의 서버·클라이언트 불일치 오류 발생 | 외부 도구·환경 확인 | 브라우저 콘솔 | template 인스턴스 렌더링 | 예 | fail |
| 4 | 검증 패널 | 실제 전후 값을 반영 | 조작 뒤에도 “인터랙션 대기 중” | 전후 변화 | 검증 패널 | Actual 영역 | 아니오 | fail |

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | low | G01 | 실제 버튼 라벨과 일치하도록 수정 |
| 데모 예제 | 예 | high | D01 | 서버·클라이언트에서 난수 ID가 달라지지 않게 설계 |
| 검증 | 예 | medium | V01, V03, V05 | 이전·현재 인스턴스 ID와 초기화 상태를 명시 |
| 개념 정리 | 예 | medium | C02 | 실제로 존재하는 상태와 관찰 범위에 맞춤 |

#### 증거 파일

- 스크린샷: 별도 저장 없음. 전후 인스턴스 ID와 글자 수를 스냅샷으로 확인.
- Network·콘솔·서버 로그: random ID hydration mismatch 콘솔 오류.
- 빌드·설정 산출물: baseline 컴파일 이슈 없음.

#### 종합 메모

- 최종 유형 검토 사항: 이전값·현재값·초기화된 필드를 같은 레코드로 다루는 전후 변화형.

### layouts-and-pages/route-groups-layouts — Route Groups를 활용한 다중 루트 레이아웃 분리

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 1-getting-started/layouts-and-pages.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/layouts-and-pages/route-groups-layouts/layout.tsx |
| 대표 검증 유형 후보 | 화면 관찰 |
| 실행 결과 | mismatch |
| 초기화 방법 | 루트 URL 진입 후 /products 리디렉션 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | 상품 카탈로그 확인 | /products와 Shop GNB 확인 | URL·상단 레이아웃 | 예 | 그룹명은 URL에 없음 |
| 2 | 로그인 이동 | 회원 로그인 페이지 클릭 | URL·본문 | 예 | /login, Shop GNB 없음 |
| 3 | 상품 화면 복귀 | 상품 카탈로그 클릭 | URL·상단 레이아웃 | 예 | /products, Shop GNB 복귀 |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | Route Group URL 비노출 | /products에 그룹명 없음 | /products 표시 | 값 비교 | 브라우저 URL | 주소 표시 | 예 | pass |
| 2 | 레이아웃 분리 | /login은 인증 레이아웃, /products는 Shop GNB | 두 화면의 레이아웃 차이 관찰 | 화면 관찰 | 실습 화면 | 상단 영역 | 아니오 | observe |
| 3 | 검증 패널 | 관찰 결과를 안내 | 조작 뒤에도 “인터랙션 대기 중” | 화면 관찰 | 검증 패널 | Actual 영역 | 아니오 | fail |

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 아니오 | none | — | 현재 절차 유지 |
| 데모 예제 | 아니오 | none | — | 실제 라우트와 레이아웃 차이를 사용 |
| 검증 | 예 | medium | V01, V03, V05 | URL과 두 화면의 관찰 단서를 별도 제시 |
| 개념 정리 | 아니오 | none | — | 실행 범위와 일치 |

#### 증거 파일

- 스크린샷: 별도 저장 없음. /login 및 /products 전환 스냅샷.
- Network·콘솔·서버 로그: 콘솔 오류 없음.
- 빌드·설정 산출물: baseline 컴파일 이슈 없음.

#### 종합 메모

- 최종 유형 검토 사항: URL 값 비교와 레이아웃 화면 관찰을 함께 가진 사례다. 대표 유형은 화면 관찰로 둔다.

### linking-and-navigating/soft-navigation — Link vs a 소프트 네비게이션 및 스크롤 제어

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 1-getting-started/linking-and-navigating.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/linking-and-navigating/soft-navigation/page.tsx |
| 대표 검증 유형 후보 | 화면 관찰 |
| 실행 결과 | mismatch |
| 초기화 방법 | 새 URL 진입 후 메모 입력 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | 메모 입력 | “soft navigation 감사 메모” 입력 | 실습 영역 | 예 | 이후 경로에도 유지 |
| 2 | 신상품·베스트 이동 | Link로 /new, /best 이동 | URL·메모 | 예 | 메모와 유지 시간 보존 |
| 3 | scroll=false 링크 확인 | 페이지 하단에서 홈 링크 클릭 | URL·스크롤 | 예 | scrollY 127.5 유지 |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | 소프트 네비게이션 상태 보존 | 메모 유지 | 두 경로에서 입력값 유지 | 화면 관찰 | 실습 화면 | 메모 입력창 | 아니오 | observe |
| 2 | scroll=false | 링크 이동 뒤 스크롤 유지 | 전후 scrollY 127.5 | 전후 변화 | 브라우저 API | page scrollY | 예 | pass |
| 3 | 런타임 안정성 | hydration 오류 없음 | locale 시간 포맷 hydration mismatch 발생 | 외부 도구·환경 확인 | 브라우저 콘솔 | 헤더 렌더링 | 예 | fail |
| 4 | 검증 패널 | 실제 관찰을 반영 | 조작 뒤에도 “인터랙션 대기 중” | 화면 관찰 | 검증 패널 | Actual 영역 | 아니오 | fail |

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 아니오 | none | — | 관찰 순서는 실행 가능 |
| 데모 예제 | 예 | high | D01 | locale 시간 hydration mismatch 제거 |
| 검증 | 예 | medium | V01, V03, V05 | 상태 보존과 스크롤 보존을 별도 관찰 항목으로 표시 |
| 개념 정리 | 예 | high | C01, C02 | “0ms” 및 실제 데모에 없는 오디오·카운터 사례를 제거 |

#### 증거 파일

- 스크린샷: 별도 저장 없음. 경로 이동과 메모 보존 스냅샷.
- Network·콘솔·서버 로그: locale 시간 hydration mismatch 콘솔 오류.
- 빌드·설정 산출물: baseline 컴파일 이슈 없음.

#### 종합 메모

- 최종 유형 검토 사항: 화면 관찰형이지만 scrollY는 부가적인 자동 전후 비교 항목으로 분리 가능하다.

### linking-and-navigating/router-prefetch — useRouter 프로그래밍 네비게이션 및 prefetch 최적화

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 1-getting-started/linking-and-navigating.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/linking-and-navigating/router-prefetch/layout.tsx |
| 대표 검증 유형 후보 | 외부 도구·환경 확인 |
| 실행 결과 | blocked-by-environment |
| 초기화 방법 | 새 URL 진입, Network 요청 목록 비우기 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | prefetch 버튼 실행 | 버튼 클릭 후 UI 성공 문구 확인 | 실습 영역 | 예 | dev Network에는 대상 요청 없음 |
| 2 | deals 경로 이동 | 이동 버튼 클릭 | URL·Network | 예 | 이동 시 RSC 요청 200 |
| 3 | 사전 로드 효과 확인 | prefetch 요청을 비교 | Network | 아니오 | production 환경 필요 |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | 수동 prefetch | 이동 전 대상 payload 요청 | 버튼 뒤 대상 prefetch 요청 없음 | 외부 도구·환경 확인 | Network | 요청 목록 | 아니오 | blocked-by-environment |
| 2 | 실제 경로 이동 | deals 경로 요청 성공 | GET /router-prefetch/deals?_rsc=... → 200 | 값 비교 | Network | 요청 목록 | 예 | pass |
| 3 | UI 성공 상태 | 네트워크 증거와 일치 | 요청 증거 없이 “사전 로드됨” 표시 | 값 비교 | 실습·Network | 상태 문구와 요청 목록 | 예 | fail |
| 4 | 검증 패널 | prefetch 증거 위치 제시 | 일반 “인터랙션 대기” 문구 | 외부 도구·환경 확인 | 검증 패널 | Actual 영역 | 아니오 | fail |

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G03 | production 빌드·실행과 Network 관찰 조건을 명시 |
| 데모 예제 | 예 | medium | D03 | prefetch API 호출 결과와 Network 증거를 구분해 표시 |
| 검증 | 예 | high | V01, V02, V03, V05 | dev에서는 환경 차단 상태, prod에서는 payload 요청 근거를 표시 |
| 개념 정리 | 예 | medium | C01, C02 | “0ms”와 실제 UI에 없는 예시를 관찰 범위로 축소 |

#### 증거 파일

- 스크린샷: 별도 저장 없음. UI의 성공 문구와 Network 결과를 대조해 기록.
- Network·콘솔·서버 로그: prefetch 후 대상 요청 없음, 실제 deals 이동 시 RSC GET 200.
- 빌드·설정 산출물: baseline development 실행. 설치된 Next.js 문서상 prefetch는 production에서 자동 실행됨.

#### 종합 메모

- 검증 불가 사유: production 빌드에서의 prefetch 요청 관찰이 현재 B01 조건에 없다.
- 필요한 환경: production 서버와 Network 캡처.
- 최종 유형 검토 사항: 외부 도구·환경 확인이 대표이며, 결과는 환경 차단과 UI 불일치를 분리해야 한다.

### server-client-components/composition — Server & Client Components 합성 및 경계 분리

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 1-getting-started/server-and-client-components.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/server-client-components/composition/page.tsx |
| 대표 검증 유형 후보 | 값 비교 |
| 실행 결과 | mismatch |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | 초기 찜 수 확인 | 142 확인 | 실습 영역 | 예 | 초기값 일치 |
| 2 | 위시리스트 담기 | 버튼 1회 클릭 | 실습 영역 | 예 | 144로 증가 |
| 3 | RCC 상태 갱신 확인 | 완료 상태와 수치 확인 | 실습 영역 | 예 | 가이드 기대 143과 불일치 |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | 찜 수 증감 | 142 → 143 | 버튼 1회 뒤 142 → 144 | 값 비교 | 실습 화면 | 위시리스트 버튼 | 예 | fail |
| 2 | 상태 갱신 | 찜 완료 상태 | “찜 완료 144” 표시 | 화면 관찰 | 실습 화면 | 위시리스트 버튼 | 아니오 | observe |
| 3 | 검증 패널 | 실제 수치 반영 | 조작 뒤에도 “인터랙션 대기 중” | 값 비교 | 검증 패널 | Actual 영역 | 아니오 | fail |

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 아니오 | none | — | 기대값 143은 정상 구현의 적절한 기준 |
| 데모 예제 | 예 | high | D01 | 상태 updater 내부의 다른 상태 변경을 분리하여 중복 증감 제거 |
| 검증 | 예 | high | V01, V03, V05 | 버튼 전후 실제 수와 기대 수를 직접 비교 |
| 개념 정리 | 예 | high | C01, C02 | 측정하지 않은 0 KB 주장과 실제 구조에 없는 합성 사례를 제거 |

#### 증거 파일

- 스크린샷: 별도 저장 없음. 142와 144가 보이는 전후 스냅샷.
- Network·콘솔·서버 로그: 콘솔 오류 없음.
- 빌드·설정 산출물: 소스상 setLiked updater 안에서 setLikes를 호출함.

#### 종합 메모

- 최종 유형 검토 사항: 화면 값 비교형 골든 샘플 후보다. Strict Mode에서 드러나는 상태 updater 부작용도 함께 해결해야 한다.

### server-client-components/serialization — Props 직렬화(Serialization) 및 전달 경계 검증

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 1-getting-started/server-and-client-components.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/server-client-components/serialization/page.tsx |
| 대표 검증 유형 후보 | 값 비교 |
| 실행 결과 | mismatch |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | 전달 Props 구조 확인 | 원시값·평탄 객체·배열 표시 확인 | 실습 영역 | 예 | JSON-compatible 표기 |
| 2 | 전달받은 Server Action 실행 | 실행 버튼 클릭 | 실습·Network | 예 | 응답 문자열 표시, POST 200 |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | Server Action Props | Action 실행 결과 렌더링 | “[확인] 서버 액션 처리 완료: 직렬화 경계 통과 테스트” | 값 비교 | 실습 화면 | Action 결과 메시지 | 예 | pass |
| 2 | Action 전송 | POST 요청 성공 | POST /zone/baseline/server-client-components/serialization → 200 | 외부 도구·환경 확인 | Network | 브라우저 요청 목록 | 예 | pass |
| 3 | 검증 패널 | 실행 결과 반영 | 조작 뒤에도 “인터랙션 대기 중” | 값 비교 | 검증 패널 | Actual 영역 | 아니오 | fail |
| 4 | 비직렬화 가능 값의 실패 | 실패 사례를 대조 | 화면은 그런 값을 전달하거나 실패시키지 않음 | 값 비교 | 실습·소스 | Props 표시와 컴포넌트 구현 | 아니오 | fail |

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 아니오 | none | — | 현재 Action 실행 절차는 유효 |
| 데모 예제 | 아니오 | none | — | Server Action 전달·실행 자체는 실제 동작 |
| 검증 | 예 | medium | V01, V03, V05 | Action 응답과 직렬화 범위를 항목별로 표시 |
| 개념 정리 | 예 | high | C02 | Date·커스텀 클래스·일반 함수의 성공/실패 대조를 실제 데모와 일치시키거나 설명에서 제거 |

#### 증거 파일

- 스크린샷: 별도 저장 없음. Action 실행 결과 스냅샷.
- Network·콘솔·서버 로그: POST 200, 콘솔 오류 없음.
- 빌드·설정 산출물: baseline 컴파일 이슈 없음.

#### 종합 메모

- 최종 유형 검토 사항: Action 응답은 값 비교, 직렬화 경계의 허용·거부 사례는 별도의 값 비교 항목으로 분리해야 한다.

### fetching-data/parallel-fetching — Promise.all 병렬 데이터 패칭 vs 직렬 Waterfall 대조

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 1-getting-started/fetching-data.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/fetching-data/parallel-fetching/page.tsx |
| 대표 검증 유형 후보 | 전후 변화 |
| 실행 결과 | mismatch |
| 초기화 방법 | 새 URL 진입 후 직렬·병렬 버튼을 순서대로 실행 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | 직렬 Waterfall 실행 | 순차 버튼 클릭 | 실습·Network | 예 | 총 1,403ms |
| 2 | 병렬 Promise.all 실행 | 병렬 버튼 클릭 | 실습·Network | 예 | 총 801ms |
| 3 | 시간 대조 | 약 40% 단축 확인 | 실습 영역 | 예 | 관측값 기준 약 42.9% |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | 직렬 시간 | 약 1,400ms | 총 1,403ms, 602ms + 801ms | 값 비교 | 실습 화면 | 결과 타임라인 | 예 | pass |
| 2 | 병렬 시간 | 약 800ms | 총 801ms, 두 요청의 최대값 | 값 비교 | 실습 화면 | 결과 타임라인 | 예 | pass |
| 3 | Server Action 요청 | 각 실행 요청 성공 | POST 2회 모두 200 | 외부 도구·환경 확인 | Network | 브라우저 요청 목록 | 예 | pass |
| 4 | 검증 패널 | 두 실행값을 비교 | 조작 뒤에도 “인터랙션 대기 중” | 전후 변화 | 검증 패널 | Actual 영역 | 아니오 | fail |

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 아니오 | none | — | 실제 측정 범위와 일치 |
| 데모 예제 | 아니오 | none | — | 실제 Server Action 지연 측정값을 사용 |
| 검증 | 예 | medium | V01, V03, V05 | 직렬·병렬 측정값과 계산된 단축률을 패널에 연결 |
| 개념 정리 | 예 | medium | C02 | 300/400ms 사용자·주문 시나리오를 실제 600/800ms 상품·추천 시나리오와 일치 |

#### 증거 파일

- 스크린샷: 별도 저장 없음. 직렬·병렬 결과 스냅샷.
- Network·콘솔·서버 로그: POST 2회 모두 200, 콘솔 오류 없음.
- 빌드·설정 산출물: baseline 컴파일 이슈 없음.

#### 종합 메모

- 최종 유형 검토 사항: 전후 변화형의 골든 샘플 후보다. 이 데모는 정량 주장을 실제 측정값으로 뒷받침할 수 있다.

## B01 공통 발견

- 3번부터 10번까지의 검증 푸터는 대부분 props 없이 렌더링되어 조작 후에도 공통 “인터랙션 대기 중” 문구를 표시했다. 이는 V01, V03, V05의 반복 후보다.
- 화면 관찰형은 성공 boolean보다 관찰 대상과 위치를 기록하는 구조가 필요하다.
- 캐시와 prefetch는 개발·프로덕션과 재검증 순서가 판정의 전제이므로, 환경 조건을 가이드와 검증에 명시해야 한다.
- 8번의 상태 updater 부작용, 3·4·6번의 hydration mismatch는 검증 UI 교체와 별도로 우선 수정할 데모 결함이다.
