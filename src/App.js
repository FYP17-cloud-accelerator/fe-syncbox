import React from "react";
import { BrowserRouter as Router, Switch, Route, Link, useHistory } from "react-router-dom";
import LoginPage from "./auth/LoginPage";
import PrivateRoute from "./auth/PrivateRoute";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from "react-bootstrap";
import RegisterPage from "./auth/RegisterPage";
import axios from "axios";
import useToken from "./auth/Token";
import DashboardPage from "./dashboard/DashboardPage";

export const base_url = "http://localhost:1901";

export default function App() {
  axios.defaults.withCredentials = true;
  const { token, saveToken, deleteToken } = useToken();

  return (
    <Router>
      <div>
        <p>{token?.user}</p>
        <AuthButton token={token} deleteToken={deleteToken} />

        <ul>
          <li><Link to="/dasboard">Dasboard Page</Link></li>
        </ul>

        <Switch>
          <Route exact path="/register"><RegisterPage setToken={saveToken} /></Route>
          <Route exact path="/login"><LoginPage setToken={saveToken} /></Route>
          <PrivateRoute exact path="/dasboard"><DashboardPage /></PrivateRoute>
        </Switch>
      </div>
    </Router>
  );
}

function AuthButton({ token, deleteToken }) {
  let history = useHistory();

  return token ? (
    <Button onClick={() => {
      deleteToken();
      history.push("/");
    }}>Logout</Button>
  ) : (
    <Link className="btn btn-primary" to="/login">Login</Link>
  );
}
