export type RouteGroupName = 'shop' | 'auth'

export interface RouteTarget {
  id: string
  group: RouteGroupName
  browserUrl: string
  physicalPath: string
  title: string
  description: string
}
