import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { MdPerson, MdLogin, MdLogout } from "react-icons/md";
import { SiSimpleanalytics } from "react-icons/si";
import { GiWallet } from "react-icons/gi";
import "./Navbar.css";

const Navbar = ({ user }) => {
  const navigate = useNavigate();

  async function handleLogout() {
  await signOut(auth);

  setUser(null);           // 🔥 clear user
  setTransactions([]);     // 🔥 clear data

  navigate("/");
}

  return (
    <nav className="navbar">
      <div className="navbar-brand"><Link to="/dashboard"><GiWallet size={20} color="white"/> Budget Tracker</Link></div>
      <div className="navbar-links">
        
        <Link to="/analytics" className="nav-link">
         <SiSimpleanalytics color="green"/> Analytics
        </Link>
        <Link to="/profile" className="nav-link">
          <MdPerson size={20}/> Profile
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