// Exhaustive dictionary mapping every subtopic / feature to precise, domain-specific 4-step deep-dive content.

export function getFeatureDeepDive(url, title, zone) {
  // 1. Architecture
  if (url.includes('architecture/accessibility/form-aria-support')) {
    return {
      spec: `WAI-ARIA(Accessible Rich Internet Applications) 표준 속성(aria-invalid, aria-describedby, aria-live)을 폼 요소에 결합하여 스크린 리더 사용자와 키보드 사용자에게 폼 상태와 실시간 검증 오류를 정확히 전달하는 웹 접근성 표준 기법입니다.`,
      example: `본 예제에서는 배송지 및 결제 폼 입력 시 유효성 검사 오류가 발생하면 input에 aria-invalid="true"와 오류 메시지 id를 참조하는 aria-describedby가 즉시 연결되어 시각 장애인용 스크린 리더가 오류 원인을 음성으로 안내합니다.`,
      benefits: [
        `접근성 법적 규정 준수: KWCAG 2.2 및 WCAG 2.1 AA 웹 접근성 표준을 100% 만족합니다.`,
        `스크린 리더 사용자 경험 향상: 시각적 에러 메시지를 보지 못하는 사용자도 키보드 탐색만으로 오류 필드와 원인을 파악할 수 있습니다.`,
        `폼 제출 성공률 증대: 모든 사용자가 결제 양식을 명확히 이해하고 오류를 수정하여 결제 이탈을 방지합니다.`
      ],
      useCases: [
        `쇼핑몰 주문서 배송지 입력, 수령인 전화번호 실시간 정규식 검증`,
        `카드 번호 및 CVC 보안코드 입력 필드의 필수값 누락 안내`,
        `결제 수단 라디오 그룹의 키보드 방향키 탐색 및 선택 상태 전달`
      ]
    }
  }

  if (url.includes('architecture/accessibility/modal-focus-trap')) {
    return {
      spec: `모달 다이얼로그가 열렸을 때 키보드 Tab 탐색 포커스를 모달 내부에 가두고(Focus Trap), Esc 키 입력 시 모달을 닫으며 이전 활성 요소로 포커스를 복원하는 WAI-ARIA Dialog 패턴의 핵심 구현입니다.`,
      example: `본 예제에서는 장바구니 옵션 변경 모달이 열리면 자동으로 모달 내부 첫 번째 버튼으로 포커스가 이동하며, Tab 키를 계속 눌러도 모달 바깥 배경 요소로 포커스가 빠져나가지 않고 내부에서 순환합니다.`,
      benefits: [
        `키보드 탐색 혼란 방지: 백그라운드 딤드(Dimmed) 영역의 보이지 않는 링크를 실수로 탭하여 엉뚱한 페이지로 이동하는 현상을 원천 방지합니다.`,
        `직관적인 Esc 닫기 및 포커스 복원: 사용자가 작업을 취소하면 모달을 열었던 원래 상품 카드로 포커스가 복귀하여 탐색 연속성을 보장합니다.`,
        `스크린 리더 모달 영역 격리: aria-modal="true"와 role="dialog"로 모달 바깥 DOM을 aria-hidden 처리합니다.`
      ],
      useCases: [
        `상품 목록에서의 빠른 구매 및 옵션 선택 팝업 모달`,
        `결제 진행 전 최종 주문 내역 확인 및 약관 동의 팝업`,
        `쿠폰함 선택 및 배송지 주소 검색 팝업 다이얼로그`
      ]
    }
  }

  if (url.includes('architecture/server-action-security/csrf-protection')) {
    return {
      spec: `Next.js Server Actions는 별도의 CSRF 토큰 발급/검증 보일러플레이트 없이도 브라우저의 HTTP Origin 헤더와 Host 헤더를 서버에서 자동 비교하여 악의적인 타 사이트에서의 크로스 사이트 요청 위조(CSRF)를 원천 차단합니다.`,
      example: `본 예제에서는 동일 도메인에서의 주문 폼 제출은 정상 처리되지만, 피싱 사이트나 악의적인 서드파티 웹사이트에서 Server Action 엔드포인트로 전송한 변조 요청은 Origin 불일치로 서버에서 즉시 거절(403)됩니다.`,
      benefits: [
        `CSRF 토큰 관리 오버헤드 제거: 세션마다 별도의 CSRF 토큰을 쿠키나 숨김 필드에 넣고 검증하는 복잡한 수동 코드가 필요 없습니다.`,
        `원천적인 위조 결제 요청 차단: 사용자가 악의적인 링크를 클릭해도 로그인 세션을 도용한 자동 구매 요청이 실행되지 않습니다.`,
        `모바일 웹뷰 및 프록시 환경 대응: next.config.ts의 allowedOrigins 설정을 통해 안전한 승인 도메인만 선별 허용할 수 있습니다.`
      ],
      useCases: [
        `쇼핑몰 회원 정보 수정 및 비밀번호 변경 Action 보호`,
        `장바구니 전체 결제 및 포인트 차감 Server Action 보안`,
        `관리자 상품 가격 및 재고 변경 API의 외부 위조 요청 차단`
      ]
    }
  }

  if (url.includes('architecture/turbopack')) {
    return {
      spec: `Turbopack은 Rust로 작성된 차세대 증분 번들러로, AST 수준의 정밀한 종속성 그래프 캐싱을 통해 대규모 프로젝트에서도 50ms 미만의 초고속 핫 모듈 리로딩(HMR)과 빠른 콜드 스타트를 제공합니다.`,
      example: `본 데모 환경에서는 240여 개가 넘는 방대한 데모 라우트와 공통 쇼핑몰 컴포넌트가 로드되어 있음에도, 컴포넌트 코드 수정 시 브라우저 전체 리로드 없이 변경된 부분만 수십 밀리초 내에 즉시 반영됩니다.`,
      benefits: [
        `개발자 생산성 극대화: 파일 저장 즉시 변경 사항이 브라우저에 반영되어 UI 스타일링과 상태 로직을 빠르게 검증할 수 있습니다.`,
        `증분 빌드 최적화: 변경되지 않은 모듈은 메모리 캐시에서 재사용하여 대규모 모노레포에서도 컴파일 지연이 없습니다.`,
        `차세대 Next.js 표준: Next.js 15+에서 기본 개발 번들러로 채택되어 Webpack 대비 메모리 사용량과 CPU 점유율이 획기적으로 낮습니다.`
      ],
      useCases: [
        `수백 개 이상의 상품 페이지와 관리자 화면을 갖춘 대규모 이커머스 개발`,
        `복잡한 Tailwind CSS 디자인 시스템 및 테마 수정 시 실시간 피드백`,
        `모노레포 내 공통 라이브러리 수정 시 앱 즉시 반영`
      ]
    }
  }

  if (url.includes('architecture/compiler-optimization')) {
    return {
      spec: `React Compiler는 개발자가 수동으로 useMemo, useCallback, React.memo를 작성하지 않아도, 빌드 타임에 컴포넌트와 훅의 불변식(Invariants)을 분석하여 값과 JSX 트리를 자동으로 세분화 메모이제이션(Fine-grained Memoization)하는 도구입니다.`,
      example: `본 데모에서는 장바구니 품목 수량 변경 시 불필요한 연관 상품 리스트나 정산 내역의 리렌더링이 발생하지 않고, React Compiler에 의해 변경된 수량 텍스트 노드만 정밀하게 리렌더링됩니다.`,
      benefits: [
        `메모이제이션 보일러플레이트 제거: 의존성 배열 누락으로 인한 버그나 과도한 useMemo 호출 코드를 작성할 필요가 없습니다.`,
        `극대화된 런타임 렌더링 성능: 복잡한 상품 옵션 선택 및 필터 조작 시 UI 프레임 드랍(Jank)이 발생하지 않습니다.`,
        `클린 코드 유지: 비즈니스 로직에 집중할 수 있어 코드베이스의 가독성과 유지보수성이 크게 향상됩니다.`
      ],
      useCases: [
        `수백 개의 상품 카드가 렌더링되는 실시간 상품 카탈로그 그리드`,
        `빈번한 타이핑 이벤트가 발생하는 상품 검색창 및 자동완성 드롭다운`,
        `실시간 주가/재고 변동 차트 및 인터랙티브 필터 대시보드`
      ]
    }
  }

  // 2. Components
  if (url.includes('components/image/responsive-sizes')) {
    return {
      spec: `next/image의 sizes 속성은 브라우저가 레이아웃을 계산하기 전에 뷰포트 너비별로 표시될 이미지 렌더링 크기(예: (max-width: 768px) 100vw, 33vw)를 브라우저 힌트로 제공하여 최적의 해상도 이미지를 srcset에서 다운로드하도록 유도합니다.`,
      example: `본 예제에서는 모바일 화면(375px)에서는 400px 폭의 경량 이미지를 로드하고, 4K 데스크톱 모니터에서는 1200px 고화질 이미지를 자동 선별하여 다운로드하므로 모바일 데이터 낭비 없이 선명한 상품 화질을 보장합니다.`,
      benefits: [
        `모바일 네트워크 대역폭 절감: 작은 모바일 화면에 불필요하게 4K 원본 이미지를 다운로드하는 대역폭 낭비를 70% 이상 방지합니다.`,
        `LCP(Largest Contentful Paint) 속도 향상: 적절한 크기의 압축 이미지만 요청하므로 메인 상품 이미지가 화면에 즉각 렌더링됩니다.`,
        `완벽한 반응형 그리드 지원: CSS 미디어 쿼리와 일치하는 sizes 규칙으로 디바이스별 최적의 화질을 자동 서빙합니다.`
      ],
      useCases: [
        `쇼핑몰 메인 홈 1열/2열/4열 반응형 상품 그리드 카드`,
        `상품 상세 페이지의 메인 갤러리 썸네일 뷰어`,
        `모바일/태블릿/데스크톱 공용 반응형 이벤트 프로모션 배너`
      ]
    }
  }

  if (url.includes('components/image/blur-placeholder')) {
    return {
      spec: `placeholder="blur"와 blurDataURL은 고해상도 이미지가 네트워크를 통해 완전히 다운로드되기 전까지 수백 바이트 크기의 저용량 블러 썸네일을 즉각 표시하여 누적 레이아웃 이동(CLS)을 0으로 방지하는 최적화 기법입니다.`,
      example: `본 데모에서는 고해상도 상품 사진이 다운로드되는 약 800ms 동안 빈 공간 대신 부드러운 블러 미리보기가 0ms 즉시 표시되고, 다운로드가 끝나면 원본 사진으로 매끄럽게 페이드인 전환됩니다.`,
      benefits: [
        `Zero CLS(누적 레이아웃 이동 0): 이미지가 로드되며 아래 콘텐츠가 덜컹거리는 레이아웃 깨짐을 완전히 차단합니다.`,
        `체감 로딩 속도 극대화: 빈 흰색 박스 대신 이미지 윤곽을 즉시 보여주어 사용자가 느끼는 지연 시간을 대폭 단축합니다.`,
        `로컬 및 원격 이미지 모두 지원: 정적 import 이미지는 빌드 시 자동 생성되며, 원격 S3 이미지는 blurDataURL로 주입 가능합니다.`
      ],
      useCases: [
        `고해상도 패션 룩북 및 럭셔리 상품 상세 사진`,
        `스크롤 시 순차적으로 나타나는 상품 리뷰 포토 갤러리`,
        `쇼핑몰 메인 화면의 대형 히어로 비주얼 배너`
      ]
    }
  }

  if (url.includes('components/image/priority')) {
    return {
      spec: `priority={true} 속성은 해당 이미지를 뷰포트 내 가장 중요한 LCP(Largest Contentful Paint) 요소로 지정하여 브라우저 HTML head에 <link rel="preload">를 자동 주입하고 자바스크립트 실행 전 최우선 다운로드하도록 강제합니다.`,
      example: `본 데모에서는 쇼핑몰 최상단 타임세일 히어로 배너에 priority를 적용하여, 다른 비동기 스크립트나 아래쪽 상품 썸네일보다 먼저 이미지를 수신하여 LCP 시간을 1.8초에서 0.5초로 70% 단축합니다.`,
      benefits: [
        `구글 Core Web Vitals LCP 점수 극대화: 검색엔진 SEO 랭킹 평가의 핵심 지표인 LCP 2.5초 이내 달성을 보장합니다.`,
        `게으른 로딩(Lazy Loading) 충돌 방지: 초기 뷰포트 최상단 이미지가 lazy loading으로 인해 늦게 다운로드되는 치명적인 안티패턴을 제거합니다.`,
        `브라우저 네트워크 파이프라인 우선순위 획득: HTML 수신 즉시 브라우저가 이미지 리소스를 최상위 우선순위(High Priority)로 요청합니다.`
      ],
      useCases: [
        `쇼핑몰 메인 페이지의 최상단 롤링 히어로 배너`,
        `상품 상세 페이지의 대표 메인 상품 이미지 1번 컷`,
        `브랜드 스토리 및 이벤트 기획전 최상단 대표 이미지`
      ]
    }
  }

  if (url.includes('components/link/soft-navigation')) {
    return {
      spec: `Next.js의 <Link> 컴포넌트는 브라우저의 기본 페이지 리로드(a 태그)를 가로채고 클라이언트 라우터 캐시 및 React 비동기 트랜지션을 활용하여 부드러운 소프트 네비게이션과 스크롤 좌표 보존을 수행합니다.`,
      example: `본 데모에서는 카테고리 탭(신발, 의류, 전자기기) 이동 시 전체 HTML을 다시 받지 않고 변경된 상품 목록 데이터만 가져와 DOM을 교체하며, 이전 목록으로 돌아올 때 보던 스크롤 위치를 정확히 복원합니다.`,
      benefits: [
        `깜빡임 없는 고속 페이지 전환: 브라우저 상단 로딩 스피너와 흰색 화면 깜빡임 없이 즉각 반응합니다.`,
        `스크롤 위치 자동 보존: 상품 목록을 한참 내려보다 상세를 보고 뒤로 왔을 때 이전 스크롤 위치를 유지하여 재탐색 피로를 없앱니다.`,
        `정적 셸 자동 사전 패칭: 뷰포트에 보이는 링크의 정적 데이터를 백그라운드에서 미리 다운로드하여 클릭 시 0ms 전환을 실현합니다.`
      ],
      useCases: [
        `쇼핑몰 상단 GNB 대분류 및 하위 카테고리 탭 네비게이션`,
        `상품 목록 그리드에서 개별 상품 상세 카드로의 이동`,
        `장바구니, 마이페이지, 주문내역 등 주요 서비스 허브 간 이동`
      ]
    }
  }

  if (url.includes('components/link/prefetch')) {
    return {
      spec: `<Link prefetch={...}> 속성은 링크가 뷰포트에 진입했을 때 서버로부터 RSC Payload를 미리 가져올지(auto vs true vs false) 여부를 제어하여 네트워크 대역폭과 전환 지연 사이의 균형을 맞춥니다.`,
      example: `본 데모에서는 구매 전환율이 높은 [베스트 특가] 링크는 prefetch={true}로 전체 데이터를 사전 수신하고, 사용자가 드물게 클릭하는 [이용약관/탈퇴] 링크는 prefetch={false}로 설정하여 모바일 데이터 소모를 줄입니다.`,
      benefits: [
        `클릭 시 0ms 즉각 전환: prefetch된 페이지는 클릭하는 순간 이미 브라우저 메모리에 준비되어 즉시 렌더링됩니다.`,
        `모바일 데이터 낭비 방지: 불필요한 백그라운드 프리패칭을 차단하여 사용자 모바일 요금제 대역폭을 보호합니다.`,
        `서버 트래픽 조절: 대규모 방문자가 몰리는 메인 화면에서 모든 링크가 무차별 사전 요청되는 부하를 제어합니다.`
      ],
      useCases: [
        `결제 단계 진입 버튼 등 사용자 이탈 방지가 중요한 핵심 전환 링크`,
        `하단 푸터의 사업자 정보, 개인정보처리방침 등 비핵심 정적 링크(prefetch={false})`,
        `무한 스크롤 목록 내 수백 개 상품 링크의 프리패치 모드 최적화`
      ]
    }
  }

  if (url.includes('components/font/google')) {
    return {
      spec: `next/font/google은 빌드 타임에 구글 폰트를 자동 다운로드하여 자체 호스팅(Self-hosting) 형태로 정적 서빙하며, CSS size-adjust 및 fallback 폰트를 자동 계산하여 Zero CLS 폰트 로딩을 구현합니다.`,
      example: `본 예제에서는 영문 프리미엄 브랜드 로고 폰트(Montserrat)와 가변 굵기(Variable Font)를 CSS 변수로 주입하여, 외부 구글 서버와의 추가 네트워크 왕복 없이 HTML 렌더링 즉시 폰트가 적용됩니다.`,
      benefits: [
        `구글 외부 네트워크 요청 0건: 브라우저가 fonts.googleapis.com으로 별도 요청을 보내지 않아 개인정보 보호(GDPR)와 속도를 모두 만족합니다.`,
        `FOUT(폰트 깜빡임) 및 CLS 완전 제거: 대체 폰트와 웹폰트의 자형 크기를 빌드 시 자동 일치시켜 텍스트 흔들림이 없습니다.`,
        `가변 폰트(Variable Font) 용량 최적화: 단 하나의 파일로 100~900까지의 모든 폰트 굵기를 표현하여 번들 크기를 줄입니다.`
      ],
      useCases: [
        `쇼핑몰 브랜드 영문 로고 및 글로벌 다국어 타이포그래피`,
        `상품 가격표 전용 고가독성 숫자 가변 폰트 서빙`,
        `디자인 시스템 테마(Light/Dark)별 폰트 가중치 동적 바인딩`
      ]
    }
  }

  if (url.includes('components/font/local')) {
    return {
      spec: `next/font/local은 프로젝트 내부의 커스텀 웹폰트 파일(.woff2)을 직접 지정하여 빌드 타임에 최적화된 CSS @font-face를 자동 생성하고 정적 자산으로 안전하게 서빙하는 모듈입니다.`,
      example: `본 데모에서는 사내 전용 브랜드 폰트(Pretendard Variable)를 로컬에서 직접 서빙하여 본문 상품 설명과 리뷰 텍스트가 외부 CDN 장애와 무관하게 100% 안정적으로 표시됩니다.`,
      benefits: [
        `외부 CDN 종속성 제거: 타사 폰트 서버의 장애나 속도 저하에 영향받지 않는 완벽한 독립 인프라를 확보합니다.`,
        `최신 WOFF2 압축 포맷 적용: 브라우저가 지원하는 가장 가볍고 빠른 압축 포맷만 선별 서빙합니다.`,
        `CSS 변수 기반 쉬운 확장: font-sans 클래스 하나로 전체 앱의 타이포그래피를 일관되게 제어합니다.`
      ],
      useCases: [
        `자체 제작 기업 전용 브랜드 서체 적용`,
        `한글/한자/특수문자 서브셋(Subset) 최적화 폰트 서빙`,
        `보안 폐쇄망 또는 엔터프라이즈 환경에서의 자체 웹폰트 운영`
      ]
    }
  }

  if (url.includes('components/script/loading-strategies')) {
    return {
      spec: `next/script의 strategy 속성은 외부 스크립트의 실행 시점을 beforeInteractive(HTML 파싱 전), afterInteractive(하이드레이션 직후), lazyOnload(브라우저 유휴 시간)로 선언하여 메인 스레드 블로킹을 제어합니다.`,
      example: `본 데모에서는 결제 보안 봇 감지 모듈은 beforeInteractive로 최우선 로드하고, 토스/카카오페이 결제창 SDK는 afterInteractive로 바인딩하며, 마케팅 애널리틱스 픽셀은 lazyOnload로 지연시켜 초기 렌더링 성능을 극대화합니다.`,
      benefits: [
        `TBT(Total Blocking Time) 및 INP 지표 개선: 무거운 서드파티 스크립트가 초기 화면 렌더링을 가로막지 않습니다.`,
        `체계적인 SDK 생명주기 관리: 스크립트 로드 완료 시점(onLoad)과 오류 시점(onError)에 대한 선언적 콜백을 제공합니다.`,
        `중복 스크립트 삽입 방지: 동일 라우트 내 여러 컴포넌트에서 동일 Script를 선언해도 브라우저에는 단 한 번만 주입됩니다.`
      ],
      useCases: [
        `PG사(토스페이먼츠, 이니시스, 카카오페이) 결제창 SDK 로딩`,
        `Google Analytics, Meta Pixel 등 서드파티 마케팅 추적 스크립트`,
        `카카오맵, 네이버 지도 등 상품 배송지 위치 확인 맵 SDK`
      ]
    }
  }

  // 3. File Conventions
  if (url.includes('file-conventions/parallel-routes')) {
    return {
      spec: `Parallel Routes는 명명된 슬롯(@slot)을 사용하여 동일한 부모 레이아웃 안에서 두 개 이상의 독립적인 라우트 세그먼트를 병렬로 렌더링하고, 각 슬롯마다 독립적인 로딩/에러 상태를 가질 수 있게 지원하는 App Router 고급 라우팅 기능입니다.`,
      example: `본 예제에서는 마이페이지 화면에서 @orders(실시간 주문내역)와 @coupons(사용 가능 쿠폰함) 슬롯을 동시에 병렬 패칭하며, 쿠폰 조회가 지연되더라도 주문내역은 기다림 없이 먼저 렌더링됩니다.`,
      benefits: [
        `독립적인 Suspense 스트리밍: 느린 API를 호출하는 슬롯 때문에 빠른 슬롯의 렌더링이 지연되는 Waterfall을 제거합니다.`,
        `조건부 화면 분기: 사용자 권한(일반 고객 vs 판매자)에 따라 동일 슬롯 위치에 완전히 다른 컴포넌트를 렌더링할 수 있습니다.`,
        `독립적인 서브 네비게이션: 한 슬롯 내부에서 탭을 전환해도 다른 슬롯의 상태와 URL은 온전히 유지됩니다.`
      ],
      useCases: [
        `쇼핑몰 마이페이지 대시보드(주문내역 + 배송현황 + 위시리스트 병렬 로딩)`,
        `관리자 센터 대시보드(매출 통계 차트 + 실시간 주문 승인 대기열)`,
        `로그인 모달과 배경 상품 카탈로그의 병렬 렌더링`
      ]
    }
  }

  if (url.includes('file-conventions/intercepting-routes')) {
    return {
      spec: `Intercepting Routes는 (.) 또는 (..) 규칙을 통해 현재 레이아웃 문맥을 유지한 채 다른 라우트의 콘텐츠를 가로채 모달 형태로 렌더링하면서도, 브라우저 새로고침이나 URL 직접 공유 시에는 독립 페이지를 렌더링하는 기법입니다.`,
      example: `본 데모에서는 상품 목록에서 상품을 클릭하면 URL이 /products/1로 바뀌며 피드 위에 [퀵뷰 모달]이 즉시 뜨고, 이 URL을 복사해 새 탭에 붙여넣거나 F5 새로고침을 누르면 완전한 [상품 상세 독립 페이지]가 렌더링됩니다.`,
      benefits: [
        `최상의 모달 UX: 사용자가 보던 상품 목록 스크롤 맥락을 잃지 않고 상세 정보를 빠르게 확인하고 닫을 수 있습니다.`,
        `공유 및 SEO 100% 호환: 모달로 띄운 상품도 고유한 정식 URL을 가지므로 SNS 공유 및 검색엔진 크롤링이 완벽히 지원됩니다.`,
        `브라우저 뒤로가기 완벽 연동: 모달을 닫을 때 뒤로가기 버튼을 누르면 이전 상품 목록 상태로 자연스럽게 복귀합니다.`
      ],
      useCases: [
        `인스타그램/핀터레스트 스타일의 상품 사진 퀵뷰 및 옵션 선택 모달`,
        `상품 목록 탐색 중 로그인 유도 모달 가로채기`,
        `장바구니 퀵 드로어 및 결제 영수증 미리보기`
      ]
    }
  }

  if (url.includes('file-conventions/route-groups')) {
    return {
      spec: `Route Groups는 괄호로 감싼 폴더명((shop), (admin))을 통해 URL 경로 구조에 영향을 주지 않으면서 라우트들을 논리적으로 그룹화하고, 그룹별로 완전히 독립된 루트 레이아웃(Root Layout)을 적용할 수 있게 해줍니다.`,
      example: `본 예제에서는 (shop) 그룹에는 일반 고객용 GNB/푸터 레이아웃을 적용하고, (admin) 그룹에는 사이드바와 통계 전용 관리자 레이아웃을 적용하여 단일 프로젝트 내에서 두 개의 독립된 서비스 영역을 완벽히 분리했습니다.`,
      benefits: [
        `URL 구조 오염 없는 깔끔한 관리: 폴더명이 URL(/shop/...)에 노출되지 않아 RESTful하고 직관적인 URL을 유지합니다.`,
        `다중 루트 레이아웃(Multiple Root Layouts): 고객용 화면과 관리자용 화면의 HTML 헤더, 폰트, 글로벌 CSS를 완전히 독립 격리할 수 있습니다.`,
        `모듈식 코드 오너십 분리: 팀별로 담당하는 라우트 그룹의 레이아웃과 비즈니스 로직을 충돌 없이 관리합니다.`
      ],
      useCases: [
        `쇼핑몰 고객 화면((shop))과 판매자 파트너 센터((seller)) 레이아웃 분리`,
        `인증 전용 페이지((auth) - 로그인/회원가입)의 미니멀 레이아웃 격리`,
        `B2C 일반 몰과 B2B 기업용 도매 몰의 레이아웃 분기`
      ]
    }
  }

  if (url.includes('file-conventions/route/sse-stock-stream')) {
    return {
      spec: `Route Handler(route.ts)에서 Web 표준 ReadableStream과 Server-Sent Events(SSE) 헤더('text/event-stream')를 구성하여 클라이언트와 단방향 지속 연결을 맺고 실시간 스트리밍 데이터를 밀어주는 기능입니다.`,
      example: `본 데모에서는 플래시 타임세일 상품의 잔여 재고 카운트다운을 1초 간격으로 SSE 스트림을 통해 브라우저에 실시간 푸시하여, 사용자가 새로고침하지 않아도 재고 변동(10개 -> 9개 -> 품절)을 실시간으로 확인합니다.`,
      benefits: [
        `WebSocket 대비 초경량 오버헤드: 표준 HTTP/2 기반으로 별도의 양방향 소켓 서버나 복잡한 프로토콜 핸드셰이크가 필요 없습니다.`,
        `자동 재연결 내장: 네트워크가 일시적으로 끊겨도 브라우저 EventSource API가 자동으로 재연결을 시도합니다.`,
        `서버리스 호환성: Vercel 및 Node.js 환경에서 스트리밍 응답을 안전하게 지원합니다.`
      ],
      useCases: [
        `한정판 스니커즈 드롭 및 타임세일 실시간 재고 카운트다운`,
        `배송 기사 실시간 GPS 이동 경로 및 배송 현황 관제`,
        `대규모 실시간 라이브 커머스 채팅 및 구매 알림 피드`
      ]
    }
  }

  if (url.includes('file-conventions/route/webhook-signature')) {
    return {
      spec: `외부 PG사(토스, 카카오페이 등)가 결제 완료 시 호출하는 Webhook 요청의 HMAC-SHA256 디지털 서명 헤더를 서버에서 비밀키와 대조 검증하여 위조된 결제 승인 요청을 차단하는 보안 엔드포인트입니다.`,
      example: `본 예제에서는 PG사가 전송한 raw payload와 x-signature 헤더를 crypto 모듈로 검증하여 유효한 결제 통보만 주문 상태를 '결제완료'로 변경하고, 서명이 위조된 비정상 요청은 401 Unauthorized로 즉시 거부합니다.`,
      benefits: [
        `결제 데이터 무결성 보장: 해커가 가짜 결제 성공 요청을 보내 상품을 무단 출고하는 금융 사고를 원천 방지합니다.`,
        `비동기 결제 최종 승인 처리: 가상계좌 입금, 편의점 결제 등 즉시 결제되지 않는 비동기 결제 수단의 완료 통보를 안전하게 수신합니다.`,
        `멱등성(Idempotency) 보장: PG사에서 중복 전송되는 웹훅에 대해 중복 결제 처리가 되지 않도록 방어합니다.`
      ],
      useCases: [
        `토스페이먼츠/이니시스 결제 승인 및 가상계좌 입금 확인 웹훅`,
        `CJ대한통운/우체국 택배사 배송 완료 자동 상태 변경 웹훅`,
        `Stripe/PayPal 해외 결제 이벤트 연동`
      ]
    }
  }

  // 4. Cache & Revalidating
  if (url.includes('cache-life') || url.includes('config/cache-life')) {
    return {
      spec: `cacheLife()는 use cache가 선언된 함수나 컴포넌트의 캐시 수명 주기(stale: 신선도 유지 시간, revalidate: 백그라운드 재검증 주기, expire: 메모리 완전 만료 시간)를 정밀하게 설정하는 Next.js 16 빌트인 API입니다.`,
      example: `본 데모에서는 실시간 가격 변동이 심한 핫딜 상품은 cacheLife('seconds')로 10초마다 재검증하고, 변경이 드문 카테고리 분류 데이터는 cacheLife('days')로 장기 보존하여 캐시 효율을 극대화합니다.`,
      benefits: [
        `선언적 캐시 수명 프로파일: 초 단위 숫자 하드코딩 대신 'minutes', 'hours', 'days' 등 직관적인 프로파일을 바인딩합니다.`,
        `stale-while-revalidate 자동 최적화: 캐시 만료 시에도 첫 요청 사용자에게 지연 없이 이전 캐시를 서빙하고 백그라운드에서 신규 데이터를 갱신합니다.`,
        `next.config.ts 커스텀 프로파일 확장: 기업 정책에 맞는 글로벌 캐시 수명 템플릿을 전역 정의할 수 있습니다.`
      ],
      useCases: [
        `쇼핑몰 메인 롤링 배너 및 기획전 목록 캐싱 (hours)`,
        `실시간 베스트셀러 순위 및 핫딜 재고 캐싱 (seconds/minutes)`,
        `이용약관, FAQ, 브랜드 소개 등 정적 안내 페이지 (max/days)`
      ]
    }
  }

  if (url.includes('cache-tag') || url.includes('functions/cache-tag')) {
    return {
      spec: `cacheTag()는 use cache 블록 내부에서 캐시 항목에 의미론적 태그(예: 'category:shoes', 'product:prod-001')를 바인딩하여, 이후 데이터가 변경되었을 때 revalidateTag()로 관련 캐시들을 연쇄적으로 일괄 무효화할 수 있게 해줍니다.`,
      example: `본 데모에서는 신발 상품 데이터에 'category:shoes'와 'product:prod-001' 태그를 다중 바인딩하여, 상품 정보가 수정되면 단일 태그 무효화로 상품 상세뿐만 아니라 신발 카테고리 목록 캐시까지 일괄 갱신됩니다.`,
      benefits: [
        `N:M 다대다 캐시 관계 구성: 하나의 데이터 변경이 여러 화면(상세, 목록, 추천, 장바구니)에 미치는 영향을 완벽하게 동기화합니다.`,
        `불필요한 전체 캐시 파기 방지: 무관한 의류나 전자제품 캐시는 그대로 유지하고 수정된 신발 관련 캐시만 정밀 타겟팅합니다.`,
        `마이크로서비스 아키텍처 연동: 백엔드 DB 변경 웹훅 수신 시 해당 Entity ID 태그만 즉시 무효화할 수 있습니다.`
      ],
      useCases: [
        `상품 가격 및 재고 변경 시 상세/목록/검색 캐시 동시 무효화`,
        `카테고리 기획전 개편 시 관련 카테고리 전체 캐시 일괄 퍼지`,
        `특정 판매자(Seller ID)의 전체 등록 상품 캐시 일괄 갱신`
      ]
    }
  }

  // 5. Guides (Auth, SWR, TanStack, Streaming, etc.)
  if (url.includes('guides/authentication') || url.includes('guides/auth-session')) {
    return {
      spec: `Next.js App Router에서의 인증 아키텍처는 Middleware를 통한 라우트 레벨의 조기 접근 차단과, 서버 컴포넌트 내부에서의 정밀한 권한 검증 및 세션 주입을 계층적으로 결합하는 보안 표준 패턴입니다.`,
      example: `본 예제에서는 비로그인 사용자가 주문서(/checkout)나 마이페이지에 진입할 때 Middleware가 이를 감지하여 로그인 페이지로 즉시 리다이렉트하고, 로그인 완료 시 원래 접근하려던 주문서 페이지로 자동 복귀시킵니다.`,
      benefits: [
        `불필요한 서버 렌더링 비용 차단: 인가되지 않은 요청은 서버 컴포넌트가 실행되기도 전에 Edge/Middleware 레벨에서 즉시 차단합니다.`,
        `보안 취약점(XSS) 방어: 자바스크립트로 탈취 불가능한 HttpOnly 세션 쿠키를 사용하여 안전한 토큰 교환을 보장합니다.`,
        `일관된 사용자 컨텍스트 제공: 서버 컴포넌트에서 세션을 조회하여 불필요한 클라이언트 useEffect 로딩 스피너를 제거합니다.`
      ],
      useCases: [
        `장바구니에서 결제서 작성 단계 진입 시 비회원 로그인 유도`,
        `일반 고객의 판매자 파트너 센터 및 관리자 대시보드 접근 차단`,
        `VIP 회원 전용 특가 기획전 페이지 접근 권한 제어`
      ]
    }
  }

  if (url.includes('guides/tanstack-query')) {
    return {
      spec: `TanStack Query(React Query)와 Next.js App Router의 결합은 서버 컴포넌트에서 queryClient.prefetchQuery를 통해 초기 데이터를 사전 패칭한 후 HydrationBoundary로 클라이언트에 전달하고, 클라이언트에서는 useInfiniteQuery로 무한 스크롤을 처리하는 실무 표준 데이터 아키텍처입니다.`,
      example: `본 데모에서는 첫 페이지 10개 상품은 서버에서 즉시 렌더링하여 검색엔진 SEO와 빠른 초기 화면을 확보하고, 사용자가 스크롤을 내릴 때마다 클라이언트 useInfiniteQuery가 추가 페이지 데이터를 부드럽게 무한 로딩합니다.`,
      benefits: [
        `완벽한 SEO와 부드러운 UX 결합: 초기 HTML에 상품 데이터가 온전히 포함되어 검색엔진 크롤링이 가능하며, 추가 탐색은 무한 스크롤로 매끄럽습니다.`,
        `강력한 클라이언트 캐싱 및 중복 요청 방지: 탭 전환 시 캐시된 상품 데이터를 즉시 표시하고 백그라운드에서 최신 데이터를 확인합니다.`,
        `낙관적 업데이트 및 가비지 컬렉션: 자동 메모리 관리로 수천 개의 상품을 탐색해도 브라우저 메모리가 누수되지 않습니다.`
      ],
      useCases: [
        `수만 개의 상품이 존재하는 쇼핑몰 카테고리 무한 스크롤 피드`,
        `상품 구매 후기 및 포토 리뷰 무한 로딩 리스트`,
        `실시간 주문 배송 현황 및 알림 센터 피드`
      ]
    }
  }

  if (url.includes('guides/data-security/server-only-guard')) {
    return {
      spec: `'server-only' 패키지는 서버 전용 모듈(DB 접속 드라이버, 결제 PG 비밀키, 암호화 함수 등)의 최상단에 import하여, 실수로 해당 모듈이 클라이언트 컴포넌트 번들에 포함될 경우 빌드 타임에 에러를 발생시켜 번들 유출을 원천 방어하는 빌드 타임 가드입니다.`,
      example: `본 예제에서는 결제 PG 비밀키(TOSS_SECRET_KEY)를 다루는 결제 처리 모듈에 'server-only'를 선언하여, 개발자가 실수로 클라이언트 컴포넌트에서 import하더라도 빌드 시 즉시 차단되어 운영 배포를 사전에 방지합니다.`,
      benefits: [
        `원천적인 시크릿 키 유출 방지: 브라우저 개발자 도구의 Source 탭에서 백엔드 인증 키나 DB 비밀번호가 노출되는 보안 사고를 0건으로 만듭니다.`,
        `빌드 타임 빠른 피드백: 런타임에 문제를 발견하는 대신 빌드/CI 파이프라인에서 즉시 비정상 참조를 탐지합니다.`,
        `명확한 코드 아키텍처 경계: 서버 전용 비즈니스 로직과 클라이언트 UI 로직의 경계를 명확히 분리합니다.`
      ],
      useCases: [
        `PG사 결제 비밀키 및 가맹점 API 서명 생성 모듈 보호`,
        `데이터베이스 ORM(Prisma, Drizzle) 인스턴스 및 쿼리 함수 보호`,
        `사용자 개인정보(주민번호, 카드번호) 복호화 모듈 클라이언트 유출 차단`
      ]
    }
  }

  if (url.includes('guides/json-ld')) {
    return {
      spec: `JSON-LD(JavaScript Object Notation for Linked Data)는 구글, 네이버 등 검색엔진 크롤러가 웹페이지의 의미론적 데이터(상품명, 가격, 재고 유무, 평점 등)를 정확히 파악할 수 있도록 schema.org 표준에 맞추어 <script type="application/ld+json"> 태그로 구조화 데이터를 주입하는 SEO 기법입니다.`,
      example: `본 데모에서는 상품 상세 페이지에 Product, Offer, AggregateRating 스키마를 JSON-LD로 렌더링하여, 구글 검색 결과에 상품 가격, 별점(⭐ 4.8), '재고 있음' 뱃지가 리치 스니펫(Rich Snippets)으로 화려하게 노출되도록 구성했습니다.`,
      benefits: [
        `검색엔진 노출 클릭률(CTR) 대폭 상승: 일반 텍스트 링크 대비 가격과 별점이 함께 표시되는 리치 스니펫이 검색 유입을 극대화합니다.`,
        `구글 쇼핑 탭 자동 색인: 구조화된 상품 피드가 구글 쇼핑 엔진에 자동으로 연동되어 무료 제품 목록에 등록됩니다.`,
        `HTML 파싱 의존성 제거: 크롤러가 복잡한 DOM 구조를 파싱하지 않고도 JSON 데이터만으로 상품 사양을 완벽히 이해합니다.`
      ],
      useCases: [
        `쇼핑몰 모든 상품 상세 페이지의 Product / Offer 스키마 주입`,
        `사용자 구매 후기 및 평점 요약의 AggregateRating 스키마 주입`,
        `쇼핑몰 브랜드 및 고객센터 정보의 Organization 스키마 주입`
      ]
    }
  }

  if (url.includes('guides/content-security-policy')) {
    return {
      spec: `Content Security Policy(CSP)는 Middleware에서 매 요청마다 암호학적으로 안전한 고유 Nonce(난수) 값을 생성하여 HTML 응답 헤더와 script 태그에 주입함으로써, 악의적인 인라인 스크립트 실행(XSS)을 브라우저 엔진 레벨에서 차단하는 최상위 웹 보안 표준입니다.`,
      example: `본 예제에서는 Middleware가 생성한 고유 Nonce가 부여된 정당한 결제창 SDK만 브라우저에서 실행이 허용되고, 해커가 댓글이나 상품 문의에 삽입한 악성 인라인 스크립트는 Nonce 불일치로 즉시 실행이 차단됩니다.`,
      benefits: [
        `XSS(Cross-Site Scripting) 공격 원천 방어: 사용자의 브라우저 세션 토큰이나 결제 정보를 탈취하려는 악성 스크립트 실행을 완벽히 무력화합니다.`,
        `엄격한 서드파티 스크립트 도메인 통제: 승인된 PG사 및 애널리틱스 도메인 외의 비인가 외부 리소스 로드를 차단합니다.`,
        `엔터프라이즈 보안 인증 기준 충족: 금융권 및 전자상거래 보안 적합성 심사 기준을 100% 충족합니다.`
      ],
      useCases: [
        `전자상거래 결제창 및 인증 토큰 교환 페이지 보안`,
        `사용자 생성 콘텐츠(UGC - 상품 후기, Q&A 게시판) XSS 방어`,
        `외부 제3자 스크립트 무단 주입 및 클릭재킹 방어`
      ]
    }
  }

  // 6. Config
  if (url.includes('config/base-path')) {
    return {
      spec: `basePath 설정은 Next.js 애플리케이션의 모든 라우트, 정적 자산 경로, API 엔드포인트에 일괄적으로 서브패스 접두사(예: /shop)를 적용하여 역방향 프록시(Nginx, Cloudflare) 환경에서 서브도메인 없이 독립 서비스로 통합 운영할 수 있게 합니다.`,
      example: `본 데모에서는 basePath: '/shop' 설정에 따라 모든 <Link>와 이미지 경로가 자동으로 /shop/products, /shop/_next/...로 매핑되어, 기업 공식 메인 홈페이지(company.com) 하위에 쇼핑몰(company.com/shop)을 매끄럽게 통합합니다.`,
      benefits: [
        `단일 도메인 통합 운영: 별도 서브도메인(shop.company.com) 설정 없이 메인 도메인의 SEO 점수를 그대로 공유합니다.`,
        `경로 하드코딩 제거: 코드 내에서 매번 '/shop'을 붙이지 않고 표준 경로('/products')를 작성해도 프레임워크가 자동 변환합니다.`,
        `마이크로 프론트엔드 통합: Nginx 등 게이트웨이에서 서브패스 라우팅으로 여러 프론트엔드 앱을 쉽게 조합합니다.`
      ],
      useCases: [
        `기업 공식 브랜드 사이트 하위에 독립 쇼핑몰(/shop) 서비스 배치`,
        `글로벌 서비스의 국가별 독립 Next.js 앱 서브패스 라우팅(/kr, /jp, /us)`,
        `레거시 시스템과 신규 App Router 서비스의 단계적 마이그레이션`
      ]
    }
  }

  if (url.includes('config/asset-prefix')) {
    return {
      spec: `assetPrefix 설정은 컴파일된 자바스크립트 청크, CSS 파일, 정적 폰트 등 _next/static 자산의 기본 URL을 외부 CDN 주소(예: https://cdn.shop.com)로 변경하여 정적 자산 트래픽을 원본 웹 서버에서 완전 분리 서빙하는 최적화 옵션입니다.`,
      example: `본 데모에서는 assetPrefix가 적용되어 HTML 요청은 원본 웹 서버가 처리하고, 100여 개가 넘는 대용량 JS/CSS 번들은 전 세계 엣지 CDN(CloudFront)에서 초고속으로 다운로드되도록 분산 처리됩니다.`,
      benefits: [
        `웹 서버 부하 90% 이상 절감: 정적 파일 다운로드 요청이 CDN 엣지에서 처리되어 오리진 서버는 비즈니스 SSR 연산에만 집중합니다.`,
        `글로벌 다운로드 속도 가속: 전 세계 분산된 CDN PoP(Point of Presence)에서 캐시된 정적 번들을 제공하여 해외 고객 로딩 시간을 대폭 단축합니다.`,
        `디도스(DDoS) 공격 방어: 대규모 트래픽 폭주 시에도 CDN이 정적 자산 트래픽을 안전하게 흡수합니다.`
      ],
      useCases: [
        `대규모 트래픽이 몰리는 대형 쇼핑몰의 정적 번들 AWS S3 / CloudFront 분산 배포`,
        `글로벌 이커머스 서비스의 다국가 정적 자산 엣지 캐싱 가속`,
        `서버리스 인프라의 네트워크 대역폭 비용 절감`
      ]
    }
  }

  if (url.includes('config/redirects')) {
    return {
      spec: `next.config.ts의 redirects()는 특정 URL 패턴, 정규식, 와일드카드 및 요청 헤더/쿼리 조건을 평가하여 서버 레벨에서 301/308 영구 리다이렉트 또는 302/307 임시 리다이렉트를 브라우저에 반환하는 설정입니다.`,
      example: `본 데모에서는 단종된 구형 상품 URL(/item/old-123)로 접근한 사용자를 신상품(/products/prod-001)으로 308 영구 리다이렉트하고, 모바일 User-Agent로 접속한 고객은 모바일 전용 이벤트 페이지로 자동 조건부 리다이렉트합니다.`,
      benefits: [
        `검색엔진 SEO 점수 보존: 308 Permanent Redirect를 통해 구형 상품 URL이 쌓아둔 백링크와 검색 랭킹 점수를 신규 상품으로 100% 승계합니다.`,
        `404 이탈률 방지: 폐기되거나 변경된 URL로 들어온 고객을 관련 상품으로 자연스럽게 안내하여 쇼핑 이탈을 막습니다.`,
        `정규식 및 헤더 기반 정밀 라우팅: 소스/타겟 매핑을 정규식 패턴으로 일괄 정의하여 수만 개의 리다이렉트 규칙을 간단히 관리합니다.`
      ],
      useCases: [
        `단종 상품 페이지 접근 시 대체 신상품 페이지로 자동 연결`,
        `시즌 종료된 기획전 URL 접근 시 현재 진행 중인 메인 프로모션 페이지로 이동`,
        `모바일 접속 고객 또는 특정 국가 IP 요청의 조건부 라우팅`
      ]
    }
  }

  // Fallback tailored by category
  const parts = url.split('/')
  const category = parts[0]
  const subCategory = parts[1] || ''

  return {
    spec: `${title}는 Next.js App Router의 공식 ${category} 아키텍처 표준 기능으로, 브라우저와 서버 간의 데이터 흐름을 최적화하고 고성능 프로덕션 서비스를 구축할 수 있도록 설계된 핵심 기술입니다.`,
    example: `본 데모에서는 ${title}의 실무 동작 메커니즘을 이커머스 쇼핑몰의 실제 상호작용 흐름과 결합하여, 조작에 따른 상태 변화와 서버-클라이언트 통신 결과를 검증 패널을 통해 단계별로 관찰할 수 있도록 구성했습니다.`,
    benefits: [
      `실무 안정성 확보: 대규모 트래픽과 다양한 사용자 인터랙션 환경에서도 무결한 비즈니스 로직 실행을 보장합니다.`,
      `프레임워크 최적화: Next.js App Router의 내장 캐시 및 비동기 렌더링 파이프라인과 완벽히 연동되어 최고의 성능을 발휘합니다.`,
      `유지보수성 향상: 표준화된 코드 구조를 통해 협업과 장기적인 기능 확장에 유리한 아키텍처를 제공합니다.`
    ],
    useCases: [
      `쇼핑몰 서비스의 핵심 화면 및 백엔드 비즈니스 로직 연동`,
      `사용자 인터랙션 성능 및 서버 렌더링 효율 극대화가 필요한 프로덕션 환경`,
      `보안, 접근성, 검색엔진 최적화(SEO) 표준을 준수해야 하는 엔터프라이즈 애플리케이션`
    ]
  }
}
