import type { LayoutChange, LayoutGroup } from '../types'

/**
 * 서버 Action과 클라이언트(useOptimistic)가 함께 쓰는 순수 함수.
 * 입력 배열을 바꾸지 않고, 대상 그룹이나 채널이 없으면 입력을 그대로 돌려준다.
 */
export function channelLayoutReducer(
  groups: LayoutGroup[],
  change: LayoutChange,
): LayoutGroup[] {
  switch (change.type) {
    case 'move': {
      const moved = groups
        .flatMap((group) => group.channels)
        .find((channel) => channel.id === change.channelId)
      if (!moved || !groups.some((group) => group.name === change.toGroup)) {
        return groups
      }
      return groups.map((group) => {
        const rest = group.channels.filter((c) => c.id !== change.channelId)
        return group.name === change.toGroup
          ? { ...group, channels: [...rest, moved] }
          : { ...group, channels: rest }
      })
    }
    default:
      return groups
  }
}

/** 화면 비교용: 그룹 → 채널 id 목록 문자열 */
export function describeLayout(groups: LayoutGroup[]): string {
  return groups
    .map((g) => `${g.name}: [${g.channels.map((c) => c.id).join(', ') || '비어 있음'}]`)
    .join('\n')
}
