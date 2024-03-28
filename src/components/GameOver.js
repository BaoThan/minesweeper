import GameState from "./GameState";

function GameOver({ gameState }) {
  return (
    <div className="gameOver">
      {gameState === GameState.playerWin ? "🎉" : "💀"}
    </div>
  );
}

export default GameOver;
