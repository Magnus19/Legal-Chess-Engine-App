import { board, Game } from "./app.js";

class ChessPieces {
	constructor(name) {
		this.name = name;
	}
	getPlayer(piece) {
		if (piece != "") {
			if (piece === piece.toLowerCase()) return "black";
			else if (piece === piece.toUpperCase()) return "white";
		} else return null;
	}
	getEnemy(piece) {
		if (piece !== "") {
			if (piece === piece.toLowerCase()) return "black";
			else if (piece === piece.toUpperCase()) return "white";
		} else return null;
	}
	genMoves() {
		console.log(`${this.name} moves...`);
	}
}

const PawnRule = {
	intialPos: {
		"1 0": false,
		"1 1": false,
		"1 2": false,
		"1 3": false,
		"1 4": false,
		"1 5": false,
		"1 6": false,
		"1 7": false,
		"6 0": false,
		"6 1": false,
		"6 2": false,
		"6 3": false,
		"6 4": false,
		"6 5": false,
		"6 6": false,
		"6 7": false,
	},
	enPassantPos: {
		"3 0": false,
		"3 1": false,
		"3 2": false,
		"3 3": false,
		"3 4": false,
		"3 5": false,
		"3 6": false,
		"3 7": false,
		"4 0": false,
		"4 1": false,
		"4 2": false,
		"4 3": false,
		"4 4": false,
		"4 5": false,
		"4 6": false,
		"4 7": false,
	},
};

class Pawn extends ChessPieces {
	constructor(name) {
		super(name);
	}
	genMoves(row, col) {
		// Get the actual this.name of the piece
		const piece = board[row][col];
		// Get player to determine how piece moves.
		let player = this.getPlayer(piece);
		let enemy = null;
		player === "white" ? (enemy = "black") : (enemy = "white");
		let direction;
		player === "white" ? (direction = -1) : (direction = 1);

		// This will only generate the moves which the board will reference.
		let possibleMoves = [];
		row = Number(row);
		col = Number(col);

		const iniPos = PawnRule.intialPos;
		// const passPos = PawnRule.enPassantPos;

		// // enPassant
		// for (let key of Object.keys(passPos)) {
		// 	// Out of bounds guard
		// 	if (col + 1 >= board.length || col - 1 <= -1) break;
		// 	if (key !== Game.to) continue;
		// 	// if enPassant move was once possible but never done, skip
		// 	if (passPos[key]) continue;

		// 	// Another out of bounds guard
		// 	if (Number(Game.to[2]) + 1 < board.length) {
		// 		if (
		// 			this.getEnemy(board[Number(Game.to[0])][Number(Game.to[2]) + 1]) ===
		// 			player
		// 		) {
		// 			possibleMoves.push(`${row + 1 * direction} ${col - 1}`);
		// 			passPos[key] = true;
		// 			Game.enPassant = true;
		// 		}
		// 	}

		// 	if (Number(Game.to[2]) - 1 > -1) {
		// 		if (
		// 			this.getEnemy(board[Number(Game.to[0])][Number(Game.to[2]) - 1]) ===
		// 			player
		// 		) {
		// 			possibleMoves.push(`${row + 1 * direction} ${col + 1}`);
		// 			passPos[key] = true;
		// 			Game.enPassant = true;
		// 		}
		// 	}
		// 	break;
		// }

		let isFirstMove = false;
		for (let key of Object.keys(iniPos)) {
			const iniX = Number(key[2]);

			// Black side
			if (row === 1 && col === iniX && this.getPlayer(piece) === "black")
				isFirstMove = true;
			else if (row === 6 && col === iniX && this.getPlayer(piece) === "white") {
				isFirstMove = true;
			}
		}

		// If statement guard to check if row + 1 is out of bounds
		if (row + 1 * direction >= board.length || row + 1 * direction < 0) return;

		if (board[row + 1 * direction][col] === "")
			possibleMoves.push(`${row + 1 * direction} ${col}`);
		// Eat moves
		if (
			board[row + 1 * direction][col - 1] !== undefined &&
			this.getEnemy(board[row + 1 * direction][col - 1]) === enemy
		)
			possibleMoves.push(`${row + 1 * direction} ${col - 1}`);
		if (
			board[row + 1 * direction][col + 1] !== undefined &&
			this.getEnemy(board[row + 1 * direction][col + 1]) === enemy
		)
			possibleMoves.push(`${row + 1 * direction} ${col + 1}`);

		if (isFirstMove) {
			if (
				board[row + 2 * direction][col] === "" &&
				board[row + 1 * direction][col] === ""
			)
				possibleMoves.push(`${row + 2 * direction} ${col}`);
		}

		return possibleMoves;
	}
}

