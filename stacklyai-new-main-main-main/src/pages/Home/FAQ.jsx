import React, { useState } from "react";
import star from "../../assets/home/Big star.png";
import Faqimg1 from "../../assets/home/FAQ.png";
import Faqimg2 from "../../assets/afterHome/study2.png";
import Faqimg3 from "../../assets/afterHome/g2.png";
import Faqimg4 from "../../assets/afterHome/g3.png";
import Faqimg5 from "../../assets/afterHome/BedRoom6.png";
import Faqimg6 from "../../assets/afterHome/study3.png";

export default function FAQ({ faqs }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const [imgIndex, setImgIndex] = useState(0); // default image index

  const faqImages = [Faqimg1, Faqimg2, Faqimg3, Faqimg4, Faqimg5, Faqimg6];

  const toggleFAQ = (index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));

    // Change image index every time a FAQ is clicked
    setImgIndex((prevImgIndex) => (prevImgIndex + 1) % faqImages.length);
  };

  return (
    <section
      className="w-full pt-[60px] pr-[80px] pb-[60px] pl-[80px] bg-black
                 max-[1280px]:px-[60px] max-[1024px]:px-[40px] max-[768px]:px-[24px] max-[640px]:px-[16px] 
                 max-[640px]:pt-[40px] max-[640px]:pb-[40px]"
    >
      <div className="w-full flex flex-col sm:flex-row gap-[52px] max-[768px]:gap-[32px] max-[640px]:gap-[24px]">

        {/* Right Side Div (FAQ List) */}
        <div className="flex-1 flex flex-col gap-[52px] max-[768px]:gap-[32px] max-[640px]:gap-[24px]">
          {/* Top Section */}
          <div className="flex flex-col gap-[24px] max-[768px]:gap-[20px]">
            <div className="flex flex-col gap-[12px]">
              <div className="flex items-center gap-[12px]">
                <div className="text-white font-[500] lora-text text-[42px] leading-[100%] 
                                max-[1024px]:text-[36px] max-[768px]:text-[28px] max-[640px]:text-[24px]">
                  Have a
                </div>
                <div className="w-[32px] h-[32px] max-[768px]:w-[28px] max-[768px]:h-[28px] max-[640px]:w-[24px] max-[640px]:h-[24px]">
                  <img
                    src={star}
                    alt="icon"
                    className="w-full h-full object-contain"
                    style={{ animation: "spin 4s linear infinite" }}
                  />
                </div>
              </div>
              <div className="text-white font-[500] lora-text text-[42px] leading-[100%] 
                              max-[1024px]:text-[36px] max-[768px]:text-[28px] max-[640px]:text-[24px]">
                Question?
              </div>
            </div>

            <p className="text-white font-normal text-[16px] leading-[140%] poppins-font 
                          max-[1024px]:text-[15px] max-[768px]:text-[14px] max-[640px]:text-[13px] max-[640px]:leading-[18px]">
              Have questions? We've got answers! Explore our FAQs to learn more about how Stackly AI works, its features, and how it can help you streamline your tasks effortlessly.
            </p>
          </div>

          {/* FAQ Section */}
          <div className="flex flex-col gap-[28px] max-[768px]:gap-[20px] max-[640px]:gap-[16px]">
            {faqs.map((faq, index) => (
              <div key={index} onClick={() => toggleFAQ(index)} className="cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="text-white font-[Inter] font-normal text-[18px] 
                                  max-[1024px]:text-[16px] max-[768px]:text-[14px] max-[640px]:text-[13px] leading-[100%]">
                    {faq.question}
                  </div>
                  <div className="w-[34px] h-[34px] max-[768px]:w-[28px] max-[768px]:h-[28px] max-[640px]:w-[24px] max-[640px]:h-[24px]">
                    <img
                      src={star}
                      alt="icon"
                      className="w-full h-full object-contain"
                      style={{ animation: "spin 4s linear infinite" }}
                    />
                  </div>
                </div>

                {activeIndex === index && (
                  <div className="text-white text-[16px] max-[1024px]:text-[15px] max-[768px]:text-[14px] max-[640px]:text-[13px] 
                                  ml-12 mt-[10px] leading-[160%] max-[640px]:ml-8 max-[640px]:mt-[8px] poppins-font">
                    {faq.answer}
                  </div>
                )}

                <div
                  className="w-full h-[0px] border-t border-solid mt-[16px] max-[640px]:mt-[12px]"
                  style={{
                    borderImage:
                      "linear-gradient(90deg, #000000 0%, #C22CA2 30%, #8A38F5 70%, #000000 100%) 1",
                    borderWidth: "1px",
                  }}
                ></div>
              </div>
            ))}
          </div>
        </div>

        {/* Left Side Div (FAQ Image) */}
        <div className="rounded-[12px] hidden sm:block 
                        sm:w-[400px] md:w-[350px] lg:w-[485px] sm:h-auto transition-all duration-500">
          <img
            src={faqImages[imgIndex]}
            alt="FAQ Illustration"
            className="w-full h-full object-cover rounded-[12px]"
          />
        </div>

      </div>

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </section>
  );
}
