// src/pages/VerifyEmailModal.jsx
import React, { useState, useEffect } from "react";
import { BiX } from "react-icons/bi";
import {
  checkEmailVerified,
  resendVerificationEmail,
  verifyEmail,
  loginUser,
} from "../services/authService";
import { useNavigate } from "react-router-dom";

const VerifyEmailModal = ({ email, onClose }) => {
  const [resending, setResending] = useState(false);
  const [verified, setVerified] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const navigate = useNavigate();

  // Extract uidb64/token from URL if present
  const verifyEmailFromUrl = async () => {
    const pathParts = window.location.pathname.split("/");
    const idx = pathParts.indexOf("verify-email");
    if (idx !== -1 && pathParts[idx + 1] && pathParts[idx + 2]) {
      const uidb64 = pathParts[idx + 1];
      const token = pathParts[idx + 2];
      try {
        await verifyEmail(uidb64, token); // stores tokens if provided
      } catch (err) {
        console.error("Verify email failed:", err);
      }
    }
  };

  // 🔑 Auto-login helper
  const autoLogin = async () => {
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
        console.error("Auto-login failed:", err);
        navigate("/login");
      }
    } else {
      navigate("/login"); // fallback if no creds
    }
  };

  // Poll backend until verified
  useEffect(() => {
    if (verified) return;

    const interval = setInterval(async () => {
      try {
        const status = await checkEmailVerified(email);
        if (status) {
          await verifyEmailFromUrl();
          setVerified(true);
          setVerifying(false);
          clearInterval(interval);

          // Auto-login after 1s
          setTimeout(autoLogin, 1000);
        }
      } catch (err) {
        console.error("Verification check failed", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [email, verified]);

  const handleResend = async () => {
    try {
      setResending(true);
      await resendVerificationEmail(email);
    } catch (error) {
      console.error("Resend failed:", error);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="verify-overlay">
      <div className="verify-modal animate-fade-in">
        <button className="btn-close-modal" onClick={onClose}>
          <BiX size={24} />
        </button>

        <h4 className="mb-3">Verify Your Email</h4>
        <p className="text-muted">
          A confirmation link has been sent to <b>{email}</b>.
          <br />
          Please verify your email to continue.
        </p>

        {verified ? (
          <p className="text-success fw-bold my-3">✅ Email verified! Logging in…</p>
        ) : verifying ? (
          <>
            <div className="spinner-border text-info my-3" role="status">
              <span className="visually-hidden">Checking...</span>
            </div>
            <p className="small text-secondary">Waiting for verification...</p>
          </>
        ) : null}

        {!verified && (
          <button
            className="btn btn-outline-info btn-sm mt-3"
            onClick={handleResend}
            disabled={resending}
          >
            {resending ? "Resending..." : "Resend Email"}
          </button>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailModal;
