import { PROBE_EVENT } from './types'
import type { ProbeName } from './types'

/**
 * 서드파티 스크립트를 대신하는 실제 JS 본문.
 * Route Handler(probe/route.ts)가 src 스크립트로 서빙하고, 중복 방지 실습의 인라인 <Script>도 같은 본문을 쓴다.
 * 실행되는 "그 순간"의 performance.now()·readyState·pathname을 window.__strategyOrder에 불변 방식으로 추가하고
 * 이벤트를 방출할 뿐, 순서나 횟수를 미리 정하지 않는다.
 * core-sdk는 실행 시 window.__strategyOrderCore 전역을 정의한다(플러그인의 의존 대상).
 */
export function buildProbeBody(name: ProbeName) {
  const n = JSON.stringify(name)
  return `(function () {
  var s = window.__strategyOrder || { runs: [], hydratedAt: null, loadAt: null, visits: [], slotMounts: 0 };
  var prev = 0;
  for (var i = 0; i < s.runs.length; i++) if (s.runs[i].name === ${n}) prev++;
  var entry = {
    name: ${n},
    at: performance.now(),
    readyState: document.readyState,
    path: location.pathname,
    execNo: prev + 1,
    coreReady: typeof window.__strategyOrderCore !== 'undefined'
  };
  if (${n} === 'core-sdk') window.__strategyOrderCore = { version: '1.0.0-local', loadedAt: entry.at };
  window.__strategyOrder = Object.assign({}, s, { runs: s.runs.concat([entry]) });
  window.dispatchEvent(new CustomEvent(${JSON.stringify(PROBE_EVENT)}, { detail: entry }));
})();
`
}
