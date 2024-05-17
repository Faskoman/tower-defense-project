import { useRef, useState } from "react";
import { useGameSetup } from "./gameSetup";
import GameHeader from "./gameComponents/GameHeader";
import { Canvas } from "./gameComponents/Canvas";
import { GameOver } from "./gameComponents/GameOver";
import "./GamePage.scss";

function GamePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [wave, setWave] = useState(0);
  const [lives, setLives] = useState(10);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [currency, setCurrency] = useState(100);

  useGameSetup(
    canvasRef,
    setIsGameRunning,
    setWave,
    setLives,
    setGameOver,
    setCurrency,
    isGameRunning
  );

  function restartGame() {
    window.location.reload();
  }

  return (
    <div className="game-container">
      <Canvas canvasRef={canvasRef} />
      <GameHeader
        wave={wave}
        currency={currency}
        lives={lives}
        restartGame={restartGame}
      />
      {!gameOver ? <GameOver wave={wave} restartGame={restartGame} /> : ""}
    </div>
  );
}

export default GamePage;
