let cursor;

function initCanvas() {
  let canvas = document.querySelector("#myCanvas");
  paper.setup(canvas);

  let clientX = -1000;
  let clientY = -1000;

  document.addEventListener("mousemove", e => {
    clientX = e.clientX;
    clientY = e.clientY;
  });

  cursor = new Cursor();

  // paper loop
  paper.view.onFrame = ev => {
    cursor.updatePos(clientX, clientY);
  };
}