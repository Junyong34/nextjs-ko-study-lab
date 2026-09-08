import {
  REACT_COMPILER_SETTINGS,
  USE_TURBOPACK_RUST_REACT_COMPILER,
} from '@/config/react-compiler-settings'
import { getDemoMetadata } from '@study/demos'
import { DemoContainer, DemoGuideCard } from '@study/demo-kit'
import type { Metadata } from 'next'
import { ArchReactCompilerDemo } from './components/ArchReactCompilerDemo'

export const metadata: Metadata = getDemoMetadata('baseline', 'architecture/compiler-optimization/react-compiler')

export default function DemoPage() {
  return (
    <DemoContainer className="space-y-4">
      <DemoGuideCard
        title="React Compiler를 명시적으로 적용한 컴포넌트"
        concept="Next.js 16.3의 네이티브 Rust React Compiler를 Turbopack 안에서 실행하고, annotation 모드에서는 use memo를 선언한 컴포넌트만 최적화 후보로 만듭니다."
        steps={[
          {
            step: 1,
            title: '[수량 증가]를 여러 번 실행',
            description: '수동 useMemo/useCallback 없이 일반적인 상태 업데이트가 동작하는지 확인합니다.',
            actionBadge: '상태 변경',
          },
          {
            step: 2,
            title: '브라우저 콘솔을 연 뒤 [상품 목록과 무관한 상태 변경]을 여러 번 클릭',
            description: '상품 목록의 props(products, quantity)와 무관한 상태만 바꿔, 컴파일러가 메모이즈한 하위 트리가 재렌더링을 건너뛰는지 관찰합니다.',
            actionBadge: '메모이제이션 관찰',
            observe: 'MemoizedProductGrid 렌더 횟수 로그가 클릭 횟수만큼 늘지 않고 그대로 유지됨',
            observeAt: 'console',
          },
          {
            step: 3,
            title: '[상품 필터] 변경',
            description: 'products가 실제로 바뀌므로 이번에는 렌더 횟수 로그가 증가하는지 확인합니다.',
            actionBadge: '실제 재계산 확인',
            observe: '필터 변경 시에만 MemoizedProductGrid 렌더 횟수 로그 증가',
            observeAt: 'console',
          },
          {
            step: 4,
            title: '[검증] 설정 근거 확인',
            description: '페이지가 next.config와 공유하는 annotation 설정 및 opt-in 지시어를 확인합니다.',
            actionBadge: '빌드 검증',
            observe: '설정 모드, use memo 적용 범위, 수동 메모 훅 사용 여부',
            observeAt: 'verification',
          },
        ]}
      />
      <ArchReactCompilerDemo
        compilerMode={REACT_COMPILER_SETTINGS.compilationMode}
        usesNativeCompiler={USE_TURBOPACK_RUST_REACT_COMPILER}
      />
    </DemoContainer>
  )
}
