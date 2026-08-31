'use client'

import React, { useState } from 'react'
import { DemoPlaygroundCard } from '@study/demo-kit'
import productStyles from './ProductCard.module.css'
import bannerStyles from './PromotionBannerCard.module.css'
import { VerificationFooter } from './VerificationFooter'

export function CssModulesController() {
  const [cartAdded, setCartAdded] = useState(false)
  const [couponClaimed, setCouponClaimed] = useState(false)

  return (
    <div className="space-y-6">
      <DemoPlaygroundCard title="동일 클래스명(.card, .title, .badge, .action) 충돌 격리 실습" className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* 상품 카드 컴포넌트 */}
          <div className="space-y-2">
            <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              컴포넌트 1: ProductCard (블루 테마)
            </div>
            <div className={productStyles.card}>
              <div className="flex items-center justify-between">
                <h4 className={productStyles.title}>프로 무선 기계식 키보드</h4>
                <span className={productStyles.badge}>BEST 상품</span>
              </div>
              <div className={productStyles.price}>189,000원</div>
              <p className="mt-1 text-xs text-zinc-500">
                스코프 클래스: <code className="font-mono text-[11px] font-bold text-blue-700">.card, .title, .badge, .price</code>
              </p>
              <button
                type="button"
                onClick={() => setCartAdded(true)}
                className={productStyles.action}
              >
                {cartAdded ? '✓ 장바구니에 담김' : '장바구니 담기'}
              </button>
            </div>
          </div>

          {/* 프로모션 배너 컴포넌트 */}
          <div className="space-y-2">
            <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              컴포넌트 2: PromotionBannerCard (그린 테마)
            </div>
            <div className={bannerStyles.card}>
              <div className="flex items-center justify-between">
                <h4 className={bannerStyles.title}>여름 정기 타임세일 이벤트</h4>
                <span className={bannerStyles.badge}>SPECIAL 30%</span>
              </div>
              <div className={bannerStyles.timer}>남은 시간: 02:45:18 (선착순 마감)</div>
              <p className="mt-1 text-xs text-zinc-500">
                스코프 클래스: <code className="font-mono text-[11px] font-bold text-emerald-700">.card, .title, .badge, .timer, .action</code>
              </p>
              <button
                type="button"
                onClick={() => setCouponClaimed(true)}
                className={bannerStyles.action}
              >
                {couponClaimed ? '✓ 30% 할인쿠폰 발급완료' : '할인쿠폰 즉시 받기'}
              </button>
            </div>
          </div>
        </div>
      </DemoPlaygroundCard>

      {/* 3단 & 4단: 검증 패널 및 [개념 정리] 카드 */}
      <VerificationFooter cartAdded={cartAdded} couponClaimed={couponClaimed} />
    </div>
  )
}
