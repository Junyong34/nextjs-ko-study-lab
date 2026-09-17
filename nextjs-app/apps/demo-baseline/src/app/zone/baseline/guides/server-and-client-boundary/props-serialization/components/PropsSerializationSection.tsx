'use client'
import React, { useState } from 'react'
import { DemoPlaygroundCard } from '@study/demo-kit'
import { NonSerializablePropExamples } from './NonSerializablePropExamples'
import { PropsSerializationDemo } from './PropsSerializationDemo'
import { VerificationFooter } from './VerificationFooter'

interface PropsSerializationSectionProps {
  data: {
    id: string
    name: string
    price: number
    tags: string[]
    createdAt: Date
  }
}

export function PropsSerializationSection({ data }: PropsSerializationSectionProps) {
  const [check, setCheck] = useState<{ isRealDate: boolean; year: number } | null>(null)

  return (
    <>
      <DemoPlaygroundCard title="Props 직렬화 경계 및 안전한 전달 실습">
        <PropsSerializationDemo data={data} onCheck={(isRealDate, year) => setCheck({ isRealDate, year })} />
        <NonSerializablePropExamples />
      </DemoPlaygroundCard>
      <VerificationFooter
        isMatched={check ? check.isRealDate : undefined}
        actual={check ? `- Date 전달: data.createdAt instanceof Date = ${check.isRealDate}\n- Date 복원: getFullYear() = ${check.year}\n- 일반 함수·클래스 인스턴스: 아래 재현 경로에서 Flight가 전달을 거부함` : undefined}
        expected="Date는 Server Component에서 Client Component로 전달된 뒤에도 Date 인스턴스로 복원된다. 일반 함수와 사용자 정의 클래스 인스턴스는 각각의 재현 경로에서 RSC 직렬화 오류가 발생해야 한다."
      />
    </>
  )
}
