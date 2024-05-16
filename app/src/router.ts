import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import GamePage from "./GamePage";
import LoginPage from "./Login";

export const router = createBrowserRouter([
  {
    index: true,
    Component: App,
  },
  { path: "/game", Component: GamePage },
  { path: "/login", Component: LoginPage },
]);
