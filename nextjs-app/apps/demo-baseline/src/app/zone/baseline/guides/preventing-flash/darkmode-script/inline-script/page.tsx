import { InlineScript } from '../components/InlineScript'
import { ProbeReadout } from '../components/ProbeReadout'
import { buildProbeScript } from '../lib/theme'
import { ScriptThemeArea } from './components/ScriptThemeArea'

/** 비교 대상 B: 하이드레이션 전 인라인 스크립트로 data-theme을 먼저 맞추는 라우트 */
export default function InlineScriptVariantPage() {
  return (
    <main className="space-y-3 p-3">
      {/* 측정 프로브 — 데모 영역보다 먼저 파싱되어 rAF 프레임마다 테마를 기록한다 */}
      <InlineScript html={buildProbeScript('inline-script')} />
      <ScriptThemeArea />
      <ProbeReadout />
    </main>
  )
}
