import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";


/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows=5, ncols=5, chanceLightStartsOn=0.25 }) {
  const [board, setBoard] = useState(createBoard());
    const [tries, setTries] = useState(0);




  
  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let initialBoard = [];
    for (let y = 0; y < nrows; y++) {
      let row = [];
      for (let x = 0; x < ncols; x++) {
        row.push(false); // Start with all lights off
      }
      initialBoard.push(row);
    }
  
    // Randomly flip lights on
    for (let y = 0; y < nrows; y++) {
      for (let x = 0; x < ncols; x++) {
        if (Math.random() < chanceLightStartsOn) {
          // Flip the current cell
          initialBoard[y][x] = !initialBoard[y][x];
  
          // Update adjacent cells to keep an even number of lit cells in each row and column
          if (x > 0) {
            initialBoard[y][x - 1] = !initialBoard[y][x - 1];
          }
          if (x < ncols - 1) {
            initialBoard[y][x + 1] = !initialBoard[y][x + 1];
          }
          if (y > 0) {
            initialBoard[y - 1][x] = !initialBoard[y - 1][x];
          }
          if (y < nrows - 1) {
            initialBoard[y + 1][x] = !initialBoard[y + 1][x];
          }
        }
      }
    }
  
    return initialBoard;
  }
  



  function hasWon() {
    // Loop through each cell in the board and check if any cell is still lit
    for (let y = 0; y < nrows; y++) {
      for (let x = 0; x < ncols; x++) {
        if (board[y][x]) {
          return false; // If a lit cell is found, the player has not won yet
        }
      }
    }
    return true; // If no lit cells are found, the player has won
  }

  function flipCellsAround(coord) {
    setTries(tries+1);
    setBoard(oldBoard => {
      const [y, x] = coord.split("-").map(Number);


      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it

        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };
      
      // TODO: Make a (deep) copy of the oldBoard
      const boardCopy = oldBoard.map(row => [...row]);
      // TODO: in the copy, flip this cell and the cells around it
      flipCell(y, x, boardCopy);         //Flipping the cell itself
      flipCell(y, x - 1, boardCopy);     // Flipping the cell below
      flipCell(y, x + 1, boardCopy);     // Flipping the cell above
      flipCell(y - 1, x, boardCopy);     // Flipping the cell to the left
      flipCell(y + 1, x, boardCopy);     // Flipping the cell to the right


      // TODO: return the copy
      return boardCopy;
    });
  }

  const reset = ()=>{
    setBoard(createBoard());
    setTries(0);
    
 }

    // if the game is won, just show a winning msg & render nothing else


  // TODO
  if (hasWon()) {
    
    return <div className='Won'><p>You Win! </p> 
            <p>Total Attempts: {tries}</p>
            <button className="reset-btn" onClick={()=> reset()}>NEW GAME</button>
            </div> ;
  }

  // make table board

  // TODO
  let tableBoard = [];

  for(let y=0; y< nrows; y++){
    let row= [];
    for(let x=0 ; x < ncols; x++){
        let coord = `${y}-${x}`;
        row.push(<Cell key={coord} isLit={board[y][x]} flipCellsAroundMe={()=> flipCellsAround(coord)} />);
    }
    tableBoard.push(<tr key={y}>{row}</tr>)
  }


  
  


  return(
    <div className="game">
    <table className="Board">
    <tbody>{tableBoard}</tbody><br/>

    
  </table>
  <p>Attempt# {tries}</p>
  <button className="reset-btn" onClick={()=> reset()}>NEW GAME</button>

  </div>
  )
}

export default Board;
