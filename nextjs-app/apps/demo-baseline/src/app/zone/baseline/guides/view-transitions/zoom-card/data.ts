// 목록·상세가 공유하는 사진 데이터. public/ 금지 규칙 때문에 이미지는 CSS 그라디언트로 그린다.

export const BASE = '/zone/baseline/guides/view-transitions/zoom-card'

export interface Photo {
  id: string
  title: string
  caption: string
  gradient: string
}

export const PHOTOS: Photo[] = [
  { id: '1', title: '새벽 해안선', caption: '동해안의 새벽 빛을 담은 사진입니다.', gradient: 'linear-gradient(135deg, #0f766e, #38bdf8 60%, #fde68a)' },
  { id: '2', title: '가을 능선', caption: '설악산 능선의 단풍 풍경입니다.', gradient: 'linear-gradient(160deg, #7c2d12, #f97316 55%, #fde047)' },
  { id: '3', title: '도심 야경', caption: '한강 위로 번지는 도시의 불빛입니다.', gradient: 'linear-gradient(200deg, #1e1b4b, #6d28d9 55%, #f0abfc)' },
]

/** 같은 사진의 목록·상세 요소를 잇는 ViewTransition 이름. 동시에 렌더링되는 전환마다 고유해야 한다. */
export const photoVtName = (id: string) => `zoom-card-${id}`

/** 공유 요소 morph를 CSS에서 겨냥하는 class (ViewTransition share prop) */
export const MORPH_CLASS = 'zoom-card-morph'

export const findPhoto = (id: string) => PHOTOS.find((p) => p.id === id)
