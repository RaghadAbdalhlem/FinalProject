/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const WaterReminderContext = createContext();

export const WaterReminderProvider = ({ children }) => {
  const [showNotification, setShowNotification] = useState(false);
  const [drinkCount, setDrinkCount] = useState(0);
  const token = useSelector((state) => state.userState.token);
  const axiosInstance = axios.create({
    baseURL: "http://localhost:5000", // Use environment variable for API URL
    headers: {
      Authorization: token ? `Bearer ${token}` : "", // Add token if available
      "Content-Type": "application/json",
    },
  });

  useEffect(() => {
    const fetchDrinkCount = async () => {
      try {
        const { data } = await axiosInstance.get("/api/waters");
        setDrinkCount(data.data.amount);
      } catch (error) {
        console.error("Failed to fetch drink count:", error);
      }
    };

    if (token) fetchDrinkCount();
  }, [token]);

  const showWaterNotification = () => setShowNotification(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowNotification(true);
    }, 720000); // Every 2 hours

    return () => clearInterval(interval);
  }, []);

  const dismissNotification = () => {
    setShowNotification(false);
  };

  const recordDrink = async () => {
    try {
      const { data } = await axiosInstance.post("/api/waters/create", { amount: 1 });
      setDrinkCount(data.data.amount);
    } catch (error) {
      console.error("Failed to record drink:", error);
    }
  };

  return (
    <WaterReminderContext.Provider value={{
      showNotification,
      showWaterNotification,
      dismissNotification,
      recordDrink,
      drinkCount
    }}>
      {children}
    </WaterReminderContext.Provider>
  );
};

export const useWaterReminder = () => {
  return useContext(WaterReminderContext);
};
