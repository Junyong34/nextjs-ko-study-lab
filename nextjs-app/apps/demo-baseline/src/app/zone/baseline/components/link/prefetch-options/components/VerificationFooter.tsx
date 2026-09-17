'use client'

import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import type { PrefetchResourceEntry, PrefetchVariant, VariantConfig } from '../types'

export interface VerificationFooterProps {
  variants: VariantConfig[]
  entries: PrefetchResourceEntry[]
  seen: Record<PrefetchVariant, boolean>
}

const IS_PRODUCTION_BUILD = process.env.NODE_ENV === 'production'

function statsFor(entries: PrefetchResourceEntry[], variant: PrefetchVariant) {
  const matched = entries.filter((e) => e.variant === variant)
  const lastTransferSize = matched.length > 0 ? matched[matched.length - 1].transferSize : null
  return { count: matched.length, lastTransferSize }
}

function formatExpected() {
  if (!IS_PRODUCTION_BUILD) {
    return (
      '• 현재 빌드: development\n' +
      '• 뷰포트 진입 시 prefetch 요청: 0건 (auto/full/false 모두 동일)\n' +
      '  근거: Next.js는 dev 모드에서 뷰포트 기반 prefetch를 아예 실행하지 않습니다\n' +
      '  (컴파일 비용 때문 — next/dist/client/components/links.js의 명시적 분기).'
    )
  }
  return (
    '• 현재 빌드: production\n' +
    '• auto(prefetch 미지정): 요청 1건, loading.tsx 경계까지만 = 작은 페이로드\n' +
    '• full(prefetch={true}): 요청 1건, 동적 데이터 포함 전체 렌더 = auto보다 큰 페이로드\n' +
    '• false(prefetch={false}): 요청 0건 (호버해도 발생하지 않음)'
  )
}

function formatActual(
  variants: VariantConfig[],
  entries: PrefetchResourceEntry[],
  seen: Record<PrefetchVariant, boolean>,
) {
  const allSeen = variants.every((v) => seen[v.key])
  if (!allSeen) {
    return '• 대기 중 — 실습 화면에서 링크 3개를 모두 스크롤해 뷰포트에 진입시켜 주세요.'
  }
  return variants
    .map((v) => {
      const { count, lastTransferSize } = statsFor(entries, v.key)
      const sizeText = lastTransferSize === null ? '' : ` · transferSize ${lastTransferSize}B`
      return `• ${v.key} (${v.badge}): 요청 ${count}건${sizeText}`
    })
    .join('\n')
}

function computeIsMatched(
  variants: VariantConfig[],
  entries: PrefetchResourceEntry[],
  seen: Record<PrefetchVariant, boolean>,
): boolean | undefined {
  const allSeen = variants.every((v) => seen[v.key])
  if (!allSeen) return undefined

  const auto = statsFor(entries, 'auto')
  const full = statsFor(entries, 'full')
  const falseVariant = statsFor(entries, 'false')

  if (!IS_PRODUCTION_BUILD) {
    return auto.count === 0 && full.count === 0 && falseVariant.count === 0
  }

  const countsMatch = auto.count === 1 && full.count === 1 && falseVariant.count === 0
  if (!countsMatch) return false
  if (auto.lastTransferSize !== null && full.lastTransferSize !== null) {
    return full.lastTransferSize > auto.lastTransferSize
  }
  return true
}

