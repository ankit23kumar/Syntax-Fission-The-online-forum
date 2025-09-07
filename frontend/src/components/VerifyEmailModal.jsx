// src/components/VerifyEmailModal.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BiX } from "react-icons/bi";
import { resendVerificationEmail, checkEmailVerified } from "../services/authService";
import { useToast } from "../contexts/ToastContext";

const VerifyEmailModal = ({ email, onClose }) => {
  const [resending, setResending] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    let redirected = false;
    let intervalId = null;

    // --- The Single, Smart Decision-Making Function ---
    // This function is the key to eliminating the race condition.
    const handleVerificationSuccess = () => {
      if (redirected) return;
      redirected = true;

      // The critical logic: check if THIS browser has the tokens.
      if (localStorage.getItem('access')) {
        // If tokens exist here, we know this is a same-browser (cross-tab) success.
        showToast("Verification successful!", "success");
        navigate("/register/step-2");
      } else {
        // If no tokens are here, the verification must have happened in another browser.
        showToast("Email verified! Please log in to continue.", "success");
        navigate("/login");
      }
    };

    // --- STRATEGY 1: The Fast Path Listener ---
    // It now calls our smart function instead of navigating directly.
    const handleStorageChange = (event) => {
      if (event.key === 'access' && event.newValue) {
        handleVerificationSuccess();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // --- STRATEGY 2: The Robust Polling Fallback ---
    // It ALSO calls our smart function. Now it doesn't matter which runs first.
    intervalId = setInterval(async () => {
      if (redirected) return;
      try {
        const isVerified = await checkEmailVerified(email);
        if (isVerified) {
          // The polling detected a verification. Let the smart function decide the next step.
          handleVerificationSuccess();
        }
      } catch (error) {
        console.error("Polling for verification failed:", error);
      }
    }, 5000); // We can remove the grace period as this logic is now fully robust.


    // --- CLEANUP FUNCTION ---
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };

  }, [email, navigate, showToast]);


  const handleResend = async () => {
    setResending(true);
    try {
      await resendVerificationEmail(email);
      showToast("Verification email has been sent again.", "success");
    } catch (error) {
      console.error("Resend failed:", error);
      showToast("Failed to resend the verification email.", "danger");
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
        <h4 className="mb-3">Last Step: Verify Your Email</h4>
        <p className="text-muted">
          A confirmation link has been sent to <b>{email}</b>.
          <br />
          Clicking the link will complete your registration.
        </p>
        <div className="spinner-border text-info my-3" role="status">
          <span className="visually-hidden">Waiting...</span>
        </div>
        <p className="small text-secondary">Waiting for you to click the link...</p>
        <button
          className="btn btn-outline-info btn-sm mt-3"
          onClick={handleResend}
          disabled={resending}
        >
          {resending ? "Resending..." : "Resend Email"}
        </button>
      </div>
    </div>
  );
};

export default VerifyEmailModal;