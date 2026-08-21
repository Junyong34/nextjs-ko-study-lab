import fs from 'node:fs'
import path from 'node:path'

/**
 * `nextjs-docs` 디렉토리의 절대 경로를 찾습니다.
 *
 * 후보를 순회하는 이유는 실행 위치가 상황마다 다르기 때문입니다
 * (dev는 앱 디렉토리, 빌드 산출물은 트레이싱된 경로).
 *
 * 이 방식 자체가 취약합니다 — 후보에 없는 배치로 배포하면 조용히 첫 후보를 돌려주고
 * 그 뒤에 "문서를 찾을 수 없습니다"로 터집니다. 개선은 별도 티켓입니다.
 */
export function getDocsRoot(): string {
  const candidates = [
    path.resolve(process.cwd(), '../../../nextjs-docs'),
    path.resolve(process.cwd(), '../../nextjs-docs'),
    path.resolve(process.cwd(), '../nextjs-docs'),
    path.resolve(process.cwd(), 'nextjs-docs'),
    path.resolve(__dirname, '../../../../nextjs-docs'),
  ]

  for (const candidate of candidates) {
    if (fs.existsSync(path.join(candidate, 'docs-manifest.json'))) {
      return candidate
    }
  }

  return candidates[0]
}
