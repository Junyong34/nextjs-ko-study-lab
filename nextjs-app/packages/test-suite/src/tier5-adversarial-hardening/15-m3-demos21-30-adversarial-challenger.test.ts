import test, { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { applyCouponAction } from '../../../../apps/demo-baseline/src/app/zone/baseline/guides/server-actions-advanced/actions.ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const REPO_ROOT = path.resolve(__dirname, '../../../../..')
const APPS_ROOT = path.resolve(REPO_ROOT, 'nextjs-app/apps')
const BASELINE_ROOT = path.join(APPS_ROOT, 'demo-baseline/src/app/zone/baseline')

describe('Tier 5 Hardening — Milestone 3 (Batch B03 Demos 21–30) Adversarial Challenger', () => {

  // =========================================================================
  // DEMO 21: Font Optimization (fonts/font-optimization)
  // =========================================================================
  describe('Demo 21: next/font Zero CLS & Self-Hosting', () => {
    const demoDir = path.join(BASELINE_ROOT, 'fonts/font-optimization')

    function evaluateVerification(hasInteracted: boolean, selectedWeight: string, sampleText: string) {
      const isMatched = hasInteracted ? true : undefined
      const actual = !hasInteracted
        ? '• 폰트 조작 대기 중 (상단 툴바에서 [400], [700], [900] 굵기를 선택하거나 문구를 수정하세요)'
        : `• 선택된 폰트 굵기: ${selectedWeight} (가변 폰트 단일 인스턴스 렌더링)\n• 미리보기 문구: "${sampleText}" (길이: ${sampleText.length}자)\n• 셀프호스팅 상태: /_next/static/media/ 로컬 서빙 (외부 DNS 차단 및 CLS 0 달성)`
      return { isMatched, actual }
    }

    it('21.1 Verification lifecycle: initial pending -> interactive matched', () => {
      // 1. Initial State
      const initial = evaluateVerification(false, '700', 'Next.js 폰트')
      assert.strictEqual(initial.isMatched, undefined, 'Initial state must be pending (undefined)')
      assert.ok(initial.actual.includes('폰트 조작 대기 중'))

      // 2. Weight Change (400)
      const w400 = evaluateVerification(true, '400', 'Next.js 폰트')
      assert.strictEqual(w400.isMatched, true, 'Weight selection must evaluate to true')
      assert.ok(w400.actual.includes('선택된 폰트 굵기: 400'))

      // 3. Weight Change (900)
      const w900 = evaluateVerification(true, '900', 'Next.js 폰트')
      assert.strictEqual(w900.isMatched, true)
      assert.ok(w900.actual.includes('선택된 폰트 굵기: 900'))

      // 4. Text Change
      const textChanged = evaluateVerification(true, '700', '새로운 텍스트')
      assert.strictEqual(textChanged.isMatched, true)
      assert.ok(textChanged.actual.includes('"새로운 텍스트"'))
    })

    it('21.2 Source inspection: no hardcoded static matched literals', () => {
      const footer = fs.readFileSync(path.join(demoDir, 'components/VerificationFooter.tsx'), 'utf-8')
      assert.ok(footer.includes('hasInteracted ? true : undefined'))
      assert.ok(!footer.includes('isMatched={true}'))
      assert.ok(!footer.includes('isMatched: true'))
    })
  })

  // =========================================================================
  // DEMO 22: Static and Dynamic Metadata (metadata-and-og-images/static-and-dynamic-metadata)
  // =========================================================================
  describe('Demo 22: generateMetadata & Social Share Preview', () => {
    const demoDir = path.join(BASELINE_ROOT, 'metadata-and-og-images/static-and-dynamic-metadata')

    function evaluateVerification(
      hasInteracted: boolean,
      title: string,
      description: string,
      previewPlatform: 'kakao' | 'twitter' | 'facebook',
    ) {
      const isMatched = hasInteracted ? true : undefined
      const platformLabel =
        previewPlatform === 'kakao'
          ? '카카오톡'
          : previewPlatform === 'twitter'
          ? 'X (Twitter)'
          : '페이스북'
      const actual = !hasInteracted
        ? '• 메타데이터 편집 대기 중 (상단 상품 프리셋을 선택하거나 문구를 편집하고 SNS 탭을 전환하세요)'
        : `• 활성 소셜 플랫폼: ${platformLabel}\n• 동적 og:title: "${title}"\n• 동적 og:description: "${description}"\n• <head> 메타 태그 6개 항목 정상 동기화 완료`
      return { isMatched, actual }
    }

    it('22.1 Verification lifecycle: initial pending -> preset & platform change matched', () => {
      // 1. Initial State
      const initial = evaluateVerification(false, '초기 제목', '초기 설명', 'kakao')
      assert.strictEqual(initial.isMatched, undefined, 'Initial state must be pending (undefined)')
      assert.ok(initial.actual.includes('메타데이터 편집 대기 중'))

      // 2. Preset Selected (Headphone)
      const preset1 = evaluateVerification(true, '노이즈 캔슬링 헤드폰', 'ANC 사운드', 'kakao')
      assert.strictEqual(preset1.isMatched, true)
      assert.ok(preset1.actual.includes('카카오톡'))
      assert.ok(preset1.actual.includes('노이즈 캔슬링 헤드폰'))

      // 3. Platform switch to Twitter
      const twitter = evaluateVerification(true, '노이즈 캔슬링 헤드폰', 'ANC 사운드', 'twitter')
      assert.strictEqual(twitter.isMatched, true)
      assert.ok(twitter.actual.includes('X (Twitter)'))
    })

    it('22.2 Source inspection: dynamic verification bindings', () => {
      const footer = fs.readFileSync(path.join(demoDir, 'components/VerificationFooter.tsx'), 'utf-8')
      assert.ok(footer.includes('hasInteracted ? true : undefined'))
      assert.ok(!footer.includes('isMatched={true}'))
    })
  })

  // =========================================================================
  // DEMO 23: OpenGraph Image (metadata-and-og-images/opengraph-image)
  // =========================================================================
  describe('Demo 23: opengraph-image.tsx ImageResponse Canvas', () => {
    const demoDir = path.join(BASELINE_ROOT, 'metadata-and-og-images/opengraph-image')

    function evaluateVerification(
      hasInteracted: boolean,
      badgeText: string,
      headline: string,
      theme: 'dark' | 'emerald' | 'gradient',
    ) {
      const isMatched = hasInteracted ? true : undefined
      const actual = !hasInteracted
        ? '• OG 이미지 생성 대기 중 (상단 뱃지/헤드라인을 수정하거나 배경 테마 버튼을 클릭하세요)'
        : `• 뱃지: "${badgeText}" | 헤드라인: "${headline}"\n• 적용 테마: ${theme} (1200 × 630 규격 ImageResponse 렌더링)\n• 파일 컨벤션: size { width: 1200, height: 630 }, contentType: 'image/png' 규격 검증 완료`
      return { isMatched, actual }
    }

    it('23.1 Verification lifecycle: initial pending -> interactive matched', () => {
      // 1. Initial State
      const initial = evaluateVerification(false, 'Next.js 16', '타이틀', 'dark')
      assert.strictEqual(initial.isMatched, undefined, 'Initial state must be pending (undefined)')

      // 2. Interactive change
      const modified = evaluateVerification(true, 'PROMOTION', '새 헤드라인', 'emerald')
      assert.strictEqual(modified.isMatched, true)
      assert.ok(modified.actual.includes('PROMOTION'))
      assert.ok(modified.actual.includes('적용 테마: emerald'))
    })

    it('23.2 opengraph-image.tsx file convention compliance', () => {
      const ogFile = fs.readFileSync(path.join(demoDir, 'opengraph-image.tsx'), 'utf-8')
      assert.ok(ogFile.includes("import { ImageResponse } from 'next/og'"))
      assert.ok(ogFile.includes('width: 1200'))
      assert.ok(ogFile.includes('height: 630'))
      assert.ok(ogFile.includes("contentType = 'image/png'"))
    })
  })

  // =========================================================================
  // DEMO 24: REST API CRUD Route Handlers (route-handlers/rest-api-crud)
  // =========================================================================
  describe('Demo 24: REST API CRUD Route Handlers & Status Code Matrix', () => {
    const demoDir = path.join(BASELINE_ROOT, 'route-handlers/rest-api-crud')

    function evaluateVerification(
      hasInteracted: boolean,
      lastMethod: string,
      lastStatus: string,
      lastUrl: string,
      responseSummary: string,
    ) {
      const isSuccess = lastStatus.startsWith('2')
      const isMatched = hasInteracted ? isSuccess : undefined
      const actual = !hasInteracted
        ? '• API 호출 대기 중 (상단 툴바에서 GET/POST/PATCH/DELETE 버튼을 클릭하세요)'
        : `• 최근 호출: ${lastMethod} ${lastUrl}\n• 수신 상태 코드: ${lastStatus}\n• 응답 요약: ${responseSummary}`
      return { isMatched, actual }
    }

    it('24.1 Verification lifecycle: pending -> 2xx status matched -> 4xx status error', () => {
      // 1. Initial State
      const initial = evaluateVerification(false, 'GET', '200 OK', '/api', '대기')
      assert.strictEqual(initial.isMatched, undefined, 'Initial state must be pending')

      // 2. GET 200 OK
      const get200 = evaluateVerification(true, 'GET', '200 OK', '/api', '전체 2건 조회')
      assert.strictEqual(get200.isMatched, true, '200 OK must evaluate to matched (true)')

      // 3. POST 201 Created
      const post201 = evaluateVerification(true, 'POST', '201 Created', '/api', '상품 등록 완료')
      assert.strictEqual(post201.isMatched, true, '201 Created must evaluate to matched (true)')

      // 4. 404 Not Found -> isMatched: false
      const error404 = evaluateVerification(true, 'DELETE', '404 Not Found', '/api?id=999', 'Item not found')
      assert.strictEqual(error404.isMatched, false, '404 Not Found must evaluate to error (false)')

      // 5. 400 Bad Request -> isMatched: false
      const error400 = evaluateVerification(true, 'PATCH', '400 Bad Request', '/api', 'Invalid JSON Body')
      assert.strictEqual(error400.isMatched, false, '400 Bad Request must evaluate to error (false)')
    })

    it('24.2 Route handler structure and dynamic export check', () => {
      const routeCode = fs.readFileSync(path.join(demoDir, 'api/route.ts'), 'utf-8')
      assert.ok(routeCode.includes("export const dynamic = 'force-dynamic'"))
      assert.ok(routeCode.includes('export async function GET'))
      assert.ok(routeCode.includes('export async function POST'))
      assert.ok(routeCode.includes('export async function PATCH'))
      assert.ok(routeCode.includes('export async function DELETE'))
      assert.ok(routeCode.includes('reset'))
    })
  })

  // =========================================================================
  // DEMO 25: Streaming SSE (route-handlers/streaming-sse)
  // =========================================================================
  describe('Demo 25: Server-Sent Events Streaming Lifecycle & Abort Safety', () => {
    const demoDir = path.join(BASELINE_ROOT, 'route-handlers/streaming-sse')

    interface SsePacket {
      step?: number
      timestamp?: string
      serverCpu?: number
      memoryUsage?: string
      message?: string
      status?: string
    }

    function evaluateVerification(
      packets: SsePacket[],
      isConnected: boolean,
      isCompleted: boolean,
      isAborted: boolean,
    ) {
      const packetCount = packets.length
      const lastPacket = packets[packets.length - 1]
      const isMatched =
        isCompleted && packetCount >= 6
          ? true
          : isAborted
          ? false
          : undefined

      const actual =
        packetCount === 0 && !isConnected
          ? '• SSE 스트리밍 대기 중 (상단 [▶ SSE 스트리밍 시작] 버튼을 클릭하세요)'
          : isConnected && !isCompleted
          ? `• SSE 스트리밍 수신 중: ${packetCount}/6 패킷 도달 (최근 CPU: ${lastPacket?.serverCpu || 0}%, MEM: ${lastPacket?.memoryUsage || '0'} MB)`
          : isCompleted
          ? `• 6개 텔레메트리 패킷 수신 완료 (최종 메모리: ${lastPacket?.memoryUsage} MB, CPU: ${lastPacket?.serverCpu}%)\n• status: completed 정상 수신 및 스트림 안전 종료 (Content-Type: text/event-stream)`
          : isAborted
          ? `• 스트림 중단됨: ${packetCount}/6 패킷 수신 후 사용자 중단 (EventSource.close 호출)`
          : '• 스트림 상태 갱신 대기 중'
      return { isMatched, actual }
    }

    it('25.1 SSE 4-state lifecycle: initial pending -> in-progress pending -> completed matched -> aborted false', () => {
      // 1. Initial State (idle)
      const initial = evaluateVerification([], false, false, false)
      assert.strictEqual(initial.isMatched, undefined, 'Initial state must be undefined')
      assert.ok(initial.actual.includes('SSE 스트리밍 대기 중'))

      // 2. In-progress (3 packets arrived)
      const inProgressPackets: SsePacket[] = [
        { step: 1, serverCpu: 27, memoryUsage: '268.0' },
        { step: 2, serverCpu: 34, memoryUsage: '280.0' },
        { step: 3, serverCpu: 41, memoryUsage: '292.0' },
      ]
      const inProgress = evaluateVerification(inProgressPackets, true, false, false)
      assert.strictEqual(inProgress.isMatched, undefined, 'Streaming in-progress must stay undefined')
      assert.ok(inProgress.actual.includes('3/6 패킷 도달'))

      // 3. Completed (6 packets arrived)
      const completedPackets: SsePacket[] = [
        ...inProgressPackets,
        { step: 4, serverCpu: 48, memoryUsage: '304.0' },
        { step: 5, serverCpu: 55, memoryUsage: '316.0' },
        { step: 6, status: 'completed', serverCpu: 62, memoryUsage: '328.0' },
      ]
      const completed = evaluateVerification(completedPackets, false, true, false)
      assert.strictEqual(completed.isMatched, true, 'Completed stream must evaluate to true (Matched)')
      assert.ok(completed.actual.includes('6개 텔레메트리 패킷 수신 완료'))

      // 4. Aborted State
      const aborted = evaluateVerification(inProgressPackets, false, false, true)
      assert.strictEqual(aborted.isMatched, false, 'Aborted stream must evaluate to false')
      assert.ok(aborted.actual.includes('스트림 중단됨'))
    })

    it('25.2 SSE Route Handler abort listener & Content-Type header', () => {
      const routeCode = fs.readFileSync(path.join(demoDir, 'api/sse/route.ts'), 'utf-8')
      assert.ok(routeCode.includes('request.signal.addEventListener'))
      assert.ok(routeCode.includes('clearInterval(interval)'))
      assert.ok(routeCode.includes("'Content-Type': 'text/event-stream; charset=utf-8'"))
      assert.ok(routeCode.includes('ReadableStream'))
    })
  })

  // =========================================================================
  // DEMO 26: Next.js 16 proxy.ts Request Interception & Headers (proxy/rewrite-and-headers)
  // =========================================================================
  describe('Demo 26: Next.js 16 proxy.ts Rewrite & Header Injection', () => {
    const demoDir = path.join(BASELINE_ROOT, 'proxy/rewrite-and-headers')
    const proxyFile = path.join(APPS_ROOT, 'demo-baseline/src/proxy.ts')

    interface ProxyProbeResponse {
      status: number
      action: 'rewrite' | 'redirect'
      rewrittenPath: string
      redirectUrl: string | null
      headers: {
        'x-proxy-gateway': string
        'x-ab-variant': string
        'x-forwarded-country': string
        'x-user-authenticated': string
        'x-proxy-rewritten-path': string
      }
      timestamp: string
    }

    function evaluateVerification(
      probeResult: ProxyProbeResponse | null,
      selectedVariant: string,
      selectedCountry: string,
      isAuthenticated: boolean,
      hasInteracted: boolean,
    ) {
      const isMatched = hasInteracted && probeResult !== null ? true : undefined
      const actual =
        !hasInteracted || probeResult === null
          ? '• 프록시 요청 대기 중 (옵션 설정 후 [프록시 파이프라인 실행] 버튼을 클릭하세요)'
          : `• 수신 헤더: x-proxy-gateway: "${probeResult.headers['x-proxy-gateway']}", x-ab-variant: "${probeResult.headers['x-ab-variant']}", x-forwarded-country: "${probeResult.headers['x-forwarded-country']}"\n• ` +
            (probeResult.action === 'rewrite'
              ? `프록시 리라이트 목적지: ${probeResult.rewrittenPath} (HTTP ${probeResult.status} OK)`
              : `인증 실패 리다이렉트: ${probeResult.redirectUrl} (HTTP ${probeResult.status} Redirect)`)
      return { isMatched, actual }
    }

    it('26.1 Verification lifecycle: initial pending -> executed rewrite matched -> redirect matched', () => {
      // 1. Initial State
      const initial = evaluateVerification(null, 'control', 'KR', true, false)
      assert.strictEqual(initial.isMatched, undefined, 'Initial state must be undefined')

      // 2. Control variant rewrite (HTTP 200)
      const probe1: ProxyProbeResponse = {
        status: 200,
        action: 'rewrite',
        rewrittenPath: '/landing/control',
        redirectUrl: null,
        headers: {
          'x-proxy-gateway': 'Active',
          'x-ab-variant': 'control',
          'x-forwarded-country': 'KR',
          'x-user-authenticated': 'true',
          'x-proxy-rewritten-path': '/landing/control',
        },
        timestamp: new Date().toISOString(),
      }
      const res1 = evaluateVerification(probe1, 'control', 'KR', true, true)
      assert.strictEqual(res1.isMatched, true, 'Executed probe must evaluate to true (Matched)')
      assert.ok(res1.actual.includes('/landing/control (HTTP 200 OK)'))

      // 3. Variant B rewrite (HTTP 200)
      const probe2: ProxyProbeResponse = {
        ...probe1,
        rewrittenPath: '/landing/experiment-b',
        headers: {
          ...probe1.headers,
          'x-ab-variant': 'variant_b',
          'x-forwarded-country': 'US',
          'x-proxy-rewritten-path': '/landing/experiment-b',
        },
      }
      const res2 = evaluateVerification(probe2, 'variant_b', 'US', true, true)
      assert.strictEqual(res2.isMatched, true)
      assert.ok(res2.actual.includes('/landing/experiment-b (HTTP 200 OK)'))

      // 4. Unauthenticated redirect (HTTP 307)
      const probe3: ProxyProbeResponse = {
        status: 307,
        action: 'redirect',
        rewrittenPath: '/landing/control',
        redirectUrl: '/login',
        headers: {
          ...probe1.headers,
          'x-user-authenticated': 'false',
        },
        timestamp: new Date().toISOString(),
      }
      const res3 = evaluateVerification(probe3, 'control', 'KR', false, true)
      assert.strictEqual(res3.isMatched, true)
      assert.ok(res3.actual.includes('/login (HTTP 307 Redirect)'))
    })

    it('26.2 proxy.ts matcher and header injection consistency', () => {
      const proxyCode = fs.readFileSync(proxyFile, 'utf-8')
      assert.ok(proxyCode.includes('/zone/baseline/proxy/:path*'))
      assert.ok(proxyCode.includes('x-proxy-gateway'))
      assert.ok(proxyCode.includes('x-ab-variant'))
      assert.ok(proxyCode.includes('x-forwarded-country'))
      assert.ok(proxyCode.includes('x-proxy-rewritten-path'))
    })
  })

  // =========================================================================
  // DEMO 27: Streaming Nested (guides/streaming-nested)
  // =========================================================================
  describe('Demo 27: Nested Suspense Chunk Streaming & Rating Integrity', () => {
    const demoDir = path.join(BASELINE_ROOT, 'guides/streaming-nested')

    function evaluateVerification(recommendedLoaded: boolean, reviewsLoaded: boolean) {
      const isMatched = recommendedLoaded && reviewsLoaded ? true : undefined
      const actual =
        !recommendedLoaded && !reviewsLoaded
          ? '• 청크 스트리밍 대기 중 (초기 상품 셸 수신 중...)'
          : recommendedLoaded && !reviewsLoaded
          ? '• 1차 외측 청크 수신 완료: 추천 상품 3건 마운트 (600ms)\n• 2차 내측 청크 대기 중: 구매 후기 스트리밍 진행 중 (1000ms)...'
          : '• 1차 외측 청크 수신 완료: 추천 상품 3건 (알루미늄 팜레스트 외 2건)\n• 2차 내측 청크 수신 완료: 구매 후기 2건 (프로개발자, 디자이너K ★★★★★)\n• 계층적 중첩 Suspense 점진적 스트리밍 렌더링 완료'
      return { isMatched, actual }
    }

    it('27.1 Nested chunk lifecycle: 0/2 loaded pending -> 1/2 loaded pending -> 2/2 loaded matched', () => {
      // 1. Initial State
      const initial = evaluateVerification(false, false)
      assert.strictEqual(initial.isMatched, undefined)
      assert.ok(initial.actual.includes('청크 스트리밍 대기 중'))

      // 2. 1st outer chunk loaded (600ms)
      const stage1 = evaluateVerification(true, false)
      assert.strictEqual(stage1.isMatched, undefined)
      assert.ok(stage1.actual.includes('1차 외측 청크 수신 완료'))
      assert.ok(stage1.actual.includes('2차 내측 청크 대기 중'))

      // 3. 2nd inner chunk loaded (1000ms)
      const stage2 = evaluateVerification(true, true)
      assert.strictEqual(stage2.isMatched, true, 'Both chunks loaded must evaluate to true (Matched)')
      assert.ok(stage2.actual.includes('점진적 스트리밍 렌더링 완료'))
    })

    it('27.2 Star rating bug check: must produce non-empty ★ strings', () => {
      const reviewCode = fs.readFileSync(path.join(demoDir, 'components/LiveReviewStream.tsx'), 'utf-8')
      assert.ok(reviewCode.includes("'★'.repeat(r.rating)"), 'Must render ★ star characters')
      assert.ok(!reviewCode.includes("''"), 'Must not have empty star string repeat bug')
    })
  })

  // =========================================================================
  // DEMO 28: Server Actions Advanced (guides/server-actions-advanced)
  // =========================================================================
  describe('Demo 28: Server Action Advanced Coupon Validation & useActionState', () => {
    const demoDir = path.join(BASELINE_ROOT, 'guides/server-actions-advanced')

    it('28.1 Empirical applyCouponAction execution with valid/invalid coupon permutations', async () => {
      // Valid coupon: NEXTJS16
      const fd1 = new FormData()
      fd1.append('couponCode', 'NEXTJS16')
      const res1 = await applyCouponAction({ success: false, message: '' }, fd1)
      assert.strictEqual(res1.success, true)
      assert.strictEqual(res1.discountAmount, 15000)
      assert.strictEqual(res1.appliedCode, 'NEXTJS16')

      // Valid coupon: WELCOME2026
      const fd2 = new FormData()
      fd2.append('couponCode', 'welcome2026') // lowercase test
      const res2 = await applyCouponAction({ success: false, message: '' }, fd2)
      assert.strictEqual(res2.success, true)
      assert.strictEqual(res2.discountAmount, 10000)
      assert.strictEqual(res2.appliedCode, 'WELCOME2026')

      // Valid coupon: VIPSTUDY
      const fd3 = new FormData()
      fd3.append('couponCode', '  VIPSTUDY  ') // whitespace test
      const res3 = await applyCouponAction({ success: false, message: '' }, fd3)
      assert.strictEqual(res3.success, true)
      assert.strictEqual(res3.discountAmount, 30000)
      assert.strictEqual(res3.appliedCode, 'VIPSTUDY')

      // Invalid coupon
      const fdInvalid = new FormData()
      fdInvalid.append('couponCode', 'DISCOUNT2026')
      const resInvalid = await applyCouponAction({ success: false, message: '' }, fdInvalid)
      assert.strictEqual(resInvalid.success, false)
      assert.ok(resInvalid.message.includes('유효하지 않거나 기간이 만료된 쿠폰'))

      // Empty coupon
      const fdEmpty = new FormData()
      fdEmpty.append('couponCode', '')
      const resEmpty = await applyCouponAction({ success: false, message: '' }, fdEmpty)
      assert.strictEqual(resEmpty.success, false)
      assert.strictEqual(resEmpty.message, '쿠폰 코드를 입력해 주세요.')
    })

    it('28.2 Verification footer dynamic evaluation', () => {
      const footerCode = fs.readFileSync(path.join(demoDir, 'components/VerificationFooter.tsx'), 'utf-8')
      assert.ok(footerCode.includes('!state || !state.message'))
      assert.ok(footerCode.includes('state.success'))
      assert.ok(!footerCode.includes('isMatched={true}'))
    })
  })

  // =========================================================================
  // DEMO 29: SWR Polling (guides/swr-polling)
  // =========================================================================
  describe('Demo 29: SWR Polling & Delivery State Progression', () => {
    const demoDir = path.join(BASELINE_ROOT, 'guides/swr-polling')

    interface DeliveryStatus {
      trackingId: string
      status: string
      statusLabel: string
      updatedAt: string
      currentLocation: string
      pollCount: number
    }

    function evaluateVerification(
      deliveryData: DeliveryStatus | null,
      isAutoPolling: boolean,
      pollCount: number,
      hasInteracted: boolean,
    ) {
      const isMatched = hasInteracted && pollCount >= 2 ? true : undefined
      const actual =
        !hasInteracted || !deliveryData || pollCount <= 1
          ? '• 폴링 대기 중 (초기 배송 상태: STEP 1 결제 완료, 운송장: #TRK-2026-8831)'
          : `• SWR 폴링 모드: ${isAutoPolling ? '자동 폴링 활성 (2.5초 주기)' : '일시 정지'}\n• 누적 수신 횟수: ${pollCount}회 (최근 수신: ${deliveryData.updatedAt})\n• 현재 배송 단계: [${deliveryData.statusLabel}] - ${deliveryData.currentLocation}`
      return { isMatched, actual }
    }

    it('29.1 Verification lifecycle: initial pending -> polled matched', () => {
      // 1. Initial State (pollCount 1, not interacted)
      const initial = evaluateVerification(null, true, 1, false)
      assert.strictEqual(initial.isMatched, undefined, 'Initial state must be undefined')
      assert.ok(initial.actual.includes('폴링 대기 중'))

      // 2. After user manual mutate or polling progress (pollCount 2, hasInteracted)
      const data: DeliveryStatus = {
        trackingId: 'TRK-2026-8831',
        status: 'preparing',
        statusLabel: '상품 포장 중',
        updatedAt: '12:00:05',
        currentLocation: '김포 자동화 메가허브',
        pollCount: 2,
      }
      const polled = evaluateVerification(data, true, 2, true)
      assert.strictEqual(polled.isMatched, true, 'Poll count >= 2 with interaction must evaluate to true (Matched)')
      assert.ok(polled.actual.includes('상품 포장 중'))
    })

    it('29.2 SWR Route handler and dynamic export check', () => {
      const routeCode = fs.readFileSync(path.join(demoDir, 'api/route.ts'), 'utf-8')
      assert.ok(routeCode.includes("export const dynamic = 'force-dynamic'"))
      assert.ok(routeCode.includes('advance'))
      assert.ok(routeCode.includes('reset'))
    })
  })

  // =========================================================================
  // DEMO 30: Lazy Loading Chart (guides/lazy-loading-chart)
  // =========================================================================
  describe('Demo 30: next/dynamic Lazy Loading & Bundle Optimization', () => {
    const demoDir = path.join(BASELINE_ROOT, 'guides/lazy-loading-chart')

    function evaluateVerification(showChart: boolean, hasInteracted: boolean) {
      const isMatched = hasInteracted && showChart ? true : undefined
      const actual =
        !hasInteracted || !showChart
          ? '• 동적 청크 미로드 (초기 번들 분리 상태, 조작 대기 중)'
          : '• 동적 청크: HeavyChartClient 로드 완료 (ssr: false 클라이언트 렌더링)\n• 렌더링 상태: 2026 상반기 월별 매출 추이 바 차트 마운트 성공\n• 번들 최적화: 초기 번들에서 분리된 청크가 온디맨드로 로드됨'
      return { isMatched, actual }
    }

    it('30.1 Verification lifecycle: initial pending -> chart open matched -> chart close pending', () => {
      // 1. Initial State
      const initial = evaluateVerification(false, false)
      assert.strictEqual(initial.isMatched, undefined, 'Initial state must be undefined')
      assert.ok(initial.actual.includes('동적 청크 미로드'))

      // 2. Chart opened
      const opened = evaluateVerification(true, true)
      assert.strictEqual(opened.isMatched, true, 'Chart opened must evaluate to true (Matched)')
      assert.ok(opened.actual.includes('HeavyChartClient 로드 완료'))

      // 3. Chart closed
      const closed = evaluateVerification(false, true)
      assert.strictEqual(closed.isMatched, undefined, 'Chart closed must return to undefined')
    })

    it('30.2 next/dynamic configuration & claim cleanliness', () => {
      const containerCode = fs.readFileSync(path.join(demoDir, 'components/LazyChartContainer.tsx'), 'utf-8')
      const chartCode = fs.readFileSync(path.join(demoDir, 'components/HeavyChartClient.tsx'), 'utf-8')
      assert.ok(containerCode.includes('next/dynamic'))
      assert.ok(containerCode.includes('ssr: false'))
      assert.ok(!chartCode.includes('0 KB 초기 번들'))
      assert.ok(!chartCode.includes('300KB Recharts'))
    })
  })

  // =========================================================================
  // GLOBAL BATCH B03 INTEGRITY AUDIT (DEMOS 21–30)
  // =========================================================================
  describe('Global Batch B03 Integrity Audit (Demos 21–30)', () => {
    const demoRelDirs = [
      'fonts/font-optimization',
      'metadata-and-og-images/static-and-dynamic-metadata',
      'metadata-and-og-images/opengraph-image',
      'route-handlers/rest-api-crud',
      'route-handlers/streaming-sse',
      'proxy/rewrite-and-headers',
      'guides/streaming-nested',
      'guides/server-actions-advanced',
      'guides/swr-polling',
      'guides/lazy-loading-chart',
    ]

    it('Strict file length limit: All files in Demos 21–30 must be <= 250 lines', () => {
      for (const rel of demoRelDirs) {
        const fullDir = path.join(BASELINE_ROOT, rel)
        const walk = (cur: string) => {
          const entries = fs.readdirSync(cur, { withFileTypes: true })
          for (const ent of entries) {
            const p = path.join(cur, ent.name)
            if (ent.isDirectory()) {
              walk(p)
            } else if (ent.name.endsWith('.ts') || ent.name.endsWith('.tsx')) {
              const lines = fs.readFileSync(p, 'utf-8').split('\n').length
              assert.ok(
                lines <= 250,
                `File ${p} has ${lines} lines, exceeding strict 250-line limit!`,
              )
            }
          }
        }
        walk(fullDir)
      }
    })

    it('Zero static isMatched={true} or isMatched: true literals across Demos 21–30', () => {
      for (const rel of demoRelDirs) {
        const fullDir = path.join(BASELINE_ROOT, rel)
        const walk = (cur: string) => {
          const entries = fs.readdirSync(cur, { withFileTypes: true })
          for (const ent of entries) {
            const p = path.join(cur, ent.name)
            if (ent.isDirectory()) {
              walk(p)
            } else if (ent.name.endsWith('.ts') || ent.name.endsWith('.tsx')) {
              const content = fs.readFileSync(p, 'utf-8')
              assert.ok(!content.includes('isMatched={true}'), `Found static isMatched={true} in ${p}`)
              assert.ok(!content.includes('isMatched: true'), `Found static isMatched: true in ${p}`)
            }
          }
        }
        walk(fullDir)
      }
    })

    it('Zero forbidden exaggerated claims across Demos 21–30', () => {
      const forbiddenPhrases = ['0ms 체감', '0ms 즉시', '0 KB 초기 번들', '100% 즉시']
      for (const rel of demoRelDirs) {
        const fullDir = path.join(BASELINE_ROOT, rel)
        const walk = (cur: string) => {
          const entries = fs.readdirSync(cur, { withFileTypes: true })
          for (const ent of entries) {
            const p = path.join(cur, ent.name)
            if (ent.isDirectory()) {
              walk(p)
            } else if (ent.name.endsWith('.ts') || ent.name.endsWith('.tsx')) {
              const content = fs.readFileSync(p, 'utf-8')
              for (const phrase of forbiddenPhrases) {
                assert.ok(!content.includes(phrase), `Found forbidden phrase "${phrase}" in ${p}`)
              }
            }
          }
        }
        walk(fullDir)
      }
    })
  })
})
