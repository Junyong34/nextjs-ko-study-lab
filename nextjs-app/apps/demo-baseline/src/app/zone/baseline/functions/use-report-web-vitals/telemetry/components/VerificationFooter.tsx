'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'
import type { WebVitalLogEntry } from '../types'

const RATING_LABEL: Record<string, string> = {
  good: '양호',
  'needs-improvement': '개선 필요',
  poor: '나쁨',
}

export interface VerificationFooterProps {
  logs: WebVitalLogEntry[]
}

export function VerificationFooter({ logs }: VerificationFooterProps) {
  const collectedNames = logs.map((log) => log.metric.name)
  const isMatched = logs.length > 0

  const actualContent = isMatched
    ? logs
        .map(
          (log) =>
            `• ${log.metric.name}: ${log.metric.value.toFixed(1)} (${RATING_LABEL[log.metric.rating] ?? log.metric.rating}, id=${log.metric.id.slice(-6)})`
        )
        .join('\n')
    : '• 아직 콜백이 호출되지 않았습니다. 위 실습 절차(클릭 → 탭 전환 후 복귀)를 따라 해보세요.'

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="useReportWebVitals 콜백 수신 검증"
        expected={
          '• 실습 절차를 따르면 useReportWebVitals(callback)의 callback이\n  브라우저가 실측한 지표(name/value/rating)와 함께 최소 1회 이상 호출된다.'
        }
        actual={actualContent}
        isMatched={isMatched}
        description={`현재까지 수집된 지표: ${logs.length}개 (${collectedNames.join(', ') || '없음'})`}
      />

      <DemoDeepDiveCard title="useReportWebVitals() 실측 원리 및 보고 타이밍">
        <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">1. 핵심 스펙</h5>
            <p>
              <code>useReportWebVitals(callback)</code>(<code>next/web-vitals</code>)는 내부적으로{' '}
              <code>useEffect</code>에서 <code>onCLS</code>/<code>onFID</code>/<code>onLCP</code>/
              <code>onINP</code>/<code>onFCP</code>/<code>onTTFB</code>(모두 브라우저{' '}
              <code>PerformanceObserver</code> 기반 <code>web-vitals</code> 라이브러리 함수이며 Next.js가
              <code>next/dist/compiled/web-vitals</code>로 내장 제공)를 등록해, 각 지표가 확정될 때마다
              같은 <code>callback</code>을 호출합니다. 화면에 보이는 값은 난수나 하드코딩이 아니라 이
              브라우저가 실제로 계산한 값입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">2. 지표별 보고 시점이 다른 이유</h5>
            <p>
              <code>web-vitals</code>는 지표마다 &quot;확정&quot; 조건이 다릅니다. FCP/TTFB는 페이지 로드
              직후 자동으로 보고되지만, LCP는 사용자의 첫 클릭/키 입력 시점에 최종값이 확정되고, CLS/INP는
              기본 옵션(<code>reportAllChanges</code> 미사용)에서 탭이 백그라운드로 전환되는{' '}
              <code>visibilitychange</code> 시점에야 세션 누적값이 계산되어 콜백으로 전달됩니다. 이 실습에서
              위쪽 지표는 바로 뜨고 CLS/INP만 늦게 뜨는 것은 버그가 아니라 이 규격 때문입니다.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">3. 실무 이점</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>실험실 랩 데이터가 아닌 실제 사용자 환경(RUM)의 성능을 그대로 관찰할 수 있습니다.</li>
              <li>Core Web Vitals는 검색 랭킹 신호이므로 지속 모니터링 근거가 됩니다.</li>
              <li>브라우저 Performance API를 직접 다루지 않아도 표준화된 지표를 받을 수 있습니다.</li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">4. 주의사항</h5>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
              <li>
                <strong>콜백 참조 고정</strong>: 공식 문서는 콜백 함수 참조가 바뀌면 중복 보고가 발생할 수
                있다고 안내합니다. 이 데모는 <code>useCallback</code>으로 참조를 고정해 이를 지킵니다.
              </li>
              <li>
                <strong>클라이언트 경계 최소화</strong>: 실무에서는 이 훅만 담은 별도 클라이언트 컴포넌트를
                루트 레이아웃에 삽입하는 것이 권장됩니다. 이 데모는 학습 목적상 실습 화면 안에 직접
                등록했습니다.
              </li>
              <li>
                <strong>실전 전송</strong>: 실제 서비스에서는 <code>navigator.sendBeacon()</code> 또는{' '}
                <code>fetch(url, {'{'} keepalive: true {'}'})</code>로 페이지 이탈 중에도 안전하게 전송합니다.
              </li>
            </ul>
          </div>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
