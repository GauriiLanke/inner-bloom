import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import ChatbotWidget from './components/ChatbotWidget'

import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Assessment from './pages/Assessment'
import Results from './pages/Results'
import Recommendations from './pages/Recommendations'
import DietPlan from './pages/DietPlan'
import Reminders from './pages/Reminders'
import Doctors from './pages/Doctors'
import Dashboard from './pages/Dashboard'
import Feedback from './pages/Feedback'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Toaster position="top-center" />
      <ChatbotWidget />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/results" element={<Results />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/diet" element={<DietPlan />} />
          <Route path="/reminders" element={<Reminders />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/feedback" element={<Feedback />} />
        </Route>

        <Route path="*" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  )
}
