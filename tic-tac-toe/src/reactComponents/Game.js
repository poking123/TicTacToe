import React, { Component } from 'react';
import Board from './Board';

class Game extends Component {
    constructor() {
        super();
        this.state = {
            player: 1,
            board: [
                [0, 0, 0],
                [0, 0, 0],
                [0, 0, 0],
            ],
            playerOneType: 'human',
            playerTwoType: 'computer',
            playerMessage: '',
        }
    }

    // Class Variables
    gameConstants = Object.freeze({
        width: 310,
        height: 310,
        emptySpace: 0,
        playerOne: 1,
        emptyBoard: [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ],
    });
    
    checkIfMakeMove = () => {
        let gameIsFinished = this.gameIsFinished(this.state.board);
        let playerMessage;

        if (gameIsFinished === 0) { // Draw
            playerMessage = <p>Draw! Nobody Wins!</p>;
        } else if (gameIsFinished) { // Winner
            playerMessage = <p>Player {3 - this.state.player} Has Won!!!</p>;
        } else { // Not Done Yet
            playerMessage = <p>Player {this.state.player} to Move...</p>;
            if (this.computerToMove()) {
                // setTimeout(() => {this.makeComputerMove()}, 2000);
                this.makeComputerMove();
            }
        }
        this.setState({ playerMessage });
    }

    makeActualMove = (moveNumber) => {
        let { board, player } = this.state;
        let possibleMoves = this.returnPossibleMoves(board);

        if (possibleMoves.includes(moveNumber)) {
            let row = Math.floor(moveNumber / 3);
            let col = moveNumber % 3;
            let value;
            if (player === 1) {
                value = 1;
            } else {
                value = 2;
            }
            board[row][col] = value;
            this.setState({
                player: 3 - player,
                board,
            }, () => this.checkIfMakeMove());
        } else {
            alert('Please Choose a Valid Move')
        }
    }

    makeMove = (moveNumber, board, player) => {
        let row = Math.floor(moveNumber / 3);
        let col = moveNumber % 3;
        let copyOfBoard = board.map(row => [...row]);

        if (copyOfBoard[row][col] !== this.gameConstants.emptySpace) {
            alert('In makeMove (Game.js) - Something is wrong, a move is overwriting another move');
        } else {
            copyOfBoard[row][col] = player;
        }
        return copyOfBoard;
    }

    returnPossibleMoves = (board) => {
        let possibleMoves = [];
        for (let i = 0; i < 9; i++) {
            let row = Math.floor(i / 3);
            let col = i % 3;
            if (board[row][col] === this.gameConstants.emptySpace)
                possibleMoves.push(i);
        }
        return possibleMoves;
    }

    humanToMove = () => {
        let currPlayerType;
        if (this.state.player === 1) {
            currPlayerType = this.state.playerOneType;
        } else {
            currPlayerType = this.state.playerTwoType;
        }
        return currPlayerType === 'human';
    }

    computerToMove = () => {
        let currPlayerType;
        if (this.state.player === 1) {
            currPlayerType = this.state.playerOneType;
        } else {
            currPlayerType = this.state.playerTwoType;
        }
        return currPlayerType === 'computer';
    }

    makeHumanMove = e => {
        if (this.computerToMove() || this.gameIsFinished(this.state.board)) return;
        e.persist();

        let offsetX = e.nativeEvent.offsetX;
        let offsetY = e.nativeEvent.offsetY;
        let boardWidth = e.target.offsetWidth;
        let boardHeight = e.target.offsetHeight;

        let col = Math.floor(offsetX / (boardWidth / 3));
        let row = Math.floor(offsetY / (boardHeight / 3));

        let moveNumber = 0;
        moveNumber += col;
        moveNumber += row * 3;

        this.makeActualMove(moveNumber);
    }

    makeComputerMove = () => {
        let { board } = this.state;
        // minimax returns [moveNumber, optimalMoveValue]
        let moveNumber = this.minimax(board, this.state.player, 10)[0];
        let thinkingTime = Math.random() * 2 + 1;
        setTimeout(() => { this.makeActualMove(moveNumber); }, thinkingTime * 1000);
        // this.makeActualMove(moveNumber);
    }

