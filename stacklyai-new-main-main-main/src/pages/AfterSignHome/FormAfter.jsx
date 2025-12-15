import React, { useContext, useRef, useState, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import Interior from "../../assets/product-pg/Vector.png";
import Home from "../../assets/product-pg/home.png";
import Tree from "../../assets/product-pg/tree.png";
import Lock from "../../assets/product-pg/lock.png";
import Galley from "../../assets/product-pg/gallery.png";
import I from "../../assets/product-pg/i.png";
import Magic from "../../assets/product-pg/magic.png";
import axios from "axios";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { FormDataContext } from "../../context/FormDataContext";
import Frame from "../../assets/home/Frame.png";
import CanvasImg from "../../assets/afterHome/CanvasImg.png";
import CanvasUplod from "../../assets/afterHome/CanvasUplod.png";
import Upload from "../../assets/home/upload.png";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const CloseIcon = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'/%3E%3C/svg%3E";
export default function Form({ selectedImage }) {
  const { userInfo } = useContext(UserContext);
  const navigate = useNavigate();
  const inpRef = useRef(null);
  const sliderRef = useRef(null); // Add this ref for the slider
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("Interiors");
  const [imgFile, setImgFile] = useState(null);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [originalImageUrl, setOriginalImageUrl] = useState(null);
  const backendBaseUrl = "https://www.ai.stacklycloud.com/api/";
  const [uploadError, setUploadError] = useState("");
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [strength, setStrength] = useState("LOW");
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [formData, setFormData] = useState({
    roomType: "",
    roomStyle: "",
    numDesigns: "",
    aiStrength: "low",
    houseAngle: "",
    spaceType: "",
  });
  const [imgURL, setImgURL] = useState(null);
  const tabs = [
    { name: "Interiors", icon: Interior },
    { name: "Exteriors", icon: Home },
    { name: "Outdoors", icon: Tree },
  ];
  const roomTypes = {
    Interiors: [
      "classic", "modern", "minimal", "scandinavian", "contemporary",
      "industrial", "japandi", "bohemian", "coastal", "modern luxury",
      "tropical resort", "japanese zen",
    ],
    Exteriors: [
      "classic", "modern", "bohemian", "coastal", "international",
      "elephant", "stone clad", "glass house", "red brick",
      "painted brick", "wood accents", "industrial",
    ],
    Outdoors: [
      "modern", "contemporary", "traditional", "rustic",
      "scandinavian", "classic garden", "coastal outdoor",
      "farmhouse", "cottage garden", "industrial", "beach",
    ],
  };
  const styles = {
    Interiors: [
      "Living room", "Bedroom", "Kitchen", "Home office", "Dining room",
      "Study room", "Family room", "Kid room", "Balcony"
    ],
    Exteriors: ["front side", "back side", "left side", "right side"],
   Outdoors: [
  "front yard", "backyard", "balcony", "terrace/rooftop",
  "driveway/parking", "walkway/path", "lounge", "porch",
  "fence", "garden"
],
  };
const [credits, setCredits] = useState({
  used: 0,
  total: 0
});
useEffect(() => {
  const fetchCredits = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return;
      const response = await axios.get(
        `https://www.ai.stacklycloud.com/api/subscription`,
        {
          params: { userid: userId },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      const data = response.data;
      setCredits({
        used: data.used_credits,
        total: data.total_credits
      });
    } catch (error) {
      console.error("Failed to fetch credits", error);
    }
  };
  fetchCredits();
}, []);
  // Simple scroll functions
  const handleNext = () => {
    if (sliderRef.current) {
      const scrollAmount = 200; // Adjust scroll distance as needed
      sliderRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  const handlePrev = () => {
    if (sliderRef.current) {
      const scrollAmount = 200; // Adjust scroll distance as needed
      sliderRef.current.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  const handleDragOver = (e) => e.preventDefault();
  const changeImage = (e) => {
  const file = e.target.files[0];
  if (file) {
    const fileExt = file.name.toLowerCase().split('.').pop();
    // FORMAT CHECK
    if (!['jpg', 'jpeg', 'png'].includes(fileExt)) {
      const msg = "Only JPG, JPEG, and PNG formats are accepted!";
      toast.error(msg);
      setUploadError(msg);
      return;
    }
    // SIZE CHECK (5MB)
    if (file.size > 5 * 1024 * 1024) {
      const msg = "File size must be less than 5MB.";
      toast.error(msg);
      setUploadError(msg);
      return;
    }
    // If valid → clear error
    setUploadError("");
    setImgFile(file);
    const preview = URL.createObjectURL(file);
    setImgURL(preview);
  }
};
  const handleDrop = (e) => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  if (file) {
    const fileExt = file.name.toLowerCase().split('.').pop();
    // FORMAT CHECK
    if (!['jpg', 'jpeg', 'png'].includes(fileExt)) {
      const msg = "Only JPG, JPEG, and PNG formats are accepted!";
      toast.error(msg);
      setUploadError(msg);
      return;
    }
    // SIZE CHECK
    if (file.size > 5 * 1024 * 1024) {
      const msg = "File size must be less than 5MB.";
      toast.error(msg);
      setUploadError(msg);
      return;
    }
    // Clear error if valid
    setUploadError("");
    setImgFile(file);
    const preview = URL.createObjectURL(file);
    setImgURL(preview);
  }
};
  const handleChange = (value, key) => {
    if (key === "roomType" && activeTab === "Exteriors") {
      setFormData(prev => ({ ...prev, [key]: value }));
    } else {
      setFormData(prev => ({ ...prev, [key]: value.toLowerCase() }));
    }
  };
  const handleTabChange = (tabName) => {
    if (tabName === "Upgrade to Unlock") {
      toast.error("Please upgrade your account to access this feature");
    } else {
      setActiveTab(tabName);
      setFormData({
        roomType: "",
        roomStyle: "",
        numDesigns: "1",
        aiStrength: "low",
        houseAngle: "",
        spaceType: "",
      });
    }
  };
  const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
  });
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setProgress(0);
    if (!imgFile) {
      toast.error("Please upload an image first!");
      setIsLoading(false);
      return;
    }
    if (!formData.roomStyle) {
      toast.error("Kindly select room style.");
      setIsLoading(false);
      return;
    }
    if (!formData.roomType) {
      toast.error("Kindly select room type.");
      setIsLoading(false);
      return;
    }
    if (!formData.aiStrength) {
      toast.error("Kindly select AI strength.");
      setIsLoading(false);
      return;
    }
    if (!formData.numDesigns) {
      toast.error("Kindly select number of designs.");
      setIsLoading(false);
      return;
    }
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 1000);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("image", imgFile);
      formDataToSend.append("design_style", formData.roomStyle);
      formDataToSend.append("ai_strength", formData.aiStrength);
      formDataToSend.append("num_designs", formData.numDesigns.toString());
      let userId = localStorage.getItem("userId");
      if (!userId) {
        try {
          const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
          userId = userInfo?.userId || null;
        } catch {
          userId = null;
        }
      }
      if (!userId) {
        toast.error("User not logged in.");
        setIsLoading(false);
        return;
      }
      formDataToSend.append("user_id", userId);
      let endpoint = "";
      let typeDetail = "";
      switch (activeTab) {
        case "Interiors":
          endpoint = "generate-interior-design";
          formDataToSend.append("room_type", formData.roomType);
          typeDetail = formData.roomType;
          break;
        case "Exteriors":
          endpoint = "generate-exterior-design";
          formDataToSend.append("house_angle", formData.roomType);
          typeDetail = formData.roomType;
          break;
        case "Outdoors":
          endpoint = "generate-outdoor-design";
          formDataToSend.append("space_type", formData.roomType);
          typeDetail = formData.roomType;
          break;
        default:
          throw new Error("Invalid design category selected.");
      }
      const response = await axios.post(
        `https://www.ai.stacklycloud.com/api/api/${endpoint}/`,
        formDataToSend,
        {
          onUploadProgress: (progressEvent) => {
            const uploadPercent = Math.round(
              (progressEvent.loaded * 50) / progressEvent.total
            );
            setProgress(uploadPercent);
          },
        }
      );
      for (let i = 50; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setProgress(i);
      }
      if (response.data.success) {
        const designs = Array.isArray(response.data.designs)
          ? response.data.designs.map((url) => {
              // Extract filename from URL (e.g., from S3 path)
              const filename = url.split('/').pop();
              // Construct proxy URL via backend download endpoint
              const proxyUrl = `${backendBaseUrl}download/${filename}`;
              return {
                url: proxyUrl,
                id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              };
            })
          : [];
        const base64Image = await toBase64(imgFile);
        if (formData.numDesigns === "1") {
          setGeneratedImages(designs);
        } else {
          const navState = {
            originalImage: base64Image,
            uploadedFile: imgFile,
            generatedImages: designs,
            formData: {
              userId: userId,
              category: activeTab.toLowerCase(),
              typeDetail: typeDetail,
              style: formData.roomStyle,
              aiStrength: formData.aiStrength,
              numDesigns: formData.numDesigns,
            },
          };
          localStorage.setItem("imageGenState", JSON.stringify(navState));
          navigate("/ImageGeneration", { state: navState });
        }
      } else {
        throw new Error(response.data.message || "Design generation failed");
      }
    } catch (error) {
      let errorMessage;
      if (error.response?.status === 402) {
        errorMessage = "Your credits over, Please upgrade your plan.";
      } else if (
        error.response?.status === 400 &&
        error.response.data.detail?.includes("Only JPG, JPEG, and PNG")
      ) {
        errorMessage = "Only JPG, JPEG, and PNG formats are accepted.";
      } else {
        errorMessage =
          error.response?.data?.detail ||
          error.response?.data?.message ||
          error.message ||
          "Failed to connect to server";
      }
      toast.error(errorMessage);
    } finally {
      clearInterval(progressInterval);
      setIsLoading(false);
    }
  };

  // Helper to detect image extension from URL
  const getImageExtension = (url) => {
    if (!url) return 'png';
    const match = url.match(/\.(jpeg|jpg|png|gif)$/i);
    return match ? match[1].toLowerCase() : 'png';
  };

  // Updated handleDownload with proxy URL (no CORS issues)
  const handleDownload = async (retries = 3) => {
    if (!currentImageUrl) {
      toast.error('No image to download.');
      return;
    }

    const downloadImage = async (url, attempt = 1) => {
      try {
        const response = await fetch(url, {
          method: 'GET',
          cache: 'no-cache',
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const blob = await response.blob();
        const ext = getImageExtension(url);
        const filename = `stackly-design-${Date.now()}.${ext}`;

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);

        toast.success('Download started!');
      } catch (error) {
        console.error(`Download attempt ${attempt} failed:`, error);

        if (attempt < retries) {
          // Retry on transient failures
          toast.info(`Retrying download... (${attempt}/${retries})`);
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          return downloadImage(url, attempt + 1);
        }

        let userMessage = 'Failed to download image. Please try again.';
        if (error.message.includes('404')) {
          userMessage = 'Image not found. Regenerate and try again.';
        }

        toast.error(userMessage);
      }
    };

    await downloadImage(currentImageUrl);
  };

  useEffect(() => {
    if (generatedImages.length > 0) {
      setCurrentImageUrl(generatedImages[0].url);
    }
  }, [generatedImages]);

  // Optional: Preload image (now via proxy, no CORS)
  useEffect(() => {
    if (generatedImages.length > 0 && currentImageUrl) {
      const img = new Image();
      img.src = currentImageUrl;
      img.onload = () => console.log('Image loaded successfully');
      img.onerror = (e) => console.error('Preview load failed:', e);
    }
  }, [currentImageUrl, generatedImages]);

  useEffect(() => {
    if (selectedImage) {
      setImgURL(selectedImage);
      fetch(selectedImage)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], "previous-image.png", { type: blob.type });
          setImgFile(file);
        })
        .catch(() => {
          console.error("Failed to load selected image.");
        });
    }
  }, [selectedImage]);
  return (
    <section className="w-full min-h-screen bg-black opacity-100 pt-8 md:pt-[82px] overflow-hidden px-4 sm:px-6 lg:px-8 mt-[-82px] ">
      {/* Header */}
<div className="flex flex-col items-center justify-center mt-[122px] md:mt-[75px] gap-4 md:gap-[16px]">
        <h1 className="text-center text-2xl sm:text-[28px] md:text-[34px] font-[400] leading-[100%] text-white lora-text">
          Elevate Your Space with{" "}
          <span
            className="bg-clip-text text-transparent lora-text"
            style={{
              backgroundImage: "linear-gradient(90deg, #8A38F5 0%, #C22CA2 97.12%)",
            }}
          >
            AI
          </span>
        </h1>
        <div className="text-sm sm:text-[16px] md:text-[18px] text-[#6D6D6D] text-center font-poppins font-400 leading-[140%]">
          Upload a photo and let AI create a stunning makeover
        </div>
        <div className="text-xs sm:text-[14px] md:text-[16px] text-white text-center font-poppins font-400 leading-[140%]">
  Free Trial ({credits.total - credits.used} of {credits.total} renders left)
</div>
      </div>
      {/* Tabs */}
      {/* Tab Buttons */}
<div className="w-full max-w-[352px] h-auto flex justify-center gap-4 sm:gap-8 md:gap-[72px] mx-auto mt-8">
  {tabs.map((tab) => (
    <div
      key={tab.name}
      className="flex-1 h-auto flex flex-col gap-2 opacity-100 cursor-pointer items-center"
      onClick={() => handleTabChange(tab.name)}
    >
      <div
        className={`w-12 h-12 sm:w-14 sm:h-14 md:w-[52px] md:h-[52px] rounded-full border-2 flex items-center justify-center transition-all ${
          activeTab === tab.name
            ? "border-white bg-gradient-to-l from-[#7A1FF133] to-[#8120FF] shadow-[0_0_8px_#8A38F580]"
            : "border-[#8A38F533] bg-[#8A38F533] hover:border-blue-300"
        }`}
      >
        <img
          src={tab.icon}
          alt={tab.name}
          className="w-6 h-4 sm:w-7 sm:h-5 md:w-[26px] md:h-[19px] object-contain"
        />
      </div>
      <p className="text-white font-[500] font-poppins text-xs sm:text-sm md:text-[16px] text-center">
        {tab.name}
      </p>
    </div>
  ))}
</div>
{/* Styles List */}
<div className="w-full max-w-6xl mx-auto mt-8 md:mt-10">
  <div className="relative flex items-center justify-center gap-4">
    {/* Previous Button */}
    <button
      className="flex items-center justify-center rounded-full transition flex-shrink-0 hover:scale-105 active:scale-95"
      onClick={handlePrev}
      style={{
        width: "32px",
        height: "32px",
        borderRadius: "40px",
        border: "1px solid #6f558bff",
        background: "#7A1FF133",
        boxShadow: "0px 0px 8px 0px #8A38F51F",
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{ width: "12px", height: "12px" }}>
        <path d="M15 5l-7 7 7 7" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
    {/* Centered & Scrollable List - Fixed alignment */}
    <div className="flex-1 overflow-hidden flex justify-center">
      <div
        key={activeTab}
        ref={sliderRef}
        className="flex items-center gap-2 md:gap-4 overflow-x-auto py-2 scroll-smooth hide-scrollbar px-3"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {styles[activeTab]?.map((style) => (
          <span
            key={style}
            className={`text-white text-xs sm:text-sm cursor-pointer px-3 sm:px-4 py-1 sm:py-2 rounded-full whitespace-nowrap flex-shrink-0 transition-all hover:scale-105 ${
              formData.roomType === style.toLowerCase()
                ? "bg-white/10 border-white"
                : "bg-[#0B0B0B] border-[#6D6D6D]"
            }`}
            style={{ border: "1px solid" }}
            onClick={() => handleChange(style.toLowerCase(), "roomType")}
          >
            {style}
          </span>
        ))}
      </div>
    </div>
    {/* Next Button */}
    <button
      className="flex items-center justify-center rounded-full transition flex-shrink-0 hover:scale-105 active:scale-95"
      onClick={handleNext}
      style={{
        width: "32px",
        height: "32px",
        borderRadius: "40px",
        border: "1px solid #FFFFFF",
        background: "#7A1FF133",
        boxShadow: "0px 0px 8px 0px #8A38F51F",
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style={{ width: "12px", height: "12px" }}>
        <path d="M9 5l7 7-7 7" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  </div>
</div>
      {/* Main Content Grid */}
      <div className="w-full max-w-7xl mx-auto mt-8 md:mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
       
        {/* Left Column - Upload and Form */}
        <div className="space-y-6">
          {/* Upload Box */}
          <div className="w-full">
            <div className="text-white font-poppins font-medium text-sm sm:text-[16px] leading-[140%] mb-3">
              Upload Image
            </div>
            <div
              className="w-full aspect-video max-h-[400px] flex justify-center items-center cursor-pointer relative rounded-lg border-2 border-dashed border-[#6D6D6D] bg-[#6D6D6D1A]"
              onClick={() => inpRef.current.click()}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {imgURL ? (
                <>
                  {!isImageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#FFFFFF1A] rounded-xl">
                      <p className="text-[#FFFFFFB2]">Loading image...</p>
                    </div>
                  )}
                  <div className="cursor-default relative h-full w-full flex justify-center items-center rounded-xl p-4">
                    <div className="relative h-full w-full flex justify-center items-center rounded-xl overflow-hidden">
                      <img
                        src={imgURL}
                        alt="Preview"
                        className={`max-w-full max-h-full object-contain ${isImageLoaded ? "block" : "hidden"}`}
                        onLoad={() => setIsImageLoaded(true)}
                        onError={() => setIsImageLoaded(false)}
                      />
                    </div>
                    <svg
                      onClick={(e) => {
                        e.stopPropagation();
                        setImgURL(null);
                        setIsImageLoaded(false);
                      }}
                      className="absolute p-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-black/70 fill-white top-2 right-2 sm:top-3 sm:right-3 cursor-pointer hover:bg-black/90 transition-colors"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 -960 960 960"
                    >
                      <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                    </svg>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-3 p-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 flex justify-center items-center">
                    <img
                      src={Upload}
                      alt="gallery"
                      className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                    />
                  </div>
                  <p className="text-white/70 text-center font-poppins font-normal text-sm sm:text-[16px] leading-[140%] max-w-[200px] sm:max-w-none">
  Drag & drop or click to upload a photo
</p>
<p className="text-white/50 text-center font-poppins font-light text-[12px] sm:text-sm mt-1 leading-[140%]">
  Only .jpg, .jpeg, .png formats are accepted (Max size: 5MB)
</p>
{uploadError && (
    <p className="text-red-400 text-center font-poppins text-xs sm:text-sm mt-2">
      {uploadError}
    </p>
  )}
                </div>
              )}
              <input
                type="file"
                name="image"
                ref={inpRef}
                onChange={changeImage}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Room Style and Number of Designs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {/* Room Style */}
              <div className="space-y-2">
                <label className="text-white text-sm sm:text-[16px] font-poppins font-normal leading-[140%]">
                  {activeTab === "Interiors"
                    ? "Select Room Style"
                    : activeTab === "Exteriors"
                      ? "Select Style"
                      : "Select Space"}
                </label>
                <div className="relative">
                  <select
                    name="roomType"
                    value={formData.roomStyle}
                    onChange={(e) => handleChange(e.target.value, "roomStyle")}
                    className="w-full h-10 sm:h-[42px] rounded bg-[#781EED33] text-white cursor-pointer px-3 sm:px-4 pr-8 sm:pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-[#781EED]"
                    required
                  >
                    <option value="" className="text-black">Select Room Style</option>
                    {roomTypes[activeTab].map((room) => (
                      <option key={room} value={room.toLowerCase()} className="text-black">
                        {room}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3">
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              {/* Number of Designs */}
              <div className="space-y-2">
                <label className="text-white text-sm sm:text-[16px] font-poppins font-normal leading-[140%]">
                  Number of Designs
                </label>
                <div className="relative">
                  <select
                    name="numDesigns"
                    value={formData.numDesigns}
                    onChange={(e) => handleChange(e.target.value, "numDesigns")}
                    className="w-full h-10 sm:h-[42px] rounded bg-[#781EED33] text-white cursor-pointer px-3 sm:px-4 pr-8 sm:pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-[#781EED]"
                    required
                  >
                    <option value="" className="text-black">Number of designs</option>
                    {[...Array(4).keys()].map((num) => (
                      <option key={num + 1} value={num + 1} className="text-black">
                        {num + 1}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3">
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            {/* AI Strength */}
            <div className="space-y-4">
              <label className="text-white text-sm sm:text-[16px] font-poppins font-normal leading-[140%]">
                AI Styling Strength
              </label>
              <div className="space-y-3">
                <div className="relative w-full h-2 rounded-[16px] bg-[#6D6D6D33]">
                  <div
                    className={`absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gradient-to-tr from-[#8A38F5] to-[#C22CA2] flex items-center justify-center transition-all duration-500 ${
                      formData.aiStrength === "low"
                        ? "left-0"
                        : formData.aiStrength === "medium"
                        ? "left-1/2 -translate-x-1/2"
                        : "right-0"
                    }`}
                  >
                    <img
                      src={Frame}
                      alt="icon"
                      className="w-3 h-3 border border-white rounded-[2px]"
                    />
                  </div>
                </div>
                <div className="flex justify-between w-full">
                  {["Low", "Medium", "High"].map((level) => (
                    <span
                      key={level}
                      className={`text-white text-xs sm:text-sm cursor-pointer ${
                        formData.aiStrength === level.toLowerCase() ? "font-semibold" : "font-normal"
                      }`}
                      onClick={() => handleChange(level.toLowerCase(), "aiStrength")}
                    >
                      {level}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            {/* Create Magic Button */}
            <button
              type="submit"
              className="w-full h-12 sm:h-[44px] flex items-center justify-center gap-2 rounded-[30px] border border-white/50 bg-gradient-to-r from-[rgba(138,56,245,0.5)] to-[rgba(194,44,162,0.5)] text-white font-poppins font-normal text-sm sm:text-[16px] leading-[100%] hover:opacity-90 transition mt-4"
            >
              <span>Create magic</span>
              <img src={Frame} alt="icon" className="w-5 h-5 sm:w-6 sm:h-6 opacity-100" />
            </button>
          </form>
        </div>
        {/* Right Column - Generated Image */}
        <div className="space-y-4 md:space-y-6">
          <div className="text-white font-poppins font-medium text-sm sm:text-[16px] leading-[140%]">
            Generated Image
          </div>
          <div className="w-full aspect-video max-h-[400px] rounded-lg border border-dashed border-[#6D6D6D] bg-[#6D6D6D1A] relative">
            <div className="w-full h-full rounded-lg relative flex items-center justify-center overflow-hidden p-4">
              {generatedImages.length > 0 ? (
                <img
                  src={generatedImages[0].url}
                  alt="Generated"
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              ) : (
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/10 flex items-center justify-center">
                  <img src={CanvasImg} alt="Canvas" className="w-6 h-6 sm:w-7 sm:h-7 object-contain" />
                </div>
              )}
              {isLoading && (
                <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center rounded-xl">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-3 sm:mb-4">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#FFFFFF20" strokeWidth="8" />
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" strokeDasharray="283" strokeDashoffset={283 - (283 * progress) / 100} transform="rotate(-90 50 50)" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white text-lg sm:text-xl font-bold">{progress}%</span>
                    </div>
                  </div>
                  <p className="text-white text-sm sm:text-lg text-center px-4">
                    {progress < 100 ? "Rendering..." : "Finalizing designs..."}
                  </p>
                </div>
              )}
            </div>
          </div>
          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full h-12 sm:h-[44px] rounded-[30px] border border-[#C22CA299] flex items-center justify-center gap-2 px-4 py-2 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:brightness-110"
              style={{
                background: "linear-gradient(95.92deg, rgba(138, 56, 245, 0.5) 15.32%, rgba(194, 44, 162, 0.5) 99.87%)",
              }}
            >
              <span className="text-white text-sm sm:text-[16px] font-poppins font-normal leading-[100%]">
                Create Again
              </span>
              <img src={Frame} alt="Frame Icon" className="w-5 h-5 sm:w-6 sm:h-6 object-contain" />
            </button>
            <button
              type="button"
              onClick={handleDownload}
              disabled={!currentImageUrl}
              className="w-full h-12 sm:h-[44px] rounded-[30px] border border-[#8A38F5] flex items-center justify-center gap-2 px-4 py-2 bg-[#8A38F580] group relative overflow-hidden transition-all duration-300 hover:bg-gradient-to-r hover:from-[#8A38F5] hover:to-[#C22CA2] hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#8A38F580]"
            >
              <span className="text-white text-sm sm:text-[16px] font-poppins font-normal leading-[100%] transition-colors duration-300 z-[10]">
                Download
              </span>
              <img src={CanvasUplod} alt="Frame Icon" className="w-5 h-5 sm:w-6 sm:h-6 object-contain z-[10]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}