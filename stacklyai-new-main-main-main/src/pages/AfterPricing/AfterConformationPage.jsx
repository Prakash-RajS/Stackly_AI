import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import SideArrow from "../../assets/pricing-pg/sideArrow.png";
import Tik from "../../assets/pricing-pg/tik.png";
import Rarrow from "../../assets/pricing-pg/Rarrow.png";
import ConfirmPG from "../../assets/pricing-pg/ConfirmPG.png";
import Paper from "../../assets/pricing-pg/paper.png";
import Con1 from "../../assets/pricing-pg/Con1.png";
import LArrow from "../../assets/pricing-pg/Larrow.png";
import logoImg from "../../assets/Logo1.png";
import Arrow from "../../assets/forgetPg/arrow1.png";

export default function AfterConformationPage() {
  const [showMore, setShowMore] = useState(false);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();

  // Static descriptions for each plan type
  const staticDescriptions = {
    basic:
      "Perfect for personal or casual users who want a simple idea of interior design.",
    silver:
      "Ideal for homeowners or renters looking for more creative control and polished designs.",
    gold: "Best for professionals, renovators, or anyone seeking top-tier results and personalization.",
  };

  useEffect(() => {
    // Fetch plan data from the state passed via Link
    const planData = location.state?.plan;
    if (planData) {
      // Map the plan data with static description
      setPlan({
        ...planData,
        description:
          staticDescriptions[planData.name.toLowerCase()] ||
          planData.description,
      });
      setLoading(false);
    } else {
      // Fallback: Fetch plan data from API if state is not available
      const fetchPlan = async () => {
        try {
          const response = await fetch("https://www.stacklycloud.com/admin/api/plans/");
          if (!response.ok) {
            throw new Error("Failed to fetch plans");
          }
          const data = await response.json();
          // Assuming you want to display a specific plan (e.g., Silver or based on some logic)
          const selectedPlan = data.plans.find(
            (p) => p.name.toLowerCase() === "silver"
          ); // Adjust logic as needed
          if (selectedPlan) {
            setPlan({
              ...selectedPlan,
              description:
                staticDescriptions[selectedPlan.name.toLowerCase()] ||
                selectedPlan.description,
            });
          } else {
            throw new Error("No matching plan found");
          }
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchPlan();
    }
  }, [location.state]);

  const toggleShowMore = () => {
    setShowMore((prev) => !prev);
  };

  if (loading) {
    return (
      <div className="text-white text-center py-12">
        Loading plan details...
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="text-white text-center py-12">
        Error: {error || "No plan data available"}
      </div>
    );
  }

  const features = Array.isArray(plan.features) ? plan.features : [];
  const visibleFeatures = showMore ? features : features.slice(0, 4); // Show 4 features initially

  // Calculate discount and grand total dynamically
  const discountPercentage = plan.discountPercentage || 0;
  const discount = `${discountPercentage}%`;
  const grandTotal = (
    plan.price -
    (plan.price * discountPercentage) / 100
  ).toFixed(2);

  return (
    <div className="min-h-screen">
      <section
        className="relative w-full min-h-screen px-4 py-8 md:px-6 md:py-10 lg:p-[50px] flex flex-col justify-start items-start bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${ConfirmPG})` }}
      >
        {/* Back Button */}
        <Link to="/api#afteruiplan" className="z-10">
          <div className="w-10 h-10 md:w-12 md:h-12 lg:w-[52px] lg:h-[52px] border-[1px] border-solid border-[#FFFFFF33] rounded-full p-2 md:p-3 lg:px-[17px] lg:py-[8px] bg-[#FFFFFF1F] flex justify-center items-center">
            <img src={Arrow} alt="back" className="w-4 h-4 md:w-5 md:h-5 lg:w-auto lg:h-auto" />
          </div>
        </Link>

       {/* Main Content */}
<div className="w-full h-auto flex flex-col md:flex-row justify-center items-center md:items-start gap-6 md:gap-8 lg:gap-[52px] mt-8 md:mt-16 lg:mt-20">
  {/* Left Side - Features */}
  <div className="w-full max-w-[500px] md:max-w-[400px] lg:max-w-[497px] flex flex-col justify-start items-start gap-6 md:gap-8 lg:gap-[52px]">
    {/* Logo and Plan Info */}
    <div className="flex flex-col gap-4 md:gap-5 lg:gap-[18px] w-full">
      <div className="w-40 md:w-48 lg:w-[325.42px] h-10 md:h-12 lg:h-[65px]">
        <img
          src={logoImg}
          alt="Logo"
          className="w-full h-full object-contain"
        />
        <div className="w-10 md:w-12 lg:w-[54px] h-0 border-[2px] border-solid border-white opacity-100 mt-2"></div>
      </div>
      <div className="flex flex-col gap-2 w-full h-auto opacity-100 mt-2 md:mt-4 lg:mt-8">
        <div className="text-white text-xl md:text-2xl lg:text-[40px] leading-[110%] md:leading-[100%] font-[400] poppins-font">
          {plan.name} Plan
        </div>
        <div className="text-white text-sm md:text-base lg:text-[20px] leading-[130%] md:leading-[120%] lg:leading-[100%] font-[400] poppins-font text-opacity-90">
          Get ready to unlock {plan.name} Subscription benefits
        </div>
      </div>
    </div>

    {/* Features List */}
    <div className="flex flex-col gap-3 md:gap-4 lg:gap-[16px] w-full -mt-2 md:-mt-4 lg:-mt-8">
      {visibleFeatures.map((feature, idx) => (
        <div key={idx} className="flex gap-3 items-start">
          <div className="w-5 h-5 mt-0.5 flex-shrink-0 bg-[linear-gradient(180deg,#8A38F5_0%,#51218F_100%)] rounded-[4px] flex items-center justify-center shadow-[0px_0px_4px_0px_#FFFFFF29]">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              className="w-3 h-3"
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
          <div className="font-medium text-sm md:text-base lg:text-lg text-white flex-1 leading-[130%] md:leading-[140%]">
            {typeof feature === "object"
              ? feature.text || feature.name
              : feature}
          </div>
        </div>
      ))}

      {features.length > 4 && (
        <button
          onClick={toggleShowMore}
          className="flex gap-2 items-center text-left mt-1 md:mt-2 w-full"
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            className={`w-5 h-5 transition-transform duration-300 ${
              showMore ? "rotate-90" : ""
            }`}
          >
            <defs>
              <linearGradient
                id="arrowGradient"
                x1="0"
                y1="0"
                x2="24"
                y2="24"
              >
                <stop offset="0%" stopColor="#8A38F5" />
              </linearGradient>
            </defs>
            <path
              d="M8 5L15 12L8 19"
              stroke="url(#arrowGradient)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="font-medium text-sm md:text-base lg:text-lg text-white">
            {showMore ? "See less" : `See ${features.length - 4} more`}
          </div>
        </button>
      )}
    </div>
  </div>

  {/* Right Side - Plan Details */}
  <div className="w-full max-w-[500px] md:max-w-[400px] lg:max-w-[485px] flex flex-col justify-start items-center gap-4 md:gap-5 lg:gap-[20px] mt-6 md:mt-0">
    <div
      className="w-full max-w-full md:max-w-[400px] lg:max-w-[485px] h-auto rounded-[16px] md:rounded-[18px] p-4 md:p-5 lg:p-[20px] flex flex-col gap-4 md:gap-5 lg:gap-[30px] border-[1.18px] border-solid border-[#FFFFFF1F] backdrop-blur-lg"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.02)",
        borderColor: "rgba(255, 255, 255, 0.08)",
        backdropFilter: "blur(14.18px)",
        boxShadow: "0px 0px 23.63px 0px #00000040",
      }}
    >
      <div className="font-semibold text-[white] text-lg md:text-xl lg:text-[20px] leading-[100%] poppins-font text-center">
        Plan Details
      </div>

      <div
        className="w-full max-w-full md:max-w-[350px] lg:max-w-[357px] h-auto rounded-[16px] md:rounded-[18px] p-3 md:p-4 lg:p-[18px] border-[1px] border-solid border-[#89898999] mx-auto"
        style={{
          backdropFilter: "blur(14.18px)",
          boxShadow: "0px 0px 23.63px 0px #0A0A0A40",
        }}
      >
        <div className="flex flex-col items-center w-full gap-1 md:gap-2">
          {[
            ["Plan Name", plan.name],
            ["Price", `$${plan.price.toFixed(2)}`],
            ["Duration", `${plan.validity_days} days`],
            ["Discount", discount],
          ].map(([label, value], idx) => (
            <div key={idx} className="w-full max-w-full md:max-w-[320px] lg:max-w-[303px] h-auto min-h-[28px] md:min-h-[32px] flex items-center py-1 md:py-1.5">
              <div className="w-[50%] flex items-center text-white font-medium poppins-font text-sm md:text-base lg:text-[18px]">
                {label}
              </div>
              <div className="w-[50%] flex items-center justify-end text-white font-semibold poppins-font text-sm md:text-base lg:text-[18px] text-right">
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grand Total */}
      <div className="w-full flex justify-center">
        <div className="w-full max-w-full md:max-w-[320px] lg:max-w-[334.79px] h-auto flex justify-between items-center px-2 md:px-0">
          <div className="flex flex-col justify-start gap-1 md:gap-2 lg:gap-[10.46px]">
            <div className="text-base md:text-lg lg:text-[20px] font-[400] text-white poppins-font">
              Grand Total
            </div>
            <div className="text-lg md:text-xl lg:text-[25px] font-[600] text-white poppins-font">
              ${grandTotal}
            </div>
          </div>
          <div className="w-7 h-8 md:w-8 md:h-10 lg:w-[38px] lg:h-[51px]">
            <img src={Paper} alt="page-icon" className="w-full h-full object-contain" />
          </div>
        </div>
      </div>
    </div>

    {/* Confirm Payment Button */}
    <Link
      to="/AfterBilling"
      state={{ selectedPlan: plan }}
      className="w-full max-w-full md:max-w-[400px] lg:max-w-[485px] flex justify-center"
    >
      <div
        className="flex items-center justify-center gap-2 text-white text-sm md:text-base lg:text-[18px] font-semibold text-center cursor-pointer w-full max-w-full md:max-w-[350px] lg:max-w-[346px] h-11 md:h-12 lg:h-[52px] rounded-[32px] md:rounded-[35.45px] border-[1.18px] border-solid border-[#C22CA299] p-3 md:p-4 lg:p-[11.82px_35.45px]"
        style={{
          background:
            "linear-gradient(95.92deg, rgba(138,56,245,0.5) 15.32%, rgba(194,44,162,0.5) 99.87%)",
          backdropFilter: "blur(14.18px)",
          boxShadow: "0 0 23.63px 0 #00000040",
        }}
      >
        <span>Confirm Payment</span>
        <img
          src={Con1}
          alt="icon"
          className="w-5 h-5 md:w-6 md:h-6 lg:w-[28.36px] lg:h-[28.36px] opacity-100"
        />
      </div>
    </Link>
  </div>
</div>
      </section>
    </div>
  );
}