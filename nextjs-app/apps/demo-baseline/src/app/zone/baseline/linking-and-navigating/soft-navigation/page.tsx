import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'linking-and-navigating/soft-navigation')

import React from 'react'
import { ScrollContent } from './components/ScrollContent'
import type { ProductItem } from './types'

const RECOMMENDED_PRODUCTS: ProductItem[] = [
  {
    id: 'rec-1',
    name: '스마트 에어 써큘레이터',
    price: 89000,
    categoryLabel: '추천 1위',
    desc: '3D 입체 회전과 초저소음 BLDC 모터를 탑재한 사계절 공기순환기',
  },
  {
    id: 'rec-2',
    name: '초경량 메쉬 러닝화',
    price: 129000,
    categoryLabel: '추천 2위',
    desc: '통기성이 뛰어난 고탄성 쿠셔닝 러닝화',
  },
  {
    id: 'rec-3',
    name: '무선 노이즈캔슬링 헤드폰',
    price: 249000,
    categoryLabel: '추천 3위',
    desc: '최대 40시간 연속 재생 및 공간 음향 지원 프리미엄 헤드폰',
  },
  {
    id: 'rec-4',
    name: '대용량 보조배터리 20000mAh',
    price: 39000,
    categoryLabel: '추천 4위',
    desc: '65W 초고속 PD 충전 지원 및 컴팩트 메탈 바디',
  },
  {
    id: 'rec-5',
    name: '스마트 체성분 체중계 Pro',
    price: 49000,
    categoryLabel: '추천 5위',
    desc: '16가지 신체 지표 분석 및 블루투스 자동 연동 건강 관리',
  },
  {
    id: 'rec-6',
    name: '초음파 대용량 가습기 4L',
    price: 59000,
    categoryLabel: '추천 6위',
    desc: '상부 급수 방식과 세척이 간편한 통세척 구조 가습기',
  },
  {
    id: 'rec-7',
    name: '무선 전동 마사지건 V2',
    price: 79000,
    categoryLabel: '추천 7위',
    desc: '강력한 고토크 모터와 6종 마사지 헤드 기본 제공',
  },
  {
    id: 'rec-8',
    name: '자석 부착형 무선 센서등 (3개 세트)',
    price: 28000,
    categoryLabel: '추천 8위',
    desc: '인체 감지 센서 및 따뜻한 웜톤 LED 충전식 무드등',
  },
]

export default function SoftNavigationHomePage() {
  return <ScrollContent title="추천 상품 목록" products={RECOMMENDED_PRODUCTS} />
}
