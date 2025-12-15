// Cancel.jsx
import { useEffect } from "react";
import Tick from "../../assets/pricing-pg/tick.png";
import Tick1 from "../../assets/pricing-pg/tick1.png";
import Logo from "../../assets/pricing-pg/flogo.png";
import Success from "../../assets/pricing-pg/error.png";
import Bg from "../../assets/pricing-pg/CancelBg.png";
import Paper from "../../assets/pricing-pg/paper.png";
import Arrow from "../../assets/forgetPg/arrow1.png";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Cancel() {
    useEffect(() => {
    const email = localStorage.getItem("billing_email");
    const name = localStorage.getItem("billing_name");

    if (email && name) {
      axios.post("https://www.ai.stacklycloud.com/api/pricing/send-payment-failed-email", {
        email,
        name
      }).then(() => {
        console.log("Payment failure email sent.");
      }).catch((error) => {
        console.error("Error sending failure email:", error);
      });
    }

    // Clean up after sending
    localStorage.removeItem("billing_email");
    localStorage.removeItem("billing_name");
  }, []);

    return (
        <div>        
<div
  className="w-full h-screen flex justify-center items-center bg-center bg-no-repeat bg-cover bg-black py-12 sm:py-16"
  style={{ backgroundImage: `url(${Bg})` }}
>
  <div
    className="w-full max-w-[1280px] rounded-[16px] border-2 border-[#FFFFFF33] drop-shadow-[0_0_12px_0] shadow-[#E3EBFB80] bg-cover bg-center bg-no-repeat backdrop-blur-[20px] flex flex-col justify-start items-start  "
  >
    <div className="w-full max-w-[1160px] h-auto flex flex-col justify-start items-start gap-[16px] mx-auto">

      <div className="w-full min-h-[600px] flex flex-col justify-center items-center gap-6 sm:gap-[10px]">

        {/* Headings */}
        <h2 className="text-[24px] poppins-font font-medium text-center leading-[156%] text-[#C49EF6]">
          Oops!
        </h2>
        <h2 className="text-white poppins-font font-semibold leading-[156%] text-center whitespace-nowrap text-[clamp(16px,5vw,28px)]">
          Something went wrong
        </h2>

        {/* Centered image */}
        <img
          src={Success}
          alt="logo-error"
          className="w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] object-contain my-6 sm:my-4"
        />

        {/* Message */}
        <div className="w-full max-w-[1072px] text-center font-normal text-[18px] leading-[156%] poppins-font text-white mt-8 sm:mt-[30px]">
          We are sorry, there was an error processing your payment. Please try again with a different payment method.
        </div>

        {/* Button */}
        <Link to="/apiconnect#afteruiplan">
          <button className="w-full max-w-[503px] h-[52px] flex items-center justify-center gap-[10px] rounded-[30px] border border-[#FFFFFF1A] px-[30px] py-[10px] bg-[#8A38F533] opacity-100 mt-8 sm:mt-[20px]">
            {/* Left image */}
            <img src={Arrow} alt="Back Icon" className="w-[24px] h-[18px] opacity-100" />

            {/* Right text */}
            <span className="text-white poppins-font font-medium text-[16px] leading-[100%] text-center flex items-center">
              Return to payment method
            </span>
          </button>
        </Link>

      </div>
    </div>
  </div>
</div>
        </div>
   );
}
