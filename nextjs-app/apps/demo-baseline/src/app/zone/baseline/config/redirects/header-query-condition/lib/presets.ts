import type { ConditionRuleId, ProbeInput } from '../types'
import { EMPTY_INPUT } from './request'

export type PresetMode = 'match' | 'miss'

// 규칙별로 조건을 충족/미충족시키는 입력. 폼에 채워 넣기만 하고, 판정은 실제 응답으로 한다.
const PRESETS: Record<ConditionRuleId, Record<PresetMode, Partial<ProbeInput>>> = {
  header: { match: { header: 'true' }, miss: { header: 'false' } },
  query: { match: { query: 'spring-sale' }, miss: { query: 'Spring_2026' } },
  cookie: { match: { cookie: 'on' }, miss: { cookie: 'off' } },
  host: { match: { host: 'beta.demo.test' }, miss: { host: 'www.demo.test' } },
  missing: { match: {}, miss: { skip: true } },
  combo: { match: { header: 'true', cookie: 'on' }, miss: { header: 'true' } },
}

export const applyPreset = (rule: ConditionRuleId, mode: PresetMode): ProbeInput => ({
  ...EMPTY_INPUT,
  rule,
  ...PRESETS[rule][mode],
})
