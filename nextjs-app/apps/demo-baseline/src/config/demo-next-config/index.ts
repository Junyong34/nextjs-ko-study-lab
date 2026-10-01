import type { DemoConfigPart } from './types'
import { demoConfig as redirectsRegex } from './redirects-regex'
import { demoConfig as redirectsCondition } from './redirects-condition'
import { demoConfig as rewritesQuery } from './rewrites-query'
import { demoConfig as headersSecurity } from './headers-security'
import { demoConfig as envBuildTime } from './env-build-time'

const parts: DemoConfigPart[] = [redirectsRegex, redirectsCondition, rewritesQuery, headersSecurity, envBuildTime]

export const demoRedirects = parts.flatMap((p) => p.redirects ?? [])
export const demoRewrites = parts.flatMap((p) => p.rewrites ?? [])
export const demoHeaders = parts.flatMap((p) => p.headers ?? [])
export const demoEnv = Object.assign({}, ...parts.map((p) => p.env ?? {})) as Record<string, string>
