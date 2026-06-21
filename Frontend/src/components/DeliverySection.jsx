"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function DeliverySection() {
  const sectionRef = useRef(null);
  const textBgRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Horizontal scrub for the large background text
      gsap.to(textBgRef.current, {
        xPercent: -20,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Reveal animation for cards
      gsap.from(".delivery-card", {
        y: 60,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".delivery-grid",
          start: "top 80%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 bg-[#0A0A0A] overflow-hidden"
    >
      {/* 1. Kinetic Typography Background (Different from Hero) */}
      <div
        ref={textBgRef}
        className="absolute top-1/2 -translate-y-1/2 left-0 whitespace-nowrap pointer-events-none select-none z-0"
      >
        <span className="text-[20vw] font-black text-white/[0.02] leading-none uppercase">
          Express • Delivery • Authentic • Express • Delivery •
        </span>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="mb-20">
          <h2 className="text-cafe-brown font-mono text-sm tracking-[0.5em] uppercase mb-4">
            Service Excellence
          </h2>
          <h3 className="text-white text-5xl md:text-7xl font-[Playfair_Display] font-bold">
            From our Tandoor <br />
            <span className="italic text-gray-500">To your Table.</span>
          </h3>
        </div>

        {/* 2. Bento-style Grid (Strong visual difference from Hero) */}
        <div className="delivery-grid grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Delivery Feature */}
          <div className="delivery-card md:col-span-2 bg-[#111] border border-white/5 rounded-[2rem] p-10 flex flex-col justify-between min-h-[400px] group overflow-hidden relative">
            <div className="relative z-10">
              <div className="w-12 h-12 bg-cafe-brown rounded-full flex items-center justify-center mb-6">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
              <h4 className="text-3xl text-white font-bold mb-4">
                Hyper-Local Delivery
              </h4>
              <p className="text-gray-400 max-w-sm">
                We prioritize a 2KM radius to ensure every Naan stays crisp and
                every Curry stays piping hot.
              </p>
            </div>

            {/* Abstract circular element for design depth */}
            <div className="absolute -right-20 -bottom-20 w-80 h-80 border border-cafe-brown/20 rounded-full group-hover:scale-110 transition-transform duration-700" />
          </div>

          {/* Stat Card 1 */}
          <div className="delivery-card bg-cafe-brown rounded-[2rem] p-10 flex flex-col justify-center items-center text-center">
            <span className="text-white/60 font-mono text-sm tracking-widest mb-2 uppercase">
              Avg Time
            </span>
            <span className="text-white text-7xl font-bold font-[Playfair_Display]">
              30
            </span>
            <span className="text-white text-xl font-medium uppercase mt-2">
              Minutes
            </span>
          </div>

          {/* Stat Card 2 */}
          <div className="delivery-card bg-[#111] border border-white/5 rounded-[2rem] p-10 flex flex-col justify-center items-center text-center group">
            <span className="text-cafe-brown font-mono text-sm tracking-widest mb-2 uppercase">
              Min Order
            </span>
            <span className="text-white text-6xl font-bold">$3</span>
            <div className="mt-6 px-6 py-2 border border-white/10 rounded-full text-gray-400 group-hover:border-cafe-brown group-hover:text-white transition-colors">
              Order Now
            </div>
          </div>

          {/* Large Visual Card */}
          <div className="delivery-card md:col-span-2 bg-[#111] border border-white/5 rounded-[2rem] overflow-hidden group">
            <div className="grid grid-cols-1 md:grid-cols-2 h-full">
              <div className="p-10 flex flex-col justify-center">
                <h4 className="text-2xl text-white font-bold mb-4">
                  Thermal Packaging
                </h4>
                <p className="text-gray-400">
                  Our custom-designed bags maintain a constant 180°F temperature
                  during transit.
                </p>
              </div>
              <div className="h-64 md:h-full relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000"
                  className="absolute inset-0 w-full h-full object-cover grayscale opacity-50 group-hover:scale-110 group-hover:grayscale-0 transition-all duration-700"
                  alt="Quality Control"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
