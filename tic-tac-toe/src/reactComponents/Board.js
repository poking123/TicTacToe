import React, { Component } from 'react';
import { uuid } from 'uuidv4';
import '../css/board.css';
import x from '../images/x.png';
import o from '../images/o.png';

/*
let boardData = {
    player: this.state.player,
    board: this.state.board,
};
let dimensionData = {
            width: this.width,
            height: this.height,
        };
*/

export default class Board extends Component {

    render() {
        let currBoard = [];
        let { board } = this.props.boardData;
        let pieceWidth = this.props.dimensionData.width / 3;
        let pieceHeight = this.props.dimensionData.height / 3;

        for (let i = 0; i < 9; i++) {
            let row = Math.floor(i / 3);
            let col = i % 3;

            switch(board[row][col]) {
                case 0:
                    currBoard.push(<div className="emptyBoardPiece" width={pieceWidth} height={pieceHeight} key={uuid()}></div>);
                    break; 
                case 1:
                    currBoard.push(<img src={x} onClick={e => e.stopPropagation()} width={pieceWidth} height={pieceHeight} key={uuid()} alt="X Piece" />);
                    break;
                case 2:
                    currBoard.push(<img src={o} onClick={e => e.stopPropagation()} width={pieceWidth} height={pieceHeight} key={uuid()} alt="O Piece" />);
                    break;
                default:
                    break;
            }
        }

        return (
            <div id="board" onClick={e => this.props.makeHumanMove(e)}>
                { currBoard }
            </div>
        )
    }
}
