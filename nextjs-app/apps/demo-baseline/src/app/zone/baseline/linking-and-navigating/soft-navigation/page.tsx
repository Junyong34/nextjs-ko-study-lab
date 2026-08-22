import React from 'react'
import { ScrollContent } from './components/ScrollContent'
import type { ProductItem } from './types'

const RECOMMENDED_PRODUCTS: ProductItem[] = [
  {
    id: 'rec-1',
    name: '스마트 에어 써큘레이터',
    price: 89000,
    categoryLabel: '추천',
    desc: '3D 입체 회전과 초저소음 BLDC 모터를 탑재한 사계절 공기순환기',
  },
  {
    id: 'rec-2',
    name: '초경량 메쉬 러닝화',
    price: 129000,
    categoryLabel: '추천',
    desc: '통기성이 뛰어난 고탄성 쿠셔닝 러닝화',
  },
  {
    id: 'rec-3',
    name: '무선 노이즈캔슬링 헤드폰',
    price: 249000,
    categoryLabel: '추천',
    desc: '최대 40시간 연속 재생 및 공간 음향 지원 프리미엄 헤드폰',
  },
  {
    id: 'rec-4',
    name: '대용량 보조배터리 20000mAh',
    price: 39000,
    categoryLabel: '추천',
    desc: '65W 초고속 PD 충전 지원 및 컴팩트 메탈 바디',
  },
]

export default function SoftNavigationHomePage() {
  return <ScrollContent title="추천 상품 목록" products={RECOMMENDED_PRODUCTS} />
}
