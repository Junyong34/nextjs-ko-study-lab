'use client'
import React, { useEffect, useState } from 'react'
import { DemoPlaygroundCard, DemoResetButton } from '@study/demo-kit'
import { useLiteEmbed } from '../hooks/useLiteEmbed'
import { useIframeEmbed } from '../hooks/useIframeEmbed'
import { tally } from '../lib/resources'
import { LiteEmbedPanel } from './LiteEmbedPanel'
import { IframeEmbedPanel } from './IframeEmbedPanel'
import { VerificationFooter } from './VerificationFooter'

const isYoutubeHost = (u: URL) => /(^|\.)(youtube\.com|youtube-nocookie\.com|ytimg\.com)$/.test(u.host)

// 실습 화면과 검증 패널이 같은 실측 상태(DOM·performance)를 공유하도록 훅을 한 곳에서 호출한다.
export function YoutubeLab() {
  const lite = useLiteEmbed()
  const control = useIframeEmbed()
  // 페이지 진입(하이드레이션) 시점까지 YouTube 계열 호스트로 나간 요청 수: 자동 로드가 없다는 증거
  const [entryRequests, setEntryRequests] = useState<number | null>(null)
  useEffect(() => {
    setEntryRequests(tally(0, performance.now() + 1, isYoutubeHost).player)
  }, [])

  return (
    <>
      <DemoPlaygroundCard title="YouTubeEmbed facade와 일반 iframe의 요청 시점 비교 / youtube-embed/components/YoutubeLab.tsx">
        <div className="space-y-3 rounded border border-zinc-200 bg-white p-4 text-xs dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <p className="text-zinc-500">
              진입 시 YouTube 계열 요청: <strong>{entryRequests === null ? '측정 중' : `${entryRequests}건`}</strong>. 두 임베드 모두 버튼을 누른 뒤에만 배치되며, 그 전에는 외부 요청이 없습니다.
            </p>
            <DemoResetButton
              label="둘 다 제거"
              onReset={() => {
                lite.reset()
                control.reset()
              }}
            />
          </div>
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            <LiteEmbedPanel lite={lite} />
            <IframeEmbedPanel control={control} />
          </div>
        </div>
      </DemoPlaygroundCard>
      <VerificationFooter lite={lite} control={control} entryRequests={entryRequests} />
    </>
  )
}
