export interface RemountCounts {
  /** layout.tsx의 누적 마운트 횟수. 세그먼트가 유지되는 한 최초 진입 이후 변하지 않는다. */
  layoutMountCount: number
  /** layout.tsx가 처음(마지막으로) 마운트된 시각 문자열 */
  layoutMountedAt: string
  /** template.tsx의 누적 마운트 횟수. 하위 라우트를 이동할 때마다 증가한다. */
  templateMountCount: number
  /** template.tsx가 가장 최근 마운트된 시각 문자열 */
  templateMountedAt: string
}
