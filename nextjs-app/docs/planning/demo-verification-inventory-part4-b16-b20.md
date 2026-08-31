# 데모 검증 인벤토리 — B16–B20 (데모 151–200)

[전체 인덱스](./demo-verification-inventory.md)로 돌아가기. 이 문서는 데모 151-200번(B16-B20)의 상세 기록만 담는다. 전체 집계와 데모 목록 요약표는 인덱스 문서를 참고한다.

## 데모별 상세 기록

### 151. components/link/prefetch-options — <Link prefetch> 옵션 대조 (auto vs full vs false)

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/3.2-components/link.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/components/link/prefetch-options/page.tsx |
| 대표 검증 유형 후보 | 외부 도구·환경 확인 / 산출물·설정 확인 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | prefetch={null} (auto 기본값) 확인 | auto 텍스트 박스 확인 | 실습 영역 | 예 | 정적 텍스트 확인 |
| 2 | prefetch={true} (full 프리페치) 확인 | full 텍스트 박스 확인 | 실습 영역 | 예 | 정적 텍스트 확인 |
| 3 | prefetch={false} 대역폭 절약 모드 확인 | false 텍스트 박스 확인 | 실습 영역 | 예 | 실제 prefetch 요청 동작 없이 텍스트만 나열됨 |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | Link prefetch 3가지 모드 | auto/full/false에 따른 RSC 페치 동작 | 실제 `next/link` 미배치 (3개 정적 div 박스) | 외부 도구·환경 확인 | 실습 화면 | LinkPrefetchOptionsDemo | 아니오 | `fail` |
| 2 | 옵션 설명 카드 | prefetch 옵션별 요약 텍스트 | 3개 카드 정상 노출 | 화면 관찰 | 실습 화면 | 옵션 박스 | 예 | `observe` |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G01, G02 | 0ms 문구 수정 및 실제 뷰포트 진입 프리페치 네트워크 관찰 가이드로 개편 |
| 데모 예제 | 예 | high | D02, D03 | 실제 `next/link`의 `prefetch={null | true | false}` 링크 목록 및 Network 탭 감지기 구현 |
| 검증 | 예 | high | V01, V02 | 고정 패널 대신 프리페치 RSC 패킷 수신 대조 패널로 교체 |
| 개념 정리 | 예 | high | C01, C03 | "0ms 전환" 단정 문구 수정 및 개발(dev) 모드 vs 프로덕션(prod) 모드 프리페치 차이점 명시 |

#### 증거 파일 및 종합 메모
- 증거: `LinkPrefetchOptionsDemo.tsx`에 12줄의 정적 텍스트 div만 존재.

---

### 152. components/font/google-variable-tokens — Google Fonts 가변 폰트 CSS 변수 연동

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/3.2-components/font.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/components/font/google-variable-tokens/page.tsx |
| 대표 검증 유형 후보 | 화면 관찰 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [Inter], [Roboto], [Playfair Display] 폰트 버튼 선택 | Inter, Roboto Mono, Noto Sans 버튼 클릭 | 실습 영역 | 예 | 인라인 스타일 fontFamily 변경 |
| 2 | 빌드 타임 셀프 호스팅 점검 | CSS 변수 인스펙터 확인 | 실습 영역 | 예 | 가상 CSS 변수 문자열 확인 |
| 3 | 무중단 폰트 렌더링 및 레이아웃 시프트 방지 확인 | 텍스트 타이포그래피 프리뷰 확인 | 실습 영역 | 예 | `next/font/google` 함수 호출 없이 인라인 스타일로 모사됨 |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | next/font/google 빌드타임 주입 | WOFF2 자체 호스팅 및 CSS 변수 주입 | 컴포넌트 내 `next/font/google` 임포트 부재 (로컬 state 객체 및 인라인 스타일 모사) | 화면 관찰 | 소스 / DOM | FontGoogleVariableDemo | 아니오 | `fail` |
| 2 | 타이포그래피 제어 UI | 크기/두께 슬라이더 조절 | 폰트 사이즈 및 weight 실시간 반영 | 화면 관찰 | 실습 화면 | 프리뷰 카드 | 예 | `pass` |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | medium | G01 | "네트워크 요청 0건", "CLS 0" 과장 문구 수정 및 실제 폰트 변수 관찰 가이드로 보강 |
| 데모 예제 | 예 | high | D02, D03 | 실제 `next/font/google`의 `Inter`, `Roboto_Mono`를 로드하고 className/variable 바인딩 |
| 검증 | 예 | high | V01, V02 | 고정 패널 대신 실제 주입된 `--font-*` CSS 변수 대조 패널로 교체 |
| 개념 정리 | 예 | high | C01, C03 | "외부 요청 0건", "폰트 CLS 원천 제거" 단정 문구 수정 및 size-adjust 원리 설명 보강 |

#### 증거 파일 및 종합 메모
- 증거: `FontGoogleVariableDemo.tsx`에 `import { Inter } from 'next/font/google'` 없이 가상 문자열만 선언됨.

---

### 153. components/font/local-font-face — next/font/local 커스텀 로컬 폰트 매핑

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/3.2-components/font.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/components/font/local-font-face/page.tsx |
| 대표 검증 유형 후보 | 화면 관찰 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [pretendard] 또는 [toss-face] 로컬 폰트 선택 | Pretendard, TossFace 버튼 클릭 | 실습 영역 | 예 | 로컬 state 변경 |
| 2 | [w400], [w600], [w700] 가중치 버튼 클릭 | 가중치 버튼 클릭 | 실습 영역 | 예 | font-weight 스타일 변경 |
| 3 | 로컬 폰트 렌더링 및 다운로드 최적화 확인 | 타이포그래피 프리뷰 확인 | 실습 영역 | 예 | `next/font/local` 함수 호출 없이 가상 설정 객체 출력 |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | next/font/local WOFF2 로드 | 로컬 폰트 파일 매핑 및 @font-face 생성 | `next/font/local` 미호출 (가상 localFonts 객체 출력) | 화면 관찰 | 소스 / DOM | FontLocalFontFaceDemo | 아니오 | `fail` |
| 2 | 폰트 가중치 변경 인터랙션 | weight 버튼 클릭 시 굵기 변경 | 인라인 fontWeight 정상 변경 | 화면 관찰 | 실습 화면 | 프리뷰 카드 | 예 | `pass` |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | medium | G01 | 실제 로컬 폰트 로드 확인 절차로 보강 |
| 데모 예제 | 예 | high | D02, D03 | 실제 `next/font/local` 함수를 호출하여 로컬 폰트 바인딩 |
| 검증 | 예 | high | V01, V02 | 고정 패널 대신 실제 적용된 로컬 폰트 페이스 대조 패널로 교체 |
| 개념 정리 | 예 | high | C01, C03 | "100% 보안", "번들 누수 없음" 단정 문구 수정 및 로컬 WOFF2 경로 규칙 명시 |

#### 증거 파일 및 종합 메모
- 증거: `FontLocalFontFaceDemo.tsx`에 `import localFont from 'next/font/local'` 부재.

---

### 154. components/script/loading-strategies — next/script 로딩 전략 상세 비교

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/3.2-components/script.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/components/script/loading-strategies/page.tsx |
| 대표 검증 유형 후보 | 화면 관찰 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [afterInteractive (기본값)] 전략 선택 | afterInteractive 카드 클릭 | 실습 영역 | 예 | 활성 전략 텍스트 변경 |
| 2 | [lazyOnload] 지연 로딩 전략 선택 | lazyOnload 카드 클릭 | 실습 영역 | 예 | 활성 전략 텍스트 변경 |
| 3 | [beforeInteractive] 최우선 전략 확인 | beforeInteractive 카드 클릭 | 실습 영역 | 예 | 실제 `<Script>` 태그 마운트 없이 카드 텍스트만 토글 |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | next/script strategy 분기 | beforeInteractive, afterInteractive, lazyOnload 실행 순서 제어 | 실제 `next/script` 컴포넌트 미사용 (로컬 state 기반 카드 선택 UI) | 화면 관찰 | 실습 화면 | ScriptLoadingStrategiesDemo | 아니오 | `fail` |
| 2 | 전략 선택 인터랙션 | 카드 클릭 시 활성 전략 변경 | `selectedStrategy` 상태 변경 정상 | 화면 관찰 | 실습 화면 | 전략 카드 | 예 | `pass` |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | medium | G01 | "0ms 블로킹 방지" 과장 문구 수정 및 실제 스크립트 실행 타이밍 관찰 가이드로 보강 |
| 데모 예제 | 예 | high | D02, D03 | 실제 `next/script` 태그를 마운트하여 strategy별 DOM 삽입 시점 및 실행 로그 대조 구현 |
| 검증 | 예 | high | V01, V02 | 고정 패널 대신 실제 스크립트 로드 타이밍 대조 패널로 교체 |
| 개념 정리 | 예 | high | C01, C03 | `beforeInteractive`는 Root Layout에서만 동작한다는 App Router 제약 사항 명시 |

#### 증거 파일 및 종합 메모
- 증거: `ScriptLoadingStrategiesDemo.tsx`에 `import Script from 'next/script'` 부재.

---

### 155. components/script/pg-sdk-onload — 외부 PG사 결제 SDK onLoad 이벤트

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/3.2-components/script.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/components/script/pg-sdk-onload/page.tsx |
| 대표 검증 유형 후보 | 전후 변화 |
| 실행 결과 | `verified` |
| 초기화 방법 | 새 URL 진입 또는 [onLoad 강제 시뮬레이션] 클릭 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [onLoad 강제 시뮬레이션] 클릭 | onLoad 시뮬레이션 버튼 클릭 (또는 자동 로드) | 실습 영역 | 예 | `onLoad` 이벤트 트리거 및 SDK Ready 로그 추가 |
| 2 | 결제 버튼 활성화 상태 확인 | 결제 버튼 활성 상태 점검 | 실습 영역 | 예 | 비활성 회색 버튼 → 활성 파란색 버튼 전환 확인 |
| 3 | 결제 요청 실행 및 완료 확인 | [189,000원 카드 결제하기] 클릭 | 실습 영역 / 로그 | 예 | 결제 승인 완료 (`pay_toss_20260822_success`) 200 OK |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | next/script onLoad 콜백 | 외부 SDK 다운로드 완료 시 onLoad 실행 | `<Script strategy="lazyOnload" onLoad={handleSdkReady} />` 실제 바인딩 및 이벤트 수신 | 전후 변화 | 소스 / DOM | ScriptPgSdkOnloadDemo | 예 | `pass` |
| 2 | 결제 버튼 잠금 해제 | SDK 로드 전 버튼 비활성화, 완료 후 활성화 | `!sdkLoaded` disabled 속성 해제 및 결제 완료 | 값 비교 | 실습 화면 | 결제 위젯 | 예 | `pass` |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 아니오 | none | — | 현재 절차 유지 |
| 데모 예제 | 아니오 | none | — | 실제 `next/script` 컴포넌트 및 fallback 핸들러 완벽 구현 |
| 검증 | 아니오 | none | — | SDK 로드 상태 및 결제 단계 정상 연동 |
| 개념 정리 | 예 | low | C03 | 외부 SDK 로드 실패 시의 `onError` 폴백 처리 패턴 설명 보강 |

#### 증거 파일 및 종합 메모
- 증거: `ScriptPgSdkOnloadDemo.tsx`에서 `next/script`의 `onLoad` 및 `onError` 핸들러 정상 작동 확인.
- 메모: `next/script` 외부 모듈 연동 골든 샘플.

---

### 156. functions/use-router/push-replace — useRouter push vs replace vs back 프로그래밍 네비게이션

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/3.3-functions/use-router.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/functions/use-router/push-replace/page.tsx |
| 대표 검증 유형 후보 | 전후 변화 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [1. router.push(상세)] 클릭 | 1번 버튼 클릭 | 실습 영역 | 예 | 가상 스택에 `/shop/products/prod-001` 추가 |
| 2 | [2. router.replace(결제완료)] 클릭 | 2번 버튼 클릭 | 실습 영역 | 예 | 가상 스택 마지막 항목 교체 |
| 3 | [3. router.back()] 실행 및 히스토리 스택 관찰 | 3번 버튼 클릭 | 실습 영역 | 예 | 실제 `useRouter()` 훅 미사용 (로컬 배열만 조작) |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | useRouter push/replace/back | 브라우저 실제 History API 스택 조작 및 URL 이동 | `useRouter()` 훅 미호출 (로컬 `historyStack` 배열 모사) | 전후 변화 | 실습 화면 | NavigationClientDemo | 아니오 | `fail` |
| 2 | 히스토리 스택 UI 렌더링 | 스택 배열의 단계별 시각화 | 가상 히스토리 스택 박스 정상 렌더링 | 화면 관찰 | 실습 화면 | 스택 뷰 | 예 | `pass` |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | medium | G01 | "0ms 이동" 과장 문구 수정 및 실제 URL 이동 관찰 가이드로 보강 |
| 데모 예제 | 예 | high | D02, D03 | `next/navigation`의 `useRouter()`를 실제 임포트하여 실제 push/replace/back 호출 데모로 개편 |
| 검증 | 예 | high | V01, V02 | 고정 패널 대신 실제 브라우저 히스토리 길이 및 URL 변경 대조 패널로 교체 |
| 개념 정리 | 예 | high | C01, C03 | "0ms 클라이언트 제어" 단정 문구 수정 및 서버 컴포넌트 페칭과의 관계 명시 |

#### 증거 파일 및 종합 메모
- 증거: `NavigationClientDemo.tsx`에 `import { useRouter } from 'next/navigation'` 부재.

---

### 157. functions/use-router/refresh-server-sync — router.refresh() 서버 데이터 강제 재검증 동기화

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/3.3-functions/use-router.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/functions/use-router/refresh-server-sync/page.tsx |
| 대표 검증 유형 후보 | 전후 변화 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [router.refresh() 실행] 버튼 클릭 | 버튼 클릭 | 실습 영역 | 예 | 500ms setTimeout 후 로컬 카운터 1 증가 |
| 2 | RSC 서버 동기화 횟수 카운터 및 상태 보존 관찰 | 카운터 수치 확인 | 실습 영역 | 예 | 실제 `router.refresh()` 서버 요청 발생 없음 |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | router.refresh() 서버 재검증 | 클라이언트 상태 보존 상태로 서버 RSC 페이로드 재요청 | `router.refresh()` 미호출 (단순 `setTimeout` 및 `setRefreshCount` 로컬 state 증가) | 전후 변화 | 실습 화면 | UseRouterRefreshDemo | 아니오 | `fail` |
| 2 | 카운터 인터랙션 | 버튼 클릭 시 카운터 증가 | `refreshCount` 1회 증가 정상 | 화면 관찰 | 실습 화면 | 카운터 UI | 예 | `pass` |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | medium | G01 | 실제 서버 RSC 타임스탬프 갱신 확인 가이드로 수정 |
| 데모 예제 | 예 | high | D02, D03 | 실제 서버 컴포넌트(동적 타임스탬프)와 `useRouter().refresh()` 호출로 재구현 |
| 검증 | 예 | high | V01, V02 | 고정 패널 대신 클라이언트 폼 입력값 보존 및 서버 타임스탬프 갱신 대조 패널로 교체 |
| 개념 정리 | 예 | high | C01, C03 | "100% 보존", "깜빡임 0" 과장 문구 수정 및 `router.refresh()`와 React 트랜지션 원리 명시 |

#### 증거 파일 및 종합 메모
- 증거: `UseRouterRefreshDemo.tsx`에 `useRouter` 호출이 없고 `setTimeout` 로컬 카운터만 존재.

