import { CONDITION_BASE } from '@/config/demo-next-config/redirects-condition'
import type { ProbeInput, SentRequest } from '../types'

export const EMPTY_INPUT: ProbeInput = { rule: 'header', header: '', cookie: '', query: '', host: '', skip: false }

/** 폼 입력을 실제 요청 모양으로 바꾼다. 비어 있는 입력은 요청에 싣지 않는다. */
export function buildSentRequest(input: ProbeInput, defaultHost: string): SentRequest {
  const headers: Record<string, string> = {}
  if (input.header) headers['x-beta-tester'] = input.header
  if (input.cookie) headers.cookie = `demo_beta=${input.cookie}`
  if (input.skip) headers['x-skip-redirect'] = '1'

  const search = input.query ? `?${new URLSearchParams({ ref: input.query })}` : ''
  return {
    rule: input.rule,
    pathname: `${CONDITION_BASE}/probe/${input.rule}`,
    search,
    headers,
    host: input.host || defaultHost,
  }
}
