import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getOrderById } from '../api/orders';

function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    getOrderById(id).then(setOrder).catch(console.error);
  }, [id]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-6 pt-32 pb-24">
        <div className="max-w-md w-full text-center bg-neutral-900/60 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
          <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            ✓
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">Order Confirmed!</h1>
          <p className="text-white/50 text-sm mb-6">
            Thank you for your purchase. We have received your order and are preparing it for shipment.
          </p>

          <div className="bg-white/5 rounded-xl p-4 text-left text-xs space-y-2 mb-6 border border-white/10">
            <div className="flex justify-between text-white/60">
              <span>Order ID:</span>
              <span className="font-mono text-white truncate max-w-[180px]">{id}</span>
            </div>
            {order && (
              <div className="flex justify-between text-white/60">
                <span>Total Paid:</span>
                <span className="text-cyan-400 font-bold">${order.total}</span>
              </div>
            )}
          </div>

          <Link
            to="/"
            className="block w-full py-3 rounded-full bg-cyan-400 hover:bg-cyan-300 text-black font-semibold text-sm transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    </div>
  );
}

export default OrderSuccess;