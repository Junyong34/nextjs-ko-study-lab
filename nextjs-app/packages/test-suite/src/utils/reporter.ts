export interface TestResultItem {
  name: string
  status: 'passed' | 'failed' | 'skipped'
  durationMs?: number
  error?: string
}

export interface TestSuiteSummary {
  suiteName: string
  total: number
  passed: number
  failed: number
  skipped: number
  durationMs: number
  items: TestResultItem[]
}

export function formatTable(headers: string[], rows: string[][]): string {
  const colWidths = headers.map((h, i) => {
    let max = h.length
    for (const r of rows) {
      if (r[i] && r[i].length > max) max = r[i].length
    }
    return max
  })

  const headerRow = headers.map((h, i) => h.padEnd(colWidths[i])).join(' | ')
  const separator = colWidths.map((w) => '-'.repeat(w)).join('-|-')
  const bodyRows = rows.map((r) => r.map((c, i) => (c || '').padEnd(colWidths[i])).join(' | '))

  return [headerRow, separator, ...bodyRows].join('\n')
}

export function printSuiteHeader(title: string): void {
  console.log(`\n============================================================`)
  console.log(`  ${title}`)
  console.log(`============================================================`)
}
