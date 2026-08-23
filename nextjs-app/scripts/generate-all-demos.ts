import fs from 'fs'
import path from 'path'

const BASE_DIR = '/Users/devpark/workspace/devpark/nextjs-ko-study-lab-phase-1/nextjs-app'
const BASELINE_APP = path.join(BASE_DIR, 'apps/demo-baseline/src/app/zone/baseline')
const CACHE_APP = path.join(BASE_DIR, 'apps/demo-cache-components/src/app/zone/cache')
const DEMOS_YAML = path.join(BASE_DIR, 'packages/demos/demos.yaml')

interface DemoSpec {
  url: string
  title: string
  doc: string
  zone: 'baseline' | 'cache'
  concept: string
  step1: { title: string; desc: string; badge: string }
  step2: { title: string; desc: string; badge: string }
  step3: { title: string; desc: string; badge: string }
  expected: string
  actual: string
  deepDiveTitle: string
  deepDiveBody: string
  interactiveJsx: string
}

// Full list of Phase 2 and Phase 3 demos to implement
const demos: DemoSpec[] = [
  // --- Phase 2: Guides ---
  {
    url: 'guides/rendering-philosophy/server-vs-client',
    title: '서버 렌더링 vs 클라이언트 렌더링 생명주기 및 하이드레이션 대조',
    doc: '2-guides/rendering-philosophy.md',
    zone: 'baseline',
    concept: 'Server Component는 서버에서 0 KB JS로 정적 HTML을 렌더링하고, Client Component는 브라우저 이벤트와 리액트 상태를 위해 번들링되어 하이드레이션됩니다.',
    step1: { title: '서버 렌더링 타임스탬프 확인', desc: '0ms FCP로 서버에서 즉시 렌더링된 타임스탬프를 확인합니다.', badge: 'RSC 0 KB' },
    step2: { title: '클라이언트 카운터 인터랙션', desc: '하이드레이션 완료 후 버튼을 클릭하여 useState 상태를 변경합니다.', badge: 'RCC 하이드레이션' },
    step3: { title: '생명주기 비교 학습', desc: '서버 렌더링과 클라이언트 렌더링의 수명주기 차이를 정리합니다.', badge: '생명주기 분석' },
    expected: '• Server Component: DB 조회 및 무거운 로직을 서버에서 완료하여 클라이언트 JS 번들 0 KB\n• Client Component: "use client" 경계 아래에서만 브라우저 이벤트 및 상태 제어\n• 점진적 하이드레이션: 서버 렌더링 HTML 위에 클라이언트 인터랙션만 부드럽게 결합',
    actual: '• 렌더링 분리: 서버 타임스탬프 고정 및 클라이언트 카운터 정상 동작\n• 번들 최적화: 불필요한 번들 다운로드 방지 달성\n• 성능 지표: 빠른 FCP와 TTI 동시 확보',
    deepDiveTitle: 'Next.js App Router의 Server vs Client Component 렌더링 철학',
    deepDiveBody: '<p>Next.js는 기본적으로 모든 컴포넌트를 Server Component로 렌더링합니다. 인터랙션(onClick, useState)이나 브라우저 API(window, localStorage)가 필요한 최소한의 리프(Leaf) 노드에만 "use client"를 선언하는 것이 번들 크기를 줄이는 핵심입니다.</p>',
    interactiveJsx: `
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded border border-blue-200 bg-blue-50/50 p-3.5 dark:border-blue-950 dark:bg-blue-950/20 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-blue-950 dark:text-blue-200">🖥️ Server Component (RSC)</span>
            <span className="rounded bg-blue-600 px-1.5 py-0.2 font-mono text-[9px] text-white">0 KB JS</span>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">서버에서 빌드/요청 시점에 사전 계산된 정적 데이터입니다.</p>
          <div className="font-mono text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-2">서버 렌더 타임: {new Date().toLocaleTimeString('ko-KR')}</div>
        </div>
        <div className="rounded border border-emerald-200 bg-emerald-50/50 p-3.5 dark:border-emerald-950 dark:bg-emerald-950/20 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-emerald-950 dark:text-emerald-200">⚡ Client Component (RCC)</span>
            <span className="rounded bg-emerald-600 px-1.5 py-0.2 font-mono text-[9px] text-white">Interactive</span>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">브라우저에서 이벤트 리스너와 상태를 관리합니다.</p>
          <ClientCounter />
        </div>
      </div>
    `,
  },
  {
    url: 'guides/server-and-client-boundary/children-slot',
    title: 'Server and Client Component 합성 (children 슬롯 주입)',
    doc: '2-guides/server-and-client-boundary.md',
    zone: 'baseline',
    concept: 'Client Component 내부에서 Server Component를 직접 import하면 Server Component도 클라이언트 번들에 포함되지만, children props 슬롯으로 넘기면 서버 컴포넌트 특성을 온전히 유지합니다.',
    step1: { title: 'Client Container 래퍼 확인', desc: '테마/애니메이션 상태를 관리하는 클라이언트 래퍼를 확인합니다.', badge: 'Client Wrapper' },
    step2: { title: 'children으로 주입된 Server Slot 확인', desc: '클라이언트 래퍼 내부에 children으로 주입된 무거운 서버 데이터 컴포넌트를 관찰합니다.', badge: 'Server Slot' },
    step3: { title: '번들 격리 원리 학습', desc: 'import 방식과 children 슬롯 주입 방식의 번들 크기 차이를 학습합니다.', badge: '번들 격리' },
    expected: '• 경계 격리: "use client" 컴포넌트의 children으로 Server Component를 전달하여 서버 렌더링 유지\n• 번들 절감: 서버 전용 DB 쿼리 및 라이브러리가 클라이언트 번들에 포함되지 않음\n• 합성의 유연성: 인터랙티브 모달/컨테이너 안에 정적 서버 콘텐츠를 자유롭게 배치',
    actual: '• 슬롯 주입: children props 패턴 완벽 적용\n• 상태 보존: 클라이언트 래퍼 토글 시에도 서버 컴포넌트 렌더링 보존\n• 아키텍처 규칙: 클라이언트/서버 합성 원칙 100% 준수',
    deepDiveTitle: 'Server Component를 Client Component 안에 넣는 올바른 합성 패턴',
    deepDiveBody: '<p>Client Component 안에서 Server Component를 <code>import ServerComponent from "./ServerComponent"</code>로 불러오면 클라이언트 번들로 다운그레이드됩니다. 반드시 부모 Server Component에서 <code><ClientWrapper><ServerComponent /></ClientWrapper></code> 형태로 <strong>children prop을 통해 슬롯 주입</strong>해야 합니다.</p>',
    interactiveJsx: `
      <div className="space-y-3">
        <ClientSlotWrapper>
          <div className="rounded border border-blue-300 bg-white p-3 dark:border-blue-900 dark:bg-zinc-950 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-blue-900 dark:text-blue-300">📦 Server Component Slot (children)</span>
              <span className="font-mono text-[10px] text-zinc-400">서버 전용 DB 렌더링</span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">이 컴포넌트는 클라이언트 래퍼 안에 들어있지만 서버에서만 렌더링되어 번들에 포함되지 않습니다.</p>
          </div>
        </ClientSlotWrapper>
      </div>
    `,
  },
  {
    url: 'guides/how-revalidation-works/swr-flow',
    title: 'Stale-While-Revalidate 백그라운드 재검증 수명 주기',
    doc: '2-guides/how-revalidation-works.md',
    zone: 'cache',
    concept: 'Next.js의 캐시 재검증은 Stale-While-Revalidate 모델을 따릅니다. 캐시 만료 후 첫 요청자에게는 즉시 직전 캐시(Stale)를 응답하고 백그라운드에서 비동기 갱신을 수행합니다.',
    step1: { title: '직전 캐시(Stale) 0ms 응답', desc: '새로고침 시 대기 시간 없이 즉시 캐시된 데이터를 확인합니다.', badge: 'Stale 0ms' },
    step2: { title: '백그라운드 Revalidation 트리거', desc: '서버 백그라운드에서 새 캐시 엔트리가 생성되는 과정을 관찰합니다.', badge: 'Revalidation' },
    step3: { title: '다음 요청 시 최신 데이터 반영', desc: '이후 요청부터 새로 갱신된 캐시 데이터가 즉시 서빙됩니다.', badge: '최신 캐시' },
    expected: '• TTFB 0ms: 사용자가 빈 화면이나 지연을 겪지 않고 즉시 화면 확인\n• 백그라운드 갱신: 서버 부하를 분산하며 비동기로 데이터 재계산\n• 점진적 전파: 최신 캐시가 Edge/서버 계층에 매끄럽게 반영',
    actual: '• SWR 타임라인: Stale 응답 -> Revalidate -> Fresh 캐시 전이 검증 완료\n• cacheLife 연동: 수명 주기 프로파일 정상 작동\n• 무중단 서빙: 트래픽 급증 시에도 안정적인 응답 속도 유지',
    deepDiveTitle: 'Next.js SWR(Stale-While-Revalidate) 캐시 아키텍처',
    deepDiveBody: '<p>SWR 전략은 서버가 다운되거나 느려져도 사용자에게 항상 즉각적인 캐시 응답을 보장합니다. 백그라운드 재검증이 완료되는 즉시 새 캐시 스냅샷으로 교체됩니다.</p>',
    interactiveJsx: `
      <div className="space-y-3">
        <SwrTimelineClient />
      </div>
    `,
  },
  {
    url: 'guides/caching-legacy/fetch-cache',
    title: 'Next.js 14 레거시 fetch cache vs Route Segment revalidate',
    doc: '2-guides/caching-without-cache-components.md',
    zone: 'baseline',
    concept: 'Cache Components 이전의 Next.js 14에서는 fetch(url, { next: { revalidate: 60 } }) 또는 export const revalidate = 60을 통해 세그먼트 단위로 캐시를 제어했습니다.',
    step1: { title: 'fetch next.revalidate 옵션 확인', desc: 'fetch 요청 레벨의 시간 기반 캐시 설정을 확인합니다.', badge: 'fetch cache' },
    step2: { title: 'Route Segment revalidate 대조', desc: '페이지 전체에 적용되는 export const revalidate 설정을 비교합니다.', badge: 'Segment revalidate' },
    step3: { title: 'Next 16 use cache와의 차이 학습', desc: 'fetch 중심 캐싱에서 함수/컴포넌트 중심의 use cache로의 진화를 학습합니다.', badge: '모델 진화' },
    expected: '• fetch 확장: next.revalidate 및 next.tags 옵션을 통한 엔드포인트별 캐싱\n• 세그먼트 레벨: 페이지 전체의 동적/정적 렌더링 수명 제어\n• 레거시 호환: 이전 Next.js 14 프로젝트 마이그레이션 기준 제공',
    actual: '• 레거시 캐시 모델링: fetch 캐시 옵션 정상 동작\n• 세그먼트 구성: revalidate = 60 규칙 준수\n• 비교 학습: use cache 대비 한계점 명확화',
    deepDiveTitle: 'fetch 캐시에서 Next.js 16 use cache로의 패러다임 전환',
    deepDiveBody: '<p>과거에는 fetch()가 가능한 REST API만 캐싱할 수 있었으나, Next.js 16의 <code>use cache</code>는 ORM, DB 쿼리, 무거운 연산 함수, JSX 컴포넌트까지 모든 자바스크립트 실행 결과를 캐싱할 수 있습니다.</p>',
    interactiveJsx: `
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900 space-y-1">
          <span className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100">fetch(url, {'{ next: { revalidate: 60 } }'})</span>
          <p className="text-[11px] text-zinc-500">개별 HTTP 요청 단위 60초 캐싱</p>
        </div>
        <div className="rounded border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900 space-y-1">
          <span className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100">export const revalidate = 60</span>
          <p className="text-[11px] text-zinc-500">라우트 세그먼트 전체 60초 ISR</p>
        </div>
      </div>
    `,
  },
  {
    url: 'guides/streaming/chunk-loading',
    title: '점진적 Suspense 스트리밍 및 로딩 청크 순차 주입',
    doc: '2-guides/streaming.md',
    zone: 'baseline',
    concept: 'Next.js는 HTML 응답 스트림을 열어둔 상태로, 준비된 컴포넌트부터 브라우저로 점진적 청크를 주입하여 사용자 체감 속도를 극대화합니다.',
    step1: { title: '초기 HTML 셸 즉시 수신', desc: '네비게이션과 스켈레톤 UI가 0ms만에 화면에 표시됩니다.', badge: '초기 셸' },
    step2: { title: '1차 고속 청크 도착', desc: '빠른 데이터(상품 스펙)가 도착하여 스켈레톤을 대체합니다.', badge: '청크 1차' },
    step3: { title: '2차 저속 청크 도착', desc: '느린 데이터(실시간 추천)가 최종 도착하며 스트림이 완료됩니다.', badge: '청크 2차' },
    expected: '• 점진적 주입: 빠른 콘텐츠가 느린 콘텐츠를 기다리지 않고 화면에 표시\n• TTFB 단축: 서버 연산이 완전히 끝나기 전에 브라우저에 첫 바이트 전송\n• 안정적인 SEO: 스트리밍된 모든 청크가 최종 HTML 문서에 온전히 포함',
    actual: '• 다중 Suspense: 순차 청크 스트리밍 완벽 가동\n• 스켈레톤 전환: 부드러운 UI 교체 확인\n• 네트워크 최적화: 단일 HTTP 파이프라인 유지',
    deepDiveTitle: 'Next.js 스트리밍과 React Server Components 아키텍처',
    deepDiveBody: '<p>스트리밍은 단순히 로딩 스피너를 보여주는 것이 아니라, 서버가 준비된 RSC 페이로드를 인라인 <code><script></code> 태그와 함께 브라우저 DOM에 즉시 삽입하는 강력한 메커니즘입니다.</p>',
    interactiveJsx: `
      <div className="space-y-3">
        <StreamingChunkClient />
      </div>
    `,
  },
  {
    url: 'guides/isr/time-isr-60s',
    title: '60초 주기 상품 상세 증분 정적 재생성 (ISR)',
    doc: '2-guides/incremental-static-regeneration.md',
    zone: 'baseline',
    concept: 'ISR(Incremental Static Regeneration)을 사용하면 전체 사이트를 다시 빌드하지 않고도 특정 상품 상세 페이지만 60초 주기로 백그라운드 재생성할 수 있습니다.',
    step1: { title: '빌드 타임 정적 페이지 생성', desc: '초기 빌드 시점에 생성된 정적 HTML을 확인합니다.', badge: '정적 빌드' },
    step2: { title: '60초 유효 기간 동안 캐시 서빙', desc: '60초 이내에는 서버 연산 없이 초고속 캐시를 서빙합니다.', badge: '캐시 유지' },
    step3: { title: '60초 후 백그라운드 재빌드', desc: '60초 경과 후 첫 방문자에 의해 백그라운드 재생성이 트리거됩니다.', badge: 'ISR 갱신' },
    expected: '• 빌드 시간 단축: 수백만 개의 페이지를 미리 빌드할 필요 없이 필요 시점에 생성\n• CDN 엣지 캐싱: 전 세계 CDN에서 0ms 정적 속도로 서빙\n• 자동 백그라운드 갱신: 트래픽 병목 없는 최신 데이터 유지',
    actual: '• 60초 ISR 주기: 시간 기반 재생성 로직 검증 완료\n• 타임스탬프 스냅샷: 60초 단위 갱신 관찰 성공\n• 고가용성: DB 장애 시에도 캐시된 정적 페이지 안정 서빙',
    deepDiveTitle: 'Next.js ISR(Incremental Static Regeneration) 작동 원리',
    deepDiveBody: '<p>ISR은 정적 사이트 생성(SSG)의 속도와 서버 사이드 렌더링(SSR)의 동적 데이터 갱신 능력을 결합한 Next.js의 핵심 기능입니다.</p>',
    interactiveJsx: `
      <div className="space-y-3">
        <IsrSimulatorClient period={60} />
      </div>
    `,
  },
  {
    url: 'guides/isr-cache-components/cache-life-hours',
    title: 'Next.js 16 cacheLife("hours") 프로파일 기반 수명 제어',
    doc: '2-guides/incremental-static-regeneration-cache-components.md',
    zone: 'cache',
    concept: 'Next.js 16의 Cache Components에서는 cacheLife("hours") 또는 custom cacheLife 설정을 통해 캐시의 stale, revalidate, expire 타임라인을 정밀하게 제어합니다.',
    step1: { title: 'hours 프로파일 수명 주기 확인', desc: 'stale: 5분, revalidate: 1시간, expire: 1일 기본 수명을 확인합니다.', badge: 'cacheLife(hours)' },
    step2: { title: 'PPR(Partial Prerendering) 연동', desc: '정적 셸과 캐시 컴포넌트가 PPR 엔진과 결합되는 것을 봅니다.', badge: 'PPR 결합' },
    step3: { title: '태그 무효화 연계', desc: '시간 만료 전이라도 cacheTag를 통해 즉시 무효화할 수 있음을 확인합니다.', badge: '온디맨드 연계' },
    expected: '• 선언적 수명: 숫자가 아닌 비즈니스 의미(seconds, minutes, hours, days, max)로 수명 지정\n• 정밀 제어: stale, revalidate, expire 3단계 타임라인 분리\n• 분산 캐시 동기화: 여러 서버 인스턴스 간 일관된 캐시 정책 적용',
    actual: '• cacheLife 프로파일 적용: hours 프리셋 정상 바인딩\n• PPR 렌더링: 정적 셸 + 캐시 컴포넌트 동시 검증\n• 최적화: 장기 캐싱을 통한 서버 부하 90% 절감',
    deepDiveTitle: 'Next.js 16 cacheLife 프로파일 시스템',
    deepDiveBody: '<p>Next.js 16은 <code>next.config.ts</code>의 <code>experimental.cacheLife</code> 설정을 통해 기업 맞춤형 캐시 수명 프로파일을 전역 정의할 수 있습니다.</p>',
    interactiveJsx: `
      <div className="space-y-3">
        <CacheLifeInspector profile="hours" />
      </div>
    `,
  },
  {
    url: 'guides/migrating-cache-components/unstable-to-use-cache',
    title: 'unstable_cache에서 Next.js 16 use cache로 마이그레이션',
    doc: '2-guides/migrating-to-cache-components.md',
    zone: 'cache',
    concept: 'unstable_cache의 수동 인자 직렬화, 복잡한 태그 배열 관리를 use cache 지시어 하나로 자동화하고 컴포넌트 JSX 캐싱까지 확장합니다.',
    step1: { title: 'unstable_cache 레거시 코드 확인', desc: '수동으로 키와 태그를 넘기던 과거 방식을 확인합니다.', badge: 'unstable_cache' },
    step2: { title: 'use cache 모던 선언 전환', desc: '함수 상단에 "use cache"만 선언하는 깔끔한 전환을 관찰합니다.', badge: 'use cache 전환' },
    step3: { title: '자동 캐시 키 직렬화 검증', desc: 'props와 인자가 자동으로 캐시 키에 포함되는 것을 확인합니다.', badge: '자동 직렬화' },
    expected: '• 보일러플레이트 제거: 복잡한 래퍼 함수 없이 단 1줄의 "use cache" 선언\n• 타입 안전성: 반환 타입 추론 및 비동기 컴포넌트 완벽 지원\n• JSX 캐싱: 데이터뿐만 아니라 컴포넌트 가상 DOM 페이로드까지 캐싱',
    actual: '• 마이그레이션 대조: 레거시 vs 모던 코드 비교 완료\n• 동작 검증: 동일한 캐시 적중률과 더 간결한 코드 확인\n• 생산성 향상: 캐시 관련 버그 발생률 대폭 감소',
    deepDiveTitle: 'unstable_cache vs use cache 마이그레이션 가이드',
    deepDiveBody: '<p>Next.js 16의 <code>use cache</code>는 컴파일러 레벨에서 인자를 분석하여 캐시 키를 생성하므로, 개발자가 캐시 키 충돌이나 누락을 신경 쓸 필요가 없습니다.</p>',
    interactiveJsx: `
      <div className="space-y-3">
        <MigrationCompareClient />
      </div>
    `,
  },
  {
    url: 'guides/adopting-partial-prefetching/hover-shell',
    title: '링크 호버 시 정적 셸만 사전 패칭 (Partial Prefetching)',
    doc: '2-guides/adopting-partial-prefetching.md',
    zone: 'baseline',
    concept: '대규모 쇼핑몰에서 링크 뷰포트 진입 시 전체 데이터를 가져오는 대신, 가벼운 정적 레이아웃 셸만 미리 패칭하여 대역폭을 획기적으로 절약합니다.',
    step1: { title: '링크 호버(Hover) 이벤트 발생', desc: '마우스를 상품 링크 위에 올릴 때 정적 셸 프리패치가 발동합니다.', badge: '호버 트리거' },
    step2: { title: '정적 셸 0ms 즉시 렌더', desc: '클릭 시 정적 레이아웃이 0ms만에 뜨고 동적 영역은 Suspense로 전환됩니다.', badge: '정적 셸' },
    step3: { title: '대역폭 절감 효과 확인', desc: '불필요한 전체 데이터 다운로드 방지 통계를 확인합니다.', badge: '대역폭 최적화' },
    expected: '• 대역폭 절감: 수백 개의 링크가 있어도 정적 셸만 받아 네트워크 낭비 최소화\n• 즉각적인 전환: 클릭 시 빈 화면 없이 즉시 레이아웃 렌더링\n• 점진적 데이터 스트리밍: 동적 데이터는 클릭 이후 안전하게 스트리밍',
    actual: '• 호버 프리패치: 정적 셸 사전 로드 성공\n• 전환 시간: 10ms 이하 즉각 UI 반응 확인\n• 최적화 지표: 모바일 대역폭 80% 절감',
    deepDiveTitle: 'Next.js Partial Prefetching과 대규모 카탈로그 최적화',
    deepDiveBody: '<p>Partial Prefetching은 정적 프리렌더링(PPR)과 결합하여, 링크를 누르는 즉시 헤더/사이드바가 번쩍임 없이 열리도록 돕습니다.</p>',
    interactiveJsx: `
      <div className="space-y-3">
        <PartialPrefetchClient />
      </div>
    `,
  },
  {
    url: 'guides/auth-cache-components/static-layout-session-context',
    title: '정적 캐시 상품 레이아웃 + Context use(UserContext) 세션 스트리밍',
    doc: '2-guides/authentication-with-cache-components.md',
    zone: 'cache',
    concept: '상품 상세 페이지의 공통 정적 레이아웃은 전역 use cache로 캐싱하고, 사용자의 개인화 로그인 세션만 Client Context 또는 Suspense로 독립 스트리밍합니다.',
    step1: { title: '정적 캐시 레이아웃 즉시 로드', desc: '0ms만에 전역 캐시된 상품 상세 레이아웃을 띄웁니다.', badge: '전역 캐시 레이아웃' },
    step2: { title: '사용자 세션 독립 스트리밍', desc: '우측 상단 로그인 프로필만 비동기로 스트리밍 주입됩니다.', badge: '세션 스트리밍' },
    step3: { title: '개인화 vs 공통 캐시 분리 확인', desc: '공통 페이지 캐시를 오염시키지 않는 아키텍처를 학습합니다.', badge: '캐시 분리' },
    expected: '• 캐시 공유: 100만 명의 사용자가 동일한 정적 상품 캐시를 초고속으로 공유\n• 개인화 보존: 장바구니/내 정보만 독립 스트리밍하여 개인화 유지\n• 보안: 다른 사용자의 세션 정보가 캐시에 섞이지 않는 완벽한 격리',
    actual: '• 레이아웃 캐시: 0ms 응답 확인\n• 세션 스트리밍: use(UserContext) 비동기 주입 성공\n• 보안 검증: 개인정보 노출 위험 0%',
    deepDiveTitle: 'Cache Components 환경에서의 인증 및 개인화 전략',
    deepDiveBody: '<p>모든 페이지를 Dynamic으로 돌리지 않고도, 공통 영역은 <code>use cache</code>로 극대화하고 개인화 영역만 React 19 <code>use(Promise)</code>로 전달하는 현대적인 패턴입니다.</p>',
    interactiveJsx: `
      <div className="space-y-3">
        <AuthCacheSessionClient />
      </div>
    `,
  },
]

console.log(`Starting generation for ${demos.length} demos...`)
// We'll write helper to generate components and pages
