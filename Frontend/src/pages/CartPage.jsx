import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    totalPrice,
  } = useCart();
  const navigate = useNavigate();

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#080808] relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/mandala-ornament.png')] scale-150" />

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <header className="mb-12">
          <span className="text-cafe-brown font-mono tracking-[0.4em] uppercase text-xs">
            Your Selection
          </span>
          <h1 className="text-4xl md:text-5xl font-bold font-[Playfair_Display] text-white mt-2">
            Shopping Cart
          </h1>
        </header>

        {cart.length === 0 ? (
          <div className="p-16 rounded-[2.5rem] bg-[#111] border border-white/5 text-center">
            <ShoppingBag size={48} className="text-gray-700 mx-auto mb-6" />
            <h3 className="text-xl text-white font-bold mb-2">Your cart is empty</h3>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              Add some gourmet specialties from our imperial menu to begin.
            </p>
            <Link
              to="/menu"
              className="inline-flex px-8 py-3.5 bg-cafe-brown hover:bg-white hover:text-black text-white font-bold rounded-full uppercase tracking-widest text-xs transition-all"
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-6">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-6 bg-[#111] border border-white/5 p-6 rounded-[2rem] hover:border-white/10 transition-colors"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-2xl object-cover bg-neutral-900 flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-white text-base md:text-lg font-bold truncate pr-4">
                        {item.name}
                      </h4>
                      <span className="text-cafe-brown font-serif font-medium text-base md:text-lg">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider font-mono mb-4">
                      {item.category}
                    </p>

                    <div className="flex items-center justify-between">
                      {/* Quantity selector */}
                      <div className="flex items-center gap-2 bg-black/40 border border-white/5 rounded-full p-1.5">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/5 transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-white text-sm font-bold w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/5 transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Remove item */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-600 hover:text-red-500 p-2 rounded-full hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Panel */}
            <div className="p-8 rounded-[2rem] bg-[#111] border border-white/5 h-fit space-y-6 shadow-xl">
              <h3 className="text-xl font-bold font-[Playfair_Display] text-white">
                Order Summary
              </h3>

              <div className="space-y-4">
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
                  <span className="text-xl text-cafe-brown font-serif">
                    ₹{totalPrice + Math.round(totalPrice * 0.05)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-4 bg-cafe-brown hover:bg-pizza-red text-white font-bold rounded-2xl uppercase tracking-widest text-xs transition-all duration-300 hover:scale-[1.02] shadow-[0_15px_30px_rgba(198,124,78,0.25)] flex items-center justify-center"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
