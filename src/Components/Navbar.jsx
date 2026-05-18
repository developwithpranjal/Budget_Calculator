import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { MdPerson, MdLogout, MdDashboard, MdLightMode, MdDarkMode } from "react-icons/md";
import { SiSimpleanalytics } from "react-icons/si";
import { GiWallet } from "react-icons/gi";

import "./Navbar.css";
import { useTheme } from "../context/ThemeContext.jsx";

const Navbar = ({ user, setUser, setTransactions }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  async function handleLogout() {
    try {
      await signOut(auth);
      setUser(null);
      setTransactions([]);
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/dashboard">
          <GiWallet size={22} />
          Expenso
        </Link>
      </div>

      <div className="navbar-links">
        <Link
          to="/dashboard"
          className={`nav-link ${location.pathname === "/dashboard" ? "active" : ""}`}
        >
          <MdDashboard size={17} />
          Dashboard
        </Link>

        <Link
          to="/analytics"
          className={`nav-link ${location.pathname === "/analytics" ? "active" : ""}`}
        >
          <SiSimpleanalytics size={14} />
          Analytics
        </Link>

        <Link
          to="/profile"
          className={`nav-link ${location.pathname === "/profile" ? "active" : ""}`}
        >
          <MdPerson size={18} />
          Profile
        </Link>

        <button className="nav-btn logout" onClick={handleLogout}>
          <MdLogout size={16} />
          Logout
        </button>

        <button
          type="button"
          className="nav-btn theme-toggle"
          onClick={toggleTheme}
          title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
        >
          {theme === "dark" ? <MdLightMode size={20} /> : <MdDarkMode size={20} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;