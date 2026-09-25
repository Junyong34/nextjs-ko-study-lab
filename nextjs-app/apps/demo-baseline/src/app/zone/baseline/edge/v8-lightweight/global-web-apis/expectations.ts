import type { LabState } from './hooks/useEdgeLab'
import { STREAM_CHUNKS, STREAM_INTERVAL_MS } from './types'

export const EXPECTED_LINES = [
  "• probe·stream 응답 모두 NEXT_RUNTIME='edge', typeof EdgeRuntime='string'",
  '• edge 라우트 안에서 호출한 Web API 11개 항목이 모두 성공',
  '• 같은 입력의 SHA-256 hex·UTF-8 바이트 수·Base64가 브라우저 계산값과 동일',
  `• stream: 청크 ${STREAM_CHUNKS}개가 순서대로 도착하고 이어 붙이면 입력과 같음`,
  `• stream: 첫 청크와 마지막 청크의 도착 간격이 약 ${(STREAM_CHUNKS - 1) * STREAM_INTERVAL_MS}ms (응답이 버퍼링되지 않고 흘러옴)`,
]

export interface Verdict {
  label: string
  ok: boolean
  detail: string
}

/** 스트리밍으로 인정할 최소 도착 간격. 네트워크 지터를 감안해 이론값의 60%로 둔다. */
const MIN_SPREAD_MS = Math.round((STREAM_CHUNKS - 1) * STREAM_INTERVAL_MS * 0.6)

export function evaluate(state: LabState): { verdicts: Verdict[]; isMatched: boolean | undefined } {
  if (state.status !== 'done') {
    return { verdicts: [], isMatched: state.status === 'error' ? false : undefined }
  }
  const { probe, browser, stream, input } = state
  const failed = probe.checks.filter((c) => !c.ok).map((c) => c.api)
  const joined = stream.chunks.map((c) => c.part).join('')
  const ordered = stream.chunks.every((c, i) => c.seq === i)
  const first = stream.chunks[0]?.arrivedMs ?? 0
  const last = stream.chunks.at(-1)?.arrivedMs ?? 0
  const spread = last - first

  const verdicts: Verdict[] = [
    {
      label: '런타임 식별',
      ok:
        probe.nextRuntime === 'edge' &&
        probe.edgeRuntimeGlobal === 'string' &&
        stream.nextRuntime === 'edge' &&
        stream.edgeRuntimeGlobal === 'string',
      detail: `probe=${probe.nextRuntime}/${probe.edgeRuntimeGlobal}, stream=${stream.nextRuntime}/${stream.edgeRuntimeGlobal}`,
    },
    {
      label: 'Web API 호출',
      ok: failed.length === 0,
      detail: failed.length === 0 ? `${probe.checks.length}개 모두 성공` : `실패: ${failed.join(', ')}`,
    },
    {
      label: 'SHA-256 대조',
      ok: probe.sha256Hex === browser.sha256Hex,
      detail: `edge ${probe.sha256Hex.slice(0, 16)}… / 브라우저 ${browser.sha256Hex.slice(0, 16)}…`,
    },
    {
      label: '바이트·Base64 대조',
      ok: probe.utf8ByteLength === browser.utf8ByteLength && probe.base64 === browser.base64,
      detail: `${probe.utf8ByteLength} bytes / ${browser.utf8ByteLength} bytes, Base64 ${probe.base64 === browser.base64 ? '동일' : '다름'}`,
    },
    {
      label: '스트림 내용',
      ok: stream.chunks.length === STREAM_CHUNKS && ordered && joined === input,
      detail: `${stream.chunks.length}개 수신, 순서 ${ordered ? '정상' : '뒤섞임'}, 재조립 ${joined === input ? '일치' : '불일치'}`,
    },
    {
      label: '점진 도착',
      ok: spread >= MIN_SPREAD_MS,
      detail: `첫 청크 ${first}ms → 마지막 ${last}ms (간격 ${spread}ms, 기준 ≥ ${MIN_SPREAD_MS}ms)`,
    },
  ]
  return { verdicts, isMatched: verdicts.every((v) => v.ok) }
}
