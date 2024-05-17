import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import GamePage from "./GamePage";
import { loader as usersLoader } from "./MainMenu";
import RegisterPage from "./Register";
import LoginPage from "./Login";
import axios from "axios";

export const server = axios.create({
  baseURL: "https://tower-defense-project-api.onrender.com",
});

export const router = createBrowserRouter([
  {
    index: true,
    Component: App,
    loader: usersLoader,
  },
  { path: "/game", Component: GamePage },
  { path: "/register", Component: RegisterPage },
  { path: "/login", Component: LoginPage }
]);
