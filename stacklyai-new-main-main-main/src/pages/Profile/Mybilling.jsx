
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Banner from "../../assets/profile/banner.jpg";
import Pimage from "../../assets/profile/pimage.png";
import { toast } from "react-toastify";

export default function MyBilling() {
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
    total_members: 1,
    original_price: 0,
    discount_price: null,
    total_credits: 0,
    used_credits: 0,
    balance_credits: 0,
    renews_on: null,
    plan_expiring_date: null,
    start_date: null,
    user: {
      name: "",
      email: "",
      userid: null,
    },
  });

  const [billingHistory, setBillingHistory] = useState([]);
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
          "https://www.ai.stacklycloud.com/api/profile",
          {
            params: { userid: userId },
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const profilePicUrl = profileResponse.data.profile_pic
          ? profileResponse.data.profile_pic.startsWith("/media/profile_pics")
            ? `https://www.ai.stacklycloud.com/api/${profileResponse.data.profile_pic}`
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
          "https://www.ai.stacklycloud.com/api/subscription",
          {
            params: { userid: userId },
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const subData = subscriptionResponse.data;
        setSubscriptionData({
          current_plan: subData.current_plan || "Basic",
          duration: subData.duration || "Monthly",
          total_members: subData.total_members || 1,
          original_price: subData.original_price || 0,
          discount_price: subData.discount_price || null,
          total_credits: subData.total_credits || 0,
          used_credits: subData.used_credits || 0,
          balance_credits:
            subData.balance_credits ||
            (subData.total_credits || 0) - (subData.used_credits || 0),
          renews_on: subData.renews_on || null,
          plan_expiring_date: subData.plan_expiring_date || null,
          start_date: subData.start_date || null,
          user: {
            name: subData.user?.name || "",
            email: subData.user?.email || "",
            userid: subData.user?.userid || null,
          },
        });

        // Fetch billing history
        const billingHistoryResponse = await axios.get(
          "https://www.ai.stacklycloud.com/api/billing/history",
          {
            params: { userid: userId },
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setBillingHistory(billingHistoryResponse.data.billing_history || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.response?.data?.detail || "Failed to load data");
        toast.error(
          err.response?.data?.detail || "Failed to load billing data"
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
      <div className="w-full h-screen flex items-center justify-center">
        Loading data...
      </div>
    );
  }

  if (error) {
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
        /* Mobile  */
        w-full min-h-0 p-4 mb-0 mt-[200px]
        /* Tablet - UNCHANGED */
        sm:absolute sm:top-[-130px] sm:mb-[50px] sm:left-[240px] sm:w-[calc(100vw-280px)] sm:h-auto sm:p-6
        /* Desktop/Laptop  */
        lg:absolute lg:top-[-180px] lg:left-[251px] lg:w-[min(1030px ,100%)] lg:mb-[100px] lg:h-auto lg:p-[32px] lg:overflow-hidden
        rounded-[8px] border-[1px] border-solid border-[#FFFFFF1F] bg-[#FFFFFF0A] 
        flex flex-col
      ">
        {/* Header */}
        <div className="
          flex justify-center items-center rounded-[4px] border-b border-[#0000004D] bg-[#0000004D] 
          px-3 py-2 opacity-100 flex-shrink-0
          /* Mobile - UNCHANGED */
          w-[120px] h-[32px] text-[16px]
          /* Tablet - UNCHANGED */
          sm:w-[160px] sm:h-[36px] sm:px-[12px] sm:py-[4px] sm:text-[19px]
          /* Desktop - UNCHANGED */
          lg:w-[173px] lg:h-[38px] lg:text-[20px] lg:px-[12px] lg:py-[4px]
        ">
          <h2 className="poppins-font text-white">Billing</h2>
        </div>
        
        {/* Content Container */}
        <div className="
          w-full flex flex-col mx-auto
          /* Mobile - Remove bottom padding */
          mt-4 gap-4 pb-0
          /* Tablet - UNCHANGED */
          sm:mt-5 sm:gap-5 sm:max-w-full sm:pb-0
          /* Desktop - RESPONSIVE */
          lg:gap-[20px] lg:max-w-[min(800px,100%)] lg:mt-[20px] lg:pb-0
        ">
          {/* Header */}
          <div className="
            text-white text-center leading-relaxed opacity-100 mx-auto poppins-font font-normal
            /* Mobile - UNCHANGED */
            w-full h-auto text-[16px]
            /* Tablet - UNCHANGED */
            sm:text-[19px] sm:leading-[28px]
            /* Desktop - RESPONSIVE */
            lg:w-full lg:max-w-[min(657px,100%)] lg:h-[30px] lg:text-[20px] lg:leading-[30px]
          ">
            Your <span className="text-[#9747FF]">Active</span> Plan!
          </div>

          {/* Horizontal Line */}
          <div className="
            border-[1px] border-solid border-[#6D6D6D33] mx-auto opacity-100
            /* Mobile Only - UNCHANGED */
            w-[calc(100%-20px)] max-w-[full] h-0
            /* Hidden on Tablet and Desktop - UNCHANGED */
            sm:hidden
          "></div>

          {/* Plan Details  */}
          <div className="
            flex justify-center items-center
            /* Mobile: Horizontal layout with smaller gaps - UNCHANGED */
            flex-row gap-2 flex-nowrap
            /* Tablet: Reduced gap for screens below 800px - UNCHANGED */
            sm:flex-row sm:gap-1.5 sm:flex-nowrap sm:justify-center
            /* Desktop - RESPONSIVE WRAP */
            lg:gap-[min(67px,4vw)] lg:flex-wrap lg:justify-center
          ">
            <div className="
              rounded-[12px] border-[1px] border-solid border-[#9747FF33] 
              bg-gradient-to-r from-[rgba(151,71,255,0.12)] to-[rgba(91,43,153,0.12)] 
              flex items-center justify-center opacity-100 flex-shrink-0
              /* Mobile - UNCHANGED */
              flex-col text-center w-[80px] h-[50px] px-[6px] gap-[1px] text-[10px]
              /* Tablet: Horizontal layout - UNCHANGED */
              sm:flex-row sm:text-center sm:whitespace-nowrap sm:w-[105px] sm:h-[55px] sm:px-[8px] sm:gap-[3px]
              /* Desktop - RESPONSIVE */
              lg:flex-row lg:text-center lg:whitespace-nowrap lg:w-[min(159px,calc(33%-1rem))] lg:h-[61px] lg:px-[10px] lg:gap-[4px]
            ">
              <span className="
                text-white font-normal poppins-font
                text-[8px] sm:text-[8px] lg:text-[min(12px,0.75rem)]
              ">
                Current Plan:
              </span>
              <span className="
                text-[#9747FF] font-medium poppins-font
                text-[9px] sm:text-[9px] lg:text-[min(14px,0.875rem)]
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
              flex items-center justify-center opacity-100 flex-shrink-0
              /* Mobile: Text wrapping allowed - UNCHANGED */
              flex-col text-center w-[90px] h-[50px] px-[6px] gap-[1px]
              /* Tablet: Horizontal layout - UNCHANGED */
              sm:flex-row sm:whitespace-nowrap sm:w-[130px] sm:h-[55px] sm:px-[10px] sm:gap-[1px]
              /* Desktop - RESPONSIVE */
              lg:flex-row lg:whitespace-nowrap lg:w-[min(197px,calc(33%-1rem))] lg:h-[61px] lg:px-[min(20px,1.25rem)] lg:gap-[4px]
            ">
              <span className="
                text-white font-normal poppins-font
                text-[8px] sm:text-[8px] lg:text-[min(12px,0.75rem)]
              ">
                Duration period:
              </span>
              <span className="
                text-[#9747FF] font-medium poppins-font
                text-[9px] sm:text-[9px] lg:text-[min(14px,0.875rem)]
              ">
                {subscriptionData.duration}
              </span>
            </div>

            <div className="
              rounded-[12px] border-[1px] border-solid border-[#9747FF33] 
              bg-gradient-to-r from-[rgba(151,71,255,0.12)] to-[rgba(91,43,153,0.12)] 
              flex items-center justify-center opacity-100 flex-shrink-0
              /* Mobile - UNCHANGED */
              flex-col text-center w-[80px] h-[50px] px-[6px] gap-[1px]
              /* Tablet: Horizontal layout - UNCHANGED */
              sm:flex-row sm:text-center sm:w-[109px] sm:h-[55px] sm:px-[10px] sm:gap-[2px]
              /* Desktop - RESPONSIVE */
              lg:flex-row lg:text-center lg:w-[min(159px,calc(33%-1rem))] lg:h-[61px] lg:px-[min(20px,1.25rem)] lg:gap-[2px]
            ">
              <span className="
                text-white font-normal poppins-font
                text-[8px] sm:text-[8px] lg:text-[min(12px,0.75rem)]
              ">
                Total members:
              </span>
              <span className="
                text-[#9747FF] font-medium poppins-font
                text-[9px] sm:text-[9px] lg:text-[min(14px,0.875rem)]
              ">
                {subscriptionData.total_members}
              </span>
            </div>
          </div>

          {/*  */}
          <div className="flex-1 hidden lg:block"></div>

          {/* Credits & Renewal  */}
          <div className="flex justify-center w-full">
            <div className="
              flex flex-col w-full max-w-full
              gap-3 sm:gap-4 lg:gap-3
            ">
              {/* First Row  */}
              <div className="
                flex justify-between
                /* Mobile: Stack vertically - UNCHANGED */
                flex-col gap-3
                /* Tablet & Desktop: Side by side - RESPONSIVE */
                sm:flex-row sm:gap-3 lg:gap-[min(3rem,3vw)]
              ">
                <div className="flex-1 flex flex-col gap-2 items-start sm:min-w-0">
                  <span className="
                    text-white
                    text-[14px] sm:text-[14px] lg:text-[min(16px,1rem)]
                  ">
                    Monthly Design Credits
                  </span>
                  <div className="
                    rounded-[12px] border-[1px] border-solid border-[#FFFFFF66] 
                    bg-[#FFFFFF1F] flex items-center justify-start font-medium 
                    text-white px-3 gap-[10px] opacity-100
                    /* Mobile: Full width - UNCHANGED */
                    w-full h-[40px] text-[14px]
                    /* Tablet - UNCHANGED */
                    sm:h-[42px] sm:text-[15px] sm:min-w-0
                    /* Desktop - RESPONSIVE */
                    lg:w-full lg:max-w-[min(321px,100%)] lg:h-[45px] lg:text-[min(16px,1rem)]
                  ">
                    {subscriptionData.total_credits}
                  </div>
                </div>

                <div className="flex-1 flex flex-col gap-2 items-start sm:min-w-0">
                  <span className="
                    text-white
                    text-[14px] sm:text-[14px] lg:text-[min(16px,1rem)]
                  ">
                    Used Design Credits
                  </span>
                  <div className="
                    rounded-[12px] border-[1px] border-solid border-[#FFFFFF66] 
                    bg-[#FFFFFF1F] flex items-center justify-start font-medium 
                    text-white px-3 gap-[10px]
                    /* Mobile: Full width - UNCHANGED */
                    w-full h-[40px] text-[14px]
                    /* Tablet - UNCHANGED */
                    sm:h-[42px] sm:text-[15px] sm:min-w-0
                    /* Desktop - RESPONSIVE */
                    lg:w-full lg:max-w-[min(321px,100%)] lg:h-[45px] lg:text-[min(16px,1rem)]
                  ">
                    {subscriptionData.used_credits}
                  </div>
                </div>
              </div>

              {/* Second Row */}
              <div className="
                flex justify-between
                /* Mobile: Stack vertically - UNCHANGED */
                flex-col gap-3
                /* Tablet & Desktop: Side by side - RESPONSIVE */
                sm:flex-row sm:gap-3 lg:gap-[min(3rem,3vw)]
              ">
                <div className="flex-1 flex flex-col gap-2 items-start sm:min-w-0">
                  <span className="
                    text-white
                    text-[14px] sm:text-[14px] lg:text-[min(16px,1rem)]
                  ">
                    Balance Design Credits
                  </span>
                  <div className="
                    rounded-[12px] border-[1px] border-solid border-[#FFFFFF66] 
                    bg-[#FFFFFF1F] flex items-center justify-between px-3
                    /* Mobile: Full width - UNCHANGED */
                    w-full h-[40px]
                    /* Tablet - UNCHANGED */
                    sm:h-[42px] sm:min-w-0
                    /* Desktop - RESPONSIVE */
                    lg:w-full lg:max-w-[min(321px,100%)] lg:h-[45px]
                  ">
                    <span className="
                      font-medium text-white
                      text-[14px] sm:text-[15px] lg:text-[min(16px,1rem)]
                    ">
                      {subscriptionData.balance_credits}
                    </span>
                  </div>
                  <span className="
                    text-[#6E6E6E]
                    text-[12px] sm:text-[13px] lg:text-[min(14px,0.875rem)]
                  ">
                    *Stay updated for your remaining balance
                  </span>
                </div>

                <div className="flex-1 flex flex-col gap-2 items-start sm:min-w-0">
                  <span className="
                    text-white
                    text-[14px] sm:text-[14px] lg:text-[min(16px,1rem)]
                  ">
                    Renews on
                  </span>
                  <div className="
                    rounded-[12px] border-[1px] border-solid border-[#FFFFFF66] 
                    bg-[#FFFFFF1F] flex items-center justify-between px-3
                    /* Mobile: Full width - UNCHANGED */
                    w-full h-[40px]
                    /* Tablet - UNCHANGED */
                    sm:h-[42px] sm:min-w-0
                    /* Desktop - RESPONSIVE */
                    lg:w-full lg:max-w-[min(321px,100%)] lg:h-[45px]
                  ">
                    <span className="
                      font-medium text-white
                      text-[14px] sm:text-[15px] lg:text-[min(16px,1rem)]
                    ">
                      {subscriptionData.renews_on ||
                        subscriptionData.plan_expiring_date ||
                        "N/A"}
                    </span>
                  </div>
                  <span className="
                    text-[#6E6E6E]
                    text-[12px] sm:text-[13px] lg:text-[min(14px,0.875rem)]
                  ">
                    *Stay specified as your received time
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Billing History Section */}
          <div className="w-full mb-0 sm:mb-8">
            <h3 className="
              poppins-font text-white mb-4 text-center mx-auto
              text-[16px] sm:text-[17px] lg:text-[min(18px,1.125rem)]
            ">
              Billing History
            </h3>
            <div className="
              border-[1px] border-solid border-[#6D6D6D33] mx-auto
              w-full sm:w-[min(600px,100%)] lg:w-[min(658px,100%)]
            "></div>

            {billingHistory.length > 0 ? (
              <div className="
                w-full rounded-[8px] mt-4 overflow-x-auto
              ">
                {/* Table Header */}
                <div className="
                  flex bg-[#9747FF1F] text-white font-medium
                  text-[12px] sm:text-[13px] lg:text-[min(14px,0.875rem)]
                  min-w-[500px] lg:min-w-0
                ">
                  <div className="flex-1 p-3 poppins-font min-w-[80px]">Date</div>
                  <div className="flex-1 p-3 poppins-font min-w-[70px]">Amount</div>
                  <div className="flex-1 p-3 poppins-font min-w-[100px]">Payment Method</div>
                  <div className="flex-1 p-3 poppins-font min-w-[70px]">Status</div>
                  <div className="flex-1 p-3 poppins-font min-w-[70px]">Invoice</div>
                </div>

                {/* Table Rows  */}
                <div className="min-w-[500px] lg:min-w-0">
                  {billingHistory
                    .slice(0, 5)
                    .map((bill, index) => (
                      <div
                        key={index}
                        className="flex border-b border-solid border-[#444] text-[12px] sm:text-[13px] lg:text-[min(14px,0.875rem)]"
                      >
                        <div className="flex-1 p-3 text-[#B0B0B0] poppins-font min-w-[80px]">
                          {bill.date}
                        </div>
                        <div className="flex-1 p-3 text-[#B0B0B0] poppins-font min-w-[70px]">
                          ${bill.amount}
                        </div>
                        <div className="flex-1 p-3 text-[#B0B0B0] poppins-font min-w-[100px]">
                          {bill.payment_method}
                        </div>
                        <div className="flex-1 p-3 text-[#B0B0B0] poppins-font min-w-[70px]">
                          {bill.status}
                        </div>
                        <div className="flex-1 p-3 text-[#B0B0B0] cursor-pointer hover:underline poppins-font min-w-[70px]">
                          {bill.invoice_url ? (
                            <a
                              href={bill.invoice_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View
                            </a>
                          ) : (
                            "N/A"
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              <div className="w-full text-center mt-4">
                <p className="
                  text-[#B0B0B0] poppins-font italic
                  text-[12px] sm:text-[13px] lg:text-[min(14px,0.875rem)]
                ">
                  No Billing history available
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}