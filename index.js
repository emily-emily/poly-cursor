const shadeScreenSize = 650;

let cursor = new Cursor(cursorSet[0]);

// set up cursor selection buttons
document.querySelectorAll("#cursor-selection-box button").forEach((btn, i) => {
  btn.onclick = () => {
    cursor.changeCursor(cursorSet[i])
  }
});

setHoverListeners();

// for tip
let shade = document.getElementById("shade");

document.getElementById("tip-icon").addEventListener("mouseenter", ev => {
  if (window.innerHeight < shadeScreenSize) {
    shade.classList.remove("active");
    shade.classList.add("active");
  }
});

document.getElementById("tip-icon").addEventListener("mouseleave", ev => {
  shade.classList.remove("active");
});
