export interface SearchableVisualization {
  title: string
  summary: string
  description: string
  gridDescription: string
  badge: { label: string }
  keywords?: string[]
}

const normalize = (value: string) => value.normalize('NFKC').toLocaleLowerCase('ko')

export function matchesVisualizeQuery(entry: SearchableVisualization, query: string): boolean {
  const terms = normalize(query).trim().split(/\s+/).filter(Boolean)
  const text = normalize([
    entry.title, entry.summary, entry.description, entry.gridDescription,
    entry.badge.label, ...(entry.keywords ?? []),
  ].join(' '))
  return terms.every((term) => text.includes(term))
}
