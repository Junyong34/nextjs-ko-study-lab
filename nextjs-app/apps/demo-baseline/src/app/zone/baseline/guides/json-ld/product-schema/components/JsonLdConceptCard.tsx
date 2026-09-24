import { DemoDeepDiveCard } from '@study/demo-kit'

const h5 = 'mb-1 font-bold text-zinc-900 dark:text-zinc-100'
const code = 'rounded bg-zinc-100 px-1 font-mono dark:bg-zinc-800'
const pre =
  'overflow-x-auto rounded bg-[#24292e] p-3 font-mono text-[11px] leading-relaxed text-zinc-100'

export function JsonLdConceptCard() {
  return (
    <DemoDeepDiveCard title="JSON-LD 렌더 위치 · SSR 포함 · 이스케이프">
      <div className="space-y-3.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <div>
          <h5 className={h5}>1. 렌더 위치: layout/page의 네이티브 script</h5>
          <p>
            공식 가이드는 JSON-LD를 <code className={code}>layout.js</code>나{' '}
            <code className={code}>page.js</code>에서 네이티브{' '}
            <code className={code}>{'<script type="application/ld+json">'}</code>로 렌더하라고 권장합니다.{' '}
            <code className={code}>next/script</code>는 실행할 JS의 로딩 전략을 위한 컴포넌트라 데이터인 JSON-LD에는 맞지 않습니다.
            이 데모의 script는 <code className={code}>page.tsx</code>(서버 컴포넌트) 안 <code className={code}>{'<section>'}</code>에
            있으므로 HTML 원문에서도 <code className={code}>{'<head>'}</code>가 아니라 <code className={code}>{'<body>'}</code> 안에서
            발견됩니다. 구조화 데이터는 body에 있어도 유효합니다.
          </p>
        </div>

        <div>
          <h5 className={h5}>2. SSR HTML 포함: 클라이언트 JS 없이 읽힌다</h5>
          <p>
            서버 컴포넌트가 만든 script 태그는 첫 응답 HTML에 그대로 직렬화됩니다. 검사 버튼은 이 페이지를{' '}
            <code className={code}>fetch(…, {'{'} cache: &apos;no-store&apos; {'}'})</code>로 다시 받아{' '}
            <code className={code}>DOMParser</code>로 파싱합니다. DOMParser 문서는 스크립트를 실행하지 않으므로, JS를 돌리지 않는
            크롤러가 보는 상태와 같습니다. 가격·재고는 화면 카드와 같은 <code className={code}>ProductRecord</code>에서 만들어 화면과
            구조화 데이터가 어긋나지 않게 합니다.
          </p>
        </div>

        <div>
          <h5 className={h5}>3. 이스케이프: JSON.stringify만으로는 부족하다</h5>
          <p>
            HTML 파서는 script 본문을 JSON으로 이해하지 않고 <code className={code}>{'</script>'}</code> 문자열이 나오는 순간
            요소를 닫습니다. 그래서 판매자 입력에 <code className={code}>{'</script>'}</code>가 들어 있으면 뒤쪽 문자열이 HTML로
            해석됩니다(이 데모는 실행되지 않는 <code className={code}>{'<img data-injected>'}</code>만 주입해 관측). 가이드는{' '}
            <code className={code}>{'<'}</code>를 유니코드 이스케이프로 바꾸라고 안내합니다. JSON 문자열 안의 유니코드 이스케이프는
            JSON.parse 때 다시 <code className={code}>{'<'}</code>로 복원되므로 데이터는 그대로입니다.
          </p>
          <pre className={pre}>{`<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(jsonLd).replace(/</g, '\\\\u003c'),
  }}
/>`}</pre>
        </div>

        <div>
          <h5 className={h5}>4. 실무 주의사항</h5>
          <ul className="list-inside list-disc space-y-1 pl-1 text-zinc-600 dark:text-zinc-400">
            <li>
              React가 텍스트 자식을 자동 이스케이프하는 것과 달리 <code className={code}>dangerouslySetInnerHTML</code>은 문자열을
              그대로 내보냅니다. 상품 카드의 설명은 안전하지만 script 본문은 직접 처리해야 합니다.
            </li>
            <li>조직의 권장 방식이 있으면 따르고, 없으면 serialize-javascript 같은 검증된 직렬화 도구를 검토합니다.</li>
            <li>
              배포 후 결과는{' '}
              <a className="underline" href="https://search.google.com/test/rich-results" target="_blank" rel="noreferrer">
                Rich Results Test
              </a>{' '}
              또는{' '}
              <a className="underline" href="https://validator.schema.org/" target="_blank" rel="noreferrer">
                Schema Markup Validator
              </a>
              로 확인합니다 (이 데모는 외부 서비스를 호출하지 않습니다).
            </li>
            <li>타입이 필요하면 schema-dts 같은 커뮤니티 패키지로 <code className={code}>WithContext&lt;Product&gt;</code>를 붙일 수 있습니다.</li>
          </ul>
        </div>
      </div>
    </DemoDeepDiveCard>
  )
}
