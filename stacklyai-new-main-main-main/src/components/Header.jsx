import React, { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import axios from "axios";
import logoImg from "../assets/Logo1.png";
import { UserContext } from "../context/UserContext";
import arrow from "../assets/home/Arrow.png";
import profile from "../assets/header/ProfileImg.png";
import { toast } from "react-toastify";


export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo, setUserInfo } = useContext(UserContext);
  const [profilePic, setProfilePic] = useState(profile);
  const [activePlan, setActivePlan] = useState("Basic");
  const [showSideBar, setShowSideBar] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
const [profileUpdated, setProfileUpdated] = useState(false);
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
    isMobile: typeof window !== "undefined" ? window.innerWidth < 640 : false,
  });


  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        isMobile: window.innerWidth < 640,
      });
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

useEffect(() => {
  if (!userInfo?.userId) return;

  const fetchUserData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const profileResponse = await axios.get("https://www.stacklycloud.com/api/profile", {
        params: { userid: userInfo.userId },
        headers: { Authorization: `Bearer ${token}` },
      });

      const profilePicUrl = profileResponse.data.profile_pic
        ? `https://www.stacklycloud.com/api/${profileResponse.data.profile_pic}?t=${Date.now()}`
        : profile;

      setProfilePic(profilePicUrl);

      const subscriptionResponse = await axios.get("https://www.stacklycloud.com/api/subscription", {
        params: { userid: userInfo.userId },
        headers: { Authorization: `Bearer ${token}` },
      });

      setActivePlan(subscriptionResponse.data.current_plan || "Basic");
    } catch (err) {
      console.error("Error fetching user data:", err);
      setProfilePic(profile);
      setActivePlan("Basic");
    }
  };

  fetchUserData();
}, [userInfo]);

  const hiddenPages = [
    "/sign-up", "/sign-in", "/otp", "/forgetpg", "/signupotp",
    "/resetpassword", "/resetpopup", "/signuppopup", "/heroforgetpg",
    "/afterconformationpage", "/afterconformationpage1" , "/afterbilling" ,
    "/afterpaymentprocessing" , "/afterpayment" ,"/cancel"
  ];
  const isHiddenPage = hiddenPages.includes(location.pathname.toLowerCase());
  if (isHiddenPage) return null;

  const navLinks = userInfo.userId
    ? [
        { to: "/", label: "Canvas" },
        { to: "/products", label: "My Spaces" },
        { to: "/pricing", label: "Inspirations" },
        { to: "/api", label: "API" },
        { to: "/contact", label: "Contact Us" },
      ]
    : [
        { to: "/", label: "Home" },
        { to: "/products", label: "Features" },
        { to: "/pricing", label: "Pricing" },
        { to: "/api", label: "API" },
        { to: "/contact", label: "Contact Us" },
      ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserInfo({});
    navigate("/");
  };

  return (
    <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8">
      <header
        className="w-full max-w-[1348px] flex flex-wrap justify-between items-center gap-2 md:gap-6 lg:gap-[60px] xl:gap-[115px] rounded-[90px] shadow-sm bg-[rgba(255,255,255,0.12)] backdrop-blur-[8px] relative z-10 mx-auto px-2 sm:px-4 md:px-8 lg:px-10 xl:px-12 py-2 md:py-0"
        style={{
          top: "32px",
          position: "relative",
          minHeight: "64px",
          height: "auto",
        }}
      >
        {/* Logo */}
       <img
  src={logoImg}
  alt="Logo"
  className={`flex-shrink-0 cursor-pointer transition-all duration-300 
    w-[110px] h-[22px] sm:w-[120px] sm:h-[24px] md:w-[120px] md:h-[24px] 
    lg:w-[150px] lg:h-[30px] xl:w-[172.75px] xl:h-[34px] 
    ${userInfo?.userId ? "max-[639px]:ml-[15%]" : ""}`}
 />


        {/* Navbar links */}
        {!screenSize.isMobile && (
          <nav className="flex-1 min-w-0 flex justify-center">
            <ul
              className="flex justify-center items-center list-none font-poppins whitespace-nowrap transition-all duration-300"
              style={{
                width:
                  screenSize.width >= 1200
                    ? "486px"
                    : screenSize.width >= 900
                    ? "340px"
                    : screenSize.width >= 800
                    ? "260px"
                    : "180px",
                height: "24px",
                gap:
                  screenSize.width >= 1200
                    ? "48px"
                    : screenSize.width >= 900
                    ? "24px"
                    : screenSize.width >= 800
                    ? "14px"
                    : "6px",
              }}
            >
              {navLinks.map(({ to, label }) => (
                <li key={label} className="flex-shrink-0">
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      `flex items-center justify-center no-underline font-poppins font-normal transition-all duration-300 tracking-[0%] leading-[100%] px-2 ${
                        isActive ? "text-[#8A38F5]" : "text-white"
                      } text-[12px] sm:text-[13px] md:text-[14px] lg:text-[16px] h-[28px] sm:h-[36px] lg:h-[46px]`
                    }
                    style={({ isActive }) => ({
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 400,
                      fontStyle: "normal",
                      fontSize:
                        screenSize.width >= 1024
                          ? "16px"
                          : screenSize.width >= 800
                          ? "14px"
                          : screenSize.width >= 640
                          ? "13px"
                          : "12px",
                      lineHeight: "100%",
                      letterSpacing: "0%",
                      whiteSpace: "nowrap",
                      ...(isActive
                        ? {
                            borderBottom: "1px solid",
                            borderImage:
                              "linear-gradient(90deg, rgba(255, 255, 255, 0.1) 0%, #8A38F5 30%, #8A38F5 70%, rgba(255, 255, 255, 0.1) 100%) 1",
                          }
                        : {}),
                    })}
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* Mobile Hamburger */}
        

        {/* Profile / Sign In-Up */}
        <div className="flex items-center justify-end gap-2 md:gap-4 lg:gap-5 z-10 flex-shrink-0 mt-2 md:mt-0">
          {userInfo.userId ? (
   <div
  className="
    group z-10 cursor-pointer inline-flex items-center justify-center 
    gap-2 md:gap-[8px] w-[80px] md:w-[90px] lg:w-[98px] 
    h-[44px] md:h-[50px] lg:h-[56px] rounded-[80px] 
    border border-solid p-1 md:p-[4px] 
    shadow-[0px_0px_4px_0px_#00000040]

    /* Default (>=640px) */
    relative

    /* On <640px → vertically center, right aligned */
    max-[639px]:fixed max-[639px]:top-1/2 
    max-[639px]:right-4        /* adjust spacing from right edge */
    max-[639px]:-translate-y-1/2
  "
  style={{ background: "#8A38F51A", backdropFilter: "blur(4px)" }}
  onClick={() => setShowDropdown(!showDropdown)}
>

              <div
                className="w-[72px] md:w-[80px] lg:w-[90px] h-[38px] md:h-[42px] lg:h-[48px] flex items-center justify-center gap-2 md:gap-[10px] rounded-[80px] px-2 md:px-[12px] py-1 md:py-[8px] border border-[#C22CA280]"
                style={{
                  background:
                    "linear-gradient(93.98deg, rgba(138, 56, 245, 0.7) 3.25%, rgba(194, 44, 162, 0.7) 102.29%)",
                }}
              >
                <div className="w-[24px] h-[24px] md:w-[28px] lg:w-[32px] md:h-[28px] lg:h-[32px] rounded-full overflow-hidden flex items-center justify-center">
                  <img src={profilePic} alt="Profile" className="w-full h-full object-cover rounded-full" />
                </div>
                <svg
                  className={`${showDropdown ? "rotate-180" : ""} transition-all w-[12px] md:w-[15px] h-[6px] md:h-[7.5px]`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 13 8"
                  fill="none"
                >
                  <path
                    d="M6.51543 1.86233L1.49227 6.88548C1.32142 7.05634 1.12209 7.13903 0.894278 7.13357C0.666471 7.1281 0.467138 7.03971 0.296283 6.8684C0.125427 6.69709 0.0399991 6.49776 0.0399991 6.2704C0.0399991 6.04305 0.125427 5.84372 0.296283 5.67241L5.54155 0.410054C5.67824 0.273369 5.83201 0.170856 6.00286 0.102514C6.17372 0.0341712 6.34458 7.93651e-08 6.51543 7.73277e-08C6.68629 7.52903e-08 6.85714 0.0341712 7.028 0.102514C7.19885 0.170856 7.35262 0.273369 7.48931 0.410054L12.7517 5.67241C12.9225 5.84327 13.0052 6.04556 12.9997 6.27929C12.9943 6.51302 12.9059 6.71508 12.7346 6.88548C12.5633 7.05588 12.3639 7.14131 12.1366 7.14177C11.9092 7.14222 11.7099 7.0568 11.5386 6.88548L6.51543 1.86233Z"
                    fill="#ffffff"
                  />
                </svg>
              </div>

              {showDropdown && (
                <div className="min-w-[140px] md:min-w-[150px] p-3 md:p-4 z-10 flex flex-col gap-2 absolute top-full mt-1 md:mt-0.5 right-0 bg-gray-800 rounded-md">
                  <div className="w-full md:w-[173px] h-[20px] md:h-[24px] flex items-center gap-1 text-white text-[12px] max-[639px]:text-[10px] md:text-[14px] font-normal poppins-font">
  Activated plan:{" "}
  <span
    className="font-normal text-[14px] max-[639px]:text-[12px] md:text-[16px]"
    style={{
      background: "linear-gradient(90deg, #8A38F5 0%, rgba(255, 255, 255, 0.9) 50%, #8A38F5 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      display: "inline-block",
    }}
  >
    {activePlan ? activePlan.charAt(0).toUpperCase() + activePlan.slice(1) : ""}
  </span>
</div>

                  <p className="w-full h-[1px] bg-gray-600 my-1"></p>
                  <NavLink
                    to="/Profile"
                    className={({ isActive }) =>
                      `w-full md:w-[173px] h-[28px] md:h-[32px] flex items-center px-2 md:px-3 pt-1 pb-1 rounded-[4px] text-white border-b-2 border-solid border-[#FFFFFF33] hover:bg-[#8A38F5]/30 active:bg-[#8A38F5]/50 transition-colors ${isActive ? "bg-[#8A38F5]/50" : ""}`
                    }
                    onClick={() => setShowDropdown(false)}
                  >
                    My Profile
                  </NavLink>
                 <div
                    onClick={() => {
                      try {
                        // Clear user info and localStorage
                        setUserInfo({});
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        localStorage.removeItem("userId");
                        localStorage.removeItem("userInfo");
                        localStorage.removeItem("userEmail");
                        localStorage.removeItem("persist:root");
                        localStorage.removeItem("theme");
                        localStorage.removeItem("resetEmail");

                        // Show toast
                        toast.success("✅ Logged out successfully!");

                        // Delay navigation so toast is visible
                        setTimeout(() => {
                          navigate("/sign-in");
                          window.location.reload();
                        }, 3000); // 3 seconds delay
                      } catch (error) {
                        console.error("Logout failed:", error);
                        toast.error(
                          "❌ Something went wrong while logging out."
                        );
                      }
                    }}
                    className="w-[173px] h-[32px] flex items-center px-3 pt-1 pb-1 rounded-[4px] text-white 
             hover:bg-[#8A38F5]/30 border-b-2 border-solid border-[#FFFFFF33] transition-colors cursor-pointer"
                  >
                    Logout
                  </div>
                </div>
              )}
            </div>
          ) : (
           !screenSize.isMobile && (
<div
  className="flex items-center justify-center rounded-[30px] border border-solid border-[#FFFFFF33] bg-clip-padding opacity-100 relative flex-shrink-0 transition-all duration-300 
             max-[799px]:gap-3"
  style={{
    background:
      "linear-gradient(92.88deg, rgba(255, 255, 255, 0.1) -0.52%, rgba(0, 176, 186, 0.1) 99.46%) border-box, linear-gradient(rgba(138, 56, 245, 0.1), rgba(138, 56, 245, 0.1)) padding-box",
    borderRadius: "30px",
    opacity: 1,
    padding: screenSize.width >= 800 ? "6px" : "3px", // reduced padding top & bottom
    width: screenSize.width >= 1200 ? "290px" : screenSize.width >= 900 ? "220px" : screenSize.width >= 800 ? "160px" : "140px",
    height: screenSize.width >= 1200 ? "54px" : screenSize.width >= 900 ? "44px" : screenSize.width >= 800 ? "34px" : "30px", // slightly reduced height
    gap: "8px",
    borderWidth: "1px",
  }}
>

  <NavLink
    to="/sign-in"
    className="flex items-center justify-center whitespace-nowrap no-underline rounded-[30px] cursor-pointer bg-[#8A38F533] border-[1px] border-solid border-[#FFFFFF33] active:text-white text-white transition-all duration-300"
    style={{
      width: screenSize.width >= 1200 ? "113px" : screenSize.width >= 900 ? "90px" : screenSize.width >= 800 ? "70px" : "60px", // reduced for <800px
      height: screenSize.width >= 1200 ? "44px" : screenSize.width >= 900 ? "36px" : screenSize.width >= 800 ? "28px" : "24px",
      fontFamily: "Inter, sans-serif",
      fontWeight: 600,
      fontStyle: "normal",
      fontSize: screenSize.width >= 1200
        ? "16px"
        : screenSize.width >= 900
        ? "14px"
        : screenSize.width >= 800
        ? "10px"
        : "10px", // adjusted for <800px
      lineHeight: "100%",
      letterSpacing: "0%",
      padding: "0 8px",
    }}
  >
    Sign In
  </NavLink>

  <NavLink
    to="/sign-up"
    className="flex items-center justify-center whitespace-nowrap no-underline rounded-[30px] border border-[#FFFFFF33] border-solid bg-[linear-gradient(93.98deg,rgba(138,56,245,0.7)_3.25%,rgba(194,44,162,0.7)_102.29%)] bg-clip-padding text-white font-semibold cursor-pointer active:opacity-90 focus:outline-none gap-[6px] transition-all duration-300"
    style={{
      width: screenSize.width >= 1200 ? "153px" : screenSize.width >= 900 ? "110px" : screenSize.width >= 800 ? "80px" : "65px", // reduced for <800px
      height: screenSize.width >= 1200 ? "44px" : screenSize.width >= 900 ? "36px" : screenSize.width >= 800 ? "28px" : "24px",
      fontSize: screenSize.width >= 1200
        ? "16px"
        : screenSize.width >= 900
        ? "14px"
        : screenSize.width >= 800
        ? "10px"
        : "10px", // adjusted for <800px
      padding: "0 8px",
    }}
  >
    <span
      style={{
        fontFamily: "Inter, sans-serif",
        fontWeight: 600,
        fontStyle: "normal",
        fontSize: screenSize.width >= 1200
          ? "16px"
          : screenSize.width >= 900
          ? "15px"
          : screenSize.width >= 800
          ? "10px"
          : "10px", // adjusted for <800px
        lineHeight: "100%",
        letterSpacing: "0%",
        width: screenSize.width >= 1200
          ? "59px"
          : screenSize.width >= 900
          ? "48px"
          : screenSize.width >= 800
          ? "38px"
          : "30px",
        height: screenSize.width >= 1200
          ? "19px"
          : screenSize.width >= 900
          ? "16px"
          : screenSize.width >= 800
          ? "13px"
          : "11px",
        opacity: 1,
        display: "inline-block",
        whiteSpace: "nowrap",
      }}
    >
      Sign Up
    </span>
    <div
      className="relative flex-shrink-0"
      style={{
        width: screenSize.width >= 1200
          ? "24px"
          : screenSize.width >= 900
          ? "20px"
          : screenSize.width >= 800
          ? "16px"
          : "12px",
        height: screenSize.width >= 1200
          ? "24px"
          : screenSize.width >= 900
          ? "20px"
          : screenSize.width >= 800
          ? "16px"
          : "14px",
      }}
    >
      <img
        src={arrow}
        alt="Arrow"
        style={{
          width: "100%",
          height: "100%",
          paddingLeft: "2px",
          opacity: 1,
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />
    </div>
  </NavLink>
</div>

                      )
          )}
        </div>
 <div
  onClick={() => setShowSideBar(prev => !prev)}
  className={`
    hidden max-[640px]:block
    ${userInfo?.userId ? "absolute top-1/2 left-4 -translate-y-1/2" : "mr-4"}
    w-[24px] h-[24px] md:w-[30px] md:h-[30px]
    cursor-pointer rounded-[5px]
    flex flex-col justify-center
  `}
  style={{
    background: "#111111",
    border: "1px solid #FFFFFF1A",
    boxShadow: "0px 0px 12px 0px #0000004D"
  }}
>
 <div className="w-[80%] h-[0.125rem] md:h-1 rounded-md bg-white my-[4px] md:my-[5px] mx-auto"></div>
<div className="w-[80%] h-[0.125rem] md:h-1 rounded-md bg-white my-[4px] md:my-[5px] mx-auto"></div>
<div className="w-[80%] h-[0.125rem] md:h-1 rounded-md bg-white my-[4px] md:my-[5px] mx-auto"></div>

</div>



      </header>

      <section
  className={`fixed top-0 ${showSideBar ? "right-0" : "right-[-200%]"} 
               transition-all duration-500 ease-in-out
               w-[80vw] max-[900px]:w-[70vw] 
               bg-gradient-to-br from-black via-[#1a0f1f] to-[#3d1c47]
               shadow-2xl min-h-[100vh] flex flex-col 
               gap-5 justify-start items-start p-[24px] z-50
               overflow-hidden
               max-[900px]:flex hidden`}
  style={{ listStyle: "none" }}
>

        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-500 rounded-full filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-1/3 -right-10 w-32 h-32 bg-pink-500 rounded-full filter blur-xl opacity-30 animate-bounce delay-700"></div>
          <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-blue-500 rounded-full filter blur-xl opacity-20 animate-ping delay-1000"></div>
        </div>

        <div className="relative z-10 self-end">
          <svg 
            onClick={() => setShowSideBar(false)}
            xmlns="http://www.w3.org/2000/svg" 
            height="60px" 
            width="60px"
            viewBox="0 0 100 100"
            style={{ cursor: "pointer" }}
            className="hover:scale-110 transition-transform duration-300"
          >
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF512F" />
                <stop offset="100%" stopColor="#DD2476" />
              </linearGradient>
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#DD2476" floodOpacity="0.6"/>
              </filter>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <circle cx="50" cy="50" r="20" fill="url(#gradient)" filter="url(#shadow)" />
            <circle
              cx="50"
              cy="50"
              r="32"
              stroke="url(#gradient)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="12 10"
            >
              <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="rotate"
                from="0 50 50"
                to="360 50 50"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            <path 
              d="M40,40 L60,60 M60,40 L40,60" 
              stroke="white" 
              strokeWidth="4" 
              strokeLinecap="round"
              filter="url(#glow)"
            />
          </svg>
        </div>

       <div className="relative z-10 w-full mt-6 space-y-6">
  {navLinks.map(({ to, label }) => (
    <NavLink
      key={label}
      to={to}
      onClick={() => setShowSideBar(false)}
      className={({ isActive }) =>
        `relative block text-[24px] max-[900px]:text-[20px] font-extrabold uppercase tracking-wider 
         cursor-pointer leading-[120%] py-3 px-4 rounded-lg 
         transition-all duration-500 transform hover:translate-x-2 group
         ${isActive ? "text-purple-400" : "text-white"}`
      }
    >
      {({ isActive }) => (
        <>
          {/* Text with glow */}
          <span className="relative z-10 transition-all duration-300 group-hover:text-pink-400 drop-shadow-[0_0_10px_rgba(255,0,150,0.6)]">
            {label}
          </span>

          {/* Underline (always visible if active) */}
          <span
            className={`absolute bottom-1 left-0 h-[3px] bg-gradient-to-r from-purple-400 via-pink-500 to-red-400 
                        transition-all duration-500 
                        ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
          ></span>
        </>
      )}
    </NavLink>
  ))}
</div>


       <div className="relative z-10 mt-auto w-full space-y-5 pb-8">
  {!userInfo?.userId && (
    <>
      {/* Log In Button */}
      <button
        className="w-full h-[52px] px-6 text-[18px] font-semibold tracking-wide
                   bg-black text-white cursor-pointer flex justify-center items-center 
                   no-underline rounded-full border border-solid border-purple-500 
                   transition-all duration-300 transform
                   hover:scale-110 hover:bg-purple-900/70 hover:shadow-[0_0_15px_rgba(168,85,247,0.6)]
                   active:bg-gradient-to-r active:from-[#8A38F580] active:to-[#C22CA280]
                   max-[1280px]:h-[46px] max-[1280px]:text-[15px]"
        onClick={() => {
          navigate("/sign-in");
          setShowSideBar(false);
        }}
      >
        Log In
      </button>

      {/* Sign Up Button */}
      <button
        className="w-full h-[52px] px-6 text-[18px] font-semibold tracking-wide
                   text-white cursor-pointer flex justify-center items-center 
                   no-underline rounded-full border-none
                   transition-all duration-300 transform hover:scale-110
                   bg-gradient-to-r from-purple-600 to-pink-500
                   hover:shadow-[0_0_20px_rgba(236,72,153,0.6)]
                   hover:from-purple-700 hover:to-pink-600
                   max-[1280px]:h-[46px] max-[1280px]:text-[15px]"
        onClick={() => {
          navigate("/sign-up");
          setShowSideBar(false);
        }}
      >
        Sign Up
      </button>
    </>
  )}
</div>
      </section>
    </div>
  );
}
