import { DECLARED_KEY, UNDECLARED_KEY, type AccessReading, type ProbeKey } from '../types'

/**
 * 같은 키를 두 방식으로 읽는다. 이 파일은 서버(Route Handler)와 브라우저(Client Component) 양쪽에서 쓰인다.
 * - dot: `process.env.이름` 리터럴. next.config의 env에 선언된 키만 빌드 시점에 문자열로 치환된다.
 * - dynamic: `process.env[key]`. 치환 대상 식별자가 아니라 번들러가 건드리지 못한다.
 * 점 접근은 키마다 리터럴로 써야 하므로 두 키를 분기해서 읽는다.
 */
export function readBoth(key: ProbeKey): AccessReading {
  const dot = key === DECLARED_KEY ? process.env.DEMO_ENVFIELD_BUILD_LABEL : process.env.DEMO_ENVFIELD_UNDECLARED
  return { key, dot: dot ?? null, dynamic: process.env[key] ?? null }
}

export const readAll = (): AccessReading[] => [readBoth(DECLARED_KEY), readBoth(UNDECLARED_KEY)]
