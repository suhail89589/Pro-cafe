import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config';
import { CheckCircle } from 'lucide-react';

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCart();
  const { user, token, loading } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [error, setError] = useState('');

  // Protect route
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login?redirect=/checkout');
      return;
    }

    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setDeliveryAddress(user.address || '');
    }
  }, [user, loading, navigate]);

  const tax = Math.round(totalPrice * 0.05);
  const orderTotal = totalPrice + tax;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!deliveryAddress) {
      setError('Please provide a delivery address');
      return;
    }

    if (cart.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setPlacingOrder(true);

    try {
      const items = cart.map(item => ({
        foodId: item.id,
        quantity: item.quantity,
        price: item.price,
      }));

      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          items,
          totalAmount: orderTotal,
          deliveryAddress,
          paymentMethod,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setCreatedOrder(data);
        setOrderSuccess(true);
        clearCart();
      } else {
        setError(data.message || 'Failed to place order. Try again.');
      }
    } catch (err) {
      console.error(err);
      setError('Connection error. Failed to communicate with server.');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-cafe-brown border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (orderSuccess && createdOrder) {
    return (
      <div className="pt-32 pb-24 min-h-screen bg-[#080808] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/mandala-ornament.png')] scale-150" />
        
        <div className="w-full max-w-md p-8 md:p-10 rounded-[2.5rem] bg-[#111] border border-white/5 shadow-2xl relative z-10 mx-4 text-center">
          <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6 mx-auto">
            <CheckCircle size={36} className="animate-bounce" />
          </div>
          <h3 className="text-3xl font-bold font-[Playfair_Display] text-white mb-2">
            Order Confirmed!
          </h3>
          <p className="text-gray-400 text-sm mb-6">
            Your imperial meal is now registered and being prepared.
          </p>

          <div className="bg-black border border-white/5 rounded-2xl p-4 w-full mb-8 text-left space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Order ID:</span>
              <span className="text-white font-mono font-bold">{createdOrder._id}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Estimated Delivery:</span>
              <span className="text-cafe-brown font-bold">25 - 30 Mins</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Method:</span>
              <span className="text-white font-bold">{createdOrder.paymentMethod}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/orders')}
              className="w-full py-4 bg-cafe-brown hover:bg-white hover:text-black text-white font-bold rounded-2xl uppercase tracking-widest text-xs transition-all"
            >
              Track Order
            </button>
            <button
              onClick={() => navigate('/menu')}
              className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl uppercase tracking-widest text-xs border border-white/10 transition-all"
            >
              Order More
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#080808] relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/mandala-ornament.png')] scale-150" />

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <header className="mb-12">
          <span className="text-cafe-brown font-mono tracking-[0.4em] uppercase text-xs">
            Finalize Order
          </span>
          <h1 className="text-4xl md:text-5xl font-bold font-[Playfair_Display] text-white mt-2">
            Secure Checkout
          </h1>
        </header>

        {cart.length === 0 ? (
          <div className="p-16 rounded-[2.5rem] bg-[#111] border border-white/5 text-center">
            <h3 className="text-xl text-white font-bold mb-4">No items to checkout</h3>
            <Link
              to="/menu"
              className="inline-flex px-8 py-3.5 bg-cafe-brown hover:bg-white hover:text-black text-white font-bold rounded-full uppercase tracking-widest text-xs transition-all"
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Input Details */}
            <div className="lg:col-span-2 space-y-8">
              {error && (
                <div className="p-4 rounded-2xl bg-red-950/20 border border-red-900/30 text-red-400 text-sm text-center">
                  {error}
                </div>
              )}

              {/* Delivery Details */}
              <div className="p-8 rounded-[2rem] bg-[#111] border border-white/5 space-y-6">
                <h3 className="text-xl font-bold font-[Playfair_Display] text-white">
                  1. Delivery Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-5 py-3.5 rounded-2xl bg-black border border-white/10 text-white focus:outline-none focus:border-cafe-brown transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-5 py-3.5 rounded-2xl bg-black border border-white/10 text-white focus:outline-none focus:border-cafe-brown transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">
                    Delivery Address
                  </label>
                  <textarea
                    rows="3"
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Apartment/Suite, Street address, City"
                    className="w-full px-5 py-3.5 rounded-2xl bg-black border border-white/10 text-white focus:outline-none focus:border-cafe-brown transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="p-8 rounded-[2rem] bg-[#111] border border-white/5 space-y-6">
                <h3 className="text-xl font-bold font-[Playfair_Display] text-white">
                  2. Payment Method
                </h3>

                <div className="space-y-4">
                  {[
                    { id: 'cod', name: 'Cash on Delivery', desc: 'Pay with cash upon arrival' },
                    { id: 'card', name: 'Card', desc: 'Simulate credit/debit card transaction' },
                  ].map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-start gap-4 p-5 rounded-2xl border transition-all cursor-pointer ${paymentMethod === method.name ? 'bg-cafe-brown/5 border-cafe-brown/40' : 'bg-black/30 border-white/5 hover:border-white/10'}`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.name}
                        checked={paymentMethod === method.name}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mt-1 accent-cafe-brown"
                      />
                      <div>
                        <span className="block text-white text-sm font-bold">{method.name}</span>
                        <span className="block text-gray-500 text-xs mt-1">{method.desc}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="p-8 rounded-[2rem] bg-[#111] border border-white/5 h-fit space-y-6 shadow-xl">
              <h3 className="text-xl font-bold font-[Playfair_Display] text-white">
                Order Review
              </h3>

              {/* Mini Item List */}
              <div className="space-y-4 max-h-[160px] overflow-y-auto no-scrollbar pr-1 border-b border-white/5 pb-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-xs">
                    <span className="text-gray-400 font-bold truncate max-w-[140px]">
                      {item.name} <span className="text-gray-600">x{item.quantity}</span>
                    </span>
                    <span className="text-white font-serif font-medium">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Subtotal</span>
                  <span>₹{totalPrice}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Tax (5%)</span>
                  <span>₹{tax}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Delivery</span>
                  <span className="text-green-500 font-bold">FREE</span>
                </div>
                <div className="h-[1px] bg-white/5 my-2" />
                <div className="flex justify-between text-white font-bold">
                  <span className="text-sm font-[Playfair_Display]">Order Total</span>
                  <span className="text-xl text-cafe-brown font-serif">₹{orderTotal}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={placingOrder}
                className="w-full py-4 bg-cafe-brown hover:bg-white hover:text-black text-white font-bold rounded-2xl uppercase tracking-widest text-xs transition-all duration-300 hover:scale-[1.02] shadow-[0_15px_30px_rgba(198,124,78,0.25)] flex items-center justify-center"
              >
                {placingOrder ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Place Order'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
