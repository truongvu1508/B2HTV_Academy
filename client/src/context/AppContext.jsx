import { createContext } from "react";

const AppContext = createContext();

export const AppContextProvider = (props) => {
  const currency = import.meta.env.VITE_CURRENCY;

  const value = { currency };
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
