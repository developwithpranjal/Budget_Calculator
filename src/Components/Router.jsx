import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Calculator from "../pages/Calculator.jsx";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Calculator />} />
      </Routes>
    </BrowserRouter>
  );
}
export default Router;