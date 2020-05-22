"use strict";
/**This is a rough first version. I will make more changes tomorrow. */
const MINE = "💣";
const FLAG = "🏴";

var LIVESARRAY = ["❤️", "❤️", "❤️"];
var bestTime = [];
var gBoard = [];

var gLevel = {
  SIZE: 4,
  MINES: 2,
};
var gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: gLevel.MINES,
  secsPassed: 0,
  helperCount: 3,
  movesTook: 0,
};

var markedCountElement = document.querySelector(".mark");
var timer = document.querySelector(".timer");
var remainingHelperCounter = document.querySelector(".btn span");
var emoji = document.querySelector(".icon-container");
var modal = document.querySelector(".modal");

var timerInterval;
var gameStartTime;

var firstClick = false;

function setDifficulty(size, mines, elBtn) {
  if (elBtn) {
    setButtonClass(elBtn);
    elBtn.classList.add("selected");
  }
  gLevel.SIZE = size;
  gLevel.MINES = mines;
  init();
}
init();

function resetGame() {
  closeModal();
  setDifficulty(gLevel.SIZE, gLevel.MINES, false);
}

function buildBoard() {
  for (let i = 0; i < gLevel.SIZE; i++) {
    var row = [];
    gBoard.push(row);
    for (let j = 0; j < gLevel.SIZE; j++) {
      gBoard[i][j] = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
      };
    }
  }
}

function init() {
  var bestScore = getItemFromLocalStorage(gLevel.MINES);
  if (bestScore) {
    document.querySelector(
      ".best-time"
    ).innerText = `Best time is:${bestScore}`;
  } else {
    document.querySelector(
      ".best-time"
    ).innerText = `No best time for this level yet`;
  }
  modal.querySelector(".moves-took").innerText = "it took you ";
  modal.querySelector(".time-took").innerText = "You beat the game in:";
  resetVar();
  buildBoard();
  renderBoard(gBoard);
  genereateLives(LIVESARRAY);
  clearInterval(timerInterval);
  timerInterval = null;
}

function resetVar() {
  firstClick = false;
  gBoard = [];
  gGame.helperCount = 3;
  gGame.markedCount = gLevel.MINES;
  gGame.shownCount = 0;
  gGame.movesTook = 0;
  LIVESARRAY = ["❤️", "❤️", "❤️"];
  emoji.innerText = "😊";
  document.querySelector(".lives").innerText = "";
  gGame.isOn = true;
  remainingHelperCounter.innerText = gGame.helperCount;
  markedCountElement.innerText = gGame.markedCount;
  timer.innerText = "Time Passed: 0";
}

function renderBoard(board) {
  var strHtml = "";
  for (let i = 0; i < board.length; i++) {
    strHtml += "<tr>";
    for (let j = 0; j < board.length; j++) {
      var className = `cell cell-${i}-${j}`;
      var currentCell = board[i][j];
      // var isBomb = currentCell.isMine ? MINE : "";
      strHtml += `<td oncontextmenu="cellMarked(this)" onclick="cellCliked(this,${i},${j})" class="${className}"></td>`;
    }
    strHtml += "</tr>";
  }
  document.querySelector(".game-container").innerHTML = strHtml;
}

function countNeighbors(cellI, cellJ, board) {
  var neighborsSum = 0;
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= board.length) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (j < 0 || j >= board[i].length) continue;
      if (i === cellI && j === cellJ) continue;
      if (board[i][j].isMine) neighborsSum++;
    }
  }
  return neighborsSum;
}

function setMinesNegsCount(board) {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board.length; j++) {
      var cell = board[i][j];
      var neighborsAmount = countNeighbors(i, j, board);
      cell.minesAroundCount = neighborsAmount;
    }
  }
}

function cellCliked(elCell, i, j) {
  var pressedCell = gBoard[i][j];

  //starting the interval
  if (gGame.isOn && !pressedCell.isShown) {
    gGame.movesTook++;
    if (!timerInterval) {
      gameStartTime = new Date();
      timerInterval = setInterval(startTimer, 1000);
    }
    //setting the first click to false and generating random locations for the bombs
    if (!firstClick) {
      firstClick = true;
      randomaizeBombLocation(i, j);
      setMinesNegsCount(gBoard);
    }
    //modifying the livesarray and updating the dom
    if (pressedCell.isMine) {
      LIVESARRAY.pop();
      document.querySelector(".lives").innerText = "";
      elCell.classList.toggle("bomb");
      setTimeout(() => {
        elCell.classList.toggle("bomb");
      }, 1000);
      genereateLives(LIVESARRAY);

      if (LIVESARRAY.length < 1) {
        //ending the game
        elCell.innerText = MINE;
        gGame.isOn = false;
        showAllMines();
        clearInterval(timerInterval);
        emoji.innerText = "🤯";
        return;
      }
      return;
    }

    if (elCell.innerText === FLAG) return;

    //calling the recursive function if cell is empty(0 neibghors)
    if (pressedCell.minesAroundCount < 1) {
      elCell.classList.add("empty-cell");
      expandShown(gBoard, i, j);
    } else {
      pressedCell.isShown = true;
      gGame.shownCount++;
      elCell.innerText = pressedCell.minesAroundCount;
    }
  }

  checkGameOver();
}

