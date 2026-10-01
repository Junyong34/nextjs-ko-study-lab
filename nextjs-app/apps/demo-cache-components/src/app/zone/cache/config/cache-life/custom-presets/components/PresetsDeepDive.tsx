import React from 'react'
import { DemoDeepDiveCard } from '@study/demo-kit'
import { BUILTIN_PROFILE_NAMES, PRESETS } from '../types'

const H = ({ children }: { children: React.ReactNode }) => (
  <h5 className="mb-1 font-bold text-zinc-900 dark:text-zinc-100">{children}</h5>
)

export function PresetsDeepDive() {
  return (
    <DemoDeepDiveCard title="next.config.ts cacheLife — 전역 프리셋 정의와 검증 규칙">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <H>1. 설정 위치는 최상위 cacheLife</H>
          <p>
            기준 버전 <code>next@16.3.2</code>의 번들 문서(<code>05-config/01-next-config-js/cacheLife.md</code>)와 설정 로더는{' '}
            <strong>최상위 <code>cacheLife</code></strong>를 쓴다. 이전 버전 자료에 보이는 <code>experimental.cacheLife</code>는
            구버전 표기이며, 이 zone의 next.config.ts도 최상위에 선언했다.
          </p>
        </div>

        <div>
          <H>2. 이 데모가 선언한 전역 프리셋</H>
          <pre className="overflow-x-auto rounded bg-zinc-950 p-3 font-mono text-[11px] text-zinc-300">
            {`// apps/demo-cache-components/next.config.ts\ncacheLife: {\n${PRESETS.map(
              (p) => `  '${p.profile}': { stale: ${p.stale}, revalidate: ${p.revalidate}, expire: ${p.expire} },`,
            ).join('\n')}\n}`}
          </pre>
          <p className="mt-1.5">
            <code>cachedData.ts</code>의 세 <code>&apos;use cache&apos;</code> 함수는 본문이 같고{' '}
            <code>cacheLife(&apos;프리셋 이름&apos;)</code>만 다르다. 설정에 한 번 선언한 이름을 여러 함수·컴포넌트가 불러
            쓰는 것이 전역 프리셋의 핵심이다. 값은 서버 시작 시 설정을 읽을 때 정해지므로, 바꾸면 dev 서버가 재시작된다.
          </p>
        </div>

        <div>
          <H>3. 세 값이 각각 하는 일과 이 데모에서 보이는 것</H>
          <ul className="list-disc space-y-1 pl-4">
            <li>
              <strong>revalidate</strong>: 엔트리 나이가 이 값을 넘긴 뒤의 요청에서 서버가 다시 계산한다. 실습 카드의 캐시 ID
              교체 시점이 이 값이다. revalidate가 지난 첫 요청은 이전 값을 그대로 받고(<code>revalidate 경과 후 재사용</code>)
              그 사이 백그라운드에서 새로 계산된 값이 다음 요청부터 나간다(stale-while-revalidate, dev 실측).
            </li>
            <li>
              <strong>expire</strong>: 요청이 없어도 이 시간이 지나면 엔트리를 더는 쓸 수 없다. 반드시 revalidate보다 커야 한다.
              expire가 300초 미만이면 Next.js는 짧은 수명(동적) 캐시로 보고 프리렌더에서 제외하며, next dev는 그런 엔트리를
              요청마다 백그라운드로 다시 계산한다(<code>MIN_PRERENDERABLE_EXPIRE</code>). 처음 짧은 수명을 expire 120초로
              두었을 때 5초 간격 측정에서 revalidate(20초)와 무관하게 10초마다 교체되어, 세 프리셋 모두 expire를 300초 이상으로 잡았다.
            </li>
            <li>
              <strong>stale</strong>: 클라이언트 라우터 캐시가 서버 확인 없이 재사용하는 시간이다. 이 데모는 Route Handler를
              직접 호출하므로 stale 값을 측정하지 않는다. production 빌드에서 프리렌더된 페이지의 RSC 응답은{' '}
              <code>x-nextjs-stale-time</code> 헤더로 이 값을 전달한다(app-render.js, 이 데모에서는 미검증).
            </li>
          </ul>
        </div>

        <div>
          <H>4. 응답 헤더로는 프리셋이 보이지 않는 이유</H>
          <p>
            probe Route Handler는 <code>await connection()</code>으로 매 요청 실행되는 동적 응답이라{' '}
            <code>cache-control</code>에 프리셋 값이 실리지 않는다(dev 실측: 헤더 없음). 캐시는 응답이 아니라 안쪽{' '}
            <code>&apos;use cache&apos;</code> 함수 단위로 일어나므로 캐시 ID와 생성 시각으로 판정한다. 프리렌더된 경로라면
            production에서 <code>s-maxage=revalidate, stale-while-revalidate=expire−revalidate</code> 형태로 나간다
            (<code>server/lib/cache-control.js</code>, 미검증).
          </p>
        </div>

        <div>
          <H>5. dev에서 캐시가 매번 새로 계산된다면</H>
          <p>
            next dev는 요청 헤더가 <code>Cache-Control: no-cache</code>이면 <code>&apos;use cache&apos;</code>를 강제로 다시
            계산한다(<code>use-cache-wrapper.js</code>의 <code>shouldForceRevalidate</code>). 강력 새로고침이나{' '}
            <code>fetch(url, {'{ cache: \'no-store\' }'})</code>가 이 헤더를 붙이므로, 이 데모는 그 옵션 없이 회차 번호를 쿼리에
            붙여 호출한다. 실측: no-store로 5초 간격 16회 호출 시 세 프리셋 모두 매번 새 ID, 옵션을 빼면 수명대로 재사용.
          </p>
        </div>

        <div>
          <H>6. 내장 프리셋 이름과의 충돌</H>
          <p>
            내장 이름은 {BUILTIN_PROFILE_NAMES.map((n) => `'${n}'`).join(', ')}이다. 같은 이름으로 선언하면 오류 없이 그 내장
            값이 앱 전체에서 바뀐다(next@16.3.2 <code>loadConfig</code>로 <code>minutes</code>를 1/2/3초로 선언해 경고 없이
            덮어써짐을 확인). 같은 zone의 다른 데모가 <code>cacheLife(&apos;minutes&apos;)</code>를 쓰므로, 이 데모는
            <code>config-cache-life-custom-presets:</code> 접두사를 붙인 새 이름만 추가했다.
          </p>
        </div>

        <div>
          <H>7. 잘못된 값은 어디서 막히나</H>
          <ul className="list-disc space-y-1 pl-4">
            <li>
              <strong>next.config.ts에 revalidate &gt; expire</strong>: 설정 로드 단계의{' '}
              <code>validateAndNormalizeCacheLifeProfile</code>가 E656 오류를 던져 dev·build가 시작되지 않는다(임시 설정으로
              <code>loadConfig</code>를 실행해 확인). <code>false</code>나 숫자가 아닌 값도 같은 단계에서 거부된다.
            </li>
            <li>
              <strong>인라인 <code>cacheLife({'{ … }'})</code></strong>: 같은 검증 함수를 호출 시점에 거친다. 실습의 첫 번째
              버튼이 이 경로다.
            </li>
            <li>
              <strong>선언하지 않은 이름</strong>: next dev/build가 설정을 읽어 생성하는 <code>cache-life.d.ts</code>가 선언된
              이름만 허용하므로 먼저 타입 검사에서 막힌다. 타입을 우회하면 실행 시 &quot;Unknown cacheLife() profile … is not
              configured&quot; 오류(E888)가 난다. 두 번째 버튼이 이 경로다.
            </li>
          </ul>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}
