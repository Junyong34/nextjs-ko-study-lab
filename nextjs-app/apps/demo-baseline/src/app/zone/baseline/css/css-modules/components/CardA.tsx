'use client'

import React from 'react'
import styles from './CardA.module.css'

export function CardA() {
  return (
    <div className={styles.card}>
      <div className="flex items-center justify-between">
        <h4 className={styles.title}>Card A 컴포넌트</h4>
        <span className={styles.badge}>.module.css #A</span>
      </div>
      <p className={styles.description}>
        클래스명: <code className="font-mono text-[11px] font-bold">.card, .title, .badge</code> (Blue 테마 정의)
      </p>
    </div>
  )
}
