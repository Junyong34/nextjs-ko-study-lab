import type { Metadata } from 'next'
import { getDemoMetadata } from '@study/demos'
import { DevIndicatorsLab } from './components/DevIndicatorsLab'

export const metadata: Metadata = getDemoMetadata('baseline', 'config/dev-indicators/render-badge')

// 요청 시점 API를 쓰지 않는 페이지다. 표시기 메뉴의 Route 값을 열어 보면 이 라우트의 판정을 볼 수 있다.
export default function DemoPage() {
  return <DevIndicatorsLab />
}
