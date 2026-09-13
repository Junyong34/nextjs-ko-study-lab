export interface DraftStatus {
  isEnabled: boolean
  hasBypassCookie: boolean
}

export interface RenderSnapshot extends DraftStatus {
  renderedAt: string
}

export interface RenderLogEntry extends RenderSnapshot {
  id: number
  requestedAt: string
}
