import { useEffect, useState } from 'react';
import './App.css';

interface Product {
  product_id: string;
  image_url: string;
  title: string;
  price: number;
  quantity: number;
  variant_title?: string;
}

const SUPABASE_API =
  'https://xortfbiqcijhmvxolnhb.supabase.co/rest/v1/cart_products?shop=eq.metafront.myshopify.com';

const API_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvcnRmYmlxY2lqaG12eG9sbmhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNDgwNTEsImV4cCI6MjA2NjkyNDA1MX0.12VpkBWQwtzlONr2dF_KHz7thm9ud9en6Ph7_fUR1Qc';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(SUPABASE_API, {
          headers: {
            apikey: API_KEY,
            Authorization: `Bearer ${API_KEY}`,
          },
        });

        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const formatCurrency = (amount: number): string =>
    new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
    }).format(amount);

  const handlePrint = () => window.print();

  const handleExportCSV = () => {
    const rows = [
      ['Product Title', 'Price', 'Quantity', 'Total'],
      ...products.map((p) => [
        p.title,
        p.price,
        p.quantity,
        p.price * p.quantity,
      ]),
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      rows.map((e) => e.join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'cart_products.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  return (
    <div className="cart-container">
      <h1>🛒 Shopping Cart</h1>

      <div className="action-buttons">
        <button onClick={handlePrint}>🖨️ Print</button>
        <button onClick={handleExportCSV}>📤 Export CSV</button>
        <button onClick={handleShare}>🔗 Share</button>
      </div>

      <div className="cart-header">
        <span>Product</span>
        <span>Quantity</span>
        <span>Total</span>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : products.length > 0 ? (
        products.map((product) => (
          <div key={product.product_id} className="cart-row">
            <div className="product-info">
              <img
                src={product.image_url}
                alt={product.title}
                width="80"
                height="80"
              />
              <div>
                <p className="product-title">{product.title}</p>
                <p>{formatCurrency(product.price)}</p>
                {product.variant_title && (
                  <p className="variant">{product.variant_title}</p>
                )}
              </div>
            </div>

            <div className="quantity">{product.quantity}</div>
            <div className="total">
              {formatCurrency(product.price * product.quantity)}
            </div>
          </div>
        ))
      ) : (
        <p>No products in cart.</p>
      )}
    </div>
  );
}

export default App;
