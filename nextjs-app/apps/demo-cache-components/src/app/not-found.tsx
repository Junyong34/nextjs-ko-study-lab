import { DemoContainer } from '@study/ui'

export default function NotFound() {
  return (
    <DemoContainer className="flex flex-col items-center justify-center min-h-[260px] text-center p-6 space-y-3">
      <div className="rounded-full bg-amber-100 p-3 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
        데모를 찾을 수 없거나 배포 진행 중입니다
      </h3>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm">
        요청하신 데모 라우트가 아직 구현되지 않았거나 배포 동기화 중일 수 있습니다. 잠시 후 다시 시도해 주세요.
      </p>
    </DemoContainer>
  )
}
