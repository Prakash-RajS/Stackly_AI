import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import Arrow from "../../assets/forgetPg/arrow1.png";
import BgImage from "../../assets/forgetPg/ForgotPassword.png";
import BgImageMobile from "../../assets/forgetPg/ForgotPasswordMobile.png";

export default function HeroResetSuccess() {
  const [bg, setBg] = useState(BgImage);

  useEffect(() => {
    const handleResize = () => {
      setBg(window.innerWidth < 640 ? BgImageMobile : BgImage);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center relative bg-center bg-cover"
      style={{
        backgroundImage: `url(${bg})`,
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div
        className="
          relative
          w-[90%]
          sm:w-[90%]
          md:w-[740px] md:h-[360px]
          lg:w-[740px] lg:h-[360px]
          flex items-center justify-center
          z-10
        "
      >
        {/* Gradient Border Card */}
        <div
          className="
            relative bg-[#00000066] z-10 
            w-full h-full
            rounded-[16px] px-6 py-8 
            flex flex-col items-center justify-center text-center
          "
        >
          {/* Gradient Border Hack */}
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
          />

          {/* ANIMATED SUCCESS ICON */}
          <div className="success-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 64 64"
              className="w-24 h-24 md:w-28 md:h-28"
            >
              <defs>
                <linearGradient id="tickGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8A38F5" />
                  <stop offset="100%" stopColor="#C38BFF" />
                </linearGradient>

                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feFlood floodColor="#8A38F5" floodOpacity="0.6" />
                  <feComposite in2="blur" operator="in" />
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Full glowing circle */}
              <circle
                cx="32"
                cy="32"
                r="30"
                fill="none"
                stroke="url(#tickGradient)"
                strokeWidth="4"
                strokeLinecap="round"
                pathLength="100"
                className="circle-draw"
                filter="url(#glow)"
              />

              {/* Checkmark tick */}
              <path
                d="M20 33 L28 41 L44 25"
                fill="none"
                stroke="url(#tickGradient)"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength="100"
                className="tick-draw"
              />

              {/* Inner subtle ring */}
              <circle
                cx="32"
                cy="32"
                r="30"
                fill="none"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="2"
              />
            </svg>
          </div>

          {/* Animation CSS */}
          <style jsx>{`
            .success-icon {
              filter: drop-shadow(0 0 8px rgba(138, 56, 245, 0.4));
            }

            .circle-draw,
            .tick-draw {
              stroke-dasharray: 100;
              stroke-dashoffset: 100;
              transform-origin: center;
            }

            .circle-draw {
              animation: draw 1s ease-out forwards, fadeIn 0.6s ease-out forwards;
            }

            .tick-draw {
              animation: draw 0.8s ease-out 0.6s forwards;
            }

            @keyframes draw {
              to {
                stroke-dashoffset: 0;
              }
            }

            @keyframes fadeIn {
              from {
                opacity: 0;
                transform: scale(0.8);
              }
              to {
                opacity: 1;
                transform: scale(1);
              }
            }
          `}</style>

          {/* Success Message - REDUCED GAP */}
          <h2
            className="
              text-white font-medium mt-4 md:mt-6
              text-[16px] md:text-[24px]
            "
          >
            Your password has been reset successfully!
          </h2>

          {/* Back Button */}
          <Link
            to="/sign-in"
            className="flex items-center gap-2 text-white mt-5"
          >
            <div className="w-9 h-9 bg-[#8A38F533] rounded-full flex items-center justify-center border border-[#8A38F5]">
              <img src={Arrow} alt="back" className="w-4 h-4" />
            </div>
            <span className="text-[18px] text-white">Back</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
