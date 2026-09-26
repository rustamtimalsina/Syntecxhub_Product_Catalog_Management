import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

function CartDrawer() {
  const { cart, isOpen, setIsOpen, updateQuantity, removeFromCart, subtotal, totalItems } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
          />

          {/* Slide-over panel */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-screen max-w-md bg-neutral-900 border-l border-white/10 text-white flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold tracking-tight">Your Cart</h2>
                  <span className="text-xs bg-cyan-400/20 text-cyan-400 px-2.5 py-0.5 rounded-full font-medium">
                    {totalItems}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-white/60 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <p className="text-white/40 text-sm mb-4">Your shopping bag is empty.</p>
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="px-5 py-2 rounded-full border border-white/20 text-sm hover:bg-white/5"
                    >
                      Browse Tech
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item._id}
                      className="flex gap-4 p-3 rounded-2xl bg-white/5 border border-white/10 items-center"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover bg-black/20"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/150';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold truncate">{item.name}</h4>
                        <p className="text-xs text-white/50 mb-2">${item.price}</p>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center text-xs hover:bg-white/20"
                          >
                            -
                          </button>
                          <span className="text-xs font-semibold px-1">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center text-xs hover:bg-white/20"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item._id)}
                          className="text-xs text-red-400 hover:text-red-300 mt-2 inline-block"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Summary / Checkout footer */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-white/10 bg-neutral-950/50 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-white/60">Subtotal</span>
                    <span className="text-lg font-bold">${subtotal.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-white/40">Taxes and shipping calculated at checkout.</p>
                  <button
                    type="button"
                    className="w-full py-3.5 rounded-full bg-cyan-400 hover:bg-cyan-300 text-black font-semibold tracking-wide transition-colors shadow-lg shadow-cyan-400/20"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default CartDrawer;