import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Menu() {
  const [user, setUser] = useState("Guest");

  function handleLogout() {
    sessionStorage.removeItem("token");
    setUser("Guest");
  }

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      const userName = JSON.parse(token).userName;
      setUser(userName);
    }
  }, []);

  return (
    <div className="menu-container">
      <div className="menu">
        <h1 className="menu__title">Flower Defense</h1>
        {user !== "Guest" ? (
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
            <a className="menu__buttons --logout-button" onClick={handleLogout}>
              Logout
            </a>
          </>
        ) : (
          <>
            <p className="menu__user-display">
              Hello <span className="menu__user-display__username">Guest</span>
            </p>
            <Link to={`/game`}>
              <p className="menu__buttons">New game</p>
            </Link>
            <Link to={`/login`}>
              <p className="menu__buttons --login-button">Login</p>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Menu;
