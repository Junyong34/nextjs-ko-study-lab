import type { ComponentPropsWithoutRef } from 'react'
import type { MDXComponents } from 'mdx/types'

// 모든 MDX 파일(이 zone 전체)에 적용되는 전역 컴포넌트 매핑. file-conventions/mdx-components/global-mdx-theme 데모가 소유한다.
// 규칙: 태그 종류는 바꾸지 않고 class만 더한다. guides/mdx/* 데모가 렌더된 태그 개수를 측정하기 때문이다.
// 기본 타이포그래피만 전역으로 주고, 강조색은 [data-mdx-theme=store] 래퍼 안에서만 켜진다.
// Tailwind가 소스에서 class를 찾아 생성하므로 문자열을 조립하지 않고 그대로 적는다.
const join = (base: string, extra?: string) => (extra ? `${base} ${extra}` : base)

const components = {
  h1: ({ className, ...props }: ComponentPropsWithoutRef<'h1'>) => (
    <h1
      className={join(
        'mdx-g mdx-g-h1 mb-3 text-xl font-bold tracking-tight [[data-mdx-theme=store]_&]:border-b-2 [[data-mdx-theme=store]_&]:border-emerald-600 [[data-mdx-theme=store]_&]:pb-1 [[data-mdx-theme=store]_&]:text-emerald-800 dark:[[data-mdx-theme=store]_&]:text-emerald-300',
        className,
      )}
      {...props}
    />
  ),
  h2: ({ className, ...props }: ComponentPropsWithoutRef<'h2'>) => (
    <h2
      className={join(
        'mdx-g mdx-g-h2 mt-5 mb-2 text-base font-semibold [[data-mdx-theme=store]_&]:text-emerald-700 dark:[[data-mdx-theme=store]_&]:text-emerald-400',
        className,
      )}
      {...props}
    />
  ),
  p: ({ className, ...props }: ComponentPropsWithoutRef<'p'>) => (
    <p className={join('mdx-g mdx-g-p my-2 leading-relaxed', className)} {...props} />
  ),
  a: ({ className, ...props }: ComponentPropsWithoutRef<'a'>) => (
    <a
      className={join(
        'mdx-g mdx-g-a underline underline-offset-2 [[data-mdx-theme=store]_&]:font-semibold [[data-mdx-theme=store]_&]:text-emerald-700 dark:[[data-mdx-theme=store]_&]:text-emerald-400',
        className,
      )}
      {...props}
    />
  ),
  code: ({ className, ...props }: ComponentPropsWithoutRef<'code'>) => (
    <code
      className={join(
        'mdx-g mdx-g-code font-mono text-[0.9em] [[data-mdx-theme=store]_&]:rounded [[data-mdx-theme=store]_&]:bg-emerald-50 [[data-mdx-theme=store]_&]:px-1 [[data-mdx-theme=store]_&]:text-emerald-900 dark:[[data-mdx-theme=store]_&]:bg-emerald-950 dark:[[data-mdx-theme=store]_&]:text-emerald-200',
        className,
      )}
      {...props}
    />
  ),
} satisfies MDXComponents

// 공식 문서의 계약: 인자 없는 useMDXComponents 하나를 export한다.
export function useMDXComponents(): MDXComponents {
  return components
}
