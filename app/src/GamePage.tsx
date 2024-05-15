import { useRef, useState } from "react";
import { useGameSetup } from "./gameSetup";
import "./canvas.scss";

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
      <canvas
        className="canvas"
        ref={canvasRef}
        width={1280}
        height={820}
      ></canvas>
      <div className="wave-count">Wave: {wave}</div>
      <div className="currency-display">
        <span>$</span>
        {currency}
      </div>
      <div className="lives-display">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="red"
          viewBox="0 0 24 24"
          strokeWidth={1}
          stroke="black"
          className="lives-display__heart"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
          />
        </svg>

        {lives}
      </div>

      {gameOver ? (
        <div className="game-over">
          <p className="game-over__text">game over!</p>
          <span className="game-over__buttons">
            <button className="game-over__buttons__button">menu</button>
            <button
              className="game-over__buttons__button"
              onClick={restartGame}
            >
              restart
            </button>
          </span>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default GamePage;
