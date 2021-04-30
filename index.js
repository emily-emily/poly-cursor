initCanvas();

// set up cursor selection buttons
document.querySelectorAll("#cursor-selection-box button").forEach((btn, i) => {

  btn.onclick = () => {
    cursor.changeCursor(cursorSet[i])
  }
});

document.querySelectorAll(".cursor-hover-fill").forEach(item => {
  item.addEventListener("mouseenter", ev => {
    cursor.activeStyle = "hover";
  })
  item.addEventListener("mouseleave", ev => {
    cursor.activeStyle = "default";
  })
});

document.querySelectorAll(".cursor-hover-snapRect").forEach(item => {
  item.addEventListener("mouseenter", ev => {
    cursor.snapRect(ev)
  })
  item.addEventListener("mouseleave", ev => {
    cursor.unsnapRect(ev)
  })
});