---

### 158. functions/use-pathname/active-link — usePathname() 기반 GNB 활성 메뉴 하이라이트

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/3.3-functions/use-pathname.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/functions/use-pathname/active-link/page.tsx |
| 대표 검증 유형 후보 | 화면 관찰 |
| 실행 결과 | `verified` |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [신상품 (New)] 또는 [타임특가 (Deals)] 탭 클릭 | 신상품 / 타임특가 탭 클릭 | 실습 영역 | 예 | 활성 탭 스타일 및 녹색 펄스 뱃지 이동 |
| 2 | [베스트 (Best 100)] 또는 [기획전 (Events)] 탭 전환 | 베스트 / 기획전 탭 클릭 | 실습 영역 | 예 | 선택된 메뉴 텍스트 및 isActive = true 확인 |
| 3 | 활성 탭 하이라이트 스타일 및 뱃지 관찰 | `usePathname()` 감지 결과 인스펙터 확인 | 인스펙터 / 실습 영역 | 예 | 실측 App Router pathname (`/zone/baseline/...`) 정상 감지 |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | usePathname() 실시간 감지 | 현재 URL의 pathname 문자열 반환 | `const currentActualPathname = usePathname()` 실제 호출 및 현재 경로 실측 표기 | 화면 관찰 | 소스 / DOM | UsePathnameActiveDemo | 예 | `pass` |
| 2 | GNB 활성 스타일 동기화 | pathname 일치 메뉴에 볼드 및 뱃지 적용 | 선택된 탭에 `bg-zinc-900` 및 에메랄드 뱃지 렌더링 | 화면 관찰 | 실습 화면 | 네비게이션 바 | 예 | `pass` |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 아니오 | none | — | 현재 절차 유지 |
| 데모 예제 | 아니오 | none | — | 실제 `usePathname()` 훅 호출 및 인스펙터 연동 완료 |
| 검증 | 아니오 | none | — | 실측 pathname 및 활성 탭 일치 상태 정상 대조 |
| 개념 정리 | 예 | low | C03 | 서브 경로(중첩 라우트) 매칭 시 `pathname.startsWith()` 활용법 설명 보강 |

#### 증거 파일 및 종합 메모
- 증거: `UsePathnameActiveDemo.tsx`에서 `import { usePathname } from 'next/navigation'` 실제 사용 확인.
- 메모: `usePathname` 표준 골든 샘플.

---

### 159. functions/use-params/client-id — useParams()를 통한 Client Component 동적 세그먼트 파라미터 추출

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/3.3-functions/use-params.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/functions/use-params/client-id/page.tsx |
| 대표 검증 유형 후보 | 값 비교 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [/electronics/keyboard-900] 버튼 클릭 | 전자제품 버튼 클릭 | 실습 영역 | 예 | 로컬 state 변경 |
| 2 | [/fashion/hoodie-102] 버튼으로 전환 | 패션 버튼 클릭 | 실습 영역 | 예 | 로컬 state 변경 |
| 3 | useParams() 반환 객체(category / id) 관찰 | 화면에 출력된 파라미터 확인 | 실습 영역 | 예 | 실제 `useParams()` 훅 호출 없이 `useState`로 모사됨 |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | useParams() 동적 파라미터 추출 | 클라이언트 트리에서 category, id 파라미터 추출 | `useParams()` 미호출 (로컬 `useState({ category, id })` 모사) | 값 비교 | 실습 화면 | UseParamsClientDemo | 아니오 | `fail` |
| 2 | 파라미터 전환 UI | 버튼 클릭 시 파라미터 텍스트 변경 | 화면 UI 정상 갱신 | 화면 관찰 | 실습 화면 | 파라미터 박스 | 예 | `pass` |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | medium | G01 | "0ms 동기 언랩핑" 과장 문구 수정 및 실제 URL 라우트 파라미터 추출 가이드로 보강 |
| 데모 예제 | 예 | high | D02, D03 | 실제 동적 라우트(`[category]/[id]`) 세그먼트 구축 및 `useParams()` 훅 호출로 리팩토링 |
| 검증 | 예 | high | V01, V02 | 고정 패널 대신 실제 URL 세그먼트와 `useParams()` 반환값 대조 패널로 교체 |
| 개념 정리 | 예 | high | C01, C03 | "0ms 동기 언랩핑" 단정 문구 수정 및 Server Component(props params) vs Client Component(useParams) 비교 설명 |

#### 증거 파일 및 종합 메모
- 증거: `UseParamsClientDemo.tsx`에 `import { useParams } from 'next/navigation'` 부재.

---

### 160. functions/use-search-params/filter-parsing — useSearchParams() URL 쿼리 파싱 및 필터링

#### 기본 정보
| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | 3-api-reference/3.3-functions/use-search-params.md |
| 진입점 | apps/demo-baseline/src/app/zone/baseline/functions/use-search-params/filter-parsing/page.tsx |
| 대표 검증 유형 후보 | 값 비교 / 전후 변화 |
| 실행 결과 | `mismatch` |
| 초기화 방법 | 필터 옵션 초기화 |

#### 가이드 실행 기록
| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [카테고리] 셀렉트에서 [전자기기] 또는 [패션/의류] 선택 | 셀렉트 박스 변경 | 실습 영역 | 예 | 로컬 state 기반 상품 필터링 |
| 2 | [정렬 기준] 및 [최대 가격] 슬라이더 조절 | 정렬 선택 및 가격 슬라이더 조절 | 실습 영역 | 예 | 가상 쿼리 스트링 문자열 및 목록 갱신 |
| 3 | 파싱된 쿼리 스트링 및 필터링 결과 목록 관찰 | 쿼리 및 결과 상품 수 확인 | 실습 영역 | 예 | 실제 브라우저 주소창(URL SearchParams) 연동 없이 로컬 state로 모사됨 |

#### 검증 항목
| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | useSearchParams() 쿼리 파싱 | 브라우저 URL 쿼리 스트링 파싱 및 필터 동기화 | `useSearchParams()` 및 `useRouter().push(?...)` 미호출 (로컬 state 기반 필터링 및 가상 쿼리 문자열 조합) | 값 비교 | 실습 화면 | FilterParsingDemo | 아니오 | `fail` |
| 2 | 카탈로그 필터링 UI | 카테고리/가격에 따른 상품 목록 필터링 | `filtered.length` 및 상품 카드 렌더링 정상 | 전후 변화 | 실습 화면 | 상품 그리드 | 예 | `pass` |

#### 섹션별 수정 판정
| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | medium | G01 | 실제 주소창 URL 쿼리 동기화 절차로 가이드 보강 |
| 데모 예제 | 예 | high | D02, D03 | `useSearchParams()`와 `useRouter().push(?...)`를 실제로 연동하고 `<Suspense>` 바운더리로 감싸기 |
| 검증 | 예 | high | V01, V02 | 고정 패널 대신 실제 URL 쿼리 객체와 필터 파라미터 대조 패널로 교체 |
| 개념 정리 | 예 | medium | C03 | `useSearchParams()` 사용 시 정적 렌더링 탈락(deopt) 방지를 위한 `<Suspense>` 필수 규약 명시 |

#### 증거 파일 및 종합 메모
- 증거: `FilterParsingDemo.tsx`에 `import { useSearchParams } from 'next/navigation'` 부재.

---

---

### 161. functions/use-search-params/debounce-transition — useTransition 연동 디바운스 검색 쿼리 동기화

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `3-api-reference/3.3-functions/use-search-params.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/functions/use-search-params/debounce-transition/page.tsx` |
| 대표 검증 유형 후보 | 전후 변화 |
| 실행 결과 | mismatch |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [상품명을 입력하세요 (예: 맥북, 모니터)] 검색창 입력 | 검색창에 "맥북" 입력 | 실습 영역 | 예 | 로컬 입력값 텍스트 반영 |
| 2 | 300ms 디바운스 및 startTransition 백그라운드 전환 | 입력 후 300ms 대기 | 실습 영역 | 아니오 | 실제 디바운스 및 URL 동기화 로직 부재 (startTransition 내부 빈 함수, `D02`, `D03`) |
| 3 | 입력 반응성 및 실시간 검색 결과 관찰 | 결과 텍스트 확인 | 검증 패널 | 아니오 | `<VerificationFooter />` props 미전달로 "인터랙션 대기 중" 고정 (`V01`, `V05`) |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | useTransition & debounce 연동 | 300ms 디바운스 후 URL 쿼리 백그라운드 전환 | 빈 startTransition 호출 및 로컬 setText만 실행 | 전후 변화 | 소스 코드 | `UseSearchParamsDebounceDemo.tsx` | 예 | fail |
| 2 | 검색어 입력 반응성 | 키보드 입력 시 로컬 인풋 즉각 반응 | 입력 텍스트 즉시 화면 표시 | 값 비교 | 실습 화면 | 동기화된 검색어 텍스트 | 예 | pass |
| 3 | 검증 패널 연동 | 디바운스 전환 상태 및 결과 검증 | props 미전달로 대기 상태 고정 | 전후 변화 | 검증 패널 | Actual 영역 | 아니오 | fail |

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 아니오 | none | — | 3단계 가이드 절차 유지 |
| 데모 예제 | 예 | high | D02, D03 | `useSearchParams`, `useRouter`, 실제 300ms 디바운스 타이머를 결합하여 URL 쿼리 파라미터 변경 로직 구현 |
| 검증 | 예 | high | V01, V05 | 실제 transition pending 상태와 동기화된 searchParams를 검증 패널에 연결 |
| 개념 정리 | 예 | low | C01 | "INP 제로 100% 보장", "네트워크 90% 절감" 등 과장 수치 정제 |

#### 증거 파일

- 스크린샷: 별도 저장 없음.
- 소스 코드: `UseSearchParamsDebounceDemo.tsx`의 빈 `startTransition` 확인.

#### 종합 메모

- 최종 유형 검토: 전후 변화형. `useTransition`의 `isPending` 상태와 디바운스 완료 후의 URL searchParams 변경을 검증해야 한다.

---

### 162. functions/use-selected-layout-segment/subnav-pill — useSelectedLayoutSegment() 하위 탭 인디케이터

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `3-api-reference/3.3-functions/use-selected-layout-segment.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/functions/use-selected-layout-segment/subnav-pill/page.tsx` |
| 대표 검증 유형 후보 | 화면 관찰 |
| 실행 결과 | mismatch |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [overview], [specs], [reviews], [shipping] 탭 버튼 클릭 | `[specs]` 버튼 클릭 | 실습 영역 | 예 | 탭 활성화 파란색 배경 전환 |
| 2 | useSelectedLayoutSegment 반환값 확인 | 리턴값 텍스트 확인 | 실습 영역 | 아니오 | 훅 호출 없이 단순 `useState('specs')` 텍스트 출력 (`D02`, `D03`) |
| 3 | 서브내비 Pill 인디케이터 렌더링 관찰 | 파란색 Pill 위치 관찰 | 실습 영역 | 예 | UI 스타일 이동 정상 |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | useSelectedLayoutSegment() 훅 실행 | 실제 Next.js 레이아웃 하위 세그먼트 반환 | `useState('overview')` 로컬 상태 모사 | 화면 관찰 | 소스 코드 | `UseSelectedSegmentDemo.tsx` | 예 | fail |
| 2 | 탭 클릭 시 세그먼트 전환 | 탭 클릭 시 활성 상태 및 문자열 변경 | 버튼 클릭 시 state 갱신 | 값 비교 | 실습 화면 | 리턴값 영역 | 예 | pass |
| 3 | 검증 패널 연동 | 활성 세그먼트 실증 검증 | props 미전달로 대기 상태 고정 | 화면 관찰 | 검증 패널 | Actual 영역 | 아니오 | fail |

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 아니오 | none | — | 현재 3단계 절차 유지 |
| 데모 예제 | 예 | high | D02, D03 | 실제 Next.js 중첩 라우트 구조와 `useSelectedLayoutSegment()` 훅을 사용하여 구현 |
| 검증 | 예 | high | V01, V05 | 활성 세그먼트명과 레이아웃 위치를 검증 패널에 바인딩 |
| 개념 정리 | 아니오 | none | — | 공식 스펙 설명 유지 |

#### 증거 파일

- 소스 코드: `UseSelectedSegmentDemo.tsx` 내 `useState` 로컬 모사 확인.

#### 종합 메모

- 최종 유형 검토: 화면 관찰형. 중첩 라우트 레이아웃에서 훅이 읽어오는 1단계 세그먼트명과 Pill 인디케이터 렌더링을 확인해야 한다.

---

### 163. functions/use-selected-layout-segments/breadcrumb — useSelectedLayoutSegments() 계층형 브레드크럼 생성

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `3-api-reference/3.3-functions/use-selected-layout-segments.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/functions/use-selected-layout-segments/breadcrumb/page.tsx` |
| 대표 검증 유형 후보 | 화면 관찰 |
| 실행 결과 | mismatch |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [shop > electronics > keyboards > item-891] 브레드크럼 확인 | 브레드크럼 리스트 확인 | 실습 영역 | 예 | 정적 리스트 표시 |
| 2 | useSelectedLayoutSegments 전체 세그먼트 배열 반환 확인 | 세그먼트 배열 확인 | 실습 영역 | 아니오 | 훅 호출 없이 하드코딩 배열 map (`D02`, `D03`) |
| 3 | 홈부터 리프 경로까지 순서대로 브레드크럼 UI 렌더링 관찰 | 브레드크럼 렌더링 관찰 | 실습 영역 | 예 | 정적 렌더링 확인 |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | useSelectedLayoutSegments() 훅 연동 | 하위 전체 세그먼트 배열 동적 추출 | 정적 상수 배열 `['shop', 'electronics', ...]` 출력 | 화면 관찰 | 소스 코드 | `UseSelectedSegmentsBreadcrumbDemo.tsx` | 예 | fail |
| 2 | 브레드크럼 렌더링 | 세그먼트 목록을 `>` 구분자로 렌더링 | 정적 HTML 정상 렌더링 | 화면 관찰 | 실습 화면 | 브레드크럼 뷰 | 예 | pass |
| 3 | 검증 패널 연동 | 브레드크럼 세그먼트 검증 | props 미전달로 대기 상태 고정 | 화면 관찰 | 검증 패널 | Actual 영역 | 아니오 | fail |

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | medium | G01, G02 | 조작 가능한 라우트 이동 단계 및 훅 관찰 절차 보강 |
| 데모 예제 | 예 | high | D02, D03 | 실제 다단계 중첩 라우트 또는 세그먼트 파라미터 기반 `useSelectedLayoutSegments()` 호출로 교체 |
| 검증 | 예 | high | V01, V05 | 추출된 세그먼트 배열을 검증 패널에 전달 |
| 개념 정리 | 아니오 | none | — | 공식 스펙 설명 유지 |

#### 증거 파일

- 소스 코드: `UseSelectedSegmentsBreadcrumbDemo.tsx` 내 하드코딩 `segments` 배열 확인.

#### 종합 메모

- 최종 유형 검토: 화면 관찰형. 중첩 라우트 깊이에 따른 세그먼트 배열의 순차 렌더링을 검증한다.

---

