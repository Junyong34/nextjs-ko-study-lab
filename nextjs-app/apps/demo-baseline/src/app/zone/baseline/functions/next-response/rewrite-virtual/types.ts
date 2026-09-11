export type RouteAccessMode = 'rewrite' | 'redirect' | 'direct'

export interface RouteObservation {
  mode: RouteAccessMode
  originPath: string | null
}

export const ROOT_PATH = '/zone/baseline/functions/next-response/rewrite-virtual'
export const TARGET_EVENT_PATH = `${ROOT_PATH}/target-event`
