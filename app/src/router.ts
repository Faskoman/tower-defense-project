import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import GamePage from "./GamePage";
import LoginPage from "./Login";
import { loader as usersLoader } from "./MainMenu";

export const router = createBrowserRouter([
  {
    index: true,
    Component: App,
    loader: usersLoader,
  },
  { path: "/game", Component: GamePage },
  { path: "/login", Component: LoginPage },
]);
