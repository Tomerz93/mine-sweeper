function startTimer() {
  var interval = new Date();
  gGame.secsPassed = Math.floor((interval - gameStartTime) / 1000);
  timer.innerText = "Time Passed: " + gGame.secsPassed;
}

function genereateLives(livesArray) {
  livesArray.forEach((live) => {
    document.querySelector(".lives").innerText += live;
  });
}
function getCellClass(i, j) {
  return document.querySelector(`.cell-${i}-${j}`);
}
function getRandom(length) {
  return Math.floor(Math.random() * length);
}
//helper function for the recursion. checking if i,j are in range
function inRange(board, i, j) {
  if (i > board.length - 1 || i < 0 || j > board.length - 1 || j < 0) {
    return false;
  }
  return true;
}
