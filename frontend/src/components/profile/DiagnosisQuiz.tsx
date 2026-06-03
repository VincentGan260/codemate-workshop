import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, Lightbulb } from 'lucide-react'
import type { DiagnosisQuestion } from '../../types'

interface DiagnosisQuizProps {
  questions: DiagnosisQuestion[]
  onSubmit: (answers: Record<string, string>) => void
  submitted: boolean
  userAnswers?: Record<string, string>
}

export default function DiagnosisQuiz({ questions, onSubmit, submitted, userAnswers = {} }: DiagnosisQuizProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [currentIdx, setCurrentIdx] = useState(0)

  const allAnswered = questions.every((q) => answers[q.id])

  const selectOption = (questionId: string, option: string) => {
    if (submitted) return
    setAnswers((prev) => ({ ...prev, [questionId]: option }))
  }

  const handleSubmit = () => {
    if (!allAnswered) return
    onSubmit(answers)
  }

  const question = questions[currentIdx]

  if (!question) return null

  return (
    <div className="space-y-4">
      {/* Question tabs */}
      <div className="flex gap-1.5">
        {questions.map((q, i) => {
          const answered = submitted ? true : !!answers[q.id]
          const correct = submitted && userAnswers[q.id] === q.correct
          return (
            <button
              key={q.id}
              onClick={() => setCurrentIdx(i)}
              className={`w-8 h-8 rounded-full text-xs font-medium transition-colors ${
                currentIdx === i
                  ? 'bg-primary-500 text-white'
                  : submitted
                    ? correct
                      ? 'bg-green-100 text-green-600'
                      : 'bg-red-50 text-red-500'
                    : answered
                      ? 'bg-primary-50 text-primary-600'
                      : 'bg-gray-100 text-gray-400'
              }`}
            >
              {i + 1}
            </button>
          )
        })}
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          className="bg-white rounded-2xl border border-gray-100 p-5"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] text-primary-500 font-medium bg-primary-50 px-2 py-0.5 rounded-full">
              {question.knowledge_point}
            </span>
          </div>
          <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line mb-4">
            {question.question}
          </p>

          <div className="space-y-2">
            {question.options.map((opt) => {
              const isSelected = (submitted ? userAnswers[question.id] : answers[question.id]) === opt
              const isCorrect = submitted && opt === question.correct
              const isWrong = submitted && isSelected && opt !== question.correct

              return (
                <button
                  key={opt}
                  onClick={() => selectOption(question.id, opt)}
                  disabled={submitted}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm border transition-colors ${
                    isCorrect
                      ? 'border-green-300 bg-green-50 text-green-700'
                      : isWrong
                        ? 'border-red-300 bg-red-50 text-red-700'
                        : isSelected
                          ? 'border-primary-300 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{opt}</span>
                    {isCorrect && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                    {isWrong && <XCircle className="w-4 h-4 text-red-500" />}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Explanation after submit */}
          {submitted && (
            <motion.div
              className="mt-4 flex items-start gap-2 px-3 py-2.5 rounded-xl bg-amber-50 border border-amber-100"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800">{question.explanation}</p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Prev/Next + Submit */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
          disabled={currentIdx === 0}
          className="text-xs text-gray-400 hover:text-gray-600 disabled:opacity-30 transition-colors"
        >
          ← 上一题
        </button>

        {currentIdx < questions.length - 1 ? (
          <button
            onClick={() => setCurrentIdx(currentIdx + 1)}
            className="text-xs text-primary-500 hover:text-primary-700 font-medium transition-colors"
          >
            下一题 →
          </button>
        ) : (
          !submitted && (
            <button
              onClick={handleSubmit}
              disabled={!allAnswered}
              className="px-5 py-2 rounded-xl bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              提交诊断
            </button>
          )
        )}
      </div>
    </div>
  )
}
