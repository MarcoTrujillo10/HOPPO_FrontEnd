import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";
import { useCart } from "../hooks/useCart.jsx";
import { categoryService } from "../services/api";
import "./Header.css";
 
const Header = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, isAuthenticated, logout } = useAuth();
  const { getCartTotals } = useCart();
  const cartTotals = getCartTotals();
 
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const response = await categoryService.getCategories();
        setCategories(response.data.content || response.data || []);
      } catch (error) {
        console.error('Error loading categories:', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);
 
  const isActive = (path) =>
    pathname === path ? { color: "#13a4ec" } : undefined;
 
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
 
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
 
  const handleLogout = () => {
    logout();
    closeMobileMenu();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/productos?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };
 
  return (
    <header className="hdr">
      <div className="container hdr__inner">
        <div className="hdr__left">
          <Link className="brand" to="/" onClick={closeMobileMenu}>
            <svg className="brand__icon" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
            </svg>
            <h2 className="brand__text">HOPPO</h2>
          </Link>
 
          <nav className="nav">
            <Link className="nav__link" style={isActive("/")} to="/">Inicio</Link>
 
            <div className="nav__dropdown">
              <span className="nav__dropdown-trigger">Componentes</span>
              <div className="nav__dropdown-menu">
                {loading ? (
                  <div className="nav__dropdown-link">Cargando...</div>
                ) : categories.filter(cat => cat.type === 'COMPONENTE').length > 0 ? (
                  categories.filter(cat => cat.type === 'COMPONENTE').map((category) => (
                    <Link
                      key={category.id}
                      className="nav__dropdown-link"
                      to={`/productos?categoria=${encodeURIComponent(category.description)}&tipo=${category.type}`}
                    >
                      {category.description}
                    </Link>
                  ))
                ) : (
                  <div className="nav__dropdown-link">No hay componentes</div>
                )}
              </div>
            </div>
 
            <div className="nav__dropdown">
              <span className="nav__dropdown-trigger">Periféricos</span>
              <div className="nav__dropdown-menu">
                {loading ? (
                  <div className="nav__dropdown-link">Cargando...</div>
                ) : categories.filter(cat => cat.type === 'PERIFERICO').length > 0 ? (
                  categories.filter(cat => cat.type === 'PERIFERICO').map((category) => (
                    <Link
                      key={category.id}
                      className="nav__dropdown-link"
                      to={`/productos?categoria=${encodeURIComponent(category.description)}&tipo=${category.type}`}
                    >
                      {category.description}
                    </Link>
                  ))
                ) : (
                  <div className="nav__dropdown-link">No hay periféricos</div>
                )}
              </div>
            </div>
 
            <Link className="nav__link" style={isActive("/productos")} to="/productos">Todos los Productos</Link>
          </nav>
        </div>
 
        <div className="hdr__right">
          <form className="search" onSubmit={handleSearch}>
            <svg className="search__icon" viewBox="0 0 24 24" fill="none" onClick={handleSearch} style={{ cursor: 'pointer' }}>
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input 
              className="search__input" 
              placeholder="Buscar productos..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearchKeyPress}
            />
          </form>
 
                    {isAuthenticated() ? (
            <div className="user-menu">
              <span className="user-greeting">Hola, {user?.firstName || user?.name || 'Usuario'}</span>
              <Link to="/profile" className="iconbtn" title="Perfil">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </Link>
              {user?.role === 'VENDEDOR' && (
                <Link to="/admin" className="iconbtn" title="Panel de Administración">
                  <svg viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                    <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                    <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                    <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </Link>
              )}
              <button onClick={handleLogout} className="iconbtn logout-btn" title="Cerrar Sesión">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="16,17 21,12 16,7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn--ghost btn--small">
                Iniciar Sesión
              </Link>
              <Link to="/register" className="btn btn--primary btn--small">
                Registrarse
              </Link>
            </div>
          )}

          {pathname !== '/admin' && user?.role !== 'VENDEDOR' && (
            <Link to="/cart" className="iconbtn cart-btn" title="Carrito">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="9" cy="21" r="1" fill="currentColor"/>
                <circle cx="20" cy="21" r="1" fill="currentColor"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {cartTotals.itemCount > 0 && (
                <span className="cart-badge">{cartTotals.itemCount}</span>
              )}
            </Link>
          )}
 
          <button
            className={`hamburger ${isMobileMenuOpen ? 'hamburger--active' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
 
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={closeMobileMenu}></div>
      )}
 
      <nav className={`mobile-menu ${isMobileMenuOpen ? 'mobile-menu--open' : ''}`}>
        <div className="mobile-menu__content">
          <Link
            className="mobile-menu__link"
            style={isActive("/")}
            to="/"
            onClick={closeMobileMenu}
          >
            🏠 Inicio
          </Link>
 
          <div className="mobile-menu__section">
            <h3 className="mobile-menu__section-title">💻 Componentes</h3>
            {loading ? (
              <div className="mobile-menu__sublink">Cargando...</div>
            ) : categories.filter(cat => cat.type === 'COMPONENTE').length > 0 ? (
              categories.filter(cat => cat.type === 'COMPONENTE').map((category) => (
                <Link
                  key={category.id}
                  className="mobile-menu__sublink"
                  to={`/productos?categoria=${encodeURIComponent(category.description)}&tipo=${category.type}`}
                  onClick={closeMobileMenu}
                >
                  {category.description}
                </Link>
              ))
            ) : (
              <div className="mobile-menu__sublink">No hay componentes</div>
            )}
          </div>
 
          <div className="mobile-menu__section">
            <h3 className="mobile-menu__section-title">⌨️ Periféricos</h3>
            {loading ? (
              <div className="mobile-menu__sublink">Cargando...</div>
            ) : categories.filter(cat => cat.type === 'PERIFERICO').length > 0 ? (
              categories.filter(cat => cat.type === 'PERIFERICO').map((category) => (
                <Link
                  key={category.id}
                  className="mobile-menu__sublink"
                  to={`/productos?categoria=${encodeURIComponent(category.description)}&tipo=${category.type}`}
                  onClick={closeMobileMenu}
                >
                  {category.description}
                </Link>
              ))
            ) : (
              <div className="mobile-menu__sublink">No hay periféricos</div>
            )}
          </div>
 
          <Link
            className="mobile-menu__link"
            style={isActive("/productos")}
            to="/productos"
            onClick={closeMobileMenu}
          >
            📦 Todos los Productos
          </Link>
 
          <div className="mobile-menu__section">
            {isAuthenticated() ? (
              <>
                <div className="mobile-menu__user-info">
                  <span>Hola, {user?.firstName || user?.name || 'Usuario'}</span>
                  <small>{user?.role || 'Usuario'}</small>
                </div>
                <Link
                  className="mobile-menu__link"
                  to="/profile"
                  onClick={closeMobileMenu}
                >
                  👤 Mi Perfil
                </Link>
                <button
                  className="mobile-menu__link mobile-menu__link--logout"
                  onClick={handleLogout}
                >
                  🚪 Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  className="mobile-menu__link"
                  to="/login"
                  onClick={closeMobileMenu}
                >
                  🔑 Iniciar Sesión
                </Link>
                <Link
                  className="mobile-menu__link"
                  to="/register"
                  onClick={closeMobileMenu}
                >
                  📝 Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};
 
export default Header;