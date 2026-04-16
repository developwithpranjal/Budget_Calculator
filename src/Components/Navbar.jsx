import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { MdPerson, MdLogin, MdLogout } from "react-icons/md";
import { SiSimpleanalytics } from "react-icons/si";
import { GiWallet } from "react-icons/gi";

import "./Navbar.css";

const Navbar = ({ user, setUser, setTransactions }) => {
  const navigate = useNavigate();
  const location = useLocation();

  async function handleLogout() {
    await signOut(auth);
    setUser(null);
    setTransactions([]);
    navigate("/");
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand"><Link to="/dashboard"><GiWallet size={20} color="white"/> Expenso</Link></div>
      <div className="navbar-links">
        
        <Link to="/analytics" className={`nav-link ${location.pathname === "/analytics" ? "active" : ""}`}>
          <SiSimpleanalytics color="red" /> Analytics
        </Link>
        <Link to="/profile" className={`nav-link ${location.pathname === "/profile" ? "active" : ""}`}>
          <MdPerson size={20} /> Profile
        </Link>
        {user ? (
          <button className="nav-btn logout" onClick={handleLogout}>
            <MdLogout /> Logout
          </button>
        ) : (
          <Link to="/" className="nav-btn login">
            <MdLogin /> Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;