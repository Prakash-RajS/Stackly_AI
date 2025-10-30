import React, { useState, useEffect } from "react";
import { Listbox } from '@headlessui/react';
import Bg from "../../assets/afterHome/BillingBg.png";
import Arrow from "../../assets/forgetPg/arrow1.png";
import Pimage from "../../assets/profile/pimage.png"; // Fallback image
import Paypal from "../../assets/afterHome/Paypal.png";
import Stripe from "../../assets/afterHome/Stripe.png";
import GreenTic from "../../assets/afterHome/GreenTic.png";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function AfterBilling() {
  const navigate = useNavigate();
  const location = useLocation();
  const [plan, setPlan] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlanFromState, setSelectedPlanFromState] = useState(null);
  const [selected, setSelected] = useState(2); // Default to Stripe
  const [zip, setZip] = useState("");
  const [countryCode, setCountryCode] = useState("in");
  const [country, setCountry] = useState("India");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [nameInvalid, setNameInvalid] = useState(false);
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [phoneInvalid, setPhoneInvalid] = useState(false);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [planError, setPlanError] = useState("");
  const [profilePic, setProfilePic] = useState(Pimage); // State for dynamic profile image

  const countries = [
    { code: "ad", name: "Andorra" },
    { code: "ar", name: "Argentina" },
    { code: "as", name: "American Samoa" },
    { code: "at", name: "Austria" },
    { code: "au", name: "Australia" },
    { code: "bd", name: "Bangladesh" },
    { code: "be", name: "Belgium" },
    { code: "bg", name: "Bulgaria" },
    { code: "br", name: "Brazil" },
    { code: "ca", name: "Canada" },
    { code: "ch", name: "Switzerland" },
    { code: "cz", name: "Czech Republic" },
    { code: "de", name: "Germany" },
    { code: "dk", name: "Denmark" },
    { code: "do", name: "Dominican Republic" },
    { code: "es", name: "Spain" },
    { code: "fi", name: "Finland" },
    { code: "fo", name: "Faroe Islands" },
    { code: "fr", name: "France" },
    { code: "gb", name: "Great Britain" },
    { code: "gf", name: "French Guyana" },
    { code: "gg", name: "Guernsey" },
    { code: "gl", name: "Greenland" },
    { code: "gp", name: "Guadeloupe" },
    { code: "gt", name: "Guatemala" },
    { code: "gu", name: "Guam" },
    { code: "gy", name: "Guyana" },
    { code: "hr", name: "Croatia" },
    { code: "hu", name: "Hungary" },
    { code: "im", name: "Isle of Man" },
    { code: "in", name: "India" },
    { code: "is", name: "Iceland" },
    { code: "it", name: "Italy" },
    { code: "je", name: "Jersey" },
    { code: "jp", name: "Japan" },
    { code: "li", name: "Liechtenstein" },
    { code: "lk", name: "Sri Lanka" },
    { code: "lt", name: "Lithuania" },
    { code: "lu", name: "Luxembourg" },
    { code: "lv", name: "Latvia" },
    { code: "mc", name: "Monaco" },
    { code: "md", name: "Moldavia" },
    { code: "mh", name: "Marshall Islands" },
    { code: "mk", name: "Macedonia" },
    { code: "mp", name: "Northern Mariana Islands" },
    { code: "mq", name: "Martinique" },
    { code: "mt", name: "Malta" },
    { code: "mx", name: "Mexico" },
    { code: "my", name: "Malaysia" },
    { code: "nl", name: "Netherlands" },
    { code: "no", name: "Norway" },
    { code: "nz", name: "New Zealand" },
    { code: "ph", name: "Philippines" },
    { code: "pk", name: "Pakistan" },
    { code: "pl", name: "Poland" },
    { code: "pm", name: "Saint Pierre and Miquelon" },
    { code: "pr", name: "Puerto Rico" },
    { code: "pt", name: "Portugal" },
    { code: "re", name: "Reunion" },
    { code: "ro", name: "Romania" },
    { code: "ru", name: "Russia" },
    { code: "se", name: "Sweden" },
    { code: "si", name: "Slovenia" },
    { code: "sj", name: "Svalbard & Jan Mayen Islands" },
    { code: "sk", name: "Slovak Republic" },
    { code: "sm", name: "San Marino" },
    { code: "th", name: "Thailand" },
    { code: "tr", name: "Turkey" },
    { code: "ua", name: "Ukraine" },
    { code: "us", name: "United States" },
    { code: "va", name: "Vatican" },
    { code: "vi", name: "Virgin Islands U.S." },
    { code: "yt", name: "Mayotte" },
    { code: "za", name: "South Africa" },
  ];

  const paymentOptions = [
    // { id: 1, img: Paypal, title: "Paypal" },
    { id: 2, img: Stripe, title: "Stripe" },
  ];
  const selectedOption = paymentOptions.find((opt) => opt.id === selected);

  const staticDescriptions = {
    basic: "Perfect for personal or casual users who want a simple idea of interior design.",
    silver: "Ideal for homeowners or renters looking for more creative control and polished designs.",
    gold: "Best for professionals, renovators, or anyone seeking top-tier results and personalization.",
  };

  const [formData, setFormData] = useState({
    plan: "",
    duration: "Monthly",
    full_name: "",
    email: "",
    phone_number: "",
    street_address: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",
    coupon_code: "",
  });

  // Fetch user profile data (including profile image)
  useEffect(() => {
    const fetchUserData = async () => {
      let userId = localStorage.getItem("userId");
      if (!userId) {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        userId = userInfo?.userId;
      }

      if (!userId) {
        console.warn("User ID not found. Using default profile image.");
        setProfilePic(Pimage);
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("Token not found. Using default profile image.");
        setProfilePic(Pimage);
        return;
      }

      try {
        const profileResponse = await axios.get("https://www.stacklycloud.com/api/profile", {
          params: { userid: userId },
          headers: { Authorization: `Bearer ${token}` },
        });

        const profilePicUrl = profileResponse.data.profile_pic
          ? `https://www.stacklycloud.com/api/${profileResponse.data.profile_pic}?t=${Date.now()}`
          : Pimage;

        setProfilePic(profilePicUrl);
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setProfilePic(Pimage); // Fallback to default image on error
      }
    };

    fetchUserData();
  }, []);

  // Existing useEffect for fetching plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const selectedPlanFromLocation = location.state?.selectedPlan;
        if (selectedPlanFromLocation) {
          setSelectedPlanFromState(selectedPlanFromLocation);
          setPlan(selectedPlanFromLocation);
          setFormData((prev) => ({
            ...prev,
            plan: selectedPlanFromLocation.name,
            coupon_code: selectedPlanFromLocation.offerCode || "",
          }));
          setLoading(false);
          return;
        }

        const response = await fetch("https://www.stacklycloud.com/admin/api/plans/");
        if (!response.ok) throw new Error("Failed to fetch plans.");
        const data = await response.json();

        const mappedPlans = data.plans.map((plan) => ({
          ...plan,
          description: staticDescriptions[plan.name.toLowerCase()] || plan.description,
        }));

        setPlans(mappedPlans);

        const planData = location.state?.plan;
        if (planData) {
          const mappedPlan = {
            ...plan,
            description: staticDescriptions[planData.name.toLowerCase()] || planData.description,
          };
          setPlan(mappedPlan);
          setFormData((prev) => ({
            ...prev,
            plan: planData.name,
            coupon_code: planData.offerCode || "",
          }));
        } else {
          const defaultPlan =
            mappedPlans.find((p) => p.name.toLowerCase() === "silver") || mappedPlans[0];
          if (defaultPlan) {
            setPlan(defaultPlan);
            setFormData((prev) => ({
              ...prev,
              plan: defaultPlan.name,
              coupon_code: defaultPlan.offerCode || "",
            }));
          } else {
            setPlanError("No plans available. Please try again later.");
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [location.state]);

  const handleZipChange = (e) => {
    const value = e.target.value;
    setZip(value);
    setFormData((prev) => ({ ...prev, pincode: value }));
  };

  const handleCountryChange = (code) => {
    setCountryCode(code);
    const selectedCountry = countries.find((c) => c.code === code)?.name || "";
    setCountry(selectedCountry);
    setFormData((prev) => ({ ...prev, country: selectedCountry }));
    setZip("");
    setState("");
    setCity("");
    setFormData((prev) => ({ ...prev, pincode: "", state: "", city: "" }));
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, full_name: value }));
    setNameInvalid(value && !/^[a-zA-Z\s]*$/.test(value));
    setNameError(value ? "" : "Name is required.");
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, email: value }));
    setEmailInvalid(value && !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value));
    setEmailError(value ? "" : "Email is required.");
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, phone_number: value }));
    setPhoneInvalid(value && !/^\+?\d[\d\s-]*$/.test(value));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDurationSelect = (duration) => {
    setFormData((prev) => ({ ...prev, duration }));
  };

  const isFormValid = () => {
    return (
      formData.plan &&
      formData.email &&
      formData.full_name &&
      !nameInvalid &&
      !emailInvalid &&
      !phoneInvalid
    );
  };

  const handleContinue = async (e) => {
    e.preventDefault();

    let userId = localStorage.getItem("userId");
    if (!userId) {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      userId = userInfo?.userId;
    }

    if (!userId) {
      alert("User ID not found. Please log in.");
      return;
    }

    try {
      const response = await axios.post(
        "https://www.stacklycloud.com/api/pricing/create-checkout-session/",
        {
          userid: userId,
          plan: formData.plan,
          duration: formData.duration.toLowerCase(),
          email: formData.email,
          coupon_code: formData.coupon_code,
          payment_method: "card",
          payment_success: false,
          billing_info: {
            full_name: formData.full_name,
            email: formData.email,
            phone_number: formData.phone_number,
            street_address: formData.street_address,
            city: formData.city,
            state: formData.state,
            country: formData.country,
            pincode: formData.pincode,
          },
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.checkout_url) {
        localStorage.setItem("billing_email", formData.email);
        localStorage.setItem("billing_name", formData.full_name);
        window.location.href = response.data.checkout_url;
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Failed to create checkout session.");
    }
  };

  const handleGoBack = () => navigate(-1);

  if (loading)
    return <div className="text-white text-center py-12">Loading...</div>;
  if (error || !plan)
    return <div className="text-white text-center py-12">Error: {error}</div>;

  const discountPercentage = plan.discountPercentage || 0;
  const discount = `${discountPercentage}%`;
  const grandTotal = (
    plan.price -
    (plan.price * discountPercentage) / 100
  ).toFixed(2);
  const plansToShow = selectedPlanFromState ? [selectedPlanFromState] : plans;

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center">
      <style>{`
        @keyframes invalidBlink {
          0% { 
            background-color: #151515; 
            border-color: transparent;
          }
          50% { 
            background-color: rgba(255, 0, 0, 0.3);
            border-color: #ff4444;
          }
          100% { 
            background-color: #151515; 
            border-color: transparent;
          }
        }
        .invalid-blink {
          animation: invalidBlink 0.8s infinite;
        }
        .poppins-font {
          font-family: 'Poppins', sans-serif;
        }
        @media (max-width: 768px) {
          .text-5xl { font-size: 2rem; }
          .text-2xl { font-size: 1.5rem; }
          .text-xl { font-size: 1.25rem; }
          .text-base { font-size: 0.875rem; }
          .text-sm { font-size: 0.75rem; }
        }
        @media (max-width: 640px) {
          .text-5xl { font-size: 1.5rem; }
          .text-2xl { font-size: 1.25rem; }
          .text-xl { font-size: 1rem; }
          .text-base { font-size: 0.75rem; }
          .text-sm { font-size: 0.675rem; }
        }
      `}</style>

      {/* Background */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `url(${Bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black/80"></div>
      </div>

      {/* Back button */}
      <div
        className="absolute top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8 flex items-center gap-2 cursor-pointer z-20"
        onClick={handleGoBack}
      >
        <div className="w-8 h-8 sm:w-10 sm:h-10 border border-[#FFFFFF33] rounded-full bg-[#FFFFFF1F] flex justify-center items-center p-2">
          <img src={Arrow} alt="back" className="w-3 h-3 sm:w-4 sm:h-4" />
        </div>
        <span className="text-white font-medium text-sm sm:text-base">
          Back
        </span>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-16 sm:py-20 md:py-24 flex flex-col md:flex-row gap-8 md:gap-16">
        {/* Left Div */}
        <div className="w-full md:w-1/2 flex flex-col gap-6">
          {/* Profile */}
          <div className="flex justify-center md:justify-start">
            <div className="w-20 h-20 rounded-full border-2 border-[#9747FF] bg-white overflow-hidden">
              <img
                src={profilePic}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
                onError={() => setProfilePic(Pimage)} // Fallback to default image if dynamic image fails to load
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="flex flex-col gap-6">
            <h2 className="text-white poppins-font font-normal text-xl sm:text-2xl">
              Select Payment Method
            </h2>
            <div className="flex flex-col gap-4">
              {paymentOptions.map((option) => {
                const isSelected = selected === option.id;
                return (
                  <div
                    key={option.id}
                    onClick={() => setSelected(option.id)}
                    className={`flex justify-between items-center rounded-lg p-4 cursor-pointer ${
                      isSelected
                        ? "bg-[#8A38F533] border border-[#8A38F5]"
                        : "bg-[#151515] border border-transparent"
                    } backdrop-blur-md`}
                  >
                    <div className="w-24 sm:w-28 h-12 flex-shrink-0">
                      <img
                        src={option.img}
                        alt={option.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-[1px] border-solid ${
                        isSelected
                          ? "border-[#8A38F5] bg-[#8A38F5]"
                          : "border-white/60"
                      } flex items-center justify-center`}
                    >
                      {isSelected && (
                        <div className="w-2.5 h-2.5 bg-white rounded-full" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="mt-6 w-full flex flex-col gap-6 rounded-lg p-6 bg-[#15151566] backdrop-blur-md">
            <h2 className="text-white poppins-font font-normal text-xl sm:text-2xl">
              You have to pay
            </h2>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-white poppins-font font-semibold text-3xl sm:text-5xl">
                  ${grandTotal}
                </span>
                <div className="flex flex-col gap-1">
                  <span className="text-white poppins-font font-normal text-lg sm:text-xl">
                    {plan.name} Plan
                  </span>
                  <span className="text-white poppins-font font-normal text-sm sm:text-base">
                    Get ready to unlock {plan.name} Subscription benefits
                  </span>
                </div>
              </div>
              <div className="flex justify-center items-center gap-2 rounded-lg border border-[#8A38F580] bg-[#8A38F51A] p-4">
                <span className="text-white poppins-font font-medium text-sm sm:text-base text-center">
                  {discount} Discount Applied
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <img src={GreenTic} alt="Green Tick" className="w-5 h-5" />
                  <span className="text-white poppins-font font-normal text-base sm:text-lg">
                    Payment and invoice
                  </span>
                </div>
                <span className="text-[#B5B5B5] poppins-font font-normal text-sm sm:text-base">
                  Once the payment is completed, an invoice will be sent to your
                  registered email.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Div */}
        <div className="w-full md:w-1/2 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-white poppins-font font-normal text-xl sm:text-2xl">
              Payment Details
            </h2>
            <span className="text-[#B5B5B5] poppins-font font-normal text-sm sm:text-base">
              Please provide your payment details below to securely complete
              your purchase.
            </span>
          </div>

          {/* Form */}
          <div className="flex flex-col gap-4">
            {/* Plan Selection */}
            {plansToShow.length > 1 ? (
              <div className="flex flex-col">
                <label className="text-white text-sm mb-1">Plan *</label>
                <div className="flex gap-4">
                  {plansToShow.map((p) => (
                    <div
                      key={p.id}
                      className={`flex-1 h-12 sm:h-14 rounded-lg border border-[#FFFFFF66] flex items-center px-4 cursor-pointer ${
                        formData.plan === p.name
                          ? "bg-[#8A38F533]"
                          : "bg-[#151515]"
                      } ${planError ? "invalid-blink" : ""}`}
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, plan: p.name }));
                        setPlanError("");
                      }}
                    >
                      <div className="text-white text-sm">{p.name}</div>
                      <input
                        type="radio"
                        checked={formData.plan === p.name}
                        readOnly
                        className="ml-auto"
                      />
                    </div>
                  ))}
                </div>
                {planError && (
                  <span className="text-red-400 text-sm mt-1">{planError}</span>
                )}
              </div>
            ) : (
              <div className="flex flex-col">
                <label className="text-white text-sm mb-1">
                  Selected Plan *
                </label>
                <div className="w-full h-12 sm:h-14 rounded-lg border border-[#FFFFFF66] flex items-center px-4 bg-[#8A38F533]">
                  <div className="text-white text-sm">
                    Selected Plan: {formData.plan}
                  </div>
                </div>
                {planError && (
                  <span className="text-red-400 text-sm mt-1">{planError}</span>
                )}
              </div>
            )}

            {/* Duration Selection */}
            <div className="flex flex-col">
              <label className="text-white text-sm mb-1">Billing Cycle</label>
              <div className="flex gap-4">
                {["Monthly", "Yearly"].map((duration) => (
                  <div
                    key={duration}
                    className={`flex-1 h-12 sm:h-14 rounded-lg border border-[#FFFFFF66] flex items-center px-4 cursor-pointer ${
                      formData.duration === duration
                        ? "bg-[#8A38F533]"
                        : "bg-[#151515]"
                    }`}
                    onClick={() => handleDurationSelect(duration)}
                  >
                    <div className="text-white text-sm">{duration}</div>
                    <input
                      type="radio"
                      checked={formData.duration === duration}
                      readOnly
                      className="ml-auto"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-white text-sm mb-1">Name *</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleNameChange}
                placeholder="Name"
                className={`w-full h-12 sm:h-14 px-4 rounded-lg bg-[#151515] backdrop-blur-md text-white placeholder-[#B5B5B5] border border-transparent focus:border-[#8A38F5] outline-none ${
                  nameInvalid || nameError ? "invalid-blink" : ""
                }`}
              />
              {(nameInvalid || nameError) && (
                <span className="text-red-400 text-sm mt-1">{nameError}</span>
              )}
            </div>
            <div className="flex flex-col">
              <label className="text-white text-sm mb-1">Phone number</label>
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handlePhoneChange}
                placeholder="e.g., +123 7356 8524"
                className={`w-full h-12 sm:h-14 px-4 rounded-lg bg-[#151515] backdrop-blur-md text-white placeholder-[#B5B5B5] border border-transparent focus:border-[#8A38F5] outline-none ${
                  phoneInvalid ? "invalid-blink" : ""
                }`}
              />
              {phoneInvalid && (
                <span className="text-red-400 text-sm mt-1">
                  Phone number can only contain digits, +, spaces, or hyphens.
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <label className="text-white text-sm mb-1">Mail ID *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleEmailChange}
                placeholder="Enter mail ID"
                className={`w-full h-12 sm:h-14 px-4 rounded-lg bg-[#151515] backdrop-blur-md text-white placeholder-[#B5B5B5] border border-transparent focus:border-[#8A38F5] outline-none ${
                  emailInvalid || emailError ? "invalid-blink" : ""
                }`}
              />
              {(emailInvalid || emailError) && (
                <span className="text-red-400 text-sm mt-1">{emailError}</span>
              )}
            </div>
            <div className="flex flex-col">
              <label className="text-white text-sm mb-1">Street Address</label>
              <input
                type="text"
                name="street_address"
                value={formData.street_address}
                onChange={handleChange}
                placeholder="Enter address"
                className="w-full h-12 sm:h-14 px-4 rounded-lg bg-[#151515] backdrop-blur-md text-white placeholder-[#B5B5B5] border border-transparent focus:border-[#8A38F5] outline-none"
              />
            </div>
            
            {/* UPDATED COUNTRY + CITY ROW WITH LISTBOX */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 flex flex-col">
                <label className="text-white text-sm mb-1">Country</label>
                <Listbox value={countryCode} onChange={handleCountryChange}>
                  {({ open }) => (
                    <>
                      <div className="relative">
                        <Listbox.Button className="w-full h-12 sm:h-14 px-4 rounded-lg bg-[#151515] backdrop-blur-md text-white border border-transparent focus:border-[#8A38F5] outline-none flex items-center justify-between">
                          <span className="text-white text-sm">
                            {countries.find(c => c.code === countryCode)?.name || 'Select Country'}
                          </span>
                          <svg 
                            className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </Listbox.Button>
                        
                        <Listbox.Options 
                          
                          className="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-auto bg-[#151515] backdrop-blur-md rounded-lg border border-[#FFFFFF66] z-50"
                        >
                          {countries.map((country) => (
                            <Listbox.Option
                              key={country.code}
                              className={({ active, selected }) =>
                                `relative cursor-pointer select-none py-2 px-4 text-sm text-white ${
                                  active ? 'bg-[#8A38F533]' : ''
                                } ${selected ? 'font-medium' : ''}`
                              }
                              value={country.code}
                            >
                              {country.name}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </div>
                    </>
                  )}
                </Listbox>
              </div>
              <div className="flex-1 flex flex-col">
                <label className="text-white text-sm mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  className="w-full h-12 sm:h-14 px-4 rounded-lg bg-[#151515] backdrop-blur-md text-white placeholder-[#B5B5B5] border border-transparent focus:border-[#8A38F5] outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 flex flex-col">
                <label className="text-white text-sm mb-1">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="State"
                  className="w-full h-12 sm:h-14 px-4 rounded-lg bg-[#151515] backdrop-blur-md text-white placeholder-[#B5B5B5] border border-transparent focus:border-[#8A38F5] outline-none"
                />
              </div>
              <div className="flex-1 flex flex-col">
                <label className="text-white text-sm mb-1">Postal Code</label>
                <input
                  type="text"
                  name="pincode"
                  value={zip}
                  onChange={handleZipChange}
                  placeholder="Enter postal code"
                  className="w-full h-12 sm:h-14 px-4 rounded-lg bg-[#151515] backdrop-blur-md text-white placeholder-[#B5B5B5] border border-transparent focus:border-[#8A38F5] outline-none"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="text-white text-sm mb-1">
                Coupon Code (optional)
              </label>
              <input
                type="text"
                name="coupon_code"
                value={formData.coupon_code}
                onChange={handleChange}
                placeholder="Enter coupon code"
                className="w-full h-12 sm:h-14 px-4 rounded-lg bg-[#151515] backdrop-blur-md text-white placeholder-[#B5B5B5] border border-transparent focus:border-[#8A38F5] outline-none"
              />
            </div>
            <button
              onClick={handleContinue}
              disabled={!isFormValid()}
              className={`w-full h-12 sm:h-14 flex items-center justify-center gap-2 rounded-full border border-[#C22CA299] bg-gradient-to-r from-[#8A38F580] to-[#C22CA280] backdrop-blur-md shadow-lg text-white poppins-font text-sm sm:text-base font-normal transition-transform duration-300 ${
                isFormValid()
                  ? "hover:scale-105"
                  : "opacity-50 cursor-not-allowed"
              }`}
            >
              <span>Pay with</span>
              <img
                src={selectedOption ? selectedOption.img : Stripe}
                alt="payment"
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}