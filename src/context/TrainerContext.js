// TrainerContext.js
import React, { createContext, useState, useEffect, useContext } from "react";

const TrainerContext = createContext();

export const TrainerProvider = ({ children }) => {
  const [trainer, setTrainer] = useState(() => {
    const storedTrainer = localStorage.getItem("trainer");
    return storedTrainer ? JSON.parse(storedTrainer) : null;
  });

  useEffect(() => {
    localStorage.setItem("trainer", JSON.stringify(trainer));
  }, [trainer]);

  const login = (trainerData) => {
    setTrainer(trainerData);
  };

  const logout = () => {
    setTrainer(null);
    localStorage.removeItem("trainer");
  };

  return (
    <TrainerContext.Provider value={{ trainer, login, logout }}>
      {children}
    </TrainerContext.Provider>
  );
};

export const useTrainer = () => {
  return useContext(TrainerContext);
};
