interface SuggestedQuestionsProps {
  questions: string[]
  onSelect: (question: string) => void
}

export default function SuggestedQuestions({ questions, onSelect }: SuggestedQuestionsProps) {
  return (
    <div>
      <p className="text-[10px] text-gray-400 mb-2">试试这些问题：</p>
      <div className="flex flex-wrap gap-1.5">
        {questions.map((q) => (
          <button
            key={q}
            onClick={() => onSelect(q)}
            className="px-2.5 py-1.5 rounded-full text-[10px] bg-gray-50 border border-gray-100 text-gray-500 hover:border-primary-200 hover:text-primary-600 hover:bg-primary-50/50 transition-colors text-left leading-relaxed"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  )
}
