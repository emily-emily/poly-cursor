let cursor = new Cursor(cursorSet[0]);

// set up cursor selection buttons
document.querySelectorAll("#cursor-selection-box button").forEach((btn, i) => {
  btn.onclick = () => {
    cursor.changeCursor(cursorSet[i])
  }
});

setHoverListeners();
