export interface NoticeEntry {
  id: string
  headline: string
  revision: number
  updatedAt: string
}

export interface NoticeSnapshot {
  entry: NoticeEntry
  cacheId: string
  generatedAt: string
}

export interface NoticeReviseResult {
  tag: string
  profile: "max" | "{ expire: 0 }"
  versionId: string
  entry: NoticeEntry
  timestamp: string
}
