import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import RegisterStep2 from "../pages/Register2";
import Dashboard from "../pages/Dashboard";
import NewQuestions from "../pages/NewQuestions";
import AskQuestion from "../pages/AskQuestion";
import QuestionView from "../pages/QuestionView";
import NotificationsPage from "../pages/NotificationsPage";
import AdminDashboard from "../pages/AdminDashboard";
import AdminUsers from "../pages/AdminUsers";
import RequireAdmin from "../components/RequireAdmin";
import Forbidden from "../pages/Forbidden";
import AdminQuestions from "../pages/AdminQuestions";
import AdminTags from "../pages/AdminTags";
import Unauthorized from "../pages/Unauthorized";
import AdminLayout from "../pages/AdminLayout";
import AdminNotifications from "../pages/AdminNotifications"
import AdminAnswers from "../pages/AdminAnswers"
import AdminVotes from "../pages/AdminVotes"
import VerifyEmailPage from "../pages/VerifyEmailPage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/register/step-2" element={<RegisterStep2 />} />
      <Route path="/verify-email/:uidb64/:token/" element={<VerifyEmailPage />} />
      {/* User-only */}
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/new-questions" element={<NewQuestions />} />
      <Route path="/ask-question" element={<AskQuestion />} />
      <Route path="/questions/:questionId" element={<QuestionView />} />
      <Route path="/notifications" element={<NotificationsPage />} />

      {/* Admin-only */}
      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="questions" element={<AdminQuestions />} />
        <Route path="tags" element={<AdminTags />} />
        <Route path="notifications" element={<AdminNotifications />} />
        <Route path="answers" element={<AdminAnswers />} />
        <Route path="votes" element={<AdminVotes />} />
      </Route>
      {/* Errors */}
      <Route path="/403" element={<Forbidden />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
    </Routes>
  );
};

export default AppRoutes;
