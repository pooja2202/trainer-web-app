import React from "react";
import { useTrainer } from "../../context/TrainerContext";

const Header = ({ isLoggedIn }) => {
  const { trainer } = useTrainer();
  return (
    isLoggedIn && (
      <header className="bg-gray-800 text-white py-4">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-semibold font-serif text-gray-200">Epicore Trainer Board</h1>
          {trainer && (
            <div className="flex items-center">
              <p className="mr-2">Welcome, {trainer.name}!</p>
              <img
                src={trainer.profile_image}
                alt={trainer.name}
                className="w-10 h-10 rounded-full"
              />
            </div>
          )}
        </div>
      </header>
    )
  );
};

export default Header;
