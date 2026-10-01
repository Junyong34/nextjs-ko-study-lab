import { DemoContainer } from '@study/demo-kit'
import { AwayInspector } from '../components/AwayInspector'

/**
 * Activity 관측용 이동 대상 라우트. 실습 화면에서 <Link>로 넘어오면,
 * cacheComponents: true인 zone에서는 이전 라우트가 언마운트되지 않고 display: none으로 숨겨져 있다.
 */
export default function EnableFlagAwayPage() {
  return (
    <DemoContainer className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">다른 라우트 (away)</h3>
        <p className="text-xs text-zinc-600 dark:text-zinc-400">
          방금 떠난 실습 화면이 아직 문서 안에 있는지 이 페이지가 직접 조사했습니다.
        </p>
      </div>
      <AwayInspector />
    </DemoContainer>
  )
}
