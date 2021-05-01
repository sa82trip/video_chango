import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { CreateAccount } from "../pages/create-account";
import { Login } from "../pages/login";

export const LoggedOutRoutes: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route path="/create-account">
          <CreateAccount />
        </Route>
        <Route path="/" exact>
          <Login />
        </Route>
      </Switch>
    </Router>
  );
};
