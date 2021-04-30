class Cursor {
  pos = { x: -100, y: -100 };
  clientPos = { x: -100, y: -100 };
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

  // stores client position
  updateClientPos = (ev) => {
    this.clientPos.x = ev.clientX;
    this.clientPos.y = ev.clientY;
  }

  updatePos = () => {
    this.updateDot();
    
    this.updateStyle();

    this.applyStyle();
  }

  // lint all style values
  updateStyle = () => {
    // lint size
    this.size = this.lint(this.size, this.data.styles[this.activeStyle].size, this.snapSpeed);
    this.cursorScaledPoints = this.data.points.map(p => new paper.Point(p.x * this.size, p.y * this.size));

    // lint smooth?
    // lint closed?
    
    // lint color and fill
    this.lintColor(this.color, this.data.styles[this.activeStyle].color, this.snapSpeed);
    this.lintColor(this.fillColor, this.data.styles[this.activeStyle].fill, this.snapSpeed);

    // lint points and group
    if (this.activeStyle == "snap") {
      this.lintPoints(this.stuckPoints);
      this.lintPoint(this.pos, this.stuckGroup, this.snapSpeed);
    }
    else {
      this.lintPoints(this.cursorScaledPoints);
      this.lintPoint(this.pos, this.clientPos, this.speed);
    }
  }

  // apply cursor style to polygon
  applyStyle = () => {
    if (this.smooth)
      this.polygon.smooth();
    else
      this.polygon.flatten(0);

    this.polygon.closed = this.closed;

    this.polygon.strokeColor = this.toPaperColor(this.color);
    this.polygon.fillColor = this.toPaperColor(this.fillColor);
    
    this.group.position.set(this.pos.x, this.pos.y);
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
  lintPoints = (targetPoints) => {
    this.polygon.segments.forEach((seg, i) => {
      let pt = seg.point;
      this.lintPoint(pt, targetPoints[i], this.data.snapSpeed);
      seg.point.set(pt);
    });
  }

  // lints a point (a -> b with speed)
  lintPoint = (a, b, speed) => {
    a.x = this.lint(a.x, b.x, speed);
    a.y = this.lint(a.y, b.y, speed);
  }

  // lints a color (a -> b with speed)
  lintColor = (a, b, speed) => {
    a.r = this.lint(a.r, b.r, speed);
    a.g = this.lint(a.g, b.g, speed);
    a.b = this.lint(a.b, b.b, speed);
    a.a = this.lint(a.a, b.a, speed);
  }

  // updates the position of the dot if it is active
  updateDot = () => {
    if (this.dotActive)
      this.dotGroup.position.set(this.clientPos.x, this.clientPos.y);
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
    this.updateNPoints(this.cursorScaledPoints.length);
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

    this.size = this.data.styles[this.activeStyle].size;
    this.dotActive = this.data.styles[this.activeStyle].dotActive;
    this.smooth = this.data.styles[this.activeStyle].smooth;
    this.closed = this.data.styles[this.activeStyle].closed;
    this.color = {};
    Object.assign(this.color, this.data.styles[this.activeStyle].color);
    this.fillColor = {};
    Object.assign(this.fillColor, this.data.styles[this.activeStyle].fill);
    this.cursorScaledPoints = this.data.points.map(p => new paper.Point(p.x * this.size, p.y * this.size));

    if (this.polygon)
      this.polygon.remove();

    // create cursor
    this.polygon = new paper.Path({
      segments: this.cursorScaledPoints,
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

  // converts between a color object and a paper.Color object
  toPaperColor = (color) => new paper.Color(color.r, color.g, color.b, color.a);
}