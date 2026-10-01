import { SEGMENT_PATH } from '../constants'
import type { ActionResult, ManifestReport, SwSnapshot } from '../types'

interface JudgeInput {
  manifest: ManifestReport | null
  snapshot: SwSnapshot
  register: ActionResult | null
  wide: ActionResult | null
  promptReady: boolean
  installed: boolean
}

export const EXPECTED = [
  '• manifest 응답이 200 · application/manifest+json이고 name, start_url∈scope, display, 192·512 PNG 아이콘 검사를 모두 통과',
  `• sw.js 등록 성공, scope = ${SEGMENT_PATH}, 이 페이지가 서비스 워커의 제어를 받음`,
  '• 허용 scope보다 위인 부모 경로로의 등록은 SecurityError로 거부',
  '• 설치 프롬프트 수신 여부는 브라우저·환경 의존이라 판정에서 제외하고 점검표로 원인만 확인',
].join('\n')

const mark = (ok: boolean | null) => (ok === true ? '✓' : ok === false ? '✗' : '…')

// 실측값 세 가지(manifest, 서비스 워커 등록·제어, scope 거부)만으로 판정한다.
export function judgeLab({ manifest, snapshot, register, wide, promptReady, installed }: JudgeInput) {
  const manifestOk = manifest ? manifest.allOk : null
  const swOk = register ? register.ok && snapshot.state === 'activated' && snapshot.controlled : null
  const wideOk = wide ? wide.ok : null

  const actual = [
    `${mark(manifestOk)} manifest: ${
      manifest
        ? `${manifest.status ?? '응답 없음'} ${manifest.contentType ?? ''} · 통과 ${manifest.checks.filter((c) => c.ok).length}/${manifest.checks.length}`
        : '검사 중'
    }`,
    `${mark(swOk)} 서비스 워커: ${
      register
        ? `${register.ok ? '등록됨' : '등록 실패'} · state=${snapshot.state ?? '-'} · controller=${snapshot.controlled ? '있음' : '없음'}`
        : '[서비스 워커 등록]을 눌러 확인하세요'
    }`,
    `${mark(wideOk)} 부모 scope: ${wide ? wide.detail : '[부모 scope로 등록 시도]를 눌러 확인하세요'}`,
    `ℹ 설치 프롬프트: ${installed ? 'appinstalled 수신' : promptReady ? 'beforeinstallprompt 수신' : '미수신(판정 제외)'}`,
  ].join('\n')

  const results = [manifestOk, swOk, wideOk]
  const isMatched = results.includes(false) ? false : results.every((r) => r === true) ? true : undefined
  const description =
    isMatched === true
      ? 'manifest·서비스 워커·scope 제약이 모두 실제 응답과 브라우저 동작으로 확인됐습니다.'
      : isMatched === false
        ? '기대와 다른 항목이 있습니다. 위 실습 영역의 ✗ 항목을 확인하세요.'
        : '실습 영역의 버튼을 눌러 서비스 워커 등록과 scope 제약을 확인하면 판정됩니다.'
  return { isMatched, actual, description }
}
