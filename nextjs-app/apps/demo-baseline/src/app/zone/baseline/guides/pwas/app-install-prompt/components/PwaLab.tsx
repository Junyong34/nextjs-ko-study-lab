'use client'
import React from 'react'
import { DemoPlaygroundCard } from '@study/demo-kit'
import { useInstallSignals } from '../hooks/useInstallSignals'
import { useManifestCheck } from '../hooks/useManifestCheck'
import { useServiceWorkerLab } from '../hooks/useServiceWorkerLab'
import { PwaInstallPromptDemo } from './PwaInstallPromptDemo'
import { VerificationFooter } from './VerificationFooter'

// 실습 화면과 검증 패널이 같은 실측 상태를 공유하도록 훅을 한 곳에서 호출한다.
export function PwaLab() {
  const install = useInstallSignals()
  const manifest = useManifestCheck()
  const sw = useServiceWorkerLab()
  return (
    <>
      <DemoPlaygroundCard title="홈 화면 추가 PWA 프롬프트 및 manifest 실습">
        <PwaInstallPromptDemo install={install} manifest={manifest} sw={sw} />
      </DemoPlaygroundCard>
      <VerificationFooter
        manifest={manifest.report}
        snapshot={sw.snapshot}
        register={sw.register}
        wide={sw.wide}
        promptReady={install.promptReady}
        installed={install.installed}
      />
    </>
  )
}