### 164. functions/cache-life/preset-profiles — cacheLife 빌트인 프리셋 프로파일 (seconds vs hours vs max)

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | cache |
| 근거 문서 | `3-api-reference/3.3-functions/cacheLife.md` |
| 진입점 | `apps/demo-cache-components/src/app/zone/cache/functions/cache-life/preset-profiles/page.tsx` |
| 대표 검증 유형 후보 | 전후 변화 |
| 실행 결과 | mismatch |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [cacheLife('seconds')] 클릭 | seconds 버튼 클릭 | 실습 영역 | 예 | 텍스트 박스 변경 |
| 2 | [cacheLife('hours')] 또는 [cacheLife('days')] 클릭 | hours 버튼 클릭 | 실습 영역 | 예 | 텍스트 박스 변경 |
| 3 | 선택된 프리셋별 수명 주기 타임라인 관찰 | 수명 주기 관찰 | 실습 영역 | 아니오 | 실제 `cacheLife()` 실행 없이 로컬 문자열만 변경 (`D02`, `D03`) |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | cacheLife() 빌트인 프리셋 적용 | 서버 함수 내 `cacheLife('seconds' \| 'hours' \| 'days')` 호출 및 캐시 수명 제어 | 클라이언트 `useState` 문자열 매핑으로 모사 | 전후 변화 | 소스 코드 | `CacheLifePresetsDemo.tsx` | 예 | fail |
| 2 | 프리셋 선택 UI | 버튼 클릭 시 프리셋 전환 | 3개 버튼 전환 정상 | 값 비교 | 실습 화면 | 프리셋 박스 | 예 | pass |
| 3 | 검증 패널 연동 | 프리셋별 stale/revalidate 타임라인 검증 | props 미전달로 대기 상태 고정 | 전후 변화 | 검증 패널 | Actual 영역 | 아니오 | fail |

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 아니오 | none | — | 프리셋 선택 절차 유지 |
| 데모 예제 | 예 | high | D02, D03 | 실제 `'use cache'` 및 `cacheLife()` 비동기 함수와 타임스탬프를 연동하여 재구현 |
| 검증 | 예 | high | V01, V05 | 선택된 프리셋과 서버 캐시 타임스탬프를 검증 패널에 연결 |
| 개념 정리 | 아니오 | none | — | Next 16 cacheLife 프리셋 스펙 유지 |

#### 증거 파일

- 소스 코드: `CacheLifePresetsDemo.tsx` 내 `useState` 및 하드코딩 타임라인 문자열 확인.

#### 종합 메모

- 최종 유형 검토: 전후 변화형. Next.js 16의 빌트인 cacheLife 프로파일에 따른 캐시 타임스탬프 갱신 주기를 비교해야 한다.

---

### 165. functions/cache-life/custom-profile — next.config.ts custom cacheLife 프로파일 정의 및 바인딩

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | cache |
| 근거 문서 | `3-api-reference/3.3-functions/cacheLife.md` |
| 진입점 | `apps/demo-cache-components/src/app/zone/cache/functions/cache-life/custom-profile/page.tsx` |
| 대표 검증 유형 후보 | 산출물·설정 확인 |
| 실행 결과 | mismatch |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [flash-sale], [catalog], [reviews] 커스텀 프로필 탭 선택 | `[catalog]` 탭 선택 | 실습 영역 | 예 | 프로필 상세 카드 전환 |
| 2 | next.config.ts 내 custom cacheLife 설정 매핑 확인 | 코드 블록 확인 | 실습 영역 | 아니오 | 실제 config 바인딩 없는 정적 텍스트 뷰어 (`D02`, `D03`) |
| 3 | 컴포넌트 내 cacheLife('{profile}') 바인딩 관찰 | 코드 및 타임라인 관찰 | 실습 영역 | 예 | UI 타임라인 확인 |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | next.config.ts custom cacheLife 프로필 바인딩 | next.config.ts에 정의된 custom profile을 서버 캐시 함수에 적용 | 클라이언트 UI 시뮬레이터 객체로 모사 | 산출물·설정 확인 | 소스 코드 | `CacheLifeCustomDemo.tsx` | 예 | fail |
| 2 | 프로필 전환 인터랙션 | 버튼 클릭 시 stale/revalidate/expire 수치 표시 | UI 상 정상 전환 | 값 비교 | 실습 화면 | 프리셋 상세 카드 | 예 | pass |
| 3 | 검증 패널 연동 | 커스텀 프로필 설정 검증 | props 미전달로 대기 상태 고정 | 산출물·설정 확인 | 검증 패널 | Actual 영역 | 아니오 | fail |

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 아니오 | none | — | 3단계 절차 유지 |
| 데모 예제 | 예 | high | D02, D03 | `next.config.ts`의 `experimental.cacheLife` 프로필과 실제 서버 캐시 함수 바인딩으로 연결 |
| 검증 | 예 | high | V01, V05 | 프로필 수명 주기 및 서버 캐시 상태를 검증 패널에 연결 |
| 개념 정리 | 아니오 | none | — | 공식 스펙 설명 유지 |

#### 증거 파일

- 소스 코드: `CacheLifeCustomDemo.tsx` 확인.

#### 종합 메모

- 최종 유형 검토: 산출물·설정 확인 및 전후 변화형. 커스텀 cacheLife 프로파일이 서버 런타임 캐시 정책에 반영되는지 검증한다.

---

### 166. functions/cache-tag/multi-tag-binding — cacheTag 다중 태그 바인딩 및 정밀 연관 관계 구성

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | cache |
| 근거 문서 | `3-api-reference/3.3-functions/cacheTag.md` |
| 진입점 | `apps/demo-cache-components/src/app/zone/cache/functions/cache-tag/multi-tag-binding/page.tsx` |
| 대표 검증 유형 후보 | 화면 관찰 |
| 실행 결과 | mismatch |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | 바인딩된 cacheTag 목록 확인 | 태그 뱃지 목록 확인 | 실습 영역 | 예 | 4개 태그 뱃지 표시 |
| 2 | 다중 태그 계층 구조 확인 | 계층 구조 확인 | 실습 영역 | 아니오 | `cacheTag()` 호출 없는 정적 배열 렌더링 (`D02`, `D03`) |
| 3 | 태그 무효화 조건 설명 관찰 | 안내 문구 관찰 | 실습 영역 | 예 | 안내 텍스트 확인 |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | cacheTag() 다중 태그 바인딩 | 서버 함수 내 `cacheTag('products', ...)` 복수 태그 등록 | 하드코딩 문자열 배열 렌더링으로 대체 | 화면 관찰 | 소스 코드 | `CacheTagMultiBindingDemo.tsx` | 예 | fail |
| 2 | 태그 뱃지 렌더링 | 4개 태그 뱃지 UI 렌더링 | 정상 렌더링 | 화면 관찰 | 실습 화면 | 태그 목록 | 예 | pass |
| 3 | 검증 패널 연동 | 다중 태그 바인딩 검증 | props 미전달로 대기 상태 고정 | 화면 관찰 | 검증 패널 | Actual 영역 | 아니오 | fail |

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | medium | G01, G02 | 태그 무효화 테스트 및 캐시 재생성 인터랙션 단계 추가 |
| 데모 예제 | 예 | high | D02, D03 | 실제 `use cache`와 `cacheTag()`를 사용하고 `revalidateTag()` 호출로 태그별 무효화를 검증할 수 있도록 재구현 |
| 검증 | 예 | high | V01, V05 | 바인딩된 태그 리스트와 캐시 버전을 검증 패널에 연결 |
| 개념 정리 | 아니오 | none | — | cacheTag 스펙 설명 유지 |

#### 증거 파일

- 소스 코드: `CacheTagMultiBindingDemo.tsx` 내 하드코딩 `tags` 배열 확인.

#### 종합 메모

- 최종 유형 검토: 화면 관찰 및 전후 변화형. 단일 캐시 엔트리에 여러 태그가 등록되고 개별 태그 무효화에 반응하는지 검증한다.

---

### 167. functions/cache-tag/cascade-invalidation — cacheTag 연쇄 무효화 (Cascade Invalidation)

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | cache |
| 근거 문서 | `3-api-reference/3.3-functions/cacheTag.md` |
| 진입점 | `apps/demo-cache-components/src/app/zone/cache/functions/cache-tag/cascade-invalidation/page.tsx` |
| 대표 검증 유형 후보 | 전후 변화 |
| 실행 결과 | mismatch |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [상위 카테고리 태그 연쇄 무효화] 버튼 클릭 | 버튼 클릭 | 실습 영역 | 예 | 텍스트 상태 변경 |
| 2 | revalidateTag('category-tech') 발동 확인 | 안내 문구 확인 | 실습 영역 | 아니오 | Server Action/revalidateTag 없이 로컬 state 텍스트 치환 (`D02`, `D03`) |
| 3 | 하위 120개 연관 상품 캐시 연쇄 무효화 결과 관찰 | 문구 관찰 | 실습 영역 | 아니오 | 실제 상품 캐시 데이터 부재 (`D03`) |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | revalidateTag() 연쇄 무효화 | 상위 태그 무효화 시 하위 연관 캐시 일괄 무효화 및 재생성 | 로컬 useState 문자열 치환 | 전후 변화 | 소스 코드 | `CacheTagCascadeDemo.tsx` | 예 | fail |
| 2 | 버튼 인터랙션 | 버튼 클릭 시 텍스트 갱신 | 정상 갱신 | 값 비교 | 실습 화면 | 상태 텍스트 | 예 | pass |
| 3 | 검증 패널 연동 | 연쇄 무효화 상태 검증 | props 미전달로 대기 상태 고정 | 전후 변화 | 검증 패널 | Actual 영역 | 아니오 | fail |

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 아니오 | none | — | 3단계 절차 유지 |
| 데모 예제 | 예 | high | D02, D03 | 실제 복수의 하위 캐시 엔트리와 상위 태그를 바인딩하고 실제 Server Action으로 무효화하도록 재구현 |
| 검증 | 예 | high | V01, V05 | 무효화된 태그 및 하위 항목 캐시 갱신 결과를 검증 패널에 연결 |
| 개념 정리 | 아니오 | none | — | 공식 스펙 설명 유지 |

#### 증거 파일

- 소스 코드: `CacheTagCascadeDemo.tsx` 확인.

#### 종합 메모

- 최종 유형 검토: 전후 변화형. 상위 카테고리 태그 1회 무효화로 연쇄된 하위 상품 엔트리들의 캐시 갱신을 검증한다.

---

### 168. functions/unstable-cache/db-query — unstable_cache를 통한 DB 쿼리 결과 캐싱

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | cache |
| 근거 문서 | `3-api-reference/3.3-functions/unstable_cache.md` |
| 진입점 | `apps/demo-cache-components/src/app/zone/cache/functions/unstable-cache/db-query/page.tsx` |
| 대표 검증 유형 후보 | 전후 변화 |
| 실행 결과 | mismatch |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [PROD-001], [PROD-002], [PROD-003] 상품 버튼 클릭 | `PROD-002` 클릭 | 실습 영역 | 예 | 380ms 딜레이 후 MISS -> HIT 전환 |
| 2 | Data Cache 적중 상태 (HIT vs MISS) 및 응답 지연 시간 확인 | HIT/MISS 뱃지 및 지연시간 확인 | 실습 영역 | 아니오 | 실제 서버 unstable_cache 없이 client setTimeout(380) 시뮬레이션 (`D02`, `D03`) |
| 3 | [태그 무효화 (revalidateTag)] 클릭 후 재조회 관찰 | 태그 무효화 클릭 | 실습 영역 | 예 | 캐시 Set 초기화 및 PURGED 표시 |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | unstable_cache() 서버 캐싱 | DB 쿼리 함수를 unstable_cache로 래핑하여 서버 캐시 적중 | 클라이언트 setTimeout 및 Set 자료구조로 모사 | 전후 변화 | 소스 코드 | `UnstableCacheDbDemo.tsx` | 예 | fail |
| 2 | 캐시 적중 및 무효화 시뮬레이션 UI | 버튼 클릭에 따른 지연시간 및 상태 갱신 | UI 상 완성도 높게 모사됨 | 값 비교 | 실습 화면 | 제어 콘솔 | 예 | pass |
| 3 | 검증 패널 연동 | Data Cache 적중 여부 검증 | props 미전달로 대기 상태 고정 | 전후 변화 | 검증 패널 | Actual 영역 | 아니오 | fail |

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 아니오 | none | — | 3단계 절차 유지 |
| 데모 예제 | 예 | high | D02, D03 | 실제 서버 액션 또는 서버 컴포넌트에서 `unstable_cache()`를 호출하여 실제 서버 타임스탬프와 지연 시간을 측정하도록 재구현 |
| 검증 | 예 | high | V01, V05 | 실제 서버 응답 시간과 캐시 적중 상태를 검증 패널에 바인딩 |
| 개념 정리 | 아니오 | none | — | unstable_cache 스펙 설명 유지 |

#### 증거 파일

- 소스 코드: `UnstableCacheDbDemo.tsx` 내 `new Promise((r) => setTimeout(r, 380))` 확인.

#### 종합 메모

- 최종 유형 검토: 전후 변화 및 값 비교형. 실제 서버 레벨의 `unstable_cache` 호출과 캐시 키/태그 무효화를 검증한다.

---

