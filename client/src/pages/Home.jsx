import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../api/products';

const CATEGORIES = ['All', 'Smartphones', 'Laptops', 'Audio', 'Wearables', 'Gaming', 'Accessories', 'Cameras'];

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1 });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = { page, limit: 8 };
        if (search) params.search = search;
        if (category !== 'All') params.category = category;

        const data = await getProducts(params);
        setProducts(data.products);
        setPagination(data.pagination);
      } catch (err) {
        setError('Failed to load products. Is the backend running?');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [search, category, page]);

  return (
    <div>
      <Navbar />

      {/* Hero */}
      <section className="pt-40 pb-20 px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">
          TECH THAT MOVES YOU.
        </h1>
        <p className="text-white/60 max-w-xl mx-auto">
          Discover the latest smartphones, laptops, audio gear, and more — curated for people who care about their tech.
        </p>
      </section>

      {/* Search + Filters */}
      <section className="max-w-7xl mx-auto px-6 mb-10">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <input
            type="text"
            placeholder="Search products, brands..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full md:w-96 bg-white/5 border border-white/10 rounded-full px-5 py-3 text-sm focus:outline-none focus:border-cyan-400/50"
          />

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => { setCategory(cat); setPage(1); }}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  category === cat
                    ? 'bg-cyan-400 text-black'
                    : 'bg-white/5 text-white/70 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        {loading && <p className="text-center text-white/50">Loading products...</p>}
        {error && <p className="text-center text-red-400">{error}</p>}

        {!loading && !error && products.length === 0 && (
          <p className="text-center text-white/50">No products found.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-10 h-10 rounded-full text-sm ${
                  page === p ? 'bg-cyan-400 text-black' : 'bg-white/5 text-white/70 hover:bg-white/10'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;