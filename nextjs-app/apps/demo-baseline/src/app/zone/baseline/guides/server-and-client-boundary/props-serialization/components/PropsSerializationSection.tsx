'use client'
import React, { useState } from 'react'
import { DemoPlaygroundCard } from '@study/demo-kit'
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
      </DemoPlaygroundCard>
      <VerificationFooter
        isMatched={check ? check.isRealDate : undefined}
        actual={check ? `- data.createdAt instanceof Date: ${check.isRealDate}\n- getFullYear(): ${check.year}` : undefined}
        expected="서버 컴포넌트에서 생성한 Date 인스턴스가 RSC 경계를 넘어 클라이언트에서도 진짜 Date 인스턴스로 유지되어야 한다."
      />
    </>
  )
}
