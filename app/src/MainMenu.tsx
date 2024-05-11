import Bee from "./Bee";
import Flower from "./Flower";
import "./MainMenu.scss";

function MainMenu() {
  return (
    <>
      <div className="container">
        <div className="background-bee">
          <Bee scale={.2} yPosition={50}/>
        </div>
        <Bee yPosition={10}/>
        <Flower />
      </div>
    </>
  );
}

export default MainMenu;
