import styles from "./Navbar.module.css";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

function Navbar() {
  const { usuario } = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        <div>
          {usuario ? (
            <button
              onClick={handleLogout}
              className={styles.navButton}
            >
              Sair
            </button>
          ) : (
            <Link
              to="/login"
              className={styles.loginLink}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
