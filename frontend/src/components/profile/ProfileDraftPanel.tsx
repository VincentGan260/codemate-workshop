import { CheckCircle2, Circle, AlertCircle, ArrowRight, FileText } from 'lucide-react'

interface FieldDef {
  key: string
  label: string
}

interface ProfileDraftPanelProps {
  collectedFields: string[]
  missingFields: string[]
  allFields: FieldDef[]
  canStartDiagnosis: boolean
  canGenerateProfile: boolean
  diagnosisSubmitted: boolean
  onStartDiagnosis?: () => void
  onGenerateProfile?: () => void
}

export default function ProfileDraftPanel({
  collectedFields,
  missingFields,
  allFields,
  canStartDiagnosis,
  canGenerateProfile,
  diagnosisSubmitted,
  onStartDiagnosis,
  onGenerateProfile,
}: ProfileDraftPanelProps) {
  const collectedCount = collectedFields.length
  const totalCount = allFields.length

  return (
    <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-4 space-y-4">
      {/* Title + Progress */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-800">画像草稿</h3>
          <span className="text-xs text-gray-400">
            {collectedCount} / {totalCount}
          </span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-400 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${(collectedCount / totalCount) * 100}%` }}
          />
        </div>
      </div>

      {/* Collected fields */}
      {collectedFields.length > 0 && (
        <div>
          <p className="text-[11px] text-gray-400 font-medium mb-1.5 uppercase tracking-wide">已收集字段</p>
          <div className="space-y-1">
            {allFields
              .filter((f) => collectedFields.includes(f.key))
              .map((f) => (
                <div key={f.key} className="flex items-center gap-2 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                  <span className="text-gray-600">{f.label}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Missing fields */}
      {missingFields.length > 0 && (
        <div>
          <p className="text-[11px] text-gray-400 font-medium mb-1.5 uppercase tracking-wide">仍缺失字段</p>
          <div className="space-y-1">
            {allFields
              .filter((f) => missingFields.includes(f.key))
              .map((f) => (
                <div key={f.key} className="flex items-center gap-2 text-xs">
                  <Circle className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                  <span className="text-gray-400">{f.label}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Diagnosis status */}
      {diagnosisSubmitted && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-50 border border-green-100">
          <CheckCircle2 className="w-4 h-4 text-green-500" />
          <span className="text-xs text-green-700 font-medium">诊断题已完成</span>
        </div>
      )}

      {/* Action buttons */}
      {canStartDiagnosis && !diagnosisSubmitted && onStartDiagnosis && (
        <button
          onClick={onStartDiagnosis}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-colors"
        >
          <FileText className="w-4 h-4" />
          进入诊断题
          <ArrowRight className="w-4 h-4" />
        </button>
      )}

      {canGenerateProfile && onGenerateProfile && (
        <button
          onClick={onGenerateProfile}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-purple-600 text-white text-sm font-medium hover:shadow-glow transition-all"
        >
          <AlertCircle className="w-4 h-4" />
          生成学习画像
        </button>
      )}
    </div>
  )
}
