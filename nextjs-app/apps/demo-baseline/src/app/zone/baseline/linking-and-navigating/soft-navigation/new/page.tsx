import React from 'react'
import { ScrollContent } from '../components/ScrollContent'
import type { ProductItem } from '../types'

const NEW_PRODUCTS: ProductItem[] = [
  {
    id: 'new-1',
    name: '울 트위드 오버핏 자켓',
    price: 189000,
    categoryLabel: '신상품',
    desc: '고급스러운 텍스처와 감각적인 실루엣의 신규 시즌 아우터',
  },
  {
    id: 'new-2',
    name: '알루미늄 모니터 암 싱글',
    price: 54000,
    categoryLabel: '신상품',
    desc: '가스스프링 방식으로 자유로운 각도 조절이 가능한 데스크 셋업',
  },
  {
    id: 'new-3',
    name: '스마트 LED 데스크 램프',
    price: 42000,
    categoryLabel: '신상품',
    desc: '색온도 및 밝기 무단계 미세 조절과 무선 충전 패드 내장',
  },
  {
    id: 'new-4',
    name: '가죽 데스크 매트 800x400',
    price: 19000,
    categoryLabel: '신상품',
    desc: '생활 방수 및 미끄럼 방지 스웨이드 하단 마감 매트',
  },
]

export default function SoftNavigationNewPage() {
  return <ScrollContent title="이번 주 신상품" products={NEW_PRODUCTS} />
}
