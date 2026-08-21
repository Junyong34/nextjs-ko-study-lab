import { DemoContainer } from '@study/demo-kit'

export default function NotFound() {
  return (
    <DemoContainer className="flex min-h-[200px] flex-col items-center justify-center p-6 text-center">
      <div className="mx-auto max-w-sm rounded-lg border border-amber-200 bg-amber-50/70 p-6 text-center dark:border-amber-900/60 dark:bg-amber-950/30">
        <div className="mb-2 text-2xl font-bold text-amber-800 dark:text-amber-300">
          404 Not Found
        </div>
        <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
          이 데모는 아직 배포되지 않았거나 준비 중입니다.
        </p>
        <p className="mt-1 text-xs text-amber-700 dark:text-amber-400">
          잠시 후 다시 시도해주세요.
        </p>
      </div>
    </DemoContainer>
  )
}
