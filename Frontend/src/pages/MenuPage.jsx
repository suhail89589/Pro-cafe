"use client";

import { useState, useMemo, useEffect, forwardRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { menuData } from "../data/menuData";
import { useCart } from "../context/CartContext";
import { API_BASE_URL } from "../config";

// --- Sub-Components ---

const VegIndicator = ({ isVeg }) => (
  <div
    className={`relative group flex items-center justify-center w-5 h-5 border-2 rounded-sm transition-colors duration-500 ${isVeg ? "border-green-600" : "border-red-600"}`}
  >
    <div
      className={`w-2 h-2 rounded-full ${isVeg ? "bg-green-600 shadow-[0_0_8px_rgba(22,163,74,0.6)]" : "bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.6)]"}`}
    />
    {/* Tooltip for A11y */}
    <span className="absolute -top-8 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform bg-black/80 text-[10px] px-2 py-1 rounded text-white whitespace-nowrap">
      {isVeg ? "Vegetarian" : "Non-Vegetarian"}
    </span>
  </div>
);

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [menuItems, setMenuItems] = useState(menuData);
  const { scrollY } = useScroll();

  // Subtle parallax for background mandala
  const backgroundY = useTransform(scrollY, [0, 1000], [0, 200]);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/foods`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setMenuItems(data);
          }
        }
      } catch (error) {
        console.error('Failed to load foods from database API, using static menuData.', error);
      }
    };
    fetchFoods();
  }, []);

  const categories = useMemo(
    () => ["All", ...new Set(menuItems.map((item) => item.category))],
    [menuItems],
  );

  const filteredMenu = useMemo(
    () =>
      activeCategory === "All"
        ? menuItems
        : menuItems.filter((item) => item.category === activeCategory),
    [activeCategory, menuItems],
  );

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#080808] text-gray-100 relative overflow-hidden">
      {/* 1. Kinetic Background Pattern */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/mandala-ornament.png')] scale-150"
      />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        {/* 2. Masked Cinematic Header */}
        <header className="text-center mb-20">
          <motion.div className="overflow-hidden inline-block">
            <motion.span
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-cafe-brown font-mono tracking-[0.4em] uppercase text-[10px] block"
            >
              The Art of Indian Spice
            </motion.span>
          </motion.div>

          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: 80 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-6xl md:text-8xl font-[Playfair_Display] font-bold mt-2"
            >
              The <span className="text-cafe-brown italic">Imperial</span> Menu
            </motion.h1>
          </div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="w-32 h-[1px] bg-gradient-to-r from-transparent via-cafe-brown to-transparent mx-auto mt-6"
          />
        </header>

        {/* 3. Filter Nav with Magnetic Indicator */}
        <nav className="flex flex-wrap md:justify-center gap-4 mb-20 overflow-x-auto pb-6 no-scrollbar">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className="relative px-8 py-3 group"
            >
              <span
                className={`relative z-10 text-sm font-bold tracking-widest uppercase transition-colors duration-300 ${activeCategory === category ? "text-white" : "text-gray-500 group-hover:text-gray-300"}`}
              >
                {category}
              </span>
              {activeCategory === category && (
                <motion.div
                  layoutId="activePill"
                  className="absolute inset-0 bg-cafe-brown rounded-full shadow-[0_10px_25px_rgba(198,124,78,0.4)]"
                  transition={{ type: "spring", bounce: 0.25, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </nav>

        {/* 4. Menu Grid with Adaptive Layout */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
        >
          <AnimatePresence mode="popLayout">
            {filteredMenu.map((item, idx) => (
              <MenuCard key={item.id || item._id} item={item} index={idx} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

const MenuCard = forwardRef(({ item, index }, ref) => {
  const { addToCart } = useCart();
  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        duration: 0.5,
        delay: index * 0.05, // Stagger effect
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group flex flex-col h-full bg-[#111] rounded-[2rem] overflow-hidden border border-white/5 hover:border-cafe-brown/20 transition-all duration-500"
    >
      {/* Visual Anchor */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110 grayscale-[20%] group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent opacity-90" />

        {/* Stamp Badges */}
        <div className="absolute top-6 left-6 flex items-center gap-3">
          <div className="bg-black/60 backdrop-blur-md p-2 rounded-lg border border-white/10">
            <VegIndicator isVeg={item.isVeg !== false} />
          </div>
          {item.isSpecial && (
            <span className="bg-cafe-brown/90 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-[0.2em] px-3 py-2 rounded-lg border border-cafe-brown/20">
              Chef's Pick
            </span>
          )}
        </div>
      </div>

      {/* Detail Block */}
      <div className="px-8 pb-8 flex flex-col flex-grow -mt-12 relative z-10">
        <div className="flex justify-between items-end gap-4 mb-4">
          <h3 className="text-2xl font-bold font-[Playfair_Display] leading-tight group-hover:text-cafe-brown transition-colors">
            {item.name}
          </h3>
          <div className="h-[1px] flex-grow bg-white/5 mx-2 mb-2" />
          <span className="text-xl font-medium text-cafe-brown font-serif">
            ₹{item.price}
          </span>
        </div>

        <p className="text-gray-400 text-sm font-light leading-relaxed mb-8 flex-grow line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
          {item.description}
        </p>

        <div className="flex items-center justify-between pt-6 border-t border-white/5">
          <span className="text-[9px] uppercase tracking-[0.3em] text-white/20 font-black">
            {item.category}
          </span>

          <motion.button
            onClick={() => addToCart(item)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 px-5 py-2.5 bg-white/5 hover:bg-cafe-brown rounded-full border border-white/10 hover:border-transparent transition-all duration-500 group/btn"
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-white">
              Add
            </span>
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover/btn:bg-white/20">
              <svg
                className="w-3 h-3 transition-transform group-hover/btn:rotate-90"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
});

MenuCard.displayName = "MenuCard";
