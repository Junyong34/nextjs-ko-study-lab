export interface DemoConfig {
  /** demos.yaml의 url과 같은 값 */
  path: string
  /** 무엇을 관찰하라는 한 줄 */
  caption?: string
}

/**
 * ` ```demo ... ``` ` 블록의 key: value 줄들을 설정으로 읽습니다.
 *
 * 필드는 `path`(필수)와 `caption`(선택) 둘뿐입니다.
 * `mode`·`height`·`zone`은 폐기됐습니다 — 코드펜스가 그리는 것은 iframe이 아니라
 * 링크 카드라서 높이도 표시 모드도 의미가 없고, zone은 `demos.yaml`이 정합니다
 * ([01. 9](../../../../docs/01-ui-and-screen-design.md), ADR 0003 개정).
 *
 * 모르는 키는 조용히 무시합니다. 폐기된 필드가 남아 있는 문서가 깨지지 않도록 하기 위함입니다.
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
    } else if (key === 'caption') {
      config.caption = value
    }
  }

  return {
    path: config.path || '',
    caption: config.caption,
  }
}
