import style from "./navbar.module.css";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import useLogin from "../../hooks/login";

const Navbar: React.FC = () => {
    const [active, setActive] = useState(false);
    const { logged, name, id } = useLogin(false);
    const [avatar, setAvatar] = useState("");
    const [dropdownActive, setDropDownActive] = useState(false);

    useEffect(() => {
        if (logged) {
            setAvatar(`${localStorage.getItem("API_URL_OVERRIDE") || import.meta.env.VITE_API_URL}/users/${id}/avatar`);
        }
    }, [logged])

    function burgerClick() {
        setActive((x) => !x);
    }

    function dropdownToggle() {
        setDropDownActive((x) => !x);
    }

    function imgError() {
        setAvatar(`${localStorage.getItem("API_URL_OVERRIDE") || import.meta.env.VITE_API_URL}/files/public/random`);
    }

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
                <a
                    role="button"
                    className={`navbar-burger ${style.navBurgerFoda} ${
                        active ? "is-active" : ""
                    }`}
                    aria-label="menu"
                    aria-expanded="false"
                    onClick={burgerClick}
                    data-target="navbarBasicExample"
                >
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>

            <div
                id="navbarBasicExample"
                className={`navbar-menu ${style.navbarMenuFoda} ${
                    active ? "is-active" : ""
                }`}
            >
                <div className="navbar-start">
                    <Link
                        to="/pub"
                        className={`navbar-item ${style.navbarElementFoda}`}
                    >
                        <FontAwesomeIcon icon={faGlobe} className="fa-fw" />
                        Públicas
                    </Link>
                </div>
                <div className="navbar-end" style={{display: `${logged ? "flex": "none"}`}}>
                    <div className={style.profile}>
                        <img
                            className={style.profilePic}
                            src={avatar}
                            onError={imgError}
                        ></img>
                        <span
                            className={style.profileName}
                            onClick={dropdownToggle}
                        >
                            {name}
                            <FontAwesomeIcon
                                className="fa-fw"
                                icon={faAngleDown}
                            />
                        </span>
                        <div
                            className={`dropdown ${
                                active ? "is-left" : "is-right"
                            } ${dropdownActive ? "is-active" : ""} ${
                                style.dropdownSupimpa
                            }`}
                        >
                            <div
                                className="dropdown-menu"
                                id="dropdown-menu2"
                                role="menu"
                            >
                                <div className="dropdown-content">
                                    <a href="#" className="dropdown-item">
                                        This is a link
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};
export default Navbar;
