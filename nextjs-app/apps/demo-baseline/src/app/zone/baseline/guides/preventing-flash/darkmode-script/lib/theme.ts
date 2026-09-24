import type { Theme, Variant } from '../types'

/** 셸·다른 데모와 겹치지 않도록 데모 접두사를 붙인 localStorage 키 */
export const STORAGE_KEY = 'demo_darkmode-script_theme'
/** 서버는 localStorage를 읽을 수 없으므로 항상 이 기본값으로 HTML을 만든다 */
export const DEFAULT_THEME: Theme = 'light'
/** 데모 영역 요소 id — 앱 전체(html)가 아니라 이 요소에만 테마를 적용한다 */
export const AREA_ID = 'darkmode-script-area'
export const BASE_PATH = '/zone/baseline/guides/preventing-flash/darkmode-script'

/** React 쪽 판정 로직. 아래 인라인 스크립트와 같은 규칙(light|dark만 허용)을 쓴다. */
export function readStoredTheme(): Theme {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value === 'light' || value === 'dark' ? value : DEFAULT_THEME
  } catch {
    return DEFAULT_THEME
  }
}

/**
 * 가이드의 테마 스크립트를 데모 영역 요소에 맞춘 버전.
 * 요소의 첫 자식으로 두어, 파서가 그 안의 내용을 만나기 전에 동기 실행된다.
 * 같은 값을 여러 번 적용해도 결과가 같다(멱등).
 */
export const THEME_SCRIPT = `(function(){try{var el=document.getElementById(${JSON.stringify(AREA_ID)});var t=localStorage.getItem(${JSON.stringify(STORAGE_KEY)});if(el&&(t==="light"||t==="dark"))el.setAttribute("data-theme",t);var p=window.__darkmodeScriptProbe;if(p&&el&&!p.scriptAt)p.scriptAt={t:performance.now(),theme:el.getAttribute("data-theme")}}catch(e){}})()`

/**
 * 측정용 프로브. 데모 영역보다 먼저 실행되어
 * - requestAnimationFrame 매 프레임마다 데모 영역의 data-theme과 배경색을 기록하고
 * - PerformanceObserver로 first-paint / first-contentful-paint 시각을 받고
 * - console.error·error 이벤트 중 hydration 관련 메시지를 센다.
 * 하이드레이션(첫 useEffect) 후 500ms 동안 더 기록하고 멈춘다.
 */
export function buildProbeScript(variant: Variant): string {
  return `(function(){var p=window.__darkmodeScriptProbe={variant:${JSON.stringify(variant)},start:performance.now(),stored:null,frames:[],paints:[],scriptAt:null,hydratedAt:null,themeAtHydration:null,errors:[],done:false};
try{p.stored=localStorage.getItem(${JSON.stringify(STORAGE_KEY)})}catch(e){}
try{new PerformanceObserver(function(l){l.getEntries().forEach(function(e){p.paints.push({name:e.name,t:e.startTime})})}).observe({type:"paint",buffered:true})}catch(e){}
function rec(m){try{m=String(m);if(/hydrat/i.test(m)&&p.errors.length<10)p.errors.push(m.slice(0,200))}catch(e){}}
var oe=console.error;console.error=function(){rec(Array.prototype.slice.call(arguments).join(" "));return oe.apply(this,arguments)};
window.addEventListener("error",function(e){rec(e&&e.message)});
function tick(){var now=performance.now();var el=document.getElementById(${JSON.stringify(AREA_ID)});
if(el){var th=el.getAttribute("data-theme"),bg=getComputedStyle(el).backgroundColor,last=p.frames[p.frames.length-1];
if(last&&last.theme===th&&last.bg===bg)last.count++;else if(p.frames.length<40)p.frames.push({t:now,theme:th,bg:bg,count:1})}
if((p.hydratedAt===null&&now-p.start<20000)||(p.hydratedAt!==null&&now-p.hydratedAt<500))requestAnimationFrame(tick);else p.done=true}
requestAnimationFrame(tick)})()`
}

/** 하위 라우트의 Client Component가 하이드레이션 직후 첫 useEffect에서 호출한다 */
export function markHydrated() {
  const probe = window.__darkmodeScriptProbe
  if (!probe || probe.hydratedAt !== null) return
  probe.hydratedAt = performance.now()
  probe.themeAtHydration = document.getElementById(AREA_ID)?.getAttribute('data-theme') ?? null
}
