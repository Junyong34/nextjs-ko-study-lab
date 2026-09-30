import React from 'react'
import { DemoDeepDiveCard } from '@study/demo-kit'

export function ConceptSummary() {
  return (
    <DemoDeepDiveCard title="조건부 슬롯은 무엇을 결정하는가">
      <div className="space-y-3 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <p>이 예제의 <code>layout.tsx</code>는 서버에서 <code>cookies()</code>로 <code>demo_role</code>을 읽고, 값이 admin이면 <code>admin</code> 슬롯을, 아니면 <code>user</code> 슬롯을 반환합니다. 역할 버튼은 Server Action으로 쿠키를 저장하고, 저장 직후 현재 경로가 서버에서 다시 렌더링되어 슬롯이 바뀝니다.</p>
        <p><strong>슬롯은 둘 다 실행됩니다.</strong> 공식 문서에 따르면 두 슬롯이 모두 서버에서 렌더링되고, layout이 무엇을 반환하는지는 사용자에게 보이는 것만 정합니다. <code>@admin/page.tsx</code>의 데이터 조회는 일반 사용자 요청에서도 실행되고, 그 결과가 응답에 포함될 수 있습니다. 그래서 이 분기는 화면 구성용이고 접근 통제가 아닙니다. 권한 검사는 각 슬롯의 page나 Data Access Layer 안에서 해야 합니다.</p>
        <p><strong>쿠키는 브라우저가 바꿀 수 있는 값</strong>입니다. '쿠키만 admin으로 바꾸기'로 확인했듯이 쿠키를 고쳐도 서버가 다시 그리기 전까지 화면은 그대로이고, 사용자가 직접 admin 쿠키를 넣어도 이 예제는 막지 못합니다. 실제 서비스에서는 서명된 세션에서 역할을 읽어야 합니다.</p>
        <p>슬롯 폴더 이름(<code>@admin</code>, <code>@user</code>)은 URL에 나타나지 않고, 슬롯 값은 <code>children</code>과 같은 방식으로 layout의 props로 전달됩니다. 이 예제에는 <code>@admin/default.tsx</code>, <code>@user/default.tsx</code>가 있어 하위 경로로 새로고침해도 슬롯이 비어 404가 되지 않습니다.</p>
      </div>
    </DemoDeepDiveCard>
  )
}
