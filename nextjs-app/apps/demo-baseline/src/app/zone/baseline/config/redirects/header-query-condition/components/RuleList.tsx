import { conditionRules, CONDITION_BASE, type ConditionRule, type HasItem } from '@/config/demo-next-config/redirects-condition'
import type { ConditionRuleId } from '../types'

const fmtItem = (i: HasItem) =>
  `{ type: '${i.type}'${i.key ? `, key: '${i.key}'` : ''}${i.value !== undefined ? `, value: '${i.value}'` : ''} }`

function ruleBody(rule: ConditionRule) {
  const lines = [`source: '${rule.source.replace(CONDITION_BASE, '…')}'`]
  rule.has?.forEach((i) => lines.push(`has: ${fmtItem(i)}`))
  rule.missing?.forEach((i) => lines.push(`missing: ${fmtItem(i)}`))
  lines.push(`destination: '${rule.destination.replace(CONDITION_BASE, '…')}'`)
  return lines.join('\n')
}

interface Props {
  selected: ConditionRuleId
  onSelect: (id: ConditionRuleId) => void
}

/** next.config의 실제 규칙 배열(conditionRules)을 그대로 보여주며 요청 대상 규칙을 고르게 한다. */
export function RuleList({ selected, onSelect }: Props) {
  return (
    <fieldset className="grid gap-2 sm:grid-cols-2">
      <legend className="mb-1 text-xs font-bold text-zinc-700 dark:text-zinc-300">1) 요청을 보낼 redirects() 규칙 (next.config 원문)</legend>
      {conditionRules.map((rule) => (
        <label
          key={rule.id}
          className={`cursor-pointer rounded border p-2.5 text-[11px] ${
            selected === rule.id
              ? 'border-zinc-900 bg-zinc-50 dark:border-zinc-100 dark:bg-zinc-900'
              : 'border-zinc-200 dark:border-zinc-800'
          }`}
        >
          <span className="flex items-center gap-1.5 text-xs font-bold text-zinc-900 dark:text-zinc-100">
            <input type="radio" name="rule" checked={selected === rule.id} onChange={() => onSelect(rule.id)} />
            {rule.label}
          </span>
          <pre className="mt-1.5 overflow-x-auto whitespace-pre-wrap break-all font-mono text-zinc-600 dark:text-zinc-400">{ruleBody(rule)}</pre>
        </label>
      ))}
    </fieldset>
  )
}