    minimax = (board, player, depth) => {
        // Player 1 = maximize
        // Player 2 = minimize
        if (depth === 0) return [-1, this.evaluateBoard(board)]; // dummy value since we don't know the previous move
        let possibleMoves = this.returnPossibleMoves(board);
        let gameIsFinished = this.gameIsFinished(board);
        if (possibleMoves.length === 0 || gameIsFinished) return [-1, this.evaluateBoard(board)]; // dummy value since we don't know the previous move
        if (depth === 2) {
            console.log('possibleMoves is ', possibleMoves);
        }
        let optimalMoves = [];
        let optimalMoveValue;
        // console.log('before for loop - optimalMoves is ', optimalMoves);
        // console.log('before for loop - optimalMoveValue is ', optimalMoveValue);
        for (let i = 0; i < possibleMoves.length; i++) {
            let currMove = possibleMoves[i];
            if (depth === 2) {
                console.log('player is ', player);
                console.log('currMove is ', currMove);
                console.log('board BEFORE');
                console.log('board[0] is ', board[0]);
                console.log('board[1] is ', board[1]);
                console.log('board[2] is ', board[2]);
                console.log('board AFTER');
            }
            
            let newBoard = this.makeMove(currMove, board, player);
            if (depth === 2) {
                console.log('newBoard[0] is ', newBoard[0]);
                console.log('newBoard[1] is ', newBoard[1]);
                console.log('newBoard[2] is ', newBoard[2]);
            }
            let minimaxResults = this.minimax(newBoard, 3 - player, depth - 1);
            if (depth === 2) {
                console.log('minimax results are ', minimaxResults);
            }
            let currBoardEvaluation = minimaxResults[1];
            if (depth === 2) {
                console.log('currBoardEvaluation is ', currBoardEvaluation);
            }
            if (optimalMoves.length === 0) {
                optimalMoves.push(currMove);
                optimalMoveValue = currBoardEvaluation;
            } else {
                if (currBoardEvaluation === optimalMoveValue) {
                    optimalMoves.push(currMove);
                } else {
                    if (player === 1) {
                        if (currBoardEvaluation > optimalMoveValue) {
                            optimalMoveValue = currBoardEvaluation;
                            optimalMoves = [currMove];
                        }
                    } else {
                        if (currBoardEvaluation < optimalMoveValue) {
                            optimalMoveValue = currBoardEvaluation;
                            optimalMoves = [currMove];
                        }
                    }
                }
            }

        }
        if (depth === 2) {
            console.log('at the end, optimalMoves is ', optimalMoves);
            console.log('at the end, optimalMoveValue is ', optimalMoveValue);
        }
        if (optimalMoves.length === 1) {
            return [optimalMoves[0], optimalMoveValue];
        } else {
            let choice = Math.floor(Math.random() * optimalMoves.length);
            return [optimalMoves[choice], optimalMoveValue];
        }
    }

    evaluateBoard = (board) => {
        let gameIsFinished = this.gameIsFinished(board);
        if (gameIsFinished === 0 || gameIsFinished === false) {
            return 0;
        } else {
            let winner = gameIsFinished;
            if (winner === 1) {
                return 100;
            } else {
                return -100;
            }
        }
    }

    resetBoard = () => {
        let emptyBoardCopy = this.gameConstants.emptyBoard.map(row => [...row]);
        this.setState({
            player: this.gameConstants.playerOne,
            board: emptyBoardCopy,
        }, () => this.checkIfMakeMove());
    }

    gameIsFinished = (board) => {
        // Rows
        for (let row = 0; row < 3; row++) {
            let entireRow = board[row];
            let player = entireRow[0];
            if (player === this.gameConstants.emptySpace) continue;
            if (player === entireRow[1] && player === entireRow[2]) 
                return player;
        }

        // Cols
        for (let col = 0; col < 3; col++) {
            let player = board[0][col];
            if (player === this.gameConstants.emptySpace) continue;
            if (player === board[1][col] && player === board[2][col]) 
                return player;
        }

        // Diagonals
        let player = board[0][0];
        if (player !== this.gameConstants.emptySpace) {
            if (player === board[1][1] && player === board[2][2])
                return player;
        }

        player = board[0][2];
        if (player !== this.gameConstants.emptySpace) {
            if (player === board[1][1] && player === board[2][0])
                return player;
        }

        // Board is Filled
        let boardFilled = true;
        for (let i = 0; i < 9; i++) {
            let row = Math.floor(i / 3);
            let col = i % 3;
            if (board[row][col] === this.gameConstants.emptySpace) {
                boardFilled = false;
                break;
            }
        }
        if (boardFilled) return 0;

        return false;
    }

    componentDidMount() {
        this.setState({ playerMessage: <p>Player {this.state.player} to Move...</p> });
        this.checkIfMakeMove();
    }
    
    render() {
        let boardData = {
            player: this.state.player,
            board: this.state.board,
        };

        let dimensionData = {
            width: this.gameConstants.width,
            height: this.gameConstants.height,
        };

        let { playerMessage } = this.state;

        return (
            <div>
                <h1>Tic Tac Toe</h1>

                <Board makeHumanMove={this.makeHumanMove} boardData={boardData} dimensionData={dimensionData}/>
                {playerMessage}
                <button onClick={() => this.resetBoard()}>Reset Game</button>
            </div>
        )
    }
}

export default Game;
