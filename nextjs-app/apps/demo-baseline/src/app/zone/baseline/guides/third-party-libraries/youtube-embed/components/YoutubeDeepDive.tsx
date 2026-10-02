import React from 'react'
import { DemoDeepDiveCard } from '@study/demo-kit'

const h5 = 'mb-1 font-bold text-zinc-900 dark:text-zinc-100'
const ul = 'list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400'

export function YoutubeDeepDive() {
  return (
    <DemoDeepDiveCard title="@next/third-parties YouTubeEmbed 동작 원리">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h5 className={h5}>1. 컴포넌트가 실제로 만드는 것</h5>
          <p>
            <code>{'<YouTubeEmbed videoid="…" />'}</code>는 <code>{'<div data-ntpc="YouTubeEmbed">'}</code> 안에 <code>{'<lite-youtube videoid playlabel params>'}</code> HTML을 넣고,
            <code>next/script</code>로 <code>lite-yt-embed.js</code>를 <code>lazyOnload</code> 전략(브라우저 유휴 시점)으로, CSS는 <code>ReactDOM.preinit</code>으로 불러옵니다.
            스크립트가 <code>lite-youtube</code> 커스텀 엘리먼트를 등록하면 썸네일 배경과 재생 버튼(facade)을 그리고, 클릭할 때 비로소
            <code>youtube-nocookie.com/embed/…?autoplay=1</code> iframe을 붙입니다.
          </p>
        </div>
        <div>
          <h5 className={h5}>2. 이 실습이 측정하는 것과 못 하는 것</h5>
          <ul className={ul}>
            <li>측정: 실습 영역 안 실제 <code>{'<iframe>'}</code> 수, 그리고 부모 문서의 <code>performance.getEntriesByType(&apos;resource&apos;)</code>를 호스트별로 묶은 요청 수.</li>
            <li>못 하는 것: iframe 안 플레이어가 받는 JS·CSS·영상은 교차 출처 iframe 자신의 타임라인에 기록되어 부모에서 보이지 않습니다. 실제 바이트 절감량은 DevTools Network 탭에서 두 방식을 비교해 확인하세요.</li>
            <li>포스터에 마우스를 올리면 lite-youtube가 <code>{'<link rel="preconnect">'}</code>로 연결만 미리 엽니다. 연결 예열은 resource 항목으로 남지 않습니다.</li>
          </ul>
        </div>
        <div>
          <h5 className={h5}>3. 이 실습의 외부 요청 허용 목록</h5>
          <ul className={ul}>
            <li>[라이트 임베드 배치] 이후: <code>cdn.jsdelivr.net</code>(lite-yt-embed.js·CSS), <code>i.ytimg.com</code>(썸네일 jpg·webp).</li>
            <li>포스터에 마우스를 올리면: <code>youtube-nocookie.com</code>·<code>google.com</code>·<code>googleads.g.doubleclick.net</code>·<code>static.doubleclick.net</code>로 preconnect(연결만, 요청 본문 없음).</li>
            <li>포스터 클릭 이후: <code>www.youtube-nocookie.com</code> 플레이어 iframe. Safari·모바일은 <code>www.youtube.com/iframe_api</code>도 추가.</li>
            <li>[일반 iframe 배치] 이후: <code>www.youtube.com/embed/…</code> 플레이어 iframe.</li>
            <li>두 iframe 모두 내부에서 YouTube가 정하는 호스트(<code>googlevideo.com</code> 영상, <code>fonts.gstatic.com</code>, <code>yt3.ggpht.com</code>, 일반 iframe은 <code>doubleclick.net</code> 광고 확인 등)를 추가로 부릅니다. 이 페이지가 통제할 수 없는 범위입니다.</li>
            <li>페이지 진입만으로는 위 호스트 어디에도 요청하지 않습니다. 외부 접속이 막힌 환경에서는 facade가 등록되지 않아 &quot;판정 불가&quot;로 표시됩니다.</li>
          </ul>
        </div>
        <div>
          <h5 className={h5}>4. 주의사항</h5>
          <ul className={ul}>
            <li>facade 스크립트와 CSS는 <code>@master</code> 브랜치를 jsDelivr에서 직접 받습니다. 버전이 고정되지 않으니 CSP나 공급망 정책이 엄격한 서비스는 이 점을 검토해야 합니다.</li>
            <li><code>playlabel</code>은 재생 버튼의 시각적으로 숨긴 라벨입니다. 스크린 리더 사용자를 위해 영상 목적을 적어 줍니다.</li>
            <li><code>params</code>는 <code>controls=0&amp;start=10</code> 같은 플레이어 쿼리 문자열입니다. 클릭 시 <code>autoplay=1</code>이 자동으로 붙어 한 번의 클릭으로 재생됩니다.</li>
            <li>스크립트가 늦게 오면 그 전까지는 클릭해도 반응이 없습니다. 첫 화면 영상이라면 일반 iframe과의 체감 차이를 비교해 보고 고릅니다.</li>
          </ul>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}
