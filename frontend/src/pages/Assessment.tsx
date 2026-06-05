import { useState, useCallback, useMemo } from 'react'
import { ClipboardCheck } from 'lucide-react'
import TutorChatWindow from '../components/assessment/TutorChatWindow'
import ChallengePanel from '../components/assessment/ChallengePanel'
import AssessmentResourceDetailModal from '../components/assessment/AssessmentResourceDetailModal'
import type { AssessmentResource } from '../components/assessment/AssessmentResourceDetailModal'
import { inferConversationContextMock } from '../mock/assessment'
import AnimatedSection from '../components/common/AnimatedSection'

export default function Assessment() {
  const [lastQuestion, setLastQuestion] = useState('')
  const [detailResource, setDetailResource] = useState<AssessmentResource | null>(null)

  const context = useMemo(() => inferConversationContextMock(lastQuestion), [lastQuestion])

  const handleViewResource = useCallback((resource: AssessmentResource) => {
    setDetailResource(resource)
  }, [])

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <AnimatedSection>
        <div className="flex items-center gap-2">
          <ClipboardCheck className="w-6 h-6 text-primary-600" />
          <h1 className="text-2xl font-bold text-gray-900">智能辅导与学习评估</h1>
        </div>
      </AnimatedSection>

      {/* Main layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left: Chat Window (7 cols) */}
        <div className="col-span-7">
          <AnimatedSection delay={0.05}>
            <TutorChatWindow
              onQuestionAsked={setLastQuestion}
              onViewResource={handleViewResource}
            />
          </AnimatedSection>
        </div>

        {/* Right: Challenge Panel (5 cols) */}
        <div className="col-span-5">
          <AnimatedSection delay={0.1} direction="right">
            <ChallengePanel
              context={context}
              onViewResource={handleViewResource}
            />
          </AnimatedSection>
        </div>
      </div>

      {/* Resource Detail Modal */}
      <AssessmentResourceDetailModal
        resource={detailResource}
        onClose={() => setDetailResource(null)}
      />
    </div>
  )
}
