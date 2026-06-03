import type {
  ProfileChatResponse,
  StudentProfile,
  CourseListResponse,
  Course,
  ResourceGenerateResponse,
  LearningPathResponse,
  DiagnosisQuestion,
  AssessmentResult,
  TutorChatResponse,
} from '../types'
import { mockProfileChat, mockStudentProfile } from '../mock/profile'
import { mockCourses } from '../mock/courses'
import { mockResources, generateResourcesMock } from '../mock/resources'
import type { ResourceGenerateParams } from '../types'
import { mockLearningPath } from '../mock/path'
import { mockQuestions, mockAssessmentResult, mockTutorResponse } from '../mock/assessment'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'
const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api'

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`)
  }
  return res.json()
}

// ========== Profile ==========

export async function profileChat(message: string, history: Array<{ role: string; content: string }> = []) {
  if (USE_MOCK) return mockProfileChat
  return request<ProfileChatResponse>('/profile/chat', {
    method: 'POST',
    body: JSON.stringify({ message, history }),
  })
}

export async function generateProfile() {
  if (USE_MOCK) return mockStudentProfile
  return request<StudentProfile>('/profile/generate', { method: 'POST', body: '{}' })
}

// ========== Courses ==========

export async function getCourses() {
  if (USE_MOCK) return mockCourses
  return request<CourseListResponse>('/courses')
}

export async function getCourseById(courseId: string) {
  if (USE_MOCK) {
    const course = mockCourses.courses.find((c) => c.id === courseId)
    if (!course) throw new Error(`Course '${courseId}' not found`)
    return course
  }
  return request<Course>(`/courses/${courseId}`)
}

// ========== Resources ==========

export async function generateResources(params: ResourceGenerateParams) {
  if (USE_MOCK) return { resource_cards: generateResourcesMock(params) }
  return request<ResourceGenerateResponse>('/resources/generate', {
    method: 'POST',
    body: JSON.stringify(params),
  })
}

// ========== Learning Path ==========

export async function generatePath() {
  if (USE_MOCK) return mockLearningPath
  return request<LearningPathResponse>('/path/generate', { method: 'POST', body: '{}' })
}

// ========== Tutor ==========

export async function tutorChat(message: string) {
  if (USE_MOCK) return mockTutorResponse
  return request<TutorChatResponse>('/tutor/chat', {
    method: 'POST',
    body: JSON.stringify({ message }),
  })
}

// ========== Assessment ==========

export async function getAssessmentQuestions() {
  if (USE_MOCK) return { questions: mockQuestions }
  return request<{ questions: DiagnosisQuestion[] }>('/assessment/questions')
}

export async function submitAssessment(answers: Array<{ question_id: string; answer: string }>) {
  if (USE_MOCK) return mockAssessmentResult
  return request<AssessmentResult>('/assessment/submit', {
    method: 'POST',
    body: JSON.stringify({ answers }),
  })
}
