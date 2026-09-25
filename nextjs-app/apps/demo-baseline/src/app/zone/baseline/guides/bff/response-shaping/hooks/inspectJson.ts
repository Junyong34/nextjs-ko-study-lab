// 브라우저가 받은 응답 JSON을 실제로 순회해 구조를 잰다. 서버가 알려 준 값을 믿지 않고 받은 본문만 본다.
import { SENSITIVE_KEYS } from '../constants'

const SENSITIVE = new Set<string>(SENSITIVE_KEYS)

export interface JsonShape {
  topLevelKeys: string[]
  leafCount: number
  maxDepth: number
  sensitivePaths: string[]
}

export function inspectJson(body: unknown): JsonShape {
  let leafCount = 0
  let maxDepth = 0
  const sensitivePaths: string[] = []

  const walk = (value: unknown, path: string, depth: number) => {
    if (value === null || typeof value !== 'object') {
      leafCount += 1
      return
    }
    maxDepth = Math.max(maxDepth, depth)
    if (Array.isArray(value)) {
      value.forEach((item, i) => walk(item, `${path}[${i}]`, depth + 1))
      return
    }
    for (const [key, child] of Object.entries(value)) {
      const childPath = path ? `${path}.${key}` : key
      if (SENSITIVE.has(key)) sensitivePaths.push(childPath)
      walk(child, childPath, depth + 1)
    }
  }

  walk(body, '', 1)
  const topLevelKeys = body && typeof body === 'object' && !Array.isArray(body) ? Object.keys(body) : []
  return { topLevelKeys, leafCount, maxDepth, sensitivePaths }
}
