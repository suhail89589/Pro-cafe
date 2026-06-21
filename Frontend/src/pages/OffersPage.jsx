"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { offersData } from "../data/offersData";
import { Link } from "react-router-dom";

export default function OffersPage() {
  const mainOffer = offersData.find((offer) => offer.type === "bogo");
  const otherOffers = offersData.filter((offer) => offer.type !== "bogo");

  // 3D Tilt Values for the Main Banner
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#0A0A0A] overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl md:text-7xl font-[Playfair_Display] font-bold text-white">
            Curated <span className="text-pizza-red italic">Exclusives</span>
          </h1>
        </motion.header>

        {/* Main Offer - 3D Perspective Banner */}
        <motion.div
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative mb-24 perspective-1000"
        >
          {/* Dynamic Glow */}
          <div className="absolute inset-0 bg-pizza-red/10 blur-[120px] rounded-full pointer-events-none" />

          <div className="relative glass-panel rounded-[3rem] p-10 md:p-20 border-white/5 bg-gradient-to-br from-[#141414] to-[#0A0A0A] overflow-hidden flex flex-col md:flex-row items-center gap-16">
            {/* Content Side */}
            <div
              className="flex-1 z-10 space-y-8"
              style={{ transform: "translateZ(50px)" }}
            >
              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-5 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-pizza-red">
                <span className="w-2 h-2 rounded-full bg-pizza-red animate-pulse" />
                Live Offer
              </div>

              <h2 className="text-4xl md:text-6xl font-[Playfair_Display] font-bold text-white leading-[1.1]">
                {mainOffer?.title}
              </h2>

              <p className="text-lg text-gray-400 max-w-md font-light leading-relaxed">
                {mainOffer?.description}. Double the flavor, half the price.
                Only for the next few hours.
              </p>

              {/* Countdown Ticker */}
              <div className="flex gap-4">
                {["02", "14", "36"].map((num, i) => (
                  <div key={i} className="group relative">
                    <div className="text-4xl md:text-5xl font-bold text-white tabular-nums tracking-tighter">
                      {num}
                      <span className="text-pizza-red text-xl ml-1">
                        {["D", "H", "M"][i]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                to="/menu"
                className="inline-flex items-center justify-center bg-pizza-red text-white px-10 py-5 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all duration-500 shadow-2xl"
              >
                Claim My Slice
              </Link>
            </div>

            {/* Visual Side */}
            <div
              className="flex-1 relative flex items-center justify-center"
              style={{ transform: "translateZ(80px)" }}
            >
              <motion.div
                animate={{
                  y: [0, -30, 0],
                  rotate: [0, 8, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative w-full aspect-square max-w-sm"
              >
                <div className="absolute inset-0 bg-pizza-red/20 blur-3xl rounded-full" />
                <img
                  src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800"
                  alt="Hero Pizza"
                  className="w-full h-full object-cover rounded-full border-[12px] border-white/5 shadow-2xl"
                />
                {/* Floating Badge */}
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute -top-4 -right-4 w-24 h-24 bg-white rounded-full flex items-center justify-center text-black text-[10px] font-black text-center p-2 leading-tight uppercase tracking-tighter shadow-xl"
                >
                  Limited • Edition • Bogo •
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Secondary Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {otherOffers.map((offer, idx) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              whileHover={{ y: -10 }}
              className="group relative p-10 rounded-[2.5rem] bg-[#111] border border-white/5 hover:border-pizza-red/20 transition-all duration-500 overflow-hidden"
            >
              <div className="relative z-10 flex flex-col h-full">
                <span className="text-pizza-red font-mono text-[10px] uppercase tracking-[0.4em] mb-4">
                  {offer.type}
                </span>
                <h3 className="text-3xl font-[Playfair_Display] font-bold text-white mb-4 group-hover:text-pizza-red transition-colors">
                  {offer.title}
                </h3>
                <p className="text-gray-500 leading-relaxed mb-10 flex-grow">
                  {offer.description}
                </p>
                <Link
                  to={offer.type === "event" ? "/events" : "/menu"}
                  className="inline-flex items-center gap-3 text-white text-xs font-bold uppercase tracking-widest group/link"
                >
                  Explore Deal
                  <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover/link:bg-white group-hover/link:text-black transition-all">
                    →
                  </div>
                </Link>
              </div>

              {/* Decorative Background Icon */}
              <div className="absolute -bottom-10 -right-10 text-white/[0.02] text-[150px] font-black pointer-events-none group-hover:text-pizza-red/[0.03] transition-colors">
                {idx + 1}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
