import { useState, useCallback } from 'react'
import { UserRound } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import CodeBuddyAvatar from '../components/profile/CodeBuddyAvatar'
import ChatPanel from '../components/profile/ChatPanel'
import ProfileDraftPanel from '../components/profile/ProfileDraftPanel'
import DiagnosisQuiz from '../components/profile/DiagnosisQuiz'
import LearningProfileCard from '../components/profile/LearningProfileCard'
import { isDemoMode } from '../config/appConfig'
import {
  createInitialState,
  processMessage,
  startDiagnosis,
  submitDiagnosis,
  generateProfile,
  applyDemoFill,
  ALL_FIELDS,
  type InterviewState,
} from '../services/profileInterview'

type BuddyState = 'welcome' | 'thinking' | 'generating'

export default function Profile() {
  const [state, setState] = useState<InterviewState>(createInitialState)
  const [buddyState, setBuddyState] = useState<BuddyState>('welcome')
  const [diagnosisAnswers, setDiagnosisAnswers] = useState<Record<string, string>>({})

  const conversationFields = ALL_FIELDS.filter((f) => f.key !== 'diagnosis_result').map((f) => f.key)
  const collectedConvFields = conversationFields.filter((k) => k in state.collectedFields)
  const missingConvFields = conversationFields.filter((k) => !(k in state.collectedFields))

  const isChatActive = state.stage === 'collecting' || state.stage === 'greeting'
  const demoMode = isDemoMode()
  const showDemoBtn = demoMode && state.stage === 'collecting' && Object.keys(state.collectedFields).length === 0

  // ---- Handlers ----

  const handleSend = useCallback((text: string) => {
    if (!isChatActive) return

    setBuddyState('thinking')

    // Simulate processing delay then advance
    setTimeout(() => {
      setState((prev) => processMessage(prev, text))
      setBuddyState('welcome')
    }, 800)
  }, [isChatActive])

  const handleDemoFill = useCallback(() => {
    setBuddyState('thinking')
    setTimeout(() => {
      setState((prev) => applyDemoFill(prev))
      setBuddyState('welcome')
    }, 500)
  }, [])

  const handleStartDiagnosis = useCallback(() => {
    setState((prev) => startDiagnosis(prev))
  }, [])

  const handleDiagnosisSubmit = useCallback((answers: Record<string, string>) => {
    setDiagnosisAnswers(answers)
    setBuddyState('generating')
    setTimeout(() => {
      setState((prev) => submitDiagnosis(prev, answers))
      setBuddyState('welcome')
    }, 600)
  }, [])

  const handleGenerateProfile = useCallback(() => {
    setBuddyState('generating')
    setTimeout(() => {
      setState((prev) => generateProfile(prev))
      setBuddyState('welcome')
    }, 1500)
  }, [])

  // ---- Render ----

  const buddyStateForAvatar: BuddyState =
    state.stage === 'generating' ? 'generating' : buddyState

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-2">
        <UserRound className="w-6 h-6 text-primary-600" />
        <h1 className="text-2xl font-bold text-gray-900">学习画像</h1>
      </div>

      <AnimatePresence mode="wait">
        {state.stage !== 'complete' ? (
          /* ===== Chat / Diagnosis Phase ===== */
          <motion.div
            key="build-phase"
            className="grid grid-cols-12 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Left: CodeBuddy + Chat */}
            <div className="col-span-7 space-y-4">
              {/* CodeBuddy Avatar */}
              <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-5">
                <CodeBuddyAvatar state={buddyStateForAvatar} />
                {showDemoBtn && (
                  <motion.button
                    onClick={handleDemoFill}
                    className="mt-3 w-full py-2 rounded-xl border border-dashed border-primary-300 text-primary-500 text-xs font-medium hover:bg-primary-50 transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    使用李同学示例 →
                  </motion.button>
                )}
              </div>

              {/* Chat or Diagnosis */}
              <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
                {state.stage === 'diagnosis' ? (
                  <div className="p-4">
                    <p className="text-sm font-semibold text-gray-800 mb-1">轻量诊断题</p>
                    <p className="text-xs text-gray-400 mb-4">
                      回答以下 {state.diagnosisQuestions.length} 道题，帮助 CodeBuddy 更准确地了解你的知识基础
                    </p>
                    <DiagnosisQuiz
                      questions={state.diagnosisQuestions}
                      onSubmit={handleDiagnosisSubmit}
                      submitted={state.diagnosisEvaluated}
                      userAnswers={diagnosisAnswers}
                    />
                  </div>
                ) : (
                  <ChatPanel
                    messages={state.messages}
                    onSend={handleSend}
                    disabled={!isChatActive}
                    hint={
                      state.stage === 'ready_for_diagnosis'
                        ? '点击右侧「进入诊断题」继续'
                        : state.stage === 'ready_for_profile'
                          ? '点击右侧「生成学习画像」查看完整画像'
                          : undefined
                    }
                    currentRound={collectedConvFields.length}
                    totalRounds={conversationFields.length}
                  />
                )}
              </div>
            </div>

            {/* Right: Profile Draft */}
            <div className="col-span-5">
              <ProfileDraftPanel
                collectedFields={Object.keys(state.collectedFields)}
                missingFields={missingConvFields.concat(
                  state.diagnosisEvaluated ? [] : ['diagnosis_result']
                )}
                allFields={ALL_FIELDS}
                canStartDiagnosis={state.stage === 'ready_for_diagnosis'}
                canGenerateProfile={state.stage === 'ready_for_profile'}
                diagnosisSubmitted={state.diagnosisEvaluated}
                onStartDiagnosis={handleStartDiagnosis}
                onGenerateProfile={handleGenerateProfile}
              />
            </div>
          </motion.div>
        ) : (
          /* ===== Profile Display Phase ===== */
          <motion.div
            key="profile-phase"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {state.finalProfile && <LearningProfileCard profile={state.finalProfile} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
