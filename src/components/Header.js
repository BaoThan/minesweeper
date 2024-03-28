import React, { useState } from "react";
import DropDown from "./DropDown";
import GameState from "./GameState";
import Faces from "./Faces";

function Header({ levelOptions, onResetClick, onLevelChange, gameState }) {
  const [face, setFace] = useState(Faces.smile);

  const handleResetHover = () => {
    setFace(Faces.reset);
  };

  const handleResetLeave = () => {
    setFace(Faces.smile);
  };

  const getEmoji = () => {
    switch (gameState) {
      case GameState.inProgress:
        return face;
      case GameState.gameOver:
        return Faces.dead;
      case GameState.playerWin:
        return Faces.cool;
      default:
        return Faces.smile;
    }
  };

  return (
    <div className="header">
      <div className="dropdown-container">
        <DropDown levelOptions={levelOptions} onSelect={onLevelChange} />
      </div>
      <div className="reset-container">
        <button
          className="resetButton"
          onClick={onResetClick}
          onMouseEnter={handleResetHover}
          onMouseLeave={handleResetLeave}
        >
          <span className="emoji">{getEmoji()}</span>
        </button>
      </div>
    </div>
  );
}

export default Header;
