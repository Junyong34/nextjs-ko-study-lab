import React from 'react'
import { ExpectedActualPanel } from '@study/demo-kit'
import type { LiteEmbedState } from '../hooks/useLiteEmbed'
import type { IframeEmbedState } from '../hooks/useIframeEmbed'
import { YoutubeDeepDive } from './YoutubeDeepDive'

interface Props {
  lite: LiteEmbedState
  control: IframeEmbedState
  entryRequests: number | null
}

export function VerificationFooter({ lite, control, entryRequests }: Props) {
  const { phase, beforeClick: before, live } = lite
  const preClean = (m: typeof live) => m !== null && m.iframes === 0 && m.tally.player === 0

  // 대기: 배치 전·스크립트 로드 중·클릭 전. 클릭 전에 iframe이나 플레이어 요청이 보이면 즉시 불일치.
  let isMatched: boolean | undefined
  let actual = '• 대기 중: [라이트 임베드 배치]를 누른 뒤 포스터를 클릭해 주세요.'
  if (phase === 'loading') actual = '• lite-yt-embed.js(cdn.jsdelivr.net) 로드와 <lite-youtube> 등록을 기다리는 중입니다.'
  if (phase === 'error') {
    actual = '• 판정 불가: 10초 안에 <lite-youtube>가 등록되지 않았습니다. 외부 도메인(cdn.jsdelivr.net)에 접속할 수 없는 환경이면 facade가 동작하지 않아 클릭→iframe 단계도 확인할 수 없습니다.'
  }
  if (phase === 'facade' && live) {
    if (preClean(live)) {
      actual = `• 클릭 전: iframe ${live.iframes}개, 플레이어 요청 ${live.tally.player}건 (facade만 존재).\n• 이제 포스터를 클릭하면 판정합니다.`
    } else {
      isMatched = false
      actual = `• 클릭 전인데 iframe ${live.iframes}개, 플레이어 요청 ${live.tally.player}건이 관측됐습니다.`
    }
  }
  if (phase === 'activated' && before && live) {
    const created = live.iframes >= 1
    if (!created) {
      actual = '• 클릭됨: iframe 생성을 기다리는 중입니다(Safari·모바일은 YouTube API를 먼저 불러와 조금 늦습니다).'
    } else {
      isMatched = preClean(before)
      actual = [
        `• 클릭 전: iframe ${before.iframes}개, 플레이어 요청 ${before.tally.player}건`,
        `• 클릭 후: iframe ${live.iframes}개 (${live.iframeSrc ? new URL(live.iframeSrc).host : '-'}), 플레이어 요청 ${live.tally.player}건`,
      ].join('\n')
    }
  }
  if (control.live) {
    actual += `\n• 대조군 일반 iframe: 배치 즉시 iframe 1개, 플레이어 문서 요청 ${control.live.player}건 (클릭 없음)`
  }
  if (entryRequests !== null) actual += `\n• 페이지 진입 시 YouTube 계열 요청 ${entryRequests}건`

  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title="YouTubeEmbed facade 지연 로드 검증"
        expected={
          <span>
            {'• 배치 직후: <lite-youtube> facade만 있고 <iframe> 0개, 플레이어(youtube-nocookie.com·youtube.com) 요청 0건\n'}
            {'• 포스터 클릭 후: <iframe src="https://www.youtube-nocookie.com/embed/…"> 1개가 생기고 플레이어 요청이 시작된다\n'}
            {'• 대조군 일반 iframe은 클릭 없이 배치 즉시 플레이어 문서를 요청한다'}
          </span>
        }
        actual={<span>{actual}</span>}
        isMatched={isMatched}
        description="DOM의 실제 iframe 수와 performance resource 항목(호스트별)으로 판정합니다. 클릭 전 값은 클릭 순간 캡처 단계에서 고정합니다."
      />
      <YoutubeDeepDive />
    </div>
  )
}
