import Bee from "./Bee";
import Flower from "./Flower";
import "./MainMenu.scss";

function MainMenu() {
  return (
    <>
      <div className="container">
        <div className="background-bee">
          <Bee scale={.2} topLocation={0}/>
        </div>
        <Bee />
        <Flower />
      </div>
    </>
  );
}

export default MainMenu;
