import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'

export const metadata: Metadata = getDemoMetadata('baseline', 'config/base-path/subpath-routing')

import React from 'react'
import { DemoContainer, DemoGuideCard, DemoPlaygroundCard } from '@study/demo-kit'
import { ConfigBasePathDemo } from './components/ConfigBasePathDemo'
import { VerificationFooter } from './components/VerificationFooter'

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-6">
            <DemoGuideCard
        title="basePath: '/shop' 설정에 따른 전체 서브패스 라우팅"
        concept="next.config.ts의 basePath: '/shop' 설정을 통해 애플리케이션의 모든 라우트, 정적 에셋, Link 컴포넌트 URL 앞에 공통 서브패스를 자동 프리픽싱합니다."
        steps={[
          {
                    "step": 1,
                    "title": "next.config.ts basePath: '/shop' 설정 점검 및 자동 프리픽싱된 Link 및 라우팅 경로 검증",
                    "description": "애플리케이션 전역에 적용된 서브패스 프리픽스 설정을 확인합니다. <Link href=\\\"/products\\\"> 클릭 시 실제 이동 경로가 /shop/products로 자동 확장되는 방식을 확인합니다.",
                    "actionBadge": "basePath 점검"
          },
          {
                    "step": 2,
                    "title": "서브패스 기반 정적 에셋 및 라우팅 동작 관찰",
                    "description": "모든 번들 JS와 정적 이미지가 /shop/_next/... 경로로 정상 서빙되는지 확인합니다.",
                    "actionBadge": "서브패스 검증",
                    "observe": "basePath 설정에 따라 모든 페이지 링크 및 에셋 요청에 /shop 프리픽스가 자동 결합됨",
                    "observeAt": "playground"
          }
]}
      />
      <DemoPlaygroundCard title={"basePath: '/shop' 설정에 따른 전체 서브패스 라우팅 실습"}>
        <ConfigBasePathDemo />
      </DemoPlaygroundCard>
      <VerificationFooter />
    </DemoContainer>
  )
}
