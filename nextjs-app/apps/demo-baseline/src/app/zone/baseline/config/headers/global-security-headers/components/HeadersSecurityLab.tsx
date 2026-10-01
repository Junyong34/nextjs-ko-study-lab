'use client'
import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { useHeaderProbe } from '../hooks/useHeaderProbe'
import { HeadersProbeConsole } from './HeadersProbeConsole'
import { VerificationFooter } from './VerificationFooter'

export function HeadersSecurityLab() {
  const s = useHeaderProbe()
  return (
    <DemoContainer className="space-y-6">
      <DemoGuideCard
        title="headers() 전역 보안 응답 헤더 일괄 주입 (CSP, HSTS)"
        concept="next.config.ts의 headers()는 source에 일치하는 모든 응답(페이지·Route Handler·정적 파일)에 응답 헤더를 붙인다. 이 데모는 보안 헤더를 이 데모 경로로 한정해 선언했고, 서버가 대상 경로와 다른 데모 경로를 실제로 fetch해 헤더 유무를 비교한다."
        steps={[
          { step: 1, title: '대상·대조 경로 선택', description: '기본값은 데모 페이지(대상)와 환경변수 데모의 Route Handler(대조)입니다. 대상은 source 범위 안, 대조는 밖이어야 합니다.', actionBadge: '경로 선택' },
          { step: 2, title: '[응답 헤더 측정] 실행', description: 'Server Action이 같은 앱의 두 경로를 fetch해 응답 헤더를 읽어 옵니다. 브라우저가 아니라 서버가 받은 값입니다.', actionBadge: '측정', observe: '대상에만 보안 헤더 5개가 보임', observeAt: 'playground' },
          { step: 3, title: '검증 패널의 헤더별 판정 확인', description: '헤더 단위로 대상은 선언값과 일치, 대조는 불일치(없음)여야 합니다. 두 경로를 모두 범위 안으로 고르면 판정 불가가 표시됩니다.', actionBadge: '결과 확인', observe: '헤더별 일치/불일치와 X-Frame-Options 부재', observeAt: 'verification' },
        ]}
      />
      <DemoPlaygroundCard title="보안 응답 헤더 범위 측정 실습">
        <HeadersProbeConsole
          targetPath={s.targetPath}
          controlPath={s.controlPath}
          onTargetChange={s.setTargetPath}
          onControlChange={s.setControlPath}
          result={s.result}
          runs={s.runs}
          isPending={s.isPending}
          onMeasure={s.measure}
          onReset={s.reset}
        />
      </DemoPlaygroundCard>
      <VerificationFooter result={s.result} />
    </DemoContainer>
  )
}
