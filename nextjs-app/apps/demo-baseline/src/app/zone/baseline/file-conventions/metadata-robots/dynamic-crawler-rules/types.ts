export type CrawlerMode = 'production' | 'staging'

export interface RobotsPreviewResult {
  mode: CrawlerMode
  requestedUrl: string
  status: number
  contentType: string | null
  bodyText: string
}
