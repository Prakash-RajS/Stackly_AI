import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import ellipse from "../../assets/contactus/Ellipse.png";
import ellipse1 from "../../assets/contactus/Ellipse2.png";
import handShake from "../../assets/contactus/handShake.png";
import Bg from "../../assets/contactus/CnBg.png";


const ContactForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    contact_number: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [isFormFilled, setIsFormFilled] = useState(false);
  
  // 👈 DEBOUNCE TIMER
  const debounceTimer = useRef(null);

  // 👈 FIXED: 1ST TOAST - Show ONCE per keystroke burst, AUTO-CLOSE 2s
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value.trim(),
    }));

    // 👈 CHECK IF ALL FIELDS FILLED
    const updatedFormData = {
      ...formData,
      [name]: value.trim()
    };
    
    const isFilled = 
      updatedFormData.first_name &&
      updatedFormData.last_name &&
      updatedFormData.email &&
      updatedFormData.contact_number &&
      updatedFormData.message;

    setIsFormFilled(isFilled);

    // 👈 CLEAR PREVIOUS TIMER
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // 👈 DEBOUNCE: Show toast AFTER user stops typing for 300ms
    debounceTimer.current = setTimeout(() => {
      if (value.trim()) {
        // 👈 DISMISS ANY EXISTING TOAST FIRST
        toast.dismiss("typing-toast");
        
        toast.error("🔐 You need to login first!", {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          theme: "dark",
          toastId: "typing-toast",
        });
      }
    }, 300); // 👈 300ms delay
  };

  // 👈 FIXED: 2ND TOAST - Button click (FORCE AUTO-CLOSE)
  const handleButtonClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Clear ALL toasts
    toast.dismiss();

    toast.error("🚪 You have to login first!", {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      theme: "dark",
      toastId: "button-toast",
    });

    // 👈 FORCE NAVIGATE AFTER 2s (even if toast stuck)
    setTimeout(() => {
      navigate("/sign-in");
    }, 2000);
  };

  // 👈 CLEANUP DEBOUNCE ON UNMOUNT
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
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
      `}</style>

      <div className="
        relative z-10
        w-full
        max-w-[95vw]
        sm:max-w-[90vw]
        md:max-w-[668px]
        xl:max-w-[500px]
        2xl:max-w-[668px]
        flex flex-col items-center gap-6 md:gap-[28px] text-white
        transition-all duration-300
      ">
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

          <style>{`
            @keyframes rotateSwing {
              0%, 100% { transform: rotate(0deg); }
              25% { transform: rotate(10deg); }
              50% { transform: rotate(-10deg); }
              75% { transform: rotate(5deg); }
            }
          `}</style>

          <p className="mt-2 max-[639px]:mt-4 text-base max-[639px]:text-sm sm:text-lg md:text-[20px] text-white/80">
            Curious how AI can style your space? <br /> Let's talk.
          </p>
        </div>

        <form 
          className="w-full flex flex-col gap-4 max-[639px]:mt-4"
          onSubmit={handleSubmit}
        >
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
            <div className="flex-1">
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full p-3 rounded-[12px] border border-white/40 bg-white/10 text-white placeholder-white/50 focus:outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm mb-1">Phone Number</label>
              <input
                type="tel"
                name="contact_number"
                value={formData.contact_number}
                onChange={handleChange}
                placeholder="+91 99999 99999"
                required
                className="w-full p-3 rounded-[12px] border border-white/40 bg-white/10 text-white placeholder-white/50 focus:outline-none"
              />
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
          
          <Link to="/sign-in">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleButtonClick}
              className="w-full mt-2 py-3 md:py-2 rounded-full text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:opacity-90"
              style={{
                border: "1px solid rgba(255, 255, 255, 0.1)",
                background: "rgba(138, 56, 245, 0.2)",
              }}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </Link>
        </form>

        {isSubmitted && (
          <p className="text-green-400 text-center mt-4">
            ✅ Message sent successfully!
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

export default ContactForm;