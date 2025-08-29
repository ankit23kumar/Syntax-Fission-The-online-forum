// src/pages/VerifyEmailPage.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { verifyEmail, loginUser } from "../services/authService";
import "../styles/VerifyEmailPage.css";

const VerifyEmailPage = () => {
  const { uidb64, token } = useParams();
  const [status, setStatus] = useState("verifying");
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      try {
        await verifyEmail(uidb64, token);
        setStatus("success");
      } catch {
        setStatus("error");
      }
    };
    run();
  }, [uidb64, token]);

  // 🔑 Manual auto-login
  const handleContinue = async () => {
    const creds = JSON.parse(localStorage.getItem("registerCreds"));
    if (creds?.email && creds?.password) {
      try {
        const res = await loginUser(creds.email, creds.password);
        const { access, refresh, user_id, name, email } = res.data;
        localStorage.setItem("access", access);
        localStorage.setItem("refresh", refresh);
        localStorage.setItem("user", JSON.stringify({ user_id, name, email }));
        navigate("/register2");
      } catch (err) {
        console.error("Login failed:", err);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="verify-page">
      <div className="verification-card">
        {status === "verifying" && (
          <>
            <h4>Verifying your email...</h4>
            <div className="spinner-border text-primary mt-3" />
          </>
        )}
        {status === "success" && (
          <>
            <h4 className="text-success">✅ Your email has been verified!</h4>
            <p className="text-muted">You may now continue your registration.</p>
            <button className="btn btn-primary mt-3" onClick={handleContinue}>
              Continue Registration
            </button>
          </>
        )}
        {status === "error" && (
          <>
            <h4 className="text-danger">❌ Verification Failed</h4>
            <p className="text-muted">The link is invalid or expired.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
