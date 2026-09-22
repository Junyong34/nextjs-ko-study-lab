import type { TreeNode } from '../../types'

export const normalizeSearch = (query: string) => query.trim().toLowerCase().replace(/\s+/g, ' ')

export function searchTopics(tree: TreeNode[]): Set<string> {
  const topics = new Set(['react', 'next.js', 'nextjs', 'javascript', 'typescript', 'cache', 'routing', 'server actions'])
  const visit = (nodes: TreeNode[]) => nodes.forEach((node) => {
    topics.add(normalizeSearch(node.title))
    if (node.children) visit(node.children)
  })
  visit(tree)
  return topics
}

export function resultPaths(tree: TreeNode[], demo: boolean): string[] {
  const paths = new Set<string>()
  const visit = (nodes: TreeNode[]) => nodes.forEach((node) => {
    if (node.children?.length) visit(node.children)
    else if (node.url.startsWith('/')) {
      paths.add((demo ? `/demo${node.url === '/' ? '' : node.url}` : node.url).split(/[?#]/)[0])
    }
  })
  visit(tree)
  return [...paths].sort()
}

/** Local-only identity: the raw query never leaves this ledger. */
export class SearchMeasurement {
  private current = ''
  private recorded = false

  update(query: string, paths: string[], surface: string) {
    const normalized = normalizeSearch(query)
    const next = normalized ? JSON.stringify([surface, normalized, paths]) : ''
    if (this.current !== next) {
      this.current = next
      this.recorded = false
    }
  }

  claim(visible: boolean, composing: boolean): boolean {
    if (!visible || composing || !this.current || this.recorded) return false
    this.recorded = true
    return true
  }
}
