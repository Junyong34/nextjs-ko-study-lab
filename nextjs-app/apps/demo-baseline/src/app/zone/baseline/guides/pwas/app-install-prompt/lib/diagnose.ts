import type { EnvSignals, ManifestReport } from '../types'

export interface Diagnosis {
  label: string
  /** true: 문제 없음, false: 설치 프롬프트를 막을 수 있는 원인, null: 이 페이지로는 측정 불가 */
  ok: boolean | null
  detail: string
}

interface DiagnoseInput {
  env: EnvSignals | null
  standalone: boolean
  manifest: ManifestReport | null
  swActive: boolean
  promptReady: boolean
  installed: boolean
}

// 설치 프롬프트가 오지 않을 때 확인할 원인을 실측 가능한 신호만으로 나열한다.
export function diagnoseInstall(input: DiagnoseInput): Diagnosis[] {
  const { env, standalone, manifest, swActive, promptReady, installed } = input
  if (!env) return []
  const list: Diagnosis[] = [
    {
      label: '보안 컨텍스트 (isSecureContext)',
      ok: env.isSecureContext,
      detail: env.isSecureContext ? 'HTTPS 또는 localhost' : 'HTTP라서 서비스 워커·설치가 막힙니다',
    },
    {
      label: '최상위 문서 여부',
      ok: !env.inFrame,
      detail: env.inFrame
        ? 'iframe 안에서 열려 있습니다. 설치는 최상위 문서 기준이므로 아래 [새 탭에서 열기]로 확인하세요'
        : '최상위 문서',
    },
    {
      label: 'beforeinstallprompt 지원',
      ok: env.hasInstallPromptHook,
      detail: env.hasInstallPromptHook
        ? 'window.onbeforeinstallprompt 존재(Chromium 계열)'
        : '이 브라우저는 이벤트가 없습니다(Safari·Firefox 등). 수동 설치 안내가 필요합니다',
    },
    {
      label: '이미 설치된 앱으로 실행 중',
      ok: !(standalone || installed),
      detail: standalone || installed ? 'display-mode: standalone 또는 appinstalled 수신 — 이미 설치됨' : '브라우저 탭에서 실행 중',
    },
    {
      label: 'manifest 유효성',
      ok: manifest ? manifest.allOk : null,
      detail: manifest ? (manifest.allOk ? '모든 검사 통과' : '실패한 검사가 있습니다(아래 manifest 검사 참고)') : '검사 중',
    },
    {
      label: '서비스 워커 활성',
      ok: env.hasServiceWorkerApi ? swActive : false,
      detail: !env.hasServiceWorkerApi
        ? 'navigator.serviceWorker 없음(비보안 컨텍스트 등)'
        : swActive
          ? '이 scope의 서비스 워커가 active'
          : '미등록(일부 브라우저는 설치 조건으로 요구) — [서비스 워커 등록]을 눌러 보세요',
    },
  ]
  if (!promptReady && !installed) {
    list.push({
      label: '브라우저의 발송 결정',
      ok: null,
      detail: '위 조건을 모두 통과해도 이벤트 발송은 브라우저가 결정합니다(이전에 거절한 경우 대기 기간 등). 페이지에서는 측정할 수 없습니다',
    })
  }
  return list
}
