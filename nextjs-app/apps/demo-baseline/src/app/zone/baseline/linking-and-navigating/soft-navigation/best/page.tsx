import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'linking-and-navigating/soft-navigation/best')

import React from 'react'
import { ScrollContent } from '../components/ScrollContent'
import type { ProductItem } from '../types'

const BEST_PRODUCTS: ProductItem[] = [
  {
    id: 'best-1',
    name: '오버핏 프리미엄 후드티',
    price: 69000,
    categoryLabel: '베스트 1위',
    desc: '헤비웨이트 코튼 100% 원단과 탄탄한 핏감의 베스트셀러',
  },
  {
    id: 'best-2',
    name: '에르고체어 인체공학 의자',
    price: 349000,
    categoryLabel: '베스트 2위',
    desc: '풀 메쉬 설계와 다기능 럼버 서포트로 허리가 편안한 사무용 의자',
  },
  {
    id: 'best-3',
    name: '기계식 저소음 적축 키보드',
    price: 139000,
    categoryLabel: '베스트 3위',
    desc: '핫스왑 지원 및 공장 윤활 처리된 부드러운 타건감의 키보드',
  },
  {
    id: 'best-4',
    name: '스테인리스 진공 텀블러 700ml',
    price: 25000,
    categoryLabel: '베스트 4위',
    desc: '최대 24시간 보냉 및 결로 방지 이중 진공 구조',
  },
  {
    id: 'best-5',
    name: '4K IPS 27인치 전문가용 모니터',
    price: 429000,
    categoryLabel: '베스트 5위',
    desc: 'DCI-P3 98% 색역 커버리지와 Type-C 90W PD 충전 지원',
  },
  {
    id: 'best-6',
    name: '전동 높이조절 모션데스크 1400',
    price: 299000,
    categoryLabel: '베스트 6위',
    desc: '듀얼 모터와 4단계 메모리 컨트롤러를 탑재한 스탠딩 데스크',
  },
  {
    id: 'best-7',
    name: '밀폐형 더블 지퍼 백팩 25L',
    price: 85000,
    categoryLabel: '베스트 7위',
    desc: '16인치 노트북 수납 전용 쿠션 포켓과 발수 코팅 원단',
  },
  {
    id: 'best-8',
    name: '블루투스 무선 트랙볼 마우스',
    price: 64000,
    categoryLabel: '베스트 8위',
    desc: '손목 통증을 줄여주는 인체공학 각도 설계와 정밀 광학 센서',
  },
]

export default function SoftNavigationBestPage() {
  return <ScrollContent title="실시간 베스트 상품" products={BEST_PRODUCTS} />
}
