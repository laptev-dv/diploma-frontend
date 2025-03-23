import React, { createContext, useState } from 'react';
import AlertNotification from '../components/AlertNotification';

export const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const addAlert = (message, severity) => {
    const id = Date.now();
    const newAlert = { id, message, severity };

    setAlerts([newAlert]);

    setTimeout(() => {
        removeAlert(id);
      }, 3000);  
  };

  const removeAlert = (id) => {
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
  };

  return (
    <AlertContext.Provider value={{ addAlert }}>
        <AlertNotification alerts={alerts} removeAlert={removeAlert} />
        {children}
    </AlertContext.Provider>
  );
};