class Rook extends ChessPieces {
	constructor(name) {
		super(name);
	}
	genMoves(row, col) {
		const piece = board[row][col];
		let possibleMoves = [];
		row = Number(row);
		col = Number(col);

		let player = this.getPlayer(piece);
		let enemy = null;
		player === "white" ? (enemy = "black") : (enemy = "white");

		// VERTICAL
		let newRow = row + 1;
		while (newRow < board.length) {
			if (board[newRow][col] === "") {
				possibleMoves.push(`${newRow} ${col}`);
			} else {
				if (this.getEnemy(board[newRow][col]) === enemy) {
					possibleMoves.push(`${newRow} ${col}`);
					break;
				} else {
					break;
				}
			}
			newRow++;
		}

		newRow = row - 1;
		while (newRow >= 0) {
			if (board[newRow][col] === "") {
				possibleMoves.push(`${newRow} ${col}`);
			} else {
				if (this.getEnemy(board[newRow][col]) === enemy) {
					possibleMoves.push(`${newRow} ${col}`);
					break;
				} else {
					break;
				}
			}
			newRow--;
		}

		// HORIZONTAL
		let newCol = col + 1;
		while (newCol < board.length) {
			if (board[row][newCol] === "") {
				possibleMoves.push(`${row} ${newCol}`);
			} else {
				if (this.getEnemy(board[row][newCol]) === enemy) {
					possibleMoves.push(`${row} ${newCol}`);
					break;
				} else {
					break;
				}
			}
			newCol++;
		}

		newCol = col - 1;
		while (newCol >= 0) {
			if (board[row][newCol] === "") {
				possibleMoves.push(`${row} ${newCol}`);
			} else {
				if (this.getEnemy(board[row][newCol]) === enemy) {
					possibleMoves.push(`${row} ${newCol}`);
					break;
				} else {
					break;
				}
			}
			newCol--;
		}
		return possibleMoves;
	}
}

class Bishop extends ChessPieces {
	constructor(name) {
		super(name);
	}
	genMoves(row, col) {
		const piece = board[row][col];
		let possibleMoves = [];
		row = Number(row);
		col = Number(col);

		let player = this.getPlayer(piece);
		let enemy = null;
		player === "white" ? (enemy = "black") : (enemy = "white");

		// HORIZONTAL LEFT UP
		let newRow = row - 1;
		let newCol = col - 1;
		while (newRow >= 0 && newCol >= 0) {
			if (board[newRow][newCol] === "") {
				possibleMoves.push(`${newRow} ${newCol}`);
			} else {
				if (this.getEnemy(board[newRow][newCol]) === enemy) {
					possibleMoves.push(`${newRow} ${newCol}`);
					break;
				} else {
					break;
				}
			}
			newRow--;
			newCol--;
		}

		// HORIZONTAL LEFT DOWN
		newRow = row + 1;
		newCol = col - 1;
		while (newRow < board.length && newCol >= 0) {
			if (board[newRow][newCol] === "") {
				possibleMoves.push(`${newRow} ${newCol}`);
			} else {
				if (this.getEnemy(board[newRow][newCol]) === enemy) {
					possibleMoves.push(`${newRow} ${newCol}`);
					break;
				} else {
					break;
				}
			}
			newRow++;
			newCol--;
		}

		// HORIZONTAL RIGHT UP
		newRow = row - 1;
		newCol = col + 1;
		while (newRow >= 0 && newCol < board.length) {
			if (board[newRow][newCol] === "") {
				possibleMoves.push(`${newRow} ${newCol}`);
			} else {
				if (this.getEnemy(board[newRow][newCol]) === enemy) {
					possibleMoves.push(`${newRow} ${newCol}`);
					break;
				} else {
					break;
				}
			}
			newRow--;
			newCol++;
		}
		// HORIZONTAL RIGHT DOWN
		newRow = row + 1;
		newCol = col + 1;
		while (newRow < board.length && newCol < board.length) {
			if (board[newRow][newCol] === "") {
				possibleMoves.push(`${newRow} ${newCol}`);
			} else {
				if (this.getEnemy(board[newRow][newCol]) === enemy) {
					possibleMoves.push(`${newRow} ${newCol}`);
					break;
				} else {
					break;
				}
			}
			newRow++;
			newCol++;
		}
		return possibleMoves;
	}
}

