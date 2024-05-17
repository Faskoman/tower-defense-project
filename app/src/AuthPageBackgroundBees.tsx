import { BackgroundBee } from "./Bee";

export function AuthPageBackgroundBees() {
    return (
        <>
            <BackgroundBee
                scale={0.05}
                startingDelayInSeconds={12}
                topLocation={20} />
            <BackgroundBee scale={0.1} startingDelayInSeconds={9} topLocation={6} />
            <BackgroundBee scale={0.1} startingDelayInSeconds={15} topLocation={-4} />
            <BackgroundBee scale={0.1} startingDelayInSeconds={6} topLocation={10} />
            <BackgroundBee scale={0.2} startingDelayInSeconds={3} topLocation={2} />
            <BackgroundBee scale={0.3} startingDelayInSeconds={2} topLocation={0} />
            <BackgroundBee scale={0.4} startingDelayInSeconds={0} topLocation={-10} />
        </>
    );
}
