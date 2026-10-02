import type { AssetGroup, AssetScan } from '../types'

/**
 * 현재 문서에서 /_next/static 아래의 빌드 자산 태그를 찾아 crossorigin 속성을 센다. 두 무리로 나눈다.
 * - 부트스트랩: async 속성이 없는 <script src>(defer)와 <link href>. 서버의 getRequiredScripts·CSS 렌더가
 *   next.config의 crossOrigin 값을 그대로 넘기는 태그다.
 * - Flight 청크: async 속성이 있는 <script src>. client 컴포넌트 청크를 React Flight가 preinit으로 넣은 태그로,
 *   값은 client reference manifest의 moduleLoading.crossOrigin에서 온다.
 */
export function scanNextAssets(doc: Document): AssetScan {
  const scripts = Array.from(doc.querySelectorAll<HTMLScriptElement>('script[src]')).filter((el) => isNextAsset(el.src))
  const links = Array.from(doc.querySelectorAll<HTMLLinkElement>('link[href]')).filter((el) => isNextAsset(el.href))
  const bootstrap = [...scripts.filter((el) => !el.hasAttribute('async')), ...links]
  const chunks = scripts.filter((el) => el.hasAttribute('async'))
  return { bootstrap: group(bootstrap), chunks: group(chunks), scannedAt: new Date().toISOString() }
}

function group(elements: (HTMLScriptElement | HTMLLinkElement)[]): AssetGroup {
  return {
    total: elements.length,
    withCrossOrigin: elements
      .filter((el) => el.hasAttribute('crossorigin'))
      .map((el) => ({
        url: shortPath(el instanceof HTMLScriptElement ? el.src : el.href),
        value: el.getAttribute('crossorigin') ?? '',
      })),
  }
}

function isNextAsset(url: string) {
  return url.includes('/_next/static/')
}

function shortPath(url: string) {
  const index = url.indexOf('/_next/static/')
  return index === -1 ? url : `…${url.slice(index)}`
}
