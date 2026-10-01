'use client'
import React from 'react'
import { DemoResetButton } from '@study/demo-kit'
import type { useInstallSignals } from '../hooks/useInstallSignals'
import type { useManifestCheck } from '../hooks/useManifestCheck'
import type { useServiceWorkerLab } from '../hooks/useServiceWorkerLab'
import { InstallPanel } from './InstallPanel'
import { ManifestPanel } from './ManifestPanel'
import { ServiceWorkerPanel } from './ServiceWorkerPanel'

interface Props {
  install: ReturnType<typeof useInstallSignals>
  manifest: ReturnType<typeof useManifestCheck>
  sw: ReturnType<typeof useServiceWorkerLab>
}

export function PwaInstallPromptDemo({ install, manifest, sw }: Props) {
  const swActive = sw.snapshot.state === 'activated'
  const handleReset = async () => {
    // 서비스 워커 등록은 브라우저에 남는 실제 상태라 해제한 뒤 새로고침해야 초기 상태가 된다.
    await sw.unregister()
    window.location.reload()
  }

  return (
    <div className="space-y-3">
      <InstallPanel install={install} manifest={manifest.report} swActive={swActive} />
      <ManifestPanel manifest={manifest} />
      <ServiceWorkerPanel sw={sw} supported={Boolean(install.env?.hasServiceWorkerApi)} />
      <div className="flex flex-wrap items-center gap-2">
        <DemoResetButton onReset={handleReset} label="예제 초기화 (서비스 워커 해제 후 새로고침)" />
        <span className="text-[11px] text-zinc-500">
          이미 설치한 앱은 이 버튼으로 제거되지 않습니다. 브라우저의 앱 제거 메뉴를 사용하세요.
        </span>
      </div>
    </div>
  )
}
