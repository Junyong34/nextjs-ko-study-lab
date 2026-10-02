'use client'

import { useState } from 'react'

interface Question {
  correct: number
}

/** 개념 확인 문항의 선택·제출·초기화 상태. 판정은 사용자가 고른 답과 정답 번호만 비교한다. */
export function useConceptQuiz(questions: Question[]) {
  const [answers, setAnswers] = useState<(number | null)[]>(() => questions.map(() => null))
  const [submitted, setSubmitted] = useState(false)
  const complete = answers.every((answer) => answer !== null)
  const correctCount = questions.filter((question, index) => answers[index] === question.correct).length

  return {
    answers,
    submitted,
    complete,
    correctCount,
    select(index: number, choice: number) {
      setAnswers((prev) => prev.map((answer, i) => (i === index ? choice : answer)))
      setSubmitted(false)
    },
    submit: () => setSubmitted(true),
    reset() {
      setAnswers(questions.map(() => null))
      setSubmitted(false)
    },
  }
}

export type ConceptQuizState = ReturnType<typeof useConceptQuiz>
