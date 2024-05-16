import { useRef, useState } from "react";
import { useGameSetup } from "./gameSetup";
import "./GamePage.scss";
import { Link } from "react-router-dom";

function GamePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [wave, setWave] = useState(0);
  const [lives, setLives] = useState(10);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [currency, setCurrency] = useState(600);

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
        height={780}
      ></canvas>
      <header className="game-header">
        <div className="wave-count">Wave: {wave}</div>
        <div className="currency-display">
          <span>$</span>
          {currency}
        </div>
        <div className="lives-display">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="red"
            viewBox="0 0 24 22"
            strokeWidth={1}
            stroke="transparent"
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
      </header>

      {gameOver ? (
        <div className="game-over">
          <h2 className="game-over__title">game over!</h2>
          <p className="game-over__text">You've survived wave #{wave - 1}</p>
          <span className="game-over__buttons">
            <Link to={"/"} className="game-over__buttons__button">
              menu
            </Link>
            <a
              className="game-over__buttons__button"
              onClick={restartGame}
            >
              restart
            </a>
          </span>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default GamePage;
