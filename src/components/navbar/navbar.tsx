import style from "./navbar.module.css";

const Navbar: React.FC = () => {
    return (
        <nav
            className={style.navbar}
            role="navigation"
            aria-label="main navigation"
        >
            <div className="navbar-brand">
                <a className="navbar-item">
                    <span className={style.logoStyle}>Aoba</span>
                </a>
            </div>
        </nav>
    );
};
export default Navbar;
