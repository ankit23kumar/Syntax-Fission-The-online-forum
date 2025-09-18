// src/routes/AppRoutes.jsx

import React from "react";
import { Routes, Route, Outlet  } from "react-router-dom";

// --- Import Layouts ---
import MainLayout from "../layouts/MainLayout";
import AdminProfile from '../pages/AdminProfile';
// --- Import Page Components ---
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import RegisterStep2 from "../pages/Register2";
import Dashboard from "../pages/Dashboard";
import NewQuestions from "../pages/NewQuestions";
import AskQuestion from "../pages/AskQuestion";
import QuestionView from "../pages/QuestionView";
import NotificationsPage from "../pages/NotificationsPage";
import ContactPage from "../pages/ContactPage";
import AboutPage from "../pages/AboutPage";
import FeaturesPage from "../pages/FeaturesPage";
import AdminDashboard from "../pages/AdminDashboard";
import AdminUsers from "../pages/AdminUsers";
import RequireAdmin from "../components/RequireAdmin";
import Forbidden from "../pages/Forbidden";
import AdminQuestions from "../pages/AdminQuestions";
import AdminTags from "../pages/AdminTags";
import Unauthorized from "../pages/Unauthorized";
import AdminNotifications from "../pages/AdminNotifications";
import AdminAnswers from "../pages/AdminAnswers";
import AdminVotes from "../pages/AdminVotes";

// Helper component to wrap pages in the MainLayout
const withLayout = (Component) => (
  <MainLayout>
    <Component />
  </MainLayout>
);

const AppRoutes = () => {
  return (
    <Routes>
      {/* --- Public Routes --- */}
      {/* Home is a special case with no standard layout */}
      <Route path="/" element={<Home />} />

      {/* These pages use the MainLayout but have no sidebar */}
      <Route path="/login" element= {<Login/>} />
      <Route path="/register" element={<Register/>} />
      <Route path="/register/step-2" element={<RegisterStep2/>} />

      {/* --- User-only Routes (with sidebar) --- */}
      <Route path="/dashboard/*" element={withLayout(Dashboard)} />
      <Route path="/new-questions" element={withLayout(NewQuestions)} />
      <Route path="/ask-question" element={withLayout(AskQuestion)} />
      <Route path="/questions/:questionId" element={withLayout(QuestionView)} />
      <Route path="/notifications" element={withLayout(NotificationsPage)} />
      <Route path="/contact" element={withLayout(ContactPage)} />
      <Route path="/about" element={withLayout(AboutPage)} />
      <Route path="/features" element={withLayout(FeaturesPage)} />
       {/* --- Admin-only Routes --- */}
      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <MainLayout>
              <Outlet />
            </MainLayout>
          </RequireAdmin>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="profile/*" element={<AdminProfile />} /> 
        <Route path="users" element={<AdminUsers />} />
        <Route path="questions" element={<AdminQuestions />} />
        <Route path="tags" element={<AdminTags />} />
        <Route path="notifications" element={<AdminNotifications />} />
        <Route path="answers" element={<AdminAnswers />} />
        <Route path="votes" element={<AdminVotes />} />
      </Route>
      {/* --- Error Routes --- */}
      <Route path="/403" element={withLayout(Forbidden)} />
      <Route path="/unauthorized" element={withLayout(Unauthorized)} />
      
      {/* Optional: Add a 404 Not Found route */}
      {/* <Route path="*" element={withLayout(NotFoundPage)} /> */}
    </Routes>
  );
};

export default AppRoutes;