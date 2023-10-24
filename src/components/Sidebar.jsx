
import { Outlet } from 'react-router-dom';

import Logo from "./Logo.jsx";
import AppNav from "./AppNav.jsx";
import Footer from "./Footer.jsx";

import styles from './Sidebar.module.css';

function Sidebar() {
    return (
        <div className={styles.sidebar}>
            <Logo />
            <AppNav />
            <Outlet />
            <Footer />
        </div>
    );
}

export default Sidebar;