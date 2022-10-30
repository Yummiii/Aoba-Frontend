import style from "./navbar.module.css";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Navbar: React.FC = () => {
    return (
        <nav
            className={`navbar ${style.navbarFoda}`}
            role="navigation"
            aria-label="main navigation"
        >
            <div className="navbar-brand">
                <a className="navbar-item" href="/">
                    <span className={style.logoStyle}>Aoba</span>
                </a>
            </div>

            <div id="navbarBasicExample" className="navbar-menu">
                <div className="navbar-start">
                    <a className={`navbar-item ${style.navbarElementFoda}`} href="/pub">
                        <FontAwesomeIcon icon={faGlobe} className="fa-fw"/>Públicas
                    </a>
                </div>
            </div>
        </nav>
    );
};
export default Navbar;
