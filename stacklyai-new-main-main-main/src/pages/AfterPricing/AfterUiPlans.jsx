import React, { useState, useEffect } from "react";
import Tik from "../../assets/pricing-pg/tik.png";
import Silver from "../../assets/pricing-pg/silver.png";
import Gold from "../../assets/pricing-pg/grpGold.png";
import DarkPg from "../../assets/pricing-pg/darkPg.png";
import Rarrow from "../../assets/pricing-pg/Rarrow.png";
import BG from "../../assets/pricing-pg/bg-plan.png";
import { Link } from "react-router-dom";

export default function AfterUiPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMore, setShowMore] = useState({});
  const [currentPlanIndex, setCurrentPlanIndex] = useState(0);
  const [copiedCode, setCopiedCode] = useState(null);

  // Static descriptions for each plan type
  const staticDescriptions = {
    basic: "Perfect for personal or casual users who want a simple idea of interior design.",
    premium: "Ideal for homeowners or renters looking for more creative control and polished designs.",
    pro: "Best for professionals, renovators, or anyone seeking top-tier results and personalization."
  };

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch("https://www.ai.stacklycloud.com/stackly_admin/api/plans/");
        if (!response.ok) {
          throw new Error("Failed to fetch plans");
        }
        const data = await response.json();
        
        // Sort plans by price to determine tier
        const sortedPlans = data.plans.sort((a, b) => a.price - b.price);
        
        // Map API data to our format, assigning tiers based on sorted order
        const mappedPlans = sortedPlans.map((plan, index) => ({
          ...plan,
          // Assign tier based on index: 0 = basic, 1 = mid-tier (premium), 2 = high-tier (pro)
          tier: index === 0 ? "basic" : index === 1 ? "premium" : "pro",
          // Use static description based on tier
          description: staticDescriptions[index === 0 ? "basic" : index === 1 ? "premium" : "pro"] || plan.description
        }));
        
        setPlans(mappedPlans);

        // Initialize showMore state for each plan
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

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const PlanCard = ({ plan, mobile = false, isPopular = false }) => {
    const features = Array.isArray(plan.features) ? plan.features : [];
    const visibleFeatures = showMore[plan.id] ? features : features.slice(0, 5);

    // Dynamic styles based on tier
    const getPlanStyles = (tier) => {
      switch (tier) {
        case "premium": // Formerly "silver"
          return {
            background: "linear-gradient(180deg, rgba(72, 32, 126, 0.8) 0%, rgba(0, 0, 0, 0.8) 77.57%)",
            border: "2px solid #FFFFFF33",
            boxShadow: "8px 8px 4px 0px #00000029 inset, -8px -8px 4px 0px #00000029 inset",
            featureBg: "bg-[linear-gradient(180deg,#8A38F5_0%,#C22CA2_100%)]"
          };
        case "pro": // Formerly "gold"
          return {
            background: "black",
            border: "2px solid #FFFFFF33",
            boxShadow: "",
            featureBg: "bg-[linear-gradient(180deg,#FBA716_41.67%,#95630D_157.14%)]"
          };
        case "basic":
        default:
          return {
            background: "black",
            border: "1px solid #FFFFFF33",
            boxShadow: "",
            featureBg: "bg-[linear-gradient(180deg,#8A38F5_0%,#C22CA2_100%)]"
          };
      }
    };

    const styles = getPlanStyles(plan.tier);

    return (
      <div
        className={`${
          mobile ? "w-[340px]" : "w-full"
        } relative rounded-[12px] p-5 flex flex-col gap-6`}
        style={{
          background: styles.background,
          border: styles.border,
          boxShadow: styles.boxShadow
        }}
      >
        {isPopular && (
          <span className="absolute top-0 right-0 bg-gradient-to-b from-[#FFAA17] to-[#99660E] px-2 py-1 text-white text-xs font-medium rounded-tr-md rounded-bl-lg">
            Most Popular
          </span>
        )}

        <div className="flex flex-col gap-4">
          <div className="flex justify-center items-center">
            <h3 className="font-bold text-2xl text-white text-center">
              {plan.name}
              {plan.tier === "basic" && (
                <span className="text-white text-lg"> (Free)</span>
              )}
            </h3>
          </div>

          {/* Description */}
          <p className="text-white text-sm text-center">{plan.description}</p>

          {/* Price */}
          <div className="text-white text-2xl font-bold text-center">
            ${plan.price} <span className="text-base font-normal">/per month</span>
          </div>

          {/* Offer Code */}
          {plan.offerCode && (
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
                  {plan.offerCode}
                  {copiedCode === plan.offerCode && (
                    <span className="text-xs ml-1">(Copied!)</span>
                  )}
                </span>
              </div>
            </div>
          )}

          {/* Button */}
          {plan.tier !== "basic" && (
            <Link
              to={`/AfterConformationPage${plan.tier === "pro" ? "1" : ""}`}
              state={{ plan }}
            >
              <div
                className="w-full h-[42px] gap-[10px] rounded-[30px] border border-[#C22CA299] 
                 px-[30px] py-[10px] text-white flex justify-center items-center 
                 bg-gradient-to-r from-[#8A38F580] to-[#C22CA280]
                 hover:bg-gradient-to-b from-[#007B82] to-[#00B0BA] hover:text-white"
              >
                Purchase
              </div>
            </Link>
          )}
        </div>

        {/* Divider */}
        <hr className="border-dashed border-[#C99FFF]" />

        {/* Features */}
        <div className="flex flex-col gap-4 mt-4">
          {visibleFeatures.map((item, idx) => (
            <div className="flex gap-2 items-start" key={idx}>
              <div
                className={`w-5 h-5 mt-0.5 flex-shrink-0 rounded-[4px] flex items-center justify-center ${styles.featureBg}`}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
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
              <span className="text-white text-sm font-medium">
                {typeof item === "object" ? item.text || item.name : item}
              </span>
            </div>
          ))}

          {features.length > 5 && (
            <button
              className="flex gap-2 items-center cursor-pointer text-white"
              onClick={() => toggleShowMore(plan.id)}
            >
              <svg
                width="10"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                className={`w-3 h-4 transition-transform ${
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
              <span className="text-sm">
                {showMore[plan.id] ? "Show Less" : `See ${features.length - 5} more`}
              </span>
            </button>
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

  // Sort plans by price
  const sortedPlans = [...plans].sort((a, b) => a.price - b.price);

  return (
    <section
      className="w-full py-12 px-4 bg-black bg-cover bg-top bg-no-repeat max-[440px]:-mt-[118px]"
    >
      <div className="hidden max-[440px]:block w-[168px] h-[168px] bg-[#00B0BA66] mx-auto mb-6 rounded-full blur-[124px]"></div>

      <div className="max-w-6xl mx-auto flex flex-col items-center gap-12 max-[440px]:-mt-[185px]">
        <div className="text-center">
          <h2
            className="text-white text-[32px] leading-[1.2] md:text-4xl font-medium mb-4 max-w-2xl mx-auto max-[440px]:w-[400px] max-[440px]:h-[24px] max-[440px]:text-[20px] max-[440px]:leading-[100%] max-[440px]:text-center"
            style={{ fontFamily: "Aptos Serif" }}
          >
            Find the right plan that <br className="hidden md:inline" /> suits
            your needs
          </h2>

          <p
            className="text-white text-[20px] md:text-xl max-w-2xl mx-auto whitespace-nowrap max-[440px]:w-[400px] max-[440px]:h-[44px] max-[440px]:text-[16px] max-[440px]:leading-[140%] max-[440px]:text-center max-[440px]:whitespace-normal"
            style={{ fontFamily: "Inter", fontWeight: 400 }}
          >
            Start free or unlock premium features. Choose what fits your journey
            best.
          </p>
        </div>

        {/* Mobile Slider */}
        <div className="w-full md:hidden flex flex-col items-center">
          <div className="overflow-hidden w-[366px]">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{
                transform: `translateX(-${currentPlanIndex * 366}px)`,
              }}
            >
              {sortedPlans.map((plan) => (
                <div key={plan.id} className="w-[366px] flex-shrink-0 px-2">
                  <PlanCard
                    plan={plan}
                    mobile
                    isPopular={plan.tier === "pro"}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={() =>
                setCurrentPlanIndex((prev) => (prev > 0 ? prev - 1 : 0))
              }
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

            <div className="flex gap-2">
              {sortedPlans.map((_, index) => (
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

            <button
              onClick={() =>
                setCurrentPlanIndex((prev) =>
                  prev < sortedPlans.length - 1 ? prev + 1 : prev
                )
              }
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Next plan"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 18L15 12L9 6"
                  stroke="#CDCDCD"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
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
