// 서버 전용 모듈(node:zlib 사용) — 클라이언트 컴포넌트에서 import하지 않는다.
import { crc32, deflateSync } from 'node:zlib'

// 서버 전용 PNG 인코더. 새 dependency 없이 node:zlib만으로 "노을 진 산" 풍경을 그린다.
// - slow-photo/route.ts: 큰 원본(예: 1200x500)을 인코딩해 지연 응답한다.
// - page.tsx: 같은 장면을 8x4로 줄여 base64 data URL을 만든다 — plaiceholder 같은 도구로
//   blurDataURL을 "직접 만들어 넘기는" 원격/동적 이미지 상황을 그대로 재현한다.

type Rgb = [number, number, number]

function mix(a: Rgb, b: Rgb, t: number): Rgb {
  return [0, 1, 2].map((i) => Math.round(a[i] + (b[i] - a[i]) * t)) as Rgb
}

/** 0~1 정규화 좌표(u, v)의 색. 해상도와 무관하게 같은 장면이 나온다. */
function scenePixel(u: number, v: number): Rgb {
  const ridgeFar = 0.55 + 0.08 * Math.sin(u * 9 + 1.2) + 0.04 * Math.sin(u * 23)
  const ridgeNear = 0.72 + 0.07 * Math.sin(u * 6 + 3.1) + 0.03 * Math.sin(u * 31 + 0.4)
  if (v > ridgeNear) return mix([30, 58, 48], [12, 26, 22], (v - ridgeNear) / (1 - ridgeNear))
  if (v > ridgeFar) return [70, 62, 110]
  const dx = (u - 0.68) * 2.4
  const dy = v - 0.42
  if (dx * dx + dy * dy < 0.012) return [255, 214, 120]
  return mix([37, 99, 235], [251, 146, 60], v / ridgeFar)
}

function chunk(type: string, data: Buffer): Buffer {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body) >>> 0)
  return Buffer.concat([len, body, crc])
}

/** width x height 크기의 장면을 24bit RGB PNG 바이트로 인코딩한다. */
export function encodeScenePng(width: number, height: number): Buffer {
  const raw = Buffer.alloc((width * 3 + 1) * height)
  for (let y = 0; y < height; y++) {
    const row = y * (width * 3 + 1)
    raw[row] = 0 // filter: None
    for (let x = 0; x < width; x++) {
      const [r, g, b] = scenePixel((x + 0.5) / width, (y + 0.5) / height)
      raw[row + 1 + x * 3] = r
      raw[row + 2 + x * 3] = g
      raw[row + 3 + x * 3] = b
    }
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr.writeUInt8(8, 8) // bit depth
  ihdr.writeUInt8(2, 9) // color type: RGB
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

/** 원격/동적 이미지용 수동 blurDataURL — 8x4 축소본을 base64 data URL로 만든다. */
export function buildManualBlurDataURL(): string {
  return `data:image/png;base64,${encodeScenePng(8, 4).toString('base64')}`
}
