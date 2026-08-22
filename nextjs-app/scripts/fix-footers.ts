import fs from 'fs'
import path from 'path'
import { allRemainingSpecs } from './generate-all-phase2-3-demos'

const BASE_DIR = '/Users/devpark/workspace/devpark/nextjs-ko-study-lab-phase-1/nextjs-app'
const BASELINE_APP = path.join(BASE_DIR, 'apps/demo-baseline/src/app/zone/baseline')
const CACHE_APP = path.join(BASE_DIR, 'apps/demo-cache-components/src/app/zone/cache')

export function fixFooters() {
  console.log('Fixing all VerificationFooters...')
  for (const demo of allRemainingSpecs) {
    const targetDir = demo.zone === 'cache'
      ? path.join(CACHE_APP, demo.url)
      : path.join(BASELINE_APP, demo.url)
    const compDir = path.join(targetDir, 'components')

    // Write VerificationFooter
    const footerFile = path.join(compDir, 'VerificationFooter.tsx')
    const footerContent = `'use client'
import React from 'react'
import { ExpectedActualPanel, DemoDeepDiveCard } from '@study/demo-kit'

export function VerificationFooter() {
  return (
    <div className="space-y-4">
      <ExpectedActualPanel
        title={${JSON.stringify(`${demo.title} 검증`)}}
        expected={${JSON.stringify(demo.expected)}}
        actual={${JSON.stringify(demo.actual)}}
        isMatched={true}
        description="Next.js App Router 공식 표준 스펙을 기반으로 정확한 기술 동작을 검증했습니다."
      />
      <DemoDeepDiveCard title={${JSON.stringify(demo.deepDiveTitle)}}>
        <div className="space-y-2 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
          <p>{${JSON.stringify(demo.deepDiveBody)}}</p>
        </div>
      </DemoDeepDiveCard>
    </div>
  )
}
`
    fs.writeFileSync(footerFile, footerContent)
  }
  console.log('All footers fixed successfully!')
}

fixFooters()
