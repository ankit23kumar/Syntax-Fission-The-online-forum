import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import RegisterStep2 from '../pages/Register2'
// import Dashboard from '../pages/Dashboard'
import Profile from '../pages/Profile'
import NewQuestions from '../pages/NewQuestions'
import AskQuestion from '../pages/AskQuestion'
import QuestionView from '../pages/QuestionView'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/register/step-2" element={<RegisterStep2 />} />
      <Route path="/profile" element={<Profile />} /> 
      {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      <Route path="/new-questions" element={<NewQuestions />} />
      <Route path="/ask-question" element={<AskQuestion/>} />
      <Route path="/question-view" element={<QuestionView/>} />
    </Routes>
  )
}

export default AppRoutes
