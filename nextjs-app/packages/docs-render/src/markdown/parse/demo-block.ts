export interface DemoConfig {
  path: string
  mode?: 'inline' | 'fullscreen'
  height?: number
  caption?: string
  zone?: string
}

/**
 * ` ```demo ... ``` ` 블록의 key: value 줄들을 설정 객체로 읽습니다.
 *
 * 참고: `mode`·`height`는 [06. 9](../../../../docs/06-ui-and-screen-design.md)에서 폐기가
 * 결정된 필드입니다. 코드펜스가 iframe이 아니라 링크 카드를 그리게 되는 Phase 7에서 함께 정리합니다.
 */
export function parseDemoBlock(blockText: string): DemoConfig {
  const lines = blockText.split('\n')
  const config: Partial<DemoConfig> = {}

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const colonIdx = trimmed.indexOf(':')
    if (colonIdx === -1) continue

    const key = trimmed.slice(0, colonIdx).trim()
    const value = trimmed.slice(colonIdx + 1).trim()

    if (key === 'path') {
      config.path = value
    } else if (key === 'mode') {
      if (value === 'fullscreen' || value === 'inline') {
        config.mode = value
      }
    } else if (key === 'height') {
      const parsed = parseInt(value, 10)
      if (!isNaN(parsed)) {
        config.height = parsed
      }
    } else if (key === 'caption') {
      config.caption = value
    } else if (key === 'zone') {
      config.zone = value
    }
  }

  return {
    path: config.path || '',
    mode: config.mode || 'inline',
    height: config.height,
    caption: config.caption,
    zone: config.zone,
  }
}
