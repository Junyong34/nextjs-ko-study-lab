import { demoConfig } from '@/config/demo-next-config/redirects-regex'
import { REGEX_DEMO_BASE } from '@/config/demo-next-config/redirects-regex'

// next.config.ts → redirects()가 실제로 등록한 규칙. base 접두사를 떼어 읽기 쉽게 보여준다.
const strip = (s: string) => s.replace(REGEX_DEMO_BASE, '…')

export function RuleTable() {
  const rules = demoConfig.redirects ?? []
  return (
    <div className="overflow-x-auto rounded border border-zinc-200 dark:border-zinc-800">
      <table className="w-full text-left text-xs">
        <caption className="bg-zinc-50 px-3 py-1.5 text-left font-bold text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
          등록된 규칙 (src/config/demo-next-config/redirects-regex.ts → next.config.ts의 redirects())
        </caption>
        <thead className="text-zinc-500">
          <tr><th className="px-3 py-1">#</th><th className="px-3 py-1">source</th><th className="px-3 py-1">destination</th><th className="px-3 py-1">permanent</th></tr>
        </thead>
        <tbody className="font-mono">
          {rules.map((r, i) => (
            <tr key={r.source} className="border-t border-zinc-200 dark:border-zinc-800">
              <td className="px-3 py-1">{i}</td>
              <td className="px-3 py-1">{strip(r.source)}</td>
              <td className="px-3 py-1">{strip(r.destination)}</td>
              <td className="px-3 py-1">{String('permanent' in r ? r.permanent : false)} → {'permanent' in r && r.permanent ? 308 : 307}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
