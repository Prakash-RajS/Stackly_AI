import React, { useState, useEffect } from "react";
import Tik from "../../assets/pricing-pg/tik.png";
import Silver from "../../assets/pricing-pg/silver.png";
import Gold from "../../assets/pricing-pg/grpGold.png";
import DarkPg from "../../assets/pricing-pg/darkPg.png";
import Rarrow from "../../assets/pricing-pg/Rarrow.png";
import BG from "../../assets/pricing-pg/Pricing1.png";
import { Link } from "react-router-dom";

export default function AfterUiPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMore, setShowMore] = useState({});
  const [currentPlanIndex, setCurrentPlanIndex] = useState(0);
  const [copiedCode, setCopiedCode] = useState(null);

  const staticDescriptions = {
    basic: "Perfect for personal or casual users who want a simple idea of interior design.",
    premium: "Ideal for homeowners or renters looking for more creative control and polished designs.",
    pro: "Best for professionals, renovators, or anyone seeking top-tier results and personalization."
  };

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch("https://www.stacklycloud.com/admin/api/plans/");
        if (!response.ok) {
          throw new Error("Failed to fetch plans");
        }
        const data = await response.json();
        console.log("API response:", data); // Debug: Log API response
        const sortedPlans = data.plans.sort((a, b) => a.price - b.price);
        const mappedPlans = sortedPlans.map((plan, index) => ({
          ...plan,
          tier: index === 0 ? "basic" : index === 1 ? "premium" : "pro",
          description: staticDescriptions[index === 0 ? "basic" : index === 1 ? "premium" : "pro"] || plan.description
        }));
        console.log("Mapped plans:", mappedPlans); // Debug: Log mapped plans
        setPlans(mappedPlans);
        const showMoreState = {};
        mappedPlans.forEach((plan) => {
          showMoreState[plan.id] = false;
        });
        setShowMore(showMoreState);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const toggleShowMore = (planId) => {
    setShowMore((prev) => ({
      ...prev,
      [planId]: !prev[planId],
    }));
  };

  const handleCopy = async (code) => {
    if (!code) {
      console.warn("No offer code to copy");
      alert("No offer code available to copy.");
      return;
    }
    try {
      console.log("Attempting to copy code:", code); // Debug: Log code being copied
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(code);
      } else {
        // Fallback for older browsers
        const textarea = document.createElement("textarea");
        textarea.value = code;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      alert("Failed to copy the code. Please copy it manually.");
    }
  };

  const PlanCard = ({ plan, mobile = false, isPopular = false }) => {
    const features = Array.isArray(plan.features) ? plan.features : [];
    const visibleFeatures = showMore[plan.id] ? features : features.slice(0, 4);

    const getPlanStyles = (tier) => {
      switch (tier) {
        case "premium":
          return {
            background: "linear-gradient(180deg, rgba(72, 32, 126, 0.8) 0%, rgba(0, 0, 0, 0.8) 77.57%)",
            boxShadow: mobile ? "none" : "8px 8px 4px 0px #00000029 inset, -8px -8px 4px 0px #00000029 inset",
            featureBg: "bg-[linear-gradient(180deg,#8A38F5_0%,#C22CA2_100%)]"
          };
        case "pro":
          return {
            background: "black",
            boxShadow: "",
            featureBg: "bg-[linear-gradient(180deg,#FBA716_41.67%,#95630D_157.14%)]"
          };
        case "basic":
        default:
          return {
            background: "black",
            boxShadow: "",
            featureBg: "bg-[linear-gradient(180deg,#8A38F5_0%,#C22CA2_100%)]"
          };
      }
    };

    const styles = getPlanStyles(plan.tier);

    return (
      <div
        className={`${
          mobile ? "w-[85vw] max-w-[280px] p-4" : "w-full max-w-[380px] p-3 sm:p-6"
        } relative rounded-xl flex flex-col gap-3 sm:gap-6 mx-auto border-2 border-solid border-[#FFFFFF80] box-border`}
        style={{
          background: styles.background,
          boxShadow: styles.boxShadow
        }}
      >
        {isPopular && (
          <span className="absolute top-0 right-0 bg-gradient-to-b from-[#FFAA17] to-[#99660E] px-2 py-1 text-white text-xs font-medium rounded-tr-md rounded-bl-lg">
            Most Popular
          </span>
        )}

        <div className="flex flex-col gap-2 sm:gap-5">
          <div className="flex justify-center items-center">
            <h3 className="font-bold text-sm sm:text-2xl text-white text-center">
              {plan.name}
              {plan.tier === "basic" && (
                <span className="text-white text-[9px] sm:text-lg"> (Free)</span>
              )}
            </h3>
          </div>

          <p className="text-white text-[9px] sm:text-sm text-center leading-tight">{plan.description}</p>

          <div className="text-white text-sm sm:text-2xl font-bold text-center">
            ${plan.price} <span className="text-[9px] sm:text-base font-normal">/per month</span>
          </div>

          {/* Offer Code */}
          {plan.tier !== "basic" && (
            <div
              className={`p-4 rounded-lg text-center text-white shadow-[0_2px_12px_#007B8229] bg-[#8A38F51A]`}
            >
              <p className="text-xs font-medium">
                {plan.offerText || "Use code (Get 10%OFF)"}
              </p>
              <div className="flex items-center justify-center gap-2 mt-1">
                <img
                  src={DarkPg}
                  alt="copy"
                  className="w-4 h-4 cursor-pointer filter brightness-0 invert"
                  onClick={() => handleCopy(plan.offerCode)}
                  title="Click to copy coupon"
                />
                <span
                  onClick={() => handleCopy(plan.offerCode)}
                  className="font-bold text-lg cursor-pointer text-white"
                >
                  {plan.offerCode || "No code available"}
                  {copiedCode === plan.offerCode && plan.offerCode && (
                    <span className="text-xs ml-1">(Copied!)</span>
                  )}
                </span>
              </div>
            </div>
          )}

          {plan.tier !== "basic" && (
            <Link
              to={`/AfterConformationPage${plan.tier === "pro" ? " " : ""}`}
              state={{ plan }}
            >
              <div
                className="w-full h-7 sm:h-12 gap-1 sm:gap-2 rounded-3xl border border-[#C22CA299] 
                 px-3 sm:px-6 py-1 sm:py-3 text-white flex justify-center items-center 
                 bg-gradient-to-r from-[#8A38F580] to-[#C22CA280]
                 hover:bg-gradient-to-b from-[#007B82] to-[#00B0BA] hover:text-white"
              >
                <span className="text-xs sm:text-base">Purchase</span>
              </div>
            </Link>
          )}
        </div>

        <hr className="border-dashed border-[#C99FFF]" />

        <div className="flex flex-col gap-1.5 sm:gap-4 mt-2 sm:mt-5">
          {visibleFeatures.map((item, idx) => (
            <div className="flex gap-1.5 sm:gap-2 items-start" key={idx}>
              <div
                className={`w-3 h-3 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0 rounded-[3px] flex items-center justify-center ${styles.featureBg}`}
              >
                <svg
                  width="8"
                  height="8"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-1.5 sm:w-3 h-1.5 sm:h-3"
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
              <span className="text-white text-[9px] sm:text-sm font-medium leading-tight">
                {typeof item === "object" ? item.text || item.name : item}
              </span>
            </div>
          ))}

          {features.length > 4 && (
            <div className="flex gap-1 sm:gap-2 items-center cursor-pointer text-white" onClick={() => toggleShowMore(plan.id)}>
              <svg
                width="8"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                className={`w-2 h-2.5 sm:w-3 sm:h-4 transition-transform ${
                  showMore[plan.id] ? "rotate-90" : ""
                }`}
              >
                <path
                  d="M8 5L15 12L8 19"
                  stroke="#8A38F5"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-[9px] sm:text-sm">
                {showMore[plan.id] ? "Show Less" : `See ${features.length - 4} more`}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading)
    return <div className="text-white text-center py-12">Loading plans...</div>;
  if (error)
    return <div className="text-white text-center py-12">Error: {error}</div>;
  if (plans.length === 0)
    return (
      <div className="text-white text-center py-12">
        No active plans available
      </div>
    );

  const sortedPlans = [...plans].sort((a, b) => a.price - b.price);

  return (
 <section
  id="afteruiplan" // This allows scrolling to this section
  className="w-full py-6 sm:py-12 px-4 bg-cover bg-top bg-no-repeat"
  style={{
    backgroundImage: `url(${BG})`,
    backgroundColor: "#000",
  }}
>
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-6 sm:gap-12">
        <div className="text-center">
          <h2
            className="text-white text-xl sm:text-3xl md:text-4xl font-medium mb-3 max-w-2xl mx-auto"
            style={{ fontFamily: "Aptos Serif" }}
          >
            Find the right plan that suits your needs
          </h2>
          <p
            className="text-white text-xs sm:text-base md:text-lg max-w-2xl mx-auto"
            style={{ fontFamily: "Inter", fontWeight: 400 }}
          >
            Start free or unlock premium features. Choose what fits your journey best.
          </p>
        </div>

        {/* Mobile Slider */}
        <div className="w-full sm:hidden">
          <div className="overflow-hidden w-full">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{
                width: `${sortedPlans.length * 100}%`,
                transform: `translateX(-${(currentPlanIndex * 100) / sortedPlans.length}%)`,
              }}
            >
              {sortedPlans.map((plan, index) => (
                <div
                  key={plan.id}
                  className="w-full flex-shrink-0 flex justify-center"
                  style={{ width: `${100 / sortedPlans.length}%` }}
                >
                  <PlanCard
                    plan={plan}
                    mobile
                    isPopular={plan.tier === "pro"}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center items-center gap-4 mt-4">
            <button
              onClick={() =>
                setCurrentPlanIndex((prev) => (prev > 0 ? prev - 1 : 0))
              }
              className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous plan"
              disabled={currentPlanIndex === 0}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 18L9 12L15 6"
                  stroke={currentPlanIndex === 0 ? "#CDCDCD" : "#2A2A2A"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div className="flex gap-1.5">
              {sortedPlans.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPlanIndex(index)}
                  className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                    currentPlanIndex === index ? "bg-cyan-400" : "bg-gray-400"
                  }`}
                  aria-label={`Go to plan ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() =>
                setCurrentPlanIndex((prev) =>
                  prev < sortedPlans.length - 1 ? prev + 1 : prev
                )
              }
              className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next plan"
              disabled={currentPlanIndex === sortedPlans.length - 1}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 18L15 12L9 6"
                  stroke={currentPlanIndex === sortedPlans.length - 1 ? "#CDCDCD" : "#2A2A2A"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:grid grid-cols-3 gap-4 sm:gap-6 w-full">
          {sortedPlans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isPopular={plan.tier === "pro"}
            />
          ))}
        </div>
      </div>
    </section>
  );
}