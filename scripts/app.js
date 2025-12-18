import { Pawn, Rook, Bishop, Knight, Queen, King } from "./pieces.js";

const promotionOverlay = document.querySelector("#promotion-overlay");
const chessBoard = document.querySelector("#chess-board");

let board = [
	["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"],
	["pawn", "pawn", "pawn", "pawn", "pawn", "pawn", "pawn", "pawn"],
	["", "", "", "PAWN", "", "", "", ""],
	["", "", "", "", "", "", "", ""],
	["", "", "", "", "", "", "", ""],
	["", "", "pawn", "", "", "", "", ""],
	["PAWN", "PAWN", "PAWN", "PAWN", "PAWN", "PAWN", "PAWN", "PAWN"],
	["ROOK", "KNIGHT", "BISHOP", "QUEEN", "KING", "BISHOP", "KNIGHT", "ROOK"],
];

// Create a global access for each single grids
const gridParent = chessBoard.children;

// Create a Game module for better accessibility
const Game = {
	moves: [],
	from: null,
	to: null,
	turn: "white",
};

// Event listener guard for pawnPromotionOverlay
let listenerAdded = false;

// Define Pieces
const pawn = new Pawn("pawn");
const rook = new Rook("rook");
const bishop = new Bishop("bishop");
const knight = new Knight("knight");
const queen = new Queen("queen");
const king = new King("king");

// Rule functions
const isValidTurn = (row, col) => {
	let enemyTurn = null;
	Game.turn === "white" ? (enemyTurn = "black") : (enemyTurn = "white");

	for (let grid of gridParent) {
		if (String(row) === grid.dataset.row && String(col) === grid.dataset.col) {
			for (let child of grid.children) {
				if (child.className.includes(enemyTurn)) {
					console.log("Not your turn");
					return false;
				}
			}
		}
	}
	return true;
};

const isLegal = (row, col) => {
	const toY = row;
	const toX = col;
	let isLegalMove = false;

	// If no moves are possible anymore
	for (let i = 0; i < Game.moves.length; i++) {
		const toMove = Game.moves[i];
		const legalY = Number(toMove[0]);
		const legalX = Number(toMove[2]);
		if (toY === legalY && toX === legalX) {
			isLegalMove = true;
			break;
		}
	}

	if (!isLegalMove) {
		console.log("Not legal");
		Game.from = null;
		return false;
	} else return true;
};

// Draw board
const genBoard = () => {
	let gridCounter = 0;
	let alternateBoard = false;
	for (let row = 0; row < board.length; row++) {
		for (let col = 0; col < board[row].length; col++) {
			const grid = document.createElement("div");
			grid.dataset.col = col;
			grid.dataset.row = row;
			grid.classList.add("grid");
			gridCounter++;
			if (alternateBoard === false) {
				if (gridCounter % 2 === 0) {
					grid.classList.add("light-grid");
				} else {
					grid.classList.add("dark-grid");
				}
			} else if (alternateBoard === true) {
				if (gridCounter % 2 !== 0) {
					grid.classList.add("light-grid");
				} else {
					grid.classList.add("dark-grid");
				}
			}
			chessBoard.appendChild(grid);
		}
		if (alternateBoard === false) {
			alternateBoard = true;
		} else if (alternateBoard === true) {
			alternateBoard = false;
		}
	}
};

const getMovesByPiece = (piece, row, col) => {
	switch (piece.toLowerCase()) {
		case "pawn":
			return pawn.genMoves(row, col);
		case "rook":
			return rook.genMoves(row, col);
		case "bishop":
			return bishop.genMoves(row, col);
		case "knight":
			return knight.genMoves(row, col);
		case "queen":
			return queen.genMoves(row, col);
		case "king":
			return king.genMoves(row, col);
	}
};

const selectPiece = (row, col) => {
	console.log("selecting...");
	Game.from = `${row} ${col}`;
};

const placePiece = (row, col) => {
	console.log("placing...");
	const fromY = Game.from[0];
	const fromX = Game.from[2];

	board[row][col] = board[fromY][fromX];
	board[fromY][fromX] = "";
	Game.from = null;
};

const changePlayerTurn = () => {
	if (Game.turn === "white") {
		Game.turn = "black";
		return "white";
	} else if (Game.turn === "black") {
		Game.turn = "white";
		return "black";
	}
};

// Special Rules
const isPromotionEligible = (row, col) => {
	const piece = board[row][col];
	if (piece === "pawn" && row === 7) return true;
	else if (piece === "PAWN" && row === 0) return true;
	else return false;
};

