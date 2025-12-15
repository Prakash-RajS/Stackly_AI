import React, { useState, useEffect } from "react";
import { Listbox } from "@headlessui/react";
import Bg from "../../assets/afterHome/BillingBg.png";
import Arrow from "../../assets/forgetPg/arrow1.png";
import Pimage from "../../assets/profile/pimage.png";
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
  const [selected, setSelected] = useState(2); // Stripe
  const [zip, setZip] = useState("");
  const [countryCode, setCountryCode] = useState("in");
  const [country, setCountry] = useState("India");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [nameInvalid, setNameInvalid] = useState(false);
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [planError, setPlanError] = useState("");
  const [profilePic, setProfilePic] = useState(Pimage);
  const [addressInvalid, setAddressInvalid] = useState(false);
  const [errors, setErrors] = React.useState({});

  const countries = [
    { code: "ad", name: "Andorra" }, { code: "ar", name: "Argentina" }, { code: "as", name: "American Samoa" },
    { code: "at", name: "Austria" }, { code: "au", name: "Australia" }, { code: "bd", name: "Bangladesh" },
    { code: "be", name: "Belgium" }, { code: "bg", name: "Bulgaria" }, { code: "br", name: "Brazil" },
    { code: "ca", name: "Canada" }, { code: "ch", name: "Switzerland" }, { code: "cz", name: "Czech Republic" },
    { code: "de", name: "Germany" }, { code: "dk", name: "Denmark" }, { code: "do", name: "Dominican Republic" },
    { code: "es", name: "Spain" }, { code: "fi", name: "Finland" }, { code: "fo", name: "Faroe Islands" },
    { code: "fr", name: "France" }, { code: "gb", name: "Great Britain" }, { code: "gf", name: "French Guyana" },
    { code: "gg", name: "Guernsey" }, { code: "gl", name: "Greenland" }, { code: "gp", name: "Guadeloupe" },
    { code: "gt", name: "Guatemala" }, { code: "gu", name: "Guam" }, { code: "gy", name: "Guyana" },
    { code: "hr", name: "Croatia" }, { code: "hu", name: "Hungary" }, { code: "im", name: "Isle of Man" },
    { code: "in", name: "India" }, { code: "is", name: "Iceland" }, { code: "it", name: "Italy" },
    { code: "je", name: "Jersey" }, { code: "jp", name: "Japan" }, { code: "li", name: "Liechtenstein" },
    { code: "lk", name: "Sri Lanka" }, { code: "lt", name: "Lithuania" }, { code: "lu", name: "Luxembourg" },
    { code: "lv", name: "Latvia" }, { code: "mc", name: "Monaco" }, { code: "md", name: "Moldavia" },
    { code: "mh", name: "Marshall Islands" }, { code: "mk", name: "Macedonia" }, { code: "mp", name: "Northern Mariana Islands" },
    { code: "mq", name: "Martinique" }, { code: "mt", name: "Malta" }, { code: "mx", name: "Mexico" },
    { code: "my", name: "Malaysia" }, { code: "nl", name: "Netherlands" }, { code: "no", name: "Norway" },
    { code: "nz", name: "New Zealand" }, { code: "ph", name: "Philippines" }, { code: "pk", name: "Pakistan" },
    { code: "pl", name: "Poland" }, { code: "pm", name: "Saint Pierre and Miquelon" }, { code: "pr", name: "Puerto Rico" },
    { code: "pt", name: "Portugal" }, { code: "re", name: "Reunion" }, { code: "ro", name: "Romania" },
    { code: "ru", name: "Russia" }, { code: "se", name: "Sweden" }, { code: "si", name: "Slovenia" },
    { code: "sj", name: "Svalbard & Jan Mayen Islands" }, { code: "sk", name: "Slovak Republic" },
    { code: "sm", name: "San Marino" }, { code: "th", name: "Thailand" }, { code: "tr", name: "Turkey" },
    { code: "ua", name: "Ukraine" }, { code: "us", name: "United States" }, { code: "va", name: "Vatican" },
    { code: "vi", name: "Virgin Islands U.S." }, { code: "yt", name: "Mayotte" }, { code: "za", name: "South Africa" },
  ];

  const paymentOptions = [
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
    contact_number: "",          // NEW
    country_code: "+91",         // NEW
    street_address: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",
    coupon_code: "",
  });

  /* -------------------------------------------------
   *  FETCH USER PROFILE (incl. profile picture)
   * ------------------------------------------------- */
  useEffect(() => {
    const fetchUserData = async () => {
      let userId = localStorage.getItem("userId");
      if (!userId) {
        const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
        userId = userInfo?.userId;
      }

      if (!userId) {
        setProfilePic(Pimage);
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        setProfilePic(Pimage);
        return;
      }

      try {
        const { data } = await axios.get("https://www.ai.stacklycloud.com/api/profile", {
          params: { userid: userId },
          headers: { Authorization: `Bearer ${token}` },
        });

        const picUrl = data.profile_pic
          ? `https://www.ai.stacklycloud.com/api/${data.profile_pic}?t=${Date.now()}`
          : Pimage;
        setProfilePic(picUrl);
      } catch (err) {
        console.error("Profile fetch error:", err);
        setProfilePic(Pimage);
      }
    };
    fetchUserData();
  }, []);

  /* -------------------------------------------------
   *  FETCH PLANS
   * ------------------------------------------------- */
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

        const resp = await fetch("https://www.ai.stacklycloud.com/admin/api/plans/");
        if (!resp.ok) throw new Error("Failed to fetch plans.");
        const data = await resp.json();

        const mapped = data.plans.map((p) => ({
          ...p,
          description: staticDescriptions[p.name.toLowerCase()] || p.description,
        }));
        setPlans(mapped);

        const planFromState = location.state?.plan;
        if (planFromState) {
          const mappedPlan = {
            ...planFromState,
            description:
              staticDescriptions[planFromState.name.toLowerCase()] || planFromState.description,
          };
          setPlan(mappedPlan);
          setFormData((prev) => ({
            ...prev,
            plan: planFromState.name,
            coupon_code: planFromState.offerCode || "",
          }));
        } else {
          const defaultPlan =
            mapped.find((p) => p.name.toLowerCase() === "silver") || mapped[0];
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

  /* -------------------------------------------------
   *  ADDRESS VALIDATION (real-time)
   * ------------------------------------------------- */
  useEffect(() => {
    const empty =
      !formData.street_address ||
      !formData.city ||
      !formData.state ||
      !formData.pincode;
    setAddressInvalid(empty);
  }, [formData.street_address, formData.city, formData.state, formData.pincode]);

  /* -------------------------------------------------
   *  HANDLERS
   * ------------------------------------------------- */
  const handleZipChange = (e) => {
    const v = e.target.value;
    setZip(v);
    setFormData((prev) => ({ ...prev, pincode: v }));
  };

  const handleCountryChange = (code) => {
    setCountryCode(code);
    const name = countries.find((c) => c.code === code)?.name || "";
    setCountry(name);
    setFormData((prev) => ({
      ...prev,
      country: name,
      pincode: "",
      state: "",
      city: "",
    }));
    setZip("");
    setState("");
    setCity("");
  };

  const handleNameChange = (e) => {
    const v = e.target.value;
    setFormData((prev) => ({ ...prev, full_name: v }));
    const invalid = v && !/^[a-zA-Z\s]*$/.test(v);
    setNameInvalid(invalid);
    setNameError(v ? "" : "Name is required.");
  };

  const handleEmailChange = (e) => {
    const v = e.target.value.trim();
    setFormData((prev) => ({ ...prev, email: v }));

    const isGmail = /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(v);
    if (!v) {
      setEmailError("Email is required.");
      setEmailInvalid(true);
    } else if (!isGmail) {
      setEmailError("Please enter a valid Gmail address (example@gmail.com).");
      setEmailInvalid(true);
    } else {
      setEmailError("");
      setEmailInvalid(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDurationSelect = (duration) => {
    setFormData((prev) => ({ ...prev, duration }));
  };

  /* -------------------------------------------------
   *  FORM VALIDATION
   * ------------------------------------------------- */
  const isFormValid = () => {
    const phoneRules = { "+91": 10, "+1": 10, "+44": 10, "+61": 9, "+81": 10 };
    const requiredLen = phoneRules[formData.country_code] || 10;

    return (
      formData.plan &&
      formData.duration &&
      formData.full_name &&
      formData.email &&
      formData.contact_number &&
      formData.contact_number.length === requiredLen &&
      formData.street_address &&
      formData.city &&
      formData.state &&
      formData.country &&
      formData.pincode &&
      !nameInvalid &&
      !emailInvalid &&
      !errors.contact_number
    );
  };

  /* -------------------------------------------------
   *  CHECKOUT
   * ------------------------------------------------- */
  const handleContinue = async (e) => {
    e.preventDefault();

    let userId = localStorage.getItem("userId");
    if (!userId) {
      const info = JSON.parse(localStorage.getItem("userInfo") || "{}");
      userId = info?.userId;
    }
    if (!userId) {
      alert("User ID not found. Please log in.");
      return;
    }

    try {
      const resp = await axios.post(
        "https://www.ai.stacklycloud.com/api/pricing/create-checkout-session/",
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
            phone_number: formData.contact_number,
            street_address: formData.street_address,
            city: formData.city,
            state: formData.state,
            country: formData.country,
            pincode: formData.pincode,
          },
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (resp.data.checkout_url) {
        localStorage.setItem("billing_email", formData.email);
        localStorage.setItem("billing_name", formData.full_name);
        window.location.href = resp.data.checkout_url;
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Failed to create checkout session.");
    }
  };

  const handleGoBack = () => navigate(-1);

  if (loading) return <div className="text-white text-center py-12">Loading...</div>;
  if (error || !plan) return <div className="text-white text-center py-12">Error: {error}</div>;

  const discountPercentage = plan.discountPercentage || 0;
  const discount = `${discountPercentage}%`;
  const grandTotal = (plan.price - (plan.price * discountPercentage) / 100).toFixed(2);
  const plansToShow = selectedPlanFromState ? [selectedPlanFromState] : plans;

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center">
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
        <span className="text-white font-medium text-sm sm:text-base">Back</span>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-16 sm:py-20 md:py-24 flex flex-col md:flex-row gap-8 md:gap-16">
        {/* LEFT */}
        <div className="w-full md:w-1/2 flex flex-col gap-6">
          {/* Profile */}
          <div className="flex justify-center md:justify-start">
            <div className="w-20 h-20 rounded-full border-2 border-[#9747FF] bg-white overflow-hidden">
              <img
                src={profilePic}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
                onError={() => setProfilePic(Pimage)}
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="flex flex-col gap-6">
            <h2 className="text-white poppins-font font-normal text-xl sm:text-2xl">
              Select Payment Method
            </h2>
            <div className="flex flex-col gap-4">
              {paymentOptions.map((opt) => {
                const active = selected === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setSelected(opt.id)}
                    className={`flex justify-between items-center rounded-lg p-4 cursor-pointer ${
                      active
                        ? "bg-[#8A38F533] border border-[#8A38F5]"
                        : "bg-[#151515] border border-transparent"
                    } backdrop-blur-md`}
                  >
                    <div className="w-24 sm:w-28 h-12 flex-shrink-0">
                      <img src={opt.img} alt={opt.title} className="w-full h-full object-contain" />
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-[1px] ${
                        active ? "border-[#8A38F5] bg-[#8A38F5]" : "border-white/60"
                      } flex items-center justify-center`}
                    >
                      {active && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
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
                  Once the payment is completed, an invoice will be sent to your registered email.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-full md:w-1/2 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-white poppins-font font-normal text-xl sm:text-2xl">
              Payment Details
            </h2>
            <span className="text-[#B5B5B5] poppins-font font-normal text-sm sm:text-base">
              Please provide your payment details below to securely complete your purchase.
            </span>
          </div>

          {/* FORM */}
          <div className="flex flex-col gap-4">
            {/* PLAN */}
            {plansToShow.length > 1 ? (
              <div className="flex flex-col">
                <label className="text-white text-sm mb-1">Plan *</label>
                <div className="flex gap-4">
                  {plansToShow.map((p) => (
                    <div
                      key={p.id}
                      className={`flex-1 h-12 sm:h-14 rounded-lg border border-[#FFFFFF66] flex items-center px-4 cursor-pointer ${
                        formData.plan === p.name ? "bg-[#8A38F533]" : "bg-[#151515]"
                      } ${planError ? "invalid-blink" : ""}`}
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, plan: p.name }));
                        setPlanError("");
                      }}
                    >
                      <div className="text-white text-sm">{p.name}</div>
                      <input type="radio" checked={formData.plan === p.name} readOnly className="ml-auto" />
                    </div>
                  ))}
                </div>
                {planError && <span className="text-red-400 text-sm mt-1">{planError}</span>}
              </div>
            ) : (
              <div className="flex flex-col">
                <label className="text-white text-sm mb-1">Selected Plan *</label>
                <div className="w-full h-12 sm:h-14 rounded-lg border border-[#FFFFFF66] flex items-center px-4 bg-[#8A38F533]">
                  <div className="text-white text-sm">Selected Plan: {formData.plan}</div>
                </div>
                {planError && <span className="text-red-400 text-sm mt-1">{planError}</span>}
              </div>
            )}

            {/* DURATION */}
            <div className="flex flex-col">
              <label className="text-white text-sm mb-1">Billing Cycle</label>
              <div className="flex gap-4">
                {["Monthly"].map((d) => (
                  <div
                    key={d}
                    className={`flex-1 h-12 sm:h-14 rounded-lg border border-[#FFFFFF66] flex items-center px-4 cursor-pointer ${
                      formData.duration === d ? "bg-[#8A38F533]" : "bg-[#151515]"
                    }`}
                    onClick={() => handleDurationSelect(d)}
                  >
                    <div className="text-white text-sm">{d}</div>
                    <input type="radio" checked={formData.duration === d} readOnly className="ml-auto" />
                  </div>
                ))}
              </div>
            </div>

            {/* NAME */}
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
                <span className="text-red-400 text-sm mt-1">
                  {nameError || "Only letters and spaces allowed."}
                </span>
              )}
            </div>

            {/* PHONE NUMBER (FIXED) */}
            <div className="flex-1 relative">
  <label className="block text-sm mb-1 text-white">Phone Number *</label>

  <div className="relative flex items-center">
    {/* Country code */}
    <select
      value={formData.country_code}
      onChange={(e) => {
        const newCode = e.target.value;
        setFormData((prev) => ({
          ...prev,
          country_code: newCode,
          contact_number: "",
        }));
        setErrors((prev) => ({ ...prev, contact_number: "" }));
      }}
      className="
        absolute left-2 bg-[#151515] text-white text-sm pr-8 pl-3 py-2
        rounded-md border border-[#48207E66]
        outline-none appearance-none cursor-pointer
        focus:ring-0 focus:outline-none
      "
      style={{ WebkitAppearance: "none", MozAppearance: "none", appearance: "none" }}
    >
      <option value="+91">+91</option>
      <option value="+1">+1</option>
      <option value="+44">+44</option>
      <option value="+61">+61</option>
      <option value="+81">+81</option>

      {/* Added new country codes */}
      <option value="+971">+971</option>
      <option value="+974">+974</option>
      <option value="+973">+973</option>
      <option value="+965">+965</option>
      <option value="+966">+966</option>
      <option value="+968">+968</option>
      <option value="+852">+852</option>
      <option value="+853">+853</option>
      <option value="+60">+60</option>
      <option value="+62">+62</option>
      <option value="+63">+63</option>
      <option value="+65">+65</option>
      <option value="+64">+64</option>
      <option value="+977">+977</option>
      <option value="+880">+880</option>
      <option value="+94">+94</option>
      <option value="+92">+92</option>
      <option value="+7">+7</option>
      <option value="+49">+49</option>
      <option value="+33">+33</option>
      <option value="+39">+39</option>
      <option value="+34">+34</option>
      <option value="+52">+52</option>
      <option value="+55">+55</option>
      <option value="+82">+82</option>
      <option value="+86">+86</option>
    </select>

    {/* Dropdown arrow */}
    <div className="absolute left-14 pointer-events-none">
      <svg className="w-4 h-4 text-white " fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>

    {/* Phone input */}
    <input
      type="tel"
      name="contact_number"
      value={formData.contact_number || ""}
      onChange={(e) => {
        const rules = {
          "+91": 10,
          "+1": 10,
          "+44": 10,
          "+61": 9,
          "+81": 10,

          "+971": 9,
          "+974": 8,
          "+973": 8,
          "+965": 8,
          "+966": 9,
          "+968": 8,
          "+852": 8,
          "+853": 8,
          "+60": 9,
          "+62": 10,
          "+63": 10,
          "+65": 8,
          "+64": 9,
          "+977": 10,
          "+880": 10,
          "+94": 9,
          "+92": 10,
          "+7": 10,
          "+49": 11,
          "+33": 9,
          "+39": 10,
          "+34": 9,
          "+52": 10,
          "+55": 11,
          "+82": 10,
          "+86": 11,
        };

        const max = rules[formData.country_code] || 10;
        const val = e.target.value.replace(/[^0-9]/g, "").slice(0, max);
        setFormData((prev) => ({ ...prev, contact_number: val }));

        if (val && val.length < max) {
          setErrors((prev) => ({
            ...prev,
            contact_number: `Enter a valid ${max}-digit number`,
          }));
        } else {
          setErrors((prev) => ({ ...prev, contact_number: "" }));
        }
      }}
      placeholder="Enter phone number"
      maxLength={
        (() => {
          const r = {
            "+91": 10,
            "+1": 10,
            "+44": 10,
            "+61": 9,
            "+81": 10,

            "+971": 9,
            "+974": 8,
            "+973": 8,
            "+965": 8,
            "+966": 9,
            "+968": 8,
            "+852": 8,
            "+853": 8,
            "+60": 9,
            "+62": 10,
            "+63": 10,
            "+65": 8,
            "+64": 9,
            "+977": 10,
            "+880": 10,
            "+94": 9,
            "+92": 10,
            "+7": 10,
            "+49": 11,
            "+33": 9,
            "+39": 10,
            "+34": 9,
            "+52": 10,
            "+55": 11,
            "+82": 10,
            "+86": 11,
          };
          return r[formData.country_code] || 10;
        })()
      }
      inputMode="numeric"
      autoComplete="tel"
      className={`
        w-full p-3 pl-24 rounded-[12px] border
        bg-[#151515] text-white placeholder-[#B5B5B5]
        focus:outline-none focus:border-[#8A38F5]
        ${
          formData.contact_number &&
          formData.contact_number.length <
          (() => {
            const r = {
              "+91": 10,
              "+1": 10,
              "+44": 10,
              "+61": 9,
              "+81": 10,

              "+971": 9,
              "+974": 8,
              "+973": 8,
              "+965": 8,
              "+966": 9,
              "+968": 8,
              "+852": 8,
              "+853": 8,
              "+60": 9,
              "+62": 10,
              "+63": 10,
              "+65": 8,
              "+64": 9,
              "+977": 10,
              "+880": 10,
              "+94": 9,
              "+92": 10,
              "+7": 10,
              "+49": 11,
              "+33": 9,
              "+39": 10,
              "+34": 9,
              "+52": 10,
              "+55": 11,
              "+82": 10,
              "+86": 11,
            };
            return r[formData.country_code] || 10;
          })()
            ? "border-red-500"
            : "border-[#FFFFFF66]"
        }
      `}
    />
  </div>

  {errors.contact_number && (
    <p className="text-red-400 text-xs mt-1">{errors.contact_number}</p>
  )}
</div>


            {/* EMAIL */}
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
                <span className="text-red-400 text-sm mt-1">
                  {emailError || "Invalid email address."}
                </span>
              )}
            </div>

            {/* STREET ADDRESS */}
            <div className="flex flex-col">
              <label className="text-white text-sm mb-1">Street Address *</label>
              <input
                type="text"
                name="street_address"
                value={formData.street_address}
                onChange={handleChange}
                placeholder="Enter address"
                className={`w-full h-12 sm:h-14 px-4 rounded-lg bg-[#151515] backdrop-blur-md text-white placeholder-[#B5B5B5] border border-transparent focus:border-[#8A38F5] outline-none ${
                  addressInvalid ? "invalid-blink" : ""
                }`}
              />
            </div>

            {/* COUNTRY + CITY */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 flex flex-col">
                <label className="text-white text-sm mb-1">Country *</label>
                <Listbox value={countryCode} onChange={handleCountryChange}>
                  {({ open }) => (
                    <>
                      <div className="relative">
                        <Listbox.Button className="w-full h-12 sm:h-14 px-4 rounded-lg bg-[#151515] backdrop-blur-md text-white border border-transparent focus:border-[#8A38F5] outline-none flex items-center justify-between">
                          <span className="text-white text-sm">
                            {countries.find((c) => c.code === countryCode)?.name || "Select Country"}
                          </span>
                          <svg
                            className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </Listbox.Button>

                        <Listbox.Options className="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-auto bg-[#151515] backdrop-blur-md rounded-lg border border-[#FFFFFF66] z-50">
                          {countries.map((c) => (
                            <Listbox.Option
                              key={c.code}
                              className={({ active, selected }) =>
                                `relative cursor-pointer select-none py-2 px-4 text-sm text-white ${
                                  active ? "bg-[#8A38F533]" : ""
                                } ${selected ? "font-medium" : ""}`
                              }
                              value={c.code}
                            >
                              {c.name}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </div>
                    </>
                  )}
                </Listbox>
              </div>

              <div className="flex-1 flex flex-col">
                <label className="text-white text-sm mb-1">City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  className={`w-full h-12 sm:h-14 px-4 rounded-lg bg-[#151515] backdrop-blur-md text-white placeholder-[#B5B5B5] border border-transparent focus:border-[#8A38F5] outline-none ${
                    addressInvalid ? "invalid-blink" : ""
                  }`}
                />
              </div>
            </div>

            {/* STATE + POSTAL */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 flex flex-col">
                <label className="text-white text-sm mb-1">State *</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="State"
                  className={`w-full h-12 sm:h-14 px-4 rounded-lg bg-[#151515] backdrop-blur-md text-white placeholder-[#B5B5B5] border border-transparent focus:border-[#8A38F5] outline-none ${
                    addressInvalid ? "invalid-blink" : ""
                  }`}
                />
              </div>

              <div className="flex-1 flex flex-col">
                <label className="text-white" text-white text-sm mb-1 >Postal Code *</label>
                <input
                  type="text"
                  name="pincode"
                  value={zip}
                  onChange={handleZipChange}
                  placeholder="Enter postal code"
                  className={`w-full h-12 sm:h-14 px-4 rounded-lg bg-[#151515] backdrop-blur-md text-white placeholder-[#B5B5B5] border border-transparent focus:border-[#8A38F5] outline-none ${
                    addressInvalid ? "invalid-blink" : ""
                  }`}
                />
              </div>
            </div>

            {/* COUPON */}
            <div className="flex flex-col">
              <label className="text-white text-sm mb-1">Coupon Code (optional)</label>
              <input
                type="text"
                name="coupon_code"
                value={formData.coupon_code}
                onChange={handleChange}
                readOnly
                placeholder="Enter coupon code"
                className="w-full h-12 sm:h-14 px-4 rounded-lg bg-[#151515] backdrop-blur-md text-white placeholder-[#B5B5B5] border border-transparent focus:border-[#8A38F5] outline-none cursor-not-allowed"
              />
            </div>

            {/* PAY BUTTON */}
            <button
              onClick={handleContinue}
              disabled={!isFormValid()}
              className={`w-full h-12 sm:h-14 flex items-center justify-center gap-2 rounded-full border border-[#C22CA299] bg-gradient-to-r from-[#8A38F580] to-[#C22CA280] backdrop-blur-md shadow-lg text-white poppins-font text-sm sm:text-base font-normal transition-transform duration-300 ${
                isFormValid()
                  ? "hover:scale-105 cursor-pointer"
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
