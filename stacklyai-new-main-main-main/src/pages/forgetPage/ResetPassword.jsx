import React, { useState, useEffect } from 'react';
import close from '../../assets/forgetPg/close.png';
import Arrow from '../../assets/forgetPg/arrow.png';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logoImg from "/src/assets/Logo.png";
import BgImage from "../../assets/forgetPg/ForgotPassword.png";
import BgImageMobile from "../../assets/forgetPg/ForgotPasswordMobile.png";
import { toast } from "react-toastify";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(45);
  const [bg, setBg] = useState(BgImage);

  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setBg(BgImageMobile); // mobile background
      } else {
        setBg(BgImage); // desktop/tablet background
      }
    };

    handleResize(); // set initially
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error("Both fields are required");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "https://www.stacklycloud.com/api/forget-password/reset-password",
        {
          new_password: newPassword,
          confirm_password: confirmPassword,
        }
      );
      console.log(response.data);
      toast.success("Password reset successful!");
      navigate("/ResetPopup"); 
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.detail || "Failed to reset password");
      } else {
        toast.error("Something went wrong");
      }
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
      <div
        className="
          relative
          w-full max-w-[90%]
          sm:max-w-[90%]
          md:max-w-[655px]
          lg:max-w-[740px]
          flex items-center justify-center
          z-10
        "
      >
        <div
          className="relative bg-[#00000066] z-10 w-full rounded-[16px] px-4 sm:px-6 py-8 flex flex-col items-center justify-center"
          style={{
            minHeight: 'clamp(341px, 90vh, 460px)'
          }}
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
          <h2 className="text-white text-[16px] sm:text-[22px] md:text-[24px] lg:text[28px] font-normal leading-[100%] text-center mt-8 sm:mt-10">
            Reset password
          </h2>

          <p className="text-[#F7F7FF80] text-[12px] sm:text-[12px] md:text-[14px] lg:text[16px] text-center max-w-[400px] mt-2 sm:mt-3 px-2">
            Create a strong new password for your account.
          </p>

          <div className="w-full flex flex-col items-center gap-3 mt-4 sm:mt-6 px-2 sm:px-0">
            <div className="w-full max-w-[554px]">
              <label className="text-white text-[12px] sm:text-[14px] md:text-[15px] lg:text[16px]">Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setError("");
                }}
                placeholder="Enter new password"
                className="
                  w-full h-[45px] px-4 py-2 rounded-[8px] 
                  bg-[#FFFFFF1F] border border-[1px] border-[#FFFFFF66] text-white placeholder-gray-400 text-sm
                  mt-1
                "
                style={{ border: '1px solid rgba(255, 255, 255, 0.4)' }} // Added explicit border style
              />
              <p className="text-[#F7F7FF80] text-[11px] mt-1">
                Must be at least 8 characters, including a number.
              </p>
            </div>

            <div className="w-full max-w-[554px]">
              <label className="text-white text-[12px] sm:text-[14px] md:text-[15px] lg:text[16px]">Re-type Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError("");
                }}
                placeholder="Re-enter password"
                className="
                  w-full h-[45px] px-4 py-2 rounded-[8px] 
                  bg-[#FFFFFF1F] border border-[1px] border-[#FFFFFF66] text-white placeholder-gray-400 text-sm
                  mt-1
                "
                style={{ border: '1px solid rgba(255, 255, 255, 0.4)' }} // Added explicit border style
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center mt-1 max-w-[554px] w-full">
                {error}
              </div>
            )}

            <button
              onClick={handleResetPassword}
              disabled={loading}
              className="
                w-full max-w-[554px] h-[45px] rounded-full text-white font-medium 
                mt-3 transition-all duration-300 hover:opacity-90 disabled:opacity-60
              "
              style={{
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "30px",
                background: "rgba(138, 56, 245, 0.2)",
              }}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </div>
          
          <p className="text-[#F7F7FF80] text-[12px] sm:text-[14px] text-center mt-4 font-normal px-2">
            Didn't receive the code?{" "}
            <span className="text-[#FF45EC] font-medium">
              Resend in {timer < 10 ? `00:0${timer}` : `00:${timer}`}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}