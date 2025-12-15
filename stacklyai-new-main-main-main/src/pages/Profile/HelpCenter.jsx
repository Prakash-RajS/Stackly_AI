import React, { useEffect, useState } from "react";
import Banner from "../../assets/profile/banner.jpg";
import Pimage from "../../assets/profile/pimage.png";
import Img from "../../assets/profile/msg.png";
import Eye from "../../assets/profile/eye.png";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function HelpCenter() {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [error, setError] = useState("");

  const [profileData, setProfileData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    profile_pic: null,
    previewImage: Pimage,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        let userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        if (!userId) {
          const userInfoRaw = localStorage.getItem("userInfo");
          if (userInfoRaw) {
            const userInfo = JSON.parse(userInfoRaw);
            userId = userInfo.userId || userInfo.id;
          }
        }

        if (!token) throw new Error("No authentication token found");
        if (!userId) throw new Error("No user ID found in storage");

        const profileResponse = await axios.get("https://www.ai.stacklycloud.com/api/profile", {
          params: { userid: userId },
          headers: { Authorization: `Bearer ${token}` },
        });

        const profilePicUrl = profileResponse.data.profile_pic
          ? profileResponse.data.profile_pic.startsWith("/media/profile_pics")
            ? `https://www.ai.stacklycloud.com/api/${profileResponse.data.profile_pic}`
            : profileResponse.data.profile_pic
          : Pimage;

        setProfileData({
          first_name: profileResponse.data.first_name || "",
          last_name: profileResponse.data.last_name || "",
          email: profileResponse.data.email || "",
          phone_number: profileResponse.data.phone_number || "",
          profile_pic: profileResponse.data.profile_pic,
          previewImage: profilePicUrl,
        });

        setEmail(profileResponse.data.email || "");
        
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError(err.response?.data?.detail || "Failed to load profile data");
        toast.error(err.response?.data?.detail || "Failed to load profile data");
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      } finally {
        setProfileLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!email || !subject || !message) {
      setErrorMsg("All fields are required.");
      toast.error("⚠️ All fields are required.");
      return;
    }
    if (subject.length > 30) {
      setErrorMsg("Subject must be 30 characters or less.");
      toast.error("⚠️ Subject must be 30 characters or less.");
      return;
    }
    if (message.length > 500) {
      setErrorMsg("Message must be 500 characters or less.");
      toast.error("⚠️ Message must be 500 characters or less.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const response = await axios.post(
        "https://www.ai.stacklycloud.com/api/help-center",
        {
          email,
          subject,
          message: message.replace(/\n/g, " "),
          source: "help_center",
          first_name: profileData.first_name,
          last_name: profileData.last_name,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setSuccessMsg("Your message has been sent successfully!");
      setEmail(profileData.email || "");
      setSubject("");
      setMessage("");
      toast.success("✅ Your message has been sent successfully!");
    } catch (err) {
      setErrorMsg(err.response?.data?.detail || "Something went wrong.");
      toast.error(err.response?.data?.detail || "❌ Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        Loading data...
      </div>
    );
  }

  if (error) {
    toast.error("❌ Failed to load profile data!");
    return (
      <div className="w-full h-screen flex items-center justify-center text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div>
      {/* Main Container */}
      <section className="
        /* Mobile - FIXED: Proper static positioning with visible background and proper spacing */
        relative w-full h-auto min-h-fit p-3 mx-0 my-0 mt-[200px] bg-[#FFFFFF0A] border-[1px] border-solid border-[#FFFFFF1F]
        /* Tablet: UNCHANGED - Removed fixed height and scrolling for 1024px */
        sm:absolute sm:top-[70px] sm:left-[240px] sm:w-[calc(100vw-280px)] sm:h-auto sm:min-h-0 sm:mx-0 sm:my-0 sm:p-6 sm:mt-0 sm:overflow-visible
        /* Desktop: UNCHANGED - Removed fixed height constraint and scrolling */
        lg:absolute lg:top-[20px] lg:left-[251px] lg:w-[min(1099px,calc(100vw-271px))] lg:h-auto lg:min-h-0 lg:p-[32px] lg:overflow-visible
        rounded-[8px] overflow-visible
        flex flex-col
      ">
        {/* Header */}
        <div className="
          flex justify-center items-center rounded-[4px] border-b border-[#0000004D] bg-[#0000004D] 
          px-2 py-1 opacity-100 flex-shrink-0
          /* Mobile - SMALLER SIZE - UNCHANGED */
          w-[100px] h-[30px] text-[14px]
          /* Tablet - UNCHANGED */
          sm:w-[160px] sm:h-[36px] md:w-[173px] md:h-[28px] sm:px-[12px] sm:py-[4px] sm:text-[19px]
          /* Desktop - UNCHANGED */
          lg:w-[173px] lg:h-[38px] lg:text-[20px] lg:px-[12px] lg:py-[4px]
        ">
          <h2 className="poppins-font text-white">Help Center</h2>
        </div>

        {/* Content */}
        <div className="
          w-full flex flex-col mx-auto gap-3
          /* Mobile - UNCHANGED: Removed min-height and overflow constraints, content-fitted */
          mt-3 mb-0
          /* Tablet - FIXED: Removed scrolling for 1024px */
          sm:mt-5 sm:gap-5 sm:max-w-full sm:overflow-visible
          /* Desktop - FIXED: Removed scrolling and flex-1 */
          lg:gap-[12px] lg:max-w-[min(800px,615px)] lg:mt-[10px] lg:overflow-visible
        ">
          <div className="
            rounded-[8px] backdrop-blur-[6px] shadow-[0_1px_4px_0] shadow-[#0000003D]
            /* Mobile & Tablet: Full width - UNCHANGED */
            w-full
            /* Desktop - UNCHANGED */
            lg:w-full lg:max-w-[min(807px,100%)]
          ">
            <div className="
              flex flex-col justify-start items-center
              /* Mobile - UNCHANGED: Reduced bottom padding to eliminate whitespace */
              px-3 py-4 pb-2
              /* Tablet - UNCHANGED */
              sm:px-8 sm:py-5 sm:gap-[8px]
              /* Desktop - UNCHANGED */
              lg:w-full lg:px-[min(40px,6%)] lg:py-[0px] lg:gap-[8px]
            ">
              <div className="
                flex flex-col justify-start items-center
                /* Mobile & Tablet: Full width - UNCHANGED */
                w-full gap-2
                /* Desktop - UNCHANGED */
                lg:w-full lg:max-w-[min(687px,100%)] lg:gap-[10px]
              ">
                <div className="
                  w-full text-center font-semibold text-white
                  /* Mobile - SMALLER TEXT - UNCHANGED */
                  text-[16px]
                  /* Tablet - UNCHANGED */
                  sm:text-[19px] sm:mt-[-20px]
                  /* Desktop - UNCHANGED */
                  lg:text-[20px]
                ">
                  Need Assistance?
                </div>
                <div className="
                  w-full text-center font-[400] text-white leading-tight
                  /* Mobile - SMALLER TEXT - UNCHANGED */
                  text-[12px]
                  /* Tablet - UNCHANGED */
                  sm:text-[13px]
                  /* Desktop - UNCHANGED */
                  lg:text-[14px]
                ">
                  We're here to help. Whether you're facing an issue or simply have a question, feel free to reach out anytime.
                </div>

                <div className="
                  rounded-[10px] border-[1px] border-solid border-[#FFFFFF1F] bg-[#FFFFFF1F] 
                  flex flex-col justify-center items-center shadow-[#ABB2BB40] shadow-[0_1.54px_12.2px_0]
                  /* Mobile - UNCHANGED: Reduced padding to minimize bottom space */
                  w-full gap-4 px-4 py-3 mb-0
                  /* Tablet - UNCHANGED */
                  sm:gap-[20px] sm:px-6 sm:py-5
                  /* Desktop - UNCHANGED */
                  lg:w-full lg:max-w-[min(687px,100%)] lg:gap-[15px] lg:px-[min(30px,5%)] lg:py-[18px]
                ">
                  {/* Connected Section */}
                  <div className="
                    flex items-center justify-center
                    /* Mobile - COMPACT SIZE - UNCHANGED */
                    w-auto h-[20px] gap-2
                    /* Tablet - UNCHANGED */
                    sm:w-auto sm:h-[26px] sm:gap-[4px]
                    /* Desktop - UNCHANGED */
                    lg:w-auto lg:max-w-[min(228px,100%)] lg:h-[27px] lg:gap-[4px]
                  ">
                    <div className="
                      opacity-100 flex-shrink-0
                      /* Mobile - SMALLER ICON - UNCHANGED */
                      w-[16px] h-[16px]
                      /* Tablet - UNCHANGED */
                      sm:w-[22px] sm:h-[22px]
                      /* Desktop - UNCHANGED */
                      lg:w-[24px] lg:h-[24px]
                    ">
                      <img src={Img} alt="icon" className="
                        /* Mobile - SMALLER ICON - UNCHANGED */
                        w-[16px] h-[16px]
                        /* Tablet - UNCHANGED */
                        sm:w-[22px] sm:h-[22px]
                        /* Desktop - UNCHANGED */
                        lg:w-[24px] lg:h-[24px]
                      " />
                    </div>
                    <div className="
                      font-semibold text-[#9747FF] text-center
                      /* Mobile - SMALLER TEXT - UNCHANGED */
                      text-[14px]
                      /* Tablet - UNCHANGED */
                      sm:text-[17px]
                      /* Desktop - UNCHANGED */
                      lg:text-[18px]
                    ">
                      Let's Stay Connected!
                    </div>
                  </div>

                  <div className="
                    font-[400] text-center text-white leading-tight
                    /* Mobile - SMALLER TEXT - UNCHANGED */
                    w-full text-[11px]
                    /* Tablet - UNCHANGED */
                    sm:w-full sm:text-[13px] sm:mt-[-8px]
                    /* Desktop - UNCHANGED */
                    lg:w-full lg:max-w-[min(615px,100%)] lg:text-[14px]
                  ">
                    Leave your email and message below. We'll get back to you as soon as possible.
                  </div>

                  {/* Form */}
                  <div className="
                    flex flex-col justify-between items-center
                    /* Mobile - UNCHANGED: Reduced bottom gap to eliminate whitespace */
                    w-full gap-3 mb-0
                    /* Tablet - UNCHANGED */
                    sm:w-full sm:gap-[20px]
                    /* Desktop - UNCHANGED */
                    lg:w-full lg:max-w-[min(487px,100%)] lg:gap-[12px]
                  ">
                    <div className="
                      flex flex-col justify-between items-center
                      /* Mobile - UNCHANGED: Reduced gap and removed bottom margin */
                      w-full gap-3 mb-0
                      /* Tablet - UNCHANGED */
                      sm:w-full sm:gap-[16px]
                      /* Desktop - UNCHANGED */
                      lg:w-full lg:max-w-[min(487px,100%)] lg:gap-[12px]
                    ">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter Your email"
                        readOnly
                        className="
                          rounded-[8px] border-[1px] border-[#FFFFFF66] bg-[#FFFFFF1F] border-solid 
                          text-white placeholder-white focus:outline-none focus:border-[#9747FF]
                          /* Mobile - COMPACT SIZE - UNCHANGED */
                          w-full h-[32px] px-2 py-1 text-[12px]
                          /* Tablet - UNCHANGED */
                          sm:w-full sm:h-[40px] sm:px-4 sm:py-2 sm:text-[15px] sm:rounded-[10px]
                          /* Desktop - UNCHANGED */
                          lg:w-full lg:max-w-[min(558px,100%)] lg:h-[38px] lg:px-[16px] lg:py-[6px] lg:text-[16px] lg:rounded-[10px]
                        "
                      />

                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Write a Subject"
                        maxLength={30}
                        className="
                          rounded-[8px] border-[1px] border-[#FFFFFF66] bg-[#FFFFFF1F] border-solid 
                          text-white placeholder-white focus:outline-none focus:border-[#9747FF]
                          /* Mobile - COMPACT SIZE - UNCHANGED */
                          w-full h-[32px] px-2 py-1 text-[12px]
                          /* Tablet - UNCHANGED */
                          sm:w-full sm:h-[40px] sm:px-4 sm:py-2 sm:text-[15px] sm:rounded-[10px]
                          /* Desktop - UNCHANGED */
                          lg:w-full lg:max-w-[min(558px,100%)] lg:h-[38px] lg:px-[16px] lg:py-[6px] lg:text-[16px] lg:rounded-[10px]
                        "
                      />

                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Your Message (Max 500 characters)"
                        maxLength={500}
                        className="
                          rounded-[8px] border-[1px] border-[#FFFFFF66] bg-[#FFFFFF1F] border-solid 
                          text-white placeholder-white focus:outline-none focus:border-[#9747FF] resize-none
                          /* Mobile - UNCHANGED: Reduced height slightly to minimize space */
                          w-full h-[90px] px-2 py-1 text-[12px]
                          /* Tablet - UNCHANGED */
                          sm:w-full sm:h-[130px] sm:px-4 sm:py-2 sm:text-[15px] sm:rounded-[10px]
                          /* Desktop - UNCHANGED */
                          lg:w-full lg:max-w-[min(558px,100%)] lg:h-[100px] lg:px-[16px] lg:py-[6px] lg:text-[16px] lg:rounded-[10px]
                        "
                      />

                      <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="
                          rounded-[20px] flex justify-center items-center bg-[#8A38F533] 
                          font-semibold text-white hover:bg-[#8A38F566] transition-colors duration-200
                          /* Mobile - COMPACT SIZE - UNCHANGED */
                          w-full h-[32px] px-4 py-1 text-[12px]
                          /* Tablet - UNCHANGED */
                          sm:w-full sm:h-[38px] sm:px-8 sm:py-1 sm:text-[15px] sm:rounded-[30px]
                          /* Desktop - UNCHANGED */
                          lg:w-full lg:max-w-[min(371px,100%)] lg:h-[35px] lg:px-[40px] lg:py-[2px] lg:text-[16px] lg:rounded-[30px]
                        "
                      >
                        {loading ? "Submitting..." : "Submit"}
                      </button>

                      {successMsg && (
                        <div className="
                          text-green-400 text-center w-full mb-0
                          text-[10px] sm:text-[12px] lg:text-[12px]
                        ">{successMsg}</div>
                      )}
                      {errorMsg && (
                        <div className="
                          text-red-500 text-center w-full mb-0
                          text-[10px] sm:text-[12px] lg:text-[12px]
                        ">{errorMsg}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}