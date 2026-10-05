'use client'

import React, { use } from 'react'
import { useProductSeed } from '../../../components/ProductSeedProvider'
import { useDetailLoader } from '../../../hooks/useDetailLoader'
import { ModalFrame } from '../../../components/ModalFrame'
import { ModalVerification } from '../../../components/ModalVerification'
import { BodySkeleton, DetailBody, HeaderSkeleton, SummaryHeader } from '../../../components/ProductView'
import { DETAIL_DELAY_MS } from '../../../constants'

/**
 * 가로챈 화면. 서버 조회·generateMetadata가 없다 — 목록에서 받은 요약(seed)을 바로 그리고,
 * 요약에 없는 본문만 클라이언트가 받아 채운다. 서버 응답을 기다리느라 이동이 막히지 않게 하는 구조다.
 */
export default function InterceptedProductModal({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const seed = useProductSeed(id)
  const loader = useDetailLoader(id, seed !== null)
  const { detail, failed } = loader

  const header = seed ?? detail
  return (
    <ModalFrame id={id}>
      {header ? <SummaryHeader summary={header} /> : failed ? null : <HeaderSkeleton />}
      {detail ? (
        <DetailBody detail={detail} />
      ) : failed ? (
        <p className="text-xs text-rose-600">상품 정보를 불러오지 못했습니다.</p>
      ) : (
        <BodySkeleton label={`상세는 서버에서 받아오는 중입니다 (학습용 지연 ${DETAIL_DELAY_MS / 1000}초)`} />
      )}
      <ModalVerification hasSeed={seed !== null} loader={loader} />
    </ModalFrame>
  )
}
