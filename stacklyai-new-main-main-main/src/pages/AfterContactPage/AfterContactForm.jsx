import React, { useState } from "react";
import axios from "axios";
import ellipse from "../../assets/contactus/Ellipse.png";
import ellipse1 from "../../assets/contactus/Ellipse2.png";
import AfterContactForm from "../ContactPg/ContactForm";
import Bg from "../../assets/contactus/CnBg.png";
import handShake from "../../assets/contactus/handShake.png";
import { ToastContainer } from "react-toastify";

const AfterContactForm1 = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    contact_number: "",
    message: "",
  });

  const [errors, setErrors] = useState({}); // Track field-specific errors
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone) => {
    if (!phone || phone.trim() === "") {
      return { isValid: false, message: "Phone number is required" };
    }
    
    // Check if phone contains only digits
    if (!/^\d+$/.test(phone)) {
      return { isValid: false, message: "Phone number must contain only numbers" };
    }
    
    
    
    return { isValid: true, message: "" };
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear errors on typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle phone number input specifically
  const handlePhoneChange = (e) => {
    let value = e.target.value;
    
    const digitsOnly = value.replace(/[^0-9]/g, '');
    
    const limitedDigits = digitsOnly.slice(0, 10);
    
    e.target.value = limitedDigits;
    
    setFormData((prev) => ({
      ...prev,
      contact_number: limitedDigits,
    }));

    // Real-time validation feedback
    if (limitedDigits.length > 0) {
      const validation = validatePhoneNumber(limitedDigits);
      if (!validation.isValid) {
        setErrors((prev) => ({ ...prev, contact_number: validation.message }));
      } else {
        setErrors((prev) => ({ ...prev, contact_number: "" }));
      }
    } else {
      setErrors((prev) => ({ ...prev, contact_number: "" }));
    }

    if (limitedDigits.length === 10) {
      e.target.blur();
    }
  };

  // Handle phone paste event
  const handlePhonePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const numericOnly = pastedText.replace(/[^0-9]/g, '').slice(0, 10);
    e.target.value = numericOnly;
    setFormData((prev) => ({ 
      ...prev, 
      contact_number: numericOnly 
    }));
    
    // Validate pasted content
    if (numericOnly.length > 0) {
      const validation = validatePhoneNumber(numericOnly);
      if (!validation.isValid) {
        setErrors((prev) => ({ ...prev, contact_number: validation.message }));
      } else {
        setErrors((prev) => ({ ...prev, contact_number: "" }));
      }
    } else {
      setErrors((prev) => ({ ...prev, contact_number: "" }));
    }

    if (numericOnly.length === 10) {
      e.target.blur();
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset previous states
    setErrors({});
    setSubmitError(null);
    setIsSubmitting(true);

    let hasErrors = false;

    // Validate email before submission
    if (!validateEmail(formData.email)) {
      setErrors((prev) => ({ ...prev, email: "Please enter a valid Gmail address." }));
      hasErrors = true;
    }

    // Validate phone number before submission
    const phoneValidation = validatePhoneNumber(formData.contact_number);
    if (!phoneValidation.isValid) {
      setErrors((prev) => ({ ...prev, contact_number: phoneValidation.message }));
      hasErrors = true;
    }

    // If there are validation errors, stop submission
    if (hasErrors) {
      setIsSubmitting(false);
      return;
    }

    try {
      await axios.post("https://www.ai.stacklycloud.com/api/contact", {
        ...formData,
        source: "contact_us",
      });

      setIsSubmitted(true);
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        contact_number: "",
        message: "",
      });

      // Reset success message after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitError("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="relative w-full flex justify-center items-center py-16 md:py-28 px-4 min-h-screen mt-[-70px] overflow-hidden bg-black"
      style={{
        backgroundImage: `url(${Bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <style>{`
        input:-webkit-autofill,
        textarea:-webkit-autofill {
          -webkit-box-shadow: 0 0 0px 1000px rgba(255, 255, 255, 0.1) inset !important;
          -webkit-text-fill-color: #fff !important;
          caret-color: #fff !important;
          transition: background-color 9999s ease-in-out 0s;
        }

        @keyframes rotateSwing {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(10deg); }
          50% { transform: rotate(-10deg); }
          75% { transform: rotate(5deg); }
        }
      `}</style>

      {/* Form section */}
      <div className="relative w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-[668px] xl:max-w-[500px] 2xl:max-w-[668px] flex flex-col items-center gap-6 md:gap-[28px] text-white">
        <div className="text-center font-[Poppins] max-[639px]:mt-8">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mt-4 md:mt-8">
            <h2 className="text-xl sm:text-2xl md:text-[32px] font-semibold">
              Let's Have a Chat
            </h2>
            <img
              src={handShake}
              alt="Handshake"
              className="w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 object-contain"
              style={{
                animation: 'rotateSwing 2s ease-in-out infinite',
                display: 'inline-block',
              }}
            />
          </div>
          <p className="mt-2 max-[639px]:mt-4 text-base max-[639px]:text-sm sm:text-lg md:text-[20px] text-white/80">
            Curious how AI can style your space? <br /> Let's talk.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 max-[639px]:mt-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm mb-1">First Name</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="John"
                required
                className="w-full p-3 rounded-[12px] border border-white/40 bg-white/10 text-white placeholder-white/50 focus:outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm mb-1">Last Name</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Paul"
                required
                className="w-full p-3 rounded-[12px] border border-white/40 bg-white/10 text-white placeholder-white/50 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@gmail.com"
                required
                className={`w-full p-3 rounded-[12px] border ${
                  errors.email ? "border-red-500" : "border-white/40"
                } bg-white/10 text-white placeholder-white/50 focus:outline-none`}
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1 absolute right-0">{errors.email}</p>
              )}
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

          <div>
            <label className="block text-sm mb-1">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              placeholder="Type something..."
              required
              className="w-full p-3 rounded-[12px] border border-white/40 bg-white/10 text-white placeholder-white/50 focus:outline-none"
            />
          </div>

        <button
  type="submit"
  disabled={
    isSubmitting || formData.contact_number.trim().length !== 10
  }
  className={`w-full mt-2 py-3 md:py-2 rounded-full text-white font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90
    ${
      isSubmitting || formData.contact_number.trim().length !== 10
        ? "opacity-50 cursor-not-allowed"
        : ""
    }`}
  style={{
    border: "1px solid rgba(255, 255, 255, 0.1)",
    background:
      isSubmitting || formData.contact_number.trim().length !== 10
        ? "rgba(138, 56, 245, 0.1)"
        : "rgba(138, 56, 245, 0.2)",
  }}
>
  {isSubmitting ? "Sending..." : "Send Message"}
</button>

        </form>

        {/* Success / Error messages */}
        {isSubmitted && (
          <p className="text-green-400 text-center mt-4">
            Message sent successfully!
          </p>
        )}
        {submitError && (
          <p className="text-red-400 text-center mt-4">{submitError}</p>
        )}

        <p className="text-center text-sm md:text-base font-normal mt-4 md:mt-6 px-2">
          *Questions, comments, or suggestions? Simply fill in the form and
          we'll be in touch shortly.
        </p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AfterContactForm1;
