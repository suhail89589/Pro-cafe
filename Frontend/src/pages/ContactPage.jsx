"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    phone: "",
    guests: "2",
    date: "",
    message: "",
  });
  const [status, setStatus] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".contact-info-item", {
        x: -30,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: "power4.out",
      });
      gsap.from(".contact-form-element", {
        y: 20,
        opacity: 0,
        stagger: 0.05,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.2,
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleChange = (e) =>
    setFormState({ ...formState, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formState.name || !formState.phone || !formState.date) {
      setStatus("error");
      return;
    }
    setStatus("success");
    setTimeout(() => setStatus(null), 5000);
  };

  return (
    <div
      ref={containerRef}
      className="pt-32 pb-24 min-h-screen bg-[#080808] relative overflow-hidden"
    >
      {/* Background Decorative Element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')] opacity-20 pointer-events-none" />

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <header className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-cafe-brown font-mono tracking-[0.3em] uppercase text-xs"
          >
            Reservations
          </motion.span>
          <h1 className="text-5xl md:text-7xl font-[Playfair_Display] font-bold text-white mt-4">
            Secure Your <span className="text-cafe-brown italic">Table</span>
          </h1>
        </header>

        <div className="flex flex-col lg:flex-row bg-[#111] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
          {/* Left Side: Contact Info */}
          <div className="flex-1 p-12 md:p-20 bg-gradient-to-br from-[#141414] to-[#0A0A0A] relative border-r border-white/5">
            <h3 className="text-3xl font-[Playfair_Display] font-bold text-white mb-12">
              Connect
            </h3>

            <div className="space-y-12">
              {[
                {
                  label: "Location",
                  val: "Pakwara, Moradabad 244102",
                  icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
                },
                {
                  label: "Phone",
                  val: "+91 92895 07597",
                  icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
                },
                {
                  label: "Hours",
                  val: "10:00 AM - 10:00 PM",
                  sub: "Kitchen closes 9:30 PM",
                  icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
                },
              ].map((item, i) => (
                <div key={i} className="contact-info-item flex gap-6 group">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-cafe-brown group-hover:bg-cafe-brown group-hover:text-white transition-all duration-500">
                    <svg
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d={item.icon}
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1 uppercase tracking-widest text-[10px] opacity-50">
                      {item.label}
                    </h4>
                    <p className="text-gray-300 text-lg leading-relaxed">
                      {item.val}
                    </p>
                    {item.sub && (
                      <p className="text-pizza-red text-xs mt-1 font-mono uppercase tracking-tighter">
                        {item.sub}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="mt-16 flex gap-4">
              {["IG", "FB", "TW"].map((s) => (
                <div
                  key={s}
                  className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center text-[10px] font-bold text-gray-500 hover:border-cafe-brown hover:text-white cursor-pointer transition-all"
                >
                  {s}
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="flex-[1.4] p-12 md:p-20">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="contact-form-element">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3">
                    Your Identity
                  </label>
                  <input
                    type="text"
                    name="name"
                    onChange={handleChange}
                    className="w-full bg-white/[0.03] border border-white/5 focus:border-cafe-brown/50 rounded-2xl px-6 py-4 text-white outline-none transition-all placeholder:text-gray-700"
                    placeholder="Name"
                  />
                </div>
                <div className="contact-form-element">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3">
                    Contact Line
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    onChange={handleChange}
                    className="w-full bg-white/[0.03] border border-white/5 focus:border-cafe-brown/50 rounded-2xl px-6 py-4 text-white outline-none transition-all placeholder:text-gray-700"
                    placeholder="Phone Number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="contact-form-element">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3">
                    Party Size
                  </label>
                  <div className="relative">
                    <select
                      name="guests"
                      onChange={handleChange}
                      value={formState.guests}
                      className="w-full bg-white/[0.03] border border-white/5 focus:border-cafe-brown/50 rounded-2xl px-6 py-4 text-white outline-none transition-all appearance-none cursor-pointer"
                    >
                      {[1, 2, 4, 6, 8, "10+"].map((g) => (
                        <option key={g} value={g} className="bg-[#111]">
                          {g} Guests
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-30">
                      ▼
                    </div>
                  </div>
                </div>
                <div className="contact-form-element">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3">
                    Schedule
                  </label>
                  <input
                    type="datetime-local"
                    name="date"
                    onChange={handleChange}
                    className="w-full bg-white/[0.03] border border-white/5 focus:border-cafe-brown/50 rounded-2xl px-6 py-4 text-white outline-none transition-all"
                    style={{ colorScheme: "dark" }}
                  />
                </div>
              </div>

              <div className="contact-form-element">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3">
                  Notes
                </label>
                <textarea
                  name="message"
                  onChange={handleChange}
                  rows="3"
                  className="w-full bg-white/[0.03] border border-white/5 focus:border-cafe-brown/50 rounded-2xl px-6 py-4 text-white outline-none transition-all resize-none"
                  placeholder="Any special requests..."
                ></textarea>
              </div>

              <AnimatePresence>
                {status && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`p-4 rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center gap-3 ${status === "success" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full animate-pulse ${status === "success" ? "bg-green-500" : "bg-red-500"}`}
                    />
                    {status === "success"
                      ? "Request Dispatched. Expect a call shortly."
                      : "Incomplete Fields detected."}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-cafe-brown hover:bg-white hover:text-black py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all duration-500 shadow-[0_20px_40px_rgba(198,124,78,0.2)]"
              >
                Confirm Reservation
              </motion.button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
