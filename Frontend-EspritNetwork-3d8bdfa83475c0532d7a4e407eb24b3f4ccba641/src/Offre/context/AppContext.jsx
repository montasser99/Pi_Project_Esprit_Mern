import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [toastData, setToastData] = useState(null);

  const showToast = (data) => {
    setToastData(data);
  };

  const clearToastData = () => {
    setToastData(null);
  };

  return (
    <AppContext.Provider value={{ toastData, showToast, clearToastData  }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};