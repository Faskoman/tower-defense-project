import { User } from "./Users.model";
import "./Leaderboards.scss"

export function Leaderboards({ users }: { users: User[]; }) {
  return (
    <div className="leaderboard">
      <h2>Leaderboards</h2>
      <table>
        <thead >
          <tr>
            <th className="leaderboard__table-head"> </th>
            <th className="leaderboard__table-head">Name</th>
            <th className="leaderboard__table-head">Wave</th>
            <th className="leaderboard__table-head">At</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td className="leaderboard__place-number">{index + 1}</td>
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
