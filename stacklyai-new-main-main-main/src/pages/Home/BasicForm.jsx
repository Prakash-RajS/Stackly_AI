import React, { useState } from "react";
import Upload from "../../assets/home/upload.png";
import UploadIcon from "../../assets/home/Vector.png";
import Group from "../../assets/home/Group.png";
import BgVideo from "../../assets/home/vd.mp4";
import star from "../../assets/home/Big star.png";
import I from "../../assets/home/i.png";
import { Link } from "react-router-dom";

export default function BasicForm() {
  const [showGuide, setShowGuide] = useState(false);

  return (
    <div>
   <section
  className="
    relative w-full h-[580px] px-[40px] py-[80px] 
    flex flex-col justify-center items-center 
    opacity-100 overflow-hidden

    /* Large screens */
    lg:h-[600px] lg:px-[50px] lg:py-[90px]

    /* Medium screens */
    md:h-[540px] md:px-[35px] md:py-[70px]

    /* Small screens */
    sm:h-[480px] sm:px-[30px] sm:py-[60px]

    /* Mobile <441px */
    max-[440px]:h-[500px] max-[440px]:w-full max-[440px]:py-[24px]  
    max-[440px]:px-[20px] max-[440px]:justify-between
  "
>
  {/* Background video */}
  <video
    autoPlay
    loop
    muted
    playsInline
    preload="auto"
    className="absolute top-0 left-0 w-full h-full object-cover -z-10 saturate-50 brightness-90"
  >
    <source src={BgVideo} type="video/mp4" />
  </video>

  <div
    className="
      w-[984px] h-[607px] flex flex-col justify-start items-center gap-[52px]

      /* Large screens */
      lg:w-[850px] lg:h-[550px] lg:gap-[45px]

      /* Medium screens */
      md:w-[720px] md:h-auto md:gap-[40px]

      /* Small screens */
      sm:w-[600px] sm:h-auto sm:gap-[35px]

      /* Mobile <441px */
      max-[440px]:w-[400px] max-[440px]:h-auto max-[440px]:gap-[32px]
    "
  >
    {/* Upload Icon */}
    <div
      className="w-[112px] h-[85.33px] flex items-center justify-center
                 lg:w-[100px] lg:h-[76px]
                 md:w-[90px] md:h-[68px]
                 sm:w-[80px] sm:h-[60px]
                 max-[440px]:w-[70px] max-[440px]:h-[50px]"
    >
      <img src={Upload} alt="upload" className="w-full h-full object-contain" />
    </div>

    {/* Upload text and description */}
    <div
      className="flex flex-col items-center gap-[32px] w-full max-w-[984px]
                 lg:gap-[28px] lg:max-w-[850px]
                 md:gap-[25px] md:max-w-[720px]
                 sm:gap-[24px] sm:max-w-[600px]
                 max-[440px]:gap-[20px] max-[440px]:w-[400px]"
    >
      <div
        className="text-white font-[400] text-[24px] text-center flex items-center justify-center gap-2
                   lg:text-[22px]
                   md:text-[20px]
                   sm:text-[18px]
                   max-[440px]:text-[16px] max-[440px]:leading-[20px]"
      >
        Upload an image
        <div className="relative w-8 h-8 opacity-90 max-[440px]:w-6 max-[440px]:h-6">
          <div
            className="absolute w-5 h-5 top-0 left-0 max-[440px]:w-4 max-[440px]:h-4"
            style={{
              background: "linear-gradient(90deg, #FFFFFF 0%, #8A38F5 100%)",
              WebkitMask: `url(${star}) no-repeat center / contain`,
              mask: `url(${star}) no-repeat center / contain`,
            }}
          />
          <div
            className="absolute w-6 h-6 top-[19px] left-2 max-[440px]:w-5 max-[440px]:h-5 max-[440px]:top-[15px] max-[440px]:left-1.5"
            style={{
              background: "linear-gradient(90deg, #FFFFFF 0%, #8A38F5 100%)",
              WebkitMask: `url(${star}) no-repeat center / contain`,
              mask: `url(${star}) no-repeat center / contain`,
            }}
          />
        </div>
      </div>

      <p
        className="text-white text-[18px] text-center
                   lg:text-[16px] lg:leading-[20px]
                   md:text-[15px] md:leading-[18px]
                   sm:text-[14px] sm:leading-[16px]
                   max-[440px]:text-[13px] max-[440px]:leading-[15px]"
      >
        Drag & drop or click to upload your image.
      </p>

      <p
        className="text-white text-[16px] text-center opacity-60
                   lg:text-[15px] lg:leading-[18px]
                   md:text-[14px] md:leading-[16px]
                   sm:text-[13px] sm:leading-[15px]
                   max-[440px]:text-[12px] max-[440px]:leading-[14px]"
      >
        Allowed formats: PNG, JPEG, JPG (Max size: 5MB)
      </p>
    </div>

    {/* Info Text */}
    <div
      className="w-full h-auto mt-0 flex justify-center items-center px-4 text-center font-[400] text-white text-[16px]
                 lg:mt-4 lg:text-[15px]
                 md:mt-3 md:text-[14px]
                 sm:mt-2 sm:text-[13px]
                 max-[440px]:mt-2 max-[440px]:text-[12px] max-[440px]:leading-5"
    >
<p className="flex items-center justify-center gap-2
              md:whitespace-nowrap md:text-[12px] md:gap-2
              max-[640px]:text-[11px] 
              max-[440px]:flex-wrap max-[440px]:text-[10px] max-[440px]:text-center
              max-[350px]:text-[9px] max-[350px]:leading-4 max-[350px]:flex-wrap max-[350px]:text-center max-[350px]:w-[250px] max-[350px]:break-words">
  <span
    className="text-left leading-snug opacity-60 font-[400] font-inter 
               md:whitespace-nowrap
               max-[640px]:text-[11px] 
               max-[440px]:w-full max-[440px]:text-center max-[440px]:leading-5
               max-[350px]:w-full max-[350px]:text-center max-[350px]:leading-5 max-[350px]:break-words"
    style={{ color: "rgba(255, 255, 255, 0.6)" }}
  >
    Our AI may not preserve watermarks on uploaded images. For best results, we recommend using images without watermarks.
  </span>
</p>


    </div>

    {/* Upload button */}
    <Link to="/Sign-in" className="flex justify-center w-full max-w-[200px]">
      <div
        className="w-full h-[44px] flex justify-center items-center gap-2 text-white
                   text-center font-medium text-[16px] leading-[100%] border border-[#C22CA299] rounded-[30px]
                   px-[30px] py-[10px]
                   lg:h-[42px] lg:text-[15px]
                   md:h-[40px] md:text-[14px]
                   sm:h-[38px] sm:text-[14px]
                   max-[440px]:h-[36px] max-[440px]:text-[13px] max-[440px]:px-4"
        style={{
          background:
            "linear-gradient(95.92deg, rgba(138, 56, 245, 0.5) 15.32%, rgba(194, 44, 162, 0.5) 99.87%)",
        }}
      >
        <span>Upload image</span>
        <img src={UploadIcon} alt="upload" className="w-6 h-6 max-[440px]:w-5 max-[440px]:h-5" />
      </div>
    </Link>

    {/* Photo guide */}
   <div
  className="relative flex w-[143px] h-[36px] rounded-[8px] border-[1.5px] border-solid border-[#C99FFF] px-3 py-2 justify-center items-center gap-[10px]
             cursor-pointer hover:bg-[#C99FFF20] transition-colors duration-200
             max-[440px]:w-[120px] max-[440px]:h-[30px] max-[640px]:whitespace-nowrap"
  onClick={() => setShowGuide(!showGuide)}
  onMouseEnter={() => setShowGuide(true)}
  onMouseLeave={() => setShowGuide(false)}
>
  <img src={I} alt="info" className="w-5 h-5 max-[440px]:w-4 max-[440px]:h-4" />
  <span className="text-white font-medium text-[15px] max-[440px]:text-[13px] max-[640px]:whitespace-nowrap">
    Photo guide
  </span>
</div>


    {/* Modal */}
    {showGuide && (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[320px] bg-[#2A1256] border border-[#C99FFF] rounded-lg p-4 shadow-lg z-10
                      max-[440px]:w-[280px]">
        <h3 className="text-white font-semibold mb-2 text-center text-[16px] max-[440px]:text-[14px]">
          Upload Requirements
        </h3>
        <ul className="text-sm text-white space-y-1 max-[440px]:text-[12px] leading-[150%]">
  <li>• Supported formats: JPG, PNG, WebP</li>
  <li>• Maximum file size: 5MB</li>
  <li>• Resolution: 1024×768px or higher</li>
  <li>• Allowed aspect ratio: 4:3 to 16:9</li>
</ul>
        <div className="mt-3 pt-2 border-t border-[#C99FFF40]">
          <p className="text-xs text-[#C99FFF] text-center max-[440px]:text-[11px]">
            For best results, use well-lit photos without filters
          </p>
        </div>
      </div>
    )}
  </div>
</section>

    </div>
  );
}
