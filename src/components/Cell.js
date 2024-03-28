import React from "react";

function Cell({
  isBomb,
  revealed,
  bombCount,
  flagged,
  onClick,
  isClickedBomb,
}) {
  const onContextMenu = (e) => {
    e.preventDefault();
    onClick(e);
  };

  let value;
  if (revealed) {
    if (isClickedBomb) {
      value = "💥";
    } else if (isBomb) {
      value = "💣";
    } else {
      value = bombCount === 0 ? "" : bombCount;
    }
  } else if (flagged) {
    value = "🚩";
  }

  const cellClassName = `cell${revealed ? " revealed" : ""}${
    flagged ? " flagged" : ""
  }`;

  return (
    <div
      className={cellClassName}
      onClick={(event) => onClick(event)}
      onContextMenu={onContextMenu}
    >
      {value}
    </div>
  );
}

export default Cell;
