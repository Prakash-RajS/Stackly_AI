import React, { useState, useEffect } from 'react';
import bg from "../../assets/afterHome/ProgileBg.png";
import Pimage from "../../assets/profile/pimage.png";
import profile from "../../assets/header/ProfileImg.png";
import axios from 'axios';
import { toast } from 'react-toastify';
import { Camera, Eye, EyeOff, Edit, X } from "lucide-react";
import { Link } from "react-router-dom";

export default function HeroProfile() {
  // -------------------------
  // ALL HOOKS AT THE TOP
  // -------------------------
  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    new_password: '',
    confirm_password: '',
    profile_pic: null,
    previewImage: Pimage
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  // NEW STATE: Editing mode
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState({});

  // -------------------------
  // Fetch User Data
  // -------------------------
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        let userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

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

        const response = await axios.get("https://www.stacklycloud.com/api/profile", {
          params: { userid: userId },
          headers: { Authorization: `Bearer ${token}` },
        });

        const userDataResponse = {
          first_name: response.data.first_name || "",
          last_name: response.data.last_name || "",
          email: response.data.email || "",
          phone_number: response.data.phone_number || "",
          previewImage: response.data.profile_pic
            ? `https://www.stacklycloud.com/api/${response.data.profile_pic}?t=${Date.now()}`
            : Pimage,
        };

        setUserData(userDataResponse);
        setOriginalData(userDataResponse);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error(error.response?.data?.detail || "Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // -------------------------
  // Input Change Handlers
  // -------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserData(prev => ({
        ...prev,
        profile_pic: file,
        previewImage: URL.createObjectURL(file)
      }));
    }
  };

  // -------------------------
  // Submit & Discard Profile
  // -------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const formData = new FormData();
      formData.append('first_name', userData.first_name);
      formData.append('last_name', userData.last_name);
      formData.append('email', userData.email);
      formData.append('phone_number', userData.phone_number);
      
      if (userData.profile_pic) {
        formData.append('profile_pic', userData.profile_pic);
      }

      const response = await axios.post('https://www.stacklycloud.com/api/update_profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      toast.success('Profile updated successfully!');
      setIsEditing(false);
      
      // Update the original data with the new values
      setOriginalData({
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        phone_number: userData.phone_number,
        previewImage: userData.previewImage
      });

      // Update the preview image if a new one was uploaded
      if (response.data.profile_pic) {
        setUserData(prev => ({
          ...prev,
          previewImage: `https://www.stacklycloud.com/api/${response.data.profile_pic}?t=${Date.now()}`
        }));
      }

      // Dispatch profileUpdated event for Header component
      window.dispatchEvent(new Event("profileUpdated"));

      // Force page refresh after a short delay to allow toast notification
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.detail || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    setUserData(prev => ({
      ...prev,
      ...originalData,
      new_password: '',
      confirm_password: '',
      profile_pic: null
    }));
    setIsEditing(false);
  };

  // -------------------------
  // Handle Password Modal Submit
  // -------------------------
  const handlePasswordSubmit = async () => {
    const { new_password, confirm_password } = userData;

    if (!new_password || !confirm_password) {
      toast.error("Please fill all password fields");
      return;
    }

    if (new_password.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }

    if (new_password !== confirm_password) {
      toast.error("New password and confirm password do not match");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await axios.post('https://www.stacklycloud.com/api/change_password', {
        new_password,
        confirm_password
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      toast.success("Password changed successfully!");
      setShowChangePasswordModal(false);
      setUserData(prev => ({ 
        ...prev, 
        new_password: '', 
        confirm_password: '' 
      }));

      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(error.response?.data?.detail || 'Failed to change password');
    }
  };

  // -------------------------
  // Handle Forgot Password Submit
  // -------------------------
  const handleForgotPassword = async () => {
    if (!forgotEmail) return toast.error("Enter your email");

    try {
      await axios.post("https://www.stacklycloud.com/api/forgot_password", { email: forgotEmail });
      toast.success("Password reset link sent to your email");
      setShowForgotPasswordModal(false);
      setForgotEmail("");

      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to send reset link");
    }
  };

  // -------------------------
  // Loading fallback
  // -------------------------
  if (loading) {
    return (
      <div className="w-full h-32 flex justify-center items-center text-white">
        <div>Loading profile data...</div>
      </div>
    );
  }

  // -------------------------
  // RETURN
  // -------------------------
  return (
    <div className="w-full">
      {/* Main Content Container */}
      <section className="
        /* Mobile - FIXED: Static positioning below mobile menu, no overlapping */
        w-full min-h-0 mt-[190px] p-4 mb-0 mt-0
        /* Tablet: Absolute positioning */
        sm:absolute sm:top-[70px] sm:left-[240px] sm:w-[calc(100vw-260px)] sm:h-[calc(100vh-155px)] sm:mx-0 sm:my-0 sm:p-4 sm:mt-0 sm:max-w-[800px] sm:min-h-0 sm:overflow-y-auto
        /* Desktop: Original positioning */
        lg:absolute lg:top-[20px]  lg:left-[251px] lg:w-[calc(100vw-280px)] lg:h-[490px] lg:p-[24px] lg:max-w-none lg:min-h-0 lg:overflow-visible
        rounded-[8px] border-[1px] border-solid border-[#FFFFFF1F] bg-[#FFFFFF0A] 
        flex flex-col justify-start opacity-100
      ">
        
        {/* Header div */}
        <div className="w-full flex justify-between items-center px-2 mb-4 flex-shrink-0">
          <div className="
            /* Mobile: Smaller header */
            w-fit h-[32px] px-3 py-1
            /* Tablet: Medium header */
            sm:w-[140px] sm:h-[35px] sm:px-[12px] sm:py-[4px]
            /* Desktop: Original size */
            lg:w-[173px] lg:h-[38px] lg:px-[12px] lg:py-[4px]
            rounded-[4px] border-b border-white/40 bg-[#0000004D] 
            flex items-center justify-center opacity-100
          ">
            <div className="
              text-white font-medium
              text-[14px] sm:text-[18px] lg:text-[20px]
              " style={{ lineHeight: '30px', fontFamily: 'Poppins, sans-serif' }}
            >
              My Profile
            </div>
          </div>

          {/* Edit Icon*/}
          {!isEditing && (
            <div
              className="
                w-[28px] h-[28px] sm:w-[30px] sm:h-[30px] lg:w-[32px] lg:h-[32px]
                rounded-full border-[0.5px] border-solid border-[#8A38F533] bg-[#7A1FF133] 
                shadow-[0_0_6px_0_#FFFFFF66] backdrop-blur-[4px] flex items-center justify-center cursor-pointer
              "
              onClick={() => setIsEditing(true)}
            >
              <Edit size={14} className="text-white sm:w-4 sm:h-4 lg:w-4 lg:h-4" />
            </div>
          )}
        </div>

        {/* Content Container */}
        <div className="
          flex flex-col gap-4 flex-1 overflow-visible
          /* Tablet & Desktop: Row layout */
          sm:flex-row sm:gap-6 sm:items-start
          lg:gap-[32px]
        ">
          {/* Profile Image Section  */}
          <div className="
            w-full flex flex-col items-center gap-3
            /* Tablet & Desktop: Side column */
            sm:w-[100px] sm:gap-[16px]
            lg:w-[220px] lg:gap-[20px] lg:-ml-4
          ">
            <div className="relative">
              <div className="
                /* Mobile: Medium image for better visibility */
                w-[80px] h-[80px] border-[#9747FFB2] bg-white
                /* Tablet: Medium image */
                sm:w-[100px] sm:h-[100px] sm:border-[#8A38F5] sm:bg-transparent
                /* Desktop: Large image */
                lg:w-[124px] lg:h-[124px]
                rounded-full overflow-hidden border-[2px] border-solid
              ">
                <img 
                  src={userData.previewImage} 
                  className="w-full h-full object-cover" 
                  alt="Profile" 
                />
              </div>
              {isEditing && (
                <label className="
                  absolute bottom-0 right-0 rounded-full bg-[#8A38F5] flex items-center justify-center cursor-pointer
                  w-[24px] h-[24px] sm:w-[28px] sm:h-[28px] lg:w-[32px] lg:h-[32px]
                ">
                  <Camera size={12} className="text-white sm:w-3 sm:h-3 lg:w-4 lg:h-4" />
                  <input 
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <label className={`
              flex items-center gap-2 text-[13px] sm:text-[14px] text-[#8A38F5] cursor-pointer ${
                !isEditing ? "pointer-events-none opacity-50" : ""
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.232 5.232l3.536 3.536M16.5 3.5a2.121 2.121 0 013 3L7 19H4v-3l12.5-12.5z"
                />
              </svg>
              Change photo
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileChange} 
                disabled={!isEditing}
              />
            </label>
          </div>

          {/* Profile Info Section  */}
          <div className="
            w-full flex flex-col gap-4
            /* Tablet & Desktop: Remaining width - FIXED for 1024px */
            sm:w-[calc(100%-0px)] sm:gap-6
            lg:w-[calc(100%-252px)] lg:max-w-[700px] lg:gap-[24px]
          ">
            {/* Name Fields  */}
            <div className="
              w-full flex flex-col gap-4
              /* Tablet & Desktop: Row layout */
              sm:flex-row sm:gap-4
              lg:gap-6
            ">
              <div className="
                w-full sm:w-1/2 flex flex-col gap-2
              ">
                <label className="text-white font-medium text-[14px] sm:text-[14px] lg:text-[18px]">
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={userData.first_name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="
                    /* Mobile: Full width responsive */
                    w-full h-[40px] rounded-[8px] 
                    /* Tablet: Increased width */
                    sm:w-200px sm:h-[44px] sm:text-[10px] sm:rounded-[10px] sm:max-w-[300px]
                    /* Desktop: Responsive width - FIXED for 1024px */
                    lg:w-full lg:text-[16px] lg:max-w-[321px] lg:h-[48px] lg:rounded-[12px]
                    bg-[#FFFFFF1F] text-white placeholder:text-white/50
                    border-[1px] border-solid border-[#FFFFFF66] focus:border-[#8A38F5] focus:ring-0 focus:outline-none
                    p-3 gap-[10px] opacity-100
                  "
                  placeholder="Enter your first name"
                />
              </div>

              <div className="
                w-full sm:w-1/2 flex flex-col gap-2
              ">
                <label className="text-white font-medium text-[14px] sm:text-[14px] lg:text-[18px]">
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={userData.last_name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="
                    /* Mobile: Full width responsive */
                    w-full h-[40px] rounded-[8px]
                    /* Tablet: Increased width */
                    sm:w-full sm:h-[44px] sm:text-[10px] sm:rounded-[10px] sm:max-w-[300px]
                    /* Desktop: Responsive width - FIXED for 1024px */
                    lg:w-full lg:text-[16px] lg:max-w-[321px] lg:h-[48px] lg:rounded-[12px]
                    bg-[#FFFFFF1F] text-white placeholder:text-white/50
                    border-[1px] border-solid border-[#FFFFFF66] focus:border-[#8A38F5] focus:ring-0 focus:outline-none
                    p-3 gap-[10px] opacity-100
                  "
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            {/* Email and Phone Fields  */}
            <div className="
              w-full flex flex-col gap-4
              /* Tablet & Desktop: Row layout */
              sm:flex-row sm:gap-4
              lg:gap-6
            ">
              <div className="
                w-full sm:w-1/2 flex flex-col gap-2
              ">
                <label className="text-white font-medium text-[14px] sm:text-[14px] lg:text-[18px]">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="
                    /* Mobile: Full width responsive */
                    w-full h-[40px] rounded-[8px] text-[14px]
                    /* Tablet: Increased width */
                    sm:w-full sm:h-[44px] sm:rounded-[10px] sm:text-[9px] sm:max-w-[280px]
                    /* Desktop: Responsive width - FIXED for 1024px with smaller font */
                    lg:w-full lg:text-[16px] lg:max-w-[321px] lg:h-[48px] lg:rounded-[12px] lg:text-[12px]
                    bg-[#FFFFFF1F] text-white placeholder:text-white/50
                    border-[1px] border-solid border-[#FFFFFF66] focus:border-[#8A38F5] focus:ring-0 focus:outline-none
                    p-3 gap-[10px] opacity-100
                  "
                  placeholder="Enter your email address"
                />
              </div>

              <div className="
                w-full sm:w-1/2 flex flex-col gap-2
              ">
                <label className="text-white font-medium text-[14px] sm:text-[14px] lg:text-[18px]">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone_number"
                  value={userData.phone_number}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="
                    /* Mobile: Full width responsive */
                    w-full h-[40px] rounded-[8px]
                    /* Tablet: Increased width */
                    sm:w-full sm:h-[44px] sm:text-[10px] sm:rounded-[10px] sm:max-w-[280px]
                    /* Desktop: Responsive width - FIXED for 1024px */
                    lg:w-full lg:max-w-[321px] lg:h-[48px] lg:rounded-[12px]
                    bg-[#FFFFFF1F] lg:text-[16px] text-white placeholder:text-white/50
                    border-[1px] border-solid border-[#FFFFFF66] focus:border-[#8A38F5] focus:ring-0 focus:outline-none
                    p-3 gap-[10px] opacity-100
                  "
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            {/* Password Section  */}
            <div className="w-full">
              <div className="flex flex-col gap-2 mb-3 sm:flex-row sm:items-center sm:justify-between sm:gap-2 sm:mb-2">
                <label className="text-white font-medium text-[14px] sm:text-[14px] lg:text-[18px]">
                  Password
                </label>
                <button
                  className="
                    rounded-[8px] bg-[#9747FF33] border-[1px] border-solid border-[#9747FF80] text-white
                    /* Mobile: Fixed width on right side - UPDATED */
                    w-[139px] h-[26px] text-[12px] p-[4px] gap-[10px] opacity-100 self-end
                    /* Tablet: Medium size */
                    sm:w-[120px] sm:h-[28px] sm:text-[10px] sm:p-0 sm:self-auto
                    /* Desktop: Large size - FIXED for 1036px */
                    lg:w-[139px] lg:h-[26px] lg:text-[12px] lg:p-0
                    /* 1036px specific: Add more right margin */
                    xl:mr-[20px]
                    hover:bg-[#7A1FF1]
                  "
                  onClick={() => setShowChangePasswordModal(true)}
                >
                  Change Password
                </button>
              </div>

              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  className="
                    /* Mobile: Full width responsive */
                    w-full h-[40px] rounded-[8px]
                    /* Tablet: Full width medium height */
                    sm:w-full sm:h-[44px] sm:rounded-[10px]
                    /* Desktop: Responsive width - FIXED for 1024px */
                    lg:w-full lg:max-w-[682px] lg:text-[16px] lg:h-[48px] lg:rounded-[12px]
                    bg-[#FFFFFF1F] text-white placeholder:text-white/50
                    border-[1px] border-solid border-[#FFFFFF66] focus:border-[#8A38F5] focus:ring-0 focus:outline-none
                    p-3 pr-12 gap-[10px] opacity-100
                  "
                  value="••••••••"
                  readOnly
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="
                    absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors z-10
                    /* Mobile & Tablet: Moved right by 20px */
                    right-[20px]
                    /* Desktop: Moved right by 20px */
                    lg:right-[40px]
                  "
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Save / Cancel Buttons - Now positioned for all screen sizes */}
            {isEditing && (
              <div className="flex justify-end gap-2 mt-4 mr-[20px] lg:mr-[50px] xl:mr-[20px]">
                <button
                  className="px-4 py-2 rounded bg-gray-600 text-white"
                  onClick={handleDiscard}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded bg-[#8A38F5] text-white"
                  onClick={handleSubmit}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Modals - Change Password & Forgot Password */}
        {showChangePasswordModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="
              w-full max-w-md p-6 rounded-[8px] bg-[#1E1E2E] border border-[#FFFFFF1F] 
              shadow-[0_4px_30px_rgba(0,0,0,0.1)] flex flex-col gap-4
            ">
              <div className="flex justify-between items-center">
                <h3 className="
                  text-white font-semibold text-[18px] sm:text-[20px] lg:text-[22px]
                ">
                  Change Password
                </h3>
                <button
                  onClick={() => setShowChangePasswordModal(false)}
                  className="
                    w-[32px] h-[32px] flex items-center justify-center rounded-full
                    bg-[#8A38F5] text-white
                    hover:bg-[#8A38F5CC] transition-all
                  "
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-white font-medium text-[14px] sm:text-[16px] lg:text-[18px]">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="new_password"
                      value={userData.new_password}
                      onChange={handleChange}
                      className="
                        w-full h-[40px] rounded-[4px] bg-[#FFFFFF0D] text-white placeholder:text-white/50
                        border border-transparent focus:border-[#8A38F5] focus:ring-0
                        px-3 pr-10
                      "
                      placeholder="Enter new password"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer">
                      {showNewPassword ? (
                        <EyeOff size={16} className="text-white" onClick={() => setShowNewPassword(false)} />
                      ) : (
                        <Eye size={16} className="text-white" onClick={() => setShowNewPassword(true)} />
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-white font-medium text-[14px] sm:text-[16px] lg:text-[18px]">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirm_password"
                      value={userData.confirm_password}
                      onChange={handleChange}
                      className="
                        w-full h-[40px] rounded-[4px] bg-[#FFFFFF0D] text-white placeholder:text-white/50
                        border border-transparent focus:border-[#8A38F5] focus:ring-0
                        px-3 pr-10
                      "
                      placeholder="Confirm new password"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer">
                      {showConfirmPassword ? (
                        <EyeOff size={16} className="text-white" onClick={() => setShowConfirmPassword(false)} />
                      ) : (
                        <Eye size={16} className="text-white" onClick={() => setShowConfirmPassword(true)} />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePasswordSubmit}
                className="
                  w-full h-[40px] rounded-[4px] bg-[#8A38F5] text-white font-medium
                  flex items-center justify-center gap-2
                  hover:bg-[#8A38F5CC] transition-all
                "
              >
                Save New Password
              </button>
            </div>
          </div>
        )}

        {showForgotPasswordModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="
              w-full max-w-md p-6 rounded-[8px] bg-[#1E1E2E] border border-[#FFFFFF1F] 
              shadow-[0_4px_30px_rgba(0,0,0,0.1)] flex flex-col gap-4
            ">
              <div className="flex justify-between items-center">
                <h3 className="
                  text-white font-semibold text-[18px] sm:text-[20px] lg:text-[22px]
                ">
                  Reset Password
                </h3>
                <button
                  onClick={() => setShowForgotPasswordModal(false)}
                  className="
                    w-[32px] h-[32px] flex items-center justify-center rounded-full
                    bg-[#8A38F5] text-white
                    hover:bg-[#8A38F5CC] transition-all
                  "
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-white font-medium text-[14px] sm:text-[16px] lg:text-[18px]">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="forgot_email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="
                      w-full h-[40px] rounded-[4px] bg-[#FFFFFF0D] text-white placeholder:text-white/50
                      border border-transparent focus:border-[#8A38F5] focus:ring-0
                      px-3
                    "
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              <button
                onClick={handleForgotPassword}
                className="
                  w-full h-[40px] rounded-[4px] bg-[#8A38F5] text-white font-medium
                  flex items-center justify-center gap-2
                  hover:bg-[#8A38F5CC] transition-all
                "
              >
                Send Reset Link
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
