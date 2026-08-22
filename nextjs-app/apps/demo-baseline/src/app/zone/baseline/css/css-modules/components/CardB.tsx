'use client'

import React from 'react'
import styles from './CardB.module.css'

export function CardB() {
  return (
    <div className={styles.card}>
      <div className="flex items-center justify-between">
        <h4 className={styles.title}>Card B 컴포넌트</h4>
        <span className={styles.badge}>.module.css #B</span>
      </div>
      <p className={styles.description}>
        클래스명: <code className="font-mono text-[11px] font-bold">.card, .title, .badge</code> (Emerald 테마 정의)
      </p>
    </div>
  )
}
