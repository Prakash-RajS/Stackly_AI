import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import center from "../../assets/afterHome/SpaceCenter.png";
import star from "../../assets/afterHome/SpaceStar.png";
import recent from "../../assets/afterHome/SpaceRecent.png";
import colorStar from "../../assets/afterHome/colorStar.png";
import DraggableImages from "../../components/DraggableImages";
import DragSize from "./../../assets/product-pg/dragsize.png";
import Search from "./../../assets/product-pg/search.png";
import Input from "./../../assets/product-pg/input.png";
import Download from "./../../assets/product-pg/download.png";
import { Link } from "react-router-dom";

export default function HeroAfterProducts() {
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [showDraggable, setShowDraggable] = useState(false);
  const [dragData, setDragData] = useState({ left: "", right: "" });
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({ category: null, isFavorite: null });
  const [selectedView, setSelectedView] = useState("Before & After");
  const [selectedRes, setSelectedRes] = useState("Extra Large (4x)");
  const [isDownloadPopupOpen, setIsDownloadPopupOpen] = useState(false);
  const [popupImage, setPopupImage] = useState(null);
  const [popupOriginalImage, setPopupOriginalImage] = useState(null);
  const downloadPopupRef = useRef(null);
  const draggableRef = useRef(null);
  const fullscreenRef = useRef(null);

  const fetchDesigns = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (filter.category) params.category = filter.category;
      if (filter.isFavorite !== null) params.is_favorite = filter.isFavorite;

      const response = await axios.get("https://www.ai.stacklycloud.com/api/designs", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params,
      });
      setDesigns(response.data);
    } catch (error) {
      console.error("Error fetching designs:", error);
      setError("Failed to load designs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesigns();
  }, [filter]);

  useEffect(() => {
    if (showDraggable && draggableRef.current) {
      draggableRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [showDraggable]);

  useEffect(() => {
    if (fullscreenImage && fullscreenRef.current) {
      fullscreenRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [fullscreenImage]);

  useEffect(() => {
    if (isDownloadPopupOpen && downloadPopupRef.current) {
      downloadPopupRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [isDownloadPopupOpen]);

  const handleFullscreen = (image) => {
    setFullscreenImage(image);
  };

  const handleDownload = async (transformedImage, originalImage) => {
    try {
      let imageUrl = transformedImage;
      let width, height;
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");

      const loadImage = (url) =>
        new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "Anonymous";
          img.onload = () => resolve(img);
          img.onerror = () => {
            reject(new Error(`Failed to load image: ${url}`));
          };
          img.src = url;
        });

      const img = await loadImage(transformedImage);
      width = img.width;
      height = img.height;

      let scale = 1;
      if (selectedRes === "Large (2x)") {
        scale = 2;
      } else if (selectedRes === "Extra Large (4x)") {
        scale = 4;
      }

      if (selectedView === "Before & After") {
        const originalImg = await loadImage(originalImage);
        canvas.width = width * 2 * scale;
        canvas.height = height * scale;
        ctx.drawImage(originalImg, 0, 0, width * scale, height * scale);
        ctx.drawImage(img, width * scale, 0, width * scale, height * scale);
      } else {
        if (selectedView === "Only Before") {
          const originalImg = await loadImage(originalImage);
          imageUrl = originalImage;
          width = originalImg.width;
          height = originalImg.height;
          canvas.width = width * scale;
          canvas.height = height * scale;
          ctx.drawImage(originalImg, 0, 0, width * scale, height * scale);
        } else {
          canvas.width = width * scale;
          canvas.height = height * scale;
          ctx.drawImage(img, 0, 0, width * scale, height * scale);
        }
      }

      canvas.toBlob((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `stackly-design-${selectedView.replace(
          / & /g,
          "-"
        )}-${selectedRes.replace(/ /g, "-")}-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      }, "image/png");
    } catch (err) {
      console.error("Download failed:", err);
      alert(
        `Failed to download image: ${err.message}. Please check if the image exists and the server is configured correctly.`
      );
    }
  };

  const handleShow = (leftImg, rightImg) => {
    setDragData({ left: leftImg, right: rightImg });
    setShowDraggable(true);
  };

  const handleFavoriteToggle = async (id, isFavorite) => {
    setDesigns((prevDesigns) => {
      const updated = prevDesigns.map((design) =>
        design.id === id ? { ...design, is_favorite: isFavorite } : design
      );
      if (filter.isFavorite && !isFavorite) {
        return updated.filter((design) => design.id !== id);
      }
      return updated;
    });
    await fetchDesigns();
  };

  const handleFilter = (category = null, isFavorite = null) => {
    setFilter({
      category,
      isFavorite:
        filter.isFavorite === true && isFavorite === true ? null : isFavorite,
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        draggableRef.current &&
        !draggableRef.current.contains(event.target)
      ) {
        setShowDraggable(false);
      }
    };
    if (showDraggable) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDraggable]);

  const baseImageUrl = "https://www.ai.stacklycloud.com/api/";

  const RoomCard = ({
    roomName,
    originalImage,
    transformedImage,
    isFavorite,
    id,
    category,
    onFavoriteToggle,
    handleShow,
    handleDownload,
    handleFullscreen,
  }) => {
    const [showOptions, setShowOptions] = useState(false);
    const [isStarred, setIsStarred] = useState(isFavorite);
    const cardRef = useRef(null);

    useEffect(() => {
      setIsStarred(isFavorite);
    }, [isFavorite]);

    const handleFavoriteToggleLocal = async () => {
      try {
        const response = await axios.patch(
          `https://www.ai.stacklycloud.com/api/designs/${id}/favorite`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setIsStarred(response.data.is_favorite);
        onFavoriteToggle(id, response.data.is_favorite);
      } catch (error) {
        console.error("Error toggling favorite:", error);
      }
    };

    const scrollAndThen = (action) => {
      const card = cardRef.current;
      if (!card) return;
      card.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
      const checkIfCentered = () => {
        const rect = card.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const isCentered =
          rect.top >= viewportHeight * 0.1 &&
          rect.bottom <= viewportHeight * 0.9;
        if (isCentered) {
          action();
        } else {
          requestAnimationFrame(checkIfCentered);
        }
      };
      requestAnimationFrame(checkIfCentered);
    };

    return (
      <div
        ref={cardRef}
        className="w-full max-w-[522px] mx-auto flex flex-col gap-2 sm:gap-3"
      >
        <div className="flex justify-between items-center w-full min-h-[35px] px-2 sm:px-0">
          <div className="text-white text-[12px] sm:text-[14px] font-poppins font-normal leading-[140%]">
            {roomName}
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              className="w-6 h-6 flex items-center justify-center rounded-full border border-[#FFFFFF33] cursor-pointer hover:opacity-80"
              onClick={handleFavoriteToggleLocal}
            >
              <img
                src={isStarred ? colorStar : star}
                alt="star"
                className="w-3 h-[11px] sm:w-[12px] sm:h-[11px]"
              />
            </button>
            <button
              className="w-6 h-6 cursor-pointer hover:opacity-80"
              onClick={() => handleFullscreen(transformedImage)}
            >
              <img src={DragSize} alt="Fullscreen" title="View fullscreen" />
            </button>
          </div>
        </div>
        <div
          className="w-full h-auto rounded-2xl overflow-hidden cursor-pointer"
          onClick={() =>
            scrollAndThen(() => handleFullscreen(transformedImage))
          }
        >
          <DraggableImages
            imageLeft={transformedImage}
            imageRight={originalImage}
          />
        </div>
<div className="w-full min-h-[57px] flex justify-end items-center relative gap-12 max-[640px]:gap-4 ">
  {showOptions && (
    <div
      className="absolute flex justify-between items-center gap-3 sm:gap-4 rounded-lg px-3 sm:px-4 py-2 right-8 max-[640px]:right-4 top-0 w-[280px] sm:w-[calc(100%-2rem)] max-[640px]:w-[230px] max-[640px]:right-[60px] bg-[#1A1A1A] bg-opacity-80"
    >
      <button
        className="flex flex-col justify-center items-center cursor-pointer hover:opacity-80"
        onClick={() =>
          scrollAndThen(() => handleShow(transformedImage, originalImage))
        }
      >
        <img src={Search} alt="Show" className="w-5 h-5 sm:w-6 sm:h-6" />
        <span className="text-[10px] sm:text-[12px] text-white">Show</span>
      </button>

      <button className="flex flex-col justify-center items-center cursor-pointer hover:opacity-80">
        <img src={Input} alt="Input" className="w-5 h-5 sm:w-6 sm:h-6" />
        <span className="text-[10px] sm:text-[12px] text-white">Input</span>
      </button>

      <button
        className="flex flex-col justify-center items-center cursor-pointer hover:opacity-80"
        onClick={() => {
          setPopupImage(transformedImage);
          setPopupOriginalImage(originalImage);
          setIsDownloadPopupOpen(true);
        }}
      >
        <img src={Download} alt="Download" className="w-5 h-5 sm:w-6 sm:h-6" />
        <span className="text-[10px] sm:text-[12px] text-white">Download</span>
      </button>
    </div>
  )}

  <button
    className="w-7 h-7 flex items-center justify-center hover:opacity-80 z-10"
    onClick={() => setShowOptions((prev) => !prev)}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 24 24"
      className="w-5 h-5 sm:w-6 sm:h-6 text-white"
    >
      <circle cx="5" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="19" cy="12" r="2" />
    </svg>
  </button>
</div>

      </div>
    );
  };

  return (
    <section
      className="relative w-full min-h-[600px] bg-black pt-20 pb-10 overflow-auto mt-[-82px]"
    >
      <div className="absolute top-12 sm:top-16 left-4 sm:left-8 flex flex-wrap gap-4 sm:gap-6 z-10 mt-[70px]">
        {["Interiors", "Exteriors", "Outdoors"].map((item) => (
          <a
            key={item}
            href="#"
            className={`relative text-white text-[12px] sm:text-[14px] font-poppins cursor-pointer hover:text-[#BD8AFF] transition-colors
                       ${
                         filter.category === item.toLowerCase()
                           ? "text-[#BD8AFF] after:w-full"
                           : ""
                       }
                       after:content-[''] after:absolute after:left-0 after:bottom-0
                       after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-transparent after:via-[#8A38F5] after:to-transparent
                       after:transition-all after:duration-300 hover:after:w-full`}
            onClick={(e) => {
              e.preventDefault();
              handleFilter(item.toLowerCase(), filter.isFavorite);
            }}
          >
            {item}
          </a>
        ))}
      </div>
      <div className="absolute w-full sm:w-[90%] max-w-[1255px] h-[1px] top-20 sm:top-24 left-1/2 transform -translate-x-1/2 bg-[#FFFFFF80] mt-[72px]"></div>
      <div className="absolute top-24 sm:top-28 right-4 sm:right-8 flex flex-wrap gap-4 sm:gap-6 mt-[70px]">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-6 h-6 flex items-center justify-center rounded-full border border-[#FFFFFF33]">
            <img src={recent} alt="icon" className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <span
            className={`font-poppins text-[12px] sm:text-[14px] leading-[100%] cursor-pointer ${
              filter.isFavorite === null && !filter.category
                ? "text-[#BD8AFF]"
                : "text-white"
            }`}
            onClick={() => handleFilter(null, null)}
          >
            Recent
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-6 h-6 flex items-center justify-center rounded-full border border-[#FFFFFF33]">
            <img
              src={filter.isFavorite ? colorStar : star}
              alt="icon"
              className="w-4 h-4 sm:w-5 sm:h-5"
            />
          </div>
          <span
            className={`font-poppins text-[12px] sm:text-[14px] leading-[100%] cursor-pointer ${
              filter.isFavorite ? "text-[#BD8AFF]" : "text-white"
            }`}
            onClick={() =>
              handleFilter(filter.category, filter.isFavorite ? null : true)
            }
          >
            Starred Image
          </span>
        </div>
      </div>

      {loading ? (
        <div className="relative flex items-center justify-center bg-black/50 min-h-[400px] mt-28 sm:mt-32">
          <p className="text-white text-[14px] sm:text-[16px]">Loading...</p>
        </div>
      ) : error ? (
        <div className="relative flex items-center justify-center bg-black/50 min-h-[400px] mt-28 sm:mt-32">
          <p className="text-white text-[14px] sm:text-[16px]">{error}</p>
        </div>
      ) : designs.length === 0 ? (
        <div className="relative flex items-center justify-center bg-black/50 min-h-[400px] mt-28 sm:mt-32">
          <div className="w-[90%] max-w-[496px] flex flex-col items-center justify-center gap-4 sm:gap-6 rounded-lg bg-[rgba(0,0,0,0.7)] p-4 sm:p-6">
            <div className="w-[200px] sm:w-[318px] h-[200px] sm:h-[318px]">
              <img
                src={center}
                alt="Preview"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="w-full text-center flex flex-col gap-2">
              <p className="text-[14px] sm:text-[16px] font-poppins font-medium text-white leading-[100%]">
                This space is still empty
              </p>
              <p className="text-[12px] sm:text-[14px] font-poppins font-normal text-[#E0E0E0] leading-[120%]">
                Start creating with AI to design a home that reflects your style.
              </p>
            </div>
            <Link to={"/"}>
              <button
                className="w-[200px] sm:w-[236px] h-10 sm:h-11 flex items-center justify-between gap-2 rounded-full px-4 sm:px-6 py-2
                         border border-[#C22CA299] bg-[linear-gradient(95.92deg,rgba(138,56,245,0.5)_15.32%,rgba(194,44,162,0.5)_99.87%)]
                         backdrop-blur-md shadow-[0px_2px_12px_0px_#C22CA240]"
              >
                <span className="text-white font-inter font-medium text-[14px] sm:text-[16px] leading-[100%]">
                  Start creating now
                </span>
                <img src={colorStar} alt="icon" className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-[1214px] mx-auto p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col gap-6 sm:gap-8 mt-28 sm:mt-32">
          <div>
            <div className="w-full text-[#E0E0E0EE] text-[14px] sm:text-[16px] md:text-[18px] font-poppins font-normal leading-[100%] text-center mb-6 sm:mb-8 md:mb-12">
              {filter.isFavorite
                ? "Starred Designs"
                : filter.category
                ? `${
                    filter.category.charAt(0).toUpperCase() +
                    filter.category.slice(1)
                  } Designs`
                : "Recent Designs"}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
              {designs.map((design) => (
                <RoomCard
  key={design.id}
  roomName={new Date(design.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })}
  originalImage={design.uploaded_image}        // FIXED
  transformedImage={design.generated_image}    // FIXED
  isFavorite={design.is_favorite}
  id={design.id}
  category={design.category}
  onFavoriteToggle={handleFavoriteToggle}
  handleShow={handleShow}
  handleDownload={handleDownload}
  handleFullscreen={handleFullscreen}
/>
              ))}
            </div>
          </div>
        </div>
      )}

      {fullscreenImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
          onClick={() => setFullscreenImage(null)}
        >
          <div
            ref={fullscreenRef}
            className="relative w-full max-w-[90vw] sm:max-w-[860px] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={fullscreenImage}
              alt="Fullscreen preview"
              className="w-full max-h-[90vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}

      {showDraggable && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-2 sm:p-4"
          onClick={() => setShowDraggable(false)}
        >
          <div
            ref={draggableRef}
            onClick={(e) => e.stopPropagation()}
            className="w-[95%] max-w-[90vw] sm:max-w-[860px] max-h-[90vh] overflow-hidden bg-white rounded-xl shadow-xl"
          >
            <DraggableImages
              imageRight={dragData.right}
              imageLeft={dragData.left}
            />
          </div>
        </div>
      )}

      {isDownloadPopupOpen && popupImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-2 sm:p-4"
          onClick={() => setIsDownloadPopupOpen(false)}
        >
          <div
            ref={downloadPopupRef}
            className="w-[95%] max-w-[600px] flex flex-col gap-4 rounded-xl p-4 sm:p-6 border border-[#8A38F580] shadow-[0px_0px_12px_0px_#FFFFFF1F]"
            style={{
              background:
                "linear-gradient(112.5deg, rgba(138, 56, 245, 0.15) 6.68%, rgba(194, 44, 162, 0.15) 92.82%)",
              backdropFilter: "blur(30px)",
              WebkitBackdropFilter: "blur(30px)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-white text-[18px] sm:text-[20px] lora-text text-center">
              Download Preferences
            </h2>
            <p className="text-gray-200 text-center poppins-font text-[10px] sm:text-[12px]">
              Choose how you'd like to download your design.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-4 justify-center">
              <div className="flex flex-col gap-3 w-full sm:w-1/2">
                <h3 className="text-white font-medium poppins-font text-[12px] sm:text-[14px]">
                  View Mode
                </h3>
                <div className="flex flex-col gap-2">
                  {["Only Before", "Only After", "Before & After"].map(
                    (mode) => (
                      <button
                        key={mode}
                        onClick={() => setSelectedView(mode)}
                        className={`w-full h-9 flex items-center gap-2 rounded-full border px-3 transition-all duration-200
                        ${
                          selectedView === mode
                            ? "border-purple-500 bg-[linear-gradient(90.94deg,#47138C_-1.44%,#1A013A_94.86%)]"
                            : "border-gray-400 bg-[#F9F9F91A] hover:bg-[linear-gradient(90.94deg,#47138C_-1.44%,#1A013A_94.86%)]"
                        } text-white text-[10px] sm:text-[12px]`}
                      >
                        <span
                          className={`w-4 h-4 border-[1.5px] border-solid rounded-full flex items-center justify-center ${
                            selectedView === mode
                              ? "border-purple-500"
                              : "border-white"
                          }`}
                        >
                          {selectedView === mode && (
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                          )}
                        </span>
                        {mode}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3 w-full sm:w-1/2">
                <h3 className="text-white font-medium poppins-font text-[12px] sm:text-[14px]">
                  Resolution
                </h3>
                <div className="flex flex-col gap-2">
                  {["Standard", "Large (2x)", "Extra Large (4x)"].map((res) => (
                    <button
                      key={res}
                      onClick={() => setSelectedRes(res)}
                      className={`w-full h-9 flex items-center gap-2 rounded-full border px-3 transition-all duration-200
                        ${
                          selectedRes === res
                            ? "border-purple-500 bg-[linear-gradient(90.94deg,#47138C_-1.44%,#1A013A_94.86%)]"
                            : "border-gray-400 bg-[#F9F9F91A] hover:bg-[linear-gradient(90.94deg,#47138C_-1.44%,#1A013A_94.86%)]"
                        } text-white text-[10px] sm:text-[12px]`}
                      >
                        <span
                          className={`w-4 h-4 border-[1.5px] border-solid rounded-full flex items-center justify-center ${
                            selectedRes === res
                              ? "border-purple-500"
                              : "border-white"
                          }`}
                        >
                          {selectedRes === res && (
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                          )}
                        </span>
                        {res}
                      </button>
                    ))
                  }
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mt-4">
              <button
                onClick={() => setIsDownloadPopupOpen(false)}
                className="w-full sm:w-[250px] h-9 flex items-center justify-center gap-2 rounded-full border border-gray-400 bg-[#F9F9F91A] text-white text-[10px] sm:text-[12px]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 42 42"
                >
                  <circle
                    cx="21"
                    cy="21"
                    r="20"
                    stroke="white"
                    strokeWidth="2"
                    fill="none"
                  />
                  <line
                    x1="14"
                    y1="14"
                    x2="28"
                    y2="28"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <line
                    x1="28"
                    y1="14"
                    x2="14"
                    y2="28"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                Cancel
              </button>
              <button
                onClick={() => handleDownload(popupImage, popupOriginalImage)}
                className="w-full sm:w-[250px] h-9 flex items-center justify-center gap-2 rounded-full text-white bg-gradient-to-r from-purple-500 to-pink-500 text-[10px] sm:text-[12px]"
              >
                Download
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="12" y1="4" x2="12" y2="16" strokeLinecap="round" />
                  <polyline
                    points="8,12 12,16 16,12"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <line x1="4" y1="20" x2="20" y2="20" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <p className="text-center text-[10px] sm:text-[12px] text-gray-300 mt-2">
              🔒 Unlock 4K and watermark-free downloads with a premium plan.{" "}
              <span className="text-purple-400 font-semibold cursor-pointer">
                Upgrade Now
              </span>
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
