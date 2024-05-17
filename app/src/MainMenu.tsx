import { LoaderFunctionArgs, useLoaderData } from "react-router-dom";
import Menu from "./Components/Menu";
import { User } from "./Users.model";
import { HomeBackground } from "./HomeBackground";
import { Leaderboards } from "./Components/Leaderboards";
import "./styles/MainMenu.scss";
import { server } from "./router";

export async function loader({}: LoaderFunctionArgs) {
  try {
    const res = await server.get(`/users/highScores`);

    return res.data;
  } catch (error) {
    console.error("Failed to fetch high scores", error);
    return [];
  }
}

export function MainMenu() {
  const users = useLoaderData() as User[];

  return (
    <>
      <main className="mainMenu-main">
        <Menu />
        <HomeBackground />
        {users ? <Leaderboards users={users} /> : "No Leaderboards" }
      </main>
    </>
  );
}

export default MainMenu;