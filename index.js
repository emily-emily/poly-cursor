initCanvas();

// set up cursor selection buttons
document.querySelectorAll("#cursor-selection-box button").forEach((btn, i) => {
  btn.onclick = () => {
    cursor.changeCursor(cursorSet[i])
  }
});

document.querySelectorAll(".cursor-hover").forEach(item => {
  item.addEventListener("mouseenter", ev => {
    cursor.setSnapTarget(ev.currentTarget.getBoundingClientRect());
    cursor.setStyle("hover");
  })
  item.addEventListener("mouseleave", ev => {
    cursor.setStyle("default");
  })
});

document.querySelectorAll(".cursor-snapRect").forEach(item => {
  item.addEventListener("mouseenter", ev => {
    cursor.setSnapTarget(ev.currentTarget.getBoundingClientRect());
    cursor.setStyle("snapRect", ev);
  })
  item.addEventListener("mouseleave", ev => {
    cursor.setStyle("default");
  })
});

document.querySelectorAll(".cursor-spin").forEach(item => {
  item.addEventListener("mouseenter", ev => {
    cursor.setSnapTarget(ev.currentTarget.getBoundingClientRect());
    cursor.setStyle("spin");
  })
  item.addEventListener("mouseleave", ev => {
    cursor.setStyle("default");
  })
});

document.querySelectorAll(".cursor-snapFree").forEach(item => {
  item.addEventListener("mouseenter", ev => {
    cursor.setSnapTarget(ev.currentTarget.getBoundingClientRect());
    cursor.setStyle("snapFree", ev);
  })
  item.addEventListener("mouseleave", ev => {
    cursor.setStyle("default");
  })
});
