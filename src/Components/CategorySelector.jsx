import React from "react";
import {
  FaUtensils,
  FaShoppingCart,
  FaCar,
  FaHome,
  FaFilm,
  FaHeartbeat,
  FaGift,
  FaMoneyBill,
} from "react-icons/fa";

export const categories = [
  { name: "Food", icon: <FaUtensils /> },
  { name: "Shopping", icon: <FaShoppingCart /> },
  { name: "Travel", icon: <FaCar /> },
  { name: "Rent", icon: <FaHome /> },
  { name: "Entertainment", icon: <FaFilm /> },
  { name: "Health", icon: <FaHeartbeat /> },
  { name: "Gift", icon: <FaGift /> },
  { name: "Other", icon: <FaMoneyBill /> },
];

const CategorySelector = ({ category, setCategory }) => {
  return (
    <div className="category-container">
      <h3>Select Category</h3>
      <div className="category-grid">
        {categories.map((cat) => (
          <div
            key={cat.name}
            className={`category-item ${category === cat.name ? "active" : ""}`}
            onClick={() => setCategory(cat.name)}
          >
            <p>{cat.icon} {cat.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;
