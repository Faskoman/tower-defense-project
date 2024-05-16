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
        <div className="game-header__links">
          <a
            className="game-header__links__restart__button"
            onClick={restartGame}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z"
                clipRule="evenodd"
              />
            </svg>
          </a>
          <Link to={"/"} className="game-header__links__menu__button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
              <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
            </svg>
          </Link>
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
            <a className="game-over__buttons__button" onClick={restartGame}>
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
