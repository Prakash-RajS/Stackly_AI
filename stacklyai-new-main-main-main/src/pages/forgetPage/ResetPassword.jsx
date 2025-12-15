import React, { useState, useEffect } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import Arrow from "../../assets/forgetPg/arrow1.png";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BgImage from "../../assets/forgetPg/ForgotPassword.png";
import BgImageMobile from "../../assets/forgetPg/ForgotPasswordMobile.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Separate errors for each field
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [bg, setBg] = useState(BgImage);

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Background switch (unchanged)
  useEffect(() => {
    const handleResize = () => {
      setBg(window.innerWidth < 640 ? BgImageMobile : BgImage);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Real-time validation for new password
  const validateNewPassword = (value) => {
    if (!value) return " ";
    if (value.length < 8) return "Password must be at least 8 characters";
    if (!/\d/.test(value)) return "Password must contain at least one number";
    if (!/[A-Za-z]/.test(value)) return "Password must contain at least one letter";
    return "";
  };

  // Update errors as user types
  useEffect(() => {
    setNewPasswordError(validateNewPassword(newPassword));

    // Confirm password match check
    if (confirmPassword) {
      if (newPassword !== confirmPassword) {
        setConfirmError("Passwords do not match");
      } else {
        setConfirmError("");
      }
    } else {
      setConfirmError("");
    }
  }, [newPassword, confirmPassword]);

  const handleResetPassword = async () => {
    const pwdError = validateNewPassword(newPassword);
    const matchError = newPassword !== confirmPassword ? "Passwords do not match" : "";

    if (pwdError || matchError || !newPassword || !confirmPassword) {
      if (pwdError) setNewPasswordError(pwdError);
      if (matchError) setConfirmError(matchError);
      toast.error("Please fix the errors");
      return;
    }

    setLoading(true);
    try {
      await axios.post("https://www.ai.stacklycloud.com/api/forget-password/reset-password", {
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      toast.success("Password reset successful!");
      navigate("/ResetPopup");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative bg-cover bg-center p-4"
      style={{
        backgroundImage: `url(${bg})`,
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div className="relative w-full max-w-[90%] sm:max-w-[90%] md:max-w-[655px] lg:max-w-[740px] flex items-center justify-center z-10">
        <div
          className="relative bg-[#00000066] z-10 w-full rounded-[16px] px-4 sm:px-6 py-8 flex flex-col items-center justify-center"
          style={{ minHeight: 'clamp(341px, 90vh, 460px)' }}
        >
          <div
            style={{
              position: "absolute",
              inset: "0",
              borderRadius: "inherit",
              padding: "2px",
              background: `
                linear-gradient(48.81deg, rgba(0, 0, 0, 0) 60.41%, #51218F 89.33%),
                linear-gradient(221.1deg, rgba(0, 0, 0, 0) 74.13%, #51218F 92.57%)
              `,
              WebkitMask: `
                linear-gradient(#fff 0 0) content-box,
                linear-gradient(#fff 0 0)
              `,
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
              pointerEvents: "none",
              zIndex: "-1"
            }}
          ></div>

          {/* Back Arrow */}
          <div className="absolute top-4 sm:top-6 left-4 sm:left-6">
            <Link to="/Otp" className="flex items-center gap-2 text-white">
              <div className="w-7 h-7 sm:w-9 sm:h-9 bg-[#8A38F533] rounded-full flex items-center justify-center border border-[#8A38F5]">
                <img src={Arrow} alt="back" className="w-3 h-3 sm:w-4 sm:h-4" />
              </div>
              <span className="text-[14px] sm:text-[18px] text-white">Back</span>
            </Link>
          </div>

          {/* Heading */}
          <h2 className="text-white text-[16px] sm:text-[22px] md:text-[24px] font-normal text-center mt-8">
            Reset password
          </h2>

          <p className="text-[#F7F7FF80] text-[12px] sm:text-[14px] text-center max-w-[400px] mt-2 px-2">
            Create a strong new password for your account.
          </p>

          <div className="w-full flex flex-col items-center gap-3 mt-6 px-2 sm:px-0">

            {/* --- Password Input --- */}
            <div className="w-full max-w-[554px]">
              <label className="text-white text-[13px] sm:text-[15px]">Password</label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="
                    w-full h-[45px] px-4 py-2 rounded-[8px] 
                    bg-[#FFFFFF1F] border border-[#FFFFFF66] text-white placeholder-gray-400 text-sm
                    mt-1 focus:border-[#8A38F5] focus:outline-none transition
                  "
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:opacity-80 transition-opacity"
                >
                  {showPassword ? (
                     <AiOutlineEye size={22} />
                  ) : (
                    
                    <AiOutlineEyeInvisible size={22} />
                  )}
                </button>
              </div>

              <p className="text-[#F7F7FF80] text-[11px] mt-1">
                Must be at least 8 characters, including a number.
              </p>

              {newPasswordError && <p className="text-red-400 text-[12px] mt-1">{newPasswordError}</p>}
            </div>

            {/* --- Confirm Password --- */}
            <div className="w-full max-w-[554px]">
              <label className="text-white text-[13px] sm:text-[15px]">Re-type Password</label>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="
                    w-full h-[45px] px-4 py-2 rounded-[8px] 
                    bg-[#FFFFFF1F] border border-[#FFFFFF66] 
                    text-white placeholder-gray-400 text-sm
                    mt-1 focus:border-[#8A38F5] focus:outline-none transition
                  "
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:opacity-80 transition-opacity"
                >
                  {showConfirmPassword ? (
                    <AiOutlineEye size={22} />
                  ) : (
                    
                    <AiOutlineEyeInvisible size={22} />
                  )}
                </button>
              </div>

              {confirmError && <p className="text-red-400 text-[12px] mt-1">{confirmError}</p>}
            </div>

            {/* Reset Button */}
            <button
              onClick={handleResetPassword}
              disabled={loading || newPasswordError || confirmError || !newPassword || !confirmPassword}
              className="
                w-full max-w-[554px] h-[45px] rounded-full text-white font-medium 
                mt-3 transition-all duration-300 hover:opacity-90 disabled:opacity-60
              "
              style={{
                border: "1px solid rgba(255, 255, 255, 0.1)",
                background: "rgba(138, 56, 245, 0.2)",
                borderRadius: "30px",
              }}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}