const pawnPromotionOverlay = (row, col) => {
	if (board[row][col].toLowerCase() !== "pawn") return;
	// Add a condition to check if it is white or black, and the appropriate row position to check if its at the right side
	promotionOverlay.style.display = "flex";
	console.log(`Before: ${listenerAdded}`);
	promotionOverlay.addEventListener(
		"click",
		(event) => {
			event = event.target;
			if (!event.classList.contains("choice")) return;
			pawnPromotion(row, col, event);
			drawPieces();
			promotionOverlay.style.display = "none";
			listenerAdded = true;
			console.log(`After: ${listenerAdded}`);
		},
		{ once: true } // Event listener triggers once then deletes. (Avoid duplication)
	);
};

// Note: handle logic from pawnPromotion listener
const pawnPromotion = (row, col, event) => {
	// Use game.turn, but access the actual side that promoted by going backward. Ex: Game.turn = "white", then the actual promotion side is "black" since turn updated.
	console.log(`Choice: ${event.id} Game.turn: ${Game.turn}`);
	if (event.id === "choice1" && Game.turn === "black")
		board[row][col] = "QUEEN";
	else if (event.id === "choice2" && Game.turn === "black")
		board[row][col] = "ROOK";
	else if (event.id === "choice3" && Game.turn === "black")
		board[row][col] = "BISHOP";
	else if (event.id === "choice4" && Game.turn === "black")
		board[row][col] = "KNIGHT";
	else if (event.id === "choice1" && Game.turn === "white")
		board[row][col] = "queen";
	else if (event.id === "choice2" && Game.turn === "white")
		board[row][col] = "rook";
	else if (event.id === "choice3" && Game.turn === "white")
		board[row][col] = "bishop";
	else if (event.id === "choice4" && Game.turn === "white")
		board[row][col] = "knight";
	// Should we manually find the
};

// GUI Handling
const highlightGrid = (row, col) => {
	for (let grid of gridParent) {
		grid.classList.remove("highlight-grid");
		if (String(row) === grid.dataset.row && String(col) === grid.dataset.col) {
			grid.classList.add("highlight-grid");
		}
	}
};

const drawPossibleMoves = (moves) => {
	// Loop through the grids then access it if its equal to the move positions
	for (let grid of gridParent) {
		// Reset the board visuals
		grid.classList.remove("possible-grid");
		for (let i = 0; i < moves.length; i++) {
			if (
				// The reason for the 0 and 2 is its accessing the X and Y in this format: Row Col
				// Discovered new syntax sugar" for [var1, var2] use that for this for loop instead
				grid.dataset.row === moves[i][0] &&
				grid.dataset.col === moves[i][2]
			) {
				grid.classList.add("possible-grid");
			}
		}
	}
};

