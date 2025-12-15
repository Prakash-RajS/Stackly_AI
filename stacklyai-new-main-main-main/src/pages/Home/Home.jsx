import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Link, useNavigate } from "react-router-dom";

// Components
import Form from "./Form";
import GalleryHover from "../../components/GalleryHover";
import { useAnimation } from "../../components/AnimatedDesignSection";
import FAQ from "./FAQ";
import HeroBanner from "./HeroBanner";
import DraggableImageSection from "./DraggableImageSection";
import ImageSlider from "./ImageSlider";
import StepsHome from "./StepsHome";
import BasicForm from "./BasicForm";

// Section Images
import sec3Pattern1 from "../../assets/home/sec3/arcticons_ai-chat-alt-1.png";
import sec3Pattern2 from "../../assets/home/sec3/arcticons_ai-chat-alt-2.png";
import sec3Pattern3 from "../../assets/home/sec3/material-icon-theme_gemini-ai.png";
import sec3Pattern4 from "../../assets/home/sec3/material-icon-theme_gemini-ai(1).png";
import sec3Design1 from "../../assets/home/sec3/design1.jpeg";
import sec3Design2 from "../../assets/home/sec3/design2.jpeg";
import sec3Design3 from "../../assets/home/sec3/design3.jpeg";
import sec3bg1 from "../../assets/home/sec3/Threefeatures.jpg";

import sec4Icon1 from "../../assets/home/sec4/1.png";
import sec4Icon2 from "../../assets/home/sec4/2.png";
import sec4Icon3 from "../../assets/home/sec4/3.png";
import sec4Icon4 from "../../assets/home/sec4/4.png";
import Frame from "../../assets/home/Frame.png";

import sec5BlockImg from "../../assets/home/sec5/Frame 182.png";
import sec5Frame1 from "../../assets/home/sec5/Frame 175.png";
import sec5Frame2 from "../../assets/home/sec5/Frame 176.png";
import sec5Frame3 from "../../assets/home/sec5/Frame 177.png";
import sec5Frame4 from "../../assets/home/sec5/Frame 178.png";
import sec5Frame5 from "../../assets/home/sec5/Frame 181.png";
import sec5Frame6 from "../../assets/home/sec5/Frame 180.png";
import sec5Frame7 from "../../assets/home/sec5/Frame 183.png";
import sec5Frame8 from "../../assets/home/sec5/Frame 184.png";

import img1 from "../../assets/home/sec6/1.png";
import img2 from "../../assets/home/sec6/2.png";
import img3 from "../../assets/home/sec6/3.png";
import img4 from "../../assets/home/sec6/4.png";
import img5 from "../../assets/home/sec6/1 (1).png";
import user6 from "../../assets/home/sec6/2 (1).png";
import user7 from "../../assets/home/sec6/3 (1).png";
import user8 from "../../assets/home/sec6/4 (1).png";
import sec6Logo from "../../assets/home/sec6/Logo.png";

import sec9Frame from "../../assets/home/sec9/Frame 168.png";

import sec10Img1 from "../../assets/home/sec10/3d-interior-design-free-png 1.png";
import sec10Img2 from "../../assets/home/sec10/3d-interior-design-png 1.png";

import sec13Img1 from "../../assets/home/sec13/img1.jpg";
import sec13Img2 from "../../assets/home/sec13/img2.jpg";

import sec14Img2 from "../../assets/home/sec14/Vector.png";
import sec14Img3 from "../../assets/home/sec14/m3.jpg";
import sec14Img4 from "../../assets/home/sec14/m1.jpg";
import sec14Img5 from "../../assets/home/sec14/m2.jpg";

import DotFrame from "../../assets/home/DotFrame.png";
import NewFrame from "../../assets/home/nsec3/image2.png";
import NewFrame2 from "../../assets/home/nsec3/image1.png";
import NewFrame3 from "../../assets/home/nsec3/image3.png";
import NewFrame4 from "../../assets/home/nsec3/image4.png";
import NewFrame5 from "../../assets/home/nsec3/image5.png";
import NewFrame6 from "../../assets/home/nsec3/image6.png";
import Group from "../../assets/home/nsec3/StarGroup.png";
import vector from "../../assets/home/nsec3/vector.png";
import star from "../../assets/home/Big star.png";
import Star from "../../assets/home/stars.png";
import Reacts from "../../assets/home/react.png";
import Magic from "../../assets/product-pg/magic.png";
import Line from "../../assets/home/Sideline.png";
import BgVideo2 from "../../assets/home/vd2.mp4";
import Bfooter from "../../assets/home/footer.png";

