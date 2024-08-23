// check move is inbounds
// TODO: add logic to move queen
// TODO: check final path spot

const prompt = require("prompt-sync")({ sigint: true });

const board = [
  ["WR", "WN", "WB", "WK", "WQ", "WB", "WN", "WR"],
  ["WP", "WP", "WP", "WP", "WP", "WP", "WP", "WP"],
  ["  ", "  ", "  ", "  ", "  ", "  ", "  ", "  "],
  ["  ", "  ", "  ", "  ", "  ", "  ", "  ", "  "],
  ["  ", "  ", "  ", "  ", "  ", "  ", "  ", "  "],
  ["  ", "  ", "  ", "  ", "  ", "  ", "  ", "  "],
  ["BP", "BP", "BP", "BP", "BP", "BP", "BP", "BP"],
  ["BR", "BN", "BB", "BK", "BQ", "BB", "BN", "BR"],
];

// object defines the value of the columns when the user passes a location
// for example if the user passes the value 'a1', 'a' refers to column 0
const columns = { a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6, h: 7 };

// input: 'a1'
const pos = (rowCol) => {
  row = Number(rowCol[1]);
  col = rowCol[0];
  return [row - 1, columns[col]];
};

const movePawn = (startRow, startCol, endRow, endCol) => {
  if (
    // rows are 0 indexed
    (startRow === 1 && endRow === startRow + 2 && startCol === endCol) ||
    (startRow === 6 && endRow === startRow - 2 && startCol === endCol) ||
    (endRow === startRow + 1 && startCol === endCol) ||
    (endRow === startRow - 1 && startCol === endCol)
  ) {
    if (isPathClear(startRow, startCol, endRow, endCol) === true) {
      console.log("Path is clear");
      return "valid";
    } else {
      return "invalid";
    }
  } else if (
    // check if pawn is capturing another piece
    (endRow === startRow + 1 && endCol === startCol + 1) ||
    (endRow === startRow + 1 && endCol === startCol - 1) ||
    (endRow === startRow - 1 && endCol === startCol + 1) ||
    (endRow === startRow - 1 && endCol === startCol - 1)
  ) {
    return "captured";
  } else {
    return "invalid";
  }
};

const moveRook = (startRow, startCol, endRow, endCol) => {
  if (startRow === endRow || startCol === endCol) {
    if (isPathClear(startRow, startCol, endRow, endCol) === true) {
      console.log("Path is clear");
      return "valid";
    } else {
      return "invalid";
    }
  } else {
    return "invalid";
  }
};

const moveKnight = (startRow, startCol, endRow, endCol) => {
  if (
    // horizontal L
    (endRow === startRow + 1 && endCol === startCol + 2) ||
    (endRow === startRow + 1 && endCol === startCol - 2) ||
    (endRow === startRow - 1 && endCol === startCol + 2) ||
    (endRow === startRow - 1 && endCol === startCol - 2) ||
    // vertical L
    (endRow === startRow + 2 && endCol === startCol + 1) ||
    (endRow === startRow + 2 && endCol === startCol - 1) ||
    (endRow === startRow - 2 && endCol === startCol + 1) ||
    (endRow === startRow - 2 && endCol === startCol - 1)
  ) {
    return "valid";
  } else {
    return "invalid";
  }
};

const moveBishop = (startRow, startCol, endRow, endCol) => {
  // because board is a square when the bishop moves, it moves the same number of rows and columns
  if (Math.abs(endRow - startRow) === Math.abs(endCol - startCol)) {
    if (isPathClear(startRow, startCol, endRow, endCol) === true) {
      console.log("Path is clear");
      return "valid";
    } else {
      return "invalid";
    }
  } else {
    return "invalid";
  }
};

const moveKing = (startRow, startCol, endRow, endCol) => {
  // because board is a square when the bishop moves, it moves the same number of rows and columns
  if (
    (endRow === startRow + 1 && startCol === endCol) ||
    (endRow === startRow - 1 && startCol === endCol) ||
    (endRow === startRow && endCol === startCol + 1) ||
    (endRow === startRow && endCol === startCol - 1) ||
    Math.abs(endRow - startRow) === Math.abs(endCol - startCol)
  ) {
    return "valid";
  } else {
    return "invalid";
  }
};

