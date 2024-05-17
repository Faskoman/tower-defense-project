import { LoaderFunctionArgs, useLoaderData } from "react-router-dom";
import Menu from "./Menu";
import axios from "axios";
import { User } from "./Users.model";
import { HomeBackground } from "./HomeBackground";
import "./MainMenu.scss";

export async function loader({}: LoaderFunctionArgs) {
  try {
    const res = await axios.get(`http://localhost:3000/highScores`);

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
      <Menu />
      <HomeBackground />
      {users ? <Leaderboards users={users} /> : "No Leaderboards" }
    </>
  );
}

export default MainMenu;

function Leaderboards({ users }: { users: User[] }) {
  return (
    <div>
      <h2>Leaderboards</h2>
      <table>
        <thead>
          <tr>
            <th> </th>
            <th>Name</th>
            <th>Wave</th>
            <th>At</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{user.userName}</td>
              <td>{user.bestWave}</td>
              <td>{user.achievedAt.slice(0, 10)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
