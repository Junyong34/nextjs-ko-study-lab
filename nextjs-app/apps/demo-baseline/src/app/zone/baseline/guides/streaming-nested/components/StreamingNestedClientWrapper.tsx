'use client'

import React, { useState, useEffect } from 'react'
import { VerificationFooter } from './VerificationFooter'
import { DemoPlaygroundCard } from '@study/demo-kit'

export function StreamingNestedClientWrapper({ children }: { children: React.ReactNode }) {
  const [recommendedLoaded, setRecommendedLoaded] = useState(false)
  const [reviewsLoaded, setReviewsLoaded] = useState(false)

  useEffect(() => {
    const handleMounted = (e: Event) => {
      const customEvent = e as CustomEvent<'recommended' | 'reviews'>
      if (customEvent.detail === 'recommended') {
        setRecommendedLoaded(true)
      } else if (customEvent.detail === 'reviews') {
        setReviewsLoaded(true)
      }
    }

    window.addEventListener('stream-chunk-mounted', handleMounted)
    return () => {
      window.removeEventListener('stream-chunk-mounted', handleMounted)
    }
  }, [])

  return (
    <div className="space-y-6">
      <DemoPlaygroundCard title="이커머스 상품 상세 (중첩 스트리밍 파이프라인)" className="space-y-4">
        {children}
      </DemoPlaygroundCard>

      <VerificationFooter
        recommendedLoaded={recommendedLoaded}
        reviewsLoaded={reviewsLoaded}
      />
    </div>
  )
}
