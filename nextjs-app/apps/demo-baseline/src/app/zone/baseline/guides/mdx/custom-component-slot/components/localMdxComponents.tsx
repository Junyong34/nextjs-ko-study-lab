import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import type { MDXComponents } from 'mdx/types'

// page.tsx가 <Guide components={...}>로 넘기는 지역 매핑. 전역 mdx-components.tsx와 병합되고, 같은 키(h2)는 이쪽이 이긴다.
function LocalH2(props: ComponentPropsWithoutRef<'h2'>) {
  return (
    <h2
      data-local-override="h2"
      className="mt-4 mb-2 border-l-4 border-zinc-900 pl-2 text-base font-bold dark:border-zinc-100"
      {...props}
    />
  )
}

// MDX가 import하지 않고 이름만 쓰는 컴포넌트. components prop으로 주입하지 않으면 렌더 시 에러가 난다.
function Callout({ tone, children }: { tone: 'stock' | 'info'; children: ReactNode }) {
  return (
    <aside data-probe="callout" data-tone={tone} className="my-2 rounded border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
      {children}
    </aside>
  )
}

export const localMdxComponents = { h2: LocalH2, Callout } satisfies MDXComponents
