import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import logo from "../assets/Logo1.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import frame from "../assets/ArrowF.png";
import groupImage from "../assets/ToStar.png";
import {
  faFacebookF,
  faTwitter,
  faInstagram,
  faPinterestP,
} from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const userInfoStr = localStorage.getItem("userInfo");
      let loggedIn = false;

      if (userInfoStr) {
        try {
          const userInfoObj = JSON.parse(userInfoStr);
          loggedIn = !!userInfoObj.userId;
        } catch (err) {
          console.error("Invalid userInfo in localStorage", err);
        }
      }

      setIsLoggedIn(loggedIn);
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, [location.pathname]);

  const hiddenRoutes = [
    "/sign-up",
    "/sign-in",
    "/otp",
    "/forgetpg",
    "/signupotp",
    "/resetpassword",
    "/resetpopup",
    "/signuppopup",
    "/heroforgetpg",
    "/afterconformationpage",
    "/afterconformationpage1",
    "/afterbilling",
    "/afterpaymentprocessing",
    "/afterpayment",
    "/cancel",
  ];

  if (hiddenRoutes.includes(location.pathname.toLowerCase())) {
    return null;
  }

  return (
  <footer className="w-full bg-black text-white relative flex flex-col items-center pt-10 pb-6 sm:pb-3 max-[640px]:pt-6 max-[640px]:pb-3 shadow-lg">

  <div className="container mx-auto px-4 grid grid-cols-2 gap-4 sm:flex sm:flex-row sm:justify-between sm:items-start xl:gap-10 xl:grid xl:grid-cols-4 xl:mx-20">
    {/* Logo & About */}
    <div className="flex flex-col items-start min-w-[180px] xl:mr-5">
      <img
        src={logo}
        alt="Stackly Logo"
        className="w-40 xl:w-[210px] h-auto mb-3 xl:mb-4 object-contain"
      />
      <p
        className="font-['Poppins'] text-[10px] sm:text-xs xl:text-[16px] italic leading-relaxed tracking-wide xl:tracking-[1px]"
        style={{
          background: "linear-gradient(to right, #FFFFFF, #555555)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        Create stunning, realistic room designs in seconds with the ultimate AI interior design tool.
      </p>
    </div>

    {/* Quick Links */}
    <div className="flex flex-col min-w-[120px] xl:ml-12 max-[320px]:ml-4">
      <ul className="flex flex-col gap-3 xl:gap-[15px]">
        <li className="flex flex-col">
          <div className="flex items-center gap-1 xl:gap-2">
            <a
              href={isLoggedIn ? "/" : "/"}
              className="font-['Poppins'] text-[10px] sm:text-xs xl:text-[16px] uppercase tracking-wide xl:tracking-[2px]"
              style={{
                background: "linear-gradient(to right, #FFFFFF, #555555)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {isLoggedIn ? "Canvas" : "Home"}
            </a>
            <img src={frame} alt="Frame" className="w-5 xl:w-7 h-5 xl:h-7 xl:mt-2" />
          </div>
          <div className="w-10 xl:w-[52px] h-px bg-white mt-1 xl:mt-2"></div>
        </li>
        {isLoggedIn ? (
          <>
            <li>
              <a
                href="/products"
                className="font-['Poppins'] text-[10px] sm:text-xs xl:text-[16px] uppercase tracking-wide xl:tracking-[2px]"
                style={{
                  background: "linear-gradient(to right, #FFFFFF, #555555)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                My Spaces
              </a>
              <div className="w-14 xl:w-[52px] h-px bg-white mt-1 xl:mt-2"></div>
            </li>
            <li>
              <a
                href="/pricing"
                className="font-['Poppins'] text-[10px] sm:text-xs xl:text-[16px] uppercase tracking-wide xl:tracking-[2px]"
                style={{
                  background: "linear-gradient(to right, #FFFFFF, #555555)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Inspirations
              </a>
              <div className="w-16 xl:w-[52px] h-px bg-white mt-1 xl:mt-2"></div>
            </li>
            <li>
              <a
                href="/apiconnect"
                className="font-['Poppins'] text-[10px] sm:text-xs xl:text-[16px] uppercase tracking-wide xl:tracking-[2px]"
                style={{
                  background: "linear-gradient(to right, #FFFFFF, #555555)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                API
              </a>
              <div className="w-6 xl:w-[52px] h-px bg-white mt-1 xl:mt-2"></div>
            </li>
            <li>
              <a
                href="/contact"
                className="font-['Poppins'] text-[10px] sm:text-xs xl:text-[16px] uppercase tracking-wide xl:tracking-[2px]"
                style={{
                  background: "linear-gradient(to right, #FFFFFF, #555555)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Contact Us
              </a>
              <div className="w-20 xl:w-[52px] h-px bg-white mt-1 xl:mt-2"></div>
            </li>
          </>
        ) : (
          <>
            <li>
              <a
                href="/products"
                className="font-['Poppins'] text-[10px] sm:text-xs xl:text-[16px] uppercase tracking-wide xl:tracking-[2px]"
                style={{
                  background: "linear-gradient(to right, #FFFFFF, #555555)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Feature
              </a>
              <div className="w-12 xl:w-[75px] h-px bg-white mt-1 xl:mt-2"></div>
            </li>
            <li>
              <a
                href="/pricing"
                className="font-['Poppins'] text-[10px] sm:text-xs xl:text-[16px] uppercase tracking-wide xl:tracking-[2px]"
                style={{
                  background: "linear-gradient(to right, #FFFFFF, #555555)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Pricing
              </a>
              <div className="w-12 xl:w-[65px] h-px bg-white mt-1 xl:mt-2"></div>
            </li>
            <li>
              <a
                href="/apiconnect"
                className="font-['Poppins'] text-[10px] sm:text-xs xl:text-[16px] uppercase tracking-wide xl:tracking-[2px]"
                style={{
                  background: "linear-gradient(to right, #FFFFFF, #555555)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                API
              </a>
              <div className="w-6 xl:w-[31px] h-px bg-white mt-1 xl:mt-2"></div>
            </li>
            <li>
              <a
                href="/contact"
                className="font-['Poppins'] text-[10px] sm:text-xs xl:text-[16px] uppercase tracking-wide xl:tracking-[2px]"
                style={{
                  background: "linear-gradient(to right, #FFFFFF, #555555)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Contact Us
              </a>
              <div className="w-20 xl:w-[110px] h-px bg-white mt-1 xl:mt-2"></div>
            </li>
          </>
        )}
      </ul>
    </div>

    {/* Terms & Policy */}
    <div
  className="
    flex flex-col min-w-[180px]
    mt-[-40px]          
    sm:-mt-2            
    xl:ml-4
  "
>
      <ul className="flex flex-col gap-3 xl:gap-5">
        <li>
          <div className="flex items-center gap-1 xl:gap-2">
            <a
              href="#"
              className="font-['Poppins'] text-[10px] sm:text-xs xl:text-[16px] uppercase tracking-wide xl:tracking-[2px]"
              style={{
                background: "linear-gradient(to right, #FFFFFF, #555555)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Terms of Services
            </a>
            <img src={frame} alt="Frame" className="w-5 xl:w-7 h-5 xl:h-7 xl:mt-2" />
          </div>
          <div className="w-32 xl:w-[173px] h-px bg-white mt-1 xl:mt-2"></div>
        </li>
        <li>
          <a
            href="#"
            className="font-['Poppins'] text-[10px] sm:text-xs xl:text-[16px] uppercase tracking-wide xl:tracking-[2px] whitespace-nowrap"
            style={{
              background: "linear-gradient(to right, #FFFFFF, #555555)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Privacy and Cookie Policy
          </a>
          <div className="w-40 xl:w-[173px] h-px bg-white mt-1 xl:mt-2"></div>
        </li>
        <li>
          <a
            href="#"
            className="font-['Poppins'] text-[10px] sm:text-xs xl:text-[16px] uppercase tracking-wide xl:tracking-[2px]"
            style={{
              background: "linear-gradient(to right, #FFFFFF, #555555)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Cookie Settings
          </a>
          <div className="w-24 xl:w-[152px] h-px bg-white mt-1 xl:mt-2"></div>
        </li>
        <li>
          <a
            href="#"
            className="font-['Poppins'] text-[10px] sm:text-xs xl:text-[16px] uppercase tracking-wide xl:tracking-[2px]"
            style={{
              background: "linear-gradient(to right, #FFFFFF, #555555)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Tutorial
          </a>
          <div className="w-14 xl:w-[76px] h-px bg-white mt-1 xl:mt-2"></div>
        </li>
        <li>
          <a
            href="#"
            className="font-['Poppins'] text-[10px] sm:text-xs xl:text-[16px] uppercase tracking-wide xl:tracking-[2px]"
            style={{
              background: "linear-gradient(to right, #FFFFFF, #555555)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            FAQs
          </a>
          <div className="w-10 xl:w-[52px] h-px bg-white mt-1 xl:mt-2"></div>
        </li>
      </ul>
    </div>

    {/* Contact */}
    <div className="flex flex-col gap-4 xl:gap-[32px] min-w-[160px] xl:ml-12 max-[320px]:ml-4">
      <div>
        <div
          className="font-['Poppins'] text-[10px] sm:text-xs xl:text-[16px] uppercase tracking-wide xl:tracking-[2px] mb-1 xl:mb-3"
          style={{
            background: "linear-gradient(to right, #FFFFFF, #555555)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          EMAIL
        </div>
        <div
          className="font-['Poppins'] text-[10px] sm:text-xs xl:text-[16px]"
          style={{
            background: "linear-gradient(to right, #FFFFFF, #555555)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          www.stacklyai.com
        </div>
      </div>
      <div>
        <div
          className="font-['Poppins'] text-[10px] sm:text-xs xl:text-[16px] uppercase tracking-wide xl:tracking-[2px] mb-1 xl:mb-2"
          style={{
            background: "linear-gradient(to right, #FFFFFF, #555555)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          CONTACT NO
        </div>
        <div
          className="font-['Poppins'] text-[10px] sm:text-xs xl:text-[16px]"
          style={{
            background: "linear-gradient(to right, #FFFFFF, #555555)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          +123-8364-7357
        </div>
      </div>
      <div>
        <div
          className="font-['Poppins'] text-[10px] sm:text-xs xl:text-[16px] uppercase tracking-wide xl:tracking-[2px] mb-1 xl:mb-2"
          style={{
            background: "linear-gradient(to right, #FFFFFF, #555555)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          LET'S CONNECT
        </div>
        <div className="flex gap-3 xl:gap-4">
          <a href="#" className="text-white hover:text-gray-300 transition-colors">
            <FontAwesomeIcon icon={faFacebookF} className="w-4 xl:w-5 h-4 xl:h-5" />
          </a>
          <a href="#" className="text-white hover:text-gray-300 transition-colors">
            <FontAwesomeIcon icon={faTwitter} className="w-4 xl:w-5 h-4 xl:h-5" />
          </a>
          <a href="#" className="text-white hover:text-gray-300 transition-colors">
            <FontAwesomeIcon icon={faInstagram} className="w-4 xl:w-5 h-4 xl:h-5" />
          </a>
          <a href="#" className="text-white hover:text-gray-300 transition-colors">
            <FontAwesomeIcon icon={faPinterestP} className="w-4 xl:w-5 h-4 xl:h-5" />
          </a>
        </div>
      </div>
    </div>
  </div>

  {/* Divider */}
 <div
  className="w-full max-[440px]:w-[385px] h-[1px] bg-[#1E1E1E] my-10 sm:my-5 xl:h-[0.2px] xl:w-[1311px]"
></div>


  {/* Copyright Section */}
<div className="w-full relative flex items-center py-3 max-[640px]:mt-0 max-[640px]:-mt-6">

    {/* Left Image */}
    <img
  src={groupImage}
  alt="Group 1000004239"
  className="w-[60px] h-[60px] max-[640px]:w-[40px] max-[640px]:h-[40px] absolute left-4"
  style={{
    opacity: 1,
    transform: "rotate(0deg)",
  }}
/>


    {/* Centered Text */}
 <div
  className="mx-auto text-[12px] sm:text-[14px] xl:text-[16px] max-[320px]:text-[10px] leading-none tracking-[0.26px] text-center"
  style={{ color: "#FFFFFF" }}
>
  &copy; 2023 Stackly AI | All Rights Reserved
</div>

  </div>
</footer>
  );
}
