import Bee from "./Bee";
import Flower from "./Flower";
import "./MainMenu.scss";

function MainMenu() {
  return (
    <>
      <div className="container">
        <div className="background-bee">
          <Bee />
          <Bee />
        </div>
        <Bee />
        <Flower />
      </div>
    </>
  );
}

export default MainMenu;
