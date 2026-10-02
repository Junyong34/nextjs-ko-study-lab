'use client'
import { useState } from 'react'
import { content } from '../content'

export function useQuiz() {
  const [answers, setAnswers] = useState<(number | null)[]>(content.questions.map(() => null))
  const [submitted, setSubmitted] = useState(false)
  const complete = answers.every((answer) => answer !== null)
  const correctCount = content.questions.filter((question, index) => answers[index] === question.correct).length

  return {
    answers,
    submitted,
    complete,
    correctCount,
    select(index: number, choice: number) {
      setAnswers((previous) => previous.map((answer, i) => (i === index ? choice : answer)))
      setSubmitted(false)
    },
    submit: () => setSubmitted(true),
    reset() {
      setAnswers(content.questions.map(() => null))
      setSubmitted(false)
    },
  }
}

export type QuizState = ReturnType<typeof useQuiz>
