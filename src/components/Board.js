import Cell from "./Cell";

function Board({ grid, onCellClick, onRightClick, size }) {
  const boardStyle = {
    display: "grid",
    backgroundColor: "#ccc",
    gridTemplateColumns: `repeat(${size}, 40px)`,
    gridTemplateRows: `repeat(${size}, 40px)`,
  };
  return (
    <div style={boardStyle}>
      {grid.map((row, rowIndex) => (
        <div key={rowIndex}>
          {row.map((gridNode, colIndex) => (
            <Cell
              key={`${rowIndex}:${colIndex}`}
              isBomb={gridNode.isBomb}
              revealed={gridNode.revealed}
              bombCount={gridNode.bombCount}
              flagged={gridNode.flagged}
              isClickedBomb={gridNode.isClickedBomb}
              onClick={(event) => onCellClick(event, rowIndex, colIndex)}
              onRightClick={() => onRightClick(rowIndex, colIndex)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Board;
