import React from "react";
import { useTrainer } from "../../context/TrainerContext";

const Header = ({ isLoggedIn }) => {
  const { trainer } = useTrainer();
  return (
    isLoggedIn && (
      <header className="bg-gray-800 text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Your App Name</h1>
          {trainer && <p>Welcome, {trainer.name}!</p>}{" "}
        </div>
      </header>
    )
  );
};

export default Header;
