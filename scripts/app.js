import { Pawn, Rook, Bishop, Knight, Queen, King } from "./pieces.js";

const promotionOverlay = document.querySelector("#promotion-overlay");
const chessBoard = document.querySelector("#chess-board");

let board = [
	["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"],
	["pawn", "pawn", "pawn", "pawn", "pawn", "pawn", "pawn", "pawn"],
	["", "", "", "", "", "", "", ""],
	["", "", "", "", "", "", "", ""],
	["", "", "", "", "", "", "", ""],
	["", "", "", "", "", "", "", ""],
	["PAWN", "PAWN", "PAWN", "PAWN", "PAWN", "PAWN", "PAWN", "PAWN"],
	["ROOK", "", "", "", "KING", "", "", "ROOK"],
];

// Create a global access for each single grids
const gridParent = chessBoard.children;

// Create a Game module for better accessibility
const Game = {
	moves: [],
	from: null,
	to: null, // to acts as the last move that was done
	turn: "white",
	enPassantTarget: null,
	castleSquares: [],
	castleRights: {
		black: { kingSide: false, queenSide: false },
		white: { kingSide: false, queenSide: false },
	},
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

// Helper Function
const getPiecePlayer = (piece) => {
	if (piece === piece.toLowerCase()) return "black";
	else if (piece === piece.toUpperCase()) return "white";
};

const selectPiece = (row, col) => {
	Game.from = `${row} ${col}`;
};

// Look out for this, MAY CONFLICT WITH OTHER MOVE TYPES IF THIS IS TOO AMBIGUOUS
const isNormalCapture = (enemyPiece) => {
	if (getPiecePlayer(enemyPiece) !== Game.turn) return true;
	else return false;
};

const isEnPassant = (row, col, piece) => {
	if (!Game.enPassantTarget) return false;
	if (piece.toLowerCase() !== "pawn") return false;
	if (col !== Number(Game.enPassantTarget[2])) return false;
	if (
		row !==
		Number(Game.enPassantTarget[0]) +
			(getPiecePlayer(piece) === "black" ? 1 : -1)
	) {
		return false;
	}
	return true;
};

const isCastle = (piece) => {
	if (!Game.castleSquares) return false;
	if (piece.toLowerCase() !== "king") return false;
	return true;
};

const movePiece = (row, col) => {
	const fromY = Game.from[0];
	const fromX = Game.from[2];
	const piece = board[fromY][fromX];
	const enemyPiece = board[row][col];

	// For normal captures
	if (isNormalCapture(enemyPiece)) {
		// Make the enemy piece blank
		board[row][col] = "";
		// Add certain things to track enemy score or add history...
	}

	// For en passant
	if (isEnPassant(row, col, piece)) {
		board[Number(Game.enPassantTarget[0])][Number(Game.enPassantTarget[2])] =
			"";
	}

	if (isCastle(piece)) {
		Game.castleSquares.forEach((coords) => {
			console.log(`row: ${row} row coords: ${coords[0]}`);
			if (row === Number(coords[0]) && col === Number(coords[2])) {
				const kingOrQueenSide = col === 2 ? -2 : 1;
				const rook = board[row][col + kingOrQueenSide];
				console.log(rook);
				board[row][col + 1 * (col === 2 ? 1 : -1)] = rook;
				board[row][col + kingOrQueenSide] = "";
			}
		});
	}

	// Store information of last move to be saved
	Game.to = `${row} ${col}`;

	// Universally place the piece from its position to the clicked place regardless of what type of move was done
	board[row][col] = board[fromY][fromX];
	board[fromY][fromX] = ""; // Reset the last position to avoid duplication
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

// Note: handle logic from pawnPromotion listener
const pawnPromotion = (row, col, event) => {
	// Use game.turn, but access the actual side that promoted by going backward. Ex: Game.turn = "white", then the actual promotion side is "black" since turn updated.
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
};

const isPawnMoveTwoSquare = () => {
	const toY = Number(Game.to[0]);
	const toX = Number(Game.to[2]);
	const fromY = Number(Game.from[0]);
	const piece = board[toY][toX];

	let direction;
	getPiecePlayer(piece) === "black" ? (direction = 1) : (direction = -1);

	if (toY === fromY + 2 * direction) {
		return true;
	}
	return false;
};

const updateEnPassantSquare = () => {
	if (!Game.to) return false;
	const toY = Number(Game.to[0]);
	const toX = Number(Game.to[2]);
	const piece = board[toY][toX];

	Game.enPassantTarget = null;

	if (piece.toLowerCase() !== "pawn") return;

	if (isPawnMoveTwoSquare()) Game.enPassantTarget = `${toY} ${toX}`;
	return;
};

const pushEnPassantMove = (row, col) => {
	const piece = board[row][col];
	if (getPiecePlayer(piece) !== Game.turn) return;
	if (!Game.enPassantTarget) return;

	let direction;
	getPiecePlayer(piece) === "black" ? (direction = 1) : (direction = -1);

	const targetRow = Number(Game.enPassantTarget[0]);
	const targetCol = Number(Game.enPassantTarget[2]);

	if (targetRow !== row) return;
	if (Math.abs(targetCol - col) !== 1) return;

	const moveRow = row + direction;
	const moveCol = targetCol;

	Game.moves.push(`${moveRow} ${moveCol}`);
};

const isSquaresVacant = (color) => {
	const row = color === "white" ? 7 : 0;
	const requiredVacantSquares = {
		queenSide: [1, 2, 3],
		kingSide: [5, 6],
	};

	Game.castleRights[color].queenSide = requiredVacantSquares.queenSide.every(
		(col) => board[row][col] === ""
	);

	Game.castleRights[color].kingSide = requiredVacantSquares.kingSide.every(
		(col) => board[row][col] === ""
	);
};

const updateCastleRights = () => {
	const fromX = Number(Game.from[2]);
	const toY = Number(Game.to[0]);
	const toX = Number(Game.to[2]);
	const piece = board[toY][toX];
	const color = getPiecePlayer(piece);
	isSquaresVacant(color);

	if (piece.toLowerCase() === "king") {
		Game.castleRights[color].queenSide = false;
		Game.castleRights[color].kingSide = false;
	}

	if (piece.toLowerCase() === "rook") {
		if (fromX === 0) Game.castleRights[color].queenSide = false;
		else if (fromX === 7) Game.castleRights[color].kingSide = false;
	}
	console.log(Game.castleRights[color].kingSide);
};

const pushCastleMove = (row, col) => {
	const piece = board[row][col];
	if (piece.toLowerCase() !== "king") return;
	// if no squares are blocking
	if (piece === "king") {
		if (Game.castleRights.black.queenSide === true) {
			Game.moves.push(`${0} ${2}`);
			Game.castleSquares.push(`${0} ${2}`);
		}
		if (Game.castleRights.black.kingSide === true) {
			Game.moves.push(`${0} ${6}`);
			Game.castleSquares.push(`${0} ${6}`);
		}
	} else if (piece === "KING") {
		if (Game.castleRights.white.queenSide === true) {
			Game.moves.push(`${7} ${2}`);
			Game.castleSquares.push(`${7} ${2}`);
		}

		if (Game.castleRights.white.kingSide === true) {
			Game.moves.push(`${7} ${6}`);
			Game.castleSquares.push(`${7} ${6}`);
		}
	}
	console.log(Game.castleSquares);
	// (next time) if checkmate
};

// GUI Handling
const pawnPromotionOverlay = (row, col) => {
	if (board[row][col].toLowerCase() !== "pawn") return;
	// Add a condition to check if it is white or black, and the appropriate row position to check if its at the right side
	promotionOverlay.style.display = "flex";
	promotionOverlay.addEventListener(
		"click",
		(event) => {
			event = event.target;
			if (!event.classList.contains("choice")) return;
			pawnPromotion(row, col, event);
			drawPieces();
			promotionOverlay.style.display = "none";
			listenerAdded = true;
		},
		{ once: true } // Event listener triggers once then deletes. (Avoid duplication)
	);
};

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
	} // Reset grids

	// Loop through entire board to draw pieces
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
		// No piece is selected
		if (!piece) return;

		selectPiece(row, col);
		highlightGrid(row, col);

		Game.moves = getMovesByPiece(piece, row, col);
		pushEnPassantMove(row, col);
		pushCastleMove(row, col);
		if (!Game.moves) return (Game.from = null);
		drawPossibleMoves(Game.moves);
		return;
	}

	// Still clicking on a piece of the same side
	if (piece && isValidTurn(row, col)) {
		selectPiece(row, col);
		highlightGrid(row, col);

		Game.moves = getMovesByPiece(piece, row, col);
		pushEnPassantMove(row, col);
		pushCastleMove(row, col);
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

	movePiece(row, col);
	updateEnPassantSquare();
	updateCastleRights();
	if (isPromotionEligible(row, col)) pawnPromotionOverlay(row, col);
	Game.moves = null;
	Game.from = null;
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

export { board, Game };
