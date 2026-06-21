"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Plus, Minus, ShoppingBag, CheckCircle } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function CartDrawer() {
  const navigate = useNavigate();
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    totalItems,
    totalPrice,
  } = useCart();

  const handleCheckout = () => {
    closeCart();
    navigate("/checkout");
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />

          {/* Sliding Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-[#0d0d0d] border-l border-white/10 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag className="text-cafe-brown" size={22} />
                <h2 className="text-xl font-bold font-[Playfair_Display] text-white">
                  Your Cart
                </h2>
                {totalItems > 0 && (
                  <span className="bg-cafe-brown/10 text-cafe-brown text-xs font-bold px-2 py-0.5 rounded-full border border-cafe-brown/20">
                    {totalItems} {totalItems === 1 ? "item" : "items"}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="text-gray-400 hover:text-white transition-colors p-1.5 rounded-full bg-white/5 border border-white/5 hover:border-white/10"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
              {cart.length === 0 ? (
                /* Empty State */
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <ShoppingBag size={48} className="text-gray-700 mb-4" />
                  <p className="text-gray-400 font-medium mb-1">Your cart is empty</p>
                  <p className="text-gray-600 text-sm mb-6 max-w-xs">
                    Add some delicious items from our imperial menu to get started!
                  </p>
                  <button
                    onClick={closeCart}
                    className="px-6 py-2.5 bg-white/5 border border-white/10 hover:border-cafe-brown hover:text-cafe-brown text-white text-xs font-bold uppercase tracking-widest rounded-full transition-all"
                  >
                    Browse Menu
                  </button>
                </div>
              ) : (
                /* Cart Items List */
                <div className="space-y-4">
                  {cart.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex items-center gap-4 bg-[#141414] border border-white/5 p-4 rounded-2xl group hover:border-white/10 transition-colors"
                    >
                      {/* Image */}
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-900 flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Info & Quantity controls */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="text-white text-sm font-bold truncate pr-2">
                            {item.name}
                          </h4>
                          <span className="text-cafe-brown text-sm font-serif font-medium flex-shrink-0">
                            ₹{item.price * item.quantity}
                          </span>
                        </div>
                        <p className="text-gray-500 text-xs mb-3 uppercase tracking-wider font-mono">
                          {item.category}
                        </p>

                        <div className="flex items-center justify-between">
                          {/* Quantity selector (Update CRUD) */}
                          <div className="flex items-center gap-1.5 bg-black/40 border border-white/5 rounded-full p-1">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/5 transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="text-white text-xs font-bold w-6 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/5 transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          {/* Delete button (Delete CRUD) */}
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-600 hover:text-red-500 p-1.5 rounded-full hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Summary (Only if cart has items) */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-white/5 bg-[#0a0a0a] space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Subtotal</span>
                    <span>₹{totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Estimated Tax (5%)</span>
                    <span>₹{Math.round(totalPrice * 0.05)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Delivery</span>
                    <span className="text-green-500 font-bold">FREE</span>
                  </div>
                  <div className="h-[1px] bg-white/5 my-2" />
                  <div className="flex justify-between text-white font-bold">
                    <span className="text-sm font-[Playfair_Display]">Order Total</span>
                    <span className="text-lg text-cafe-brown font-serif">
                      ₹{totalPrice + Math.round(totalPrice * 0.05)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-4 bg-cafe-brown hover:bg-pizza-red text-white font-bold rounded-2xl uppercase tracking-widest text-xs transition-all duration-300 hover:scale-[1.02] shadow-[0_15px_30px_rgba(198,124,78,0.25)] flex items-center justify-center gap-2"
                >
                  Place Order
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
