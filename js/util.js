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

function saveToLocalStorage(level) {
  if (level === 2) {
    localStorage.setItem("bestScoreEasy", gGame.secsPassed);
    return;
  }
  if (level === 12) {
    localStorage.setItem("bestScoreMedium", gGame.secsPassed);
    return;
  }
  if (level === 30) {
    localStorage.setItem("bestScoreHard", gGame.secsPassed);
  }
}
function getItemFromLocalStorage(level) {
  if (level === 2) {
    return localStorage.getItem("bestScoreEasy");
  }
  if (level === 12) {
    return localStorage.getItem("bestScoreMedium");
  }
  if (level === 30) {
    return localStorage.getItem("bestScoreHard");
  }
}

function setButtonClass(elBtn) {
  var buttons = document.querySelector(".btn-container");
  for (let i = 0; i < buttons.children.length; i++) {
    if (elBtn.classList.contains("selected")) continue;
    buttons.children[i].classList.remove("selected");
  }
}

function closeModal() {
  modal.style.transform = "translateY(500px)";
}
