import React from "react";
import logo from "../../../assets/logo.png";
import styles from "./Header.module.css";


const Header: React.FC = () => (

    <header className={styles.headerContainer}>
        <img className={styles.logo} src={logo} alt="logo" />
        <h1 className={styles.title}>HRnet</h1>
        <nav>
            <a href="/" style={{ marginRight: "1.5rem", textDecoration: "none" }}>View Current Employees</a>
        </nav>
    </header>
);

export default Header;