import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import "../styles/styles.css";
import firebase from "firebase";
import { MainPage } from "../pages/main-page";

interface AppContextInterface {
  setLoggedIn: Dispatch<SetStateAction<boolean>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setLoggedInUser: Dispatch<SetStateAction<any>>;
}
export const UserContext = createContext<AppContextInterface | null>(null);
export const LoggedInUserCtx = createContext<firebase.User | null>(null);

export const App: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(firebase.auth().currentUser);

  const value = useMemo(() => ({ setLoggedIn, setLoading, setLoggedInUser }), [
    setLoggedIn,
    setLoading,
    setLoggedInUser,
  ]);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      console.log(user);
      if (user) {
        setLoggedInUser(user);
        setLoggedIn((prev) => !prev);
      }
    });
    console.log("loggedInUser");
    console.log(loggedInUser);
  }, []);

  return (
    <UserContext.Provider value={value}>
      <LoggedInUserCtx.Provider value={firebase.auth().currentUser}>
        <MainPage />
      </LoggedInUserCtx.Provider>
    </UserContext.Provider>
  );
};
