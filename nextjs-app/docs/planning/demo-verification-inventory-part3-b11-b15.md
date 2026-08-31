# 데모 검증 인벤토리 — B11–B15 (데모 101–150)

[전체 인덱스](./demo-verification-inventory.md)로 돌아가기. 이 문서는 데모 101-150번(B11-B15)의 상세 기록만 담는다. 전체 집계와 데모 목록 요약표는 인덱스 문서를 참고한다.

## 데모별 상세 기록

### 101. guides/multi-tenant/subdomain-tenant — 서브도메인 기반 테넌트 분기 및 브랜드 테마

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `2-guides/multi-tenant.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/guides/multi-tenant/subdomain-tenant/page.tsx` |
| 대표 검증 유형 후보 | 화면 관찰 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [테넌트 A (블루 테마)] 서브도메인 초기 상태 확인 | 테넌트 A 박스 확인 | 실습 영역 | 예 | 파란색 박스 |
| 2 | [테넌트 B (퍼플 테마)] 버튼 클릭 | `[테넌트 B (퍼플 테마)]` 클릭 | 실습 영역 | 예 | 보라색 박스로 변경 |
| 3 | 테넌트별 독립 브랜드명 및 전용 레이아웃 분기 관찰 | 브랜드 변경 관찰 | 실습 영역 | 아니오 | 미들웨어 rewrite 없는 `useState` 문자열 전환 (`D02`, `D03`) |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | 서브도메인 라우트 리라이트 | 미들웨어 호스트 헤더 감지 및 `/_tenants/[tenant]` rewrites | `useState('brand-a')` 로컬 상태 토글 | 화면 관찰 | 소스 코드 | `MultiTenantDemo.tsx` | 예 | fail |
| 2 | 검증 푸터 연동 | 테넌트 식별자 및 브랜드 테마 상태 전달 | props 누락으로 대기 중 고정 | 화면 관찰 | 검증 패널 | `VerificationFooter` | 아니오 | fail |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | low | G01 | 호스트 헤더 시뮬레이션 및 테넌트 분기 관찰로 보강 |
| 데모 예제 | 예 | high | D02, D03 | 실제 호스트 헤더 파싱 또는 Server Action을 통한 동적 테넌트 레이아웃 분기 구현 |
| 검증 | 예 | high | V01, V03, V05 | 테넌트 호스트 및 테마 토큰 검증 패널 바인딩 |
| 개념 정리 | 예 | low | C01 | `0ms 내부 경로 rewrites` 단정 문구 정리 |

#### 증거 파일 및 종합 메모
- 소스: `MultiTenantDemo.tsx` (17줄짜리 단순 UI)
- 종합 메모: 미들웨어 기반 멀티테넌시 시뮬레이션으로 보강 필요.

---

