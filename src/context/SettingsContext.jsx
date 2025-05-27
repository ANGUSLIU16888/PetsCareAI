import React, { createContext, useState, useContext } from 'react';

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [detailMessage, setDetailMessage] = useState(
    "This is the default detail message. Editors can change this!"
  );
  const [isSpecialFeatureEnabled, setIsSpecialFeatureEnabled] = useState(false);

  const updateDetailMessage = (newMessage) => {
    setDetailMessage(newMessage);
  };

  const toggleSpecialFeature = () => {
    setIsSpecialFeatureEnabled(prevState => !prevState);
  };

  return (
    <SettingsContext.Provider
      value={{
        detailMessage,
        isSpecialFeatureEnabled,
        updateDetailMessage,
        toggleSpecialFeature,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
