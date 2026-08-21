/**
 * 화면에 노출되는 사이트 상수입니다.
 *
 * Header와 Footer에 흩어져 하드코딩돼 있던 값을 한곳에 모은 것입니다.
 *
 * 주의: `version`은 화면 표시용 문자열이며 빌드에 쓰이는 기준 버전이 아닙니다.
 * 기준 버전이 선언되는 곳은 루트 `pnpm-workspace.yaml`의 catalog 하나뿐입니다
 * (AGENTS.md 규칙 1). 버전을 올릴 때 이 파일도 함께 고쳐야 한다는 점은
 * 그 자체로 결함이며, catalog에서 읽어오도록 만드는 것은 별도 티켓입니다.
 */
export const SITE = {
  version: 'v16.3.1',
  officialDocsUrl: 'https://nextjs.org/docs/app',
  repoUrl: 'https://github.com/Junyong34/nextjs-ko-study-lab',
  releaseUrl: 'https://github.com/vercel/next.js/releases/tag/v16.3.1',
  /** 피드백 모달이 여는 mailto 목적지 */
  feedbackTo: 'wnsdyd21@gmail.com',
} as const
