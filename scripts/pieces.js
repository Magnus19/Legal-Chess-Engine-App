import { board } from "./app.js";

class ChessPieces {
	constructor(name) {
		this.name = name;
	}
	getPlayer(pieceName) {
		if (pieceName != "") {
			if (pieceName === pieceName.toLowerCase()) return "black";
			else if (pieceName === pieceName.toUpperCase()) return "white";
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

class Pawn extends ChessPieces {
	constructor(name) {
		super(name);
	}
	genMoves(row, col) {
		const intialPos = [
			"1 0",
			"1 1",
			"1 2",
			"1 3",
			"1 4",
			"1 5",
			"1 6",
			"1 7",
			"6 0",
			"6 1",
			"6 2",
			"6 3",
			"6 4",
			"6 5",
			"6 6",
			"6 7",
		];
		// Get the actual this.name of the piece
		const pieceName = board[row][col];
		// This will only generate the moves which the board will reference.
		let possibleMoves = [];
		row = Number(row);
		col = Number(col);

		let isFirstMove = false;
		for (let i = 0; i < intialPos.length; i++) {
			const thisCoord = intialPos[i];
			const initialY = Number(thisCoord[0]);
			const initialX = Number(thisCoord[2]);

			// Black side
			if (
				row === initialY &&
				col === initialX &&
				i < 8 &&
				this.getPlayer(pieceName) === "black"
			)
				isFirstMove = true;
			else if (
				row === initialY &&
				col === initialX &&
				i >= 8 &&
				this.getPlayer(pieceName) === "white"
			) {
				isFirstMove = true;
			}
		}

		// Get player to determine how piece moves.
		let player = this.getPlayer(pieceName);
		let enemy = null;
		player === "white" ? (enemy = "black") : (enemy = "white");
		let direction;
		player === "white" ? (direction = -1) : (direction = 1);
		// If pawn exceeds at the end of the row no more moves are possible (Take note pawn actually promotes to queen at this point)
		// Take note that implementing this in other pieces might be bad because some moves can move backwards and stuff SO YOU HAVE TO IMPLEMENT THIS DURING THE CALCULATION OF THE MOVES
		if (row + 1 * direction >= board.length || row + 1 * direction < 0) return;

		if (!isFirstMove) {
			// If statement guard to check if row + 1 is out of bounds
			// if (row + 1 * direction >= board.length)
			// Check if there is piece infront of it
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
				this.getEnemy(board[row + 1 * direction][col + 1])
			)
				possibleMoves.push(`${row + 1 * direction} ${col + 1}`);
		} else {
			if (board[row + 1 * direction][col] === "")
				possibleMoves.push(`${row + 1 * direction} ${col}`);
			if (board[row + 2 * direction][col] === "")
				possibleMoves.push(`${row + 2 * direction} ${col}`);
			// Eat moves
			if (
				board[row + 1 * direction][col - 1] !== undefined &&
				this.getEnemy(board[row + 1 * direction][col - 1]) === enemy
			)
				possibleMoves.push(`${row + 1 * direction} ${col - 1}`);
			if (
				board[row + 1 * direction][col + 1] !== undefined &&
				this.getEnemy(board[row + 1 * direction][col + 1])
			)
				possibleMoves.push(`${row + 1 * direction} ${col + 1}`);
		}

		return possibleMoves;
	}
}

class Rook extends ChessPieces {
	constructor(name) {
		super(name);
	}
	genMoves(row, col) {
		const pieceName = board[row][col];
		let possibleMoves = [];
		row = Number(row);
		col = Number(col);

		let player = this.getPlayer(pieceName);
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
		// Reset val since this won't be used anymore? (I also don't get why I did this)
		newRow = null;

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
		newCol = null;
		return possibleMoves;
	}
}

class Bishop extends ChessPieces {
	constructor(name) {
		super(name);
	}
	genMoves(row, col) {
		const pieceName = board[row][col];
		let possibleMoves = [];
		row = Number(row);
		col = Number(col);

		let player = this.getPlayer(pieceName);
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
		const pieceName = board[row][col];
		let possibleMoves = [];
		row = Number(row);
		col = Number(col);

		let player = this.getPlayer(pieceName);
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
		const pieceName = board[row][col];
		let possibleMoves = [];
		row = Number(row);
		col = Number(col);

		let player = this.getPlayer(pieceName);
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
		// Reset val since this won't be used anymore? (I also don't get why I did this)
		newRow = null;

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
		newCol = null;

		return possibleMoves;
	}
}

class King extends ChessPieces {
	constructor(name) {
		super(name);
	}
	genMoves(row, col) {
		const pieceName = board[row][col];
		let possibleMoves = [];
		row = Number(row);
		col = Number(col);

		let player = this.getPlayer(pieceName);
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
