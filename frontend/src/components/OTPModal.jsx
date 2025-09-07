// src/components/OTPModal.jsx

import React, { useState, useEffect } from 'react';
import { BiX } from 'react-icons/bi';
import { useToast } from '../contexts/ToastContext';
import { verifyOTP, resendOTP } from '../services/authService'; // We will create these soon

const OTPModal = ({ email, onVerifySuccess, onClose }) => {
  const [otp, setOtp] = useState('');
  const [resending, setResending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60); // 60-second countdown
  const { showToast } = useToast();

  // Timer effect for the resend button
  useEffect(() => {
    if (countdown === 0) return;
    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // Only allow numbers
    if (value.length <= 6) {
      setOtp(value);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      showToast('Please enter a 6-digit OTP.', 'warning');
      return;
    }
    setLoading(true);
    try {
      // This service will hit the backend's /verify-otp/ endpoint
      const response = await verifyOTP(email, otp);
      showToast('Account verified successfully!', 'success');
      // Call the success callback from Register.jsx
      onVerifySuccess(response.data);
    } catch (err) {
      const msg = err.response?.data?.error || 'Verification failed. Please try again.';
      showToast(msg, 'danger');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      // This service will hit the backend's /resend-otp/ endpoint
      await resendOTP(email);
      showToast('A new OTP has been sent to your email.', 'info');
      setCountdown(60); // Reset the timer
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to resend OTP.';
      showToast(msg, 'danger');
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

        <h4 className="mb-3">Enter Verification Code</h4>
        <p className="text-muted">
          A 6-digit OTP has been sent to <b>{email}</b>.
        </p>
        
        <form onSubmit={handleVerify}>
          <div className="my-4">
            <input
              type="text"
              className="form-control form-control-lg text-center"
              value={otp}
              onChange={handleOtpChange}
              placeholder="______"
              style={{ letterSpacing: '0.5rem', fontSize: '1.5rem' }}
              maxLength="6"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify & Continue'}
          </button>
        </form>

        <div className="mt-3 text-center">
          <button
            className="btn btn-link"
            onClick={handleResend}
            disabled={resending || countdown > 0}
          >
            {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPModal;