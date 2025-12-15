import React, { useState } from "react";
// import Bg from "../../assets/contact/FAQS.png";
import star from "../../assets/home/Big star.png";

export default function PricingFaq() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [faqCategory, setFaqCategory] = useState(0); // 0 = Get to Know, 1 = Pricing, 2 = API
  const [visibleCount, setVisibleCount] = useState(4); // Number of FAQs to show initially

  const toggleFAQ = (index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const activeStyle = {
    background:
      "linear-gradient(95.92deg, rgba(138, 56, 245, 0.5) 15.32%, rgba(194, 44, 162, 0.5) 99.87%)",
    backdropFilter: "blur(0px)",
  };

  const inactiveStyle = {
    backdropFilter: "blur(8px)",
    background: "rgba(255, 255, 255, 0.1)",
  };

  const buttonBaseClass = `
    w-[215px] 
    h-[39px] 
    rounded-[30px] 
    border 
    border-[#C22CA299] 
    px-[30px] 
    py-[10px] 
    text-white 
    font-medium 
    text-[16px] 
    flex 
    items-center 
    justify-center 
    transition-all 
    duration-500 
    ease-in-out
  `;

  const faqs = [
    // Group 1: Get to Know Stackly (6 items)
    {
      question: "What is Stackly AI?",
      answer:
        "Stackly AI is an intelligent platform designed to streamline your tasks using automation and smart tools. It helps enhance productivity by offering tailored solutions based on your needs.",
    },
    {
      question: "How does Stackly AI work?",
      answer:
        "Stackly AI works by analyzing your input and tasks, then offering automated suggestions, integrations, and tools to make your workflow more efficient and seamless.",
    },
    {
      question: "Is Stackly AI free to use?",
      answer:
        "Stackly AI offers both free and premium plans. The free plan includes essential features, while premium plans unlock advanced capabilities and integrations.",
    },
    {
      question: "How do I contact Stackly AI?",
      answer:
        "You can reach out to Stackly AI by sending an email to support@stackly.ai or by filling out the contact form on our website's Contact Us page. We're here to help with any questions, feedback, or support you may need.",
    },
    {
      question: "What makes Stackly AI different?",
      answer:
        "Stackly AI stands out with its intuitive interface, powerful automation capabilities, and customizable workflows that adapt to your specific needs.",
    },
    {
      question: "Is there a mobile app available?",
      answer:
        "Yes, Stackly AI is available on both iOS and Android platforms, allowing you to manage your tasks on the go.",
    },

    // Group 2: Plans & Pricing (6 items)
    {
      question: "How do I get started with StacklyAI APIs?",
      answer:
        "Getting started is easy! Simply sign up for an account, choose your plan, and you'll gain immediate access to our API documentation and endpoints.",
    },
    {
      question: "What authentication method does StacklyAI use?",
      answer:
        "We use OAuth 2.0 for secure authentication, along with API keys for simpler integrations.",
    },
    {
      question: "Are there any rate limits on API requests?",
      answer:
        "Yes, rate limits apply based on your subscription plan. Free tier has lower limits while premium plans offer higher thresholds.",
    },
    {
      question: "What image formats do StacklyAI APIs support?",
      answer:
        "Our APIs support common formats like JPG, PNG, and JPGE, with additional formats available in enterprise plans.",
    },
    {
      question: "Can I upgrade my plan at any time?",
      answer:
        "Absolutely! You can upgrade your plan anytime from your account dashboard, with prorated charges for the remaining billing period.",
    },
    {
      question: "Is there a free trial for premium features?",
      answer:
        "Yes, we offer 10 credits free trial for all premium features so you can test them before committing.",
    },

    // Group 3: API Integration (6 items)
    {
      question: "What do I get with a STACKLY AI membership?",
      answer:
        "Membership includes access to all core features, priority support, and regular updates with new capabilities.",
    },
    {
      question: "Is the API available for all users?",
      answer:
        "API access is available to all users, with different access levels based on your subscription tier.",
    },
    {
      question: "What can I do with the STACKLY AI API?",
      answer:
        "Our API allows you to integrate AI capabilities into your own applications, automate workflows, and build custom solutions.",
    },
    {
      question: "Can I cancel or change my membership anytime?",
      answer:
        "Yes, you can modify or cancel your membership at any time through your account settings.",
    },
    {
      question: "How to handle other image formats e.g. HEIC, HEIF etc?",
      answer:
        "For unsupported image formats, you can contact support. We provide guidance or tools to convert and use those formats.",
    },
    {
      question: "What is the expiration period for my credit pack?",
      answer:
        "Credit packs typically have an expiration of 12 months from the purchase date. Check your account for details.",
    },
  ];

  const categoryRanges = [
    { start: 0, end: 6 }, // Get to Know Stackly (6 items)
    { start: 6, end: 12 }, // Plans & Pricing (6 items)
    { start: 12, end: 18 }, // API Integration (6 items)
  ];

  const getFaqSlice = () => {
    const { start } = categoryRanges[faqCategory];
    return faqs.slice(start, start + visibleCount);
  };

  const handleViewAll = () => {
    const totalInCategory =
      categoryRanges[faqCategory].end - categoryRanges[faqCategory].start;
    setVisibleCount((prev) => (prev >= totalInCategory ? 4 : totalInCategory));
  };

  const currentCategoryCount =
    categoryRanges[faqCategory].end - categoryRanges[faqCategory].start;

  return (
   <section className="w-full h-auto min-h-[746px] bg-black relative overflow-x-hidden">
     {/* Full-width background text (FAQS) */}
     <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -mt-[30px] z-0 w-[1200px] md:w-[1400px] lg:w-[1561px] h-[200px] md:h-[300px] lg:h-[401px] flex justify-center items-center pointer-events-none select-none">
       <h1
         className="leading-none font-bold text-white text-[80px] sm:text-[140px] md:text-[200px] lg:text-[273px]"
         style={{
           fontFamily: "Poppins, sans-serif",
           color: "#FFFFFF14",
         }}
       >
         FAQS
       </h1>
     </div>
   
     {/* Content */}
     <div className="relative w-full h-full max-w-screen-xl mx-auto py-12 px-4 sm:px-6 flex flex-col items-center">
       {/* Heading */}
       <div className="text-center mb-10 w-full mt-10">
         <h2 className="text-[24px] sm:text-[28px] md:text-[32px] font-black text-white leading-tight">
           Frequently Asked Questions
         </h2>
         <p className="mt-3 text-white max-w-[941px] mx-auto text-[14px] sm:text-[16px] md:text-[18px] font-normal leading-relaxed">
           Have questions? We've got answers! Explore our FAQs to learn more about
           how Stackly AI works, its features, and how it can help you streamline
           your tasks effortlessly.
         </p>
       </div>
   
       {/* Category Buttons */}
       <div className="w-full flex justify-center mt-1">
         <div className="flex gap-3 flex-wrap justify-center max-w-[700px]">
           {/* Reusable Button */}
           {["Get to Know Stackly", "Plans & Pricing", "API Integration"].map(
             (label, idx) => (
               <div
                 key={idx}
                 className="
                   w-auto min-w-[160px] px-4 h-[36px]
                   sm:w-[200px] sm:h-[39px] sm:px-[30px]
                   rounded-[30px] border border-[#C22CA299]
                   text-white font-medium text-[14px] sm:text-[16px]
                   flex items-center justify-center
                   transition-all duration-300 hover:opacity-90
                 "
                 style={faqCategory === idx ? activeStyle : inactiveStyle}
                 onClick={() => setFaqCategory(idx)}
               >
                 <button className="w-full h-full flex items-center justify-center whitespace-nowrap">
                   {label}
                 </button>
               </div>
             )
           )}
         </div>
       </div>
   
       {/* FAQ Items */}
       <div className="w-full flex flex-col gap-6 mt-10 px-2 sm:px-6 md:px-12">
         {getFaqSlice().map((faq, index) => (
           <div key={index} onClick={() => toggleFAQ(index)} className="cursor-pointer">
             {/* Question row */}
             <div className="w-full flex items-center justify-between">
               <div className="flex-1 text-white text-[14px] sm:text-[16px] md:text-[18px] font-normal leading-snug font-['Inter'] pr-4">
                 {faq.question}
               </div>
               <div
                 className="w-[24px] h-[24px] sm:w-[28px] sm:h-[28px] md:w-[34px] md:h-[34px] flex-shrink-0"
                 style={{
                   animation: "spin 6s linear infinite",
                 }}
               >
                 <img
                   src={star}
                   alt="icon"
                   className="w-full h-full object-contain"
                 />
               </div>
             </div>
   
             {/* Answer */}
             {activeIndex === index && (
               <div className="text-white text-[13px] sm:text-[14px] md:text-[16px] ml-[20px] sm:ml-[40px] md:ml-[90px] mt-2 leading-[140%] font-['Poppins'] max-w-full md:max-w-[1000px]">
                 {faq.answer}
               </div>
             )}
   
             {/* Gradient divider */}
             <div
               className="w-full h-[0px] border-t border-solid mt-4"
               style={{
                 borderImage:
                   "linear-gradient(90deg, #000000 0%, #C22CA2 30%, #8A38F5 70%, #000000 100%) 1",
                 borderWidth: "1px",
               }}
             ></div>
           </div>
         ))}
       </div>
   
       {/* View All Button */}
       {currentCategoryCount > 4 && (
         <div className="mt-6 mb-2 flex justify-center">
           <button
             onClick={handleViewAll}
             className="
               px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg font-semibold
               text-[13px] sm:text-[14px] text-white
               bg-[#1F0D3B] shadow-md
               hover:bg-gradient-to-r hover:from-[#8A38F5] hover:to-[#C22CA2]
               hover:scale-105 transition-all duration-300 relative
               before:absolute before:inset-0 before:rounded-lg before:border-2
               before:border-gradient-to-r before:from-[#8A38F5] before:to-[#C22CA2]
               before:pointer-events-none
             "
             style={{
               borderImageSlice: 1,
               borderImageSource: "linear-gradient(90deg, #8A38F5, #C22CA2)",
             }}
           >
             {visibleCount >= currentCategoryCount ? "Show Less" : "View All"}
           </button>
         </div>
       )}
     </div>
   
     {/* Animation */}
     <style>
       {`
         @keyframes spin {
           to {
             transform: rotate(360deg);
           }
         }
       `}
     </style>
   </section>
  );
}