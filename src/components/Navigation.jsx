// src/components/Navigation.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from '../styles/Navigation.module.css';

const Navigation = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname.startsWith(path);
  
  return (
    <nav className={styles.navigation}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link to="/">
            <span className={styles.logoText}>DocNest</span>
          </Link>
        </div>
        
        <div className={styles.navLinks}>
          <Link 
            to="/" 
            className={`${styles.navLink} ${isActive('/') && !isActive('/spec-sheet') ? styles.active : ''}`}
          >
            Dashboard
          </Link>
          
          <Link 
            to="/spec-sheet" 
            className={`${styles.navLink} ${isActive('/spec-sheet') ? styles.active : ''}`}
          >
            Spec Sheets
          </Link>
        </div>
        
        <div className={styles.userMenu}>
          <div className={styles.userAvatar}>
            <span>JS</span>
          </div>
          <div className={styles.userName}>John Smith</div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
