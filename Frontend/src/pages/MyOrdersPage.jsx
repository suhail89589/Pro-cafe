import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config';

export default function MyOrdersPage() {
  const { user, token, loading } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login?redirect=/orders');
      return;
    }

    const fetchOrders = async () => {
      if (!token) return;
      try {
        const response = await fetch(`${API_BASE_URL}/api/orders`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        }
      } catch (error) {
        console.error('Failed to fetch orders', error);
      } finally {
        setFetching(false);
      }
    };

    fetchOrders();
  }, [user, token, loading, navigate]);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        alert('Order cancelled successfully!');
        // Update local list
        setOrders(prevOrders =>
          prevOrders.map(o => o._id === orderId ? { ...o, orderStatus: 'Cancelled' } : o)
        );
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(prev => ({ ...prev, orderStatus: 'Cancelled' }));
        }
      } else {
        alert(data.message || 'Failed to cancel order');
      }
    } catch (err) {
      console.error(err);
      alert('Error cancelling order');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'Confirmed': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'Preparing': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      case 'Out for Delivery': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'Delivered': return 'text-green-500 bg-green-500/10 border-green-500/20';
      default: return 'text-red-500 bg-red-500/10 border-red-500/20'; // Cancelled
    }
  };

  if (loading || fetching) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-cafe-brown border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#080808] relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/mandala-ornament.png')] scale-150" />

      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <header className="mb-12">
          <span className="text-cafe-brown font-mono tracking-[0.4em] uppercase text-xs">
            Feast History
          </span>
          <h1 className="text-4xl md:text-5xl font-bold font-[Playfair_Display] text-white mt-2">
            My Orders
          </h1>
        </header>

        {orders.length === 0 ? (
          <div className="p-12 rounded-[2rem] bg-[#111] border border-white/5 text-center">
            <p className="text-gray-400 text-lg mb-6">You haven't placed any orders yet!</p>
            <button
              onClick={() => navigate('/menu')}
              className="px-8 py-3.5 bg-cafe-brown hover:bg-white hover:text-black text-white font-bold rounded-full uppercase tracking-widest text-xs transition-all"
            >
              Order Now
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="p-6 md:p-8 rounded-[2rem] bg-[#111] border border-white/5 hover:border-white/10 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-gray-500">ID: {order._id}</span>
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </div>
                  <h4 className="text-xl font-bold text-white">
                    ₹{order.totalAmount}
                  </h4>
                  <p className="text-gray-500 text-xs">
                    Placed on: {new Date(order.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-full text-xs font-bold uppercase tracking-wider border border-white/10 transition-all"
                  >
                    View Details
                  </button>
                  {order.orderStatus === 'Pending' && (
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      className="px-5 py-2.5 bg-red-950/20 hover:bg-red-900/30 text-red-400 rounded-full text-xs font-bold uppercase tracking-wider border border-red-900/30 transition-all"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-8 rounded-[2.5rem] bg-[#0d0d0d] border border-white/10 shadow-2xl relative">
            <h3 className="text-2xl font-bold font-[Playfair_Display] text-white mb-2">
              Order Details
            </h3>
            <p className="text-xs font-mono text-gray-500 mb-6">ID: {selectedOrder._id}</p>

            <div className="space-y-4 max-h-[300px] overflow-y-auto no-scrollbar mb-6 pr-2">
              {selectedOrder.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-4 rounded-xl">
                  <div>
                    <h5 className="text-white text-sm font-bold">{item.name}</h5>
                    <p className="text-gray-500 text-xs">Quantity: {item.quantity}</p>
                  </div>
                  <span className="text-cafe-brown font-serif font-medium text-sm">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-white/5 pt-4 space-y-2 mb-6">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Payment Method:</span>
                <span className="text-white">{selectedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Payment Status:</span>
                <span className="text-white">{selectedOrder.paymentStatus}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Delivery Address:</span>
                <span className="text-white text-right max-w-[200px] truncate" title={selectedOrder.deliveryAddress}>
                  {selectedOrder.deliveryAddress}
                </span>
              </div>
              <div className="h-[1px] bg-white/5 my-2" />
              <div className="flex justify-between text-white font-bold">
                <span className="text-sm font-[Playfair_Display]">Total Amount Paid:</span>
                <span className="text-lg text-cafe-brown font-serif">₹{selectedOrder.totalAmount}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setSelectedOrder(null)}
                className="flex-1 py-3 bg-white/5 hover:bg-white hover:text-black text-white font-bold rounded-2xl uppercase tracking-widest text-xs transition-all"
              >
                Close
              </button>
              {selectedOrder.orderStatus === 'Pending' && (
                <button
                  onClick={() => {
                    handleCancelOrder(selectedOrder._id);
                  }}
                  className="flex-1 py-3 bg-red-950/20 hover:bg-red-900/30 text-red-400 font-bold rounded-2xl uppercase tracking-widest text-xs border border-red-900/30 transition-all"
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
