import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeroProfile from "./HeroProfile";
import Myplan from "./Myplan";
import Mybilling from "./Mybilling";
import HelpCenter from "./HelpCenter";
import bg from "../../assets/afterHome/ProgileBg.png";

export default function Profile() {
  const [active, setActive] = useState("My Profile");
  const navigate = useNavigate();

const handleClick = () => {
  navigate("/apiconnect", { state: { scrollToAfterUiPlan: true } });
    setTimeout(() => {
      const element = document.getElementById("afteruiplan");
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };


  return (
    <section className="w-full h-auto opacity-100 bg-black pt-[82px] -mt-[82px] overflow-visible sm:overflow-hidden relative">
      {/* Banner Section  */}
      <div className="
        w-full opacity-100 mx-auto relative
        /* Mobile - FIXED: Responsive container */
        px-4 h-auto max-w-full
        /* Tablet - FIXED: Responsive container */
        sm:px-6  sm:h-auto sm:max-w-full
        /* Desktop - FIXED: Responsive container */
        lg:px-0 lg:h-auto lg:max-w-[1347px]
      ">
        <img
          src={bg}
          alt="Profile Banner"
          className="
            w-full rounded-md
            /* Mobile - FIXED: Truly responsive with aspect ratio preservation */
            h-[200px] mt-[0px] object-cover object-center
            /* Tablet - FIXED: Truly responsive with aspect ratio preservation */
            sm:h-[160px] sm:mt-[10px] sm:object-cover sm:object-center
            /* Desktop 1024px - FIXED: Responsive height */
            lg:h-[170px] lg:object-cover lg:object-center
            /* Desktop 1200px+ - Original specs */
            xl:h-[188px] xl:object-cover xl:object-center
          "
          style={{
            aspectRatio: 'auto',
            maxWidth: '100%',
            height: 'auto'
          }}
        />

        {/* Content div */}
        <div className="
          absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center
          /* Mobile - FIXED: Better responsive positioning */
          top-[50px] w-full gap-2 max-w-[300px] px-2
          /* Tablet - FIXED: Better responsive positioning */
          sm:top-[50px] sm:w-full sm:gap-3 sm:max-w-[450px] sm:px-0
          /* Desktop 1024px - FIXED: Proper responsive positioning */
          lg:top-[50px] lg:w-full lg:gap-3 lg:max-w-[550px] lg:px-0
          /* Desktop 1200px+ - ORIGINAL SPECS */
          xl:top-[50px] xl:w-full xl:gap-5 xl:max-w-[717px] xl:px-0
        ">
          {/* Heading */}
          <h2 className="
            font-[Lora] font-normal uppercase text-center bg-gradient-to-b from-white via-white to-[#F8BD00] bg-clip-text text-transparent w-full
            /* Mobile - FIXED: Responsive text size */
            text-[14px] leading-[18px]
            /* Tablet - FIXED: Responsive text size */
            sm:text-[16px] sm:leading-[22px]
            /* Desktop 1024px - FIXED: Responsive text size */
            lg:text-[18px] lg:leading-[24px]
            /* Desktop 1200px+ - ORIGINAL SPECS */
            xl:text-[24px] xl:leading-[32px]
          ">
            Join the Pro Experience
          </h2>

          {/* Paragraph */}
          <p className="
            font-[Poppins] text-white text-center leading-[140%] tracking-[0.3px] w-full
            /* Mobile - FIXED: Responsive text size */
            text-[10px] -mt-1
            /* Tablet - FIXED: Responsive text size */
            sm:text-[12px] sm:-mt-1
            /* Desktop 1024px - FIXED: Responsive text size */
            lg:text-[13px] lg:-mt-1
            /* Desktop 1200px+ - ORIGINAL SPECS */
            xl:text-[16px] xl:-mt-3
          ">
            Unlock advanced AI styles
          </p>

          {/* Button */}
      <button
      className="rounded-full text-white font-medium bg-gradient-to-b from-[#FBA716] to-[#90600D]
        w-[140px] h-[32px] px-[16px] py-[6px] text-[11px] mt-1
        sm:w-[160px] sm:h-[36px] sm:px-[20px] sm:py-[8px] sm:text-[13px] sm:mt-1
        lg:w-[180px] lg:h-[38px] lg:px-[24px] lg:py-[8px] lg:text-[14px] lg:mt-2
        xl:w-[219px] xl:h-[42px] xl:px-[30px] xl:py-[10px] xl:text-[16px] xl:mt-3"
      onClick={handleClick}
    >
      Upgrade Now
    </button>


          {/* Mobile Horizontal Menu */}
          <div className="sm:hidden w-full mt-0 flex justify-center relative z-50">
            <div className="
              w-[350px] h-[61px] bg-[#FFFFFF0A] border-[1px] border-solid border-[#FFFFFF1F] 
              rounded-[8px] pt-[20px] pr-[8px] pb-[20px] pl-[8px] opacity-100
              flex items-center justify-between
            ">
              {["My Profile", "My Plan", "Billings", "Help Center"].map((item, index) => (
                <div key={item} className="flex items-center gap-0">
                  {/* Left Vertical Line */}
                  <div className={`
                    w-[2px] h-[31px] ml-[10px] rounded-[8px] mr-[2px] opacity-100 transition-colors duration-150
                    ${active === item ? "bg-[#8A38F5]" : "bg-[#2A2A2A]"}
                  `}></div>
                  
                  {/* Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setActive(item);
                    }}
                    className={`
                      ${item === "My Profile" 
                        ? `
                          w-[60px] h-[29px] rounded-[4px] p-[4px] border-b-[1px] opacity-100
                          flex items-center justify-center text-center cursor-pointer select-none 
                          transition-all duration-150 ease-in-out touch-manipulation active:scale-95 relative z-10
                          ${active === item
                            ? "bg-[#8A38F533] text-[#8A38F5] text-[8px] font-medium border-[#8A38F5]/30"
                            : "bg-[#2A2A2A] text-white text-[8px] font-normal border-transparent hover:bg-[#3A3A3A]"
                          }
                        `
                        : item === "My Plan"
                        ? `
                          w-[50px] h-[29px] rounded-[4px] p-[4px] opacity-100
                          flex items-center justify-center text-center cursor-pointer select-none 
                          transition-all duration-150 ease-in-out touch-manipulation active:scale-95 relative z-10
                          ${active === item
                            ? "bg-[#8A38F533] text-[#8A38F5] text-[8px] font-medium border border-[#8A38F5]/30"
                            : "bg-[#2A2A2A] text-white text-[8px] font-normal border border-transparent hover:bg-[#3A3A3A]"
                          }
                        `
                        : item === "Billings"
                        ? `
                          w-[50px] h-[29px] rounded-[4px] p-[4px] opacity-100
                          flex items-center justify-center text-center cursor-pointer select-none 
                          transition-all duration-150 ease-in-out touch-manipulation active:scale-95 relative z-10
                          ${active === item
                            ? "bg-[#8A38F533] text-[#8A38F5] text-[8px] font-medium border border-[#8A38F5]/30"
                            : "bg-[#2A2A2A] text-white text-[8px] font-normal border border-transparent hover:bg-[#3A3A3A]"
                          }
                        `
                        : item === "Help Center"
                        ? `
                          w-[80px] h-[29px] rounded-[4px] p-[4px] opacity-100
                          flex items-center justify-center text-center cursor-pointer select-none 
                          transition-all duration-150 ease-in-out touch-manipulation active:scale-95 relative z-10
                          ${active === item
                            ? "bg-[#8A38F533] text-[#8A38F5] text-[8px] font-medium border border-[#8A38F5]/30"
                            : "bg-[#2A2A2A] text-white text-[8px] font-normal border border-transparent hover:bg-[#3A3A3A]"
                          }
                        `
                        : `
                          flex-1 h-[44px] rounded-[4px] flex items-center justify-center
                          text-center cursor-pointer select-none 
                          transition-all duration-150 ease-in-out touch-manipulation active:scale-95 relative z-10
                          ${active === item
                            ? "bg-[#8A38F533] text-[#8A38F5] text-[9px] font-medium border border-[#8A38F5]/30"
                            : "bg-[#2A2A2A] text-white text-[8px] font-normal border border-transparent hover:bg-[#3A3A3A]"
                          }
                        `
                      }
                    `}
                    type="button"
                    style={{
                      WebkitTapHighlightColor: 'transparent',
                      WebkitTouchCallout: 'none',
                      WebkitUserSelect: 'none',
                      userSelect: 'none'
                    }}
                  >
                    <span className="pointer-events-none select-none leading-tight px-1">
                      {item === "My Profile" ? "My Profile" : 
                       item === "My Plan" ? "My Plan" : 
                       item === "Billings" ? "Billing" : 
                       item === "Help Center" ? "Help Center" : item}
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="
        relative w-full
        /* Mobile */
        mt-2 h-auto
        /* Tablet & Desktop */
        sm:mt-0 sm:min-h-[700px]
        lg:min-h-[700px]
      ">
        {/* Tablet & Desktop Sidebar  */}
        <div className="hidden sm:block">
          <div className="
            rounded-[8px] border-[1px] border-solid border-[#FFFFFF1F] bg-white/10 opacity-100
            /* Tablet */
            sm:absolute sm:top-[70px] sm:left-[26px] sm:w-[200px] sm:h-[450px] sm:pr-[12px] sm:pb-[5px] sm:pl-[12px]
            /* Desktop - ORIGINAL SPECS */
            lg:absolute lg:top-[20px] lg:left-[26px] lg:w-[213px] lg:h-[487px] lg:pr-[15px] lg:pb-[5px] lg:pl-[15px]
          ">
            {/* Sidebar Buttons  */}
            {["My Profile", "My Plan", "Billings", "Help Center"].map((item, index) => (
              <button
                key={index}
                onClick={() => setActive(item)}
                className="
                  flex items-center gap-2 focus:outline-none
                  /* Tablet */
                  sm:w-[176px] sm:h-[30px] sm:mt-6
                  /* Desktop  */
                  lg:w-[183px] lg:h-[32px] lg:mt-8
                "
              >
                {/* Left Indicator */}
                <div className={`
                  rounded-[8px] transition-colors
                  /* Tablet */
                  sm:w-[2px] sm:h-[29px]
                  /* Desktop  */
                  lg:w-[2px] lg:h-[31px]
                  ${active === item ? "bg-[#8A38F5]" : "bg-[#2A2A2A]"}
                `}></div>

                {/* Right Button  */}
                <div className={`
                  rounded-[4px] text-white transition-colors
                  /* Tablet */
                  sm:w-[166px] sm:h-[30px] sm:px-2 sm:py-1 sm:text-[14px]
                  /* Desktop  */
                  lg:w-[173px] lg:h-[32px] lg:px-3 lg:py-1 lg:text-[16px]
                  ${active === item
                    ? "bg-[#8A38F533] border-b-2 border-solid border-[#FFFFFF33]"
                    : "bg-[#2A2A2A] border-b border-solid border-[#444]"
                  }
                `}>
                  {item}
                </div>
              </button>
            ))}
          </div>
        </div>
    
        {/* Content Area - FIXED: Proper positioning for tablet & desktop */}
        <div
  className={`mt-0 mb-0 transition-all duration-300 ease-in-out`}
  style={{ minHeight: active === "Billings" ? "900px" : "auto" }}
>
  {active === "My Profile" && <HeroProfile />}
  {active === "My Plan" && <Myplan />}
  {active === "Billings" && <Mybilling />}
  {active === "Help Center" && <HelpCenter />}
</div>

      </div>

      {/* BLUR FOOTER - Responsive */}
      <div
        className="absolute hidden lg:block"
        style={{
          width: "800px",
          height: "500px",
          top: "684px",
          left: "289px",
          borderRadius: "50%",
          background: "radial-gradient(rgba(151, 71, 255, 0.4), transparent)",
          filter: "blur(180px)",
          pointerEvents: "none",
        }}
      />

      {/* Mobile Blur Footer */}
      <div
        className="absolute block lg:hidden"
        style={{
          width: "300px",
          height: "200px",
          bottom: "0px",
          left: "50%",
          transform: "translateX(-50%)",
          borderRadius: "50%",
          background: "radial-gradient(rgba(151, 71, 255, 0.3), transparent)",
          filter: "blur(100px)",
          pointerEvents: "none",
        }}
      />
    </section>
  );
}
