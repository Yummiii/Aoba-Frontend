import style from "./navbar.module.css";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
    return (
        <nav
            className={`navbar ${style.navbarFoda}`}
            role="navigation"
            aria-label="main navigation"
        >
            <div className="navbar-brand">
                <Link className="navbar-item" to="/">
                    <span className={style.logoStyle}>Aoba</span>
                </Link>
            </div>

            <div id="navbarBasicExample" className="navbar-menu">
                <div className="navbar-start">
                    <Link
                        to="/pub"
                        className={`navbar-item ${style.navbarElementFoda}`}
                    >
                        <FontAwesomeIcon icon={faGlobe} className="fa-fw" />
                        Públicas
                    </Link>
                </div>
            </div>
        </nav>
    );
};
export default Navbar;
