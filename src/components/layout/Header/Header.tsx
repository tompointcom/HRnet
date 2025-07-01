import React from "react";
import logo from "../../../assets/logo.png";
import styles from "./Header.module.css";


const Header: React.FC = () => (

    <header className={styles.headerContainer}>
        <img className={styles.logo} src={logo} alt="logo" />
        <a className={styles.title} href="/">HRnet</a>
        <nav>
            <a href="/current-employees">View Current Employees</a>
        </nav>
    </header>
);

export default Header;