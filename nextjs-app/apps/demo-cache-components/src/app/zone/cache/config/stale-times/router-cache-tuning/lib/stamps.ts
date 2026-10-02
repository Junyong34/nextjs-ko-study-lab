import { cacheLife } from 'next/cache'
import { connection } from 'next/server'

export interface RenderStamp {
  id: string
  at: string
}

function makeStamp(): RenderStamp {
  return { id: crypto.randomUUID().slice(0, 8), at: new Date().toISOString() }
}

/**
 * 정적 page용 값. 'use cache' 결과라 prerender에 포함되고, 같은 값이 다시 보이면 서버가 새로 만들지 않았다는 뜻이다.
 * 'default' 프로필의 stale은 next.config가 비워 두면 staleTimes.static 값(미설정 시 300초)으로 채워진다
 * (next/dist/server/config.js). 그래서 이 page의 x-nextjs-stale-time에 그 값이 나타난다.
 */
export async function getStaticStamp(): Promise<RenderStamp> {
  'use cache'
  cacheLife('default')
  return makeStamp()
}

/** 동적 page용 값. connection() 이후 요청마다 새로 만든다 — Suspense 안에서만 쓸 수 있다. */
export async function getRequestStamp(): Promise<RenderStamp> {
  await connection()
  return makeStamp()
}
