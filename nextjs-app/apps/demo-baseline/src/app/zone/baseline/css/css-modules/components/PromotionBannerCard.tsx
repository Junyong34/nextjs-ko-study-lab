'use client'

import React, { useState } from 'react'
import styles from './PromotionBannerCard.module.css'

export function PromotionBannerCard() {
  const [couponClaimed, setCouponClaimed] = useState(false)

  return (
    <div className={styles.card}>
      <div className="flex items-center justify-between">
        <h4 className={styles.title}>여름 정기 타임세일 이벤트</h4>
        <span className={styles.badge}>SPECIAL 30%</span>
      </div>
      <div className={styles.timer}>남은 시간: 02:45:18 (선착순 마감)</div>
      <p className="mt-1 text-xs text-zinc-500">
        스코프 클래스: <code className="font-mono text-[11px] font-bold text-emerald-700">.card, .title, .badge, .timer, .action</code>
      </p>
      <button
        type="button"
        onClick={() => setCouponClaimed(true)}
        className={styles.action}
      >
        {couponClaimed ? '✓ 30% 할인쿠폰 발급완료' : '할인쿠폰 즉시 받기'}
      </button>
    </div>
  )
}

// Alias for backwards compatibility
export const CardB = PromotionBannerCard
