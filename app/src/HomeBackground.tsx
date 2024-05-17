import { BackgroundBee, Bee } from "./Components/Bee";
import Flower from "./Components/Flower";

export function HomeBackground() {
  return (
    <div className="container">
      <BackgroundBee scale={0.1} topLocation={15} startingDelayInSeconds={7} />
      <BackgroundBee scale={0.1} topLocation={10} startingDelayInSeconds={0} />
      <Bee />
      <Flower />
      <BackgroundBee scale={0.2} topLocation={8} startingDelayInSeconds={12} />
      <BackgroundBee scale={0.25} topLocation={20} startingDelayInSeconds={9} />
      <BackgroundBee scale={0.3} topLocation={30} startingDelayInSeconds={4} />
    </div>
  );
}
