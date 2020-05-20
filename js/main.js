"use strict";
/**This is a rough first version. I will make more changes tomorrow. */
const MINE = "💣";
const FLAG = "🏴";

var gBoard = [];

var markedCountElement = document.querySelector(".mark");
var timer = document.querySelector(".timer");
var timerInterval;
var gameStartTime;

var gLevel = {
  SIZE: 4,
  MINES: 2,
};
var gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: gLevel.MINES,
  secsPassed: 0,
};

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
  gGame.isOn = true;
  buildBoard();
  randomaizeBombLocation();
  setMinesNegsCount(gBoard);
  renderBoard(gBoard);
  markedCountElement.innerText = gGame.markedCount;
}
init();

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

function getCellClass(i, j) {
  return document.querySelector(`.cell-${i}-${j}`);
}

function cellCliked(elCell, i, j) {
  var pressedCell = gBoard[i][j];
  if (gGame.isOn && !pressedCell.isShown) {
    gameStartTime = new Date();
    timerInterval = setInterval(startTimer, 1000);

    //update my modal
    pressedCell.isShown = true;
    gGame.shownCount++;
    if (pressedCell.isMine) {
      elCell.innerText = MINE;
      gGame.isOn = false;
      return;
    }
    if (pressedCell.minesAroundCount < 1) {
      elCell.classList.add("empty-cell");
      expandShown(gBoard, elCell, i, j);
    } else {
      elCell.innerText = pressedCell.minesAroundCount;
    }
  }
  checkGameOver();
}

function randomaizeBombLocation() {
  var colLength = gBoard[0].length;
  var rowLength = gBoard.length;
  var randomIndexI = Math.floor(Math.random() * rowLength);
  var randomIndexJ = Math.floor(Math.random() * colLength);
  for (let i = 0; i < gLevel.MINES; i++) {
    gBoard[randomIndexI][randomIndexJ].isMine = true;
    randomIndexI = Math.floor(Math.random() * rowLength);
    randomIndexJ = Math.floor(Math.random() * colLength);
  }
}
function cellMarked(elCell) {
  if (elCell.innerText === FLAG) {
    console.dir(elCell);
    elCell.innerHTML = " ";
    gGame.markedCount++;
    markedCountElement.innerText = gGame.markedCount;

    return;
  }
  elCell.innerText = FLAG;
  gGame.markedCount--;
  markedCountElement.innerText = gGame.markedCount;

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
    alert("you won");
  }
  console.log(gGame.shownCount);
}

function expandShown(board, elCell, cellI, cellJ) {
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= board.length) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (j < 0 || j >= board[i].length) continue;
      if (i === cellI && j === cellJ) continue;
      var neighborsElement = getCellClass(i, j);
      var neighborsCell = board[i][j];
      if (!neighborsCell.isMine) {
        if (!neighborsCell.isShown) {
          neighborsCell.isShown = true;
          gGame.shownCount++;
        }
        if (!neighborsCell.minesAroundCount) {
          neighborsElement.classList.add("empty-cell");
        } else {
          neighborsElement.innerText = neighborsCell.minesAroundCount;
        }
      }
      neighborsElement = getCellClass(i, j);
    }
  }
}

// not done yet.
function markRandom() {
  var colLength = gBoard[0].length;
  var rowLength = gBoard.length;
  var randomIndexI = Math.floor(Math.random() * rowLength);
  var randomIndexJ = Math.floor(Math.random() * colLength);
  var randomItem = getCellClass(randomIndexI, randomIndexJ);
  var cell = gBoard[randomIndexI][randomIndexJ];
  if (!cell.isMine && !cell.isShown) {
    console.log(randomItem);
    randomItem.classList.toggle("hint");
    setTimeout(() => {
      randomItem.classList.toggle("hint");
    }, 2000);
  }
}
