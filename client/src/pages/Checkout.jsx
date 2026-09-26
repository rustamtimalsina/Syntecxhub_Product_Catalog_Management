import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../api/orders';

function Checkout() {
  const navigate = useNavigate();
  const { cart, subtotal, clearCart } = useCart();
  const { user } = useAuth();

  const [shipping, setShipping] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Nepal'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const tax = Number((subtotal * 0.08).toFixed(2));
  const shippingFee = subtotal > 500 ? 0 : 25;
  const total = Number((subtotal + tax + shippingFee).toFixed(2));

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <h2 className="text-2xl font-bold">Your cart is empty</h2>
          <Link to="/" className="px-6 py-2.5 rounded-full bg-cyan-400 text-black font-semibold text-sm">
            Return to Catalog
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const orderPayload = {
      userId: user?.id || user?._id || null,
      shippingAddress: shipping,
      items: cart.map((item) => ({
        product: item._id,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity
      })),
      subtotal,
      tax,
      shippingFee,
      total
    };

    try {
      const res = await createOrder(orderPayload);
      clearCart();
      navigate(`/order-success/${res.order._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />

      <main className="max-w-6xl w-full mx-auto px-6 pt-32 pb-24 flex-1">
        <h1 className="text-3xl font-extrabold tracking-tight mb-8">Checkout</h1>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
            <div className="bg-neutral-900/60 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
              <h2 className="text-lg font-semibold mb-4 text-white">Shipping Information</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/60 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={shipping.fullName}
                    onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/60 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={shipping.email}
                    onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/60 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    required
                    value={shipping.address}
                    onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-white/60 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={shipping.city}
                      onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-white/60 mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      required
                      value={shipping.postalCode}
                      onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-full bg-cyan-400 hover:bg-cyan-300 text-black font-semibold text-base transition-colors shadow-lg shadow-cyan-400/20 disabled:opacity-50"
            >
              {loading ? 'Processing Order...' : `Place Order • $${total}`}
            </button>
          </form>

          <div className="lg:col-span-5 bg-neutral-900/60 border border-white/10 rounded-2xl p-6 backdrop-blur-md space-y-6">
            <h2 className="text-lg font-semibold text-white">Order Summary</h2>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
              {cart.map((item) => (
                <div key={item._id} className="flex gap-3 items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-xl object-cover bg-neutral-800"
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/100x100/1e293b/ffffff?text=Item';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate text-white">{item.name}</p>
                    <p className="text-xs text-white/50">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-medium text-white">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-white/60">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>Est. Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>Shipping</span>
                <span>{shippingFee === 0 ? 'Free' : `$${shippingFee.toFixed(2)}`}</span>
              </div>
              <div className="border-t border-white/10 pt-3 flex justify-between text-base font-bold text-white">
                <span>Total</span>
                <span>${total}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Checkout;