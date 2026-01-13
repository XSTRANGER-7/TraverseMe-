
import React, { useEffect, useRef } from 'react'; 
import gsap from 'gsap'; 
import { ScrollTrigger } from 'gsap/ScrollTrigger';  

gsap.registerPlugin(ScrollTrigger);  

const Spotlight = () => { 
  const sectionRef = useRef(null); 
  const lightBarRef = useRef(null); 
  const lightSpreadRef = useRef(null); 
  const textRef = useRef(null); 

  useEffect(() => { 
    const section = sectionRef.current; 
    const lightBar = lightBarRef.current; 
    const lightSpread = lightSpreadRef.current; 
    const text = textRef.current; 

    // Create timeline 
    const tl = gsap.timeline({ 
      scrollTrigger: { 
        trigger: section, 
        start: 'top center', // Animation triggers when the section's top reaches the center of the viewport 
        toggleActions: 'play none none reset', // Play animation only once per trigger 
        markers: false, // Set to true for debugging 
      } 
    }); 

    // Animate light bar 
    tl.fromTo(lightBar, { 
      width: '100px', 
      opacity: 0.9, 
      boxShadow: '0px 0px 10px 0px rgba(110, 193, 228, 0.8)' 
    }, { 
      width: '500px', 
      opacity: 1, 
      boxShadow: '0px 0px 110px 0px rgba(110, 193, 228, 0.8)', 
      duration: 1, 
      ease: 'power2.inOut' // Smooth transition effect added here
    }); 

    // Animate light spread 
    tl.fromTo(lightSpread, { 
      width: '100px', 
      opacity: 0.6, 
      filter: 'blur(10px)' 
    }, { 
      width: '500px', 
      opacity: 1, 
      filter: 'blur(45px)', 
      duration: 1, 
      ease: 'power2.inOut' // Smooth transition effect added here
    }, '<'); 

    // Animate text 
    tl.fromTo(text, { 
      opacity: 0.1, 
      scale: 0.9, 
      textShadow: '0 0 20px rgba(110, 193, 228, 0.5)' 
    }, { 
      opacity: 1, 
      scale: 1.1, 
      textShadow: '0 0 50px rgba(110, 193, 228, 0.8)', 
      duration: 1.1, 
      ease: 'expo.in' // Smooth transition effect added here
    }, '<'); 

    return () => { 
      tl.kill(); 
    }; 
  }, []); 

  return (     
    <div
      ref={sectionRef}
      className="relative min-h-[200vh] bg-black overflow-hidden"
    >
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {/* Light Bar */}         
        <div
          ref={lightBarRef}
          className="absolute top-1/3 left-1/2 transform -translate-x-1/2 transition-all duration-300"
          style={{
            backgroundColor: '#6EC1E4',
            height: '4px',
          }}
        />

        {/* Light Spread */}         
        <div
          ref={lightSpreadRef}
          className="absolute top-1/3 left-1/2 transform -translate-x-1/2 transition-all duration-300"
          style={{
            height: '350px',
            background: `linear-gradient(180deg, 
              rgba(110, 193, 228, 0.8) 0%,
              rgba(110, 193, 228, 0.6) 20%,
              rgba(110, 193, 228, 0.4) 40%,
              rgba(110, 193, 228, 0.2) 60%,
              transparent 100%
            )`,
            clipPath: 'polygon(0% 0%, 100% 0%, 140% 100%, -40% 100%)',
            marginTop: '2px',
          }}
        />

        {/* Text */}         
        <h3
          ref={textRef}
          className="text-5xl mt-12 font-bold text-white z-10"
        >
          Join the Waitlist
        </h3>
      </div>
      {/* <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" stroke="url(#textGradient)" stroke-width="0.3" mask="url(#textMask)" class="font-[helvetica] font-bold fill-transparent text-7xl">WiseMe</text> */}
    </div>
  ); 
}; 

export default Spotlight;
















