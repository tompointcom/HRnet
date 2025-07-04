import React from "react";
import styles from "./Footer.module.css";

const Footer: React.FC = () => (
    <footer data-testid="footer" className={styles.footer}>
        <div className={styles.footerContent}>
            <p>&copy; {new Date().getFullYear()} Wealth Health. All rights reserved.</p>
        </div>
    </footer>
);

export default Footer;