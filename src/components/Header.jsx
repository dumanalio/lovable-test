import { useShop } from "../contexts/ShopContext";

function Header() {
  const { state } = useShop();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="glassmorphism">
      <div className="logo-container">
        <i className="fas fa-image logo-icon"></i>
        <h1 className="gradient-text">PosterLux</h1>
      </div>
      <nav>
        <button className="nav-link" onClick={() => scrollToSection("hero")}>
          <i className="fas fa-home"></i> Home
        </button>
        <button
          className="nav-link"
          onClick={() => scrollToSection("products")}
        >
          <i className="fas fa-th-large"></i> Gallery
        </button>
        <button className="nav-link" onClick={() => scrollToSection("contact")}>
          <i className="fas fa-envelope"></i> Kontakt
        </button>
        <div className="cart-icon">
          <i className="fas fa-shopping-cart"></i>
          <span className="cart-count">{state.cart.length}</span>
        </div>
      </nav>
    </header>
  );
}

export default Header;