// Function checks path but doesn't check final location
const isPathClear = (startRow, startCol, endRow, endCol) => {
  const rowDirection = Math.sign(endRow - startRow);
  const colDirection = Math.sign(endCol - startCol);

  let currentRow = startRow + rowDirection;
  let currentCol = startCol + colDirection;

  while (currentRow !== endRow || currentCol !== endCol) {
    console.log(
      "start pos and end pos info ",
      currentRow,
      currentCol,
      endRow,
      endCol
    );
    if (board[currentRow][currentCol] !== "  ") {
      return false;
    }

    currentRow += rowDirection;
    currentCol += colDirection;
  }

  return true;
};

const playerInput = () => {
  console.log("******** Player input **********");
  let chessPieceLocation = prompt(
    "Enter the location of the piece you want to move. E.g 'a2': "
  );
  let chessPieceNewLocation = prompt(
    "Enter the NEW location you want to move the piece to. E.g 'a3': "
  );

  let startPos = pos(chessPieceLocation.trim());
  let endPos = pos(chessPieceNewLocation.trim());
  const [startRow, startCol] = startPos;
  const [endRow, endCol] = endPos;
  return { startRow, startCol, endRow, endCol };
};

const printBoard = (board) => {
  console.log("*********** chess board *********");
  board.forEach((row) => {
    console.log(row.join(" "));
  });
};

const possibleMoves = (startRow, startCol, endRow, endCol) => {
  let pieceSelected = board[startRow][startCol];
  let whichPiece = pieceSelected[1];
  switch (whichPiece) {
    case "N":
      return moveKnight(startRow, startCol, endRow, endCol);
    case "B":
      return moveBishop(startRow, startCol, endRow, endCol);
    case "P":
      return movePawn(startRow, startCol, endRow, endCol);
    case "R":
      return moveRook(startRow, startCol, endRow, endCol);
    case "K":
      return moveKing(startRow, startCol, endRow, endCol);
    case "Q":
      break;
  }
};

const playerMove = () => {
  const { startRow, startCol, endRow, endCol } = playerInput();

  let move = {};

  if (possibleMoves(startRow, startCol, endRow, endCol) === "valid") {
    move.isValid = true;
    move.capturedPiece = false;
  } else if (possibleMoves(startRow, startCol, endRow, endCol) === "captured") {
    move.isValid = true;
    move.capturedPiece = true;
  } else {
    move.isValid = false;
  }

  move.startRow = startRow;
  move.startCol = startCol;
  move.endRow = endRow;
  move.endCol = endCol;

  return move;
};

const playGame = () => {
  let currentPlayer = "W";
  let numberOfMoves = 0;
  let numberOfTurnsToPlay = 4;

  let playerTurn = playerMove();

  while (numberOfMoves < numberOfTurnsToPlay) {
    while (playerTurn.isValid === false) {
      console.log("Invalid move. Please try again.");
      playerTurn = playerMove();
    }
    // if playerTurn is Valid
    let selectedPiece = board[playerTurn.startRow][playerTurn.startCol];
    if (playerTurn.capturedPiece === true) {
      let capturedPiece = board[playerTurn.endRow][playerTurn.endCol];
      console.log(`piece ${selectedPiece} captured ${capturedPiece}`);
    }
    board[playerTurn.endRow][playerTurn.endCol] = selectedPiece;
    board[playerTurn.startRow][playerTurn.startCol] = "  ";
    printBoard(board);
    numberOfMoves += 1;

    if (numberOfMoves < numberOfTurnsToPlay) {
      currentPlayer = currentPlayer === "W" ? "B" : "W";
      console.log("Next player is ", currentPlayer);
      playerTurn = playerMove();
    }
  }

  console.log("number of moves", numberOfMoves);
  console.log("number of turns to play", numberOfTurnsToPlay);
};

playGame();
