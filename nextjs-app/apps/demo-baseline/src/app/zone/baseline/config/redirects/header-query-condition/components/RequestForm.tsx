import { DemoResetButton } from '@study/demo-kit'
import { CONDITION_BASE } from '@/config/demo-next-config/redirects-condition'
import type { PresetMode } from '../lib/presets'
import type { ProbeInput } from '../types'
import { RuleList } from './RuleList'

interface Props {
  input: ProbeInput
  isPending: boolean
  onUpdate: <K extends keyof ProbeInput>(key: K, value: ProbeInput[K]) => void
  onSelectRule: (rule: ProbeInput['rule']) => void
  onPreset: (mode: PresetMode) => void
  onSend: () => void
  onReset: () => void
}

const field = 'rounded border border-zinc-300 bg-white px-2 py-1 font-mono text-xs dark:border-zinc-700 dark:bg-zinc-900'
const btn = 'cursor-pointer rounded bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900'
const ghost = 'cursor-pointer rounded border border-zinc-300 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800'

// 브라우저 주소창으로 직접 재현할 수 있는 규칙(쿼리·헤더 부재 조건)만 링크를 준다.
const browserHref = (i: ProbeInput) =>
  i.rule === 'query' ? `${CONDITION_BASE}/probe/query${i.query ? `?ref=${encodeURIComponent(i.query)}` : ''}` : i.rule === 'missing' ? `${CONDITION_BASE}/probe/missing` : null

export function RequestForm({ input, isPending, onUpdate, onSelectRule, onPreset, onSend, onReset }: Props) {
  const href = browserHref(input)
  return (
    <div className="space-y-3 text-xs text-zinc-700 dark:text-zinc-300">
      <RuleList selected={input.rule} onSelect={onSelectRule} />

      <fieldset className="grid gap-2 sm:grid-cols-2">
        <legend className="mb-1 font-bold">2) 서버가 보낼 요청 구성 (빈 칸은 보내지 않음)</legend>
        <label className="flex items-center justify-between gap-2">x-beta-tester 헤더
          <input className={field} value={input.header} onChange={(e) => onUpdate('header', e.target.value)} placeholder="true" />
        </label>
        <label className="flex items-center justify-between gap-2">demo_beta 쿠키
          <input className={field} value={input.cookie} onChange={(e) => onUpdate('cookie', e.target.value)} placeholder="on" />
        </label>
        <label className="flex items-center justify-between gap-2">?ref= 쿼리
          <input className={field} value={input.query} onChange={(e) => onUpdate('query', e.target.value)} placeholder="spring-sale" />
        </label>
        <label className="flex items-center justify-between gap-2">Host 헤더
          <input className={field} value={input.host} onChange={(e) => onUpdate('host', e.target.value)} placeholder="beta.demo.test" />
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={input.skip} onChange={(e) => onUpdate('skip', e.target.checked)} />
          x-skip-redirect: 1 헤더 보내기
        </label>
      </fieldset>

      <div className="flex flex-wrap items-center gap-2 border-t pt-3 dark:border-zinc-800">
        <button type="button" className={ghost} onClick={() => onPreset('match')}>조건 충족 입력 채우기</button>
        <button type="button" className={ghost} onClick={() => onPreset('miss')}>조건 미충족 입력 채우기</button>
        <button type="button" className={btn} disabled={isPending} onClick={onSend}>
          {isPending ? '요청 중...' : '3) 서버에서 실제 요청 보내기'}
        </button>
        {href && (
          <a className={ghost} href={href} target="_blank" rel="noopener noreferrer">브라우저로 직접 열기 (새 탭)</a>
        )}
        <DemoResetButton onReset={onReset} />
      </div>
    </div>
  )
}
