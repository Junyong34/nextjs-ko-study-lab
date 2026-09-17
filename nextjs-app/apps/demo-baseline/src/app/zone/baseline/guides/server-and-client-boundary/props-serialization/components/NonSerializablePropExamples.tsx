const examples = [
  {
    title: '일반 함수 prop',
    code: 'onSelect={() => console.log(\'상품 선택\')}',
    description: '이벤트 핸들러나 일반 함수는 서버에서 클라이언트로 직렬화할 수 없습니다.',
    href: './props-serialization/function-prop-error',
    expectedError: 'Functions cannot be passed directly to Client Components',
  },
  {
    title: '사용자 정의 클래스 인스턴스 prop',
    code: 'discountPolicy={new DiscountPolicy(10)}',
    description: '프로토타입과 메서드를 가진 사용자 정의 객체는 순수 객체가 아니므로 전달할 수 없습니다.',
    href: './props-serialization/class-instance-prop-error',
    expectedError: 'Only plain objects ... Classes ... are not supported',
  },
] as const

export function NonSerializablePropExamples() {
  return (
    <section className="mt-4 border-t border-zinc-200 pt-4 dark:border-zinc-800" aria-labelledby="non-serializable-props-title">
      <div className="space-y-1">
        <h3 id="non-serializable-props-title" className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          전달 불가 값의 실제 오류 재현
        </h3>
        <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
          아래 링크는 설명용 상태 전환이 아닙니다. 각 경로가 Server Component에서 Client Component로 잘못된 props를 실제 전달하므로, Next.js 오류 화면이 나타납니다.
        </p>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {examples.map((example) => (
          <article key={example.href} className="rounded-md border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/70 dark:bg-amber-950/30">
            <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">{example.title}</h4>
            <code className="mt-2 block overflow-x-auto rounded bg-white/80 p-2 text-[11px] text-zinc-800 dark:bg-zinc-950/70 dark:text-zinc-200">
              {example.code}
            </code>
            <p className="mt-2 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">{example.description}</p>
            <p className="mt-2 font-mono text-[11px] leading-relaxed text-amber-800 dark:text-amber-300">
              예상 오류: {example.expectedError}
            </p>
            <a className="mt-3 inline-flex text-xs font-medium text-amber-900 underline underline-offset-4 dark:text-amber-200" href={example.href}>
              실제 오류 경로 열기
            </a>
          </article>
        ))}
      </div>

      <p className="mt-3 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
        <code>'use server'</code>로 표시한 Server Function 참조는 일반 함수와 다릅니다. Server Function은 Action 참조로 전달할 수 있지만, 임의의 콜백 함수는 전달할 수 없습니다.
      </p>
    </section>
  )
}
