export interface DeploymentEnvironment {
  targetEnv?: string
  vercelEnv?: string
}

/** Vercel의 production만 공개 색인을 허용하고, 값이 없는 자체 호스팅은 기존 정책을 유지한다. */
export function isPublicIndexingAllowed({
  targetEnv = process.env.VERCEL_TARGET_ENV,
  vercelEnv = process.env.VERCEL_ENV,
}: DeploymentEnvironment = {}): boolean {
  const definedEnvironments = [targetEnv, vercelEnv].filter((value): value is string => value !== undefined)
  return definedEnvironments.length === 0 || definedEnvironments.every((value) => value === 'production')
}
