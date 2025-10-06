import { Link, useLocation } from "react-router-dom";

const Navigation = () =>{
  const { pathname } = useLocation();

  return (
    <nav style={styles.nav}>
      <ul style={styles.ul}>
        <li>
          <Link
            to="/"
            style={{
              ...styles.link,
              ...(pathname === "/" ? styles.active : {}),
            }}
          >
            Inicio
          </Link>
        </li>
        <li>
          <Link
            to="/contact"
            style={{
              ...styles.link,
              ...(pathname === "/contact" ? styles.active : {}),
            }}
          >
            Contacto
          </Link>
        </li>
      </ul>
    </nav>
  );
}
export default Navigation;

const styles = {
  nav: {
    borderBottom: "1px solid #e3e3e3",
    padding: "12px 0",
    marginBottom: 24,
  },
  ul: {
    listStyle: "none",
    display: "flex",
    gap: 16,
    margin: 0,
    padding: 0,
    justifyContent: "center",
  },
  link: {
    textDecoration: "none",
    color: "#333",
    fontWeight: 600,
  },
  active: {
    color: "#646cff",
  },
};
