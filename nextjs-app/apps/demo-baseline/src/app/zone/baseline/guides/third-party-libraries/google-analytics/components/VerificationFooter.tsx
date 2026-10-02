import React from 'react'
import { ExpectedActualPanel } from '@study/demo-kit'
import { isDemoEventPushed, isDomAsDocumented } from '../lib/measure'
import { DEMO_EVENT_NAME, GA_SCRIPT_SRC } from '../types'
import type { GaLabState } from '../hooks/useGaLab'
import { GaDeepDive } from './GaDeepDive'

export function VerificationFooter({ lab }: { lab: GaLabState }) {
  const { mounted, snapshot: s, push, load, gaRequestsAtEntry } = lab
  const domOk = isDomAsDocumented(s)
  const pushOk = push ? isDemoEventPushed(push) : false
  const noCollect = s?.collectRequests === 0

  // 대기(undefined): sendGAEvent를 아직 누르지 않음. 렌더 전 호출은 push가 0건이므로 불일치로 판정된다.
  let isMatched: boolean | undefined
  let actual = '• 대기 중: 위 실습에서 GoogleAnalytics를 렌더한 뒤 sendGAEvent를 호출해 주세요.'
  if (push?.phase === 'before-mount') {
    isMatched = false
    actual = `• 렌더 전 호출: dataLayer 길이 ${String(push.before)} → ${String(push.after)}, push ${push.pushed.length}건.\n• GoogleAnalytics가 아직 렌더되지 않아 sendGAEvent가 경고만 남기고 아무것도 넣지 않았습니다(콘솔 경고 확인).`
  } else if (push && mounted) {
    isMatched = domOk && pushOk && noCollect
    actual = [
      `• 스크립트 태그: ${domOk ? `_next-ga-init(gtag config 포함) + _next-ga(src=${s?.extScriptSrc}, data-nscript=${s?.extStrategy})` : '문서와 다름(아래 실습 화면 값 확인)'}`,
      `• window.gtag: ${s?.gtagType}, dataLayer 명령: [${s?.commands.join(', ')}]`,
      `• sendGAEvent: 길이 ${String(push.before)} → ${String(push.after)}, ${pushOk ? `'${DEMO_EVENT_NAME}' 항목과 파라미터 일치` : '기대 항목 없음 또는 파라미터 불일치'}`,
      `• collect 요청 ${s?.collectRequests ?? '-'}건 · 진입 시 GA 요청 ${gaRequestsAtEntry ?? '-'}건`,
      `• (판정 제외) gtag.js 외부 로드: ${load}`,
    ].join('\n')
  }

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="GoogleAnalytics 렌더 결과와 sendGAEvent push 검증"
        expected={
          <span>
            {`• <script id="_next-ga-init">에 gtag('config', ID)가 있고, <script id="_next-ga" src="${GA_SCRIPT_SRC}" data-nscript="afterInteractive">가 body에 붙는다.\n`}
            {'• window.gtag는 function, dataLayer에 js·config 명령이 들어 있다.\n'}
            {`• sendGAEvent 1회 호출 → dataLayer 길이 +1, 항목 ['event', '${DEMO_EVENT_NAME}', {…}]\n`}
            {'• collect(측정 전송) 요청 0건'}
          </span>
        }
        actual={<span>{actual}</span>}
        isMatched={isMatched}
        description="판정은 DOM의 스크립트 태그와 dataLayer 길이 증가분으로만 합니다. 외부 gtag.js 로드 성공 여부는 네트워크에 달려 있어 판정에서 빼고 따로 표시합니다(오프라인에서도 push 판정은 성립)."
      />
      <GaDeepDive />
    </div>
  )
}