const drawPieces = () => {
	for (let grid of gridParent) {
		for (let anotherGrid of grid.children) {
			anotherGrid.remove();
		}
	}

	// Loop through entire board to draw pieces depending on the pieces assigned to the array
	for (let row = 0; row < board.length; row++) {
		for (let col = 0; col < board[row].length; col++) {
			const piece = board[row][col];

			switch (piece.toLowerCase()) {
				case "pawn":
					for (let grid of gridParent) {
						if (
							grid.dataset.row === String(row) &&
							grid.dataset.col === String(col)
						) {
							if (piece === piece.toLowerCase()) {
								const blackPawnPic = document.createElement("div");
								blackPawnPic.classList.add("black-pawn");
								grid.appendChild(blackPawnPic);
							} else if (piece === piece.toUpperCase()) {
								const whitePawnPic = document.createElement("div");
								whitePawnPic.classList.add("white-pawn");
								grid.appendChild(whitePawnPic);
							}
						}
					}
					break;
				case "rook":
					for (let grid of gridParent) {
						if (
							grid.dataset.row === String(row) &&
							grid.dataset.col === String(col)
						) {
							if (piece === piece.toLowerCase()) {
								const blackRookPic = document.createElement("div");
								blackRookPic.classList.add("black-rook");
								grid.appendChild(blackRookPic);
							} else if (piece === piece.toUpperCase()) {
								const whiteRookPic = document.createElement("div");
								whiteRookPic.classList.add("white-rook");
								grid.appendChild(whiteRookPic);
							}
						}
					}
					break;
				case "bishop":
					for (let grid of gridParent) {
						if (
							grid.dataset.row === String(row) &&
							grid.dataset.col === String(col)
						) {
							if (piece === piece.toLowerCase()) {
								const blackBishopPic = document.createElement("div");
								blackBishopPic.classList.add("black-bishop");
								grid.appendChild(blackBishopPic);
							} else if (piece === piece.toUpperCase()) {
								const whiteBishopPic = document.createElement("div");
								whiteBishopPic.classList.add("white-bishop");
								grid.appendChild(whiteBishopPic);
							}
						}
					}
					break;
				case "knight":
					for (let grid of gridParent) {
						if (
							grid.dataset.row === String(row) &&
							grid.dataset.col === String(col)
						) {
							if (piece === piece.toLowerCase()) {
								const blackKnightPic = document.createElement("div");
								blackKnightPic.classList.add("black-knight");
								grid.appendChild(blackKnightPic);
							} else if (piece === piece.toUpperCase()) {
								const whiteKnightPic = document.createElement("div");
								whiteKnightPic.classList.add("white-knight");
								grid.appendChild(whiteKnightPic);
							}
						}
					}
					break;
				case "queen":
					for (let grid of gridParent) {
						if (
							grid.dataset.row === String(row) &&
							grid.dataset.col === String(col)
						) {
							if (piece === piece.toLowerCase()) {
								const blackQueenPic = document.createElement("div");
								blackQueenPic.classList.add("black-queen");
								grid.appendChild(blackQueenPic);
							} else if (piece === piece.toUpperCase()) {
								const whiteQueenPic = document.createElement("div");
								whiteQueenPic.classList.add("white-queen");
								grid.appendChild(whiteQueenPic);
							}
						}
					}
					break;
				case "king":
					for (let grid of gridParent) {
						if (
							grid.dataset.row === String(row) &&
							grid.dataset.col === String(col)
						) {
							if (piece === piece.toLowerCase()) {
								const blackKingPic = document.createElement("div");
								blackKingPic.classList.add("black-king");
								grid.appendChild(blackKingPic);
							} else if (piece === piece.toUpperCase()) {
								const whiteKingPic = document.createElement("div");
								whiteKingPic.classList.add("white-king");
								grid.appendChild(whiteKingPic);
							}
						}
					}
					break;
				default:
					continue;
			}
		}
	}
};

chessBoard.addEventListener("click", (event) => {
	if (!event.target.classList.contains("grid")) return;
	const row = Number(event.target.dataset.row);
	const col = Number(event.target.dataset.col);

	// Get value of the grid the button was clicked
	const piece = board[row][col];

	// Initial Select
	if (!Game.from) {
		if (!isValidTurn(row, col)) {
			for (let grid of gridParent) grid.classList.remove("possible-grid");
			return highlightGrid(row, col);
		}
		// No piece is selected equivalent to ""
		if (!piece) return;

		selectPiece(row, col);
		highlightGrid(row, col);

		Game.moves = getMovesByPiece(piece, row, col);
		// This is specifically for pawn not having the ability to promote yet, so its stuck at its positon, leads to no crashes.
		if (!Game.moves) return (Game.from = null);
		drawPossibleMoves(Game.moves);
		return;
	}

	// Still clicking on a piece of the same side
	if (piece && isValidTurn(row, col)) {
		selectPiece(row, col);
		highlightGrid(row, col);

		Game.moves = getMovesByPiece(piece, row, col);
		if (!Game.moves) return (Game.from = null);
		drawPossibleMoves(Game.moves);
		return;
	}

	if (!isLegal(row, col)) {
		if (!isValidTurn(row, col)) {
			for (let grid of gridParent) grid.classList.remove("possible-grid");
			highlightGrid(row, col);
			return;
		} else {
			for (let grid of gridParent) {
				grid.classList.remove("possible-grid");
				grid.classList.remove("highlight-grid");
			}
			return;
		}
	}

	placePiece(row, col);
	if (isPromotionEligible(row, col)) pawnPromotionOverlay(row, col);
	Game.moves = null;
	// Reset the board visuals
	for (let grid of gridParent) {
		grid.classList.remove("highlight-grid");
		grid.classList.remove("possible-grid");
	}

	changePlayerTurn();
	drawPieces();
	printBoard();
});

// Utility modules
// PRINT BOARD FOR VISUAL REP
const printBoard = () => {
	let stringifiedBoard = "";
	board.forEach((row) => (stringifiedBoard += JSON.stringify(row) + "\n"));
	console.log(stringifiedBoard);
};

// Potential use if I want to turn the HTML Collection list into an array.
// const updateGrid = () => {
// 	gridParent = Array...(chessBoard.children);
// }

genBoard();
drawPieces();
printBoard();

// MISTAKES AND LESSONS
// ATTRIBUTES LIKE DATASET.* IS CONSIDERED A STRING SO BE WARY OF PARSING IT TO A NUMBER IF REQUIRED.

export { board };
