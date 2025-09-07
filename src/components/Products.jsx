import { useState, useEffect } from "react";
import { useShop } from "../contexts/ShopContext";

function Products() {
  const { state, addToCart, toggleWishlist, setFilter } = useShop();
  const [filteredProducts, setFilteredProducts] = useState(state.products);

  useEffect(() => {
    if (state.activeFilter === "all") {
      setFilteredProducts(state.products);
    } else {
      setFilteredProducts(
        state.products.filter(
          (product) => product.category === state.activeFilter
        )
      );
    }
  }, [state.activeFilter, state.products]);

  const handleFilterClick = (filter) => {
    setFilter(filter);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const handleToggleWishlist = (product) => {
    toggleWishlist(product);
  };

  const isInWishlist = (productId) => {
    return state.wishlist.some((item) => item.id === productId);
  };

  return (
    <section className="products-section">
      <div className="section-header">
        <h2 className="section-title">Kuratierte Kollektion</h2>
        <div className="filter-tabs">
          <button
            className={`filter-tab ${
              state.activeFilter === "all" ? "active" : ""
            }`}
            onClick={() => handleFilterClick("all")}
          >
            Alle
          </button>
          <button
            className={`filter-tab ${
              state.activeFilter === "abstract" ? "active" : ""
            }`}
            onClick={() => handleFilterClick("abstract")}
          >
            Abstract
          </button>
          <button
            className={`filter-tab ${
              state.activeFilter === "nature" ? "active" : ""
            }`}
            onClick={() => handleFilterClick("nature")}
          >
            Natur
          </button>
          <button
            className={`filter-tab ${
              state.activeFilter === "minimal" ? "active" : ""
            }`}
            onClick={() => handleFilterClick("minimal")}
          >
            Minimal
          </button>
        </div>
      </div>

      <div className="products-grid">
        {filteredProducts.map((product, index) => (
          <div
            key={product.id}
            className="product-card glassmorphism"
            style={{
              animationDelay: `${index * 0.1}s`,
            }}
          >
            <div className="product-image">
              <img src={product.image} alt={product.name} />
              <div className="product-overlay">
                <button className="quick-view-btn">
                  <i className="fas fa-eye"></i>
                </button>
                <button
                  className="wishlist-btn"
                  onClick={() => handleToggleWishlist(product)}
                >
                  <i
                    className={`fas fa-heart ${
                      isInWishlist(product.id) ? "active" : ""
                    }`}
                  ></i>
                </button>
              </div>
            </div>
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <div className="product-meta">
                <span className="price">{product.price.toFixed(2)} €</span>
                <div className="rating">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <span>({product.rating})</span>
                </div>
              </div>
              <button
                className="add-to-cart-btn"
                onClick={() => handleAddToCart(product)}
              >
                <i className="fas fa-cart-plus"></i>
                In den Warenkorb
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Products;