export function VerificationFooter({ variants, entries, seen }: VerificationFooterProps) {
  const isMatched = computeIsMatched(variants, entries, seen)

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="prefetch 옵션별 실제 네트워크 요청 로그 (performance resource timing)"
        expected={formatExpected()}
        actual={formatActual(variants, entries, seen)}
        isMatched={isMatched}
        description="Expected는 Next.js 공식 문서(Link#prefetch, guides/prefetching)가 명시한 빌드 모드별 기대 동작이고, Actual은 PerformanceObserver('resource')가 지금 이 브라우저에서 실제로 잡아낸 요청입니다."
      />
      <DemoDeepDiveCard title="<Link prefetch> auto vs full vs false — 실제로 무엇이 오가는가">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">1. 세 값의 실제 차이</h5>
            <p>
              공식 문서(<code>api-reference/components/link.mdx#prefetch</code>)는 <code>&quot;auto&quot; 또는 null</code>
              (기본값)을 &quot;정적 라우트면 전체, 동적 라우트면 가장 가까운 <code>loading.js</code> 경계까지만&quot;
              prefetch한다고 명시합니다. <code>true</code>는 정적/동적 여부와 상관없이 <strong>항상 전체 라우트</strong>를
              가져오며, 동적 라우트라면 서버가 그 순간 실제로 렌더링을 수행합니다. <code>false</code>는 뷰포트 진입과
              호버 양쪽 모두에서 prefetch를 완전히 차단합니다. 이 데모의 대상 라우트(
              <code>target/[variant]</code>)는 <code>export const dynamic = &apos;force-dynamic&apos;</code>으로
              강제 동적화했기 때문에, auto와 full의 차이(부분 vs 전체 payload)가 실제로 드러납니다 — 정적 라우트였다면
              둘 다 전체 prefetch라 차이가 보이지 않습니다.
            </p>
          </div>

          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">2. 뷰포트 기반 prefetch는 production 전용</h5>
            <p>
              공식 문서는 &quot;Prefetching is only enabled in production&quot;이라고 명시하고, Next.js 16.3.2 소스
              (<code>client/components/links.js</code>의 <code>onLinkVisibilityChanged</code>)에도 &quot;Prefetching on
              viewport is disabled in development for performance reasons, because it requires compiling the target
              page&quot;라는 주석과 함께 <code>NODE_ENV !== &apos;production&apos;</code>이면 즉시 return하는 코드가
              있습니다. 호버 prefetch도 같은 파일의 <code>onMouseEnter</code> 핸들러에서 동일하게 dev 모드에 차단됩니다.
              그래서 이 데모를 <code>next dev</code>로 열면 세 링크 모두 요청 0건이 정상이고, <code>next build &amp;&amp;
              next start</code>로 열어야 auto/full/false의 차이가 실제로 관찰됩니다.
            </p>
          </div>

          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">3. 이 데모가 관찰하는 방법</h5>
            <p>
              Next.js의 prefetch 요청은 내부적으로 표준 <code>fetch()</code>를 호출하므로(
              <code>router-reducer/fetch-server-response.js</code>), 브라우저의{' '}
              <code>PerformanceObserver({'{'}type: &apos;resource&apos;{'}'})</code>에 <code>initiatorType: &apos;fetch&apos;</code>
              항목으로 그대로 잡힙니다. 이 데모는 그 리소스 엔트리의 <code>name</code>(URL)으로 어떤 링크의 prefetch인지
              구분하고, <code>transferSize</code>로 실제 전송 바이트를 비교합니다 — 텍스트로 동작을 주장하는 대신 브라우저가
              만든 진짜 네트워크 이벤트를 그대로 보여줍니다.
            </p>
          </div>

          <div>
            <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">4. 실무 팁 — false를 쓰는 이유</h5>
            <ul className="list-disc list-inside space-y-1 pl-1 text-zinc-600 dark:text-zinc-400">
              <li>수백 개의 링크가 있는 목록(무한 스크롤 등)에서 auto/true를 그대로 두면 서버 부하와 대역폭이 커집니다.</li>
              <li>
                <code>false</code>로 끄면 정적 라우트는 클릭 시점에만 받고, 동적 라우트는 서버 렌더를 먼저 기다린 뒤
                이동합니다 — 트래픽이 낮은 링크(약관, 푸터)에 적합합니다.
              </li>
              <li>
                완전히 끄지 않고 절충하려면 <code>prefetch={'{'}hovered ? null : false{'}'}</code> 패턴으로 호버 시에만
                prefetch를 켤 수 있습니다(공식 가이드 &quot;Hover-triggered prefetch&quot;).
              </li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
