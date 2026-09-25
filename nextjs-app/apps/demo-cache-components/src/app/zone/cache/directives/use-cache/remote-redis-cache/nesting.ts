/**
 * 의도적으로 잘못된 중첩: 'use cache: remote' 안에서 'use cache: private'를 호출한다.
 * 공식 문서(use-cache-remote.md, "Nesting rules")가 명시한 금지 조합이다.
 * 일반 렌더링에서는 절대 실행되지 않고, actions.ts의 triggerNestingViolation()을 통해
 * Server Action으로만 실행해 Next.js가 실제로 던지는 에러를 관측한다.
 */

async function innerPrivateLeaf(): Promise<string> {
  'use cache: private'
  return 'private-leaf-value'
}

export async function outerRemoteCallsPrivate(): Promise<string> {
  'use cache: remote'
  return await innerPrivateLeaf()
}
