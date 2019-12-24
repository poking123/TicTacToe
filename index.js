const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// rl.on('line', (move) => {
//     move = parseInt(move);
//     if (isLegalMove(move, board, possibleMoves)) {
//         makeMove(move, board, player);
//         possibleMoves = possibleMoves.filter(m => m !== move);
//         player = 1 - player;
//     } else {
//         console.log(`The move (${move}) is not legal. Please choose a legal move.`)
//     }
    
//     // console.log(`Received: ${input}`);
//     let gameFinished = gameIsFinished(board);

//     if (gameFinished) {
//         player = 1 - player;
//         console.log(`Player ${player} has won!!!`);
//         printOnlyBoard(board);

//         process.exit();
//     } else {
//         printBoard(board, player, possibleMoves);
//     }
// });

let board = [
    [2, 2, 2],
    [2, 2, 2],
    [2, 2, 2],
];

let possibleMoves = [1, 2, 3, 4, 5, 6, 7, 8, 9];

let player = 0;

playGame();

function playGame() {
    printBoard(board, player, possibleMoves);
    while (!gameIsFinished(board)) {
        humanPlayer();
        player = 1 - player;
        printBoard(board, player, possibleMoves);
    }
}

function humanPlayer() {
    rl.question('Possible Moves: ' + possibleMoves, (move) => {
        if (isLegalMove(move, board, possibleMoves)) {
            makeMove(move, board, player);
        }
        rl.close();
    });
}

function makeMove(move, board, player) {
    move--;
    let row = Math.floor(move / 3);
    let col = move % 3; 
    board[row][col] = player;
}

function isLegalMove(move, board, possibleMoves) {
    if (move < 1 || move > 9 || !possibleMoves.includes(move)) return false;
    move--;
    let row = Math.floor(move / 3);
    let col = move % 3;
    return board[row][col] === 2;
}

function gameIsFinished(board) {
    // Rows
    for (let row = 0; row < 3; row++) {
        let entireRow = board[row];
        let player = entireRow[0];
        if (player === 2) continue;
        if (player === entireRow[1] && player === entireRow[2]) 
            return true;
    }

    // Cols
    for (let col = 0; col < 3; col++) {
        let player = board[0][col];
        if (player === 2) continue;
        if (player === board[1][col] && player === board[2][col]) 
            return true;
    }

    // Diagonals
    let player = board[0][0];
    if (player !== 2) {
        if (player === board[1][1] && player === board[2][2])
            return true;
    }

    player = board[0][2];
    if (player !== 2) {
        if (player === board[1][1] && player === board[2][0])
            return true;
    }

    return false;
}

function printBoard(board, player, possibleMoves) {
    console.log('Player ' + player + ' to move:');
    console.log('Possible moves: ' + possibleMoves);
    board.forEach(row => console.log(row));
    console.log();
}

function printOnlyBoard(board) {
    board.forEach(row => console.log(row));
}
