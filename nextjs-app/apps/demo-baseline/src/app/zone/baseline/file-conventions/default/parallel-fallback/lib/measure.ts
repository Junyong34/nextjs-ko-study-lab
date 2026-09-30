import type { Screens, SlotName } from '../types'

export const BASE = '/zone/baseline/file-conventions/default/parallel-fallback'

const SLOTS: SlotName[] = ['children', 'cart', 'promo', 'side']

export function relativePath(pathname: string) {
  return pathname.startsWith(BASE) ? pathname.slice(BASE.length) || '/' : pathname
}

/** 이미 그려진 DOM에서 data-slot/data-screen 값을 읽는다. */
export function readScreensFromDom(root: ParentNode): Screens {
  const screens: Screens = {}
  for (const slot of SLOTS) {
    const el = root.querySelector<HTMLElement>(`[data-slot="${slot}"]`)
    if (el?.dataset.screen) screens[slot] = el.dataset.screen
  }
  return screens
}

/** 서버가 내려준 HTML 문서에서 같은 값을 읽는다. */
export function readScreensFromHtml(html: string): Screens {
  const screens: Screens = {}
  for (const m of html.matchAll(/data-slot="(\w+)"\s+data-screen="([\w-]+)"/g)) {
    screens[m[1] as SlotName] ??= m[2]
  }
  return screens
}

export async function probe(rel: string) {
  const res = await fetch(`${BASE}${rel}`, { cache: 'no-store', headers: { Accept: 'text/html' } })
  const html = await res.text()
  return { path: rel, status: res.status, screens: readScreensFromHtml(html) }
}
