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
            <p className="menu__buttons">New game</p>
            <p className="menu__buttons">continue</p>
            <p className="menu__buttons">Logout</p>
          </>
        ) : (
          <>
            <p className="menu__user-display">
              Hello <span className="menu__user-display__username">Guest</span>
            </p>
            <p className="menu__buttons">New game</p>
            <p className="menu__buttons">Login</p>
          </>
        )}
      </div>
    </div>
  );
}

export default Menu;