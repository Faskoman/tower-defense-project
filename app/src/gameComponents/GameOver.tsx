import { Link } from "react-router-dom";

interface GameOverProps {
  wave: number;
  restartGame: () => void;
}
export function GameOver({ wave, restartGame }: GameOverProps) {
  return (
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
  );
}