class Knight extends ChessPieces {
	constructor(name) {
		super(name);
	}
	genMoves(row, col) {
		const piece = board[row][col];
		let possibleMoves = [];
		row = Number(row);
		col = Number(col);

		let player = this.getPlayer(piece);
		let enemy = null;
		player === "white" ? (enemy = "black") : (enemy = "white");
		let direction;
		player === "white" ? (direction = -1) : (direction = 1);

		const moves = [
			[-2, -1],
			[-2, 1],
			[-1, -2],
			[1, -2],
			[-1, 2],
			[1, 2],
			[2, -1],
			[2, 1],
		];

		// The knight moves in predertimined locations. Find those predetermined locations (Done)
		// How will we use those locations for?

		for (let [moveY, moveX] of moves) {
			moveY += row;
			moveX += col;
			if (moveY >= board.length || moveY < 0) continue;
			if (moveX >= board.length || moveX < 0) continue;

			if (board[moveY][moveX] === "") possibleMoves.push(`${moveY} ${moveX}`);
			if (this.getEnemy(board[moveY][moveX]) === enemy)
				possibleMoves.push(`${moveY} ${moveX}`);
		}

		return possibleMoves;
	}
}

class Queen extends ChessPieces {
	constructor(name) {
		super(name);
	}
	genMoves(row, col) {
		const piece = board[row][col];
		let possibleMoves = [];
		row = Number(row);
		col = Number(col);

		let player = this.getPlayer(piece);
		let enemy = null;
		player === "white" ? (enemy = "black") : (enemy = "white");

		// BISHOP
		// HORIZONTAL LEFT UP
		let newRow = row - 1;
		let newCol = col - 1;
		while (newRow >= 0 && newCol >= 0) {
			if (board[newRow][newCol] === "") {
				possibleMoves.push(`${newRow} ${newCol}`);
			} else {
				if (this.getEnemy(board[newRow][newCol]) === enemy) {
					possibleMoves.push(`${newRow} ${newCol}`);
					break;
				} else {
					break;
				}
			}
			newRow--;
			newCol--;
		}

		// HORIZONTAL LEFT DOWN
		newRow = row + 1;
		newCol = col - 1;
		while (newRow < board.length && newCol >= 0) {
			if (board[newRow][newCol] === "") {
				possibleMoves.push(`${newRow} ${newCol}`);
			} else {
				if (this.getEnemy(board[newRow][newCol]) === enemy) {
					possibleMoves.push(`${newRow} ${newCol}`);
					break;
				} else {
					break;
				}
			}
			newRow++;
			newCol--;
		}

		// HORIZONTAL RIGHT UP
		newRow = row - 1;
		newCol = col + 1;
		while (newRow >= 0 && newCol < board.length) {
			if (board[newRow][newCol] === "") {
				possibleMoves.push(`${newRow} ${newCol}`);
			} else {
				if (this.getEnemy(board[newRow][newCol]) === enemy) {
					possibleMoves.push(`${newRow} ${newCol}`);
					break;
				} else {
					break;
				}
			}
			newRow--;
			newCol++;
		}
		// HORIZONTAL RIGHT DOWN
		newRow = row + 1;
		newCol = col + 1;
		while (newRow < board.length && newCol < board.length) {
			if (board[newRow][newCol] === "") {
				possibleMoves.push(`${newRow} ${newCol}`);
			} else {
				if (this.getEnemy(board[newRow][newCol]) === enemy) {
					possibleMoves.push(`${newRow} ${newCol}`);
					break;
				} else {
					break;
				}
			}
			newRow++;
			newCol++;
		}

		// ROOK
		// VERTICAL
		newRow = row + 1;
		while (newRow < board.length) {
			if (board[newRow][col] === "") {
				possibleMoves.push(`${newRow} ${col}`);
			} else {
				if (this.getEnemy(board[newRow][col]) === enemy) {
					possibleMoves.push(`${newRow} ${col}`);
					break;
				} else {
					break;
				}
			}
			newRow++;
		}

		newRow = row - 1;
		while (newRow >= 0) {
			if (board[newRow][col] === "") {
				possibleMoves.push(`${newRow} ${col}`);
			} else {
				if (this.getEnemy(board[newRow][col]) === enemy) {
					possibleMoves.push(`${newRow} ${col}`);
					break;
				} else {
					break;
				}
			}
			newRow--;
		}

		// HORIZONTAL
		newCol = col + 1;
		while (newCol < board.length) {
			if (board[row][newCol] === "") {
				possibleMoves.push(`${row} ${newCol}`);
			} else {
				if (this.getEnemy(board[row][newCol]) === enemy) {
					possibleMoves.push(`${row} ${newCol}`);
					break;
				} else {
					break;
				}
			}
			newCol++;
		}

		newCol = col - 1;
		while (newCol >= 0) {
			if (board[row][newCol] === "") {
				possibleMoves.push(`${row} ${newCol}`);
			} else {
				if (this.getEnemy(board[row][newCol]) === enemy) {
					possibleMoves.push(`${row} ${newCol}`);
					break;
				} else {
					break;
				}
			}
			newCol--;
		}
		return possibleMoves;
	}
}

