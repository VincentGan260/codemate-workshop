import { useEffect, useState } from 'react'
import { ClipboardCheck, MessageCircle, Trophy, TrendingUp, Medal, BookOpen } from 'lucide-react'
import { getAssessmentQuestions, submitAssessment, tutorChat } from '../services/api'
import type { DiagnosisQuestion, AssessmentResult, TutorChatResponse } from '../types'

export default function Assessment() {
  const [questions, setQuestions] = useState<DiagnosisQuestion[]>([])
  const [tutorResp, setTutorResp] = useState<TutorChatResponse | null>(null)
  const [result, setResult] = useState<AssessmentResult | null>(null)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({})

  useEffect(() => {
    getAssessmentQuestions().then((res) => setQuestions(res.questions)).catch(() => {})
    tutorChat('递归调用栈如何理解？').then(setTutorResp).catch(() => {})
  }, [])

  const handleSubmit = async () => {
    const answers = Object.entries(selectedAnswers).map(([id, answer]) => ({
      question_id: id,
      answer,
    }))
    const res = await submitAssessment(answers)
    setResult(res)
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <ClipboardCheck className="w-6 h-6 text-primary-600" />
          <h1 className="text-2xl font-bold text-gray-900">辅导评估</h1>
        </div>
        <p className="text-sm text-gray-500">CodeBuddy 个性化辅导问答 + 小测评估 + 成长反馈。</p>
      </div>

      <div className="grid grid-cols-5 gap-6">
        {/* Left: Tutor Chat (3 cols) */}
        <div className="col-span-3 space-y-4">
          {tutorResp && (
            <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div className="space-y-3 flex-1">
                  <div>
                    <p className="text-sm font-medium text-gray-800 mb-1">CodeBuddy 辅导回答</p>
                    <p className="text-sm text-gray-600">{tutorResp.greeting}</p>
                    <p className="text-sm text-gray-500 mt-2 italic">{tutorResp.approach}</p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs font-medium text-gray-700 mb-2">讲解步骤：</p>
                    <ol className="space-y-1">
                      {tutorResp.steps.map((s, i) => (
                        <li key={i} className="text-xs text-gray-600 flex gap-2">
                          <span className="text-primary-500 font-medium">{i + 1}.</span> {s}
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-1">推荐资源：</p>
                    {tutorResp.recommended_resources.map((r) => (
                      <span key={r.title} className="inline-block px-2 py-0.5 bg-primary-50 text-primary-700 rounded-full text-xs mr-1.5 mb-1">
                        {r.title}
                      </span>
                    ))}
                  </div>

                  <div className="bg-amber-50 rounded-xl p-3 border border-amber-100">
                    <p className="text-xs font-medium text-amber-800">小练习：{tutorResp.suggested_exercise}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Assessment (2 cols) */}
        <div className="col-span-2 space-y-4">
          {/* Questions */}
          <div className="bg-white rounded-2xl p-4 shadow-card border border-gray-100">
            <h3 className="font-semibold text-gray-800 text-sm mb-3">轻量诊断题</h3>
            <div className="space-y-3">
              {questions.map((q) => (
                <div key={q.id} className="text-sm">
                  <p className="text-gray-700 mb-1.5 whitespace-pre-line">{q.question}</p>
                  <div className="space-y-1">
                    {q.options.map((opt) => (
                      <label
                        key={opt}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs cursor-pointer border transition-colors ${
                          selectedAnswers[q.id] === opt[0]
                            ? 'bg-primary-50 border-primary-300 text-primary-700'
                            : 'bg-gray-50 border-gray-100 text-gray-600 hover:border-gray-200'
                        }`}
                      >
                        <input
                          type="radio"
                          name={q.id}
                          value={opt[0]}
                          checked={selectedAnswers[q.id] === opt[0]}
                          onChange={(e) =>
                            setSelectedAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                          }
                          className="sr-only"
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {questions.length > 0 && (
              <button
                onClick={handleSubmit}
                className="mt-4 w-full py-2 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-xl text-sm font-medium hover:from-primary-600 hover:to-purple-700 transition-all"
              >
                提交答案
              </button>
            )}
          </div>

          {/* Results */}
          {result && (
            <div className="bg-white rounded-2xl p-4 shadow-card border border-gray-100 space-y-3">
              <h3 className="font-semibold text-gray-800 text-sm">评估结果</h3>

              {/* Score */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  <span className="text-2xl font-bold text-gray-800">{result.score}</span>
                  <span className="text-sm text-gray-400">/ {result.total}</span>
                </div>
                <div className="flex gap-1.5">
                  {result.badges.map((b) => (
                    <span key={b} className="flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 rounded-full text-[11px] font-medium">
                      <Medal className="w-3 h-3" /> {b}
                    </span>
                  ))}
                </div>
              </div>

              {/* Growth */}
              <div className="bg-green-50 rounded-xl p-3 border border-green-100">
                <div className="flex items-center gap-1.5 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-xs font-medium text-green-700">成长值变化</span>
                </div>
                <div className="flex gap-3">
                  {Object.entries(result.growth).map(([key, value]) => (
                    <span key={key} className="text-xs text-green-700 bg-white px-2 py-0.5 rounded-full">
                      {key === 'knowledge_base' ? '知识基础' : '实践能力'} +{value}
                    </span>
                  ))}
                </div>
              </div>

              {/* Remedial */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <BookOpen className="w-4 h-4 text-orange-500" />
                  <span className="text-xs font-medium text-gray-700">需要继续练习</span>
                </div>
                {result.remedial_resources.map((r) => (
                  <div key={r.knowledge_point} className="text-xs text-gray-500 ml-5 mb-1">
                    · {r.knowledge_point}：{r.reason}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
