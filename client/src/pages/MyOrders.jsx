import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { getUserOrders } from '../api/orders';

function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const currentUserId = user?.id || user?._id;
      if (!currentUserId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getUserOrders(currentUserId);
        setOrders(data);
      } catch (err) {
        setError('Failed to fetch your order history.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Shipped':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Processing':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      default:
        return 'bg-white/10 text-white/60 border-white/15';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />

      <main className="max-w-5xl w-full mx-auto px-6 pt-32 pb-24 flex-1">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight">Order History</h1>
          <p className="text-white/50 text-sm mt-1">Review your past purchases and track real-time delivery status</p>
        </div>

        {loading ? (
          <div className="p-16 text-center text-white/40">Loading your orders...</div>
        ) : error ? (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-neutral-900/40 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
            <p className="text-white/50 text-base mb-6">You have not placed any orders yet.</p>
            <Link
              to="/"
              className="px-6 py-3 rounded-full bg-cyan-400 hover:bg-cyan-300 text-black font-semibold text-sm transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-neutral-900/60 border border-white/10 rounded-2xl p-6 backdrop-blur-md transition-all hover:border-white/20"
              >
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 mb-4">
                  <div className="space-y-1">
                    <span className="text-xs text-white/40 uppercase tracking-wider">Order ID</span>
                    <p className="font-mono text-xs text-cyan-400 font-semibold">{order._id}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-xs text-white/40 uppercase tracking-wider block">Placed On</span>
                      <span className="text-xs text-white/80">
                        {new Date(order.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>

                    <span
                      className={`text-xs px-3 py-1 rounded-full border font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Items in this Order */}
                <div className="divide-y divide-white/5 mb-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-3 flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 rounded-xl object-cover bg-neutral-800"
                        onError={(e) => {
                          e.target.src = 'https://placehold.co/100x100/1e293b/ffffff?text=Item';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold truncate text-white">{item.name}</h4>
                        <p className="text-xs text-white/50">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-white">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="flex flex-wrap items-center justify-between border-t border-white/10 pt-4 text-xs text-white/60 gap-4">
                  <div>
                    Ship to: <span className="text-white font-medium">{order.shippingAddress?.fullName}</span> (
                    {order.shippingAddress?.city}, {order.shippingAddress?.country})
                  </div>
                  <div className="text-right">
                    Total Amount:{' '}
                    <span className="text-base font-bold text-cyan-400 ml-1">${order.total}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default MyOrders;