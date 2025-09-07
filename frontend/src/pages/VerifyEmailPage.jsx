// src/pages/VerifyEmailPage.jsx

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom"; // Import Link
import { verifyEmail } from "../services/authService";
import { useToast } from "../contexts/ToastContext";
import "../styles/VerifyEmailPage.css";

const VerifyEmailPage = () => {
  const { uidb64, token } = useParams();
  const [status, setStatus] = useState("verifying");
  const { showToast } = useToast();

  useEffect(() => {
    const handleVerification = async () => {
      if (!uidb64 || !token) {
        setStatus("error");
        showToast("The verification link is invalid or incomplete.", "danger");
        return;
      }
      try {
        // This logs the user in on THIS browser by saving tokens to localStorage
        await verifyEmail(uidb64, token);
        setStatus("success");
        showToast("Email verified successfully!", "success");
      } catch (err) {
        setStatus("error");
        const errorMessage = err?.detail || "Verification failed. The link may be expired or invalid.";
        showToast(errorMessage, "danger");
      }
    };

    handleVerification();
  }, [uidb64, token, showToast]);

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
            <p className="text-muted">You are now logged in on this browser.</p>
            {/* THIS IS THE MANUAL LINK YOU REQUESTED */}
            <Link to="/register/step-2" className="btn btn-primary mt-3">
              Complete Your Profile
            </Link>
          </>
        )}
        {status === "error" && (
          <>
            <h4 className="text-danger">❌ Verification Failed</h4>
            <p className="text-muted">The link is invalid or has expired.</p>
            <Link to="/login" className="btn btn-secondary mt-3">
              Go to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;