function startTimer() {
  var interval = new Date();
  console.log("hey");
  gGame.secsPassed = Math.floor((interval - gameStartTime) / 1000);
  timer.innerText = "Time Passed: " + gGame.secsPassed;
}
