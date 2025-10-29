import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Banner from "../../assets/profile/banner.jpg";
import Pimage from "../../assets/profile/pimage.png";
import { toast } from "react-toastify";

export default function Myplan() {
  const [profileData, setProfileData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    profile_pic: null,
    previewImage: Pimage,
  });

  const [subscriptionData, setSubscriptionData] = useState({
    current_plan: "Basic",
    duration: "Monthly",
    original_price: 0,
    discount_price: null,
    total_credits: 0,
    used_credits: 0,
    balance_credits: 0,
    renews_on: "",
    plan_expiring_date: "",
    total_members: 0,
    start_date: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        // If no direct userId, fallback to userInfo
        if (!userId) {
          const userInfoRaw = localStorage.getItem("userInfo");
          if (userInfoRaw) {
            try {
              const userInfo = JSON.parse(userInfoRaw);
              userId = userInfo.userId || userInfo.id;
            } catch (err) {
              console.warn("Failed to parse userInfo from localStorage", err);
            }
          }
        }

        if (!token) throw new Error("No authentication token found");
        if (!userId) throw new Error("No user ID found in storage");

        // Fetch profile data
        const profileResponse = await axios.get(
          "https://www.stacklycloud.com/api/profile",
          {
            params: { userid: userId },
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const profilePicUrl = profileResponse.data.profile_pic
          ? profileResponse.data.profile_pic.startsWith("/media/profile_pics")
            ? `https://www.stacklycloud.com/api/${profileResponse.data.profile_pic}`
            : profileResponse.data.profile_pic
          : Pimage;

        setProfileData((prev) => ({
          ...prev,
          first_name: profileResponse.data.first_name || "",
          last_name: profileResponse.data.last_name || "",
          email: profileResponse.data.email || "",
          phone_number: profileResponse.data.phone_number || "",
          profile_pic: profileResponse.data.profile_pic,
          previewImage: profilePicUrl,
        }));

        // Fetch subscription data
        const subscriptionResponse = await axios.get(
          "https://www.stacklycloud.com/api/subscription",
          {
            params: { userid: userId },
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const subData = subscriptionResponse.data;

        // Format dates for display
        const formatDate = (dateString) => {
          if (!dateString) return "N/A";
          try {
            const date = new Date(dateString);
            return date.toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            });
          } catch (e) {
            return dateString;
          }
        };

        setSubscriptionData({
          current_plan: subData.current_plan || "Basic",
          duration: subData.duration || "Monthly",
          original_price: subData.original_price || 0,
          discount_price: subData.discount_price || null,
          total_credits: subData.total_credits || 0,
          used_credits: subData.used_credits || 0,
          balance_credits: subData.balance_credits || 0,
          renews_on: formatDate(subData.renews_on),
          plan_expiring_date: formatDate(subData.plan_expiring_date),
          total_members: subData.total_members || 1,
          start_date: formatDate(subData.start_date),
        });
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.response?.data?.detail || "Failed to load data");
        toast.error(
          err.response?.data?.detail || "Failed to load subscription data"
        );

        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-32 flex items-center justify-center text-white">
        Loading data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-32 flex items-center justify-center text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Main Container */}
      <section className="
        w-full min-h-0 p-4 mb-0 mt-[200px]
        sm:absolute sm:top-[70px] sm:left-[240px] sm:w-[calc(100vw-280px)] sm:h-[452px] sm:mx-0 sm:my-0 sm:p-6 sm:mt-0 sm:pb-0
        lg:absolute lg:top-[20px] lg:left-[251px] lg:w-[100vh,calc(100vw-271px))] lg:h-[488px] lg:p-[32px] lg:pb-0
        rounded-[8px] border-[1px] border-solid border-[#FFFFFF1F] bg-[#FFFFFF0A] 
        flex flex-col opacity-100 overflow-visible
      ">
        
        {/* Header */}
        <div className="
          flex items-center justify-start rounded-[4px] border-b border-[#0000004D] bg-[#0000004D] 
          px-3 py-2 mb-4 flex-shrink-0
          w-[81px] h-[31px] text-[12px] gap-[4px] opacity-100
          sm:w-[160px] sm:h-[36px] sm:px-[12px] sm:py-[4px] sm:text-[18px] sm:justify-center
          lg:w-[173px] lg:h-[38px] lg:text-[20px] lg:px-[12px] lg:py-[4px] lg:justify-center
        ">
          <h2 className="poppins-font text-white font-medium">
            <span className="sm:hidden">My Plan</span>
            <span className="hidden sm:inline">My Plan</span>
          </h2>
        </div>

        {/* Content Container */}
        <div className="
          w-full flex flex-col mx-auto gap-3 mb-0 mt-3
          sm:mt-5 sm:gap-5 sm:max-w-full sm:px-2 sm:overflow-y-auto sm:flex-1
          lg:mt-[20px] lg:gap-[20px] lg:max-w-[min(800px,100%)] lg:px-0 lg:overflow-y-auto lg:flex-1
        ">
          
          {/* Header Text */}
          <div className="
            text-white text-center leading-relaxed opacity-100 mx-auto poppins-font font-normal
            w-full h-auto text-[16px]
            sm:text-[19px] sm:leading-[28px]
            lg:w-[min(657px,100%)] lg:h-[30px] lg:text-[20px] lg:leading-[30px]
          ">
            Your <span className="text-[#9747FF]">Active</span> Plan!
          </div>

          {/* Plan Details Cards */}
          <div className="
            flex justify-center items-center
            flex-no-wrap gap-1
            sm:flex-nowrap sm:gap-3
            lg:gap-[67px] lg:flex-nowrap
          ">
            <div className="
              rounded-[12px] border-[1px] border-solid border-[#9747FF33] 
              bg-gradient-to-r from-[rgba(151,71,255,0.12)] to-[rgba(91,43,153,0.12)] 
              flex flex-col items-center justify-center opacity-100 text-center
              w-[90px] min-w-[90px] h-[50px] px-[6px] py-[4px] gap-[2px]
              sm:w-[110px] sm:h-[50px] sm:px-[8px] sm:gap-[4px] sm:flex-row
              lg:w-[159px] lg:h-[61px] lg:px-[12px] lg:gap-[6px] lg:flex-row
            ">
              <span className="
                text-white font-normal poppins-font
                text-[8px] sm:text-[10px] lg:text-[12px]
              ">
                Plan:
              </span>
              <span className="
                text-[#9747FF] font-medium poppins-font
                text-[8px] sm:text-[11px] lg:text-[14px]
              ">
                {subscriptionData.current_plan
                  ? subscriptionData.current_plan.charAt(0).toUpperCase() +
                    subscriptionData.current_plan.slice(1).toLowerCase()
                  : ""}
              </span>
            </div>

            <div className="
              rounded-[12px] border-[1px] border-solid border-[#9747FF33] 
              bg-gradient-to-r from-[rgba(151,71,255,0.12)] to-[rgba(91,43,153,0.12)] 
              flex flex-col items-center justify-center opacity-100 text-center
              w-[85px] min-w-[85px] h-[50px] px-[6px] py-[4px] gap-[2px]
              sm:w-[110px] sm:h-[50px] sm:px-[8px] sm:gap-[2px] sm:flex-row
              lg:w-[197px] lg:h-[61px] lg:px-[20px] lg:gap-[2px] lg:flex-row
            ">
              <span className="
                text-white font-normal poppins-font
                text-[8px] sm:text-[10px] lg:text-[12px]
              ">
                Duration:
              </span>
              <span className="
                text-[#9747FF] font-medium poppins-font
                text-[8px] sm:text-[11px] lg:text-[14px]
              ">
                {subscriptionData.duration}
              </span>
            </div>

            <div className="
              rounded-[12px] border-[1px] border-solid border-[#9747FF33] 
              bg-gradient-to-r from-[rgba(151,71,255,0.12)] to-[rgba(91,43,153,0.12)] 
              flex flex-col items-center justify-center opacity-100 text-center
              w-[80px] min-w-[80px] h-[50px] px-[6px] py-[4px] gap-[2px]
              sm:w-[110px] sm:h-[50px] sm:px-[8px] sm:gap-[2px] sm:flex-row
              lg:w-[167px] lg:h-[61px] lg:px-[20px] lg:gap-[2px] lg:flex-row
            ">
              <span className="
                text-white font-normal poppins-font
                text-[8px] sm:text-[10px] lg:text-[12px]
              ">
                Price:
              </span>
              <span className="
                text-[#9747FF] font-medium poppins-font
                text-[8px] sm:text-[11px] lg:text-[14px]
              ">
                {subscriptionData.discount_price
                  ? `$${subscriptionData.discount_price}`
                  : `$${subscriptionData.original_price}`}
              </span>
            </div>
          </div>

          {/* Credits & Renewal Section */}
          <div className="flex justify-center mb-0">
            <div className="
              flex flex-col w-full max-w-full gap-3 mb-0
              sm:gap-4 lg:gap-3
            ">
              {/* First Row */}
              <div className="
                flex justify-between gap-3
                flex-col
                sm:flex-row sm:gap-[24px] lg:gap-[12px]
              ">
                <div className="flex-1 flex flex-col gap-2 items-start sm:min-w-0">
                  <span className="
                    text-white
                    text-[14px] sm:text-[12px] lg:text-[16px]
                  ">
                    Monthly Design Credits
                  </span>
                  <div className="
                    rounded-[12px] border-[1px] border-solid border-[#FFFFFF66] 
                    bg-[#FFFFFF1F] flex items-center justify-start font-medium 
                    text-white px-3 gap-[10px] opacity-100
                    w-full h-[40px] text-[14px]
                    sm:h-[42px] sm:text-[15px] sm:min-w-0
                    lg:w-[min(321px,100%)] lg:h-[45px] lg:text-[16px]
                  ">
                    {subscriptionData.total_credits}
                  </div>
                </div>

                <div className="flex-1 flex flex-col gap-2 items-start sm:min-w-0">
                  <span className="
                    text-white
                    text-[14px] sm:text-[12px] lg:text-[16px]
                  ">
                    Used Design Credits
                  </span>
                  <div className="
                    rounded-[12px] border-[1px] border-solid border-[#FFFFFF66] 
                    bg-[#FFFFFF1F] flex items-center justify-start font-medium 
                    text-white px-3 gap-[10px]
                    w-full h-[40px] text-[14px]
                    sm:h-[42px] sm:text-[15px] sm:min-w-0
                    lg:w-[min(321px,100%)] lg:h-[45px] lg:text-[16px]
                  ">
                    {subscriptionData.used_credits}
                  </div>
                </div>
              </div>

              {/* Second Row */}
              <div className="
                flex justify-between gap-3 mb-0
                flex-col
                sm:flex-row sm:gap-3 lg:gap-[12px]
              ">
                <div className="flex-1 flex flex-col gap-2 items-start sm:min-w-0 mb-0">
                  <span className="
                    text-white
                    text-[14px] sm:text-[12px] lg:text-[16px]
                  ">
                    Balance Design Credits
                  </span>
                  <div className="
                    rounded-[12px] border-[1px] border-solid border-[#FFFFFF66] 
                    bg-[#FFFFFF1F] flex items-center justify-between px-3
                    w-full h-[40px]
                    sm:h-[42px] sm:min-w-0
                    lg:w-[min(321px,100%)] lg:h-[45px]
                  ">
                    <span className="
                      font-medium text-white
                      text-[14px] sm:text-[15px] lg:text-[16px]
                    ">
                      {subscriptionData.balance_credits}
                    </span>
                  </div>
                  <span className="
                    text-[#6E6E6E]
                    text-[12px] sm:text-[13px] lg:text-[14px]
                  ">
                    *Stay updated for your remaining balance
                  </span>
                </div>

                <div className="flex-1 flex flex-col gap-2 items-start sm:min-w-0 mb-0">
                  <span className="
                    text-white
                    text-[14px] sm:text-[12px] lg:text-[16px]
                  ">
                    Renews on
                  </span>
                  <div className="
                    rounded-[12px] border-[1px] border-solid border-[#FFFFFF66] 
                    bg-[#FFFFFF1F] flex items-center justify-between px-3
                    w-full h-[40px]
                    sm:h-[42px] sm:min-w-0
                    lg:w-[min(321px,100%)] lg:h-[45px]
                  ">
                    <span className="
                      font-medium text-white
                      text-[14px] sm:text-[15px] lg:text-[16px]
                    ">
                      {subscriptionData.renews_on ||
                        subscriptionData.plan_expiring_date ||
                        "N/A"}
                    </span>
                  </div>
                  <span className="
                    text-[#6E6E6E]
                    text-[12px] sm:text-[13px] lg:text-[14px]
                  ">
                    *Stay specified as your received time
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}