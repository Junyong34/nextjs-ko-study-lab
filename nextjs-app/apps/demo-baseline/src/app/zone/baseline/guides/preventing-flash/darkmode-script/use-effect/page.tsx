import { InlineScript } from '../components/InlineScript'
import { ProbeReadout } from '../components/ProbeReadout'
import { buildProbeScript } from '../lib/theme'
import { EffectThemeArea } from './components/EffectThemeArea'

/** 비교 대상 A: useEffect로 저장된 테마를 적용하는 라우트 (상위 페이지의 iframe에서 하드 로드된다) */
export default function UseEffectVariantPage() {
  return (
    <main className="space-y-3 p-3">
      {/* 측정 프로브 — 데모 영역보다 먼저 파싱되어 rAF 프레임마다 테마를 기록한다 */}
      <InlineScript html={buildProbeScript('use-effect')} />
      <EffectThemeArea />
      <ProbeReadout />
    </main>
  )
}
