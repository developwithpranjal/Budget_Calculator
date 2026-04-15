import React from "react";
import { MdPerson, MdEmail } from "react-icons/md";

const Profile = ({ user }) => {
  if (!user) return <div className="Container"><p>Please login first.</p></div>;

  return (
    <div className="Container">
      <h1>User Profile</h1>
      <div style={{
        background: "#1f2937", borderRadius: "12px",
        padding: "30px", maxWidth: "400px", margin: "20px auto"
      }}>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{
            width: "80px", height: "80px", borderRadius: "50%",
            background: "#6366f1", display: "flex", alignItems: "center",
            justifyContent: "center", margin: "0 auto 15px",
            fontSize: "36px"
          }}>
            {user.photoURL
              ? <img src={user.photoURL} alt="profile" style={{ borderRadius: "50%", width: "80px" }} />
              : <MdPerson />}
          </div>
          <h2 style={{ margin: 0 }}>{user.displayName || "User"}</h2>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px",
          background: "#0f172a", padding: "12px", borderRadius: "8px" }}>
          <MdEmail style={{ color: "#6366f1", fontSize: "20px" }} />
          <span>{user.email}</span>
        </div>
      </div>
    </div>
  );
};

export default Profile;