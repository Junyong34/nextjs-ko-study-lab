'use client'

import React, { useState } from 'react'
import Script from 'next/script'
import { DemoPlaygroundCard } from '@study/demo-kit'
import { AssetScanSection } from './AssetScanSection'
import { TrialSection } from './TrialSection'
import { ConfigGuide } from './ConfigGuide'
import { ConceptQuiz } from './ConceptQuiz'
import { VerificationPanels } from './VerificationPanels'
import { useCrossOriginTrials } from '../hooks/useCrossOriginTrials'
import { useConceptQuiz } from '../hooks/useConceptQuiz'
import { content } from '../content'
import { judgeScan, judgeTrials } from '../lib/judge'
import { scanNextAssets } from '../lib/scan'
import { SCRIPT_ID_PREFIX } from '../lib/trials'
import type { AssetScan } from '../types'

export function ConfigCrossOriginDemo() {
  const [scan, setScan] = useState<AssetScan | null>(null)
  const trials = useCrossOriginTrials()
  const quiz = useConceptQuiz(content.questions)

  return (
    <>
      <DemoPlaygroundCard title="crossOrigin 현재 상태 실측과 속성 동작 실측" className="min-w-0">
        <div className="min-w-0 space-y-6 text-sm leading-relaxed">
          <AssetScanSection scan={scan} onScan={() => setScan(scanNextAssets(document))} onReset={() => setScan(null)} />
          <TrialSection
            origin={trials.origin}
            results={trials.results}
            running={trials.running}
            onRunAll={trials.runAll}
            onRun={trials.runTrial}
            onReset={trials.reset}
          />
          <ConfigGuide />
          <ConceptQuiz quiz={quiz} />
        </div>
        {/* 실습 스크립트. lazyOnload는 미리 preload 태그를 만들지 않아 시도마다 요청이 한 번만 나간다. */}
        {trials.mounted.map((item) => (
          <Script
            key={item.key}
            id={`${SCRIPT_ID_PREFIX}${item.key}`}
            src={item.src}
            crossOrigin={item.crossOrigin}
            strategy="lazyOnload"
            onLoad={() => trials.settle(item.key, 'load')}
            onError={() => trials.settle(item.key, 'error')}
          />
        ))}
      </DemoPlaygroundCard>
      <VerificationPanels
        scanVerdict={judgeScan(scan)}
        trialVerdict={judgeTrials(trials.results, trials.origin !== null)}
        quiz={quiz}
      />
    </>
  )
}
