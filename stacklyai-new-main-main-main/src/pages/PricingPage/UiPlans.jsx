import React, { useState } from "react";
import Tik from "../../assets/pricing-pg/tik.png";
import Silver from "../../assets/pricing-pg/silver.png";
import Gold from "../../assets/pricing-pg/grpGold.png";
import DarkPg from "../../assets/pricing-pg/darkPg.png";
import Rarrow from "../../assets/pricing-pg/Rarrow.png";
import BG from "../../assets/pricing-pg/Pricing1.png"; 
import { Link } from "react-router-dom";

export default function AfterUiPlans() {
  const [showSilverMore, setShowSilverMore] = useState(false);
  const [showGoldMore, setShowGoldMore] = useState(false);
  const [currentPlanIndex, setCurrentPlanIndex] = useState(0);

  const toggleSilverMore = () => setShowSilverMore(!showSilverMore);
  const toggleGoldMore = () => setShowGoldMore(!showGoldMore);

  const plans = ["Basic", "Silver", "Gold"];

  const handlePrevPlan = () => {
    setCurrentPlanIndex((prev) => (prev === 0 ? plans.length - 1 : prev - 1));
  };

  const handleNextPlan = () => {
    setCurrentPlanIndex((prev) => (prev === plans.length - 1 ? 0 : prev + 1));
  };

 const BasicPlan = () => (
<div
  className="w-full max-[370px]:w-[290px] mx-auto rounded-[12px] p-5 bg-[#000000] border-[2px] border-solid border-[#FFFFFF33] shadow-[0_2px_12px_#007B8229] flex flex-col gap-6 min-h-[400px]"
>


    <div className="flex flex-col gap-4">
      <div className="w-full flex justify-center">
       <div className="font-bold text-2xl max-[1023px]:text-xl text-[#FFFFFF]">
  Basic <span className="text-white text-lg max-[1023px]:text-base">(Free)</span>
</div>

      </div>
   <p className="text-white text-sm max-[1023px]:text-xs max-[370px]:text-[10px] text-center w-full">
  Perfect for personal or casual users who want a simple idea of interior design.
</p>


     <div className="flex justify-center">
  <div className="text-white font-bold text-2xl max-[1023px]:text-xl">
    $0 <span className="text-base max-[1023px]:text-sm font-normal">/per month</span>
  </div>
</div>

      <Link to="/Sign-in">
  <div
    className="w-full max-[1024px]:h-[36px] h-[42px] gap-[10px] max-[1024px]:gap-[6px] rounded-[30px] border border-[#C22CA299] 
      px-[30px] max-[1024px]:px-[20px] py-[10px] max-[1024px]:py-[6px] text-white flex justify-center items-center 
      bg-gradient-to-r from-[#8A38F580] to-[#C22CA280]
      hover:bg-gradient-to-b from-[#007B82] to-[#00B0BA] hover:text-white text-base max-[1024px]:text-sm"
  >
    Purchase
  </div>
</Link>

 </div>
    <hr className="border-dashed border-[#C99FFF]" />

  <div className="flex flex-col gap-4 max-[370px]:gap-2 mt-4 max-[370px]:mt-3">
  {[
    "10 Room Designs per month",
    "Limited AI-generated layouts",
    "Basic furniture suggestions",
    "Download SD images, no advanced tools",
    "Email support (Standard)",
    "No customization options",
    "No revision support",
    "Watermark images",
  ].map((item, idx) => (
    <div className="flex gap-2 max-[370px]:gap-1 items-start" key={idx}>
      <div className="w-5 max-[1023px]:w-4 max-[370px]:w-3 h-5 max-[1023px]:h-4 max-[370px]:h-3 mt-0.5 flex-shrink-0 bg-[linear-gradient(180deg,#8A38F5_0%,#C22CA2_100%)] rounded-[4px] flex items-center justify-center">
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-3 max-[1023px]:w-2 max-[370px]:w-1.5 h-3 max-[1023px]:h-2 max-[370px]:h-1.5"
        >
          <path
            d="M5 13L9 17L19 7"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span className="text-white text-sm max-[1023px]:text-xs max-[370px]:text-[10px] font-medium">{item}</span>
    </div>
  ))}
</div>

  </div>
);

const SilverPlan = () => (
  <div
    className="w-full max-[370px]:w-[290px] mx-auto rounded-[12px] p-5 bg-[#000000] border-[2px] border-solid border-[#FFFFFF33] flex flex-col gap-6 backdrop-blur-[6px]"
    style={{
      background: "linear-gradient(180deg, rgba(72, 32, 126, 0.8) 0%, rgba(0, 0, 0, 0.8) 77.57%)",
      boxShadow: "8px 8px 4px 0px #00000029 inset, -8px -8px 4px 0px #00000029 inset",
    }}
  >

    <div className="flex flex-col gap-4">
    <div className="flex justify-center items-center">
  <h3 className="max-[1024px]:text-xl text-2xl font-bold text-white">Premium</h3>
</div>

     <p className="text-white text-sm max-[1024px]:text-xs text-center w-full">
  Ideal for homeowners or renters looking for more creative control and polished designs.
</p>

    <div className="text-white text-2xl lg:text-2xl md:text-xl sm:text-lg xs:text-base font-bold text-center w-full whitespace-nowrap">
  $29 or ₹2,399 <span className="text-base lg:text-base md:text-sm sm:text-xs xs:text-xs font-normal">/per month</span>
</div>

     <div className="bg-[#8A38F51A] p-4 max-[1024px]:p-2 rounded-lg text-center text-white shadow-[0_2px_12px_#007B8229] max-[1024px]:w-[180px] w-auto mx-auto">
  <p className="text-xs max-[1024px]:text-[10px] font-medium">Use code (Get 10%OFF)</p>
  <div className="flex items-center justify-center gap-2 mt-1">
    <img src={DarkPg} alt="page" className="w-4 max-[1024px]:w-3 h-4 max-[1024px]:h-3 filter brightness-0 invert" />
    <span className="font-bold text-lg max-[1024px]:text-sm text-white">STACKLY10</span>
  </div>
</div>

     <Link to="/Sign-in">
  <div
    className="w-full max-[1024px]:h-[36px] h-[42px] gap-[10px] max-[1024px]:gap-[6px] rounded-[30px] border border-[#C22CA299] 
      px-[30px] max-[1024px]:px-[20px] py-[10px] max-[1024px]:py-[6px] text-white flex justify-center items-center 
      bg-gradient-to-r from-[#8A38F580] to-[#C22CA280]
      hover:bg-gradient-to-b from-[#007B82] to-[#00B0BA] hover:text-white text-base max-[1024px]:text-sm"
  >
    Purchase
  </div>
</Link>


    </div>
    <hr className="border-dashed border-[#C99FFF]" />

  <div className="flex flex-col gap-4 max-[1024px]:gap-3 max-[370px]:gap-2 mt-4 max-[1024px]:mt-3 max-[370px]:mt-2">
  {[
    "50 Room Designs per month",
    "Advanced AI layout suggestions",
    "Access to premium themes & colour palettes",
    "Furniture & decor recommendations",
    "High-resolution image download",
  ]
    .concat(
      showSilverMore
        ? [
            "Priority email support",
            "Basic customization options",
            "Limited revisions (up to 3)",
            "No watermark on images",
          ]
        : []
    )
    .map((item, idx) => (
      <div className="flex gap-2 max-[1024px]:gap-1 max-[370px]:gap-1 items-start" key={idx}>
        <div className="w-5 max-[1024px]:w-4 max-[370px]:w-3 h-5 max-[1024px]:h-4 max-[370px]:h-3 mt-0.5 flex-shrink-0 bg-[linear-gradient(180deg,#8A38F5_0%,#C22CA2_100%)] rounded-[4px] flex items-center justify-center">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-3 max-[1024px]:w-2 max-[370px]:w-1.5 h-3 max-[1024px]:h-2 max-[370px]:h-1.5"
          >
            <path
              d="M5 13L9 17L19 7"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span className="text-white text-sm max-[1024px]:text-xs max-[370px]:text-[10px] font-medium">{item}</span>
      </div>
    ))}
  <button
  className="flex gap-2 max-[1024px]:gap-1 max-[370px]:gap-1 items-center cursor-pointer text-white"
  onClick={toggleSilverMore}
>
  <svg
    width="10"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-3 max-[1024px]:w-2 max-[370px]:w-1.5 h-4 max-[1024px]:h-3 max-[370px]:h-2 transition-transform duration-300 ${
      showSilverMore ? "rotate-180" : ""
    }`}
  >
    {/* ↓ Down arrow (rotates ↑ when active) */}
    <path
      d="M6 9L12 15L18 9"
      stroke="#8A38F5"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>

  <span className="text-sm max-[1024px]:text-xs max-[370px]:text-[10px] font-medium">
    {showSilverMore ? "Show less" : "See 4 more"}
  </span>
</button>
</div>



  </div>
);

const GoldPlan = () => (
 <div
  className="w-full max-[370px]:w-[290px] mx-auto relative rounded-[12px] p-5 bg-[#000000] border-[2px] border-solid border-[#FFFFFF33] flex flex-col gap-6"
>

   <span className="absolute top-0 right-0 bg-gradient-to-b from-[#FFAA17] to-[#99660E] px-2 py-1 text-white text-xs max-[1024px]:text-[10px] font-medium rounded-tr-md rounded-bl-lg">
  Most Popular
</span>

    <div className="flex flex-col gap-4">
    <div className="flex justify-center items-center">
  <h3 className="text-[#FFFFFF] text-2xl max-[1024px]:text-xl font-bold">Pro</h3>
</div>

     <p className="text-white text-sm max-[1024px]:text-xs text-center w-full">
  Best for professionals, renovators, or anyone seeking top-tier results and personalization.
</p>
 <div className="text-white text-2xl lg:text-2xl md:text-xl sm:text-lg xs:text-base font-bold text-center w-full whitespace-nowrap">
   $59 or ₹4,799 <span className="text-base lg:text-base md:text-sm sm:text-xs xs:text-xs font-normal">/per month</span>
</div>

    
      <div className="bg-[#8A38F51A] p-4 max-[1024px]:p-2 rounded-lg text-center text-white shadow-[0_2px_12px_#007B8229] max-[1024px]:w-[180px] w-auto mx-auto">
  <p className="text-xs max-[1024px]:text-[10px] font-medium text-white">Use code (Get 10%OFF)</p>
  <div className="flex items-center justify-center gap-2 max-[1024px]:gap-1 mt-1">
    <img src={DarkPg} alt="page" className="w-4 max-[1024px]:w-3 h-4 max-[1024px]:h-3 invert brightness-0" />
    <span className="font-bold text-lg max-[1024px]:text-sm" style={{ color: "#ffffff" }}>
      STACKLY20
    </span>
  </div>
</div>

     <Link to="/Sign-in">
  <div
    className="w-full max-[1024px]:h-[36px] h-[42px] gap-[10px] max-[1024px]:gap-[6px] rounded-[30px] border border-[#C22CA299] 
      px-[30px] max-[1024px]:px-[20px] py-[10px] max-[1024px]:py-[6px] text-white flex justify-center items-center 
      bg-gradient-to-r from-[#8A38F580] to-[#C22CA280]
      hover:bg-gradient-to-b from-[#007B82] to-[#00B0BA] hover:text-white text-base max-[1024px]:text-sm"
  >
    Purchase
  </div>
</Link>

    </div>
    <hr className="border-dashed border-[#C99FFF]" />
  <div className="flex flex-col gap-4 max-[1024px]:gap-3 max-[370px]:gap-2 mt-4">
  {[
    "Unlimited Room Designs",
    "Commercial use up to 3-5 members",
    "Fully customized AI designs with layout and lighting suggestions",
    "Unlimited design revisions",
    "3D walk-through visualizations",
  ]
    .concat(
      showGoldMore
        ? [
            "Dedicated support with 24-hour response time",
            "Advanced customization tools",
            "Export designs in multiple formats",
            "Access to exclusive design templates",
          ]
        : []
    )
    .map((item, idx) => (
      <div className="flex gap-2 max-[1024px]:gap-1 max-[370px]:gap-1 items-start" key={idx}>
        <div className="w-5 max-[1024px]:w-4 max-[370px]:w-3 h-5 max-[1024px]:h-4 max-[370px]:h-3 mt-0.5 flex-shrink-0 bg-[linear-gradient(180deg,#FBA716_41.67%,#95630D_157.14%)] rounded-[4px] flex items-center justify-center">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-3 max-[1024px]:w-2 max-[370px]:w-1.5 h-3 max-[1024px]:h-2 max-[370px]:h-1.5"
          >
            <path
              d="M5 13L9 17L19 7"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span className="text-white text-sm max-[1024px]:text-xs max-[370px]:text-[10px] font-medium">{item}</span>
      </div>
    ))}
  <button
  className="flex gap-2 max-[1024px]:gap-1 max-[370px]:gap-1 items-center cursor-pointer text-white"
  onClick={toggleGoldMore}
>
  <svg
    width="10"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-3 max-[1024px]:w-2 max-[370px]:w-1.5 h-4 max-[1024px]:h-3 max-[370px]:h-2 transition-transform duration-300 ${
      showGoldMore ? "rotate-180" : ""
    }`}
  >
    {/* ↓ Down arrow (rotates upward on click) */}
    <path
      d="M6 9L12 15L18 9"
      stroke="#8A38F5"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>

  <span className="text-sm max-[1024px]:text-xs max-[370px]:text-[10px] font-medium">
    {showGoldMore ? "Show less" : "See 4 more"}
  </span>
</button>
</div>


  </div>
);
  const renderPlan = () => {
    switch (currentPlanIndex) {
    
    
    }
  };

  return (
    <section
      className="w-full py-8 sm:py-12 px-4 bg-cover bg-top bg-no-repeat"
      style={{
        backgroundImage: `url(${BG})`,
        backgroundColor: "#000",
      }}
    >
     
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-8 sm:gap-12">
        <div className="text-center">
          <h2
            className="lora-text text-white leading-[1.2] font-medium mb-3 sm:mb-4 max-w-2xl mx-auto 
            text-[20px] sm:text-[24px] md:text-4xl max-[440px]:text-[18px] max-[440px]:leading-[100%]"
          >
            Find the right plan that <br className="hidden md:inline" /> suits your needs
          </h2>
          <p
            className="text-white text-[14px] sm:text-[16px] md:text-xl mx-auto max-[440px]:text-[14px] 
            max-[440px]:leading-[140%] max-[440px]:whitespace-normal"
            style={{ fontFamily: "Inter", fontWeight: 400 }}
          >
            Start free or unlock premium features. Choose what fits your journey best.
          </p>
        </div>

        {/* Desktop Layout (769px and above): Three boxes in a single line */}
      {/* Hide on screens <1024px */}
<div className="grid grid-cols-3 gap-4 sm:gap-6 w-full max-[1023px]:hidden">
  <BasicPlan />
  <SilverPlan />
  <GoldPlan />
</div>


       
    

{/* Tablet Plans: screens 640px - 1023px */}
<div className="hidden min-[640px]:max-[1023px]:flex justify-center gap-4 w-full px-4">
  {[<BasicPlan />, <SilverPlan />, <GoldPlan />].map((Plan, index) => (
    <div
      key={index}
      className="flex-shrink-0 w-[200px] sm:w-[220px] md:w-[240px]"
    >
      {Plan}
    </div>
  ))}
</div>

<div className="hidden max-[639px]:flex flex-col items-center w-full">
  {/* Slider Wrapper with Fixed Width */}
  <div className="overflow-hidden w-[366px]">
    <div
      className="flex transition-transform duration-300 ease-in-out"
      style={{
        transform: `translateX(-${currentPlanIndex * 366}px)`,
      }}
    >
      {[<BasicPlan mobile />, <SilverPlan mobile />, <GoldPlan mobile />].map((Plan, index) => (
        <div key={index} className="w-[366px] flex-shrink-0 px-2">
          {Plan}
        </div>
      ))}
    </div>
  </div>

  {/* Slide Buttons */}
  <div className="flex justify-center items-center gap-4 mt-6">
    {/* Left Arrow */}
    <button
      onClick={() => setCurrentPlanIndex((prev) => (prev > 0 ? prev - 1 : 0))}
      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
      aria-label="Previous plan"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M15 18L9 12L15 6"
          stroke="#2A2A2A"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>

    {/* Dots */}
    <div className="flex gap-2">
      {[0, 1, 2].map((index) => (
        <button
          key={index}
          onClick={() => setCurrentPlanIndex(index)}
          className={`w-3 h-3 rounded-full transition-colors duration-300 ${
            currentPlanIndex === index ? "bg-cyan-400" : "bg-gray-400"
          }`}
          aria-label={`Go to plan ${index + 1}`}
        />
      ))}
    </div>

    {/* Right Arrow */}
    <button
      onClick={() => setCurrentPlanIndex((prev) => (prev < 2 ? prev + 1 : 2))}
      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
      aria-label="Next plan"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M9 18L15 12L9 6"
          stroke="#2A2A2A"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  </div>
</div>

      
      </div>
    </section>
  );
}
