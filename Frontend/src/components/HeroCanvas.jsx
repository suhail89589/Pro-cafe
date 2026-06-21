"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Link } from "react-router-dom";

export default function HeroCanvas() {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    // gsap.context handles scoping so we don't have to use many refs
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.from(imageRef.current, {
        scale: 1.2,
        duration: 2.5,
        ease: "power2.out",
      })
        .from(
          ".hero-title-line",
          {
            y: 100,
            opacity: 0,
            stagger: 0.2,
            duration: 1.2,
          },
          "-=1.8",
        )
        .from(
          ".hero-sub",
          {
            opacity: 0,
            y: 20,
            duration: 1,
          },
          "-=0.8",
        )
        .from(
          ".hero-btn",
          {
            scale: 0.8,
            opacity: 0,
            stagger: 0.1,
            duration: 0.8,
            ease: "back.out(1.7)",
          },
          "-=0.5",
        );

      // Mouse Parallax Logic - No TypeScript types
      const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const xPos = (clientX / window.innerWidth - 0.5) * 30;
        const yPos = (clientY / window.innerHeight - 0.5) * 30;

        // Move background slightly
        gsap.to(imageRef.current, {
          x: xPos,
          y: yPos,
          duration: 1.5,
          ease: "power2.out",
        });

        // Move text in opposite direction for depth
        gsap.to(contentRef.current, {
          x: -xPos * 0.3,
          y: -yPos * 0.3,
          duration: 1.5,
          ease: "power2.out",
        });
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-black flex items-center justify-center"
    >
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <img
          ref={imageRef}
          src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=2000"
          alt="Cafe Interior"
          className="w-full h-full object-cover opacity-50 scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-[#0A0A0A]"></div>
      </div>

      {/* Content Layer */}
      <div ref={contentRef} className="relative z-10 text-center px-4">
        <h1 className="font-[Playfair_Display] text-5xl md:text-7xl lg:text-9xl font-bold leading-tight mb-6 text-white">
          <span className="block overflow-hidden">
            <span className="hero-title-line block text-cafe-brown italic">
              Fresh. Warm.
            </span>
          </span>
          <span className="block overflow-hidden">
            <span className="hero-title-line block">Authentic Taste.</span>
          </span>
        </h1>

        <div className="hero-sub mb-10 text-gray-300 font-medium text-lg md:text-xl tracking-wide">
          <p>Open Daily 10AM – 10PM</p>
          <p className="mt-2 text-cafe-brown">Home Delivery within 2KM</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/menu"
            className="hero-btn border border-white/20 bg-white/5 backdrop-blur-md hover:bg-white hover:text-black text-white px-10 py-4 rounded-full font-semibold transition-all"
          >
            View Menu
          </Link>
          <Link
            to="/order"
            className="hero-btn bg-cafe-brown hover:bg-white hover:text-cafe-brown text-white px-10 py-4 rounded-full font-bold shadow-2xl transition-all"
          >
            Order Now
          </Link>
        </div>
      </div>
    </div>
  );
}
