import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";  
import "react-toastify/dist/ReactToastify.css";  
import apiBackground from "../../assets/api/back.png";
import AfterKeys from "./AfterKeys";
import AfterApiIntegrate from "./AfterApiIntegrate";
import AfterPlan from "./AfterPlan";
import AfterUiPlan from "./AfterUiPlan";
import AfterApiAccess from "./AfterApiAccess";
import AfterHowItWorks from "./AfterHowItWorks";
import AfterCustomAPIPlan from "./AfterCustomApiPlan";
import AfterDraggable from "./AfterDraggable";
import sec14Img2 from "../../assets/home/sec14/Vector.png";
import sec14Img3 from "../../assets/home/sec14/m1.jpg";
import sec14Img4 from "../../assets/home/sec14/m2.jpg";
import sec14Img5 from "../../assets/home/sec14/m3.jpg";
import AfterApiFaq from "./AfterApiFaq";
import keyImage from "../../assets/api/key.png";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import BG1 from "../../assets/afterHome/APIAfterLogin.png";
import BG2 from "../../assets/afterHome/APIAfterLogin2.png";
import Group from "../../assets/afterHome/GroupApi.png";
import card from "../../assets/afterHome/ApiCard.png";
import Group2 from "../../assets/afterHome/Group2.png";
import ApiVector from "../../assets/afterHome/ApiVector.png";

export default function AfterHeroApi() {
  const location = useLocation();

  const faqs = [
    {
      question: "How do I get started with StacklyAI APIs?",
      answer:
        "Stackly AI is an intelligent platform designed to streamline your tasks using automation and smart tools. It helps enhance productivity by offering tailored solutions based on your needs.",
    },
    {
      question: "What authentication method does StacklyAI use?",
      answer:
        "Stackly AI works by analyzing your input and tasks, then offering automated suggestions, integrations, and tools to make your workflow more efficient and seamless.",
    },
    {
      question: "Are there any rate limits on API requests?",
      answer:
        "Stackly AI offers both free and premium plans. The free plan includes essential features, while premium plans unlock advanced capabilities and integrations.",
    },
    {
      question: "What image formats do StacklyAI APIs support?",
      answer:
        "You can reach out to Stackly AI through our support page, via email at support@stackly.ai, or use the chat feature on our website for instant assistance.",
    },
    {
      question: "How to handle other image formats e.g. HEIC, HEIF etc?",
      answer:
        "You can reach out to Stackly AI through our support page, via email at support@stackly.ai, or use the chat feature on our website for instant assistance.",
    },
    {
      question: "What is the expiration period for my credit pack?",
      answer:
        "You can reach out to Stackly AI through our support page, via email at support@stackly.ai, or use the chat feature on our website for instant assistance.",
    },
  ];

  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  if (!email) {
    setEmailError("Email is required.");
  } else if (!emailRegex.test(email)) {
    setEmailError("Please enter a valid Gmail address (e.g., yourname@gmail.com).");
  } else {
    setEmailError("");
  }
};


  const toastStyle = {
    background:
      "linear-gradient(95.92deg, rgba(138,56,245,0.5) 15.32%, rgba(194,44,162,0.5) 99.87%)",
    color: "#ffffff",
    border: "1px solid rgba(194,44,162,0.6)",
    borderRadius: "12px",
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 500,
    fontSize: "15px",
  };

 const [errors, setErrors] = useState({});
