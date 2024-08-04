import React from "react";
import styles from "./CommonFooter.module.css";

const CommonFooter: React.FC = () => {
  return (
    <footer className={styles.footerStyle}>
      <p>© {new Date().getFullYear()} Musical Spot. All rights reserved.</p>
    </footer>
  );
};

export default CommonFooter;
