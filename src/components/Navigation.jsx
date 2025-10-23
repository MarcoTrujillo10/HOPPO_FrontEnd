import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";
import { categoryService } from "../services/api";
 
const Navigation = () => {
  const { pathname, search } = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCategories, setShowCategories] = useState(false);
 
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
 
  const isActive = (path) => pathname === path;
 
  const isActiveCategory = (categoryId) => {
    return pathname.includes(`/productos`) &&
           new URLSearchParams(search).get('categoria') === categoryId;
  };
 
  return (
    <nav style={styles.nav} className="navigation-container">
      <style>{mobileStyles}</style>
      <div className="container">
        <ul style={styles.ul}>
          <li>
            <Link
              to="/"
              style={{
                ...styles.link,
                ...(isActive("/") ? styles.active : {}),
              }}
            >
              🏠 Inicio
            </Link>
          </li>
 
          <li>
            <Link
              to="/productos"
              style={{
                ...styles.link,
                ...(isActive("/productos") ? styles.active : {}),
              }}
            >
              🛍️ Productos
            </Link>
          </li>
 
          <li style={styles.dropdownContainer}>
            <button
              style={{
                ...styles.link,
                ...styles.dropdownButton,
                ...(showCategories ? styles.active : {}),
              }}
              onMouseEnter={() => setShowCategories(true)}
              onMouseLeave={() => setShowCategories(false)}
            >
              📂 Categorías ▼
            </button>
            {showCategories && (
              <div
                style={styles.dropdown}
                className="dropdown"
                onMouseEnter={() => setShowCategories(true)}
                onMouseLeave={() => setShowCategories(false)}
              >
                {loading ? (
                  <div style={styles.dropdownItem} className="dropdown-item">Cargando...</div>
                ) : categories.length > 0 ? (
                  <>
                    <div style={styles.dropdownSection}>
                      <div style={styles.dropdownSectionTitle}>🔧 Componentes</div>
                      {categories.filter(cat => cat.type === 'COMPONENTE').map((category) => (
                        <Link
                          key={category.id}
                          to={`/productos?categoria=${encodeURIComponent(category.description)}&tipo=${category.type}`}
                          style={{
                            ...styles.dropdownItem,
                            ...(isActiveCategory(category.description) ? styles.activeDropdownItem : {}),
                          }}
                          className="dropdown-item"
                        >
                          {category.description}
                        </Link>
                      ))}
                    </div>
 
                    <div style={styles.dropdownSection}>
                      <div style={styles.dropdownSectionTitle}>🖱️ Periféricos</div>
                      {categories.filter(cat => cat.type === 'PERIFERICO').map((category) => (
                        <Link
                          key={category.id}
                          to={`/productos?categoria=${encodeURIComponent(category.description)}&tipo=${category.type}`}
                          style={{
                            ...styles.dropdownItem,
                            ...(isActiveCategory(category.description) ? styles.activeDropdownItem : {}),
                          }}
                          className="dropdown-item"
                        >
                          {category.description}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <div style={styles.dropdownItem} className="dropdown-item">No hay categorías</div>
                )}
              </div>
            )}
          </li>
 
          <li>
            <Link
              to="/pc-builder"
              style={{
                ...styles.link,
                ...(isActive("/pc-builder") ? styles.active : {}),
              }}
            >
              🔧 PC Builder
            </Link>
          </li>
 
          {isAuthenticated() && user?.role === 'VENDEDOR' && (
            <li>
              <Link
                to="/admin"
                style={{
                  ...styles.link,
                  ...styles.adminLink,
                  ...(isActive("/admin") ? styles.active : {}),
                }}
              >
                🛠️ Admin
              </Link>
            </li>
          )}
 
          <li>
            <Link
              to="/contact"
              style={{
                ...styles.link,
                ...(isActive("/contact") ? styles.active : {}),
              }}
            >
              📞 Contacto
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};
 
export default Navigation;
 
const styles = {
  nav: {
    borderBottom: "1px solid #e3e3e3",
    padding: "12px 0",
    marginBottom: 24,
    backgroundColor: "#f8f9fa",
  },
  ul: {
    listStyle: "none",
    display: "flex",
    gap: 16,
    margin: 0,
    padding: 0,
    justifyContent: "center",
    flexWrap: "wrap",
    alignItems: "center",
  },
  link: {
    textDecoration: "none",
    color: "#333",
    fontWeight: 600,
    padding: "8px 12px",
    borderRadius: "6px",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  active: {
    color: "#646cff",
    backgroundColor: "#e8f0fe",
  },
  dropdownContainer: {
    position: "relative",
  },
  dropdownButton: {
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    backgroundColor: "white",
    border: "1px solid #e3e3e3",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    minWidth: "200px",
    zIndex: 1000,
    padding: "8px 0",
    marginTop: "4px",
    maxHeight: "300px",
    overflowY: "auto",
  },
  dropdownItem: {
    display: "block",
    padding: "8px 16px",
    textDecoration: "none",
    color: "#333",
    fontSize: "14px",
    transition: "background-color 0.2s ease",
  },
  activeDropdownItem: {
    backgroundColor: "#e8f0fe",
    color: "#646cff",
  },
  dropdownSection: {
    borderBottom: "1px solid #f0f0f0",
    paddingBottom: "4px",
    marginBottom: "4px",
  },
  dropdownSectionTitle: {
    padding: "8px 16px 4px 16px",
    fontSize: "12px",
    fontWeight: "700",
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    backgroundColor: "#f8f9fa",
    borderBottom: "1px solid #e9ecef",
  },
  adminLink: {
    backgroundColor: "#fff3cd",
    color: "#856404",
    border: "1px solid #ffeaa7",
  },
};
 
const mobileStyles = `
  @media (max-width: 768px) {
    .navigation-container ul {
      flex-direction: column;
      gap: 8px;
      padding: 16px;
    }
    
    .navigation-container .dropdown {
      position: static;
      box-shadow: none;
      border: none;
      background-color: #f8f9fa;
      margin-top: 8px;
      border-radius: 4px;
    }
    
    .navigation-container .dropdown-item {
      padding: 12px 16px;
      border-bottom: 1px solid #e9ecef;
    }
    
    .navigation-container .dropdown-item:last-child {
      border-bottom: none;
    }
  }
`;