function getValidRandom(i, j, emptyPositions) {
  // this helper function to make sure not to set a bomb in the first place the user has pressed
  var randomIndex = getRandom(emptyPositions.length - 1);
  var randomPositionObject = emptyPositions[randomIndex];
  while (i === randomPositionObject.i || j === randomPositionObject.j) {
    //generating a valid random
    randomIndex = getRandom(emptyPositions.length - 1);
    randomPositionObject = emptyPositions[randomIndex];
  }
  return randomPositionObject;
}

function randomaizeBombLocation(i, j) {
  /*getting all of the possible locations to position a bomb and mapping them into an array using the 
  map empty position funciton*/
  var emptyPositions = mapEmptyPositions();
  var randomPositionObject;
  for (let index = 0; index < gLevel.MINES; index++) {
    randomPositionObject = getValidRandom(i, j, emptyPositions);
    gBoard[randomPositionObject.i][randomPositionObject.j].isMine = true;
  }
}

function cellMarked(elCell) {
  if (elCell.innerText && elCell.innerText !== FLAG) return;
  gGame.movesTook++;
  if (elCell.innerText === FLAG) {
    elCell.innerHTML = " ";
    gGame.markedCount++;
    markedCountElement.innerText = gGame.markedCount;
    return;
  }
  if (gGame.markedCount >= 1) {
    elCell.innerText = FLAG;
    gGame.markedCount--;
    markedCountElement.innerText = gGame.markedCount;
  }
  checkGameOver();

  return false;
}

function checkGameOver() {
  var cellAmount = gLevel.SIZE ** 2;
  if (
    gGame.markedCount === 0 &&
    cellAmount - gLevel.MINES === gGame.shownCount
  ) {
    clearInterval(timerInterval);
    timerInterval = null;
    gGame.isOn = false;
    emoji.innerText = "🏆";
    gGame.movesTook++;
    var bestScore = getItemFromLocalStorage(gLevel.MINES);
    if (!bestScore) {
      saveToLocalStorage(gLevel.MINES);
      document.querySelector(".best-time").innerText =
        "Best time is: " + gGame.secsPassed;
    }
    if (gGame.secsPassed < bestScore) {
      saveToLocalStorage(gLevel.MINES);
      document.querySelector(
        ".best-time"
      ).innerText = `your best time is: ${bestScore}`;
    }
    modal.style.transform = "translateY(0px)";
    modal.querySelector(".moves-took").innerText +=
      " " + gGame.movesTook + " moves to finish the game";

    modal.querySelector(".time-took").innerText +=
      "  " + gGame.secsPassed + " seconds";
  }
}

function expandShown(board, i, j) {
  // using a helper function to check if current cell is in range
  if (!inRange(board, i, j)) {
    return;
  }
  var elCell = getCellClass(i, j);
  var cell = board[i][j];
  // if current cell is a mine or isalready shown return to go to next recursive call
  if (cell.isMine || cell.isShown) {
    return;
  }
  //checking ot see wether current cell is a number or not and updating the dom.
  if (cell.minesAroundCount > 0) {
    cell.isShown = true;
    gGame.shownCount++;
    elCell = getCellClass(i, j);
    elCell.innerText = cell.minesAroundCount;
    return;
  }
  if (cell.minesAroundCount === 0) {
    cell.isShown = true;
    gGame.shownCount++;
    elCell.classList.add("empty-cell");
    //here i call the function with recursion for each possible neighbor.
    expandShown(board, i, j + 1);
    expandShown(board, i, j - 1);
    expandShown(board, i + 1, j);
    expandShown(board, i - 1, j);
    expandShown(board, i + 1, j + 1);
    expandShown(board, i - 1, j - 1);
    expandShown(board, i - 1, j + 1);
    expandShown(board, i + 1, j - 1);
  }
  return;
}

function mapEmptyPositions() {
  //this function goes over the matrix and creating an array that holds all of the
  // cells that isShown is set to false
  var emptyPositionArray = [];
  for (let i = 0; i < gBoard.length; i++) {
    for (let j = 0; j < gBoard[0].length; j++) {
      var cell = gBoard[i][j];
      if (!cell.isMine && !cell.isShown) {
        emptyPositionArray.push({ i: i, j: j });
      }
    }
  }
  return emptyPositionArray;
}

function markRandom() {
  var emptyArrayMap = mapEmptyPositions();

  if (gGame.helperCount >= 1) {
    //updating the dom
    gGame.helperCount--;
    remainingHelperCounter.innerText = gGame.helperCount;

    console.log(emptyArrayMap);

    //getting random items
    var randomIndex = getRandom(emptyArrayMap.length);
    var randomPositionObjet = emptyArrayMap[randomIndex];
    var randomItem = getCellClass(randomPositionObjet.i, randomPositionObjet.j);
    var cell = gBoard[randomPositionObjet.i][randomPositionObjet.j];
    //toggling the hint class
    if (!cell.isMine && !cell.isShown) {
      console.log(randomItem);
      randomItem.classList.toggle("hint");
      setTimeout(() => {
        randomItem.classList.toggle("hint");
      }, 1000);
    }
  }
}

function showAllMines() {
  //get locations for all mines and display them
  for (let i = 0; i < gLevel.SIZE; i++) {
    for (let j = 0; j < gLevel.SIZE; j++) {
      if (gBoard[i][j].isMine) {
        var mine = getCellClass(i, j);
        mine.classList.add("bomb");
        mine.innerText = MINE;
      }
    }
  }
}
