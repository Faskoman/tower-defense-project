import { Link } from "react-router-dom";

let user: string = "Assaf";

function Menu() {
  return (
    <div className="menu-container">
      <div className="menu">
        <h1 className="menu__title">Flower Defense</h1>
        {user ? (
          <>
            <p className="menu__user-display">
              Hello <span className="menu__user-display__username">{user}</span>
            </p>
            <Link to={`/game`}>
              <p className="menu__buttons">New game</p>
            </Link>
            <Link to={`/`}>
              <p className="menu__buttons">Continue</p>
            </Link>
            <p className="menu__buttons --logout-button">Logout</p>
          </>
        ) : (
          <>
            <p className="menu__user-display">
              Hello <span className="menu__user-display__username">Guest</span>
            </p>
            <Link to={`/game`}>
              <p className="menu__buttons">New game</p>
            </Link>
            <p className="menu__buttons">Login</p>
          </>
        )}
      </div>
    </div>
  );
}

export default Menu;
