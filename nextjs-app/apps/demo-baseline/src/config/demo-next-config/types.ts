import type { NextConfig } from 'next'

// 데모별 next.config 조각. 각 데모 워커는 자기 모듈 하나만 수정한다.
export type DemoConfigPart = {
  redirects?: Awaited<ReturnType<NonNullable<NextConfig['redirects']>>>
  rewrites?: Awaited<ReturnType<NonNullable<NextConfig['rewrites']>>> extends infer R
    ? R extends unknown[]
      ? R
      : never
    : never
  headers?: Awaited<ReturnType<NonNullable<NextConfig['headers']>>>
  env?: Record<string, string>
}
