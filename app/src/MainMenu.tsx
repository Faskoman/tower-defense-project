import { Bee, BackgroundBee } from "./Bee";
import Flower from "./Flower";
import "./MainMenu.scss";

function MainMenu() {
  return (
    <>
      <div className="container">
        <BackgroundBee scale={.1} topLocation={15} startingDelayInSeconds={4}/>
        <BackgroundBee scale={.1} topLocation={10} startingDelayInSeconds={0}/>
        <Bee />
        <Flower />
        <BackgroundBee scale={.2} topLocation={8} startingDelayInSeconds={12}/>
        <BackgroundBee scale={.25} topLocation={20} startingDelayInSeconds={0}/>
        <BackgroundBee scale={.3} topLocation={30} startingDelayInSeconds={4}/>
      </div>
    </>
  );
}

export default MainMenu;
