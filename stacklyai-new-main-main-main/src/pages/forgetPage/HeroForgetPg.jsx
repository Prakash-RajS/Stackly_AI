import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify"; // ✅ Import toast
import Arrow from "../../assets/forgetPg/arrow1.png";
import BgImage from "../../assets/forgetPg/ForgotPassword.png"; // import the background image
import BgMobile from "../../assets/forgetPg/ForgotPasswordMobile.png";

export default function HeroForgetPg() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileBg, setIsMobileBg] = useState(window.innerWidth < 639);
  const navigate = useNavigate();

   useEffect(() => {
      const mediaQuery = window.matchMedia("(max-width: 639px)");
      const handleChange = (e) => setIsMobileBg(e.matches);
  
      handleChange(mediaQuery); // set on load
      mediaQuery.addEventListener("change", handleChange);
  
      return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);


  const handleSendOTP = async () => {
  if (!email.trim()) {
    toast.error("Email is required");
    return;
  }

  if (!email.includes("@") || !email.includes(".")) {
    toast.error("Please enter a valid email address");
    return;
  }

  setIsLoading(true);

  try {
    const res = await axios.post("https://www.stacklycloud.com/api/forget-password/send-otp", { email });

    localStorage.setItem("resetEmail", email);

    // ✅ Always use backend message if available
    const msg = res.data?.message || res.data?.detail || "OTP sent successfully!";
    toast.success(msg);

    setTimeout(() => {
      navigate("/Otp", { state: { email } });
    }, 1200);
  } catch (err) {
    console.error("Send OTP Error:", err.response?.data || err.message);

    const msg =
      err.response?.data?.detail ||
      err.response?.data?.message ||
      (typeof err.response?.data === "string" ? err.response.data : "Error sending OTP");

    toast.error(msg);
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div
          className="min-h-screen flex items-center justify-center relative bg-cover bg-center"
          style={{
            backgroundImage: `url(${isMobileBg ? BgMobile : BgImage})`,
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          <div className="relative w-full max-w-[740px] h-auto sm:h-[419px] flex items-center justify-center z-10 px-4 sm:px-6">
            {/* Gradient Border Wrapper */}
            <div className="relative bg-[#00000066] z-10 w-full max-w-[740px] h-auto sm:h-[419px] rounded-[16px] px-4 sm:px-6 py-8 flex flex-col items-center justify-center">
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
    
              {/* Back Arrow */}
              <div className="absolute top-4 sm:top-6 left-4 sm:left-6">
                <Link to="/sign-in" className="flex items-center gap-2 text-white">
                  <div className="w-7 h-7 max-[390px]:w-6 max-[390px]:h-6 sm:w-9 sm:h-9 bg-[#8A38F533] rounded-full flex items-center justify-center border border-[#8A38F5]">
                    <img
                      src={Arrow}
                      alt="back"
                      className="w-3 h-3 max-[390px]:w-2.5 max-[390px]:h-2.5 sm:w-4 sm:h-4"
                    />
                  </div>
                  <span className="hidden sm:inline text-[16px] sm:text-[18px] text-white">
                    Back
                  </span>
                </Link>
              </div>
    
              {/* Heading */}
              <h2 className="text-white text-[20px] max-[500px]:text-[18px] max-[390px]:text-[12px] sm:text-[28px] font-normal leading-[100%] tracking-normal text-center font-[Poppins]">
                Forgot your password?
              </h2>
    
              {/* Subheading */}
              <p className="text-[#F7F7FF80] text-[13px] max-[500px]:text-[12px] max-[390px]:text-[10px] sm:text-[16px] font-normal leading-[150%] tracking-normal text-center font-[Poppins] max-w-[260px] max-[500px]:max-w-[280px] sm:max-w-[414px] opacity-100 mt-3">
                No worries. Enter your email and we’ll send you a one-time password
                (OTP) to reset it.
              </p>
    
              {/* Form */}
              <div className="flex flex-col items-start gap-3 mt-6 w-full max-w-[554px]">
                <label className="text-white text-[14px] sm:text-[15px]">
                  Enter your email ID
                </label>
    
                <input
                  type="email"
                  placeholder="John001@gmail.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  className="w-full h-[40px] sm:h-[45px] px-4 py-2 rounded-[8px] bg-[#1F1B2E] border-[1px] border-solid border-[#FFFFFF33] text-white placeholder-gray-400 text-sm"
                />
    
                {error && (
                  <div className="text-red-500 text-sm text-center w-full">
                    {error}
                  </div>
                )}
    
                <button
                  onClick={handleSendOTP}
                  disabled={isLoading}
                  className="w-full h-[40px] sm:h-[45px] rounded-full text-white font-medium mt-2 transition-all duration-300 hover:opacity-90 disabled:opacity-60"
                  style={{
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    background: "rgba(138, 56, 245, 0.2)",
                  }}
                >
                  {isLoading ? "Sending..." : "Send OTP"}
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }