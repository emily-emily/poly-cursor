/**
 * Cursor stores a cursor and all of its relevant information.
 * 
 * To create a new cursor:
 *    let cursor = new Cursor();
 * Note that the paper.js canvas must be set up in order to create a new Cursor object.
 * 
 * Required set-up steps:
 *  * cursor.updateClientPos(ev) with the onmousemove event to update the client position
 *  * cursor.updatePos() in the paper.js loop to update the cursor
 *  * cursor.setStyle("styleName") to update the cursor's style
 *  * cursor.setSnapTarget(snapBoundingBox) before snapping to an element (only required when using snap)
 * 
 * TODO:
 *  * update Cursor constructor to take a set
 *  * bring client position listener inside the class?
 * **/

class Cursor {
  pos = { x: -100, y: -100 };
  clientPos = { x: -100, y: -100 };
  activeStyle = "default";
  stuck = false;
  stuckPoints = []; // shape of cursor when stuck
  stuckGroup = { x: 0, y: 0 }; // location of cursor when stuck
  target = null; // target to snap to (bounding box)
  angle = 0;

  noiseObjects = [];
  evCount = 0; // for noise generating
  noiseArr = []; // noise for each point (not scaled; range is -1 to 1)
  noiseScale = 200; // noise speed
  maxNoise = 20; // multiplied by noise

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
    this.evCount++;
    this.updateStyle();
    this.applyStyle();
  }

  // lint all style values
  updateStyle = () => {
    this.dotActive = this.data.styles[this.activeStyle].dotActive;

    // lint size
    this.size = this.lint(this.size, this.data.styles[this.activeStyle].size, this.snapSpeed);
    this.cursorScaledPoints = this.data.points.map(p => new paper.Point(p.x * this.size, p.y * this.size));

    // update noise values
    this.noisy = this.data.styles[this.activeStyle].noisy;
    if (this.noisy) {
      this.noiseArr.forEach((item, i) => {
        item.x = this.noiseObjects[i].noise2D(this.evCount / this.noiseScale, 0);
        item.y = this.noiseObjects[i].noise2D(this.evCount / this.noiseScale, 1);
      });
    }

    // lint smooth?
    // lint closed?
    this.smooth = this.data.styles[this.activeStyle].smooth;
    this.closed = this.data.styles[this.activeStyle].closed;

    this.snap = this.data.styles[this.activeStyle].snap;
    if (this.snap == "rect" || this.snap == "free") {
      this.stuck = true;
    }
    else {
      this.stuck = false;
    }

    // lint rotation?
    this.rotationSpeed = this.data.styles[this.activeStyle].rotationSpeed;
    
    // lint color and fill
    this.lintColor(this.color, this.data.styles[this.activeStyle].color, this.snapSpeed);
    this.lintColor(this.fillColor, this.data.styles[this.activeStyle].fill, this.snapSpeed);

    // lint points and group
    if (this.stuck) {
      this.makeNoisyPoints(this.stuckPoints);
      this.lintPoint(this.pos, this.stuckGroup, this.snapSpeed);
    }
    else {
      this.makeNoisyPoints(this.cursorScaledPoints);
      this.lintPoint(this.pos, this.clientPos, this.speed);
    }

    this.lintPoints(this.noisyPoints);
  }

  // apply cursor style to polygon
  applyStyle = () => {
    // set dot to client position if active
    if (this.dotActive)
      this.dotGroup.position.set(this.clientPos.x, this.clientPos.y);
    else
      this.dotGroup.position.set(-100, -100);

    if (this.smooth)
      this.polygon.smooth();
    else
      this.polygon.flatten(100); // flatten error in pixels

    this.polygon.closed = this.closed;

    if (this.activeStyle == "spin"){
      this.group.rotate(this.rotationSpeed);
      this.angle = (this.angle + this.rotationSpeed) % 360;
    }
    else { // lint back to angle 0
      let rotation = this.lint(this.angle, 359.99, this.snapSpeed) - this.angle;
      this.group.rotate(rotation);
      this.angle = (this.angle + rotation) % 360;
    }

    this.polygon.strokeColor = this.toPaperColor(this.color);
    this.polygon.fillColor = this.toPaperColor(this.fillColor);
    
    this.group.position.set(this.pos.x, this.pos.y);
  }

  // updates polygon to have n points
  updateNPoints = (n) => {
    // reset noise objects due to change in number of points
    this.makeNoiseObjects(n);

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

  setSnapTarget = (item) => {
    this.target = item;
    this.stuckGroup.x = item.left + item.width / 2;
    this.stuckGroup.y = item.top + item.height / 2;
  }

  // updates the active style (called by client)
  setStyle = (style) => {
    // check for missing style
    this.fixMissingStyle(style);

    // handle snap
    if (this.data.styles[style].snap == "rect") {
      let wd2 = this.target.width / 2;
      let hd2 = this.target.height / 2;

      this.stuckPoints = [
        { x: -wd2, y: -hd2 },
        { x: wd2, y: -hd2 },
        { x: wd2, y: hd2 },
        { x: -wd2, y: hd2 }
      ];

      this.updateNPoints(4);
    }
    else if (this.data.styles[style].snap == "free") {
      let wd2 = this.target.width / 2;
      let hd2 = this.target.height / 2;

      let points = 8;

      // use larger length
      let len = wd2 > hd2 ? wd2 : hd2;
      // give some space
      len *= 1.2;

      let deg360 = Math.PI * 2;

      this.stuckPoints = [];

      for (let i = 0; i < points; i++) {
        let deg = deg360 / points * i + Math.PI;
        this.stuckPoints.push({ x: len * Math.cos(deg), y: len * Math.sin(deg) });
      }

      this.updateNPoints(points);
    }


    if (style == "default") {
      this.stuck = false;
      this.updateNPoints(this.cursorScaledPoints.length);
    }

    this.activeStyle = style;
  }

  // makes noise objects for n points
  makeNoiseObjects = (n) => {
    this.noiseObjects = [];
    this.noiseArr = [];
    for (let i = 0; i < n; i++) {
      this.noiseObjects.push(new SimplexNoise());
      this.noiseArr.push({ x: 0, y: 0 });
    }
  }

  makeNoisyPoints = (points) => {
    this.noisyPoints = points.slice();
    this.noisyPoints = this.noisyPoints.map((pt, i) => {
      return {
        x: pt.x + this.noiseArr[i].x * this.maxNoise,
        y: pt.y + this.noiseArr[i].y * this.maxNoise
      }
    });
  }

  fixMissingStyle = (style) => {
    // copy "default" style if style does not exist
    if (!(style in this.data.styles)) {
      let styleCopy = {};
      Object.assign(styleCopy, defaultStyle);
      Object.assign(styleCopy, this.data.styles.default);
      this.data.styles[style] = styleCopy;
    }
  }

  // change cursor
  changeCursor = (newData) => {
    // save style
    this.data = newData;

    // check for missing style
    this.fixMissingStyle(this.activeStyle);

    // reset angle
    this.angle = 359.9999;

    // fill in styles with default
    for (let [name, style] of Object.entries(this.data.styles)) {
      let styleCopy = {};
      Object.assign(styleCopy, defaultStyle);
      Object.assign(styleCopy, this.data.styles.default);

      if (name != "default") {
        Object.assign(styleCopy, style);
      }

      this.data.styles[name] = styleCopy;
    }

    // copy style to current values
    this.speed = this.data.speed;
    this.snapSpeed = this.data.snapSpeed;

    this.size = this.data.styles[this.activeStyle].size;
    this.rotationSpeed = this.data.styles[this.activeStyle].rotationSpeed;
    this.dotActive = this.data.styles[this.activeStyle].dotActive;
    this.smooth = this.data.styles[this.activeStyle].smooth;
    this.noisy = this.data.styles[this.activeStyle].noisy;
    this.closed = this.data.styles[this.activeStyle].closed;
    this.snap = this.data.styles[this.activeStyle].snap;
    this.color = {};
    Object.assign(this.color, this.data.styles[this.activeStyle].color);
    this.fillColor = {};
    Object.assign(this.fillColor, this.data.styles[this.activeStyle].fill);
    this.cursorScaledPoints = this.data.points.map(p => new paper.Point(p.x * this.size, p.y * this.size));
    this.noisyPoints = this.cursorScaledPoints.slice();

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

    this.makeNoiseObjects(this.cursorScaledPoints.length);
  }

  // converts between a color object and a paper.Color object
  toPaperColor = (color) => new paper.Color(color.r, color.g, color.b, color.a);
}