class King extends ChessPieces {
	constructor(name) {
		super(name);
	}
	genMoves(row, col) {
		const piece = board[row][col];
		let possibleMoves = [];
		row = Number(row);
		col = Number(col);

		let player = this.getPlayer(piece);
		let enemy = null;
		player === "white" ? (enemy = "black") : (enemy = "white");

		// Vertical and Horizontal
		if (row + 1 < board.length) {
			if (board[row + 1][col] === "") possibleMoves.push(`${row + 1} ${col}`);
			if (this.getEnemy(board[row + 1][col]) === enemy)
				possibleMoves.push(`${row + 1} ${col}`);
		}
		if (row - 1 > -1) {
			if (board[row - 1][col] === "") possibleMoves.push(`${row - 1} ${col}`);
			if (this.getEnemy(board[row - 1][col]) === enemy)
				possibleMoves.push(`${row - 1} ${col}`);
		}
		if (col + 1 < board.length) {
			if (board[row][col + 1] === "") possibleMoves.push(`${row} ${col + 1}`);
			if (this.getEnemy(board[row][col + 1]) === enemy)
				possibleMoves.push(`${row} ${col + 1}`);
		}
		if (col - 1 > -1) {
			if (board[row][col - 1] === "") possibleMoves.push(`${row} ${col - 1}`);
			if (this.getEnemy(board[row][col - 1]) === enemy)
				possibleMoves.push(`${row} ${col - 1}`);
		}

		// Diagonal
		if (row + 1 < board.length && col - 1 > -1) {
			if (board[row + 1][col - 1] === "")
				possibleMoves.push(`${row + 1} ${col - 1}`);
			if (this.getEnemy(board[row + 1][col - 1]) === enemy)
				possibleMoves.push(`${row + 1} ${col - 1}`);
		}
		if (row + 1 < board.length && col + 1 < board.length) {
			if (board[row + 1][col + 1] === "")
				possibleMoves.push(`${row + 1} ${col + 1}`);
			if (this.getEnemy(board[row + 1][col + 1]) === enemy)
				possibleMoves.push(`${row + 1} ${col + 1}`);
		}
		if (row - 1 > -1 && col - 1 > -1) {
			if (board[row - 1][col - 1] === "")
				possibleMoves.push(`${row - 1} ${col - 1}`);
			if (this.getEnemy(board[row - 1][col - 1]) === enemy)
				possibleMoves.push(`${row - 1} ${col - 1}`);
		}
		if (row - 1 > -1 && col + 1 < board.length) {
			if (board[row - 1][col + 1] === "")
				possibleMoves.push(`${row - 1} ${col + 1}`);
			if (this.getEnemy(board[row - 1][col + 1]) === enemy)
				possibleMoves.push(`${row - 1} ${col + 1}`);
		}
		return possibleMoves;
	}
}

export { Pawn, Rook, Bishop, Knight, Queen, King };
