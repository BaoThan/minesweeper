import React, { useEffect, useState, useCallback } from "react";
import Board from "./Board";
import Header from "./Header";
import GameState from "./GameState";
import GameOver from "./GameOver";
import Faces from "./Faces";

const levelOptions = [
  { value: { boardSize: 10, bombCount: 10 }, label: "EASY" },
  { value: { boardSize: 15, bombCount: 40 }, label: "MEDIUM" },
  { value: { boardSize: 20, bombCount: 100 }, label: "HARD" },
];

function Minesweeper() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameState, setGameState] = useState(GameState.inProgress);
  const [boardSize, setBoardSize] = useState(levelOptions[0].value.boardSize);
  const [numBomb, setNumBomb] = useState(levelOptions[0].value.bombCount);

  const [grid, setGrid] = useState(() =>
    Array.from({ length: boardSize }, () =>
      Array.from({ length: boardSize }, () => ({
        isBomb: false,
        revealed: false,
        bombCount: 0,
      }))
    )
  );

  const reset = (gridSize) => {
    setGrid(() =>
      Array.from({ length: gridSize }, () =>
        Array.from({ length: gridSize }, () => ({
          isBomb: false,
          revealed: false,
          bombCount: 0,
        }))
      )
    );
    setGameStarted(false);
    setGameState(GameState.inProgress);
  };

  const handleLevelSelect = (level) => {
    setBoardSize(levelOptions[level].value.boardSize);
    setNumBomb(levelOptions[level].value.bombCount);
    reset(levelOptions[level].value.boardSize);
  };

  const checkWin = useCallback(() => {
    if (!grid) {
      return;
    }

    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        if (!grid[i][j].isBomb && !grid[i][j].revealed) {
          return;
        }
      }
    }
    setGameState(GameState.playerWin);
  }, [boardSize, grid, setGameState]);

  const onCellClick = (event, row, col) => {
    if (gameState !== GameState.inProgress) {
      return;
    }
    if (event.button === 0) {
      if (!gameStarted) {
        generateBoard([row, col]);
        setGameStarted(true);
      }
      handleLeftClick(row, col);
    } else if (event.button === 2) {
      handleRightClick(row, col);
    }
  };

  const handleLeftClick = (row, col) => {
    if (grid[row][col].flagged) {
      return;
    }
    if (grid[row][col].revealed) {
      return;
    }
    let newGrid = grid.map((row) => [...row]);

    let myQueue = [];
    let coordinate = [row, col];
    myQueue.push(coordinate);

    if (newGrid[coordinate[0]][coordinate[1]].isBomb) {
      revealAllBomb(row, col);
      return;
    }

    grid[coordinate[0]][coordinate[1]].revealed = true;
    while (myQueue.length > 0) {
      let node = myQueue.shift();
      let x = node[0];
      let y = node[1];

      if (newGrid[x][y].bombCount !== 0) {
        continue;
      }
      for (
        let i = Math.max(0, x - 1);
        i < Math.min(newGrid[0].length, x + 2);
        i++
      ) {
        for (
          let j = Math.max(0, y - 1);
          j < Math.min(newGrid.length, y + 2);
          j++
        ) {
          if (i === x && j === y) {
            continue;
          }
          if (newGrid[i][j].bombCount === 0 && !newGrid[i][j].revealed) {
            myQueue.push([i, j]);
          }
          newGrid[i][j].revealed = true;
        }
      }
    }
    setGrid(newGrid);
    checkWin();
  };

  const handleRightClick = (row, col) => {
    if (grid[row][col].revealed) {
      return;
    }
    let newGrid = grid.map((row) => [...row]);
    newGrid[row][col].flagged = !newGrid[row][col].flagged;
    setGrid(newGrid);
  };

  const generateBoard = (clickCoordinate) => {
    let newGrid = grid.map((row) => [...row]);

    // Gen bombs at random cells
    for (let i = 0; i < numBomb; i++) {
      let randX = Math.floor(Math.random() * newGrid[0].length);
      let randY = Math.floor(Math.random() * newGrid.length);

      let x = clickCoordinate[0];
      let y = clickCoordinate[1];
      if (newGrid[randX][randY].isBomb) {
        i--;
        continue;
      }
      if (
        x - 1 <= randX &&
        randX <= x + 1 &&
        y - 1 <= randY &&
        randY <= y + 1
      ) {
        i--;
        continue;
      }
      newGrid[randX][randY].isBomb = true;
    }

    // Calculate neighbor bomb number
    for (let i = 0; i < newGrid[0].length; i++) {
      for (let j = 0; j < newGrid.length; j++) {
        if (newGrid[i][j].isBomb) {
          continue;
        }
        // Go through each cell's neighbor and count bombs
        for (
          let x = Math.max(0, i - 1);
          x < Math.min(newGrid[0].length, i + 2);
          x++
        ) {
          for (
            let y = Math.max(0, j - 1);
            y < Math.min(newGrid.length, j + 2);
            y++
          ) {
            if (newGrid[x][y].isBomb) {
              newGrid[i][j].bombCount++;
            }
          }
        }
      }
    }
    setGrid(newGrid);
  };

  const revealAllBomb = (row, col) => {
    let newGrid = grid.map((row) => [...row]);
    for (let i = 0; i < newGrid[0].length; i++) {
      for (let j = 0; j < newGrid.length; j++) {
        if (newGrid[i][j].isBomb) {
          newGrid[i][j].revealed = true;
        }
      }
    }
    newGrid[row][col].isClickedBomb = true;
    setGrid(newGrid);
    setGameState(GameState.gameOver);
  };

  useEffect(() => {
    checkWin();
  }, [grid, checkWin]);

  return (
    <div>
      <Header
        levelOptions={levelOptions}
        onResetClick={() => reset(boardSize)}
        onLevelChange={handleLevelSelect}
        gameState={gameState}
      />
      <div style={{ position: "relative" }}>
        <Board grid={grid} onCellClick={onCellClick} size={boardSize} />
        {gameState === GameState.gameOver ||
        gameState === GameState.playerWin ? (
          <GameOver gameState={gameState} />
        ) : null}
      </div>
    </div>
  );
}

export default Minesweeper;
