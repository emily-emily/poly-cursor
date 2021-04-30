let cursor;

function initCanvas() {
  let canvas = document.querySelector("#myCanvas");
  paper.setup(canvas);

  cursor = new Cursor();

  document.addEventListener("mousemove", ev => {
    cursor.updateClientPos(ev);
  });

  // paper loop
  paper.view.onFrame = ev => {
    cursor.updatePos();
  };
}