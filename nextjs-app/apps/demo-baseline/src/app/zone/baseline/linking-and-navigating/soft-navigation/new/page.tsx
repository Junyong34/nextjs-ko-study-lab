import React from 'react'
import { ScrollContent } from '../components/ScrollContent'
import type { ProductItem } from '../types'

const NEW_PRODUCTS: ProductItem[] = [
  {
    id: 'new-1',
    name: '울 트위드 오버핏 자켓',
    price: 189000,
    categoryLabel: '신상품 1위',
    desc: '고급스러운 텍스처와 감각적인 실루엣의 신규 시즌 아우터',
  },
  {
    id: 'new-2',
    name: '알루미늄 모니터 암 싱글',
    price: 54000,
    categoryLabel: '신상품 2위',
    desc: '가스스프링 방식으로 자유로운 각도 조절이 가능한 데스크 셋업',
  },
  {
    id: 'new-3',
    name: '스마트 LED 데스크 램프',
    price: 42000,
    categoryLabel: '신상품 3위',
    desc: '색온도 및 밝기 무단계 미세 조절과 무선 충전 패드 내장',
  },
  {
    id: 'new-4',
    name: '가죽 데스크 매트 800x400',
    price: 19000,
    categoryLabel: '신상품 4위',
    desc: '생활 방수 및 미끄럼 방지 스웨이드 하단 마감 매트',
  },
  {
    id: 'new-5',
    name: '초슬림 마그네틱 카드지갑 맥세이프',
    price: 24000,
    categoryLabel: '신상품 5위',
    desc: '강력한 자력과 3장 수납 및 스탠드 거치 지원',
  },
  {
    id: 'new-6',
    name: '아로마 디퓨저 초음파 무드등',
    price: 35000,
    categoryLabel: '신상품 6위',
    desc: '자연 친화적 에센셜 오일 분사와 7가지 컬러 LED 무드등',
  },
  {
    id: 'new-7',
    name: '캠핑용 접이식 알루미늄 테이블',
    price: 48000,
    categoryLabel: '신상품 7위',
    desc: '초경량 1.2kg 및 전용 파우치로 간편한 휴대성',
  },
  {
    id: 'new-8',
    name: '다목적 케이블 정리 오거나이저',
    price: 15000,
    categoryLabel: '신상품 8위',
    desc: '벨크로 타이 10개와 자석 클립으로 깔끔한 배선 정리',
  },
]

export default function SoftNavigationNewPage() {
  return <ScrollContent title="이번 주 신상품" products={NEW_PRODUCTS} />
}
