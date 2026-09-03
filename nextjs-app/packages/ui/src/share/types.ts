export interface ShareButtonProps {
  title: string
  url: string
  text?: string
}

export type ShareStatus = 'idle' | 'sharing' | 'copied' | 'error'

export interface ShareData {
  title: string
  url: string
  text?: string
}

export interface NavigatorLike {
  share?: (data: ShareData) => Promise<void>
  canShare?: (data: ShareData) => boolean
  clipboard?: {
    writeText: (text: string) => Promise<void>
  }
}

export interface ExecuteShareOptions {
  title: string
  url: string
  text?: string
  origin?: string
  navigator?: NavigatorLike
}

export type ShareExecutionResult =
  | { success: true; method: 'share' }
  | { success: true; method: 'clipboard' }
  | { success: false; method: 'canceled' }
  | { success: false; method: 'error'; error: unknown }
