import type { TargetItem } from './types'

export const TARGET_ITEMS: TargetItem[] = [
  {
    id: '201',
    title: '트레일 GTX 하이킹화',
    category: '아웃도어 슈즈',
    price: 159000,
    desc: '방수 고어텍스 멤브레인과 러그 아웃솔로 젖은 산길에서도 접지력을 유지합니다.',
    color: 'from-orange-600 to-red-700',
  },
  {
    id: '202',
    title: '스톰 쉘 자켓',
    category: '아웃도어 아우터',
    price: 219000,
    desc: '3레이어 방풍 원단으로 강풍과 비바람을 동시에 차단하는 등산용 쉘 자켓입니다.',
    color: 'from-sky-600 to-blue-700',
  },
  {
    id: '203',
    title: '얼티라이트 다운 베스트',
    category: '보온 이너웨어',
    price: 129000,
    desc: '초경량 충전재로 부피 부담 없이 체온을 유지하는 미니멀 다운 베스트입니다.',
    color: 'from-amber-600 to-yellow-700',
  },
]

export function getTargetItem(id: string): TargetItem {
  return (
    TARGET_ITEMS.find((item) => item.id === id) || {
      id,
      title: `장비 #${id}`,
      category: '일반 카테고리',
      price: 100000,
      desc: '갤러리 목록에 없는 ID로 직접 진입한 항목입니다.',
      color: 'from-zinc-600 to-zinc-800',
    }
  )
}
