import React from 'react'
import { AlertTriangle, AlertCircle, Lightbulb } from 'lucide-react'

/** GitHub 스타일 경고 블록. `> [!NOTE]` 같은 표기에서 나온다. */
export type AlertVariant = 'note' | 'warning' | 'caution'

const ALERT_STYLE: Record<
  AlertVariant,
  { box: string; icon: string; Icon: typeof Lightbulb }
> = {
  note: {
    box: 'my-4 flex items-start gap-2.5 rounded-lg border border-blue-200 bg-blue-50/60 p-3.5 text-sm text-blue-900 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200',
    icon: 'h-4 w-4 shrink-0 mt-0.5 text-blue-600 dark:text-blue-400',
    Icon: Lightbulb,
  },
  warning: {
    box: 'my-4 flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50/60 p-3.5 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200',
    icon: 'h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400',
    Icon: AlertTriangle,
  },
  caution: {
    box: 'my-4 flex items-start gap-2.5 rounded-lg border border-rose-200 bg-rose-50/60 p-3.5 text-sm text-rose-900 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200',
    icon: 'h-4 w-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400',
    Icon: AlertCircle,
  },
}

/** 인용문 첫 줄의 `[!TAG]`를 variant와 남은 본문으로 가릅니다. 아니면 null. */
export function matchAlert(
  blockquoteContent: string,
): { variant: AlertVariant; text: string } | null {
  if (blockquoteContent.startsWith('[!NOTE]') || blockquoteContent.startsWith('[!TIP]')) {
    return { variant: 'note', text: blockquoteContent.replace(/^\[!(NOTE|TIP)\]\s?/, '') }
  }
  if (
    blockquoteContent.startsWith('[!IMPORTANT]') ||
    blockquoteContent.startsWith('[!WARNING]')
  ) {
    return {
      variant: 'warning',
      text: blockquoteContent.replace(/^\[!(IMPORTANT|WARNING)\]\s?/, ''),
    }
  }
  if (blockquoteContent.startsWith('[!CAUTION]')) {
    return { variant: 'caution', text: blockquoteContent.replace(/^\[!CAUTION\]\s?/, '') }
  }
  return null
}

export interface AlertProps {
  variant: AlertVariant
  children: React.ReactNode
}

export function Alert({ variant, children }: AlertProps) {
  const style = ALERT_STYLE[variant]
  const Icon = style.Icon

  return (
    <div className={style.box}>
      <Icon className={style.icon} />
      <div className="leading-relaxed">{children}</div>
    </div>
  )
}
