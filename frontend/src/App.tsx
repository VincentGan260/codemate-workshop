import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import CourseCenter from './pages/CourseCenter'
import ResourceGen from './pages/ResourceGen'
import LearningPath from './pages/LearningPath'
import Assessment from './pages/Assessment'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/courses" element={<CourseCenter />} />
        <Route path="/resources" element={<ResourceGen />} />
        <Route path="/path" element={<LearningPath />} />
        <Route path="/assessment" element={<Assessment />} />
      </Routes>
    </Layout>
  )
}
