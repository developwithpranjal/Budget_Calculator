import React, { useState } from "react";
import { auth } from "../firebase";
import "./Login.css";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
const [loading,setLoading] = useState(false)
  const navigate = useNavigate();

  const handleAuth = async () => {
    if (!email || !password || (!isLogin && (!name || !confirmPassword))) {
      alert("Please fill all fields ⚠️");
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      alert("Passwords do not match ❌");
      return;
    }
setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Login Successful ✅");
      } else {
        const userCred = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );

        await updateProfile(userCred.user, {
          displayName: name,
        });

        alert("Account Created ✅");
      }

      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
    finally{
      setLoading(false)
    }
  };
  const canSubmit = email && password &&
   (isLogin || (name && confirmPassword && password === confirmPassword));

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>{isLogin ? "Login" : "Signup"}</h1>

        {!isLogin && (
          <input
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {!isLogin && (
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        )}

        <button onClick={handleAuth} disabled={!canSubmit || loading}>
          {loading ? "Please wait..." : isLogin ? "Sign in" : "Create account"}
        </button>

        <p onClick={() => setIsLogin(!isLogin)} className="toggle-text">
          {isLogin
            ? "Don't have an account? Signup"
            : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
};

export default Login;
