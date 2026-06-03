// ========== Student & Profile ==========

export interface StudentInfo {
  name: string
  grade: string
  major: string
  background: string
}

export interface ProfileDimension {
  label: string
  stars?: number
  score?: number
  max_score?: number
  note?: string
  tags?: string[]
}

export interface StudentProfile {
  student: StudentInfo
  profile: Record<string, ProfileDimension>
}

export interface ProfileChatResponse {
  message: string
  extracted_fields: Record<string, unknown>
  missing_fields: string[]
}

// ========== Courses ==========

export interface Course {
  id: string
  name: string
  description: string
  stage: string
  prerequisites: string[]
  related_courses: string[]
  knowledge_points: string[]
  resource_types: string[]
  positioning?: '重点演示' | '课程群支撑'
  typical_difficulties?: string[]
  learning_suggestion?: string
  color?: string
}

export interface CourseListResponse {
  courses: Course[]
}

// ========== Resources ==========

export interface ResourceCard {
  id: string
  title: string
  type: string
  course: string
  knowledge_point: string
  difficulty: string
  language: string
  summary: string
}

export interface ResourceGenerateResponse {
  resource_cards: ResourceCard[]
}

// ========== Learning Path ==========

export interface PathNode {
  id: string
  name: string
  course: string
  goal: string
  duration: string
  status: 'pending' | 'in_progress' | 'completed'
}

export interface LearningPathResponse {
  name: string
  nodes: PathNode[]
}

// ========== Assessment ==========

export interface DiagnosisQuestion {
  id: string
  question: string
  options: string[]
  correct: string
  knowledge_point: string
  explanation: string
}

export interface AssessmentResult {
  score: number
  total: number
  growth: Record<string, number>
  badges: string[]
  remedial_resources: Array<{
    knowledge_point: string
    reason: string
  }>
}

export interface TutorChatResponse {
  greeting: string
  approach: string
  steps: string[]
  code_example: string | null
  recommended_resources: Array<{ title: string; url: string }>
  suggested_exercise: string
}
