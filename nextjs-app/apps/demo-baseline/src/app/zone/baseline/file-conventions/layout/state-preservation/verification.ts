import type {
  StatePreservationBaseline,
  StatePreservationSnapshot,
  StatePreservationVerification,
} from './types'

export const DEFAULT_QUERY = ''

export interface StatePreservationResetResult {
  query: string
  baseline: StatePreservationBaseline | null
}

export function resetState(): StatePreservationResetResult {
  return { query: DEFAULT_QUERY, baseline: null }
}

/**
 * baseline은 사용자가 [기준 기록]을 눌렀을 때의 검색어·경로·실제 카테고리·layout mount ID다.
 * snapshot은 현재 시점의 값이다. 실제 다른 경로로 이동하고, 이동한 페이지가 다른 카테고리를
 * 보고하며, 그 사이 layout mount 인스턴스와 검색어가 그대로일 때만 성공으로 판정한다.
 */
export function verifyStatePreservation(
  snapshot: StatePreservationSnapshot,
  baseline: StatePreservationBaseline | null,
): StatePreservationVerification {
  if (!baseline) {
    return {
      isMatched: undefined,
      reason: '아직 검색어 기준을 기록하지 않았습니다. 먼저 [현재 입력값·경로를 기준으로 기록]을 눌러주세요.',
    }
  }

  if (snapshot.pathname === baseline.pathname) {
    return {
      isMatched: undefined,
      reason: '아직 다른 카테고리 경로로 이동하지 않았습니다. 기준을 기록한 경로에 머물러 있습니다.',
    }
  }

  if (snapshot.mountId !== baseline.mountId) {
    return {
      isMatched: false,
      reason:
        '레이아웃 mount 인스턴스 자체가 바뀌었습니다. 전체 새로고침(Full Navigation)이 발생하면 layout.tsx가 리마운트되어 상태가 보존되지 않습니다.',
    }
  }

  if (snapshot.reportedPathname !== snapshot.pathname || snapshot.reportedCategory === null) {
    return {
      isMatched: undefined,
      reason: '이동한 페이지의 실제 콘텐츠가 아직 현재 카테고리를 보고하지 않았습니다.',
    }
  }

  if (snapshot.reportedCategory === baseline.category) {
    return {
      isMatched: false,
      reason: `실제 페이지 콘텐츠의 카테고리가 기준(${baseline.category})과 같습니다. 다른 카테고리 페이지로 이동해야 합니다.`,
    }
  }

  if (snapshot.query !== baseline.query) {
    return {
      isMatched: false,
      reason: `검색어가 기준값과 다릅니다. 기준: "${baseline.query}" / 현재: "${snapshot.query}"`,
    }
  }

  return {
    isMatched: true,
    reason: `경로가 ${baseline.pathname} → ${snapshot.pathname}(카테고리: ${baseline.category} → ${snapshot.reportedCategory})로 바뀌었지만, 같은 layout.tsx mount 인스턴스와 검색어 "${snapshot.query}"가 그대로 보존되었습니다.`,
  }
}
