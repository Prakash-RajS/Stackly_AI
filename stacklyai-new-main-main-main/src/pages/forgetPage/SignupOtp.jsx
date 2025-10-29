import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Arrow from "../../assets/forgetPg/arrow1.png";
import BgImage from "../../assets/forgetPg/ForgotPassword.png";
import axios from "axios";
import { toast } from "react-toastify";
import BgMobile from "../../assets/forgetPg/ForgotPasswordMobile.png";

const SignupOtp = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(45);
  const [error, setError] = useState("");
  const [isResending, setIsResending] = useState(false);
const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileBg, setIsMobileBg] = useState(window.innerWidth < 639);

  const email = location.state?.email || localStorage.getItem("signupEmail");
  const password =
    location.state?.password || localStorage.getItem("signupPassword");

  // ✅ Persist email/password temporarily
  useEffect(() => {
    if (email) localStorage.setItem("signupEmail", email);
    if (password) localStorage.setItem("signupPassword", password);
  }, [email, password]);

  // ✅ Countdown timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  useEffect(() => {
      const mediaQuery = window.matchMedia("(max-width: 639px)");
      const handleChange = (e) => setIsMobileBg(e.matches);
  
      handleChange(mediaQuery); // set on load
      mediaQuery.addEventListener("change", handleChange);
  
      return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);
  // ✅ Remove email/password if user leaves this page
  useEffect(() => {
    return () => {
      localStorage.removeItem("signupEmail");
      localStorage.removeItem("signupPassword");
      // toast.info("Signup verification cancelled");
    };
  }, []);


  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) {
      toast.error("Please enter a 6-digit OTP");
      return;
    }

    try {
      await axios.post("https://www.stacklycloud.com/api/verify-otp", {
        email,
        password,   // ✅ include password if backend needs it
        otp: enteredOtp,
      });


      localStorage.removeItem("signupEmail");
      localStorage.removeItem("signupPassword");
      setOtp(["", "", "", "", "", ""]);
      toast.success("OTP verified successfully!");
      setTimeout(() => {
        navigate("/SignUpPopUp");
      }, 3000);
    } catch (err) {
  console.error("OTP Verify Error:", err.response?.data || err.message);

  let msg = "Invalid OTP"; // default fallback
  if (err.response?.data) {
    const data = err.response.data;

    if (typeof data === "string") {
      msg = data;
    } else if (data.detail) {
      // FastAPI usually sends "detail"
      if (Array.isArray(data.detail)) {
        msg = data.detail[0].msg || JSON.stringify(data.detail);
      } else {
        msg = data.detail;
      }
    } else if (data.message) {
      msg = data.message;
    } else if (data.error) {
      msg = data.error;
    }
  }

  toast.error(msg, { autoClose: 3000 });
}
  };

  const handleResendOTP = async () => {
    if (timer > 0 || !email) return;
    setIsResending(true);
    setError("");
    try {
      await axios.post("https://www.stacklycloud.com/api/signup-resend-otp", { email });
      setTimer(45);
      setOtp(["", "", "", "", "", ""]);
      toast.info("New OTP sent to your email.");
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to resend OTP";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsResending(false);
    }
  };
  return (
    <div
          className="min-h-screen flex items-center justify-center relative bg-cover bg-center px-4 sm:px-6 lg:px-8"
          style={{
            backgroundImage: `url(${isMobileBg ? BgMobile : BgImage})`,
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          <div
            className="
              relative bg-[#00000066] w-full max-w-[740px] h-auto sm:h-[480px] rounded-[16px] border-2 
              pt-6 sm:pt-[32px] px-4 sm:pr-[24px] sm:pb-[32px] sm:pl-[24px] flex flex-col items-center gap-4 sm:gap-[24px]
              backdrop-blur-md
            "
          >
            {/* Gradient Border */}
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
                zIndex: "-1",
              }}
            ></div>
    
            {/* Back Button */}
            <div className="absolute top-4 sm:top-6 left-4 sm:left-6">
              <Link to="/sign-in" className="flex items-center gap-2 text-white">
                <div className="w-8 sm:w-9 h-8 sm:h-9 bg-[#8A38F533] rounded-full flex items-center justify-center border border-[#8A38F5]">
                  <img src={Arrow} alt="back" className="w-3 sm:w-4 h-3 sm:h-4" />
                </div>
                <span className="hidden sm:inline text-[18px] text-white">
                  Back
                </span>
              </Link>
            </div>
    
            {/* Title */}
            <h2 className="text-white text-[24px] sm:text-[28px] font-normal leading-[100%] mt-12 sm:mt-14 text-center font-[Poppins]">
              Enter OTP
            </h2>
    
            {/* Subtext */}
            <p className="text-[#F7F7FF80] text-[14px] sm:text-[16px] text-center max-w-[300px] sm:max-w-[420px] mt-0">
              We've sent a 6-digit OTP to{" "}
              <span className="text-white font-medium">{email}</span>. Please enter
              it below to continue.
            </p>
    
            {/* OTP Inputs */}
            <div className="flex justify-center gap-3 max-[400px]:gap-2 sm:gap-11 mt-0">
              {otp.map((value, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={value}
                  onChange={(e) => handleChange(index, e.target.value)}
                  className="
                    w-[40px] h-[40px] text-[16px]
                    sm:w-[50px] sm:h-[50px] sm:text-[20px]
                    max-[400px]:w-[32px] max-[400px]:h-[32px] max-[400px]:text-[14px]
                    text-center
                    text-white
                    bg-transparent
                    outline-none
                    border-b-[1px]
                    border-solid
                    border-[#C22CA2]
                    focus:border-[#FF45EC]
                  "
                />
              ))}
            </div>
    
            {/* Error Message */}
            {error && (
              <div className="text-red-500 text-sm text-center mt-2">{error}</div>
            )}
    
            {/* Verify Button */}
            <button
              onClick={handleVerify}
              className="w-full max-w-[554px] h-[40px] sm:h-[45px] rounded-full text-white font-medium mt-4 transition-all duration-300 hover:opacity-90 disabled:opacity-60"
              style={{
                border: "1px solid rgba(255, 255, 255, 0.1)",
                background: "rgba(138, 56, 245, 0.2)",
              }}
            >
              Verify OTP
            </button>
    
            {/* Resend Timer */}
            <p className="text-[#F7F7FF80] text-[12px] sm:text-[14px] text-center mt-4 mb-3 font-normal">
              Didn’t receive the code?{" "}
              <span
                onClick={handleResendOTP}
                className={`${
                  timer > 0
                    ? "text-gray-400"
                    : "text-[#FF45EC] cursor-pointer hover:underline"
                }`}
              >
                {isResending
                  ? "Resending..."
                  : timer > 0
                  ? `Resend in 00:${timer.toString().padStart(2, "0")}`
                  : "Resend OTP"}
              </span>
            </p>
          </div>
        </div>
      );
    };
    
    export default SignupOtp;