import type { CorsPolicy, TrialSpec } from '../types'

/** zone 내부 경로 — 셸 iframe 안에서도 같은 경로가 셸 rewrites를 거쳐 이 zone으로 온다 */
export const DEMO_PATH = '/zone/baseline/config/cross-origin/anonymous-mode'
export const PROBE_PATH = `${DEMO_PATH}/probe`

/** probe 스크립트가 서버 응답 값을 남기는 전역 객체 이름 */
export const PROBE_GLOBAL = '__crossOriginAnonymousModeProbe'
/** probe 스크립트가 던지는 오류 메시지의 표식. 상세 메시지가 보이면 이 문자열이 들어 있다. */
export const ERROR_MARKER = 'cross-origin-probe'
/** 교차 출처 스크립트 오류를 브라우저가 가릴 때 쓰는 메시지 */
export const MASKED_MESSAGE = 'Script error.'

export const SCRIPT_ID_PREFIX = 'cross-origin-anonymous-mode-'

export const CORS_LABEL: Record<CorsPolicy, string> = {
  none: '헤더 없음',
  star: 'Access-Control-Allow-Origin: *',
  echo: 'ACAO: 요청 Origin + Allow-Credentials: true',
}

export const TRIALS: TrialSpec[] = [
  {
    id: 'plain-none',
    label: '속성 없음 · CORS 헤더 없음',
    cors: 'none',
    expectLoaded: true,
    expectDetailed: false,
    why: 'no-cors 요청이라 실행은 되지만 오류 내용은 "Script error."로 가려집니다.',
  },
  {
    id: 'anon-none',
    label: 'anonymous · CORS 헤더 없음',
    crossOrigin: 'anonymous',
    cors: 'none',
    expectLoaded: false,
    expectDetailed: null,
    why: 'CORS 모드로 요청했는데 서버가 허용하지 않아 브라우저가 실행 전에 차단합니다.',
  },
  {
    id: 'anon-star',
    label: 'anonymous · ACAO *',
    crossOrigin: 'anonymous',
    cors: 'star',
    expectLoaded: true,
    expectDetailed: true,
    why: '자격 증명 없는 CORS 요청을 서버가 허용해 오류 메시지와 파일 경로가 그대로 보입니다.',
  },
  {
    id: 'cred-star',
    label: 'use-credentials · ACAO *',
    crossOrigin: 'use-credentials',
    cors: 'star',
    expectLoaded: false,
    expectDetailed: null,
    why: '자격 증명을 포함한 요청에는 와일드카드(*) 허용이 통하지 않아 차단됩니다.',
  },
  {
    id: 'cred-echo',
    label: 'use-credentials · Origin 지정 + Credentials',
    crossOrigin: 'use-credentials',
    cors: 'echo',
    expectLoaded: true,
    expectDetailed: true,
    why: '서버가 요청 Origin을 그대로 허용하고 Allow-Credentials를 보내면 로드됩니다.',
  },
]

/**
 * 같은 dev 서버를 가리키지만 출처(origin)가 다른 주소를 만든다.
 * localhost ↔ 127.0.0.1은 호스트 표기만 다르므로 브라우저는 서로 다른 출처로 본다.
 * 그 밖의 호스트(배포 도메인 등)에서는 대응하는 다른 출처를 알 수 없어 null을 돌려준다.
 */
export function alternateOrigin(location: Pick<Location, 'protocol' | 'hostname' | 'port'>): string | null {
  const host = location.hostname === 'localhost' ? '127.0.0.1' : location.hostname === '127.0.0.1' ? 'localhost' : null
  if (!host) return null
  return `${location.protocol}//${host}${location.port ? `:${location.port}` : ''}`
}

export function probeUrl(origin: string, key: string, cors: CorsPolicy) {
  return `${origin}${PROBE_PATH}?trial=${encodeURIComponent(key)}&cors=${cors}`
}