### 102. guides/multi-tenant/isolated-branding — 테넌트별 로고/컬러 동적 주입

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `2-guides/multi-tenant.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/guides/multi-tenant/isolated-branding/page.tsx` |
| 대표 검증 유형 후보 | 화면 관찰 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [러닝화 (#001)] 또는 [윈드브레이커 (#002)] 상품 선택 | `[러닝화 (#001)]` 클릭 | 실습 영역 | 예 | 로컬 로그 추가 |
| 2 | [+] 또는 [-] 버튼으로 주문 수량 설정 | `[+]` 클릭 | 실습 영역 | 예 | 수량 변경 |
| 3 | [동작 실행] 클릭으로 테넌트 맞춤형 API 트리거 | `[동작 실행]` 클릭 | 실습 영역 | 아니오 | 로고/컬러 주입 없는 더미 로그 (`D02`) |
| 4 | 테넌트 전용 로고 및 테마 토큰 격리 렌더링 관찰 | 테넌트 렌더링 관찰 | 실습 영역 | 아니오 | 범용 템플릿 문자열 |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | 동적 CSS Variables 브랜딩 | `--primary-color`, `--logo-url` 인라인 스타일 주입 | 브랜딩 토큰 주입 코드 0줄, 범용 상품 더미 템플릿 | 화면 관찰 | 소스 코드 | `IsolatedBrandingDemo.tsx` | 예 | fail |
| 2 | 검증 푸터 연동 | 테넌트 브랜딩 주입 결과 반영 | props 미전달로 대기 중 고정 | 화면 관찰 | 검증 패널 | `VerificationFooter` | 아니오 | fail |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G01, G02 | 테넌트 디자인 토큰(CSS Variables) 및 로고 교체 관찰로 개편 |
| 데모 예제 | 예 | high | D02, D03 | 범용 템플릿 폐기, CSS 변수 동적 주입 및 화이트라벨 브랜딩 실습 구현 |
| 검증 | 예 | high | V01, V03, V05 | 주입된 CSS Variables 및 로고 에셋 URL 검증 패널 연결 |
| 개념 정리 | 예 | low | C01 | SSR CSS Variables 주입의 런타임 성능 이점 기술 |

#### 증거 파일 및 종합 메모
- 소스: `IsolatedBrandingDemo.tsx`
- 종합 메모: 범용 상품 템플릿 복제본.

---

### 103. guides/multi-zones/cross-zone-routing — 셸에서 존으로의 rewrites 라우팅 (Multi-zones)

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `2-guides/multi-zones.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/guides/multi-zones/cross-zone-routing/page.tsx` |
| 대표 검증 유형 후보 | 외부 도구·환경 확인 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택 | `[러닝화 (#001)]` 클릭 | 실습 영역 | 예 | 로컬 로그 추가 |
| 2 | [+] 수량 조작으로 크로스 존 요청 준비 | `[+]` 클릭 | 실습 영역 | 예 | 수량 변경 |
| 3 | [동작 실행] 클릭으로 존 간 프록시 통신 실행 | `[동작 실행]` 클릭 | 실습 영역 | 아니오 | 크로스 존 통신 없는 더미 로그 (`D02`) |
| 4 | 크로스 존 리라이트 및 독립 빌드 앱 간 통합 렌더링 관찰 | 존 통합 관찰 | 실습 영역 | 아니오 | 범용 템플릿 문자열 |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | Multi-zones Cross-zone Routing | `next.config.ts` rewrites를 통한 타 존(`demo-cache-components`) 프록시 | 멀티존 프록시 코드 0줄, 범용 상품 더미 템플릿 | 외부 도구·환경 확인 | 소스 코드 | `MultiZonesDemo.tsx` | 예 | fail |
| 2 | 검증 푸터 연동 | 존 라우팅 결과 반영 | props 미전달로 대기 중 고정 | 화면 관찰 | 검증 패널 | `VerificationFooter` | 아니오 | fail |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G01, G02 | 셸(포트 3000)에서 존(포트 3001/3002)으로의 rewrites 통신 관찰로 수정 |
| 데모 예제 | 예 | high | D02, D03 | 범용 템플릿 폐기, 실제 마이크로 프론트엔드 존 간 rewrites 및 헤더 전달 구현 |
| 검증 | 예 | high | V01, V03, V05 | 타깃 존 포트 및 프록시 응답 헤더 검증 패널 바인딩 |
| 개념 정리 | 예 | low | C01 | Next.js Multi-zones rewrites 설정 스펙 정리 |

#### 증거 파일 및 종합 메모
- 소스: `MultiZonesDemo.tsx`
- 종합 메모: 범용 상품 템플릿 복제본.

---

### 104. guides/instrumentation/server-register-hook — 서버 부팅 register() 실행 훅

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `2-guides/instrumentation.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/guides/instrumentation/server-register-hook/page.tsx` |
| 대표 검증 유형 후보 | 외부 도구·환경 확인 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택 | `[러닝화 (#001)]` 클릭 | 실습 영역 | 예 | 로컬 로그 추가 |
| 2 | [+] 또는 [-] 버튼으로 인스트루멘테이션 이벤트 발생 | `[+]` 클릭 | 실습 영역 | 예 | 수량 변경 |
| 3 | [동작 실행] 클릭으로 서버 이벤트 전송 | `[동작 실행]` 클릭 | 실습 영역 | 아니오 | `register()` 훅 호출 없는 더미 로그 (`D02`) |
| 4 | 서버 부팅 register() 훅 초기화 상태 및 실행 로그 관찰 | 서버 로그 관찰 | 실습 영역 | 아니오 | 범용 템플릿 문자열 |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | `instrumentation.ts` `register()` 실행 | 서버 부팅 시 단 1회 실행된 `register()` 훅 런타임 신호 확인 | `instrumentation.ts` 연동 코드 0줄, 범용 상품 더미 템플릿 | 외부 도구·환경 확인 | 소스 코드 | `InstrumentationDemo.tsx` | 예 | fail |
| 2 | 검증 푸터 연동 | 부팅 훅 초기화 상태 반영 | props 미전달로 대기 중 고정 | 화면 관찰 | 검증 패널 | `VerificationFooter` | 아니오 | fail |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G01, G02 | 서버 기동 시점 `register()` 로그 확인 및 런타임 헬스체크로 개편 |
| 데모 예제 | 예 | high | D02, D03 | 범용 템플릿 폐기, 실제 `instrumentation.ts` 부팅 기록을 노출하는 실습 구현 |
| 검증 | 예 | high | V01, V03, V05 | 서버 부팅 타임스탬프 및 APM 초기화 플래그 검증 패널 바인딩 |
| 개념 정리 | 예 | low | C03 | `experimental.instrumentationHook: true` 설정 요구사항 명시 |

#### 증거 파일 및 종합 메모
- 소스: `InstrumentationDemo.tsx`
- 종합 메모: 범용 상품 템플릿 복제본.

---

### 105. guides/opentelemetry/trace-span — Trace ID 발급 및 Server Component Span

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `2-guides/open-telemetry.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/guides/opentelemetry/trace-span/page.tsx` |
| 대표 검증 유형 후보 | 산출물·설정 확인 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | 생성된 Trace ID(4bf92f3577b34da6...) 확인 및 페이지 렌더링 Span(render /shop/products, 32ms) 측정치 분석 | 고정 카드 확인 | 실습 영역 | 예 | 정적 카드 노출 |
| 2 | DB 쿼리 Span(SELECT * FROM items, 18ms) 병목 진단 관찰 | Span 관찰 | 실습 영역 | 아니오 | 실제 OpenTelemetry SDK 미연동, 하드코딩 텍스트 (`D02`, `D03`) |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | OpenTelemetry Span 계측 | 실제 OpenTelemetry API를 통한 분산 Trace ID 및 Span 측정치 생성 | 하드코딩된 정적 텍스트 (`Trace ID: 4bf92...`, `32ms`, `18ms`) | 산출물·설정 확인 | 소스 코드 | `OpenTelemetryDemo.tsx` | 예 | fail |
| 2 | 검증 푸터 연동 | 동적 Trace/Span 정보 전달 | props 누락으로 대기 중 고정 | 화면 관찰 | 검증 패널 | `VerificationFooter` | 아니오 | fail |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | low | G01 | 실제 Trace ID 생성 및 Span 트리 실측 관찰로 보강 |
| 데모 예제 | 예 | high | D02, D03 | 실제 `@opentelemetry/api`를 호출하여 실시간 Trace ID와 서버 렌더링 Span 계측 시각화 구현 |
| 검증 | 예 | high | V01, V03, V05 | 동적 생성된 Trace ID 및 Span 계측값 검증 패널 바인딩 |
| 개념 정리 | 예 | low | C01 | 32ms/18ms 고정 수치 과장 표현 조정 |

#### 증거 파일 및 종합 메모
- 소스: `OpenTelemetryDemo.tsx` (12줄 정적 UI)
- 종합 메모: OpenTelemetry API 실측형 데모로 전환 필요.

---

### 106. guides/static-exports/client-routing — output: 'export' 빌드 산출물 및 클라이언트 라우팅

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `2-guides/static-exports.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/guides/static-exports/client-routing/page.tsx` |
| 대표 검증 유형 후보 | 외부 도구·환경 확인 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [러닝화 (#001)] 또는 [윈드브레이커 (#002)] 상품 선택 | `[러닝화 (#001)]` 클릭 | 실습 영역 | 예 | 로컬 로그 추가 |
| 2 | [+] 또는 [-] 버튼으로 클라이언트 상태 변경 | `[+]` 클릭 | 실습 영역 | 예 | 수량 변경 |
| 3 | [동작 실행] 클릭으로 클라이언트 핸들러 실행 | `[동작 실행]` 클릭 | 실습 영역 | 아니오 | 정적 수출 라우팅 없는 더미 로그 (`D02`) |
| 4 | 서버리스 정적 HTML 환경 내 클라이언트 라우팅 유지 관찰 | 라우팅 관찰 | 실습 영역 | 아니오 | 범용 템플릿 문자열 |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | `output: 'export'` 정적 라우팅 | 정적 HTML 빌드 산출물 및 SPA 히스토리 네비게이션 검증 | 범용 상품 더미 템플릿 | 외부 도구·환경 확인 | 소스 코드 | `StaticExportsDemo.tsx` | 예 | fail |
| 2 | 검증 푸터 연동 | 정적 배포 호환성 결과 반영 | props 미전달로 대기 중 고정 | 화면 관찰 | 검증 패널 | `VerificationFooter` | 아니오 | fail |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G01, G02 | 정적 내보내기 빌드 제약사항 및 SPA 라우팅 관찰로 개편 |
| 데모 예제 | 예 | high | D02, D03 | 범용 템플릿 폐기, 정적 HTML 생성 및 클라이언트 네비게이션 실습 구현 |
| 검증 | 예 | high | V01, V03, V05 | 정적 내보내기 호환성 플래그 검증 패널 바인딩 |
| 개념 정리 | 예 | low | C03 | `output: 'export'` 사용 시 미지원 기능(Middleware, Server Action 제약 등) 정리 |

#### 증거 파일 및 종합 메모
- 소스: `StaticExportsDemo.tsx`
- 종합 메모: 범용 상품 템플릿 복제본.

---

### 107. guides/static-exports/ssg-catalog — 정적 HTML 카탈로그 사전 생성

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `2-guides/static-exports.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/guides/static-exports/ssg-catalog/page.tsx` |
| 대표 검증 유형 후보 | 산출물·설정 확인 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [러닝화 (#001)] 또는 [윈드브레이커 (#002)] 사전 빌드 품목 확인 | `[러닝화 (#001)]` 클릭 | 실습 영역 | 예 | 로컬 로그 추가 |
| 2 | [+] 수량 조절 후 주문 파라미터 구성 | `[+]` 클릭 | 실습 영역 | 예 | 수량 변경 |
| 3 | [동작 실행] 클릭으로 SSG 주문 액션 테스트 | `[동작 실행]` 클릭 | 실습 영역 | 아니오 | `generateStaticParams` 없는 더미 로그 (`D02`) |
| 4 | 빌드 타임 사전 생성 HTML의 0ms 즉각 서빙 관찰 | 정적 서빙 관찰 | 실습 영역 | 아니오 | 범용 템플릿 문자열 |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | `generateStaticParams` SSG 생성 | 빌드 타임 정적 페이지 생성 파라미터 목록 반환 | `generateStaticParams` 코드 0줄, 범용 상품 더미 템플릿 | 산출물·설정 확인 | 소스 코드 | `SsgCatalogDemo.tsx` | 예 | fail |
| 2 | 검증 푸터 연동 | 사전 빌드된 페이지 목록 전달 | props 미전달로 대기 중 고정 | 화면 관찰 | 검증 패널 | `VerificationFooter` | 아니오 | fail |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G01, G02 | `generateStaticParams` 사전 생성 품목 탐색 절차로 수정 |
| 데모 예제 | 예 | high | D02, D03 | 실제 `generateStaticParams`를 선언한 정적 카탈로그 세그먼트 구현 |
| 검증 | 예 | high | V01, V03, V05 | 빌드 타임 사전 생성 ID 목록 검증 패널 바인딩 |
| 개념 정리 | 예 | low | C01 | `0ms 즉각 응답` 과장 문구 조정 |

#### 증거 파일 및 종합 메모
- 소스: `SsgCatalogDemo.tsx`
- 종합 메모: 범용 상품 템플릿 복제본.

---

### 108. guides/public-pages/terms-ssg — 이용약관 정적 SSG 페이지 생성 및 캐시

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `2-guides/public-static-pages.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/guides/public-pages/terms-ssg/page.tsx` |
| 대표 검증 유형 후보 | 화면 관찰 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [러닝화 (#001)] 또는 [윈드브레이커 (#002)] 상품 선택 | `[러닝화 (#001)]` 클릭 | 실습 영역 | 예 | 약관 데모인데 러닝화 상품 선택 UI 노출 (`G01`, `D02`) |
| 2 | [+] 또는 [-] 버튼으로 수량 변경 | `[+]` 클릭 | 실습 영역 | 예 | 수량 변경 |
| 3 | [동작 실행] 클릭으로 약관 동의 및 주문 처리 | `[동작 실행]` 클릭 | 실습 영역 | 아니오 | 약관 문서 없는 더미 로그 (`D02`) |
| 4 | 100% 정적 HTML 서빙 및 서버 부하 제로 관찰 | 정적 서빙 관찰 | 실습 영역 | 아니오 | 범용 템플릿 문자열 |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | 약관 문서 정적 SSG 렌더링 | 순수 정적 HTML 약관/개인정보처리방침 렌더링 | 약관 문서 내용 0줄, 범용 상품/수량 더미 템플릿 | 화면 관찰 | 소스 코드 | `TermsSsgDemo.tsx` | 예 | fail |
| 2 | 가이드 도메인 일치 | 약관 열람 및 동의 절차 | 가이드에 "러닝화 (#001)", "수량 조절" 등 부적절한 복제 문구 | 화면 관찰 | 가이드 | `page.tsx:15` | 예 | fail |
| 3 | 검증 푸터 연동 | 정적 캐시 HIT 상태 전달 | props 미전달로 대기 중 고정 | 화면 관찰 | 검증 패널 | `VerificationFooter` | 아니오 | fail |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G01, G02 | 약관/방침 정적 문서 열람 및 CDN 캐시 헤더 확인 절차로 전면 개편 |
| 데모 예제 | 예 | high | D02, D03 | 범용 상품 템플릿 폐기, 실제 정적 약관 문서 렌더링 및 캐시 헤더 시연 구현 |
| 검증 | 예 | high | V01, V03, V05 | SSG HTML 크기 및 정적 캐시 상태 검증 패널 바인딩 |
| 개념 정리 | 예 | low | C01 | 공개 정적 페이지의 SSG 캐시 전략 기술 |

#### 증거 파일 및 종합 메모
- 소스: `page.tsx:15` (약관 데모에 상품 수량 가이드 오기), `TermsSsgDemo.tsx`
- 종합 메모: 범용 상품 템플릿 복제본.

---

### 109. guides/analytics/custom-beacon — 상품 클릭 커스텀 이벤트 비콘 전송

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `2-guides/analytics.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/guides/analytics/custom-beacon/page.tsx` |
| 대표 검증 유형 후보 | 외부 도구·환경 확인 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | 초기 비콘 전송 대기 상태 확인 | 버튼 확인 | 실습 영역 | 예 | 비콘 전송 버튼 |
| 2 | [[분석] [구매하기 클릭] 커스텀 비콘 이벤트 전송] 버튼 클릭 | 버튼 클릭 | 실습 영역 | 예 | `setSent(true)` 실행 |
| 3 | 204 No Content 피드백 및 비콘 전송 완료 관찰 | 버튼 텍스트 변경 관찰 | 실습 영역 | 아니오 | `navigator.sendBeacon()` 호출 없이 로컬 상태만 변경 (`D02`, `D03`) |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | `navigator.sendBeacon` 비동기 전송 | `navigator.sendBeacon('/api/analytics', data)` 네트워크 전송 | 비콘 API 호출 0건, `setSent(true)` 단순 상태 토글 | 외부 도구·환경 확인 | 소스 코드 | `AnalyticsBeaconDemo.tsx` | 예 | fail |
| 2 | 검증 푸터 연동 | 비콘 전송 성공(204 No Content) 전달 | props 누락으로 대기 중 고정 | 화면 관찰 | 검증 패널 | `VerificationFooter` | 아니오 | fail |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | low | G01 | 실제 비콘 API 호출 및 Network 패킷 관찰로 보강 |
| 데모 예제 | 예 | high | D02, D03 | 실제 `navigator.sendBeacon()` 호출 및 백엔드 204 응답 로깅 구현 |
| 검증 | 예 | high | V01, V03, V05 | 비콘 페이로드 및 전송 성공 여부 검증 패널 바인딩 |
| 개념 정리 | 예 | low | C01 | 언로드 시점 `sendBeacon` 신뢰성 원리 정리 |

#### 증거 파일 및 종합 메모
- 소스: `AnalyticsBeaconDemo.tsx` (13줄 단순 버튼)
- 종합 메모: 실제 `navigator.sendBeacon` 호출 코드로 보강 필요.

---

### 110. guides/videos/lazy-video-player — 상품 홍보 영상 지연 로딩 및 자동 재생

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `2-guides/videos.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/guides/videos/lazy-video-player/page.tsx` |
| 대표 검증 유형 후보 | 화면 관찰 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | 뷰포트 진입 전 대기 상태(대역폭 보존 중) 확인 | 검은 박스 확인 | 실습 영역 | 예 | 뷰포트 진입 대기 텍스트 |
| 2 | [자동재생 시뮬레이션] 버튼 클릭으로 뷰포트 교차 트리거 | `[자동재생 시뮬레이션]` 클릭 | 실습 영역 | 예 | `setIsPlaying(true)` 실행 |
| 3 | ▶ 4K 고화질 홍보 영상 스트리밍 활성화 및 [일시정지] 관찰 | 텍스트 변경 관찰 | 실습 영역 | 아니오 | Intersection Observer 및 `<video>` 태그 없음 (`D02`, `D03`) |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | Intersection Observer 비디오 지연 재생 | `IntersectionObserver` 진입 감지 시 실제 `<video>` 스트리밍 시작 | `<video>` 태그 없음, 검은 `<div>` 텍스트 토글 | 화면 관찰 | 소스 코드 | `LazyVideoDemo.tsx` | 예 | fail |
| 2 | 검증 푸터 연동 | 뷰포트 교차 및 재생 상태 전달 | props 누락으로 대기 중 고정 | 화면 관찰 | 검증 패널 | `VerificationFooter` | 아니오 | fail |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | low | G01 | 실제 스크롤 진입 또는 Intersection Observer 교차 시뮬레이션 관찰로 보강 |
| 데모 예제 | 예 | high | D02, D03 | 실제 `<video>` 태그와 `useIntersectionObserver` 훅 기반 온디맨드 스트리밍 구현 |
| 검증 | 예 | high | V01, V03, V05 | 뷰포트 교차 여부 및 비디오 재생 상태 검증 패널 바인딩 |
| 개념 정리 | 예 | low | C01 | 비디오 지연 로딩의 LCP/데이터 절감 효과 기술 |

#### 증거 파일 및 종합 메모
- 소스: `LazyVideoDemo.tsx` (17줄짜리 가짜 비디오 박스)
- 종합 메모: 실제 HTML5 `<video>` 및 Intersection Observer 연동 데모로 개편 필요.

---

### 111. file-conventions/layout/state-preservation — 클라이언트 상태 보존 중첩 레이아웃

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `3-api-reference/3.1-file-conventions/layout.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/file-conventions/layout/state-preservation/page.tsx` |
| 대표 검증 유형 후보 | 화면 관찰 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [검색창 입력 유지] 텍스트 수정 | 인풋에 텍스트 입력 | 실습 영역 | 예 | 입력값 반영 |
| 2 | 하위 세그먼트 페이지 전환 | 하위 페이지 이동 시도 | 실습 영역 | 아니오 | 하위 탭/링크 UI 전혀 없음 (`G01`, `D01`) |
| 3 | 레이아웃 상태 유지 확인 | 상태 유지 관찰 시도 | 실습 영역 | 아니오 | 페이지 전환 불가로 상태 보존 검증 불가 |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | 레이아웃 상태 보존 검증 | 하위 서브 라우트 이동 시 인풋 상태 보존 | 하위 라우트 및 네비게이션 링크 부재 (단일 인풋만 존재) | 화면 관찰 | 소스 코드 | `LayoutStatePreserveDemo.tsx` | 예 | fail |
| 2 | 검증 푸터 연동 | 상태 보존 여부 전달 | props 누락으로 대기 중 고정 | 화면 관찰 | 검증 패널 | `VerificationFooter` | 아니오 | fail |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | medium | G01, G02 | 하위 탭 이동 링크 및 레이아웃 상태 보존 관찰 단계로 보강 |
| 데모 예제 | 예 | high | D01, D03 | 실제 `layout.tsx`와 2개 이상의 서브 페이지(`/tab-a`, `/tab-b`)를 구축하여 네비게이션 시연 구현 |
| 검증 | 예 | high | V01, V03, V05 | 라우트 변경 전후 인풋 상태 보존 검증 패널 바인딩 |
| 개념 정리 | 예 | low | C01 | App Router Partial Rendering 및 layout 상태 보존 메커니즘 기술 |

#### 증거 파일 및 종합 메모
- 소스: `LayoutStatePreserveDemo.tsx` (13줄 단순 인풋)
- 종합 메모: 119번 데모처럼 온디스크 서브 라우트 및 `layout.tsx` 구조 구축 필요.

---

### 112. file-conventions/layout/dynamic-category-layout — [category]/layout.tsx 동적 카테고리 레이아웃

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `3-api-reference/3.1-file-conventions/layout.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/file-conventions/layout/dynamic-category-layout/page.tsx` |
| 대표 검증 유형 후보 | 화면 관찰 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택 | `[러닝화 (#001)]` 클릭 | 실습 영역 | 예 | 로컬 로그 추가 |
| 2 | [+] 또는 [-] 수량 조절 | `[+]` 클릭 | 실습 영역 | 예 | 수량 변경 |
| 3 | [동작 실행] 클릭 | `[동작 실행]` 클릭 | 실습 영역 | 아니오 | 동적 레이아웃 전환 없는 더미 로그 (`D02`) |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | `[category]/layout.tsx` 동적 세그먼트 레이아웃 | 카테고리 URL 파라미터별 전용 레이아웃 테마 렌더링 | 동적 레이아웃 파일 없음, 범용 상품 더미 템플릿 | 화면 관찰 | 소스 코드 | `DynamicCategoryLayoutDemo.tsx` | 예 | fail |
| 2 | 검증 푸터 연동 | 카테고리 파라미터 전달 | props 미전달로 대기 중 고정 | 화면 관찰 | 검증 패널 | `VerificationFooter` | 아니오 | fail |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G01, G02 | 동적 카테고리 URL 전환 및 레이아웃 재마운트 관찰로 개편 |
| 데모 예제 | 예 | high | D02, D03 | 범용 템플릿 폐기, 실제 `[category]/layout.tsx` 온디스크 동적 라우트 구조 구현 |
| 검증 | 예 | high | V01, V03, V05 | `params.category` 값 및 레이아웃 테마 검증 패널 바인딩 |
| 개념 정리 | 예 | low | C01 | 동적 세그먼트 레이아웃의 인스턴스 수명주기 설명 |

#### 증거 파일 및 종합 메모
- 소스: `DynamicCategoryLayoutDemo.tsx`
- 종합 메모: 범용 상품 템플릿 복제본.

---

### 113. file-conventions/page/static-and-dynamic — 정적(Static) vs 동적(Dynamic) page.tsx 렌더링

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `3-api-reference/3.1-file-conventions/page.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/file-conventions/page/static-and-dynamic/page.tsx` |
| 대표 검증 유형 후보 | 값 비교 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | 정적 렌더링(SSG) 사양 확인 | Static 카드 확인 | 실습 영역 | 예 | 정적 카드 노출 |
| 2 | 동적 렌더링(SSR) 사양 확인 | Dynamic 카드 확인 | 실습 영역 | 예 | 동적 카드 노출 |
| 3 | 렌더링 모드별 응답 헤더 및 결과 대조 | 응답 헤더 대조 시도 | 실습 영역 | 아니오 | 실제 서버 렌더링/헤더 비교 로직 전무 (`D03`) |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | 정적/동적 렌더링 파이프라인 비교 | 빌드 타임 정적 렌더링 vs 요청 시점 동적 렌더링 타임스탬프 실측 | 정적 텍스트 카드 2개만 렌더링됨 | 값 비교 | 소스 코드 | `StaticDynamicPageDemo.tsx` | 예 | fail |
| 2 | 검증 푸터 연동 | 렌더링 모드별 사양 전달 | props 누락으로 대기 중 고정 | 값 비교 | 검증 패널 | `VerificationFooter` | 아니오 | fail |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | low | G01 | 정적/동적 세그먼트 호출 및 타임스탬프 비교 절차로 보강 |
| 데모 예제 | 예 | high | D02, D03 | 정적 컴포넌트(빌드 타임 고정 시각)와 동적 컴포넌트(`connection()`, 실시간 시각)를 나란히 배치하여 실측 비교 구현 |
| 검증 | 예 | high | V01, V03, V05 | 정적/동적 렌더링 시각 및 캐시 헤더 검증 패널 바인딩 |
| 개념 정리 | 예 | low | C01 | `0ms 서빙` 단정 문구 조정 |

#### 증거 파일 및 종합 메모
- 소스: `StaticDynamicPageDemo.tsx` (17줄 정적 카드)
- 종합 메모: 정적/동적 타임스탬프 실측형 데모로 전환 필요.

---

### 114. file-conventions/page/react-19-use-params — React 19 use(params) & use(searchParams) 언래핑

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `3-api-reference/3.1-file-conventions/page.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/file-conventions/page/react-19-use-params/page.tsx` |
| 대표 검증 유형 후보 | 값 비교 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택 | `[러닝화 (#001)]` 클릭 | 실습 영역 | 예 | 로컬 로그 추가 |
| 2 | [+] 수량 조절 후 [동작 실행] 클릭 | `[동작 실행]` 클릭 | 실습 영역 | 아니오 | React 19 `use()` 언래핑 없는 더미 로그 (`D02`) |
| 3 | 비동기 파라미터 언래핑 결과 확인 | 언래핑 관찰 | 실습 영역 | 아니오 | 범용 템플릿 문자열 |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | React 19 `use(params)` 언래핑 | Promise 파라미터를 React 19 `use()` 훅으로 해소 | `use()` 훅 미사용, 범용 상품 더미 템플릿 | 값 비교 | 소스 코드 | `React19UseParamsDemo.tsx` | 예 | fail |
| 2 | 검증 푸터 연동 | 언래핑된 파라미터 전달 | props 미전달로 대기 중 고정 | 값 비교 | 검증 패널 | `VerificationFooter` | 아니오 | fail |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G01, G02 | `Promise<params>` 비동기 언래핑 관찰로 수정 |
| 데모 예제 | 예 | high | D02, D03 | 범용 템플릿 폐기, 실제 React 19 `use(params)` 및 `use(searchParams)` 호출 데모 구현 |
| 검증 | 예 | high | V01, V03, V05 | 언래핑된 params 객체 및 타입 검증 패널 바인딩 |
| 개념 정리 | 예 | low | C01 | Next.js 15/16의 비동기 params 스펙 정리 |

#### 증거 파일 및 종합 메모
- 소스: `React19UseParamsDemo.tsx`
- 종합 메모: 범용 상품 템플릿 복제본.

---

### 115. file-conventions/loading/nested-segment-loading — 중첩 라우트 세그먼트 로딩 격리

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `3-api-reference/3.1-file-conventions/loading.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/file-conventions/loading/nested-segment-loading/page.tsx` |
| 대표 검증 유형 후보 | 화면 관찰 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | 상위 세그먼트 loading.tsx 동작 확인 및 하위 세그먼트 독립 loading.tsx 확인 | 화면 확인 | 실습 영역 | 예 | 상위 GNB 및 animate-pulse 텍스트 노출 |
| 2 | 세그먼트 격리 렌더링 검증 | 점진적 마운트 관찰 | 실습 영역 | 아니오 | 실제 Suspense/loading.tsx 온디스크 라우트 없음 (`D02`, `D03`) |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | 중첩 `loading.tsx` 스트리밍 | 상위 즉시 렌더링 + 하위 세그먼트 `loading.tsx` 스켈레톤 마운트 | 단일 컴포넌트 내 CSS `animate-pulse` 단순 목업 | 화면 관찰 | 소스 코드 | `NestedSegmentLoadingDemo.tsx` | 예 | fail |
| 2 | 검증 푸터 연동 | 로딩 바운더리 상태 전달 | props 누락으로 대기 중 고정 | 화면 관찰 | 검증 패널 | `VerificationFooter` | 아니오 | fail |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | low | G01 | 하위 서브 라우트 이동 시 로딩 스켈레톤 관찰로 보강 |
| 데모 예제 | 예 | high | D02, D03 | 실제 `loading.tsx`가 포함된 하위 서브 라우트(`/items`) 및 인위적 지연(800ms) 비동기 RSC 구현 |
| 검증 | 예 | high | V01, V03, V05 | 세그먼트별 로딩 완료 시점 검증 패널 바인딩 |
| 개념 정리 | 예 | low | C01 | 중첩 loading.tsx의 React Suspense 바운더리 변환 원리 기술 |

#### 증거 파일 및 종합 메모
- 소스: `NestedSegmentLoadingDemo.tsx` (13줄 정적 목업)
- 종합 메모: 온디스크 `loading.tsx` 서브 라우트 구조로 개편 필요.

---

### 116. file-conventions/error/payment-error-boundary — 결제 세그먼트 에러 캡처 (error.tsx)

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `3-api-reference/3.1-file-conventions/error.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/file-conventions/error/payment-error-boundary/page.tsx` |
| 대표 검증 유형 후보 | 화면 관찰 |
| 실행 결과 | `mismatch` (골든 샘플 후보) |
| 초기화 방법 | 새 URL 진입 또는 목록으로 복귀 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [결제 화면(checkout) 진입하기 →] 클릭 | 링크 클릭 | URL·화면 | 예 | `.../checkout` 라우트로 정상 이동 |
| 2 | [💥 PG 결제 타임아웃 에러 강제 발생] 클릭 | 에러 발생 버튼 클릭 | 실습 영역 | 예 | `throw new Error(...)` 실행되어 `checkout/error.tsx` 바운더리 포착 |
| 3 | [다시 시도 (reset() 실행)] 클릭 | `reset()` 클릭 | 실습 영역 | 예 | `reset()` 실행 후 컴포넌트 복구 시도 |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | `checkout/error.tsx` 바운더리 격리 | 런타임 예외 포착 및 상위 레이아웃 보존 | 실제 `checkout/error.tsx`가 에러 포착하고 다이제스트 및 UI 노출 | 화면 관찰 | 실습 화면/소스 | `checkout/error.tsx` | 예 | pass |
| 2 | `reset()` 복구 콜백 | 컴포넌트 트리 재시도 | `reset()` 버튼 클릭 시 에러 상태 클리어 및 재마운트 | 전후 변화 | 실습 화면 | `checkout/error.tsx:55` | 예 | pass |
| 3 | 메인 진입점 검증 패널 연동 | 에러 포착 상태 전달 | 메인 `page.tsx`에서 props 누락으로 "인터랙션 대기 중" 고정 | 화면 관찰 | 검증 패널 | `page.tsx` | 아니오 | fail |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 아니오 | none | — | 3단계 절차가 실제 온디스크 라우트 및 에러 바운더리와 완벽히 일치 |
| 데모 예제 | 아니오 | none | — | 실제 `checkout/error.tsx` 및 `throw Error` 정상 구현됨 |
| 검증 | 예 | medium | V01, V05 | 메인 `page.tsx` 및 `checkout/page.tsx`의 `VerificationFooter` 상태 전달 보강 |
| 개념 정리 | 아니오 | none | — | Next.js App Router error boundary 스펙과 일치 |

#### 증거 파일 및 종합 메모
- 소스: `checkout/error.tsx`, `checkout/page.tsx`, `page.tsx`
- 종합 메모: **B12의 대표 골든 샘플 후보**. 실제 온디스크 `checkout/error.tsx`와 `reset()`이 훌륭하게 구현되어 있으며, 검증 푸터 props만 보강하면 즉시 `verified`로 승격 가능.

---

### 117. file-conventions/error/reset-recovery — error.tsx reset() 컴포넌트 재시도 복구

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `3-api-reference/3.1-file-conventions/error.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/file-conventions/error/reset-recovery/page.tsx` |
| 대표 검증 유형 후보 | 화면 관찰 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | 에러 트리거 발생 확인 | 초기 상태 점검 | 실습 영역 | 예 | 에러 대기 텍스트 |
| 2 | [다시 시도 (reset() 호출)] 클릭 | 버튼 클릭 | 실습 영역 | 예 | `setRecovered(true)` 실행 |
| 3 | 정상 렌더링 상태 복구 확인 | 복구 관찰 | 실습 영역 | 아니오 | 실제 `error.tsx` 없는 단순 `useState` (`D02`, `D03`) |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | 실제 `error.tsx` reset 복구 | React Error Boundary의 `reset()` 실행 | 116번과 달리 `error.tsx` 파일 부재, `useState(false)` 단순 토글 | 화면 관찰 | 소스 코드 | `ResetRecoveryDemo.tsx` | 예 | fail |
| 2 | 검증 푸터 연동 | 복구 완료 상태 전달 | props 누락으로 대기 중 고정 | 화면 관찰 | 검증 패널 | `VerificationFooter` | 아니오 | fail |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | low | G01 | 에러 발생 -> reset 재시도 복구 과정으로 보강 |
| 데모 예제 | 예 | high | D02, D03 | 116번 패턴을 적용하여 실제 `error.tsx` 및 서브 라우트 기반 재시도 복구 구현 |
| 검증 | 예 | high | V01, V03, V05 | 에러 발생/복구 플래그 검증 패널 바인딩 |
| 개념 정리 | 예 | low | C01 | `reset()`의 React Error Boundary 내부 상태 리셋 원리 기술 |

#### 증거 파일 및 종합 메모
- 소스: `ResetRecoveryDemo.tsx` (14줄 단순 토글)
- 종합 메모: 116번의 온디스크 `error.tsx` 구조를 참조하여 실제 에러 복구형으로 개편 필요.

---

### 118. file-conventions/not-found/programmatic-not-found — notFound() 프로그래밍 트리거

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `3-api-reference/3.1-file-conventions/not-found.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/file-conventions/not-found/programmatic-not-found/page.tsx` |
| 대표 검증 유형 후보 | 화면 관찰 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택 | `[러닝화 (#001)]` 클릭 | 실습 영역 | 예 | 로컬 로그 추가 |
| 2 | [+] 수량 조절 후 [동작 실행] 클릭 | `[동작 실행]` 클릭 | 실습 영역 | 아니오 | `notFound()` 호출 없는 더미 로그 (`D02`) |
| 3 | 404 상태 및 not-found.tsx 전환 확인 | 404 화면 관찰 | 실습 영역 | 아니오 | 범용 템플릿 문자열 |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | `notFound()` 프로그래밍 트리거 | Next.js `notFound()` 호출 시 404 HTTP 상태 및 `not-found.tsx` 렌더링 | `notFound()` 호출 코드 0줄, 범용 상품 더미 템플릿 | 화면 관찰 | 소스 코드 | `ProgrammaticNotFoundDemo.tsx` | 예 | fail |
| 2 | 검증 푸터 연동 | 404 전환 상태 반영 | props 미전달로 대기 중 고정 | 화면 관찰 | 검증 패널 | `VerificationFooter` | 아니오 | fail |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G01, G02 | 미존재 상품 ID 조회 시 `notFound()` 발동 관찰로 수정 |
| 데모 예제 | 예 | high | D02, D03 | 범용 템플릿 폐기, 실제 Server Action/RSC에서 `notFound()`를 호출하여 `not-found.tsx` 화면 전환 구현 |
| 검증 | 예 | high | V01, V03, V05 | 404 HTTP 응답 및 not-found 렌더링 검증 패널 바인딩 |
| 개념 정리 | 예 | low | C01 | `NEXT_NOT_FOUND` 예외 처리 메커니즘 정리 |

#### 증거 파일 및 종합 메모
- 소스: `ProgrammaticNotFoundDemo.tsx`
- 종합 메모: 범용 상품 템플릿 복제본.

---

### 119. file-conventions/template/remount-lifecycle — template.tsx 인스턴스 재생성 및 수명주기

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `3-api-reference/3.1-file-conventions/template.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/file-conventions/template/remount-lifecycle/page.tsx` |
| 대표 검증 유형 후보 | 화면 관찰 |
| 실행 결과 | `mismatch` (골든 샘플 후보) |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [경로 이동해도 유지됨...] 및 [경로 이동 시 초기화됨...] 입력 | layout/template 인풋에 각각 텍스트 입력 | 상단 실습 영역 | 예 | layout(녹색)과 template(보라색) 인풋에 값 정상 입력 |
| 2 | [탭 A 진입 (/tab-a) →] 클릭 | `[탭 A 진입 (/tab-a) →]` 클릭 | 화면·URL | 예 | `/tab-a`로 이동하며 `template.tsx` 재마운트 (마운트 시각 갱신 & 인풋 초기화) |
| 3 | [탭 B 진입 (/tab-b) →] 또는 [탭 B로 이동 →] 클릭 | `[탭 B 진입 (/tab-b) →]` 클릭 | 화면·URL | 예 | layout 인풋 값은 유지되고 template 인풋 값만 리셋됨을 완벽히 확인 |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | `layout.tsx` 상태 보존 | 탭 간 이동 시 layout 인풋 텍스트 유지 | `/tab-a` ↔ `/tab-b` 이동 시 layout 인풋 유지됨 | 화면 관찰 | 실습 화면/소스 | `layout.tsx:18-24` | 예 | pass |
| 2 | `template.tsx` 인스턴스 재생성 | 탭 간 이동 시 template 재마운트 및 입력값 리셋 | 이동 시마다 `mountedAt` 시각 갱신 및 `templateInput` 리셋 확인 | 화면 관찰 | 실습 화면/소스 | `template.tsx:22-31` | 예 | pass |
| 3 | 메인 진입점 검증 패널 연동 | 재마운트 및 상태 보존 전달 | 메인 `page.tsx`에서 props 누락으로 "인터랙션 대기 중" 고정 | 화면 관찰 | 검증 패널 | `page.tsx` | 아니오 | fail |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 아니오 | none | — | 가이드 절차와 실제 `layout.tsx`/`template.tsx`/`/tab-a`/`/tab-b`가 완벽 일치 |
| 데모 예제 | 아니오 | none | — | 실제 온디스크 layout/template 수명주기 대조 구조 훌륭히 완성됨 |
| 검증 | 예 | medium | V01, V05 | `page.tsx`, `tab-a/page.tsx`, `tab-b/page.tsx`의 `VerificationFooter`에 마운트/상태 보존 props 연결 |
| 개념 정리 | 아니오 | none | — | Next.js template vs layout 수명 주기 스펙과 일치 |

#### 증거 파일 및 종합 메모
- 소스: `layout.tsx`, `template.tsx`, `tab-a/page.tsx`, `tab-b/page.tsx`
- 종합 메모: **B12의 대표 골든 샘플 후보**. 온디스크 `layout.tsx`와 `template.tsx`의 동작 차이를 실시간 탭 전환으로 가장 정석적으로 시각화한 모범 사례. 검증 패널 바인딩만 보강하면 즉시 `verified` 전환 가능.

---

### 120. file-conventions/template/input-reset-animation — 진입 애니메이션 및 폼 리셋 (template.tsx)

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `3-api-reference/3.1-file-conventions/template.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/file-conventions/template/input-reset-animation/page.tsx` |
| 대표 검증 유형 후보 | 화면 관찰 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [훌륭한 상품입니다!] 텍스트 입력 수정 | 인풋 텍스트 수정 | 실습 영역 | 예 | 입력값 반영 |
| 2 | 페이지 라우트 전환 실행 | 페이지 전환 시도 | 실습 영역 | 아니오 | 전환할 서브 페이지 및 링크 UI 없음 (`G01`, `D01`) |
| 3 | 인스턴스 리셋 및 애니메이션 재생 확인 | 리셋 관찰 시도 | 실습 영역 | 아니오 | `template.tsx` 파일 부재로 리셋 불가 (`D03`) |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | `template.tsx` CSS 진입 애니메이션 및 리셋 | 서브 라우트 이동 시마다 `template.tsx` 애니메이션 재실행 | 디스크에 `template.tsx` 없음, 단일 `page.tsx` 내 단순 인풋 박스 | 화면 관찰 | 소스 코드 | `TemplateAnimationDemo.tsx` | 예 | fail |
| 2 | 검증 푸터 연동 | 애니메이션 재실행 여부 전달 | props 누락으로 대기 중 고정 | 화면 관찰 | 검증 패널 | `VerificationFooter` | 아니오 | fail |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | medium | G01, G02 | 서브 라우트 전환 링크 및 애니메이션 관찰 절차로 보강 |
| 데모 예제 | 예 | high | D01, D03 | 119번 패턴을 적용하여 실제 `template.tsx` CSS 애니메이션 및 탭 라우트 구현 |
| 검증 | 예 | high | V01, V03, V05 | 애니메이션 재생 횟수 및 폼 리셋 검증 패널 바인딩 |
| 개념 정리 | 예 | low | C01 | template의 언마운트/리마운트에 따른 CSS 애니메이션 리셋 원리 기술 |

#### 증거 파일 및 종합 메모
- 소스: `TemplateAnimationDemo.tsx` (12줄 단순 인풋)
- 종합 메모: 119번 데모를 바탕으로 폼 리셋 및 CSS slide-in 애니메이션 실습 구조로 확장 구현 필요.

---

---

### 121. file-conventions/default/hard-reload-restore — 새로고침(Hard Reload) 시 슬롯 복구

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/3.1-file-conventions/default.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/file-conventions/default/hard-reload-restore/page.tsx |
| 대표 검증 유형 후보 | 전후 변화 / 화면 관찰 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택 | 상품 탭 버튼 클릭 | 실습 영역 | 예 | 로컬 state 변경 |
| 2 | [+] 수량 조절 후 [동작 실행] 클릭 | 수량 버튼 조절 및 동작 실행 클릭 | 실습 영역 | 예 | 가상 로그 기록 |
| 3 | 하드 새로고침 시 슬롯 복원 상태 확인 | 브라우저 F5 새로고침 | 실습 영역 | 예 | 실제 병렬 슬롯(`@slot`) 및 `default.tsx`가 구성되어 있지 않고 전체 페이지가 다시 로드됨 |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | default.tsx 슬롯 복구 | 하드 리로드 시 미매칭 슬롯에 default.tsx 렌더링 | 해당 디렉토리에 `@slot` 및 `default.tsx` 파일 부재 | 전후 변화 | 파일 시스템 | `hard-reload-restore/` | 아니오 | `fail` |
| 2 | 실습 콘솔 동작 | 장바구니 수량 동기화 | 로컬 state 카운터 | 화면 관찰 | 실습 화면 | DefaultHardReloadDemo | 예 | `pass` |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G01, G02 | 슬롯 새로고침 시나리오와 무관한 상품 수량 카운터 조작 대신 실제 `@slot/default.tsx` 테스트 절차로 개편 |
| 데모 예제 | 예 | high | D01, D02, D03 | 실제 병렬 라우트 하위 세그먼트 및 `default.tsx` 컴포넌트 온디스크 구축 |
| 검증 | 예 | high | V01, V02 | 고정 텍스트 대신 실제 슬롯 렌더링 상태 대조 패널로 교체 |
| 개념 정리 | 예 | medium | C01, C03 | Parallel Routes의 새로고침 시 서버 SSR 복구 메커니즘 설명 보강 |

#### 증거 파일 및 종합 메모
- 증거: `apps/demo-baseline/src/app/zone/baseline/file-conventions/default/hard-reload-restore/components/DefaultHardReloadDemo.tsx`에 일반 상품 카운터만 존재.
- 메모: 데모 130의 병렬 슬롯 구조를 참조하여 실제 `@slot/default.tsx` 하위 라우트로 재설계 필요.

---

### 122. file-conventions/route/rest-api-orders — REST GET/POST 주문 API (route.ts)

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/3.1-file-conventions/route.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/file-conventions/route/rest-api-orders/page.tsx |
| 대표 검증 유형 후보 | 값 비교 |
| 실행 결과 | `verified` |
| 초기화 방법 | GET 목록 새로고침 또는 서버 재기동 시 초기 주문 1건 복구 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [러닝화 (#001)], [윈드브레이커 (#002)], [백팩 (#003)] 중 선택 | 상품 라디오 버튼 클릭 | 실습 영역 | 예 | `PROD-001` 선택 |
| 2 | [POST 주문 전송] 클릭 | POST 버튼 클릭 | Network / 실습 영역 | 예 | `POST /api` → 201 Created |
| 3 | [GET 목록 새로고침] 클릭 | GET 버튼 클릭 | Network / 실습 영역 | 예 | `GET /api` → 200 OK, 신규 주문 포함 목록 반영 |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | route.ts POST 핸들러 | 201 Created 및 신규 주문 객체 반환 | HTTP 201, `ORD-2026-002` 생성 | 값 비교 | Network / 서버 | `api/route.ts` | 예 | `pass` |
| 2 | route.ts GET 핸들러 | 200 OK 및 전체 주문 배열 반환 | HTTP 200, `total: 2` 배열 반환 | 값 비교 | Network / 화면 | `api/route.ts` | 예 | `pass` |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 아니오 | none | — | 현재 3단계 절차 및 액션 뱃지 유지 |
| 데모 예제 | 아니오 | none | — | 실제 Web Fetch API 및 NextRequest/NextResponse 완벽 연동 |
| 검증 | 아니오 | none | — | HTTP 상태 코드와 주문 카운트 실시간 연동 유지 |
| 개념 정리 | 예 | low | C03 | Next.js 16 Route Handler의 `export const dynamic` 캐싱 규칙 보강 |

#### 증거 파일 및 종합 메모
- 증거: `api/route.ts`에서 `GET`, `POST` 함수가 정상적으로 선언되어 있고 클라이언트 `fetch()`와 실시간 통신 성공.
- 메모: Route Handler 표준 골든 샘플로 활용 가능.

---

### 123. file-conventions/route/webhook-signature — Webhook 서명 검증 핸들러 (route.ts)

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/3.1-file-conventions/route.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/file-conventions/route/webhook-signature/page.tsx |
| 대표 검증 유형 후보 | 값 비교 |
| 실행 결과 | `verified` |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [1. 정상 서명 웹훅 전송 (200 OK 기대) VALID] 클릭 | 정상 HMAC 서명 웹훅 전송 버튼 클릭 | Network / 실습 영역 | 예 | POST → 200 OK, `verified: true` |
| 2 | [2. 변조된 서명 웹훅 전송 (401 거절 기대) TAMPERED] 클릭 | 변조 서명 웹훅 전송 버튼 클릭 | Network / 실습 영역 | 예 | POST → 401 Unauthorized, 서명 불일치 방어 |
| 3 | 웹훅 처리 결과 및 보안 로그 확인 | 3단 검증 패널 및 응답 JSON 대조 | 검증 패널 / 로그 | 예 | 200/401 분기 결과 정상 표기 |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | 정상 웹훅 서명 검증 | HMAC-SHA256 일치 시 200 OK | HTTP 200, `verified: true` 반환 | 값 비교 | Network / 서버 | `api/route.ts` | 예 | `pass` |
| 2 | 변조 서명 방어 | 서명 불일치 시 401 반환 | HTTP 401, `HMAC-SHA256 서명 불일치` | 값 비교 | Network / 서버 | `api/route.ts` | 예 | `pass` |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 아니오 | none | — | 현재 절차 유지 |
| 데모 예제 | 아니오 | none | — | `crypto.timingSafeEqual` 및 Web Crypto API 서명 생성 구현 완료 |
| 검증 | 아니오 | none | — | HTTP 상태 코드 및 서명 검증 결과 정상 연동 |
| 개념 정리 | 예 | low | C03 | `request.text()` raw body 파싱 시 stream 1회성 소비 주의사항 명시 |

#### 증거 파일 및 종합 메모
- 증거: `api/route.ts`의 `crypto.createHmac('sha256', WEBHOOK_SECRET)` 및 타이밍 공격 방어 코드 확인.
- 메모: 보안 웹훅 핸들러 구현의 모범 사례.

---

### 124. file-conventions/route/sse-stock-stream — SSE 실시간 재고 스트리밍 (route.ts)

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/3.1-file-conventions/route.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/file-conventions/route/sse-stock-stream/page.tsx |
| 대표 검증 유형 후보 | 전후 변화 |
| 실행 결과 | `verified` |
| 초기화 방법 | [스트림 일시중지] 후 [스트림 다시 연결] 클릭 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | SSE 연결 수립 및 실시간 수신 확인 | 페이지 진입 후 자동 스트림 연결 | 실습 영역 | 예 | `text/event-stream` 청크 실시간 수신 (INIT & TICK) |
| 2 | [스트림 일시중지] 클릭 | AbortController 중단 버튼 클릭 | 실습 영역 | 예 | `DISCONNECTED` 상태 전환 및 틱 정지 |
| 3 | [스트림 다시 연결] 클릭 | 재연결 버튼 클릭 | 실습 영역 / 검증 패널 | 예 | 재연결 후 틱 카운트 재개 및 재고 업데이트 |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | ReadableStream SSE 전송 | `text/event-stream` 청크 스트리밍 | HTTP 200, 청크 단위 JSON 푸시 수신 | 전후 변화 | Network / 서버 | `api/route.ts` | 예 | `pass` |
| 2 | 재고 실시간 동기화 | 주기적 틱에 따른 상품 재고 가감 | 틱 수신 시 실시간 카운터 및 화면 UI 갱신 | 전후 변화 | 실습 화면 | SseStockStreamDemo | 예 | `pass` |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 아니오 | none | — | 현재 3단계 절차 유지 |
| 데모 예제 | 아니오 | none | — | `ReadableStream`과 `TextDecoder` 청크 파서 구현 완료 |
| 검증 | 아니오 | none | — | 연결 상태 및 수신 틱 수 실시간 연동 |
| 개념 정리 | 예 | low | C03 | `export const dynamic = 'force-dynamic'` 및 버퍼링 방지 헤더 설명 보강 |

#### 증거 파일 및 종합 메모
- 증거: `api/route.ts`에서 `new Response(stream, { headers: { 'Content-Type': 'text/event-stream' } })` 정상 동작.
- 메모: SSE 스트리밍 표준 골든 샘플.

---

### 125. file-conventions/route-groups/group-url-isolation — URL 영향 없는 라우트 그룹 분리 (route-groups)

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/3.1-file-conventions/route-groups.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/file-conventions/route-groups/group-url-isolation/page.tsx |
| 대표 검증 유형 후보 | 화면 관찰 |
| 실행 결과 | `verified` |
| 초기화 방법 | 데모 진입점 복귀 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [(shop)/products 진입 →] 클릭 | 스토어프론트 링크 클릭 | 브라우저 주소창 / 화면 | 예 | URL이 `/products`로 매핑되며 파란색 전용 레이아웃 적용 |
| 2 | [(marketing)/about 진입 →] 클릭 | 마케팅 링크 클릭 | 브라우저 주소창 / 화면 | 예 | URL이 `/about`으로 매핑되며 보라색 전용 레이아웃 적용 |
| 3 | [홈으로 복귀] 클릭 | 상위 데모 복귀 링크 클릭 | 실습 영역 | 예 | 괄호 그룹명이 URL에서 생략된 채 레이아웃 격리 확인 |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | (shop) URL 세그먼트 생략 | `/products` 경로로 접근 성공 | `(shop)/products/page.tsx` 200 OK | 화면 관찰 | URL / 소스 | `(shop)/` | 예 | `pass` |
| 2 | (marketing) 전용 레이아웃 | `/about` 경로에 보라색 레이아웃 적용 | `(marketing)/layout.tsx` 렌더링 | 화면 관찰 | 화면 / DOM | `(marketing)/` | 예 | `pass` |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 아니오 | none | — | 현재 절차 유지 |
| 데모 예제 | 아니오 | none | — | 실제 `(marketing)` 및 `(shop)` 디렉토리와 전용 layout.tsx 구현 완료 |
| 검증 | 예 | medium | V01 | 서브 라우트 이동 후 메인 검증 영역의 실시간 경로 바인딩 강화 |
| 개념 정리 | 예 | low | C03 | 라우트 그룹 간 동일 파일명 충돌(예: 동일 세그먼트 내 복수 page.tsx) 주의사항 보강 |

#### 증거 파일 및 종합 메모
- 증거: `(marketing)/layout.tsx`, `(shop)/layout.tsx`가 실제 디렉토리에 존재하며 독립 작동.

---

### 126. file-conventions/route-groups/shop-vs-admin-roots — 상점용 vs 관리자용 다중 루트 레이아웃

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/3.1-file-conventions/route-groups.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/file-conventions/route-groups/shop-vs-admin-roots/page.tsx |
| 대표 검증 유형 후보 | 산출물·설정 확인 / 화면 관찰 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | 쇼핑몰 고객 루트 레이아웃 (shop) 및 관리자 (admin) 점검 | 화면에 표시된 2개 카드 확인 | 실습 영역 | 예 | 정적 텍스트 박스만 노출 |
| 2 | 다중 루트 레이아웃 독립성 검증 | 검증 패널 확인 | 검증 패널 | 예 | 실제 `<html>`/`<body>` 분리 동작 미실행 |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | 다중 루트 레이아웃 분리 | 상점용 및 관리자용 독립 html/body 분기 | 단일 페이지 내 정적 목업 텍스트만 표시됨 | 산출물·설정 확인 | 실습 화면 | ShopVsAdminRootsDemo | 아니오 | `fail` |
| 2 | 스펙 설명 일치 | 다중 루트 레이아웃 아키텍처 | 텍스트 박스 2개 정상 표시 | 화면 관찰 | 실습 화면 | 카드 UI | 예 | `observe` |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G01, G02 | 정적 텍스트 확인 대신 실제 루트 레이아웃 분기 탐색 가이드로 수정 |
| 데모 예제 | 예 | high | D02, D03 | 상위 `layout.tsx` 제거 후 `(shop)/layout.tsx`와 `(admin)/layout.tsx` 실제 서브 라우트 구성 |
| 검증 | 예 | high | V01, V02 | 정적 텍스트 일치 판정 제거 및 DOM 트리 검증 연동 |
| 개념 정리 | 예 | medium | C01, C03 | 다중 루트 레이아웃 도입 시 글로벌 CSS 및 폰트 중복 주입 주의점 명시 |

#### 증거 파일 및 종합 메모
- 증거: `ShopVsAdminRootsDemo.tsx`에 17줄의 정적 목업 카드만 존재.

---

### 127. file-conventions/dynamic-segments/single-param — [id] 단일 동적 세그먼트

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/3.1-file-conventions/dynamic-routes.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/file-conventions/dynamic-segments/single-param/page.tsx |
| 대표 검증 유형 후보 | 값 비교 |
| 실행 결과 | `verified` |
| 초기화 방법 | 데모 메인 URL 복귀 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [id] 세그먼트 파라미터 해석 | `/items/PROD-101` 링크 클릭 | 브라우저 주소창 / 화면 | 예 | `params.id = 'PROD-101'` 정상 언랩핑 |
| 2 | 파라미터 기반 데이터 바인딩 | 상품 상세 정보 및 가격 확인 | 실습 화면 | 예 | 에어 플라이트 러닝화 (139,000원) 바인딩 |
| 3 | 클라이언트 라우팅 전환 | `PROD-102`, `PROD-103` 뱃지 클릭 | 실습 화면 / JSON 인스펙터 | 예 | `await params` Promise 즉시 갱신 |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | [id] async params 언랩핑 | `params: Promise<{ id: string }>` 언랩핑 | `{ params: { id: "PROD-101" } }` JSON 출력 | 값 비교 | 화면 / 서버 | `items/[id]/page.tsx` | 예 | `pass` |
| 2 | 동적 상품 데이터 바인딩 | ID에 따른 상품명, 가격 매핑 | `PROD-101` → 139,000원, `PROD-102` → 179,000원 | 값 비교 | 실습 화면 | 상세 카드 | 예 | `pass` |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 아니오 | none | — | 현재 절차 유지 |
| 데모 예제 | 아니오 | none | — | Next.js 16 `await params` 스펙 및 실제 `[id]` 폴더 구조 구현 완료 |
| 검증 | 아니오 | none | — | ID 바인딩 및 파라미터 검증 완료 |
| 개념 정리 | 예 | low | C03 | Next.js 15부터 변경된 async params Promise 표준 설명 보강 |

#### 증거 파일 및 종합 메모
- 증거: `items/[id]/page.tsx`에서 `const { id } = await params` 실제 동작 확인.
- 메모: 동적 세그먼트 표준 골든 샘플.

---

### 128. file-conventions/dynamic-segments/catch-all-slug — [...slug] Catch-all 동적 세그먼트

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/3.1-file-conventions/dynamic-routes.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/file-conventions/dynamic-segments/catch-all-slug/page.tsx |
| 대표 검증 유형 후보 | 값 비교 |
| 실행 결과 | `verified` |
| 초기화 방법 | 데모 메인 URL 복귀 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [...slug] 배열 파라미터 파싱 | `/shop/fashion/shoes/running` 링크 클릭 | 주소창 / 실습 화면 | 예 | `params.slug = ['fashion', 'shoes', 'running']` 수신 |
| 2 | 계층형 브레드크럼 조립 | 화면 상단 네비게이션 경로 확인 | 실습 화면 | 예 | 홈 / 패션/의류 / 신발 / 러닝화 브레드크럼 생성 |
| 3 | 가변 깊이 라우팅 전환 | 1단계(`/fashion`) 및 3단계 경로 전환 | 실습 화면 / JSON 인스펙터 | 예 | 배열 길이 및 깊이(Depth: 1~3) 정상 갱신 |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | [...slug] string[] 배열 파싱 | N단계 세그먼트가 배열로 전달 | `['fashion', 'shoes', 'running']` 배열 파싱 | 값 비교 | 화면 / 서버 | `shop/[...slug]/page.tsx` | 예 | `pass` |
| 2 | 계층형 브레드크럼 생성 | slug 배열을 순회하여 상위 링크 생성 | 3단계 브레드크럼 렌더링 확인 | 화면 관찰 | 실습 화면 | 네비게이션 바 | 예 | `pass` |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 아니오 | none | — | 현재 절차 유지 |
| 데모 예제 | 아니오 | none | — | 실제 `[...slug]` 디렉토리 및 async params 처리 완료 |
| 검증 | 아니오 | none | — | slug 배열 상태 정상 연동 |
| 개념 정리 | 예 | low | C03 | 최소 1개 이상 세그먼트 필수(미매칭 시 404) 제약 명시 |

#### 증거 파일 및 종합 메모
- 증거: `shop/[...slug]/page.tsx`에서 `const { slug } = await params` 구현 및 브레드크럼 렌더링 확인.

---

### 129. file-conventions/dynamic-segments/optional-catch-all — [[...slug]] Optional Catch-all 동적 세그먼트

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/3.1-file-conventions/dynamic-routes.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/file-conventions/dynamic-segments/optional-catch-all/page.tsx |
| 대표 검증 유형 후보 | 값 비교 |
| 실행 결과 | `verified` |
| 초기화 방법 | 데모 메인 URL 복귀 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | 선택적 세그먼트 params.slug 수신 | `/docs` (루트) 링크 클릭 | 주소창 / 실습 화면 | 예 | `params.slug`가 `undefined`로 주입되며 루트 인덱스 표시 |
| 2 | 하위 문서 조건부 렌더링 | `/docs/installation` 및 `/docs/routing/dynamic-routes` 클릭 | 실습 화면 | 예 | 1~2단계 하위 문서 콘텐츠로 즉시 분기 렌더링 |
| 3 | 단일 파일 라우팅 일원화 검증 | 루트 ↔ 하위 경로 간 왕복 탐색 | JSON 인스펙터 / 화면 | 예 | 동일한 `[[...slug]]/page.tsx`에서 모든 경로 처리 확인 |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | 루트 경로 파라미터 처리 | `/docs` 진입 시 `slug = undefined` | `slug = null / undefined` 루트 렌더링 | 값 비교 | 화면 / 서버 | `docs/[[...slug]]/page.tsx` | 예 | `pass` |
| 2 | 심층 하위 경로 처리 | `/docs/routing/dynamic-routes` 진입 | 2개 배열 요소로 분기 렌더링 | 값 비교 | 화면 / 서버 | `docs/[[...slug]]/page.tsx` | 예 | `pass` |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 아니오 | none | — | 현재 절차 유지 |
| 데모 예제 | 아니오 | none | — | 실제 `[[...slug]]` 디렉토리 및 조건부 렌더링 완벽 구현 |
| 검증 | 아니오 | none | — | slug 유무 및 문서 분기 상태 정상 대조 |
| 개념 정리 | 예 | low | C03 | `[...slug]`와의 결정적 차이(루트 매칭 지원) 강조 보강 |

#### 증거 파일 및 종합 메모
- 증거: `docs/[[...slug]]/page.tsx`에서 `slug` 유무에 따른 `root` / 하위 문서 분기 정상 동작.

---

### 130. file-conventions/parallel-routes/conditional-slot — 권한별 조건부 슬롯 분기 (Parallel Routes)

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/3.1-file-conventions/parallel-routes.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/file-conventions/parallel-routes/conditional-slot/page.tsx |
| 대표 검증 유형 후보 | 화면 관찰 |
| 실행 결과 | `verified` |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | 사용자 권한 상태 확인 및 조건부 슬롯 마운트 실행 | 데모 페이지 진입 | 실습 화면 | 예 | `layout.tsx`에서 `{admin}`, `{user}` 슬롯 동시 수신 |
| 2 | 권한별 슬롯 UI 노출 확인 | 하단 그리드 영역 점검 | 실습 화면 | 예 | `@admin/page.tsx` 및 `@user/page.tsx` 컴포넌트가 각각 독립 마운트됨 |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | @admin / @user 병렬 슬롯 마운트 | layout.tsx에서 두 슬롯을 props로 수신하여 렌더링 | `@admin/page.tsx`와 `@user/page.tsx` 실제 DOM 렌더링 | 화면 관찰 | DOM / 소스 | `layout.tsx` | 예 | `pass` |
| 2 | 슬롯 default.tsx 안전장치 | 각 슬롯 폴더 내 default.tsx 존재 | `@admin/default.tsx`, `@user/default.tsx` 존재 | 산출물·설정 확인 | 파일 시스템 | `@admin/`, `@user/` | 예 | `pass` |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 아니오 | none | — | 현재 절차 유지 |
| 데모 예제 | 아니오 | none | — | 실제 병렬 슬롯 폴더 및 layout.tsx 바인딩 구현 완료 |
| 검증 | 예 | medium | V01 | 세션 권한 토글 버튼을 추가하여 실제 조건부 슬롯 교체 검증 연동 |
| 개념 정리 | 예 | low | C03 | 조건부 슬롯 마운트 시 default.tsx의 필수 역할 설명 보강 |

#### 증거 파일 및 종합 메모
- 증거: `layout.tsx`에 `admin?: React.ReactNode, user?: React.ReactNode` props 주입 확인.

---

### 131. file-conventions/parallel-routes/independent-tabs — 독립 탭 네비게이션 슬롯 (Parallel Routes)

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/3.1-file-conventions/parallel-routes.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/file-conventions/parallel-routes/independent-tabs/page.tsx |
| 대표 검증 유형 후보 | 화면 관찰 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | 슬롯 1(@dashboard)의 [요약 지표] 및 [매출 추이] 탭 전환 | 요약 지표 / 매출 추이 버튼 클릭 | 실습 영역 | 예 | 로컬 useState 변경 |
| 2 | 슬롯 2(@metrics)의 [주간 (7d)] 및 [월간 (30d)] 탭 전환 | 주간 / 월간 버튼 클릭 | 실습 영역 | 예 | 로컬 useState 변경 |
| 3 | 병렬 슬롯 간 독립 네비게이션 및 상태 격리 관찰 | 두 슬롯의 탭 동시 전환 관찰 | 실습 영역 | 예 | 실제 URL 세그먼트 변경 없이 React state만 변경됨 |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | 병렬 슬롯 독립 네비게이션 | 각 슬롯이 독립적인 URL 하위 라우트로 탐색 | 실제 `@dashboard`, `@metrics` 폴더 부재 및 `useState` 모사 | 화면 관찰 | 실습 화면 | ParallelIndependentTabsDemo | 아니오 | `fail` |
| 2 | 탭 인터랙션 동작 | 탭 전환 시 내용 변경 | 로컬 state 기반 UI 렌더링 정상 | 화면 관찰 | 실습 화면 | 탭 UI | 예 | `pass` |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G01, G02 | 실제 라우트 이동과 로컬 state 탭 전환의 괴리 수정 |
| 데모 예제 | 예 | high | D02, D03 | 실제 `@dashboard` 및 `@metrics` 병렬 슬롯 하위 라우트로 온디스크 리팩토링 |
| 검증 | 예 | high | V01, V02 | 고정 패널 대신 실제 슬롯 라우팅 상태 대조 패널로 교체 |
| 개념 정리 | 예 | medium | C01, C03 | 병렬 라우트에서의 서브 네비게이션과 URL 상태 보존 원리 설명 |

#### 증거 파일 및 종합 메모
- 증거: `ParallelIndependentTabsDemo.tsx`에서 `const [dashboardTab, setDashboardTab] = useState(...)`로 병렬 라우트를 모사함.

---

### 132. file-conventions/intercepting-routes/direct-vs-modal — 직접 진입 vs 모달 대조 (Intercepting Routes)

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/3.1-file-conventions/intercepting-routes.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/file-conventions/intercepting-routes/direct-vs-modal/page.tsx |
| 대표 검증 유형 후보 | 화면 관찰 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [소프트 네비게이션 (모달 가로채기)] 버튼 클릭 | 모달 가로채기 시뮬레이션 버튼 클릭 | 실습 영역 | 예 | 로컬 state로 모달 박스 렌더링 |
| 2 | [하드 네비게이션 (새로고침/직접 진입)] 버튼 클릭 | 단독 페이지 시뮬레이션 버튼 클릭 | 실습 영역 | 예 | 로컬 state로 단독 박스 렌더링 |
| 3 | 진입 방식별 렌더링 결과 대조 관찰 | 두 모드 결과 비교 | 실습 영역 | 예 | 실제 Next.js 라우팅 없이 단순 상태 토글 |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | (.)photos 가로채기 라우팅 | 소프트 네비게이션 시 모달로 가로채기 | `(.)photos` 디렉토리 없이 `navMode` state로 모사 | 화면 관찰 | 실습 화면 | InterceptingDirectVsModalDemo | 아니오 | `fail` |
| 2 | photos/[id] 직접 진입 | URL 직접 입력 시 단독 페이지 서빙 | 실제 별도 페이지 라우트 미구현 | 화면 관찰 | 실습 화면 | InterceptingDirectVsModalDemo | 아니오 | `fail` |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G01, G02 | 실제 URL 가로채기 탐색 절차로 개편 |
| 데모 예제 | 예 | high | D02, D03 | 실제 `@modal/(.)photos/[id]` 및 `photos/[id]` 서브 라우트 온디스크 구축 |
| 검증 | 예 | high | V01, V02 | 가상 상태 검증을 실제 라우트 인터셉트 검증으로 교체 |
| 개념 정리 | 예 | medium | C01, C03 | `(.)`, `(..)`, `(...)` 세그먼트 레벨별 매칭 규칙 상세화 |

#### 증거 파일 및 종합 메모
- 증거: `InterceptingDirectVsModalDemo.tsx`에 `navMode === 'modal'` 단순 삼항 연산자만 존재.

---

### 133. file-conventions/mdx-components/global-mdx-theme — 글로벌 MDX 스타일 매핑 (mdx-components.tsx)

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/3.1-file-conventions/mdx-components.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/file-conventions/mdx-components/global-mdx-theme/page.tsx |
| 대표 검증 유형 후보 | 산출물·설정 확인 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택 | 상품 탭 클릭 | 실습 영역 | 예 | 보일러플레이트 상품 카운터 |
| 2 | [+] 수량 조절 후 [동작 실행] 클릭 | 수량 조절 및 실행 클릭 | 실습 영역 | 예 | 가상 로그 추가 |
| 3 | 커스텀 MDX 컴포넌트 스타일 적용 확인 | 3단 검증 패널 확인 | 검증 패널 | 예 | 실제 MDX 렌더링 내용 전혀 없음 |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | mdx-components.tsx 매핑 | h1, p, code 태그의 디자인 시스템 커스텀 컴포넌트 변환 | MDX 렌더링 파일 및 컴포넌트 부재 (보일러플레이트 복사본) | 산출물·설정 확인 | 실습 화면 | MdxGlobalThemeDemo | 아니오 | `fail` |
| 2 | 실습 콘솔 동작 | 장바구니 수량 동기화 | 로컬 state 카운터 | 화면 관찰 | 실습 화면 | 카운터 UI | 예 | `pass` |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G01, G02 | MDX 스타일 매핑과 무관한 상품 수량 가이드 전면 개편 |
| 데모 예제 | 예 | high | D01, D02, D03 | 실제 MDX 마크다운 렌더러 및 `mdx-components.tsx` 매핑 데모로 재구현 |
| 검증 | 예 | high | V01, V02 | 보일러플레이트 검증 패널을 MDX 태그 변환 대조 패널로 교체 |
| 개념 정리 | 예 | medium | C01, C03 | Next.js App Router의 루트 레벨 `mdx-components.tsx` 필수 규약 설명 |

#### 증거 파일 및 종합 메모
- 증거: `MdxGlobalThemeDemo.tsx`가 일반 상품 카운터 보일러플레이트 스텁임.

---

### 134. file-conventions/instrumentation/server-boot-log — 서버 부팅 register() 로그 (instrumentation.ts)

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/3.1-file-conventions/instrumentation.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/file-conventions/instrumentation/server-boot-log/page.tsx |
| 대표 검증 유형 후보 | 외부 도구·환경 확인 / 산출물·설정 확인 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택 | 상품 탭 클릭 | 실습 영역 | 예 | 보일러플레이트 카운터 |
| 2 | [+] 수량 조절 후 [동작 실행] 클릭 | 수량 조절 및 실행 클릭 | 실습 영역 | 예 | 가상 로그 추가 |
| 3 | 서버 부팅 및 에러 모니터링 로그 확인 | 검증 패널 확인 | 검증 패널 | 예 | `instrumentation.ts` 부팅 로그 미표시 |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | instrumentation.ts register() | 서버 부팅 시 1회 register() 실행 및 OTel SDK 초기화 | 실제 instrumentation 훅 미구현 (보일러플레이트 스텁) | 산출물·설정 확인 | 실습 화면 | InstrumentationServerLogDemo | 아니오 | `fail` |
| 2 | onRequestError 훅 | 서버 에러 발생 시 에러 로깅 | 에러 캡처 로직 미구현 | 외부 도구·환경 확인 | 실습 화면 | 검증 패널 | 아니오 | `fail` |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G01, G02 | 서버 부팅 생명주기 및 register() 로그 확인 절차로 전면 개편 |
| 데모 예제 | 예 | high | D01, D02, D03 | 실제 `instrumentation.ts` 부팅 로그 및 `onRequestError` 시뮬레이터 구현 |
| 검증 | 예 | high | V01, V02 | 고정 패널을 서버 부팅 로그 대조 패널로 교체 |
| 개념 정리 | 예 | medium | C01, C03 | `experimental.instrumentationHook` 및 Edge/Node.js 런타임 분기 조건 명시 |

#### 증거 파일 및 종합 메모
- 증거: `InstrumentationServerLogDemo.tsx`가 일반 상품 카운터 보일러플레이트 스텁임.

---

### 135. file-conventions/instrumentation/client-timing-metrics — 클라이언트 성능 측정 훅 (instrumentation-client.ts)

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/3.1-file-conventions/instrumentation-client.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/file-conventions/instrumentation/client-timing-metrics/page.tsx |
| 대표 검증 유형 후보 | 외부 도구·환경 확인 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | 클라이언트 타이밍 메트릭 초기화 확인 및 측정 | 화면 메트릭 영역 확인 | 실습 영역 | 예 | 고정된 LCP 620ms, CLS 0.00 텍스트 노출 |
| 2 | 성능 데이터 비동기 전송 검증 | 검증 패널 확인 | 검증 패널 | 예 | 실제 PerformanceObserver 미실행 |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | Web Vitals 실측 수집 | PerformanceObserver를 통한 LCP, CLS, INP 측정 | 고정된 하드코딩 텍스트만 표시 (`• LCP: 620ms (Good)`) | 외부 도구·환경 확인 | 실습 화면 | InstrumentationClientTimingDemo | 아니오 | `fail` |
| 2 | 스펙 설명 일치 | 텔레메트리 메트릭 목록 | 3개 지표 텍스트 노출 | 화면 관찰 | 실습 화면 | 카드 UI | 예 | `observe` |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G01, G02 | 고정 텍스트 관찰 대신 실제 브라우저 성능 API 측정 및 전송 절차로 개편 |
| 데모 예제 | 예 | high | D02, D03 | `PerformanceObserver`를 활용한 실제 웹 바이탈 측정 훅 연동 |
| 검증 | 예 | high | V01, V02 | 고정 문자열 판정 제거 및 실제 수집된 타이밍 데이터 대조 패널로 교체 |
| 개념 정리 | 예 | high | C01, C02, C03 | "0ms 비동기 전송" 과장 문구 제거 및 웹 바이탈 권장 수치 명시 |

#### 증거 파일 및 종합 메모
- 증거: `InstrumentationClientTimingDemo.tsx`에 13줄의 하드코딩된 웹 바이탈 텍스트만 존재.

---

### 136. file-conventions/proxy/gateway-router — 내부 마이크로서비스 프록시 라우팅 (proxy.ts)

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/3.1-file-conventions/proxy.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/file-conventions/proxy/gateway-router/page.tsx |
| 대표 검증 유형 후보 | 산출물·설정 확인 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택 | 상품 탭 클릭 | 실습 영역 | 예 | 보일러플레이트 카운터 |
| 2 | [+] 수량 조절 후 [동작 실행] 클릭 | 수량 조절 및 실행 클릭 | 실습 영역 | 예 | 가상 로그 추가 |
| 3 | 게이트웨이 헤더 주입 및 포워딩 확인 | 검증 패널 확인 | 검증 패널 | 예 | 실제 프록시 라우팅 미수행 |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | proxy.ts 헤더 주입 및 포워딩 | `x-forwarded-host` 및 인증 토큰 주입 후 마이크로서비스 리라이트 | 실제 proxy.ts 미구현 (보일러플레이트 복사본) | 산출물·설정 확인 | 실습 화면 | ProxyGatewayDemo | 아니오 | `fail` |
| 2 | 실습 콘솔 동작 | 장바구니 수량 동기화 | 로컬 state 카운터 | 화면 관찰 | 실습 화면 | 카운터 UI | 예 | `pass` |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G01, G02 | 프록시 게이트웨이 요청/응답 헤더 검증 가이드로 전면 개편 |
| 데모 예제 | 예 | high | D01, D02, D03 | 실제 프록시 리라이트 및 헤더 변환 핸들러 구현 |
| 검증 | 예 | high | V01, V02 | 고정 패널을 프록시 전후 헤더 대조 패널로 교체 |
| 개념 정리 | 예 | medium | C01, C03 | Next.js App Router의 프록시/리라이트 아키텍처 규칙 명시 |

#### 증거 파일 및 종합 메모
- 증거: `ProxyGatewayDemo.tsx`가 일반 상품 카운터 보일러플레이트 스텁임.

---

### 137. file-conventions/forbidden/admin-role-403 — 비관리자 권한 차단 403 화면 (forbidden.tsx)

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/3.1-file-conventions/forbidden.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/file-conventions/forbidden/admin-role-403/page.tsx |
| 대표 검증 유형 후보 | 화면 관찰 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | [일반 고객 (CUSTOMER)] 버튼 클릭 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [일반 고객 (CUSTOMER)] 버튼 선택 | CUSTOMER 버튼 클릭 | 실습 영역 | 예 | `userRole` state = customer |
| 2 | [정산 관리자 페이지 접근 시도] 클릭 | 접근 시도 버튼 클릭 | 실습 영역 | 예 | 로컬 조건부 렌더링으로 403 UI 박스 표시 |
| 3 | [스토어 관리자 (ADMIN)] 선택 후 재시도 | ADMIN 버튼 클릭 후 접근 시도 | 실습 영역 | 예 | 로컬 조건부 렌더링으로 200 OK 박스 표시 |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | forbidden() 함수 및 forbidden.tsx | 권한 미달 시 403 HTTP 상태 코드 및 forbidden.tsx 렌더링 | Next.js `forbidden()` 호출 없이 `accessAttempt && userRole === 'customer'` 삼항 연산자로 모사 | 화면 관찰 | 실습 화면 | ForbiddenRoleDemo | 아니오 | `fail` |
| 2 | 권한별 UI 분기 | CUSTOMER 차단 / ADMIN 승인 | 화면 내 상태별 UI 박스 정상 전환 | 화면 관찰 | 실습 화면 | 결과 박스 | 예 | `pass` |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | medium | G01 | 실제 라우트 진입 시의 forbidden.tsx 렌더링 절차로 보강 |
| 데모 예제 | 예 | high | D02, D03 | 실제 `forbidden()` 함수를 호출하는 서버 컴포넌트 및 `forbidden.tsx` 파일 컨벤션 온디스크 구축 |
| 검증 | 예 | high | V01, V02 | HTTP 403 상태 코드 및 forbidden.tsx 바운더리 활성화 대조 패널로 교체 |
| 개념 정리 | 예 | low | C03 | `forbidden()`이 클라이언트 에러 바운더리가 아닌 파일 컨벤션임을 명확히 설명 |

#### 증거 파일 및 종합 메모
- 증거: `ForbiddenRoleDemo.tsx`에서 Next.js `forbidden()` API를 임포트하거나 호출하지 않고 로컬 `userRole` state로만 분기함.

---

### 138. file-conventions/unauthorized/anonymous-401 — 미인증 세션 401 로그인 요구 화면 (unauthorized.tsx)

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/3.1-file-conventions/unauthorized.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/file-conventions/unauthorized/anonymous-401/page.tsx |
| 대표 검증 유형 후보 | 화면 관찰 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택 | 상품 탭 클릭 | 실습 영역 | 예 | 보일러플레이트 카운터 |
| 2 | [+] 수량 조절 후 [동작 실행] 클릭 | 수량 조절 및 실행 클릭 | 실습 영역 | 예 | 가상 로그 추가 |
| 3 | 401 상태 및 unauthorized.tsx 로그인 화면 확인 | 검증 패널 확인 | 검증 패널 | 예 | `unauthorized.tsx` 화면 미렌더링 |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | unauthorized() 및 unauthorized.tsx | 미인증 시 401 HTTP 상태 코드 및 unauthorized.tsx 렌더링 | 실제 `unauthorized()` 훅 및 파일 미구현 (보일러플레이트 복사본) | 화면 관찰 | 실습 화면 | UnauthorizedSessionDemo | 아니오 | `fail` |
| 2 | 실습 콘솔 동작 | 장바구니 수량 동기화 | 로컬 state 카운터 | 화면 관찰 | 실습 화면 | 카운터 UI | 예 | `pass` |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G01, G02 | 미인증 세션 접근 및 unauthorized.tsx 로그인 유도 절차로 전면 개편 |
| 데모 예제 | 예 | high | D01, D02, D03 | 실제 `unauthorized()` 호출 서버 컴포넌트 및 `unauthorized.tsx` 파일 구축 |
| 검증 | 예 | high | V01, V02 | 고정 패널을 HTTP 401 및 로그인 유도 화면 대조 패널로 교체 |
| 개념 정리 | 예 | low | C03 | Next.js App Router의 `unauthorized()` 파일 컨벤션 스펙 명시 |

#### 증거 파일 및 종합 메모
- 증거: `UnauthorizedSessionDemo.tsx`가 일반 상품 카운터 보일러플레이트 스텁임.

---

### 139. file-conventions/metadata-app-icons/dynamic-favicon — icon.tsx 동적 파비콘 생성

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/3.1-file-conventions/3.1.21-metadata/app-icons.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/file-conventions/metadata-app-icons/dynamic-favicon/page.tsx |
| 대표 검증 유형 후보 | 산출물·설정 확인 |
| 실행 결과 | `verified` |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | icon.tsx 및 apple-icon.tsx 사양 확인 | 화면의 파비콘/터치아이콘 카드 점검 | 실습 영역 | 예 | 32x32 및 180x180 사양 확인 |
| 2 | 동적 메타데이터 아이콘 태그 검증 | HTML head 내 링크 태그 경로 확인 | 인스펙터 / 실습 영역 | 예 | `/icon`, `/apple-icon` 경로 확인 |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | icon.tsx ImageResponse 생성 | 32x32 PNG 파비콘 동적 생성 | `icon.tsx`에서 `ImageResponse`로 32x32 PNG 생성 | 산출물·설정 확인 | 소스 / 파일 | `icon.tsx` | 예 | `pass` |
| 2 | apple-icon.tsx 생성 | 180x180 PNG 애플 터치 아이콘 생성 | `apple-icon.tsx`에서 180x180 PNG 생성 | 산출물·설정 확인 | 소스 / 파일 | `apple-icon.tsx` | 예 | `pass` |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 아니오 | none | — | 현재 절차 유지 |
| 데모 예제 | 아니오 | none | — | 실제 `icon.tsx` 및 `apple-icon.tsx` 완벽 구현 |
| 검증 | 예 | medium | V01 | 실제 생성된 이미지 바이너리 fetch 상태를 검증 패널에 연결 |
| 개념 정리 | 예 | low | C03 | `size` 및 `contentType` export 규약 설명 보강 |

#### 증거 파일 및 종합 메모
- 증거: `apps/demo-baseline/src/app/zone/baseline/file-conventions/metadata-app-icons/dynamic-favicon/icon.tsx`에 실제 ImageResponse 구현 완료.

---

### 140. file-conventions/metadata-manifest/dynamic-pwa-manifest — manifest.ts 동적 매니페스트 출력

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/3.1-file-conventions/3.1.21-metadata/manifest.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/file-conventions/metadata-manifest/dynamic-pwa-manifest/page.tsx |
| 대표 검증 유형 후보 | 산출물·설정 확인 |
| 실행 결과 | `verified` |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | manifest.ts PWA 메타데이터 점검 | 데모 화면의 생성된 매니페스트 JSON 확인 | 실습 영역 | 예 | name, start_url, theme_color 확인 |
| 2 | PWA 웹 매니페스트 엔드포인트 대조 | `manifest.webmanifest` 경로 확인 | 인스펙터 | 예 | `MetadataRoute.Manifest` 데이터 구조 정상 |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | manifest.ts PWA 객체 생성 | `MetadataRoute.Manifest` 타입의 PWA 설정 반환 | `manifest.ts`에서 JSON 반환 함수 export | 산출물·설정 확인 | 소스 / 파일 | `manifest.ts` | 예 | `pass` |
| 2 | PWA 매니페스트 속성 일치 | standalone, theme_color, icons 구성 | JSON 구조 정의 확인 | 값 비교 | 소스 / 화면 | MetadataManifestDemo | 예 | `pass` |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 아니오 | none | — | 현재 절차 유지 |
| 데모 예제 | 아니오 | none | — | 실제 `manifest.ts` 구현 완료 |
| 검증 | 예 | medium | V01 | 실제 `/manifest.webmanifest` 엔드포인트 fetch 검증 연동 |
| 개념 정리 | 예 | low | C03 | PWA 설치 배너 트리거 조건 및 아이콘 크기 규약 명시 |

#### 증거 파일 및 종합 메모
- 증거: `manifest.ts`에서 `export default function manifest(): MetadataRoute.Manifest` 확인.

---

### 141. file-conventions/metadata-og/discount-banner-og — ImageResponse 실시간 할인율 OG 이미지

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/3.1-file-conventions/3.1.21-metadata/opengraph-image.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/file-conventions/metadata-og/discount-banner-og/page.tsx |
| 대표 검증 유형 후보 | 산출물·설정 확인 |
| 실행 결과 | `verified` |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | opengraph-image.tsx 사양 확인 | 실습 화면의 OG 이미지 렌더링 카드 점검 | 실습 영역 | 예 | 1200x630 해상도 및 배너 텍스트 확인 |
| 2 | twitter-image.tsx 사양 확인 | 실습 화면의 트위터 카드 점검 | 실습 영역 | 예 | 1200x600 트위터 전용 이미지 확인 |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | opengraph-image.tsx 생성 | 1200x630 PNG OG 이미지 동적 생성 | `opengraph-image.tsx`에서 `ImageResponse` 반환 | 산출물·설정 확인 | 소스 / 파일 | `opengraph-image.tsx` | 예 | `pass` |
| 2 | twitter-image.tsx 생성 | 트위터 카드 전용 이미지 동적 생성 | `twitter-image.tsx`에서 `ImageResponse` 반환 | 산출물·설정 확인 | 소스 / 파일 | `twitter-image.tsx` | 예 | `pass` |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 아니오 | none | — | 현재 절차 유지 |
| 데모 예제 | 아니오 | none | — | 실제 `opengraph-image.tsx` 및 `twitter-image.tsx` 구현 완료 |
| 검증 | 예 | medium | V01 | 실제 렌더링된 PNG 이미지 바이너리 대조 연동 |
| 개념 정리 | 예 | low | C03 | JSX CSS 서브셋(Satori 지원 속성) 제약 사항 설명 보강 |

#### 증거 파일 및 종합 메모
- 증거: `opengraph-image.tsx` 및 `twitter-image.tsx` 온디스크 구현 확인.

---

### 142. file-conventions/metadata-robots/dynamic-crawler-rules — robots.ts 동적 크롤링 규칙 생성

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/3.1-file-conventions/3.1.21-metadata/robots.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/file-conventions/metadata-robots/dynamic-crawler-rules/page.tsx |
| 대표 검증 유형 후보 | 산출물·설정 확인 |
| 실행 결과 | `verified` |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | robots.ts 크롤러 규칙 점검 | 화면의 userAgent 및 allow/disallow 규칙 확인 | 실습 영역 | 예 | Googlebot 및 전체 봇 규칙 확인 |
| 2 | 사이트맵 및 호스트 메타데이터 확인 | `sitemap` 및 `host` 속성 확인 | 실습 영역 | 예 | 사이트맵 URL 정상 지정 |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | robots.ts 규칙 생성 | `MetadataRoute.Robots` 객체 반환 | `robots.ts`에서 allow/disallow 및 sitemap 반환 | 산출물·설정 확인 | 소스 / 파일 | `robots.ts` | 예 | `pass` |
| 2 | 관리자 경로 차단 규칙 | `/admin/`, `/checkout/` 등 크롤링 차단 | disallow 배열 내 보안 경로 지정 확인 | 값 비교 | 소스 / 화면 | robots.ts | 예 | `pass` |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 아니오 | none | — | 현재 절차 유지 |
| 데모 예제 | 아니오 | none | — | 실제 `robots.ts` 구현 완료 |
| 검증 | 예 | medium | V01 | 실제 `/robots.txt` 엔드포인트 응답 텍스트 검증 연동 |
| 개념 정리 | 예 | low | C03 | 환경별(dev/prod) robots.ts 분기 전략 설명 보강 |

#### 증거 파일 및 종합 메모
- 증거: `robots.ts` 파일 정상 구현 확인.

---

### 143. file-conventions/metadata-sitemap/split-index-sitemaps — generateSitemaps 대규모 인덱스 분할

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/3.1-file-conventions/3.1.21-metadata/sitemap.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/file-conventions/metadata-sitemap/split-index-sitemaps/page.tsx |
| 대표 검증 유형 후보 | 산출물·설정 확인 |
| 실행 결과 | `verified` |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | generateSitemaps() 분할 인덱스 점검 | 상품(0), 카테고리(1), 프로모션(2) ID 확인 | 실습 영역 | 예 | 3개 분할 인덱스 배열 확인 |
| 2 | sitemap(props) 동적 사이트맵 확인 | ID별 URL 목록 및 priority 매핑 확인 | 실습 영역 | 예 | 각 인덱스별 맞춤 사이트맵 생성 확인 |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | generateSitemaps() 분할 | 50,000개 이상 대규모 URL을 인덱스 단위로 분할 | `generateSitemaps()`에서 `[{ id: 0 }, { id: 1 }, { id: 2 }]` export | 산출물·설정 확인 | 소스 / 파일 | `sitemap.ts` | 예 | `pass` |
| 2 | id별 sitemap 생성 | 전달받은 id Promise에 따라 사이트맵 분기 반환 | `sitemapId === 0`일 때 상품 URL 목록 반환 | 값 비교 | 소스 / 화면 | `sitemap.ts` | 예 | `pass` |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 아니오 | none | — | 현재 절차 유지 |
| 데모 예제 | 아니오 | none | — | 실제 `generateSitemaps()` 및 `sitemap()` 구현 완료 |
| 검증 | 예 | medium | V01 | `/sitemap/0.xml` 등 실제 서브 엔드포인트 fetch 검증 연동 |
| 개념 정리 | 예 | low | C03 | 검색엔진 50,000개 URL 및 50MB 사이트맵 제한 규약 명시 |

#### 증거 파일 및 종합 메모
- 증거: `sitemap.ts`에서 `generateSitemaps` 및 async props unwrap 구현 확인.

---

### 144. file-conventions/route-segment-config/dynamic-params-toggle — dynamicParams true vs false 설정

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/3.1-file-conventions/3.1.22-route-segment-config/dynamicParams.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/file-conventions/route-segment-config/dynamic-params-toggle/page.tsx |
| 대표 검증 유형 후보 | 산출물·설정 확인 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택 | 상품 탭 클릭 | 실습 영역 | 예 | 보일러플레이트 카운터 |
| 2 | [+] 수량 조절 후 [동작 실행] 클릭 | 수량 조절 및 실행 클릭 | 실습 영역 | 예 | 가상 로그 추가 |
| 3 | dynamicParams false 시 404 차단 확인 | 검증 패널 확인 | 검증 패널 | 예 | 실제 dynamicParams 분기 미동작 |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | dynamicParams = false 설정 | generateStaticParams 외 ID 요청 시 즉시 404 반환 | 실제 세그먼트 config 미선언 (보일러플레이트 스텁) | 산출물·설정 확인 | 실습 화면 | DynamicParamsToggleDemo | 아니오 | `fail` |
| 2 | 실습 콘솔 동작 | 장바구니 수량 동기화 | 로컬 state 카운터 | 화면 관찰 | 실습 화면 | 카운터 UI | 예 | `pass` |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G01, G02 | `dynamicParams` 404 차단 vs 온디맨드 SSR 검증 절차로 전면 개편 |
| 데모 예제 | 예 | high | D01, D02, D03 | 실제 `generateStaticParams`와 `dynamicParams = false` 서브 라우트 구축 |
| 검증 | 예 | high | V01, V02 | 고정 패널을 미등록 ID 요청 시 404/200 분기 검증 패널로 교체 |
| 개념 정리 | 예 | medium | C01, C03 | SSG 사전 생성 목록 외 요청에 대한 캐싱 정책 설명 보강 |

#### 증거 파일 및 종합 메모
- 증거: `DynamicParamsToggleDemo.tsx`가 일반 상품 카운터 보일러플레이트 스텁임.

---

### 145. file-conventions/route-segment-config/instant-prefetch — 세그먼트 즉시 프리패칭 (instant)

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/3.1-file-conventions/3.1.22-route-segment-config/instant.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/file-conventions/route-segment-config/instant-prefetch/page.tsx |
| 대표 검증 유형 후보 | 산출물·설정 확인 / 외부 도구·환경 확인 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택 | 상품 탭 클릭 | 실습 영역 | 예 | 보일러플레이트 카운터 |
| 2 | [+] 수량 조절 후 [동작 실행] 클릭 | 수량 조절 및 실행 클릭 | 실습 영역 | 예 | 가상 로그 추가 |
| 3 | 0ms 즉시 네비게이션 전환 확인 | 검증 패널 확인 | 검증 패널 | 예 | 실제 프리패치 및 전환 미동작 |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | 세그먼트 instant 프리페치 | 호버 시점 RSC 페이로드 브라우저 캐싱 | 실제 프리페치 설정 미선언 (보일러플레이트 스텁) | 산출물·설정 확인 | 실습 화면 | InstantPrefetchDemo | 아니오 | `fail` |
| 2 | 실습 콘솔 동작 | 장바구니 수량 동기화 | 로컬 state 카운터 | 화면 관찰 | 실습 화면 | 카운터 UI | 예 | `pass` |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G01, G02 | "0ms 즉시 네비게이션" 과장 문구 수정 및 실제 프리페치 관찰 가이드로 개편 |
| 데모 예제 | 예 | high | D01, D02, D03 | 실제 RSC 프리페치 링크 및 네트워크 패킷 검증 데모로 재구현 |
| 검증 | 예 | high | V01, V02 | 고정 패널 대신 Network 탭 RSC 페이로드 수신 대조 패널로 교체 |
| 개념 정리 | 예 | high | C01, C03 | "0ms" 단정 문구 제거 및 브라우저 캐시 히트 메커니즘 명시 |

#### 증거 파일 및 종합 메모
- 증거: `InstantPrefetchDemo.tsx`가 일반 상품 카운터 보일러플레이트 스텁임.

---

### 146. file-conventions/route-segment-config/max-duration-timeout — 주문 정산 배치 maxDuration 타임아웃 제한

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/3.1-file-conventions/3.1.22-route-segment-config/maxDuration.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/file-conventions/route-segment-config/max-duration-timeout/page.tsx |
| 대표 검증 유형 후보 | 산출물·설정 확인 / 외부 도구·환경 확인 |
| 실행 결과 | `blocked-by-environment` |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [러닝화 (#001)] 또는 [윈드브레이커 (#002)] 선택 | 상품 탭 클릭 | 실습 영역 | 예 | 보일러플레이트 카운터 |
| 2 | [+] 수량 조절 후 [동작 실행] 클릭 | 수량 조절 및 실행 클릭 | 실습 영역 | 예 | 가상 로그 추가 |
| 3 | maxDuration 타임아웃 방지 및 200 완료 확인 | 검증 패널 확인 | 검증 패널 | 아니오 | 로컬 개발 서버에서는 Vercel 서버리스 실행 제한 시간(maxDuration)이 적용되지 않음 |

#### 검증 불가 세부 정보
- 검증 불가 사유: `maxDuration`은 Vercel Serverless Function 배포 환경에서만 인프라 레벨 타임아웃 제한으로 강제되며, 로컬 Next.js 개발 서버에서는 검증 불가.
- 필요한 도구·환경: Vercel Production Deployment 및 15초 이상 장기 실행 배치 API.
- 허용 가능한 간접 증거: `export const maxDuration = 60` 소스 코드 선언 및 빌드 산출물 매니페스트 확인.
- 데모 재설계 필요 여부: 예 (로컬 모의 타임아웃 시뮬레이션 및 설정 코드 인스펙터로 재설계).
- 기대 문구 축소 필요 여부: 예 ("Vercel 서버리스 배포 환경 전용 설정" 명시).

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | export const maxDuration | Vercel 함수 타임아웃 60초 설정 | 로컬 개발 서버 환경 제약으로 실제 504/200 검증 불가 | 외부 도구·환경 확인 | 배포 환경 | route config | 아니오 | `unverifiable` |
| 2 | 실습 콘솔 동작 | 장바구니 수량 동기화 | 로컬 state 카운터 | 화면 관찰 | 실습 화면 | 카운터 UI | 예 | `pass` |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G01, G03 | 배포 환경 제약을 명시하고 코드 레벨 설정 검증 절차로 수정 |
| 데모 예제 | 예 | high | D01, D04 | 보일러플레이트 스텁 제거 및 maxDuration 설정값 인스펙터 컴포넌트 구현 |
| 검증 | 예 | high | V01, V05 | 배포 환경 전용 검증 범위 및 소스 설정 대조로 수정 |
| 개념 정리 | 예 | medium | C03 | 플랜별(Hobby: 10s~60s, Pro: 300s, Enterprise: 900s) Vercel 제약 조건 명시 |

#### 증거 파일 및 종합 메모
- 증거: `MaxDurationTimeoutDemo.tsx`가 일반 상품 카운터 보일러플레이트 스텁임.

---

### 147. file-conventions/route-segment-config/runtime-nodejs-edge — nodejs vs edge 런타임 대조

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/3.1-file-conventions/3.1.22-route-segment-config/runtime.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/file-conventions/route-segment-config/runtime-nodejs-edge/page.tsx |
| 대표 검증 유형 후보 | 화면 관찰 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [Edge 런타임 (V8 Isolate)] 버튼 선택 및 특성 점검 | Edge 런타임 버튼 클릭 | 실습 영역 | 예 | Edge 스펙 카드 활성화 (0ms Cold Start 뱃지) |
| 2 | [Node.js 런타임 (풀스택)] 버튼 선택 및 특성 점검 | Node.js 런타임 버튼 클릭 | 실습 영역 | 예 | Node.js 스펙 카드 활성화 (Full Ecosystem 뱃지) |
| 3 | 워크로드별 런타임 최적화 분기 및 사양 대조 | 2개 런타임 비교표 대조 | 실습 영역 | 예 | 실제 런타임 실행 없이 정적 UI 카드 토글 |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | export const runtime 분기 | edge vs nodejs 런타임 엔진 분기 실행 | 실제 별도 런타임 엔드포인트 미호출 (UI 비교 카드만 표시) | 화면 관찰 | 실습 화면 | RuntimeNodejsEdgeDemo | 아니오 | `fail` |
| 2 | 런타임 스펙 카드 대조 | V8 Isolate vs Full Node.js 특성 | 버튼 클릭에 따른 카드 활성화 정상 | 화면 관찰 | 실습 화면 | 스펙 카드 | 예 | `pass` |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | medium | G01 | "0ms 콜드스타트" 단정 표현 수정 및 런타임 특성 대조 가이드로 보강 |
| 데모 예제 | 예 | medium | D02, D03 | 실제 `runtime = 'edge'`와 `runtime = 'nodejs'` API 라우트 엔드포인트를 호출하여 `process.versions` 등 런타임 정보 대조 연동 |
| 검증 | 예 | high | V01, V02 | 고정 패널 대신 실제 호출된 엔드포인트의 런타임 헤더 대조 패널로 교체 |
| 개념 정리 | 예 | high | C01, C03 | "0ms 콜드스타트", "300개 CDN" 과장 문구 제거 및 Node.js 네이티브 API 제약 사항 보강 |

#### 증거 파일 및 종합 메모
- 증거: `RuntimeNodejsEdgeDemo.tsx`에서 실제 런타임 호출 없이 `selectedRuntime === 'edge'` 단순 스타일 토글만 수행.

---

### 148. components/image/blur-placeholder — placeholder='blur' 저용량 블러 미리보기

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/3.2-components/image.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/components/image/blur-placeholder/page.tsx |
| 대표 검증 유형 후보 | 화면 관찰 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | [로드 상태 토글] 버튼 클릭 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | 블러 플레이스홀더 렌더링 확인 | 초기 렌더링 박스 확인 | 실습 영역 | 예 | `blur-xs` CSS 클래스가 적용된 div 확인 |
| 2 | [로드 상태 토글] 클릭 | 토글 버튼 클릭 | 실습 영역 | 예 | 그라디언트 div로 전환 |
| 3 | CLS 방지 및 부드러운 전환 검증 | 레이아웃 이동 여부 확인 | 실습 영역 | 예 | `next/image` 컴포넌트가 아닌 일반 div로 모사됨 |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | next/image placeholder='blur' | Base64 blurDataURL 기반의 저용량 블러 프리뷰 | `next/image` 미사용 (일반 div의 `blur-xs` Tailwind 클래스 토글) | 화면 관찰 | 실습 화면 | ImageBlurPlaceholderDemo | 아니오 | `fail` |
| 2 | 로드 전환 인터랙션 | 버튼 클릭 시 고화질 배너 페이드인 | `loaded` state에 따른 UI 클래스 변경 | 화면 관찰 | 실습 화면 | 배너 div | 예 | `pass` |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | medium | G01 | "0ms 즉시 표시", "CLS 0" 과장 문구 수정 및 실제 next/image 관찰 절차로 개편 |
| 데모 예제 | 예 | high | D02, D03 | 실제 `next/image` 컴포넌트의 `placeholder="blur"` 및 `blurDataURL` 속성 사용으로 리팩토링 |
| 검증 | 예 | high | V01, V02 | 고정 패널 대신 실제 Image DOM의 SVG/Base64 블러 데이터 대조 패널로 교체 |
| 개념 정리 | 예 | high | C01, C03 | "0ms 즉시 노출", "CLS: 0" 단정 문구 수정 및 정적 임포트 vs 동적 이미지 blurDataURL 필수 규칙 명시 |

#### 증거 파일 및 종합 메모
- 증거: `ImageBlurPlaceholderDemo.tsx`에 `import Image from 'next/image'`가 없고 일반 div만 사용.

---

### 149. components/image/priority-lcp-preload — priority 속성을 통한 LCP 이미지 사전 로드

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/3.2-components/image.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/components/image/priority-lcp-preload/page.tsx |
| 대표 검증 유형 후보 | 전후 변화 / 화면 관찰 |
| 실행 결과 | `verified` |
| 초기화 방법 | priority 체크박스 및 상품 탭 선택 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [PROD-001] 또는 [PROD-002] 상품 탭 선택 | 상품 ID 버튼 클릭 | 실습 영역 | 예 | 이미지 변경 및 리로드 트리거 |
| 2 | [priority=true] 체크박스 토글 | priority 체크박스 토글 | 실습 영역 / 인스펙터 | 예 | `priority={true}` 시 `<link rel="preload">` 및 `fetchpriority="high"` 생성 확인 |
| 3 | LCP 로딩 성능 최적화 검증 | 생성된 DOM 태그 및 인스펙터 대조 | 검증 패널 / 실습 영역 | 예 | lazy loading 비활성화 및 eager 로딩 확인 |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | next/image priority 태그 생성 | `<link rel="preload">` 및 `fetchpriority="high"` 속성 주입 | 실제 `next/image` 컴포넌트에 `priority={priorityEnabled}` 바인딩 및 DOM 태그 검증 완료 | 전후 변화 | DOM / 소스 | ImagePriorityLcpDemo | 예 | `pass` |
| 2 | Image onLoad 수명주기 | 이미지 로드 완료 상태 감지 | `onLoad` 이벤트 발생 시 `Image Loaded (100%)` 뱃지 갱신 | 전후 변화 | 실습 화면 | 뷰포트 카드 | 예 | `pass` |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 아니오 | none | — | 현재 절차 유지 |
| 데모 예제 | 아니오 | none | — | 실제 `next/image`, `sizes`, `priority`, `blurDataURL` 완벽 구현 |
| 검증 | 아니오 | none | — | priority 토글 상태 및 DOM 속성 실시간 대조 |
| 개념 정리 | 예 | medium | C01 | "LCP 시간을 40% 이상 단축"과 같은 미검증 정량 수치 문구 수정 |

#### 증거 파일 및 종합 메모
- 증거: `ImagePriorityLcpDemo.tsx`에서 `next/image` 실제 임포트 및 `priority={priorityEnabled}` 동작 확인.
- 메모: `next/image` 최적화 골든 샘플.

---

### 150. components/link/soft-navigation-scroll — <Link> 소프트 네비게이션 & scroll 제어

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/3.2-components/link.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/components/link/soft-navigation-scroll/page.tsx |
| 대표 검증 유형 후보 | 전후 변화 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | [scroll 속성 토글] 버튼 클릭 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [scroll 속성 토글 (현재: )] 클릭 | 토글 버튼 클릭 | 실습 영역 | 예 | boolean 문자열만 변경됨 |
| 2 | 하위 탭 링크 클릭 및 페이지 이동 | 탭 링크 탐색 | 실습 영역 | 아니오 | 실제 이동할 스크롤 링크가 존재하지 않음 |
| 3 | 스크롤 위치 보존 여부 확인 | 스크롤 위치 관찰 | 브라우저 뷰포트 | 아니오 | 긴 본문이나 스크롤 컨테이너 부재로 검증 불가 |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | <Link scroll={false}> | 네비게이션 시 뷰포트 상단 스크롤 방지 | 실제 스크롤 컨테이너 및 next/link 미구현 (단순 boolean 토글 텍스트) | 전후 변화 | 실습 화면 | LinkSoftNavScrollDemo | 아니오 | `fail` |
| 2 | 설정 상태 표기 | scroll 옵션 텍스트 토글 | `scrollOpt` boolean 변경 정상 | 화면 관찰 | 실습 화면 | 토글 UI | 예 | `pass` |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G01, G02 | 스크롤 위치 보존을 직접 체감할 수 있는 긴 본문 링크 탐색 가이드로 수정 |
| 데모 예제 | 예 | high | D01, D02, D03 | 실제 높이 2000px 이상의 스크롤 영역과 `next/link` 탭 이동 컴포넌트로 재구현 |
| 검증 | 예 | high | V01, V02 | 고정 패널 대신 `window.scrollY` 측정값 대조 패널로 교체 |
| 개념 정리 | 예 | low | C03 | App Router의 기본 스크롤 동작(상단 이동) 및 `scroll={false}` 적용 케이스 명시 |

#### 증거 파일 및 종합 메모
- 증거: `LinkSoftNavScrollDemo.tsx`에 14줄의 단순 boolean 버튼만 존재.

---

## B11-B15 공통 발견

### B11 공통 발견 (101–110)

- **범용 템플릿 대량 복제(`D01`, `D03`)**: 102번(브랜딩), 103번(멀티존), 104번(instrumentation), 106번(클라이언트 라우팅), 107번(SSG 카탈로그), 108번(약관 SSG) 등 6개 데모가 동일 보일러플레이트 복사본으로 구성됨 (P1 재구현 대상).

### B12 공통 발견 (111–120)

- **실제 파일 컨벤션 구현 데모**: 116번(`error/payment-error-boundary`)과 119번(`template/remount-lifecycle`)은 실제 `error.tsx` 및 `template.tsx` 파일 컨벤션을 디스크에 구현하고 있어 검증 패널 연결 시 `verified` 전환 유력.
- **모사 스텁**: 112, 114, 118번은 범용 복제 스텁 상태.

### B13 공통 발견 (121–130)

- **다수의 verified 골든 샘플(7개 달성)**:
  - 122번(`route/rest-api-orders`), 123번(`route/webhook-signature`), 124번(`route/sse-stock-stream`), 125번(`route-groups/group-url-isolation`), 127번(`dynamic-segments/single-param`), 128번(`catch-all-slug`), 129번(`optional-catch-all`), 130번(`parallel-routes/conditional-slot`) 등 핵심 파일 컨벤션이 Next.js 16 및 React 19 스펙으로 온디스크 완성 구현됨.
- **스텁 대상**: 121번(`default` 하드 리로드)과 126번(다중 루트 레이아웃)은 보일러플레이트 스텁 상태.

### B14 공통 발견 (131–140)

- **메타데이터 파일 컨벤션 정상 구현(3개 verified)**:
  - 139번(`icon.tsx`), 140번(`manifest.ts`)은 `ImageResponse`와 `MetadataRoute.Manifest`로 완벽 구현됨.
- **스텁 및 모사 집중**: 133번(`mdx-components`), 134/135번(`instrumentation`), 136번(`proxy`), 137번(`forbidden`), 138번(`unauthorized`)은 보일러플레이트 복제 상태.

### B15 공통 발견 (141–150)

- **메타데이터 & 이미지 최적화 verified(4개 달성)**:
  - 141번(`opengraph-image.tsx`), 142번(`robots.ts`), 143번(`sitemap.ts`), 149번(`next/image priority preload`)은 표준 규약 준수 및 정상 렌더링 확인.
- **환경 차단(`blocked-by-environment`)**:
  - 146번(`file-conventions/route-segment-config/max-duration-60s`)은 Vercel Serverless Function 런타임 전용 설정으로 로컬 Node.js/Turbopack 환경에서는 타임아웃 강제가 검증 불가(`blocked-by-environment`).