### 169. functions/unstable-no-store/dynamic-bailout — unstable_noStore() 동적 렌더링 명시적 선언

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `3-api-reference/3.3-functions/unstable_noStore.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/functions/unstable-no-store/dynamic-bailout/page.tsx` |
| 대표 검증 유형 후보 | 전후 변화 |
| 실행 결과 | mismatch |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [러닝화 (#001)], [윈드브레이커 (#002)] 상품 선택 | 러닝화 클릭 | 실습 영역 | 예 | 선택 변경 |
| 2 | 주문 수량 조절 및 [동작 실행] 클릭 | + 버튼 및 동작 실행 클릭 | 실습 영역 | 예 | 로그 추가 |
| 3 | unstable_noStore() 동작 및 실시간 렌더링 관찰 | 로그 확인 | 실습 영역 | 아니오 | 범용 스텁 UI로 unstable_noStore와 무관 (`D01`, `D02`, `D03`) |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | unstable_noStore() 호출 및 동적 렌더링 전환 | 컴포넌트 내 unstable_noStore() 호출로 정적 최적화 제외 | 범용 스텁 로그 컴포넌트 렌더링 | 전후 변화 | 소스 코드 | `UnstableNoStoreDemo.tsx` | 예 | fail |
| 2 | 스텁 UI 인터랙션 | 수량 변경 및 로그 추가 | 로컬 동작 정상 | 값 비교 | 실습 화면 | 제어 카드 | 예 | pass |
| 3 | 검증 패널 연동 | 동적 렌더링 검증 | props 미전달로 대기 상태 고정 | 전후 변화 | 검증 패널 | Actual 영역 | 아니오 | fail |

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G01, G02 | unstable_noStore() 스펙에 맞는 가이드로 전면 개정 |
| 데모 예제 | 예 | high | D01, D02, D03 | 범용 스텁을 폐기하고 실제 `unstable_noStore()` 호출 및 동적 타임스탬프 렌더링 데모로 전면 재구현 (P1) |
| 검증 | 예 | high | V01, V05 | 렌더링 시각 및 dynamic bailout 상태를 검증 패널에 연결 |
| 개념 정리 | 아니오 | none | — | unstable_noStore 설명 유지 |

#### 증거 파일

- 소스 코드: `UnstableNoStoreDemo.tsx` (범용 스텁 템플릿) 확인.

#### 종합 메모

- 최종 유형 검토: 전후 변화형. 컴포넌트 내 `unstable_noStore()` 선언 시 매 요청마다 서버 렌더링이 발생하는지 검증한다.

---

### 170. functions/revalidate-path/page-vs-layout — revalidatePath page vs layout 레벨 일괄 무효화 대조

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | cache |
| 근거 문서 | `3-api-reference/3.3-functions/revalidatePath.md` |
| 진입점 | `apps/demo-cache-components/src/app/zone/cache/functions/revalidate-path/page-vs-layout/page.tsx` |
| 대표 검증 유형 후보 | 전후 변화 |
| 실행 결과 | mismatch |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [revalidatePath('/shop', 'page')] 버튼 클릭 | page 버튼 클릭 | 실습 영역 | 예 | 루트 페이지 1개만 PURGED |
| 2 | [revalidatePath('/shop', 'layout')] 버튼 클릭 | layout 버튼 클릭 | 실습 영역 | 예 | 하위 4개 라우트 PURGED |
| 3 | 라우트 트리 세그먼트별 무효화 범위 대조 관찰 | 매트릭스 관찰 | 실습 영역 | 예 | PURGED vs PRESERVED 대조 |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | revalidatePath(path, scope) 서버 액션 호출 | 서버에서 실제 revalidatePath(targetPath, scope) 실행 | `actions.ts`에서 실제 revalidatePath 호출 성공 | 전후 변화 | 소스 코드 | `actions.ts` | 예 | pass |
| 2 | 페이지 vs 레이아웃 스코프 차이 표시 | page는 단일 라우트, layout은 하위 라우트 전체 무효화 | 매트릭스에 정상 반영 | 값 비교 | 실습 화면 | 세그먼트 매트릭스 | 예 | pass |
| 3 | 검증 패널 연동 | 무효화 스코프 실증 검증 | props 미전달로 대기 상태 고정 | 전후 변화 | 검증 패널 | Actual 영역 | 아니오 | fail |

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 아니오 | none | — | 현재 3단계 절차 정확 |
| 데모 예제 | 아니오 | none | — | 실제 Server Action과 revalidatePath 호출 및 스코프별 응답 데이터 매핑 완료 (골든 샘플 후보) |
| 검증 | 예 | medium | V01, V05 | 실행된 액션 결과(scope, purgedCount)를 검증 패널에 전달하도록 바인딩 보강 |
| 개념 정리 | 아니오 | none | — | 공식 스펙 설명 유지 |

#### 증거 파일

- 소스 코드: `actions.ts` 내 `revalidatePath(targetPath, scope)` 호출 확인.

#### 종합 메모

- 최종 유형 검토: 전후 변화 및 값 비교형. 골든 샘플 후보. 검증 패널에 액션 결과 바인딩만 완료하면 `verified` 전환 가능.

---

### 171. functions/revalidate-path/dynamic-route — 동적 라우트 세그먼트 revalidatePath 동기화

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | cache |
| 근거 문서 | `3-api-reference/3.3-functions/revalidatePath.md` |
| 진입점 | `apps/demo-cache-components/src/app/zone/cache/functions/revalidate-path/dynamic-route/page.tsx` |
| 대표 검증 유형 후보 | 전후 변화 |
| 실행 결과 | mismatch |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [러닝화 (#001)], [윈드브레이커 (#002)] 상품 선택 | 러닝화 클릭 | 실습 영역 | 예 | 선택 변경 |
| 2 | 수량 조절 및 [동작 실행] 클릭 | 버튼 클릭 | 실습 영역 | 예 | 로그 추가 |
| 3 | 동적 라우트 세그먼트 revalidatePath 동기화 관찰 | 로그 확인 | 실습 영역 | 아니오 | 범용 스텁 UI로 dynamic route revalidatePath와 무관 (`D01`, `D02`, `D03`) |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | 동적 라우트 revalidatePath('/products/[id]', 'page') 실행 | 동적 파라미터 경로 캐시 무효화 | 범용 스텁 로그 컴포넌트 렌더링 | 전후 변화 | 소스 코드 | `RevalidatePathDynamicDemo.tsx` | 예 | fail |
| 2 | 스텁 UI 인터랙션 | 수량 변경 및 로그 추가 | 로컬 동작 정상 | 값 비교 | 실습 화면 | 제어 카드 | 예 | pass |
| 3 | 검증 패널 연동 | 동적 경로 재검증 검증 | props 미전달로 대기 상태 고정 | 전후 변화 | 검증 패널 | Actual 영역 | 아니오 | fail |

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G01, G02 | 동적 라우트 revalidatePath 가이드로 전면 개정 |
| 데모 예제 | 예 | high | D01, D02, D03 | 범용 스텁을 폐기하고 실제 `revalidatePath('/products/[id]', 'page')` 서버 액션 데모로 전면 재구현 (P1) |
| 검증 | 예 | high | V01, V05 | 동적 경로 타깃과 무효화 결과를 검증 패널에 연결 |
| 개념 정리 | 아니오 | none | — | 공식 스펙 설명 유지 |

#### 증거 파일

- 소스 코드: `RevalidatePathDynamicDemo.tsx` (범용 스텁 템플릿) 확인.

#### 종합 메모

- 최종 유형 검토: 전후 변화형. 동적 세그먼트 파라미터가 포함된 경로의 `revalidatePath` 호출 동작을 검증한다.

---

### 172. functions/revalidate-tag/basic-tag-purge — revalidateTag() 기본 무효화 및 SWR 재검증

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | cache |
| 근거 문서 | `3-api-reference/3.3-functions/revalidateTag.md` |
| 진입점 | `apps/demo-cache-components/src/app/zone/cache/functions/revalidate-tag/basic-tag-purge/page.tsx` |
| 대표 검증 유형 후보 | 전후 변화 |
| 실행 결과 | mismatch |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [revalidateTag('inventory') 실행] 버튼 클릭 | 버튼 클릭 | 실습 영역 | 예 | Server Action 호출 |
| 2 | 재고 캐시 슬롯 무효화 및 버전 갱신 확인 | 버전 ID 및 재고 수량 갱신 확인 | 실습 영역 | 예 | versionId 및 재고 변동 확인 |
| 3 | 실시간 재고 동기화 결과 관찰 | 동기화 시각 관찰 | 실습 영역 | 예 | timestamp 표시 |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | revalidateTag('inventory', 'max') 서버 액션 호출 | 서버 메모리 DB 갱신 및 revalidateTag 호출 | `actions.ts`에서 실제 revalidateTag 호출 및 재고 차감 | 전후 변화 | 소스 코드 | `actions.ts` | 예 | pass |
| 2 | 캐시 버전 및 재고 수치 갱신 | 버튼 클릭 시 실시간 재고 및 버전 표시 | 실습 영역에 정상 반영 | 값 비교 | 실습 화면 | 재고 테이블 | 예 | pass |
| 3 | 검증 패널 연동 | 태그 무효화 실증 검증 | props 미전달로 대기 상태 고정 | 전후 변화 | 검증 패널 | Actual 영역 | 아니오 | fail |

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 아니오 | none | — | 3단계 절차 정확 |
| 데모 예제 | 아니오 | none | — | 실제 Server Action과 revalidateTag 호출 및 재고 상태 변경 정상 작동 (골든 샘플 후보) |
| 검증 | 예 | medium | V01, V05 | 액션 결과(tag, versionId, status)를 검증 패널에 바인딩 |
| 개념 정리 | 아니오 | none | — | 공식 스펙 설명 유지 |

#### 증거 파일

- 소스 코드: `actions.ts` 내 `revalidateTag('inventory', 'max')` 확인.

#### 종합 메모

- 최종 유형 검토: 전후 변화 및 값 비교형. 골든 샘플 후보. 검증 패널에 props만 연결하면 `verified` 전환 가능.

---

### 173. functions/revalidate-tag/max-expiration — revalidateTag max 즉시 만료 제어

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | cache |
| 근거 문서 | `3-api-reference/3.3-functions/revalidateTag.md` |
| 진입점 | `apps/demo-cache-components/src/app/zone/cache/functions/revalidate-tag/max-expiration/page.tsx` |
| 대표 검증 유형 후보 | 전후 변화 |
| 실행 결과 | mismatch |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [러닝화 (#001)], [윈드브레이커 (#002)] 상품 선택 | 러닝화 클릭 | 실습 영역 | 예 | 선택 변경 |
| 2 | 수량 조절 및 [동작 실행] 클릭 | 버튼 클릭 | 실습 영역 | 예 | 로그 추가 |
| 3 | revalidateTag max 즉시 만료 제어 관찰 | 로그 확인 | 실습 영역 | 아니오 | 범용 스텁 UI로 revalidateTag max와 무관 (`D01`, `D02`, `D03`) |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | revalidateTag(tag, 'max') 즉시 만료 호출 | Next.js 16 max 프로파일 기반 캐시 즉시 만료 | 범용 스텁 로그 컴포넌트 렌더링 | 전후 변화 | 소스 코드 | `RevalidateTagMaxDemo.tsx` | 예 | fail |
| 2 | 스텁 UI 인터랙션 | 수량 변경 및 로그 추가 | 로컬 동작 정상 | 값 비교 | 실습 화면 | 제어 카드 | 예 | pass |
| 3 | 검증 패널 연동 | max 만료 검증 | props 미전달로 대기 상태 고정 | 전후 변화 | 검증 패널 | Actual 영역 | 아니오 | fail |

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G01, G02 | revalidateTag max 옵션 가이드로 전면 개정 |
| 데모 예제 | 예 | high | D01, D02, D03 | 범용 스텁을 폐기하고 실제 `revalidateTag(tag, 'max')` 호출 데모로 전면 재구현 (P1) |
| 검증 | 예 | high | V01, V05 | max 만료 결과와 캐시 상태를 검증 패널에 연결 |
| 개념 정리 | 아니오 | none | — | Next 16 max 옵션 스펙 유지 |

#### 증거 파일

- 소스 코드: `RevalidateTagMaxDemo.tsx` (범용 스텁 템플릿) 확인.

#### 종합 메모

- 최종 유형 검토: 전후 변화형. Next.js 16 `revalidateTag(tag, 'max')`의 즉각 만료 동작을 검증한다.

---

### 174. functions/update-tag/instant-memory-sync — updateTag() 즉시 캐시 메모리 패치

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | cache |
| 근거 문서 | `3-api-reference/3.3-functions/updateTag.md` |
| 진입점 | `apps/demo-cache-components/src/app/zone/cache/functions/update-tag/instant-memory-sync/page.tsx` |
| 대표 검증 유형 후보 | 전후 변화 |
| 실행 결과 | mismatch |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [updateTag('cart', ...) 즉시 패치] 버튼 클릭 | 버튼 클릭 | 실습 영역 | 예 | 수량 1 증가 |
| 2 | 장바구니 캐시 메모리 즉시 갱신 확인 | 수량 표시 확인 | 실습 영역 | 아니오 | 실제 updateTag() 호출 없는 로컬 useState 증감 (`D02`, `D03`) |
| 3 | DB 재조회 0건 및 즉각 반영 관찰 | 안내 문구 관찰 | 실습 영역 | 예 | 텍스트 표시 |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | updateTag() 캐시 패치 실행 | Next.js 16 updateTag API를 통한 서버 캐시 메모리 즉각 수정 | 클라이언트 `useState(3)` 증감으로 모사 | 전후 변화 | 소스 코드 | `UpdateTagInstantDemo.tsx` | 예 | fail |
| 2 | 수량 증감 인터랙션 | 버튼 클릭 시 수량 카운트 갱신 | UI 정상 작동 | 값 비교 | 실습 화면 | 수량 텍스트 | 예 | pass |
| 3 | 검증 패널 연동 | updateTag 패치 상태 검증 | props 미전달로 대기 상태 고정 | 전후 변화 | 검증 패널 | Actual 영역 | 아니오 | fail |

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 아니오 | none | — | 3단계 절차 유지 |
| 데모 예제 | 예 | high | D02, D03 | Next.js 16 `updateTag()` 실제 서버 액션과 캐시 동기화 로직으로 재구현 |
| 검증 | 예 | high | V01, V05 | 캐시 키 및 패치된 페이로드를 검증 패널에 연결 |
| 개념 정리 | 예 | low | C01 | "DB 재조회 0건" 등 단정 문구 정제 |

#### 증거 파일

- 소스 코드: `UpdateTagInstantDemo.tsx` 내 로컬 `useState` 증감 확인.

#### 종합 메모

- 최종 유형 검토: 전후 변화형. Next.js 16의 `updateTag`를 통한 인메모리 캐시 즉각 패치를 검증한다.

---

### 175. functions/fetch-extended/revalidate-option — Next.js 확장 fetch revalidate 옵션

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `3-api-reference/3.3-functions/fetch.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/functions/fetch-extended/revalidate-option/page.tsx` |
| 대표 검증 유형 후보 | 전후 변화 |
| 실행 결과 | mismatch |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [러닝화 (#001)], [윈드브레이커 (#002)] 상품 선택 | 러닝화 클릭 | 실습 영역 | 예 | 선택 변경 |
| 2 | 수량 조절 및 [동작 실행] 클릭 | 버튼 클릭 | 실습 영역 | 예 | 로그 추가 |
| 3 | fetch revalidate 옵션 동작 관찰 | 로그 확인 | 실습 영역 | 아니오 | 범용 스텁 UI로 fetch revalidate와 무관 (`D01`, `D02`, `D03`) |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | fetch(url, { next: { revalidate: N } }) 호출 | 시간 기반 fetch 캐시 재검증 동작 | 범용 스텁 로그 컴포넌트 렌더링 | 전후 변화 | 소스 코드 | `FetchExtendedRevalidateDemo.tsx` | 예 | fail |
| 2 | 스텁 UI 인터랙션 | 수량 변경 및 로그 추가 | 로컬 동작 정상 | 값 비교 | 실습 화면 | 제어 카드 | 예 | pass |
| 3 | 검증 패널 연동 | fetch revalidate 주기 검증 | props 미전달로 대기 상태 고정 | 전후 변화 | 검증 패널 | Actual 영역 | 아니오 | fail |

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G01, G02 | fetch revalidate 옵션 가이드로 전면 개정 |
| 데모 예제 | 예 | high | D01, D02, D03 | 범용 스텁을 폐기하고 실제 `fetch(url, { next: { revalidate: 60 } })` 비교 데모로 전면 재구현 (P1) |
| 검증 | 예 | high | V01, V05 | fetch 캐시 수명 및 재검증 결과를 검증 패널에 연결 |
| 개념 정리 | 아니오 | none | — | 공식 스펙 설명 유지 |

#### 증거 파일

- 소스 코드: `FetchExtendedRevalidateDemo.tsx` (범용 스텁 템플릿) 확인.

#### 종합 메모

- 최종 유형 검토: 전후 변화 및 값 비교형. 확장된 `fetch`의 `next.revalidate` 옵션 동작을 검증한다.

---

### 176. functions/fetch-extended/tag-option — Next.js 확장 fetch tags 태그 바인딩

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `3-api-reference/3.3-functions/fetch.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/functions/fetch-extended/tag-option/page.tsx` |
| 대표 검증 유형 후보 | 전후 변화 |
| 실행 결과 | mismatch |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [러닝화 (#001)], [윈드브레이커 (#002)] 상품 선택 | 러닝화 클릭 | 실습 영역 | 예 | 선택 변경 |
| 2 | 수량 조절 및 [동작 실행] 클릭 | 버튼 클릭 | 실습 영역 | 예 | 로그 추가 |
| 3 | fetch tags 옵션 태그 바인딩 관찰 | 로그 확인 | 실습 영역 | 아니오 | 범용 스텁 UI로 fetch tags와 무관 (`D01`, `D02`, `D03`) |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | fetch(url, { next: { tags: [...] } }) 호출 | 태그 기반 Data Cache 바인딩 및 무효화 | 범용 스텁 로그 컴포넌트 렌더링 | 전후 변화 | 소스 코드 | `FetchExtendedTagDemo.tsx` | 예 | fail |
| 2 | 스텁 UI 인터랙션 | 수량 변경 및 로그 추가 | 로컬 동작 정상 | 값 비교 | 실습 화면 | 제어 카드 | 예 | pass |
| 3 | 검증 패널 연동 | fetch tags 바인딩 검증 | props 미전달로 대기 상태 고정 | 전후 변화 | 검증 패널 | Actual 영역 | 아니오 | fail |

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G01, G02 | fetch tags 바인딩 가이드로 전면 개정 |
| 데모 예제 | 예 | high | D01, D02, D03 | 범용 스텁을 폐기하고 실제 `fetch(url, { next: { tags: ['collection'] } })` 데모로 전면 재구현 (P1) |
| 검증 | 예 | high | V01, V05 | 바인딩된 태그 및 revalidateTag 연동을 검증 패널에 연결 |
| 개념 정리 | 아니오 | none | — | 공식 스펙 설명 유지 |

#### 증거 파일

- 소스 코드: `FetchExtendedTagDemo.tsx` (범용 스텁 템플릿) 확인.

#### 종합 메모

- 최종 유형 검토: 전후 변화형. 확장 `fetch`의 `next.tags` 옵션 바인딩 및 `revalidateTag`와의 연동을 검증한다.

---

### 177. functions/cookies/get-set-session — cookies().get() 읽기 & cookies().set() 세션 쿠키 발급

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `3-api-reference/3.3-functions/cookies.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/functions/cookies/get-set-session/page.tsx` |
| 대표 검증 유형 후보 | 값 비교 |
| 실행 결과 | mismatch |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [고객 (customer)], [VIP 회원 (vip)], [관리자 (admin)] 버튼 클릭 | `[VIP 회원 (vip)]` 클릭 | 실습 영역 | 예 | 쿠키 목록 갱신 |
| 2 | Server Cookies 헤더 값 확인 | session-token, user-role 값 확인 | 실습 영역 | 아니오 | 실제 `cookies()` 미호출, `useState` 객체 갱신 (`D02`, `D03`) |
| 3 | 세션 쿠키 발급 및 권한 동기화 관찰 | 등급 및 적립금 관찰 | 실습 영역 | 예 | UI 반영 |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | cookies().set() 세션 쿠키 발급 | 서버에서 `await cookies()`를 통한 Set-Cookie 헤더 발급 | 클라이언트 useState 객체로 모사 | 값 비교 | 소스 코드 | `CookiesSessionDemo.tsx` | 예 | fail |
| 2 | 역할 전환 인터랙션 | 3개 역할 전환 및 쿠키 목록 렌더링 | 정상 작동 | 값 비교 | 실습 화면 | 쿠키 헤더 박스 | 예 | pass |
| 3 | 검증 패널 연동 | 쿠키 발급 상태 검증 | props 미전달로 대기 상태 고정 | 값 비교 | 검증 패널 | Actual 영역 | 아니오 | fail |

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 아니오 | none | — | 3단계 절차 유지 |
| 데모 예제 | 예 | high | D02, D03 | 실제 Server Action에서 `(await cookies()).set()`을 호출하여 실제 쿠키를 발급하고 `(await cookies()).get()`으로 검증하도록 재구현 |
| 검증 | 예 | high | V01, V05 | 실제 발급된 쿠키 키/값을 검증 패널에 바인딩 |
| 개념 정리 | 아니오 | none | — | 공식 스펙 설명 유지 |

#### 증거 파일

- 소스 코드: `CookiesSessionDemo.tsx` 내 `useState` 로컬 모사 확인.

#### 종합 메모

- 최종 유형 검토: 값 비교형. Server Action에서 `cookies().set()`으로 발급된 실제 HttpOnly 쿠키의 전달을 검증한다.

---

### 178. functions/cookies/delete-logout — cookies().delete() 세션 파기 및 로그아웃

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `3-api-reference/3.3-functions/cookies.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/functions/cookies/delete-logout/page.tsx` |
| 대표 검증 유형 후보 | 전후 변화 |
| 실행 결과 | mismatch |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [로그아웃 (cookies().delete)] 버튼 클릭 | 버튼 클릭 | 실습 영역 | 예 | 텍스트 변경 |
| 2 | 세션 쿠키 삭제 및 비로그인 상태 전환 확인 | 텍스트 확인 | 실습 영역 | 아니오 | 실제 `cookies().delete()` 호출 없는 useState(false) (`D02`, `D03`) |
| 3 | 세션 파기 결과 관찰 | 안내 문구 관찰 | 실습 영역 | 예 | 텍스트 표시 |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | cookies().delete('session') 세션 파기 | 서버에서 `(await cookies()).delete()`를 통한 쿠키 파기 | 클라이언트 useState boolean 토글로 모사 | 전후 변화 | 소스 코드 | `CookiesDeleteDemo.tsx` | 예 | fail |
| 2 | 로그아웃 버튼 인터랙션 | 버튼 클릭 시 상태 변경 | 정상 변경 | 값 비교 | 실습 화면 | 상태 텍스트 | 예 | pass |
| 3 | 검증 패널 연동 | 세션 삭제 상태 검증 | props 미전달로 대기 상태 고정 | 전후 변화 | 검증 패널 | Actual 영역 | 아니오 | fail |

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 아니오 | none | — | 3단계 절차 유지 |
| 데모 예제 | 예 | high | D02, D03 | 실제 Server Action에서 `(await cookies()).delete()`를 호출하여 쿠키를 파기하도록 재구현 |
| 검증 | 예 | high | V01, V05 | 파기된 쿠키 이름과 세션 상태를 검증 패널에 연결 |
| 개념 정리 | 아니오 | none | — | 공식 스펙 설명 유지 |

#### 증거 파일

- 소스 코드: `CookiesDeleteDemo.tsx` 확인.

#### 종합 메모

- 최종 유형 검토: 전후 변화형. `cookies().delete()` 호출 후 `Set-Cookie: ... Max-Age=0` 응답과 쿠키 소멸을 검증한다.

---

### 179. functions/headers/user-agent-device — headers().get('user-agent') 기기 식별 및 최적화

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `3-api-reference/3.3-functions/headers.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/functions/headers/user-agent-device/page.tsx` |
| 대표 검증 유형 후보 | 화면 관찰 |
| 실행 결과 | mismatch |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [러닝화 (#001)], [윈드브레이커 (#002)] 상품 선택 | 러닝화 클릭 | 실습 영역 | 예 | 선택 변경 |
| 2 | 수량 조절 및 [동작 실행] 클릭 | 버튼 클릭 | 실습 영역 | 예 | 로그 추가 |
| 3 | headers().get('user-agent') 기기 식별 관찰 | 로그 확인 | 실습 영역 | 아니오 | 범용 스텁 UI로 user-agent 헤더와 무관 (`D01`, `D02`, `D03`) |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | headers().get('user-agent') 파싱 | 서버에서 User-Agent를 읽어 기기(Mobile vs Desktop) 분기 | 범용 스텁 로그 컴포넌트 렌더링 | 화면 관찰 | 소스 코드 | `HeadersUserAgentDemo.tsx` | 예 | fail |
| 2 | 스텁 UI 인터랙션 | 수량 변경 및 로그 추가 | 로컬 동작 정상 | 값 비교 | 실습 화면 | 제어 카드 | 예 | pass |
| 3 | 검증 패널 연동 | User-Agent 추출 검증 | props 미전달로 대기 상태 고정 | 화면 관찰 | 검증 패널 | Actual 영역 | 아니오 | fail |

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G01, G02 | headers User-Agent 가이드로 전면 개정 |
| 데모 예제 | 예 | high | D01, D02, D03 | 범용 스텁을 폐기하고 실제 `await headers()`에서 User-Agent를 파싱하여 기기별 최적화 뷰를 렌더링하는 데모로 전면 재구현 (P1) |
| 검증 | 예 | high | V01, V05 | 파싱된 User-Agent 및 디바이스 유형을 검증 패널에 연결 |
| 개념 정리 | 아니오 | none | — | 공식 스펙 설명 유지 |

#### 증거 파일

- 소스 코드: `HeadersUserAgentDemo.tsx` (범용 스텁 템플릿) 확인.

#### 종합 메모

- 최종 유형 검토: 화면 관찰 및 값 비교형. `headers().get('user-agent')`를 통한 서버 사이드 디바이스 감지를 검증한다.

---

### 180. functions/headers/custom-auth-token — headers().get('authorization') 커스텀 인증 토큰 검증

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `3-api-reference/3.3-functions/headers.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/functions/headers/custom-auth-token/page.tsx` |
| 대표 검증 유형 후보 | 값 비교 |
| 실행 결과 | mismatch |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | 기본 [유효 Bearer 토큰] 상태에서 서버 headers() 파싱 결과 확인 | 초기 화면 확인 | 실습 영역 | 예 | 200 OK 및 VIP Member 정보 표시 |
| 2 | [만료된 토큰] 또는 [위조 토큰] 프리셋 선택 후 [토큰 검증] 실행 | 만료된 토큰 클릭 후 검증 실행 | 실습 영역 | 예 | 401 Unauthorized 에러 메시지 표시 |
| 3 | 인증 완료 상태 및 HTTP 200 OK 보안 컨텍스트 관찰 | 유효 토큰 재실행 | 실습 영역 | 예 | 보호된 데이터 정상 반환 |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | headers().get('authorization') 파싱 및 토큰 검증 | 서버 액션에서 실제 `await headers()` 호출 및 Bearer 토큰 검증 | `actions.ts`에서 `await headers()` 호출 및 Bearer 토큰 검증 로직 완비 | 값 비교 | 소스 코드 | `actions.ts` | 예 | pass |
| 2 | 토큰 상태별 401 / 200 분기 | 만료/위조 토큰 시 401, 유효 토큰 시 200 반환 | 정상 분기 확인 | 값 비교 | 실습 화면 | 응답 카드 | 예 | pass |
| 3 | 검증 패널 연동 | 토큰 인증 결과 검증 | props 미전달로 대기 상태 고정 | 값 비교 | 검증 패널 | Actual 영역 | 아니오 | fail |

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 아니오 | none | — | 3단계 절차 정확 |
| 데모 예제 | 아니오 | none | — | 실제 Server Action과 `headers()` 파싱, Bearer 토큰 검증 콘솔 완비 (골든 샘플 후보) |
| 검증 | 예 | medium | V01, V05 | 액션 결과(status, userId, role)를 검증 패널에 바인딩 |
| 개념 정리 | 아니오 | none | — | 공식 스펙 설명 유지 |

#### 증거 파일

- 소스 코드: `actions.ts` 내 `headers()` 및 Bearer 토큰 파싱 로직 확인.

#### 종합 메모

- 최종 유형 검토: 값 비교형. 골든 샘플 후보. `VerificationFooter`에 결과 props 전달 시 `verified` 전환 가능.

---

### 181. functions/draft-mode/enable-preview — draftMode().enable() 초안 모드 활성화

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `3-api-reference/3.3-functions/draft-mode.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/functions/draft-mode/enable-preview/page.tsx` |
| 대표 검증 유형 후보 | 전후 변화 |
| 실행 결과 | mismatch |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [draftMode().enable() 실행] 버튼 클릭 | 버튼 클릭 | 실습 영역 | 예 | 텍스트 변경 |
| 2 | Draft Mode 쿠키 (__prerender_bypass) 발급 확인 | 텍스트 확인 | 실습 영역 | 아니오 | 실제 `(await draftMode()).enable()` 미호출, useState(true) (`D02`, `D03`) |
| 3 | 미리보기 활성화 상태 관찰 | 텍스트 관찰 | 실습 영역 | 예 | 보라색 활성 텍스트 표시 |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | (await draftMode()).enable() 호출 | 서버에서 Draft Mode 쿠키 발급 및 정적 캐시 우회 | 클라이언트 useState boolean 토글로 모사 | 전후 변화 | 소스 코드 | `DraftModeEnableDemo.tsx` | 예 | fail |
| 2 | 버튼 인터랙션 | 버튼 클릭 시 상태 갱신 | 정상 갱신 | 값 비교 | 실습 화면 | 상태 텍스트 | 예 | pass |
| 3 | 검증 패널 연동 | Draft Mode 활성화 검증 | props 미전달로 대기 상태 고정 | 전후 변화 | 검증 패널 | Actual 영역 | 아니오 | fail |

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 아니오 | none | — | 3단계 절차 유지 |
| 데모 예제 | 예 | high | D02, D03 | 실제 Route Handler / Server Action에서 `(await draftMode()).enable()`을 호출하여 실제 bypass 쿠키 발급 데모로 재구현 |
| 검증 | 예 | high | V01, V05 | Draft Mode 활성 여부와 bypass 쿠키를 검증 패널에 연결 |
| 개념 정리 | 아니오 | none | — | 공식 스펙 설명 유지 |

#### 증거 파일

- 소스 코드: `DraftModeEnableDemo.tsx` 확인.

#### 종합 메모

- 최종 유형 검토: 전후 변화형. `draftMode().enable()` 호출에 따른 `__prerender_bypass` 쿠키 발급을 검증한다.

---

### 182. functions/draft-mode/disable-preview — draftMode().disable() 정적 캐시 모드 복귀

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `3-api-reference/3.3-functions/draft-mode.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/functions/draft-mode/disable-preview/page.tsx` |
| 대표 검증 유형 후보 | 전후 변화 |
| 실행 결과 | mismatch |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [draftMode().disable() 실행 (미리보기 닫기)] 버튼 클릭 | 버튼 클릭 | 실습 영역 | 예 | 텍스트 변경 |
| 2 | Draft Mode 쿠키 제거 및 정적 캐시 모드 복귀 확인 | 텍스트 확인 | 실습 영역 | 아니오 | 실제 `(await draftMode()).disable()` 미호출, useState(false) (`D02`, `D03`) |
| 3 | 정적 캐시 복귀 결과 관찰 | 텍스트 관찰 | 실습 영역 | 예 | 복귀 완료 텍스트 표시 |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | (await draftMode()).disable() 호출 | 서버에서 Draft Mode 쿠키 제거 및 정적 캐시 모드로 복귀 | 클라이언트 useState boolean 토글로 모사 | 전후 변화 | 소스 코드 | `DraftModeDisableDemo.tsx` | 예 | fail |
| 2 | 버튼 인터랙션 | 버튼 클릭 시 상태 갱신 | 정상 갱신 | 값 비교 | 실습 화면 | 상태 텍스트 | 예 | pass |
| 3 | 검증 패널 연동 | Draft Mode 비활성화 검증 | props 미전달로 대기 상태 고정 | 전후 변화 | 검증 패널 | Actual 영역 | 아니오 | fail |

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 아니오 | none | — | 3단계 절차 유지 |
| 데모 예제 | 예 | high | D02, D03 | 실제 Server Action / Route Handler에서 `(await draftMode()).disable()`을 호출하도록 재구현 |
| 검증 | 예 | high | V01, V05 | Draft Mode 해제 상태를 검증 패널에 바인딩 |
| 개념 정리 | 아니오 | none | — | 공식 스펙 설명 유지 |

#### 증거 파일

- 소스 코드: `DraftModeDisableDemo.tsx` 확인.

#### 종합 메모

- 최종 유형 검토: 전후 변화형. `draftMode().disable()`에 의한 프리뷰 쿠키 제거 및 정적 캐시 복귀를 검증한다.

---

### 183. functions/after/background-logging — after() 백그라운드 주문 로깅 (응답 지연 0ms)

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `3-api-reference/3.3-functions/after.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/functions/after/background-logging/page.tsx` |
| 대표 검증 유형 후보 | 전후 변화 |
| 실행 결과 | mismatch |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [최종 결제 승인 요청] 버튼 클릭 | 버튼 클릭 | 실습 영역 | 예 | 즉시 결제 완료 표시 후 800ms 뒤 로그 3건 추가 |
| 2 | 클라이언트 즉각 응답 렌더링 확인 | 파란색 주문 응답 박스 확인 | 실습 영역 | 예 | 즉시 렌더링 |
| 3 | after() 백그라운드 후속 작업 타임라인 관찰 | 로그 타임라인 확인 | 실습 영역 | 아니오 | 실제 서버 `after()` 미호출, 클라이언트 `setTimeout(800)` 시뮬레이션 (`D02`, `D03`) |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | after() 백그라운드 작업 스케줄링 | 응답 전송 후 서버 백그라운드에서 비동기 작업 실행 | 클라이언트 startTransition 내 setTimeout으로 모사 | 전후 변화 | 소스 코드 | `AfterLoggingDemo.tsx` | 예 | fail |
| 2 | 주문 완료 및 비동기 로그 UI | 버튼 클릭 시 클라이언트 응답과 지연 로그 순차 표시 | UI 인터랙션 정상 | 값 비교 | 실습 화면 | 로그 타임라인 | 예 | pass |
| 3 | 검증 패널 연동 | after() 백그라운드 완료 검증 | props 미전달로 대기 상태 고정 | 전후 변화 | 검증 패널 | Actual 영역 | 아니오 | fail |

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 아니오 | none | — | 3단계 절차 유지 |
| 데모 예제 | 예 | high | D02, D03 | 실제 Server Action 내에서 `after(async () => { ... })`를 호출하고 서버 로그/이벤트를 기록하도록 재구현 |
| 검증 | 예 | high | V01, V05 | 응답 완료 시각과 after() 백그라운드 작업 완료 시각을 검증 패널에 연결 |
| 개념 정리 | 예 | low | C01 | "응답 지연 0ms" 등 절대 수치 정제 |

#### 증거 파일

- 소스 코드: `AfterLoggingDemo.tsx` 내 클라이언트 `setTimeout` 확인.

#### 종합 메모

- 최종 유형 검토: 전후 변화형. `after()`를 통해 응답 반환과 백그라운드 로깅의 비동기 분리를 검증한다.

---

### 184. functions/after/analytics-batch — after() 비동기 데이터 분석 배치 파이프라인

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `3-api-reference/3.3-functions/after.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/functions/after/analytics-batch/page.tsx` |
| 대표 검증 유형 후보 | 전후 변화 |
| 실행 결과 | mismatch |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [러닝화 (#001)], [윈드브레이커 (#002)] 상품 선택 | 러닝화 클릭 | 실습 영역 | 예 | 선택 변경 |
| 2 | 수량 조절 및 [동작 실행] 클릭 | 버튼 클릭 | 실습 영역 | 예 | 로그 추가 |
| 3 | after() 분석 배치 파이프라인 관찰 | 로그 확인 | 실습 영역 | 아니오 | 범용 스텁 UI로 after()와 무관 (`D01`, `D02`, `D03`) |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | after() 비동기 데이터 분석 배치 실행 | 응답 완료 후 분석 이벤트 배치 전송 | 범용 스텁 로그 컴포넌트 렌더링 | 전후 변화 | 소스 코드 | `AfterAnalyticsBatchDemo.tsx` | 예 | fail |
| 2 | 스텁 UI 인터랙션 | 수량 변경 및 로그 추가 | 로컬 동작 정상 | 값 비교 | 실습 화면 | 제어 카드 | 예 | pass |
| 3 | 검증 패널 연동 | after() 배치 파이프라인 검증 | props 미전달로 대기 상태 고정 | 전후 변화 | 검증 패널 | Actual 영역 | 아니오 | fail |

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G01, G02 | after() 분석 배치 파이프라인 가이드로 전면 개정 |
| 데모 예제 | 예 | high | D01, D02, D03 | 범용 스텁을 폐기하고 실제 `after()` 배치 로깅 데모로 전면 재구현 (P1) |
| 검증 | 예 | high | V01, V05 | 배치 전송 상태 및 서버 타임스탬프를 검증 패널에 연결 |
| 개념 정리 | 아니오 | none | — | 공식 스펙 설명 유지 |

#### 증거 파일

- 소스 코드: `AfterAnalyticsBatchDemo.tsx` (범용 스텁 템플릿) 확인.

#### 종합 메모

- 최종 유형 검토: 전후 변화형. `after()`를 이용한 백그라운드 대용량 분석 배치 전송을 검증한다.

---

### 185. functions/not-found/trigger-404 — notFound() 404 트리거 및 not-found.tsx 렌더

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `3-api-reference/3.3-functions/not-found.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/functions/not-found/trigger-404/page.tsx` |
| 대표 검증 유형 후보 | 화면 관찰 |
| 실행 결과 | mismatch |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [러닝화 (#001)], [윈드브레이커 (#002)] 상품 선택 | 러닝화 클릭 | 실습 영역 | 예 | 선택 변경 |
| 2 | 수량 조절 및 [동작 실행] 클릭 | 버튼 클릭 | 실습 영역 | 예 | 로그 추가 |
| 3 | notFound() 트리거 및 not-found.tsx 관찰 | 로그 확인 | 실습 영역 | 아니오 | 범용 스텁 UI로 notFound()와 무관 (`D01`, `D02`, `D03`) |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | notFound() 함수 호출 및 404 UI 렌더링 | 유효하지 않은 ID 조회 시 notFound() 호출로 not-found.tsx 렌더 | 범용 스텁 로그 컴포넌트 렌더링 | 화면 관찰 | 소스 코드 | `NotFoundTriggerDemo.tsx` | 예 | fail |
| 2 | 스텁 UI 인터랙션 | 수량 변경 및 로그 추가 | 로컬 동작 정상 | 값 비교 | 실습 화면 | 제어 카드 | 예 | pass |
| 3 | 검증 패널 연동 | notFound 트리거 검증 | props 미전달로 대기 상태 고정 | 화면 관찰 | 검증 패널 | Actual 영역 | 아니오 | fail |

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G01, G02 | notFound() 가이드로 전면 개정 |
| 데모 예제 | 예 | high | D01, D02, D03 | 범용 스텁을 폐기하고 실제 `notFound()` 호출 및 `not-found.tsx` 바운더리 격리 데모로 전면 재구현 (P1) |
| 검증 | 예 | high | V01, V05 | HTTP 404 상태와 not-found UI 렌더링을 검증 패널에 연결 |
| 개념 정리 | 아니오 | none | — | 공식 스펙 설명 유지 |

#### 증거 파일

- 소스 코드: `NotFoundTriggerDemo.tsx` (범용 스텁 템플릿) 확인.

#### 종합 메모

- 최종 유형 검토: 화면 관찰형. 존재하지 않는 리소스 요청 시 `notFound()`가 트리거되어 404 컴포넌트가 격리 렌더링되는지 검증한다.

---

### 186. functions/forbidden/trigger-403 — forbidden() 403 인가 거부 트리거

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `3-api-reference/3.3-functions/forbidden.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/functions/forbidden/trigger-403/page.tsx` |
| 대표 검증 유형 후보 | 화면 관찰 |
| 실행 결과 | mismatch |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [일반 고객 (CUSTOMER)] 또는 [스토어 관리자 (ADMIN)] 역할 선택 | `CUSTOMER` 선택 | 실습 영역 | 예 | 역할 전환 |
| 2 | [정산 관리자 페이지 접근 시도] 클릭 | 접근 시도 클릭 | 실습 영역 | 예 | 403 Forbidden 빨간 박스 렌더링 |
| 3 | forbidden.tsx 렌더링 또는 200 OK 정산 데이터 관찰 | 403 vs 200 확인 | 실습 영역 | 아니오 | 실제 `forbidden()` 미호출, 클라이언트 if문 렌더링 (`D02`, `D03`) |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | forbidden() 함수 호출 및 403 바운더리 렌더 | 비인가 접근 시 forbidden() 호출로 forbidden.tsx 렌더 | 클라이언트 삼항 연산자 컴포넌트로 모사 | 화면 관찰 | 소스 코드 | `ForbiddenTriggerDemo.tsx` | 예 | fail |
| 2 | 역할별 접근 제어 UI | 고객일 때 403, 관리자일 때 200 렌더링 | UI 정상 동작 | 값 비교 | 실습 화면 | 결과 박스 | 예 | pass |
| 3 | 검증 패널 연동 | 403 인가 거부 검증 | props 미전달로 대기 상태 고정 | 화면 관찰 | 검증 패널 | Actual 영역 | 아니오 | fail |

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 아니오 | none | — | 3단계 절차 유지 |
| 데모 예제 | 예 | high | D02, D03 | 실제 Next.js 16 `forbidden()` 호출 및 `forbidden.tsx` 파일 컴포넌트로 격리 재구현 |
| 검증 | 예 | high | V01, V05 | HTTP 403 상태와 인가 결과를 검증 패널에 연결 |
| 개념 정리 | 아니오 | none | — | 공식 스펙 설명 유지 |

#### 증거 파일

- 소스 코드: `ForbiddenTriggerDemo.tsx` 확인.

#### 종합 메모

- 최종 유형 검토: 화면 관찰형. 권한 부족 시 `forbidden()` 호출을 통한 403 전용 에러 바운더리 렌더링을 검증한다.

---

### 187. functions/unauthorized/trigger-401 — unauthorized() 401 인증 필요 트리거

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `3-api-reference/3.3-functions/unauthorized.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/functions/unauthorized/trigger-401/page.tsx` |
| 대표 검증 유형 후보 | 화면 관찰 |
| 실행 결과 | mismatch |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [러닝화 (#001)], [윈드브레이커 (#002)] 상품 선택 | 러닝화 클릭 | 실습 영역 | 예 | 선택 변경 |
| 2 | 수량 조절 및 [동작 실행] 클릭 | 버튼 클릭 | 실습 영역 | 예 | 로그 추가 |
| 3 | unauthorized() 트리거 및 unauthorized.tsx 관찰 | 로그 확인 | 실습 영역 | 아니오 | 범용 스텁 UI로 unauthorized()와 무관 (`D01`, `D02`, `D03`) |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | unauthorized() 호출 및 401 UI 렌더 | 미인증 요청 시 unauthorized() 호출로 unauthorized.tsx 렌더 | 범용 스텁 로그 컴포넌트 렌더링 | 화면 관찰 | 소스 코드 | `UnauthorizedTriggerDemo.tsx` | 예 | fail |
| 2 | 스텁 UI 인터랙션 | 수량 변경 및 로그 추가 | 로컬 동작 정상 | 값 비교 | 실습 화면 | 제어 카드 | 예 | pass |
| 3 | 검증 패널 연동 | unauthorized 트리거 검증 | props 미전달로 대기 상태 고정 | 화면 관찰 | 검증 패널 | Actual 영역 | 아니오 | fail |

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G01, G02 | unauthorized() 가이드로 전면 개정 |
| 데모 예제 | 예 | high | D01, D02, D03 | 범용 스텁을 폐기하고 실제 `unauthorized()` 및 `unauthorized.tsx` 데모로 전면 재구현 (P1) |
| 검증 | 예 | high | V01, V05 | HTTP 401 상태와 unauthorized UI를 검증 패널에 연결 |
| 개념 정리 | 아니오 | none | — | 공식 스펙 설명 유지 |

#### 증거 파일

- 소스 코드: `UnauthorizedTriggerDemo.tsx` (범용 스텁 템플릿) 확인.

#### 종합 메모

- 최종 유형 검토: 화면 관찰형. 미인증 세션 접근 시 `unauthorized()` 호출을 통한 401 UI 렌더링을 검증한다.

---

### 188. functions/redirect/action-303 — Server Action 내 redirect() (303 See Other)

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `3-api-reference/3.3-functions/redirect.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/functions/redirect/action-303/page.tsx` |
| 대표 검증 유형 후보 | 전후 변화 |
| 실행 결과 | mismatch |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [러닝화 (#001)], [윈드브레이커 (#002)] 상품 선택 | 러닝화 클릭 | 실습 영역 | 예 | 선택 변경 |
| 2 | 수량 조절 및 [동작 실행] 클릭 | 버튼 클릭 | 실습 영역 | 예 | 로그 추가 |
| 3 | Server Action 내 303 See Other redirect 관찰 | 로그 확인 | 실습 영역 | 아니오 | 범용 스텁 UI로 redirect(303)와 무관 (`D01`, `D02`, `D03`) |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | Server Action 내 redirect() 호출 (303 See Other) | 폼 제출 후 redirect('/success')로 303 이동 | 범용 스텁 로그 컴포넌트 렌더링 | 전후 변화 | 소스 코드 | `RedirectAction303Demo.tsx` | 예 | fail |
| 2 | 스텁 UI 인터랙션 | 수량 변경 및 로그 추가 | 로컬 동작 정상 | 값 비교 | 실습 화면 | 제어 카드 | 예 | pass |
| 3 | 검증 패널 연동 | 303 redirect 상태 검증 | props 미전달로 대기 상태 고정 | 전후 변화 | 검증 패널 | Actual 영역 | 아니오 | fail |

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G01, G02 | Server Action redirect 가이드로 전면 개정 |
| 데모 예제 | 예 | high | D01, D02, D03 | 범용 스텁을 폐기하고 실제 Server Action 내 `redirect('/orders/success')` 303 이동 데모로 전면 재구현 (P1) |
| 검증 | 예 | high | V01, V05 | HTTP 303 리다이렉트 응답과 대상 URL을 검증 패널에 연결 |
| 개념 정리 | 아니오 | none | — | 공식 스펙 설명 유지 |

#### 증거 파일

- 소스 코드: `RedirectAction303Demo.tsx` (범용 스텁 템플릿) 확인.

#### 종합 메모

- 최종 유형 검토: 전후 변화형. POST 요청 후 브라우저 URL이 변경되고 303 See Other 리다이렉트가 발생하는지 검증한다.

---

### 189. functions/redirect/handler-307 — Route Handler 내 redirect() (307 Temporary Redirect)

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `3-api-reference/3.3-functions/redirect.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/functions/redirect/handler-307/page.tsx` |
| 대표 검증 유형 후보 | 전후 변화 |
| 실행 결과 | mismatch |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [러닝화 (#001)], [윈드브레이커 (#002)] 상품 선택 | 러닝화 클릭 | 실습 영역 | 예 | 선택 변경 |
| 2 | 수량 조절 및 [동작 실행] 클릭 | 버튼 클릭 | 실습 영역 | 예 | 로그 추가 |
| 3 | Route Handler 내 307 Temporary Redirect 관찰 | 로그 확인 | 실습 영역 | 아니오 | 범용 스텁 UI로 Route Handler redirect(307)와 무관 (`D01`, `D02`, `D03`) |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | Route Handler 내 redirect() 호출 (307 Temporary Redirect) | API route에서 redirect('/new-url') 호출 시 307 헤더 반환 | 범용 스텁 로그 컴포넌트 렌더링 | 전후 변화 | 소스 코드 | `RedirectHandler307Demo.tsx` | 예 | fail |
| 2 | 스텁 UI 인터랙션 | 수량 변경 및 로그 추가 | 로컬 동작 정상 | 값 비교 | 실습 화면 | 제어 카드 | 예 | pass |
| 3 | 검증 패널 연동 | 307 redirect 상태 검증 | props 미전달로 대기 상태 고정 | 전후 변화 | 검증 패널 | Actual 영역 | 아니오 | fail |

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G01, G02 | Route Handler redirect 가이드로 전면 개정 |
| 데모 예제 | 예 | high | D01, D02, D03 | 범용 스텁을 폐기하고 실제 API Route 내 `redirect('/target')` 307 응답 데모로 전면 재구현 (P1) |
| 검증 | 예 | high | V01, V05 | HTTP 307 상태 코드와 Location 헤더를 검증 패널에 연결 |
| 개념 정리 | 아니오 | none | — | 공식 스펙 설명 유지 |

#### 증거 파일

- 소스 코드: `RedirectHandler307Demo.tsx` (범용 스텁 템플릿) 확인.

#### 종합 메모

- 최종 유형 검토: 전후 변화 및 외부 도구·환경 확인형. Route Handler에서 반환된 HTTP 307 상태 코드와 Location 헤더를 검증한다.

---

### 190. functions/permanent-redirect/seo-308 — permanentRedirect() 영구 URL 변경 (308 Permanent)

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `3-api-reference/3.3-functions/permanentRedirect.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/functions/permanent-redirect/seo-308/page.tsx` |
| 대표 검증 유형 후보 | 전후 변화 |
| 실행 결과 | mismatch |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [러닝화 (#001)], [윈드브레이커 (#002)] 상품 선택 | 러닝화 클릭 | 실습 영역 | 예 | 선택 변경 |
| 2 | 수량 조절 및 [동작 실행] 클릭 | 버튼 클릭 | 실습 영역 | 예 | 로그 추가 |
| 3 | permanentRedirect() 308 영구 리다이렉트 관찰 | 로그 확인 | 실습 영역 | 아니오 | 범용 스텁 UI로 permanentRedirect와 무관 (`D01`, `D02`, `D03`) |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | permanentRedirect() 308 호출 | 영구 이동 시 HTTP 308 Permanent Redirect 상태 및 Location 전달 | 범용 스텁 로그 컴포넌트 렌더링 | 전후 변화 | 소스 코드 | `PermanentRedirectSeoDemo.tsx` | 예 | fail |
| 2 | 스텁 UI 인터랙션 | 수량 변경 및 로그 추가 | 로컬 동작 정상 | 값 비교 | 실습 화면 | 제어 카드 | 예 | pass |
| 3 | 검증 패널 연동 | 308 영구 리다이렉트 검증 | props 미전달로 대기 상태 고정 | 전후 변화 | 검증 패널 | Actual 영역 | 아니오 | fail |

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G01, G02 | permanentRedirect 가이드로 전면 개정 |
| 데모 예제 | 예 | high | D01, D02, D03 | 범용 스텁을 폐기하고 실제 `permanentRedirect()` 308 호출 데모로 전면 재구현 (P1) |
| 검증 | 예 | high | V01, V05 | HTTP 308 상태 및 SEO 캐시 정책을 검증 패널에 연결 |
| 개념 정리 | 아니오 | none | — | 공식 스펙 설명 유지 |

#### 증거 파일

- 소스 코드: `PermanentRedirectSeoDemo.tsx` (범용 스텁 템플릿) 확인.

#### 종합 메모

- 최종 유형 검토: 전후 변화 및 외부 도구·환경 확인형. HTTP 308 영구 리다이렉트 상태와 Location 헤더를 검증한다.

---

### 191. functions/next-request/geo-ip-parsing — NextRequest Geo 위치 및 클라이언트 IP 파싱

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `3-api-reference/3.3-functions/next-request.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/functions/next-request/geo-ip-parsing/page.tsx` |
| 대표 검증 유형 후보 | 값 비교 |
| 실행 결과 | verified |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [KR 🇰🇷 한국], [US 🇺🇸 미국], [JP 🇯🇵 일본], [🇪🇺 유럽] 국가 선택 | `[US 🇺🇸 미국]` 클릭 | 실습 영역 | 예 | 미국 Geo 파싱 요청 전송 |
| 2 | NextRequest geo 속성 파싱 확인 | IP 및 국가 코드 확인 | 실습 영역 | 예 | IP: `198.51.100.24`, 국가: `US` 반환 확인 |
| 3 | 국가별 통화(KRW/USD/JPY/EUR) 및 배송 안내 관찰 | 통화 및 현지화 금액 확인 | 실습·검증 영역 | 예 | `USD`, `$96.75` 및 검증 패널 Pass |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | NextRequest ip & geo 파싱 | `api/route.ts`에서 `request.headers` 및 NextRequest Geo/IP 추출 | `api/route.ts` 정상 응답 및 텔레메트리 반환 | 값 비교 | 실습 화면 | IP/Geo 카드 | 예 | pass |
| 2 | 국가별 통화 및 로컬라이징 동기화 | 선택 국가에 맞춘 통화 기호 및 환율 변환 | KRW/USD/JPY/EUR 정상 변환 | 값 비교 | 실습 화면 | 통화 뱃지 | 예 | pass |
| 3 | 검증 패널 연동 | NextRequest 파싱 성공 및 통화 일치 검증 | `VerificationFooter`에 props 전달되어 실제 매칭 확인 | 값 비교 | 검증 패널 | Actual 영역 | 예 | pass |

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 아니오 | none | — | 3단계 절차 정확 |
| 데모 예제 | 아니오 | none | — | `NextRequest` 파싱 API 및 컴포넌트 연동 완벽 작동 (골든 샘플) |
| 검증 | 아니오 | none | — | `ExpectedActualPanel`과 `VerificationFooter` 바인딩 완료 |
| 개념 정리 | 예 | low | C01 | "0ms 내에 읽어" 등 절대 수치 문구 정제 |

#### 증거 파일

- 소스 코드: `api/route.ts` 및 `NextRequestGeoDemo.tsx` 정상 구현 확인.

#### 종합 메모

- 최종 유형 검토: 값 비교형. 골든 샘플. NextRequest의 확장 속성 파싱과 실시간 검증 패널 연동의 모범 구현.

---

### 192. functions/next-response/json-builder — NextResponse.json() 응답 빌더 및 상태 코드 주입

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `3-api-reference/3.3-functions/next-response.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/functions/next-response/json-builder/page.tsx` |
| 대표 검증 유형 후보 | 값 비교 |
| 실행 결과 | verified |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [200 OK (성공)] 또는 [201 Created (생성)] 클릭 | `[200 OK]` 클릭 | 실습 영역 | 예 | 200 성공 응답 수신 |
| 2 | [400 Bad Request (검증실패)] 또는 [422 Unprocessable (도메인오류)] 클릭 | `[400 Bad Request]` 클릭 | 실습 영역 | 예 | 400 에러 응답 수신 |
| 3 | HTTP 헤더 및 직렬화된 JSON 페이로드 관찰 | 헤더 및 JSON 본문 관찰 | 실습·검증 영역 | 예 | `x-study-response-builder: NextResponse.json` 확인 및 검증 패널 Pass |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | NextResponse.json() 상태 코드 주입 | `api/route.ts`에서 상태 코드별 JSON 응답 및 커스텀 헤더 주입 | `api/route.ts`에서 지정 상태 코드 및 헤더 정상 반환 | 값 비교 | 실습 화면 | JSON 인스펙터 | 예 | pass |
| 2 | 에러 상태 코드 규격화 | 400/422 요청 시 표준 에러 포맷 반환 | 에러 코드 및 메시지 정상 반환 | 값 비교 | 실습 화면 | 응답 박스 | 예 | pass |
| 3 | 검증 패널 연동 | NextResponse.json 응답 검증 | `VerificationFooter`에 props 전달되어 실제 매칭 확인 | 값 비교 | 검증 패널 | Actual 영역 | 예 | pass |

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 아니오 | none | — | 3단계 절차 정확 |
| 데모 예제 | 아니오 | none | — | `NextResponse.json()` 빌더 및 헤더 주입 완벽 구현 (골든 샘플) |
| 검증 | 아니오 | none | — | `ExpectedActualPanel`과 `VerificationFooter` 바인딩 완료 |
| 개념 정리 | 아니오 | none | — | 공식 스펙 설명 유지 |

#### 증거 파일

- 소스 코드: `api/route.ts` 및 `NextResponseJsonDemo.tsx` 정상 구현 확인.

#### 종합 메모

- 최종 유형 검토: 값 비교형. 골든 샘플. `NextResponse.json()` 응답 빌더를 통한 상태 코드와 헤더 주입 검증의 모범 사례.

---

### 193. functions/next-response/rewrite-virtual — NextResponse.rewrite() 가상 라우팅 중계

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `3-api-reference/3.3-functions/next-response.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/functions/next-response/rewrite-virtual/page.tsx` |
| 대표 검증 유형 후보 | 화면 관찰 |
| 실행 결과 | verified |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [가상 엔드포인트 호출] 클릭 | 버튼 클릭 | 실습 영역 | 예 | 가상 경로 API 호출 |
| 2 | 브라우저 표시 URL 보존 확인 | 요청 URL 확인 | 실습 영역 | 예 | `/api` 호출 URL 보존 확인 |
| 3 | 가상 내부 서비스 응답 서빙 관찰 | 리라이트 응답 관찰 | 실습·검증 영역 | 예 | `/target` 엔드포인트 데이터 수신 및 검증 패널 Pass |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | NextResponse.rewrite() 내부 엔드포인트 프록시 | `/api/route.ts`에서 `/target/route.ts`로 내부 리라이트 | target 엔드포인트 응답 및 `x-rewritten-by` 헤더 반환 | 화면 관찰 | 소스 코드 | `api/route.ts` | 예 | pass |
| 2 | 가상 매핑 데이터 서빙 | 상품 데이터 및 리라이트 메타데이터 반환 | 정상 수신 | 값 비교 | 실습 화면 | 응답 뷰어 | 예 | pass |
| 3 | 검증 패널 연동 | 리라이트 성공 및 대상 경로 일치 검증 | `VerificationFooter`에 props 전달되어 실제 매칭 확인 | 화면 관찰 | 검증 패널 | Actual 영역 | 예 | pass |

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 아니오 | none | — | 3단계 절차 정확 |
| 데모 예제 | 아니오 | none | — | `NextResponse.rewrite()` 엔드포인트 중계 완벽 동작 (골든 샘플) |
| 검증 | 아니오 | none | — | `ExpectedActualPanel`과 `VerificationFooter` 바인딩 완료 |
| 개념 정리 | 아니오 | none | — | 공식 스펙 설명 유지 |

#### 증거 파일

- 소스 코드: `api/route.ts`, `target/route.ts`, `NextResponseRewriteDemo.tsx` 정상 구현 확인.

#### 종합 메모

- 최종 유형 검토: 화면 관찰 및 값 비교형. 골든 샘플. `NextResponse.rewrite()`의 내부 경로 프록싱과 헤더 전달이 완벽하게 증명됨.

---

### 194. functions/image-response/og-badge — ImageResponse를 활용한 실시간 할인 뱃지 OG 이미지

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `3-api-reference/3.3-functions/image-response.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/functions/image-response/og-badge/page.tsx` |
| 대표 검증 유형 후보 | 산출물·설정 확인 |
| 실행 결과 | mismatch |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [러닝화 (#001)], [윈드브레이커 (#002)] 상품 선택 | 러닝화 클릭 | 실습 영역 | 예 | 선택 변경 |
| 2 | 수량 조절 및 [동작 실행] 클릭 | 버튼 클릭 | 실습 영역 | 예 | 로그 추가 |
| 3 | ImageResponse 할인 뱃지 OG 이미지 생성 관찰 | 로그 확인 | 실습 영역 | 아니오 | 범용 스텁 UI로 ImageResponse와 무관 (`D01`, `D02`, `D03`) |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | ImageResponse 동적 OG 이미지 생성 | JSX 기반 PNG 이미지 동적 렌더링 | 범용 스텁 로그 컴포넌트 렌더링 | 산출물·설정 확인 | 소스 코드 | `ImageResponseOgBadgeDemo.tsx` | 예 | fail |
| 2 | 스텁 UI 인터랙션 | 수량 변경 및 로그 추가 | 로컬 동작 정상 | 값 비교 | 실습 화면 | 제어 카드 | 예 | pass |
| 3 | 검증 패널 연동 | ImageResponse OG 뱃지 검증 | props 미전달로 대기 상태 고정 | 산출물·설정 확인 | 검증 패널 | Actual 영역 | 아니오 | fail |

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G01, G02 | ImageResponse 가이드로 전면 개정 |
| 데모 예제 | 예 | high | D01, D02, D03 | 범용 스텁을 폐기하고 실제 `ImageResponse`를 사용하는 Route Handler 및 이미지 프리뷰 데모로 전면 재구현 (P1) |
| 검증 | 예 | high | V01, V05 | 생성된 이미지 MIME 타입(image/png)과 렌더링 결과를 검증 패널에 연결 |
| 개념 정리 | 아니오 | none | — | 공식 스펙 설명 유지 |

#### 증거 파일

- 소스 코드: `ImageResponseOgBadgeDemo.tsx` (범용 스텁 템플릿) 확인.

#### 종합 메모

- 최종 유형 검토: 산출물·설정 확인형. `ImageResponse`를 통해 동적으로 생성된 OpenGraph 이미지 바이너리를 검증한다.

---

### 195. functions/image-response/dynamic-receipt — ImageResponse 동적 결제 영수증 이미지 생성

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `3-api-reference/3.3-functions/image-response.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/functions/image-response/dynamic-receipt/page.tsx` |
| 대표 검증 유형 후보 | 산출물·설정 확인 |
| 실행 결과 | mismatch |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | 디지털 결제 영수증 ImageResponse 확인 | 정적 텍스트 확인 | 실습 영역 | 예 | 주문번호 및 금액 텍스트 표시 |
| 2 | PNG 다운로드 및 소셜 메신저 전송 지원 확인 | 안내 문구 확인 | 실습 영역 | 아니오 | `ImageResponse` 호출 없는 정적 텍스트 뷰어 (`D02`, `D03`) |
| 3 | 영수증 이미지 렌더링 관찰 | 텍스트 관찰 | 실습 영역 | 예 | 정적 렌더링 |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | ImageResponse 결제 영수증 이미지 렌더 | 결제 상세 데이터를 포함한 영수증 이미지 동적 생성 | 정적 텍스트 문자열 렌더링 | 산출물·설정 확인 | 소스 코드 | `ImageResponseReceiptDemo.tsx` | 예 | fail |
| 2 | 영수증 정보 표시 | 주문번호 및 결제금액 표시 | 텍스트 표시 | 값 비교 | 실습 화면 | 영수증 카드 | 예 | pass |
| 3 | 검증 패널 연동 | 영수증 이미지 생성 검증 | props 미전달로 대기 상태 고정 | 산출물·설정 확인 | 검증 패널 | Actual 영역 | 아니오 | fail |

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | medium | G01, G02 | 영수증 데이터 입력 및 이미지 생성/다운로드 절차 추가 |
| 데모 예제 | 예 | high | D02, D03 | 실제 `ImageResponse` Route Handler를 구현하여 영수증 PNG 이미지를 동적으로 생성 및 표시하도록 재구현 |
| 검증 | 예 | high | V01, V05 | 생성된 이미지 바이너리/MIME 및 영수증 번호를 검증 패널에 연결 |
| 개념 정리 | 아니오 | none | — | 공식 스펙 설명 유지 |

#### 증거 파일

- 소스 코드: `ImageResponseReceiptDemo.tsx` 내 정적 텍스트 확인.

#### 종합 메모

- 최종 유형 검토: 산출물·설정 확인형. 결제 영수증 데이터를 담은 `ImageResponse` 이미지 생성을 검증한다.

---

### 196. functions/generate-metadata/dynamic-title — generateMetadata 동적 SEO 타이틀 및 메타태그 생성

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `3-api-reference/3.3-functions/generate-metadata.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/functions/generate-metadata/dynamic-title/page.tsx` |
| 대표 검증 유형 후보 | 화면 관찰 |
| 실행 결과 | mismatch |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [러닝화 (#001)], [윈드브레이커 (#002)] 상품 선택 | 러닝화 클릭 | 실습 영역 | 예 | 선택 변경 |
| 2 | 수량 조절 및 [동작 실행] 클릭 | 버튼 클릭 | 실습 영역 | 예 | 로그 추가 |
| 3 | generateMetadata 동적 메타태그 생성 관찰 | 로그 확인 | 실습 영역 | 아니오 | 범용 스텁 UI로 generateMetadata와 무관 (`D01`, `D02`, `D03`) |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | generateMetadata({ params }) 동적 타이틀 생성 | 동적 파라미터 기반 SEO 타이틀/OG 메타 생성 | 범용 스텁 로그 컴포넌트 렌더링 | 화면 관찰 | 소스 코드 | `GenerateMetadataTitleDemo.tsx` | 예 | fail |
| 2 | 스텁 UI 인터랙션 | 수량 변경 및 로그 추가 | 로컬 동작 정상 | 값 비교 | 실습 화면 | 제어 카드 | 예 | pass |
| 3 | 검증 패널 연동 | 메타데이터 생성 검증 | props 미전달로 대기 상태 고정 | 화면 관찰 | 검증 패널 | Actual 영역 | 아니오 | fail |

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G01, G02 | generateMetadata 가이드로 전면 개정 |
| 데모 예제 | 예 | high | D01, D02, D03 | 범용 스텁을 폐기하고 실제 `generateMetadata` 함수 및 HTML `<title>`, `<meta>` 검증 데모로 전면 재구현 (P1) |
| 검증 | 예 | high | V01, V05 | 생성된 메타태그 객체 및 head 태그를 검증 패널에 연결 |
| 개념 정리 | 아니오 | none | — | 공식 스펙 설명 유지 |

#### 증거 파일

- 소스 코드: `GenerateMetadataTitleDemo.tsx` (범용 스텁 템플릿) 확인.

#### 종합 메모

- 최종 유형 검토: 화면 관찰 및 산출물·설정 확인형. `generateMetadata`에 의해 생성된 HTML head 태그를 검증한다.

---

### 197. functions/generate-metadata/parent-inheritance — 부모 metadata 상속 및 canonical URL 오버라이드

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `3-api-reference/3.3-functions/generate-metadata.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/functions/generate-metadata/parent-inheritance/page.tsx` |
| 대표 검증 유형 후보 | 산출물·설정 확인 |
| 실행 결과 | mismatch |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | const parentMeta = await parent 확인 | 정적 텍스트 확인 | 실습 영역 | 예 | 텍스트 표시 |
| 2 | openGraph.images 부모 상속 확인 | 텍스트 확인 | 실습 영역 | 아니오 | 실제 부모 메타데이터 상속 없는 정적 텍스트 뷰어 (`D02`, `D03`) |
| 3 | canonical URL 오버라이드 완료 관찰 | 확인 문구 관찰 | 실습 영역 | 예 | 초록색 텍스트 표시 |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | parent metadata 비동기 상속 및 병합 | `await parent`를 통해 상위 layout 메타데이터 상속 및 canonical URL 오버라이드 | 하드코딩 텍스트 박스로 모사 | 산출물·설정 확인 | 소스 코드 | `GenerateMetadataInheritDemo.tsx` | 예 | fail |
| 2 | 상속/오버라이드 명세 텍스트 표시 | 상속된 필드와 오버라이드 필드 표시 | 텍스트 정상 표시 | 값 비교 | 실습 화면 | 메타데이터 박스 | 예 | pass |
| 3 | 검증 패널 연동 | 메타데이터 상속 검증 | props 미전달로 대기 상태 고정 | 산출물·설정 확인 | 검증 패널 | Actual 영역 | 아니오 | fail |

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | medium | G01, G02 | 상위 레이아웃 메타데이터와 페이지 메타데이터 비교 절차 보강 |
| 데모 예제 | 예 | high | D02, D03 | 실제 상위 layout `metadata`와 페이지 `generateMetadata(props, parent)` 연동 구조로 재구현 |
| 검증 | 예 | high | V01, V05 | 병합된 메타데이터 객체와 오버라이드 필드를 검증 패널에 연결 |
| 개념 정리 | 아니오 | none | — | 공식 스펙 설명 유지 |

#### 증거 파일

- 소스 코드: `GenerateMetadataInheritDemo.tsx` 내 하드코딩 텍스트 확인.

#### 종합 메모

- 최종 유형 검토: 산출물·설정 확인형. 부모 레이아웃의 메타데이터 상속과 자식 페이지의 필드 오버라이드 결과를 검증한다.

---

### 198. functions/generate-static-params/basic-ssg — generateStaticParams 인기 상품 사전 SSG 빌드 생성

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `3-api-reference/3.3-functions/generate-static-params.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/functions/generate-static-params/basic-ssg/page.tsx` |
| 대표 검증 유형 후보 | 산출물·설정 확인 |
| 실행 결과 | mismatch |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [러닝화 (#001)], [윈드브레이커 (#002)] 상품 선택 | 러닝화 클릭 | 실습 영역 | 예 | 선택 변경 |
| 2 | 수량 조절 및 [동작 실행] 클릭 | 버튼 클릭 | 실습 영역 | 예 | 로그 추가 |
| 3 | generateStaticParams 사전 SSG 빌드 관찰 | 로그 확인 | 실습 영역 | 아니오 | 범용 스텁 UI로 generateStaticParams와 무관 (`D01`, `D02`, `D03`) |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | generateStaticParams() 사전 정적 세그먼트 생성 | 빌드 타임에 반환된 params 목록 기반 정적 HTML 사전 생성 | 범용 스텁 로그 컴포넌트 렌더링 | 산출물·설정 확인 | 소스 코드 | `GenerateStaticParamsBasicDemo.tsx` | 예 | fail |
| 2 | 스텁 UI 인터랙션 | 수량 변경 및 로그 추가 | 로컬 동작 정상 | 값 비교 | 실습 화면 | 제어 카드 | 예 | pass |
| 3 | 검증 패널 연동 | 사전 SSG 파라미터 검증 | props 미전달로 대기 상태 고정 | 산출물·설정 확인 | 검증 패널 | Actual 영역 | 아니오 | fail |

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G01, G02 | generateStaticParams 가이드로 전면 개정 |
| 데모 예제 | 예 | high | D01, D02, D03 | 범용 스텁을 폐기하고 실제 `generateStaticParams` 함수와 동적 라우트 매핑 데모로 전면 재구현 (P1) |
| 검증 | 예 | high | V01, V05 | 사전 빌드된 파라미터 리스트를 검증 패널에 연결 |
| 개념 정리 | 아니오 | none | — | 공식 스펙 설명 유지 |

#### 증거 파일

- 소스 코드: `GenerateStaticParamsBasicDemo.tsx` (범용 스텁 템플릿) 확인.

#### 종합 메모

- 최종 유형 검토: 산출물·설정 확인형. `generateStaticParams`를 통한 정적 HTML 프리렌더링 파라미터 목록 생성을 검증한다.

---

### 199. functions/generate-static-params/multiple-segments — generateStaticParams [category]/[id] 다중 세그먼트 조합

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `3-api-reference/3.3-functions/generate-static-params.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/functions/generate-static-params/multiple-segments/page.tsx` |
| 대표 검증 유형 후보 | 산출물·설정 확인 |
| 실행 결과 | mismatch |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | 사전 생성된 다중 세그먼트 목록 확인 | 정적 텍스트 확인 | 실습 영역 | 예 | 2개 경로 텍스트 표시 |
| 2 | 다중 세그먼트 조합 빌드 결과 확인 | 빌드 확인 문구 확인 | 실습 영역 | 아니오 | 실제 `generateStaticParams` 호출 없는 정적 텍스트 뷰어 (`D02`, `D03`) |
| 3 | 조합별 정적 HTML 빌드 관찰 | 텍스트 관찰 | 실습 영역 | 예 | 정적 렌더링 |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | generateStaticParams() 다중 세그먼트 조합 반환 | `[{ category, id }]` 데카르트 곱 조합 기반 사전 SSG 빌드 | 하드코딩 텍스트 박스로 모사 | 산출물·설정 확인 | 소스 코드 | `GenerateStaticParamsMultiDemo.tsx` | 예 | fail |
| 2 | 세그먼트 경로 목록 표시 | 사전 생성 경로 텍스트 표시 | 텍스트 표시 정상 | 값 비교 | 실습 화면 | 경로 박스 | 예 | pass |
| 3 | 검증 패널 연동 | 다중 세그먼트 조합 검증 | props 미전달로 대기 상태 고정 | 산출물·설정 확인 | 검증 패널 | Actual 영역 | 아니오 | fail |

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | medium | G01, G02 | 다중 세그먼트 파라미터 조합 생성 및 네비게이션 절차 보강 |
| 데모 예제 | 예 | high | D02, D03 | 실제 다중 세그먼트 `[category]/[id]` 라우트 및 `generateStaticParams` 조합 로직으로 재구현 |
| 검증 | 예 | high | V01, V05 | 생성된 다중 세그먼트 조합 배열을 검증 패널에 연결 |
| 개념 정리 | 아니오 | none | — | 공식 스펙 설명 유지 |

#### 증거 파일

- 소스 코드: `GenerateStaticParamsMultiDemo.tsx` 확인.

#### 종합 메모

- 최종 유형 검토: 산출물·설정 확인형. 복수 동적 파라미터 조합의 `generateStaticParams` 생성 결과를 검증한다.

---

### 200. functions/connection/request-signal — connection() 비동기 연결 준비 대기

#### 기본 정보

| 항목 | 값 |
|---|---|
| zone | baseline |
| 근거 문서 | `3-api-reference/3.3-functions/connection.md` |
| 진입점 | `apps/demo-baseline/src/app/zone/baseline/functions/connection/request-signal/page.tsx` |
| 대표 검증 유형 후보 | 전후 변화 |
| 실행 결과 | mismatch |
| 초기화 방법 | 새 URL 진입 |

#### 가이드 실행 기록

| 단계 | 가이드 지시 | 실제 수행 동작 | 관찰 위치 | 실행 가능 | 메모 |
|---:|---|---|---|---|---|
| 1 | [러닝화 (#001)], [윈드브레이커 (#002)] 상품 선택 | 러닝화 클릭 | 실습 영역 | 예 | 선택 변경 |
| 2 | 수량 조절 및 [동작 실행] 클릭 | 버튼 클릭 | 실습 영역 | 예 | 로그 추가 |
| 3 | connection() 비동기 연결 준비 대기 관찰 | 로그 확인 | 실습 영역 | 아니오 | 범용 스텁 UI로 connection()과 무관 (`D01`, `D02`, `D03`) |

#### 검증 항목

| # | 확인 대상 | 기대 결과 | 실제 증거 | 유형 후보 | 증거 출처 | 증거 위치 | 자동 판정 | 결과 |
|---:|---|---|---|---|---|---|---|---|
| 1 | await connection() 비동기 연결 대기 | Next.js 16 connection() 호출로 요청 준비 대기 및 동적 렌더링 전환 | 범용 스텁 로그 컴포넌트 렌더링 | 전후 변화 | 소스 코드 | `ConnectionRequestSignalDemo.tsx` | 예 | fail |
| 2 | 스텁 UI 인터랙션 | 수량 변경 및 로그 추가 | 로컬 동작 정상 | 값 비교 | 실습 화면 | 제어 카드 | 예 | pass |
| 3 | 검증 패널 연동 | connection 대기 상태 검증 | props 미전달로 대기 상태 고정 | 전후 변화 | 검증 패널 | Actual 영역 | 아니오 | fail |

#### 섹션별 수정 판정

| 섹션 | 수정 필요 | 심각도 | 사유 코드 | 수정 방향 |
|---|---|---|---|---|
| 가이드 | 예 | high | G01, G02 | connection() 가이드로 전면 개정 |
| 데모 예제 | 예 | high | D01, D02, D03 | 범용 스텁을 폐기하고 실제 Next.js 16 `connection()` 호출 및 비동기 스트리밍 연동 데모로 전면 재구현 (P1) |
| 검증 | 예 | high | V01, V05 | connection() 대기 완료 및 dynamic render 전환 상태를 검증 패널에 연결 |
| 개념 정리 | 아니오 | none | — | 공식 스펙 설명 유지 |

#### 증거 파일

- 소스 코드: `ConnectionRequestSignalDemo.tsx` (범용 스텁 템플릿) 확인.

#### 종합 메모

- 최종 유형 검토: 전후 변화형. Next.js 16 `connection()`을 통한 렌더링 지연 및 동적 전환을 검증한다.

---

---

## B16-B20 공통 발견

### B16 공통 발견 (151–160)

- **실측 연동 verified(2개 달성)**:
  - 155번(`next/script pg-sdk onLoad`), 158번(`usePathname()`)은 실제 브라우저 API 및 Next.js 훅과 바인딩 완료.
- **훅 모사 문제(`D02`)**: 156, 157(`useRouter`), 159(`useParams`), 160(`useSearchParams`), 151(프리패치), 152/153(폰트)이 Next.js 내장 훅 대신 `useState`로 모사됨.

### B17 공통 발견 (161–170)

- **네비게이션 훅 및 캐시 함수 모사(`D02`)**: 161~168번(useSearchParams, useSelectedLayoutSegment(s), cacheLife, cacheTag, unstable_cache)이 실제 프레임워크 훅 없이 로컬 문자열/시뮬레이터로 모사됨.
- **골든 샘플 후보**: 170번(`revalidate-path/page-vs-layout`)은 실제 Server Action과 `revalidatePath` 스코프별 실행 로직이 완비되어 검증 패널 props만 연결하면 `verified` 전환 가능.

### B18 공통 발견 (171–180)

- **골든 샘플 후보**: 172번(`revalidateTag/basic-tag-purge`)과 180번(`headers/custom-auth-token`)은 실제 Server Action과 `revalidateTag`/`headers()` 읽기가 충실히 구현되어 있음.
- **범용 템플릿 복제**: 171, 173, 175, 176번 4개 데모가 범용 스텁으로 구성됨 (P1 재구현 대상).

### B19 공통 발견 (181–190)

- **런타임 함수 스텁 및 모사(`D02`)**: 181/182번(Draft Mode), 183/184번(`after()`), 185번(`notFound`), 186번(`forbidden`), 187번(`unauthorized`), 188/189/190번(`redirect`, `permanentRedirect`)이 실제 서버 함수 미호출 및 범용 스텁/텍스트 모사 상태.

### B20 공통 발견 (191–200)

- **Server Functions verified 골든 샘플(3개 달성)**:
  - 191번(`next-request/geo-ip-parsing`): NextRequest 헤더 및 IP 파싱 정상 동작.
  - 192번(`next-response/json-builder`): NextResponse JSON 빌더 및 쿠키/헤더 설정 정상 동작.
  - 193번(`next-response/rewrite-virtual`): 가상 경로 리라이트 정상 동작.
- **스텁 및 정적 모사**: 194~199번(ImageResponse, generateMetadata, generateStaticParams)이 범용 스텁 또는 단순 정적 카드 상태.