export default function Home() {
  const { sectionRef, animations } = useAnimation();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.1 });

  const counter45Ref = useRef(null);
  const counter100Ref = useRef(null);
  const hasAnimated = useRef(false);
  const lastTriggered = useRef(0);
  const [isHovering1, setIsHovering1] = useState(false);
  const [isHovering2, setIsHovering2] = useState(false);
  const [currentImage1, setCurrentImage1] = useState(0);
  const [currentImage2, setCurrentImage2] = useState(0);
  const [ref1, inView1] = useInView({ threshold: 0.1 });
  const [ref2, inView2] = useInView({ threshold: 0.1 });
  const [showFull, setShowFull] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // NEW: Explore more click tracking state
  const [exploreMoreClicks, setExploreMoreClicks] = useState(0);
  const navigate = useNavigate();

  // Refs for intervals
  const intervalRef1 = useRef(null);
  const intervalRef2 = useRef(null);

  // Text content for different design styles
  const designStyles = [
    {
      heading: "Minimal Style",
      description: "Step into a space where less truly becomes more. Our AI blends clean lines, soft tones, and thoughtful spacing to create interiors that feel light, breathable, and beautifully uncluttered. Designed to inspire calm, focus, and modern sophistication without lifting a finger."
    },
    {
      heading: "Modern Style",
      description: "Experience contemporary elegance with sleek furniture, innovative materials, and smart technology integration. Our AI creates spaces that are both functional and aesthetically pleasing for modern living."
    },
    {
      heading: "Classic Style",
      description: "Timeless beauty meets modern comfort. Traditional elements, rich textures, and elegant proportions create spaces that feel both luxurious and inviting for generations to come."
    }
  ];

  const [currentStyleIndex, setCurrentStyleIndex] = useState(0);

  const faqs = [
    {
      question: "Is Stackly AI suitable for beginners?",
      answer: "Yes, Stackly AI has a beginner-friendly interface.",
      related: [
        {
          question: "How does Stackly AI work?",
          answer: "Stackly AI uses advanced algorithms to automate tasks efficiently.",
        },
        {
          question: "What technologies does Stackly use?",
          answer: "It uses React, Node.js, and AI/ML models under the hood.",
        },
      ],
    },
    {
      question: "Is there a free version available?",
      answer: "Yes, Stackly AI offers a free trial with limited features.",
      related: [
        {
          question: "How long does the free trial last?",
          answer: "The free trial lasts for 14 days from the signup date.",
        },
        {
          question: "Can I upgrade during the trial?",
          answer: "Yes, you can upgrade anytime via your account settings.",
        },
      ],
    },
    {
      question: "How do I contact Stackly AI?",
      answer: "You can reach out to Stackly AI by sending an email to support@stackly.ai or by filling out the contact form on our website's Contact Us page. We're here to help with any questions, feedback, or support you may need.",
      related: [
        {
          question: "Does Stackly AI support API access?",
          answer: "Yes, Stackly AI provides API documentation for developers.",
        },
        {
          question: "Can I sync Stackly with my CRM?",
          answer: "Absolutely, CRM integration is available in the pro plan.",
        },
      ],
    },
    {
      question: "Is customer support available?",
      answer: "Yes, 24/7 customer support is available via chat and email.",
      related: [
        {
          question: "Is live chat support available?",
          answer: "Yes, you can chat with support directly through the dashboard.",
        },
        {
          question: "Where can I raise a ticket?",
          answer: "Go to the 'Help' section and click 'Raise a Ticket'.",
        },
      ],
    },
  ];

  const mobileCards = [
    {
      id: 1,
      name: "Guru Ragav Auditor",
      role: "Auditor",
      image: sec14Img3,
      quote: "I use Stackly AI to help my clients visualize how their backyard could look like if they hire me for the job. It works flawlessly!."
    },
    {
      id: 2,
      name: "Cristian Rama",
      role: "Architect",
      image: sec14Img4,
      quote: "I needed to replace my living room furniture so I generated a few design ideas with Stackly AI. I picked my favorite, sent it to the furniture maker and now I have it in real life. Awesome technology!"
    },
    {
      id: 3,
      name: "Ram Krishnan",
      role: "Architect",
      image: sec14Img5,
      quote: "I run a real estate agency and a lot of my clients send me pictures with their empty properties. I use Stackly AI to furnish them automatically. It has become an indispensable tool for us."
    }
  ];

  const images1 = [NewFrame, NewFrame3, NewFrame4];
  const images2 = [NewFrame2, NewFrame5, NewFrame6];

  // Text animation variants
  const textVariants = {
    hidden: { 
      opacity: 0, 
      y: 20 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.4,
        ease: "easeIn"
      }
    }
  };

  // NEW: Function to handle Explore More button click with click tracking
  const handleExploreMoreClick = () => {
    const newClickCount = exploreMoreClicks + 1;
    setExploreMoreClicks(newClickCount);

    if (newClickCount >= 4) {
      // Redirect to signin page on 4th click
      navigate('/sign-in');
    } else {
      // Normal functionality for first 3 clicks
      setCurrentStyleIndex((prev) => (prev + 1) % designStyles.length);
      setCurrentImage1((prev) => (prev + 1) % images1.length);
      
      setTimeout(() => {
        setCurrentImage2((prev) => (prev + 1) % images2.length);
      }, 150);


    }
  };

  // NEW: Auto-reset click counter after 10 seconds of inactivity
  useEffect(() => {
    const timer = setTimeout(() => {
      if (exploreMoreClicks > 0 && exploreMoreClicks < 4) {
        setExploreMoreClicks(0);
        console.log('Click counter reset');
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [exploreMoreClicks]);

  useEffect(() => {
    if (isHovering1) {
      if (intervalRef1.current) clearInterval(intervalRef1.current);
      
      intervalRef1.current = setInterval(() => {
        setCurrentImage1((prev) => (prev + 1) % images1.length);
      }, 500);
    } else {
      if (intervalRef1.current) {
        clearInterval(intervalRef1.current);
        intervalRef1.current = null;
      }
    }

    // Cleanup on unmount
    return () => {
      if (intervalRef1.current) {
        clearInterval(intervalRef1.current);
      }
    };
  }, [isHovering1]);

  // Image cycling for second div on hover - ALWAYS WORK
  useEffect(() => {
    if (isHovering2) {
      if (intervalRef2.current) clearInterval(intervalRef2.current);
      
      intervalRef2.current = setInterval(() => {
        setCurrentImage2((prev) => (prev + 1) % images2.length);
      }, 500);
    } else {
      if (intervalRef2.current) {
        clearInterval(intervalRef2.current);
        intervalRef2.current = null;
      }
    }

    // Cleanup on unmount
    return () => {
      if (intervalRef2.current) {
        clearInterval(intervalRef2.current);
      }
    };
  }, [isHovering2]);

  const handleMouseEnter1 = () => {
    setIsHovering1(true);
  };

  const handleMouseLeave1 = () => {
    setIsHovering1(false);
  };

  const handleMouseEnter2 = () => {
    setIsHovering2(true);
  };

  const handleMouseLeave2 = () => {
    setIsHovering2(false);
  };

  const nextCard = () => {
    setCurrentCardIndex((prev) => (prev === mobileCards.length - 1 ? 0 : prev + 1));
  };

  const prevCard = () => {
    setCurrentCardIndex((prev) => (prev === 0 ? mobileCards.length - 1 : prev - 1));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  // Image transition variants for smooth animation
  const imageVariants = {
    enter: {
      opacity: 0,
      scale: 0.9,
    },
    center: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 1.1,
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    }
  };

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const [ref4, inView4] = useInView({ threshold: 0.1 });

  const animateCounter = (ref, target) => {
    let start = 0;
    const duration = 1000;
    const increment = target / (duration / 16);

    const step = () => {
      start += increment;
      if (start >= target) {
        ref.current.textContent = `${target}+`;
      } else {
        ref.current.textContent = `${Math.floor(start)}+`;
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  useEffect(() => {
    if (inView4) {
      const now = Date.now();
      if (now - lastTriggered.current > 3000) { 
        animateCounter(counter45Ref, 45);
        animateCounter(counter100Ref, 100);
        lastTriggered.current = now;
      }
    }
  }, [inView4]);

  // Detect screen width
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fullText = `Experience interior design that speaks for itself. Our tailored AI-powered solutions have
  consistently delighted clients around the world bringing unique styles, functional layouts,
  and beautiful results to every space. From modern minimalism to timeless elegance, we deliver
  designs that truly feel like home.`;

  const shortText = `Experience interior design that speaks for itself. Our tailored AI-powered solutions have
  consistently delighted clients around the world...`;
  return (
    <div>
      {/* banner  */}

      <HeroBanner />

  

{/* new figma disgine sec2 */}
  <section className="w-full h-[857px] rotate-0 opacity-100 bg-[#000000] relative overflow-hidden
                    max-[1380px]:h-[720px]
                    max-[1280px]:h-[680px]
                    max-[1024px]:h-[600px]
                    max-[768px]:h-[450px]
                    max-[400px]:h-[350px]">
      
      {/* DotFrame image */}
      <img
        src={DotFrame}
        alt="Dot Frame"
        className="w-[800px] h-[163px] absolute top-[62px] left-[-367px]
                 max-[1380px]:w-[650px] max-[1380px]:h-[140px] max-[1380px]:top-[50px] max-[1380px]:left-[-300px]
                 max-[1280px]:w-[650px] max-[1280px]:h-[130px] max-[1280px]:top-[48px] max-[1280px]:left-[-250px]
                 max-[1024px]:w-[410px] max-[1024px]:h-[100px] max-[1024px]:top-[40px] max-[1024px]:left-[-150px]
                 max-[768px]:w-[280px] max-[768px]:h-[80px] max-[768px]:top-[30px] max-[768px]:left-[-100px]
                 max-[640px]:w-[200px] max-[640px]:h-[60px] max-[640px]:top-[20px] max-[640px]:left-[-60px]
                 max-[400px]:w-[150px] max-[400px]:h-[45px] max-[400px]:top-[15px] max-[400px]:left-[-40px]"
      />

      {/* Hoverable frames */}
      <div className="relative w-full h-[800px] overflow-hidden">
        {/* FIRST IMAGE DIV */}
        <motion.div
          ref={ref1}
          initial={{ y: 100, opacity: 0 }}
          animate={inView1 ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`absolute top-[95px] left-[319px] w-[325px] h-[381px] 
                     max-[1380px]:top-[80px] max-[1380px]:left-[250px] max-[1380px]:w-[280px] max-[1380px]:h-[330px]
                     max-[1280px]:top-[75px] max-[1280px]:left-[200px] max-[1280px]:w-[260px] max-[1280px]:h-[310px]
                     max-[1024px]:top-[60px] max-[1024px]:left-[150px] max-[1024px]:w-[220px] max-[1024px]:h-[250px]
                     max-[768px]:top-[50px] max-[768px]:left-[100px] max-[768px]:w-[180px] max-[768px]:h-[200px]
                     max-[640px]:top-[40px] max-[640px]:left-[60px] max-[640px]:w-[130px] max-[640px]:h-[165px]
                     max-[400px]:top-[30px] max-[400px]:left-[40px] max-[400px]:w-[100px] max-[400px]:h-[110px]
                     transition-all duration-300 ease-in-out
                     ${isHovering1 ? 'z-20 shadow-2xl shadow-purple-500/50' : 'z-10 shadow-lg shadow-purple-500/30'} 
                     ${isHovering2 ? 'filter blur-[2px]' : ''}`}
          onMouseEnter={handleMouseEnter1}
          onMouseLeave={handleMouseLeave1}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-700/60 to-pink-600/10 backdrop-blur-sm transition-all duration-500 ease-in-out" />

          <div className="relative w-full h-full overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img
                key={`image1-${currentImage1}`}
                src={images1[currentImage1]}
                alt={`Frame ${currentImage1 + 1}`}
                className="w-full h-full object-cover absolute top-0 left-0"
                variants={imageVariants}
                initial="enter"
                animate="center"
                exit="exit"
              />
            </AnimatePresence>
          </div>
        </motion.div>

        {/* SECOND IMAGE DIV */}
        <motion.div
          ref={ref2}
          initial={{ y: 100, opacity: 0 }}
          animate={inView2 ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
          className={`absolute top-[350px] left-[105px] w-[325px] h-[381px] 
                     max-[1380px]:top-[300px] max-[1380px]:left-[80px] max-[1380px]:w-[280px] max-[1380px]:h-[330px]
                     max-[1280px]:top-[280px] max-[1280px]:left-[60px] max-[1280px]:w-[260px] max-[1280px]:h-[310px]
                     max-[1024px]:top-[260px] max-[1024px]:left-[40px] max-[1024px]:w-[220px] max-[1024px]:h-[250px]
                     max-[768px]:top-[200px] max-[768px]:left-[57px] max-[768px]:w-[180px] max-[768px]:h-[200px]
                     max-[640px]:top-[160px] max-[640px]:left-[30px] max-[640px]:w-[130px] max-[640px]:h-[165px]
                     max-[400px]:top-[100px] max-[400px]:left-[20px] max-[400px]:w-[100px] max-[400px]:h-[110px]
                     transition-all duration-300 ease-in-out
                     ${isHovering2 ? 'z-20 shadow-2xl shadow-purple-500/50' : 'z-10 shadow-lg shadow-purple-500/30'} 
                     ${isHovering1 ? 'filter blur-[2px]' : ''}`}
          onMouseEnter={handleMouseEnter2}
          onMouseLeave={handleMouseLeave2}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-700/60 to-pink-600/10 backdrop-blur-sm transition-all duration-500 ease-in-out" />
          <div className="relative w-full h-full overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img
                key={`image2-${currentImage2}`}
                src={images2[currentImage2]}
                alt={`Frame ${currentImage2 + 1}`}
                className="w-full h-full object-cover absolute top-0 left-0"
                variants={imageVariants}
                initial="enter"
                animate="center"
                exit="exit"
              />
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Text container */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={inView1 ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="absolute top-[158px] left-[752px] w-[488px] h-[152px] flex flex-col gap-[12px] opacity-100
                 max-[1380px]:top-[140px] max-[1380px]:left-[600px] max-[1380px]:w-[420px] max-[1380px]:gap-[10px]
                 max-[1280px]:top-[130px] max-[1280px]:left-[550px] max-[1280px]:w-[380px] max-[1280px]:gap-[8px]
                 max-[1024px]:top-[120px] max-[1024px]:left-[450px] max-[1024px]:w-[380px] max-[1024px]:gap-[6px]
                 max-[768px]:top-[100px] max-[768px]:left-[380px] max-[768px]:w-[260px] max-[768px]:gap-[4px]
                 max-[640px]:top-[80px] max-[640px]:left-[195px] max-[640px]:w-[200px] max-[640px]:gap-[2px]
                 max-[400px]:top-[70px] max-[400px]:left-[155px] max-[400px]:w-[160px] max-[400px]:gap-[1px]"
      >
        <div className="w-[262px] h-[22px] max-[1380px]:w-[220px] max-[1280px]:w-[200px] max-[1024px]:w-[180px] max-[768px]:w-full max-[640px]:w-full max-[400px]:w-full">
          <p className="text-white font-[400] text-[18px] leading-[100%] poppins-font
                        max-[1380px]:text-[16px] max-[1280px]:text-[15px] max-[1024px]:text-[14px] max-[768px]:text-[13px] max-[640px]:text-[11px] max-[400px]:text-[9px]">
            STACKLY AI
          </p>
        </div>

        <div className="w-[488px] h-[118px] max-[1380px]:w-[380px] max-[1280px]:w-[340px] max-[1024px]:w-[300px] max-[768px]:w-full max-[640px]:w-full max-[400px]:w-full">
          <p className="text-white font-[400] text-[52px] leading-[140%] lancelot-text -mt-[14px]
                        max-[1380px]:text-[44px] max-[1280px]:text-[40px] max-[1024px]:text-[38px] max-[768px]:text-[28px] max-[640px]:text-[20px] max-[400px]:text-[16px]
                        max-[1380px]:leading-[135%] max-[1280px]:leading-[130%] max-[1024px]:leading-[125%] max-[768px]:leading-[120%] max-[640px]:leading-[110%] max-[400px]:leading-[105%]">
            Design Your Dream Space Effortlessly
          </p>
        </div>
      </motion.div>

      {/* Description box */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={inView2 ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="w-[616px] h-[176px] absolute top-[440px] right-[40px] flex flex-col gap-[6px]
                 max-[1380px]:w-[500px] max-[1380px]:top-[380px] max-[1380px]:right-[30px] max-[1380px]:gap-[5px]
                 max-[1280px]:w-[450px] max-[1280px]:top-[360px] max-[1280px]:right-[20px] max-[1280px]:gap-[4px]
                 max-[1024px]:w-[380px] max-[1024px]:top-[310px] max-[1024px]:right-[15px] max-[1024px]:gap-[3px]
                 max-[768px]:w-[300px] max-[768px]:top-[240px] max-[768px]:right-[10px] max-[768px]:gap-[2px]
                 max-[640px]:w-[220px] max-[640px]:top-[210px] max-[640px]:right-[5px] max-[640px]:gap-[2px]
                 max-[400px]:w-[180px] max-[400px]:top-[150px] max-[400px]:right-[0px] max-[400px]:gap-[1px]"
      >
        {/* Heading with smooth transition */}
        <div className="w-full h-[45px] max-[640px]:h-[35px] max-[400px]:h-[30px] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={`heading-${currentStyleIndex}`}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="text-white text-[32px] font-[400] leading-[140%] poppins-font
                         max-[1380px]:text-[26px] max-[1280px]:text-[24px] max-[1024px]:text-[20px] max-[768px]:text-[18px]
                         max-[640px]:text-[16px] max-[400px]:text-[14px]"
            >
              {designStyles[currentStyleIndex].heading}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Description with smooth transition */}
        <div className="w-[616px] h-[125px] max-[1380px]:w-full max-[640px]:w-full max-[640px]:h-auto max-[400px]:w-full max-[400px]:h-auto overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={`description-${currentStyleIndex}`}
              variants={textVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ delay: 0.1 }}
              className="text-white text-[18px] font-[400] leading-[140%] lora-text
                         max-[1380px]:text-[16px] max-[1280px]:text-[15px] max-[1024px]:text-[14px] max-[768px]:text-[13px]
                         max-[640px]:text-[12px] max-[400px]:text-[10px] 
                         max-[1024px]:leading-[135%] max-[768px]:leading-[130%] max-[640px]:leading-[125%] max-[400px]:leading-[115%]"
            >
              {designStyles[currentStyleIndex].description}
            </motion.p>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Click counter indicator (optional) */}
      {exploreMoreClicks > 0 && exploreMoreClicks < 4 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-[650px] left-1/2 transform -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full
                     max-[768px]:top-[380px] max-[400px]:top-[270px]"
        >
         
        </motion.div>
      )}

      {/* Icon 1 */}
      <motion.img
        initial={{ opacity: 0 }}
        animate={inView1 ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.8 }}
        src={Group}
        alt="Group 28"
        className="absolute w-[26.99px] h-[26.99px] top-[31px] left-[1300px] rotate-0 border-[1.9px] border-solid border-black
                 max-[1380px]:w-[22px] max-[1380px]:h-[22px] max-[1380px]:top-[25px] max-[1380px]:left-[1100px]
                 max-[1280px]:w-[20px] max-[1280px]:h-[20px] max-[1280px]:top-[22px] max-[1280px]:left-[950px]
                 max-[1024px]:w-[18px] max-[1024px]:h-[18px] max-[1024px]:top-[20px] max-[1024px]:left-[800px]
                 max-[768px]:w-[16px] max-[768px]:h-[16px] max-[768px]:top-[15px] max-[768px]:left-[600px]
                 max-[400px]:w-[12px] max-[400px]:h-[12px] max-[400px]:top-[12px] max-[400px]:left-[200px]"
      />

      {/* Icon 2 */}
      <motion.img
        initial={{ opacity: 0 }}
        animate={inView2 ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 1.0 }}
        src={Group}
        alt="Group 28"
        className="absolute w-[55.01px] h-[55.01px] top-[810px] left-[1297px] rotate-0 border-[1.9px] border-black
                 max-[1380px]:w-[45px] max-[1380px]:h-[45px] max-[1380px]:top-[675px] max-[1380px]:left-[1180px]
                 max-[1280px]:w-[40px] max-[1280px]:h-[40px] max-[1280px]:top-[650px] max-[1280px]:left-[950px]
                 max-[1024px]:w-[35px] max-[1024px]:h-[35px] max-[1024px]:top-[555px] max-[1024px]:left-[900px]
                 max-[768px]:w-[28px] max-[768px]:h-[28px] max-[768px]:top-[420px] max-[768px]:left-[700px]
                 max-[400px]:w-[20px] max-[400px]:h-[20px] max-[400px]:top-[350px] max-[400px]:left-[200px]"
      />

      {/* Explore more button */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={inView2 ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <div 
          className="absolute w-[280px] h-[50px] top-[685px] left-[1041px] flex items-center px-[6px] group cursor-pointer
                      max-[1380px]:w-[240px] max-[1380px]:h-[45px] max-[1380px]:top-[600px] max-[1380px]:left-[850px]
                      max-[1280px]:w-[220px] max-[1280px]:h-[40px] max-[1280px]:top-[560px] max-[1280px]:left-[750px]
                      max-[1024px]:w-[200px] max-[1024px]:h-[38px] max-[1024px]:top-[500px] max-[1024px]:left-[590px]
                      max-[768px]:w-[160px] max-[768px]:h-[32px] max-[768px]:top-[410px] max-[768px]:left-[80%] max-[768px]:-translate-x-1/2
                      max-[400px]:w-[140px] max-[400px]:h-[28px] max-[400px]:top-[290px] max-[400px]:left-[70%] max-[400px]:-translate-x-1/2"
          onClick={handleExploreMoreClick}
        >
          <div className="w-[217px] h-[34px] flex items-center justify-center
                          max-[1380px]:w-[180px] max-[1380px]:h-[28px]
                          max-[1280px]:w-[160px] max-[1280px]:h-[26px]
                          max-[1024px]:w-[140px] max-[1024px]:h-[24px]
                          max-[768px]:w-[120px] max-[768px]:h-[20px]
                          max-[400px]:w-[110px] max-[400px]:h-[18px]">
            <p
              className="text-white text-[24px] font-[400] leading-[140%] text-center font-[Lora] transition-all duration-300
                         max-[1380px]:text-[20px] max-[1280px]:text-[18px] max-[1024px]:text-[16px] max-[768px]:text-[14px]
                         max-[400px]:text-[12px]
                         group-hover:bg-gradient-to-r group-hover:from-[#00D1DD] group-hover:to-[#007B82] group-hover:bg-clip-text group-hover:text-transparent"
              style={{
                transition: "all 0.3s",
              }}
            >
              Explore more
            </p>
          </div>

          <div className="w-[50px] h-[50px] ml-[-15px] rotate-[-180deg] rounded-[30px] bg-white/10 relative flex items-center justify-center transition-all duration-300 group-hover:bg-white/20
                          max-[1380px]:w-[42px] max-[1380px]:h-[42px]
                          max-[1280px]:w-[38px] max-[1280px]:h-[38px]
                          max-[1024px]:w-[35px] max-[1024px]:h-[35px]
                          max-[768px]:w-[30px] max-[768px]:h-[30px]
                          max-[400px]:w-[26px] max-[400px]:h-[26px]">
            <img
              src={vector}
              alt="icon"
              className="w-[22.5px] h-[17.5px] rotate-[-180deg] transition-all duration-300 group-hover:opacity-80 group-hover:brightness-0 group-hover:invert
                         max-[1380px]:w-[18px] max-[1380px]:h-[14px]
                         max-[1280px]:w-[16px] max-[1280px]:h-[12px]
                         max-[1024px]:w-[14px] max-[1024px]:h-[11px]
                         max-[768px]:w-[12px] max-[768px]:h-[9px]
                         max-[400px]:w-[10px] max-[400px]:h-[8px]"/>
          </div>
        </div>
      </motion.div>
    </section>


    {/* section3 */}


    <section className="w-full h-[80px] sm:h-[100px] md:h-[120px] lg:h-[130px] xl:h-[140px] bg-black relative flex justify-center items-center overflow-hidden">
  {/* Marquee wrapper */}
  <div className="absolute top-[28px] sm:top-[36px] md:top-[42px] lg:top-[48px] xl:top-[52px] w-full h-[20px] sm:h-[22px] md:h-[24px] lg:h-[26px] xl:h-[28px] overflow-hidden">
    <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 animate-marquee whitespace-nowrap">
      {[
        "Visuals to the Next Level",
        "Stunning Modern Designs",
        "Creative Interior Ideas",
        "Elegant Space Designs",
        "Smart Home Styling",
        "Visuals to the Next Level",
        "Stunning Modern Designs",
        "Creative Interior Ideas",
      ].map((text, index) => (
        <div
          key={index}
          className="
            flex items-center gap-1 sm:gap-2 md:gap-3 
            w-[120px] sm:w-[150px] md:w-[180px] lg:w-[200px] xl:w-[220px] 
            h-[20px] sm:h-[22px] md:h-[24px] lg:h-[26px] xl:h-[28px]
          "
        >
          {/* Icon */}
          <div className="flex-shrink-0 w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] md:w-[20px] md:h-[20px] lg:w-[22px] lg:h-[22px] xl:w-[24px] xl:h-[24px] flex items-center justify-center">
            <img src={star} alt="icon" className="w-full h-full object-contain" />
          </div>

          {/* Text box */}
          <div
            className={`flex items-center 
              w-[90px] sm:w-[120px] md:w-[150px] lg:w-[170px] xl:w-[190px] 
              h-[18px] sm:h-[20px] md:h-[22px] lg:h-[24px] xl:h-[25px]
              ${index === 1 || index === 6 ? "border border-white border-[0.5px]" : ""}
            `}
          >
            <span
              className="font-poppins font-normal 
                text-[11px] sm:text-[13px] md:text-[15px] lg:text-[16px] xl:text-[17px] 
                leading-[140%] text-white truncate"
            >
              {text}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>

  {/* Marquee animation */}
  <style>
    {`
      @keyframes marquee {
        0%   { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      .animate-marquee {
        display: flex;
        width: max-content;
        animation: marquee 20s linear infinite;
      }
    `}
  </style>
</section>




{/* section4 */}
      <StepsHome />

      {/* Section 5*/}

      <BasicForm />
      

      {/* Section6 */}
<section className="w-full h-auto min-h-[600px] sm:min-h-[700px] md:min-h-[713px] lg:min-h-[650px] relative overflow-hidden">

  <video
    autoPlay
    loop
    muted
    playsInline
    className="absolute top-0 left-0 w-full h-full object-cover -z-10"
  >
    <source src={BgVideo2} type="video/mp4" />
    Your browser does not support the video tag.
  </video>

  <div className="relative w-full max-w-[1277px] mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:pt-16 flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-12 justify-between items-start">
    {/* Left Div */}
    <div className="w-full md:w-2/3 flex flex-col justify-between gap-8 sm:gap-10 md:gap-12">
      {/* Top Section */}
     <div className="w-full flex flex-col gap-6 sm:gap-8 md:gap-10">
  {/* Heading */}
  <div className="w-full flex items-center justify-start sm:justify-start max-[639px]:justify-center">
    <h2
      className="w-full max-w-[599px] text-xl sm:text-3xl md:text-[32px] leading-tight font-normal text-white text-left max-[639px]:text-center max-[639px]:text-base"
      style={{ fontFamily: 'Lora' }}
    >
      Elevate your home with artfully crafted, AI-enhanced design.
    </h2>
  </div>

  {/* Paragraph */}
 <p
  className={`w-full max-w-[830px] text-sm sm:text-lg md:text-[18px] leading-relaxed font-normal text-white text-left max-[639px]:text-center max-[639px]:text-[14px]`}
  style={{ fontFamily: "Poppins" }}
>
  {showFull || window.innerWidth >= 640
    ? "Experience interior design that speaks for itself. Our tailored AI-powered solutions have consistently delighted clients around the world bringing unique styles, functional layouts, and beautiful results to every space. From modern minimalism to timeless elegance, we deliver designs that truly feel like home."
    : (
      <>
        Experience interior design that speaks for itself. Our tailored AI-powered solutions have consistently delighted clients around the world...
        <button
          onClick={() => setShowFull(!showFull)}
          className="text-purple-500 font-medium ml-1 underline"
        >
          See More
        </button>
      </>
    )
  }
</p>

{/* If expanded, show "See Less" inline at end */}
{showFull && window.innerWidth < 640 && (
  <span
    className="text-purple-500 font-medium ml-1 cursor-pointer underline"
    onClick={() => setShowFull(false)}
  >
    See Less
  </span>
)}

</div>


      {/* Bottom Section */}
     <div
  className="relative w-full max-w-[424px] rounded-[20px] max-[777px]:mx-auto"
  style={{ background: "#8A38F514" }}
>

        {/* Gradient border overlay */}
        <div
          className="absolute inset-0 rounded-[20px] pointer-events-none"
          style={{
            border: "1px solid transparent",
            background: "linear-gradient(283.03deg, #8A38F5 -4.05%, #000000 106.3%) border-box",
            WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            padding: "1px",
            borderRadius: "20px"
          }}
        />

        {/* Content container */}
        <div
          className="w-full max-w-[412px] rounded-[20px] flex flex-col gap-4 sm:gap-5 md:gap-6 pr-3 sm:pr-4 pb-4 sm:pb-5 pl-4 sm:pl-5"
          style={{ backgroundColor: "#2E0854CC" }}
        >
          <h3
            className="w-full max-w-[376px] text-lg sm:text-xl md:text-[20px] font-medium leading-tight text-white"
            style={{ fontFamily: 'Inter' }}
          >
            Discover Smarter Design Possibilities
          </h3>
          <p
            className="w-full max-w-[376px] text-sm sm:text-base md:text-[14px] font-normal leading-tight text-white"
            style={{ fontFamily: 'Inter' }}
          >
            Explore how our AI transforms your spaces fast, stylish, and effortless
          </p>

          <div className="w-full max-w-[245px] flex items-center justify-start">
            <Link to="/sign-in">
              <div
                className="w-full max-w-[222px] flex items-center gap-2 sm:gap-3 border border-solid rounded-[30px] px-4 sm:px-6 py-2 sm:py-3"
                style={{
                  background: "linear-gradient(95.92deg, rgba(138, 56, 245, 0.5) 15.32%, rgba(194, 44, 162, 0.5) 99.87%)"
                }}
              >
                <div
                  className="w-full max-w-[128px] text-sm sm:text-base md:text-[16px] font-medium leading-tight text-white"
                  style={{ fontFamily: 'Inter' }}
                >
                  Explore Features
                </div>
                <div className="w-5 h-5 sm:w-6 sm:h-6 p-0.5 box-border">
                  <img
                    src={Frame}
                    alt="icon"
                    className="w-full h-full"
                    style={{
                      filter: "brightness(0) saturate(100%) invert(92%) sepia(56%) saturate(763%) hue-rotate(239deg) brightness(97%) contrast(102%)",
                    }}
                  />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>

   {/* Right Div */}
<div
  ref={ref4}
  className="w-full md:w-1/3 flex flex-col md:flex-col max-[639px]:flex-row max-[639px]:justify-center max-[639px]:gap-4 gap-6 sm:gap-8 md:gap-[105px] items-center md:items-end"
>
  {/* 45+ Div */}
  <div className="w-full max-w-[240px] sm:max-w-[260px] md:max-w-[280px] h-[181px] border border-white max-[639px]:max-w-[140px] max-[639px]:h-[140px]">
    <div className="w-full max-w-[200px] sm:max-w-[220px] md:max-w-[224px] mx-auto h-[149px] flex flex-col items-center justify-between max-[639px]:h-[110px]">
      {/* Top Text */}
      <div className="w-full h-[115px] flex items-center justify-center max-[639px]:h-[80px]">
        <p
          className="text-5xl sm:text-6xl md:text-[82px] font-medium leading-[140%] text-center max-[639px]:text-3xl"
          style={{
            fontFamily: 'Poppins',
            background: "linear-gradient(104.83deg, #8A38F5 28.54%, #C22CA2 84.84%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}
        >
          <span ref={counter45Ref}>0+</span>
        </p>
      </div>
      {/* Bottom Text */}
      <div className="w-full h-[34px] flex items-center justify-center max-[639px]:h-[24px]">
        <p
          className="text-lg sm:text-xl md:text-[24px] font-normal leading-[140%] text-white text-center max-[639px]:text-sm"
          style={{ fontFamily: 'Poppins' }}
        >
          Design Styles
        </p>
      </div>
    </div>
    <div className="w-full max-w-[230px] sm:max-w-[250px] md:max-w-[269px] h-[52px] border border-white max-[639px]:h-[36px]">
      <img src={Line} alt="Sideline" className="w-full h-full object-contain" />
    </div>
  </div>

  {/* 100+ Div */}
  <div className="w-full max-w-[240px] sm:max-w-[260px] md:max-w-[280px] h-[175px] border border-white max-[639px]:max-w-[140px] max-[639px]:h-[130px]">
    <div className="w-full max-w-[200px] sm:max-w-[220px] md:max-w-[224px] mx-auto h-[149px] flex flex-col items-center justify-between max-[639px]:h-[105px]">
      {/* Top Text */}
      <div className="w-full h-[115px] flex items-center justify-center max-[639px]:h-[75px]">
        <p
          className="text-5xl sm:text-6xl md:text-[82px] font-medium leading-[140%] text-center max-[639px]:text-3xl"
          style={{
            fontFamily: 'Poppins',
            background: "linear-gradient(104.83deg, #8A38F5 28.54%, #C22CA2 84.84%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}
        >
          <span ref={counter100Ref}>0+</span>
        </p>
      </div>
      {/* Bottom Text */}
      <div className="w-full h-[34px] flex items-center justify-center max-[639px]:h-[24px]">
        <p
          className="text-lg sm:text-xl md:text-[24px] font-normal leading-[140%] text-white text-center max-[639px]:text-sm"
          style={{ fontFamily: 'Poppins' }}
        >
          Happy Users
        </p>
      </div>
    </div>
    <div className="w-full max-w-[230px] sm:max-w-[250px] md:max-w-[269px] h-[52px] border border-white max-[639px]:h-[36px]">
      <img src={Line} alt="Sideline" className="w-full h-full object-contain" />
    </div>
  </div>
</div>

  </div>
</section>


  
{/* SECTION 7 */}
      <FAQ faqs={faqs} />

      {/* SECTION 8 */}

<section
  className="relative w-full h-[316px] md:h-[300px] sm:h-[260px] xs:h-[240px] 
             max-[640px]:h-[210px] max-[480px]:h-[200px] bg-cover bg-center overflow-hidden"
  style={{ backgroundImage: `url(${Bfooter})` }}
>
  {/* Animated Background Overlay */}
  <motion.div
    className="absolute inset-0 bg-gradient-to-b from-black/40 via-purple-900/20 to-black/40"
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    transition={{ duration: 1.5, ease: "easeOut" }}
    viewport={{ once: true }}
  />
  
  {/* Floating Background Elements */}
  <motion.div
    className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-r from-[#8A38F5] to-[#C22CA2] rounded-full blur-xl opacity-20"
    animate={{
      y: [0, -20, 0],
      x: [0, 15, 0],
    }}
    transition={{
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  />
  
  <motion.div
    className="absolute bottom-10 right-10 w-16 h-16 bg-gradient-to-r from-[#C22CA2] to-[#8A38F5] rounded-full blur-lg opacity-30"
    animate={{
      y: [0, 15, 0],
      x: [0, -10, 0],
    }}
    transition={{
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 1
    }}
  />

  <div
    className="absolute top-[20%] sm:top-[22%] md:top-[22%] xs:top-[20%] 
               max-[640px]:top-1/2 transform -translate-x-1/2 max-[640px]:-translate-y-1/2
               left-1/2 w-[90%] max-w-[737px] flex flex-col items-center gap-2 xs:gap-3 sm:gap-4 md:gap-6 lg:gap-[24px]"
  >
    {/* Heading Text with Staggered Animation */}
    <motion.div
      className="text-center"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.2
          }
        }
      }}
    >
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: { 
            opacity: 1, 
            y: 0,
            transition: {
              duration: 0.8,
              ease: "easeOut"
            }
          }
        }}
        className="text-white text-[16px] xs:text-[18px] sm:text-[20px] md:text-[24px] lg:text-[32px] font-[500] leading-[130%] xs:leading-[135%] sm:leading-[140%] md:leading-[140%]"
        style={{ fontFamily: 'Poppins' }}
      >
        Sign Up Quickly! Get
        <motion.span 
          className="bg-gradient-to-r from-[#C22CA2] to-[#8A38F5] font-bold text-transparent bg-clip-text"
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "backOut" }}
          viewport={{ once: true }}
        >
          {" "}25%
        </motion.span> 
        Offer
      </motion.div>
    </motion.div>

    {/* Combined Info Row with Fade In */}
    <motion.div
      className="flex flex-row items-center justify-center gap-6"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      {/* 30 Free Outputs */}
      <motion.div 
        className="flex items-center gap-1 xs:gap-2 sm:gap-[4px]"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <motion.div 
          className="w-2 h-2 xs:w-2 xs:h-2 sm:w-[6px] sm:h-[6px] rounded-full bg-[#C22CA2]"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="text-white text-[12px] xs:text-[14px] sm:text-[16px] font-[500]" style={{ fontFamily: 'Inter' }}>
          30 free outputs
        </div>
      </motion.div>

      {/* No Credit Card Required */}
      <motion.div 
        className="flex items-center gap-1 xs:gap-2 sm:gap-[4px]"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <motion.div 
          className="w-2 h-2 xs:w-2 xs:h-2 sm:w-[6px] sm:h-[6px] rounded-full bg-[#C22CA2]"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <div className="text-white text-[12px] xs:text-[14px] sm:text-[16px] font-[500]" style={{ fontFamily: 'Inter' }}>
          No credit card required
        </div>
      </motion.div>
    </motion.div>

    {/* Button with Pulse Animation */}
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
      whileHover={{ 
        scale: 1.05,
        transition: { type: "spring", stiffness: 400, damping: 10 }
      }}
      whileTap={{ scale: 0.95 }}
    >
      <Link to="/sign-in">
        <motion.div
          className="flex items-center justify-center gap-1 xs:gap-2 sm:gap-[8px] px-4 xs:px-5 sm:px-6 py-1 xs:py-2 sm:py-3 rounded-[30px] border border-white relative overflow-hidden"
          style={{
            background: "linear-gradient(95.92deg, rgba(138, 56, 245, 0.5) 15.32%, rgba(194, 44, 162, 0.5) 99.87%)",
          }}
          animate={{
            boxShadow: [
              "0 0 0px rgba(138, 56, 245, 0.4)",
              "0 0 20px rgba(138, 56, 245, 0.6)",
              "0 0 0px rgba(138, 56, 245, 0.4)"
            ]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Shine Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: [-100, 300] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
              ease: "easeInOut"
            }}
          />
          
          <motion.span 
            className="text-white text-[12px] xs:text-[14px] sm:text-[16px] font-[500] relative z-10"
            style={{ fontFamily: "Inter" }}
            whileHover={{ color: "#f0f0f0" }}
          >
            Start Free Trial
          </motion.span>
          <motion.div 
            className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 relative z-10"
            animate={{ x: [0, 5, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <img src={Frame} alt="icon" className="w-full h-full" />
          </motion.div>
        </motion.div>
      </Link>
    </motion.div>
  </div>

  {/* Bottom Border Animation */}
  <motion.div
    className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#8A38F5] to-transparent"
    initial={{ scaleX: 0 }}
    whileInView={{ scaleX: 1 }}
    transition={{ duration: 1.2, ease: "easeOut" }}
    viewport={{ once: true }}
  />
</section>



</div>
  );
}
