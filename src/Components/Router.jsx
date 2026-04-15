import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Calculator from "../pages/Calculator";
import Analytics from "../pages/Analytics";
import Profile from "../pages/Profile";
import Login from "../pages/Login";
import ProtectedRoute from "./ProtectedRoute";

const Router = ({ transactions, setTransactions, user, setUser }) => {
  return (
    <BrowserRouter>
      {user && (
        <Navbar
          user={user}
          setUser={setUser}
          setTransactions={setTransactions}
        />
      )}

      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user}>
              <Calculator
                transactions={transactions}
                setTransactions={setTransactions}
                user={user}
                setUser={setUser}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute user={user}>
              <Analytics transactions={transactions} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute user={user}>
              <Profile user={user} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;