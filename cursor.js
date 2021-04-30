class Cursor {
  pos = { x: -100, y: -100 };
  activeStyle = "default";
  stuck = false;
  stuckPoints = [];
  stuckGroup = {};

  hovering = false;

  constructor() {
    // init with default cursor
    this.changeCursor(cursorSet[0]);

    // cursor dot
    this.dot = new paper.Path.RegularPolygon(new paper.Point(0, 0), 4, 2);
    this.dot.fillColor = 'white';
    this.dot.smooth();
    this.dotGroup = new paper.Group({
      children: [this.dot],
      position: new paper.Point(0, 0),
      applyMatrix: false
    });
  }

  // linear interpolation function
  lint = (a, b, s) =>{
    return a + (b - a) * s;
  }

  updatePos = (clientX, clientY) => {
    this.updateDot(clientX, clientY);
    if (this.activeStyle == "snap") {
      this.lintPoints(this.stuckPoints);
      this.lintGroupTarget(this.stuckGroup.x, this.stuckGroup.y);
    }
    else {
      this.lintPoints(this.cursorPoints);
      this.lintGroupClient(clientX, clientY);
    }
    
    this.lintColor(this.color, this.data.styles[this.activeStyle].color, this.snapSpeed);
    this.lintColor(this.fillColor, this.data.styles[this.activeStyle].fill, this.snapSpeed);

    this.updateCursor();
  }

  // update polygon with new style values
  updateCursor = () => {
    this.polygon.strokeColor = this.toPaperColor(this.color);
    this.polygon.fillColor = this.toPaperColor(this.fillColor);
  }

  // moves cursor towards target (client)
  lintGroupClient = (clientX, clientY) => {
    this.pos.x = this.lint(this.pos.x, clientX, this.data.speed);
    this.pos.y = this.lint(this.pos.y, clientY, this.data.speed);
    this.group.position.set(this.pos.x, this.pos.y);
  }

  // moves cursor towards target (item)
  lintGroupTarget = (targetX, targetY) => {
    this.pos.x = this.lint(this.pos.x, targetX, this.data.snapSpeed);
    this.pos.y = this.lint(this.pos.y, targetY, this.data.snapSpeed);
    this.group.position.set(this.pos.x, this.pos.y);
    if (this.data.styles.default.smooth)
      this.polygon.smooth();
  }

  // updates polygon to have n points
  updateNPoints = (n) => {
    while (this.polygon.segments.length < n) {
      this.polygon.add(new paper.Point(this.polygon.lastSegment.point));
    }
    while (this.polygon.segments.length > n) {
      this.polygon.removeSegment(this.polygon.segments.length - 1);
    }
  }

  // moves points towards destination points
  lintPoints = (points) => {
    this.polygon.segments.forEach((seg, i) => {
      let nextX = this.lint(seg.point.x, points[i].x, this.data.snapSpeed);
      let nextY = this.lint(seg.point.y, points[i].y, this.data.snapSpeed);
      seg.point.set(nextX, nextY);
    });
    if (this.data.styles.default.smooth)
      this.polygon.smooth();
  }

  lintColor = (a, b, speed) => {
    a.r = this.lint(a.r, b.r, speed);
    a.g = this.lint(a.g, b.g, speed);
    a.b = this.lint(a.b, b.b, speed);
    a.a = this.lint(a.a, b.a, speed);
  }

  // updates the position of the dot if it is active
  updateDot = (clientX, clientY) => {
    if (this.dotActive)
      this.dotGroup.position.set(clientX, clientY);
    else
      this.dotGroup.position.set(-100, -100);
  }

  snapRect = (ev) => {
    let itemBox = ev.currentTarget.getBoundingClientRect();
    this.activeStyle = "snap";

    let wd2 = itemBox.width / 2;
    let hd2 = itemBox.height / 2;

    this.stuckGroup.x = itemBox.left + wd2;
    this.stuckGroup.y = itemBox.top + hd2;
    this.stuckPoints = [
      { x: -wd2, y: -hd2 },
      { x: wd2, y: -hd2 },
      { x: wd2, y: hd2 },
      { x: -wd2, y: hd2 }
    ];

    this.updateNPoints(4);
  }

  unsnapRect = (ev) => {
    this.activeStyle = "default";
    this.updateNPoints(this.cursorPoints.length);
  }

  // change cursor
  changeCursor = (newData) => {
    // save style
    this.data = newData;

    // fill in styles with default
    for (let [key, value] of Object.entries(this.data.styles)) {
      if (key == "default") continue;

      let styleCopy = {};
      Object.assign(styleCopy, this.data.styles.default);
      for (let [k, s] of Object.entries(value)) {
        styleCopy[k] = s;
      }

      this.data.styles[key] = styleCopy;
    }

    // copy style to current values
    this.speed = this.data.speed;
    this.snapSpeed = this.data.snapSpeed;

    this.size = this.data.styles.default.size;
    this.dotActive = this.data.styles.default.dotActive;
    this.smooth = this.data.styles.default.smooth;
    this.closed = this.data.styles.default.closed;
    this.color = {};
    Object.assign(this.color, this.data.styles.default.color);
    this.fillColor = {};
    Object.assign(this.fillColor, this.data.styles.default.fill);
    this.cursorPoints = this.data.points.map(p => new paper.Point(p.x * this.size, p.y * this.size));

    if (this.polygon)
      this.polygon.remove();

    // create cursor
    this.polygon = new paper.Path({
      segments: this.cursorPoints,
      strokeCap: 'round',
      strokeColor: this.toPaperColor(this.color),
      closed: this.closed,
      fillColor: this.fill
    });
    this.group = new paper.Group({
      children: [this.polygon],
      pivot: new paper.Point(0, 0),
      position: new paper.Point(0, 0),
      applyMatrix: false
    });
  }

  toPaperColor = (color) => new paper.Color(color.r, color.g, color.b, color.a);
}