const [formData, setFormData] = useState({
  full_name: "",
  email: "",
  contact_number: "",
  company_name: "",
  address: "",
  message: "",
  country_code: "+91", // ✅ Add this
});


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      toast.error("🔐 You need to login first!", {
        style: toastStyle,
        autoClose: 2000,
      });
      return;
    }

    // ✅ Gmail-only validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(formData.email)) {
      toast.warning("Please enter a valid Gmail address (e.g., yourname@gmail.com)", {
        style: toastStyle,
        autoClose: 2500,
      });
      return;
    }

    if (!formData.full_name || !formData.email || !formData.company_name) {
      toast.warning("⚠️ Please fill all required fields.", {
        style: toastStyle,
        autoClose: 2000,
      });
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        "https://www.ai.stacklycloud.com/api/submit-api-access",
        { user_id: parseInt(userId), ...formData },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("✅ Thank you! Our team will contact you soon.", {
        style: toastStyle,
        autoClose: 3000,
      });

      // ✅ Reset form only after success
      setFormData({
        full_name: "",
        email: "",
        contact_number: "",
        company_name: "",
        address: "",
        message: "",
        
      });
    } catch (err) {
      console.error("Error submitting form:", err);
      toast.error("❌ Submission failed. Please try again.", {
        style: toastStyle,
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!location.hash) return;

    const element = document.querySelector(location.hash);
    if (element) {
      requestAnimationFrame(() => {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      });
    }
  }, [location]);

  return (
    <div>
      {/* section1 */}
      <div
        className="relative w-full lg:w-full max-w-full sm:max-w-[100%] md:max-w-[100%] h-[300px] sm:h-[350px] md:h-[399px] flex flex-col items-center justify-center bg-cover bg-left -mt-[82px] pt-[82px] overflow-hidden"
        style={{
          backgroundImage: `url(${BG1})`,
          backgroundColor: "#0f0f0f",
          backgroundPosition: "left center", // keeps image fixed to the left
          backgroundSize: "cover",
        }}
      >
        <div className="flex justify-center w-full px-4 sm:px-6 md:px-8">
          <div
            className="w-full max-w-[1213px] flex items-center justify-between gap-4 sm:gap-6 md:gap-[107px] opacity-100"
            style={{ transform: "rotate(0deg)" }}
          >
            {/* Left Text Div */}
            <div className="flex-1 max-w-[60%] sm:max-w-[705px] h-auto flex items-center">
              <p className="lora-text font-normal text-sm sm:text-lg md:text-[28px] lg:text-[32px] leading-[140%] text-white">
                An{" "}
                <span className="font-semibold bg-gradient-to-b from-[#8A38F5] to-[#C22CA2] text-transparent bg-clip-text">
                  API
                </span>{" "}
                key is your unique access code to authenticate and use{" "}
                <span className="font-semibold">StacklyAI’s</span> rendering engine from
                your own app or system.
              </p>
            </div>


            {/* Right Image Div */}
            <div className="flex items-center justify-center w-[150px] sm:w-[250px] md:w-[350px] h-[100px] sm:h-[150px] md:h-[200px]">
              <img
                src={Group}
                alt="API Illustration"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
      {/* section-2  */}

      {/* //<div className="relative w-full h-[848px] flex items-center justify-center bg-black"> */}
    <div
      className="relative w-full h-[50vh] min-h-[300px] flex items-center justify-center bg-[#011213] bg-cover bg-center"
      style={{ backgroundImage: `url(${BG2})` }}
    >
      <div className="w-full max-w-[1200px] px-4 flex justify-center">
        <div
          className="w-full max-w-[90%] flex flex-col md:flex-row gap-8 md:gap-[10vw] items-center"
          style={{ transform: "rotate(0deg)" }}
        >
          {/* Left Div */}
          <div className="w-full md:w-[40%] flex flex-col justify-center items-start gap-2">
            {/* Top Text Div */}
            <div className="w-full">
              <p className="font-[Lora] font-medium text-[clamp(18px,5vw,24px)] leading-[100%] text-white">
                Your Current <span className="text-[#8A38F5]">API</span> Access
              </p>
            </div>

            {/* Bottom Text Div */}
            <div className="w-full">
              <p className="font-[Poppins] font-normal text-[clamp(12px,3vw,14px)] leading-[130%] text-white">
                Stay in control of your integration with clear access details and key usage limits.
              </p>
            </div>
          </div>

          {/* Right Div */}
          <div
            className="w-full md:w-[60%] min-h-[200px] h-[35vh] md:h-[25vh] opacity-100 rounded-[20px] border border-solid border-white/50 bg-cover bg-center"
            style={{ backgroundImage: `url(${card})`, transform: "rotate(0deg)" }}
          >
            <div
              className="w-[80%] md:w-[50%] h-[66px] absolute top-[10%] left-[5%] opacity-100 flex items-center gap-[2px]"
              style={{ transform: "rotate(0deg)" }}
            >
              {/* Profile user */}
              <div className="flex justify-end items-start">
                <div
                  className="w-[40px] h-[40px] opacity-100 rounded-full flex items-center justify-center -mt-8"
                  style={{
                    transform: "rotate(0deg)",
                    background: "linear-gradient(90deg, #8A38F5 0%, #51218F 100%)"
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2a5 5 0 100 10 5 5 0 000-10zm-7 18a7 7 0 0114 0H5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              {/* Content div */}
              <div
                className="w-[70%] md:w-[60%] h-[66px] opacity-100 flex flex-col justify-center rounded-[12px] px-3 gap-[12px]"
                style={{ transform: "rotate(0deg)" }}
              >
                {/* Top text */}
                <div className="w-full h-[30px]">
                  <p className="font-[Lora] font-medium text-[clamp(20px,5vw,26px)] leading-[100%] text-white">
                    Premium
                  </p>
                </div>

                {/* Bottom text */}
                <div className="w-full h-[24px] flex items-center">
                  <p className="font-[Poppins] text-[clamp(12px,3vw,14px)] font-normal leading-[100%] text-white">
                    Total assigned keys:{" "}
                    <span className="font-medium text-[#8A38F5]">6</span> keys
                  </p>
                </div>
              </div>
            </div>

            <div
              className="w-[40%] md:w-[30%] min-w-[100px] h-[135px] absolute top-[30%] md:top-[40%] right-[5%] opacity-100 flex flex-col items-center gap-[16px]"
              style={{ transform: "rotate(0deg)" }}
            >
              {/* Content 1 */}
              <div className="w-full flex flex-col gap-[6px] opacity-100">
                {/* Top text */}
                <p className="w-full text-right text-white font-[Lora] font-normal text-[clamp(12px,3vw,14px)] leading-[100%]">
                  API Keys Left
                </p>

                {/* Bottom text */}
                <p className="w-full text-right font-[Poppins] font-normal text-[clamp(10px,2.5vw,12px)] leading-[100%] text-[#6D6D6D]">
                  Stay updated on your remaining balance.
                </p>
              </div>

              {/* Content 2 */}
              <div className="w-[80%] min-w-[60px] flex flex-col items-center justify-center gap-[4px] opacity-100">
                {/* Top text */}
                <p
                  className="w-full text-center font-[Poppins] font-semibold text-[clamp(18px,5vw,22px)] leading-[100%]"
                  style={{
                    background: "linear-gradient(108.35deg, #8A38F5 35.6%, rgba(255, 255, 255, 0.8) 51.59%, #8A38F5 67.58%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    boxShadow: "0px 0px 2px 0px #FFFFFF1F",
                  }}
                >
                  14
                </p>

                {/* Bottom text */}
                <p className="w-full text-center font-[Poppins] font-normal text-[clamp(12px,3vw,14px)] leading-[100%] text-white">
                  FOURTEEN
                </p>
              </div>
            </div>

            <div className="absolute bottom-3 left-3 md:left-14">
              <img
                src={Group2}
                alt="Group2"
                className="w-[100px] md:w-[150px] h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

      <AfterPlan />
      <div id="afteruiplan"><AfterUiPlan /></div>

     
<div className="relative bg-black overflow-hidden w-full flex justify-center items-center py-20 px-4 sm:py-28 min-h-screen">
  {/* Form section */}
  <div className="relative z-10 w-full max-w-3xl flex flex-col items-center gap-7 text-white">

    {/* Heading */}
    <div className="w-full flex flex-col items-center gap-3 mb-8 text-center">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-lancelot">
        <span className="text-white">Ready to </span>
        <span className="text-[#8A38F5]">Create Something Great?</span>
      </h2>
      <p className="text-white text-sm sm:text-base md:text-lg font-poppins max-w-[90%] sm:max-w-[400px]">
        We offer flexible API plans tailored to your needs. Let’s build the right setup—just for you.
      </p>
    </div>

    {/* Form */}
   <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        {/* First row: Name & Email */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm mb-1 text-white">Full Name*</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="John"
              className="w-full p-3 rounded-xl border-[1px] border-[#FFFFFF33] bg-white/10 text-white placeholder-white/50 focus:outline-none"
            />
          </div>
          <div className="flex-1">
  <label className="block text-sm mb-1 text-white">Email ID*</label>
  <input
    type="email"
    name="email"
    value={formData.email}
    onChange={(e) => {
      handleChange(e);
      validateEmail(e.target.value); // 👈 real-time validation
    }}
    placeholder="you@example.com"
    className={`w-full p-3 rounded-xl border-[1px] bg-white/10 text-white placeholder-white/50 focus:outline-none
      ${emailError ? "border-red-500" : "border-[#FFFFFF33]"}`}
  />
  {emailError && (
    <p className="text-red-400 text-sm mt-1">{emailError}</p>
  )}
</div>

        </div>

        {/* Second row: Company & Phone */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm mb-1 text-white">Company Name*</label>
            <input
              type="text"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              placeholder="Paul"
              className="w-full p-3 rounded-xl border-[1px] border-[#FFFFFF33] bg-white/10 text-white placeholder-white/50 focus:outline-none"
            />
          </div>
<div className="flex-1 relative">
  <label className="block text-sm mb-1 text-white">Phone Number</label>

  <div className="relative flex items-center">
    {/* Country code inside input */}
    <div className="absolute left-3 z-10">
      <div className="relative">
        <select
          value={formData.country_code || "+91"}
          onChange={(e) => {
            const newCode = e.target.value;
            setFormData({
              ...formData,
              country_code: newCode,
              contact_number: "",
            });
          }}
          className="bg-[#0B0B0B] text-white text-sm pr-6 pl-2 py-[6px]
                     rounded-lg border border-[#FFFFFF33] outline-none cursor-pointer 
                     focus:ring-1 focus:ring-[#8A38F5] focus:border-[#8A38F5] transition-all"
          style={{
            WebkitAppearance: "none",
            MozAppearance: "none",
            appearance: "none",
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 8px center",
            backgroundSize: "12px",
            paddingRight: "28px",
            paddingLeft: "8px",
          }}
        >
          <option value="+91" className="bg-[#0B0B0B] text-white py-2">+91</option>
          <option value="+1" className="bg-[#0B0B0B] text-white py-2">+1</option>
          <option value="+44" className="bg-[#0B0B0B] text-white py-2">+44</option>
          <option value="+61" className="bg-[#0B0B0B] text-white py-2">+61</option>
          <option value="+81" className="bg-[#0B0B0B] text-white py-2">+81</option>
          <option value="+49" className="bg-[#0B0B0B] text-white py-2">+49</option>
          <option value="+33" className="bg-[#0B0B0B] text-white py-2">+33</option>
          <option value="+86" className="bg-[#0B0B0B] text-white py-2">+86</option>
          <option value="+7" className="bg-[#0B0B0B] text-white py-2">+7</option>
          <option value="+55" className="bg-[#0B0B0B] text-white py-2">+55</option>
        </select>
      </div>
    </div>

    {/* Phone number input */}
    <input
      type="tel"
      name="contact_number"
      value={formData.contact_number}
      onChange={(e) => {
        const countryRules = {
          "+91": 10, // India
          "+1": 10,  // USA
          "+44": 10, // UK
          "+61": 9,  // Australia
          "+81": 10, // Japan
          "+49": 11, // Germany
          "+33": 9,  // France
          "+86": 11, // China
          "+7": 10,  // Russia
          "+55": 11, // Brazil
        };

        const maxLen = countryRules[formData.country_code] || 10;
        const value = e.target.value.replace(/[^0-9]/g, "").slice(0, maxLen);
        setFormData({ ...formData, contact_number: value });

        if (value.length > 0 && value.length < maxLen) {
          setErrors({
            ...errors,
            contact_number: `Enter a valid ${maxLen}-digit number`,
          });
        } else {
          setErrors({ ...errors, contact_number: "" });
        }
      }}
      placeholder="9999999999"
      inputMode="numeric"
      autoComplete="tel"
      className={`w-full p-3 pl-[85px] rounded-xl border-[1px] ${
        formData.contact_number &&
        formData.contact_number.length <
          ({
            "+91": 10,
            "+1": 10,
            "+44": 10,
            "+61": 9,
            "+81": 10,
            "+49": 11,
            "+33": 9,
            "+86": 11,
            "+7": 10,
            "+55": 11,
          }[formData.country_code] || 10)
          ? "border-[#FF0000]"
          : "border-[#FFFFFF33]"
      } bg-white/10 text-white placeholder-white/50 focus:outline-none focus:border-[#8A38F5] focus:ring-1 focus:ring-[#8A38F5] transition-all`}
    />
  </div>

  {/* Error message */}
  {formData.contact_number && errors.contact_number && (
    <p className="text-red-400 text-xs mt-1">
      {errors.contact_number}
    </p>
  )}
</div>

        </div>

        {/* Address */}
        <div>
          <label className="block text-sm mb-1 text-white">Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="eg: St. Thomas lane.."
            className="w-full p-3 rounded-xl border-[1px] border-[#FFFFFF33] bg-white/10 text-white placeholder-white/50 focus:outline-none"
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm mb-1 text-white">Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            placeholder="Type something..."
            className="w-full p-3 rounded-xl border-[1px] border-[#FFFFFF33] bg-white/10 text-white placeholder-white/50 focus:outline-none"
          />
        </div>

        {/* Submit Button */}
        <button
  type="submit"
  disabled={loading}
  className={`w-full mt-2 py-3 rounded-full text-white font-semibold flex items-center justify-center gap-2 border-[1px] border-solid border-[#FFFFFF33] 
  ${loading ? "bg-[#8A38F540] cursor-not-allowed" : "bg-[#8A38F520]"}`}
>
  {loading ? (
    <span className="flex items-center gap-2">
      <svg
        className="animate-spin h-5 w-5 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
        ></path>
      </svg>
      Sending...
    </span>
  ) : (
    <>
      <span>Let’s Connect</span>
      <div className="w-6 h-6">
        <img src={ApiVector} alt="icon" className="w-full h-full object-contain" />
      </div>
    </>
  )}
</button>

      </form>

    {/* Footer Note */}
    <p className="text-white text-center text-sm sm:text-base mt-6 max-w-[90%] sm:max-w-[400px]">
      *Questions, comments, or suggestions? Simply fill in the form and we'll be in touch shortly.
    </p>
  </div>
</div>
 </div>
  );
}
