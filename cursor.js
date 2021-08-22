// default styling
const defaultSyleset = {
  name: "",
  speed: 1,
  snapSpeed: 0.25,
  styles: {}
};

const defaultStyle = {
  points: [],
  size: 20,
  rotationSpeed: 0,
  dotActive: true,
  smooth: false,
  noisy: false,
  closed: true,
  snap: null,
  color: { r: 0, g: 0, b: 0, a: 0 },
  fill: { r: 0, g: 0, b: 0, a: 0 }
};

/**
 * Cursor stores a cursor and all of its relevant information.
 * 
 * TODO:
 *  * line width?
 *  * noise levels based on size
 * **/

class Cursor {
  pos = { x: -100, y: -100 }; // group pos
  clientPos = { x: -100, y: -100 };
  activeStyle = "default";
  stuck = false;
  targetPoints = []; // target cursor shape
  noisyTargetPoints = []; // target cursor shape with noise applied (final)
  stuckGroup = { x: 0, y: 0 }; // location of cursor when stuck (center of shape)
  targetObj = null; // target to snap to (bounding box)
  angle = 0;

  noiseObjects = [];
  evCount = 0; // for noise generating
  noiseArr = []; // noise for each point (not scaled; range is -1 to 1)
  noiseScale = 200; // noise speed
  maxNoise = 20; // multiplied by noise

  target = {};
  current = {};

  constructor(cursorStyle) {
    // setup paper canvas
    paper.setup(document.querySelector("#cursor-canvas"));

    // paper loop prompts cursor to update position each frame
    paper.view.onFrame = ev => {
      cursor.updatePos();
    };

    // event listener for mouse move
    document.addEventListener("mousemove", ev => {
      this.updateClientPos(ev);
    });

    // init with default cursor
    this.changeCursor(cursorStyle);

    // cursor dot
    this.dot = new paper.Path.RegularPolygon(new paper.Point(0, 0), 4, 2);
    this.dot.strokeColor = this.toPaperColor(this.current.color);
    this.dot.fillColor = this.toPaperColor(this.current.color);
    this.dot.smooth();
    this.dotGroup = new paper.Group({
      children: [this.dot],
      position: new paper.Point(0, 0),
      applyMatrix: false
    });
    
    // noise objects
    this.makeNoiseObjects(this.target.points.length);
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
    this.current.dotActive = this.target.dotActive;

    // lint size
    this.current.size = this.lint(this.current.size, this.target.size, this.snapSpeed);

    // update noise values
    this.current.noisy = this.target.noisy;
    if (this.current.noisy) {
      this.noiseArr.forEach((item, i) => {
        item.x = this.noiseObjects[i].noise2D(this.evCount / this.noiseScale, 0);
        item.y = this.noiseObjects[i].noise2D(this.evCount / this.noiseScale, 1);
      });
    }

    this.current.smooth = this.target.smooth;
    this.current.closed = this.target.closed;

    this.current.snap = this.target.snap;
    if (this.current.snap == "rect" || this.current.snap == "free") {
      this.stuck = true;
    }
    else {
      this.stuck = false;
    }

    // lint rotation?
    this.current.rotationSpeed = this.target.rotationSpeed;
    
    // lint color and fill
    this.lintColor(this.current.color, this.target.color, this.snapSpeed);
    this.lintColor(this.current.fillColor, this.target.fill, this.snapSpeed);

    // update noise
    this.makeNoisyPoints(this.target.points);

    // lint group
    if (this.stuck)
      this.lintPoint(this.pos, this.stuckGroup, this.snapSpeed);
    else 
      this.lintPoint(this.pos, this.clientPos, this.speed);

    // lint points
    this.lintPoints(this.noisyTargetPoints);
  }

  // apply cursor style to polygon
  applyStyle = () => {
    if (this.target.points.length == 0) return;
    // set dot to client position if active
    if (this.current.dotActive)
      this.dotGroup.position.set(this.clientPos.x, this.clientPos.y);
    else
      this.dotGroup.position.set(-100, -100);

    // smooth/flatten can only be applied if it is a polygon
    if (this.polygon.segments.length > 2) {
      if (this.current.smooth)
        this.polygon.smooth();
      else
        this.polygon.flatten(100); // flatten error in pixels
    }

    this.polygon.closed = this.current.closed;

    if (this.current.rotationSpeed != 0){
      this.group.rotate(this.current.rotationSpeed);
      this.angle = (this.angle + this.current.rotationSpeed) % 360;
    }
    else { // lint back to angle 0
      let rotation = this.lint(this.angle, 359.99, this.snapSpeed) - this.angle;
      this.group.rotate(rotation);
      this.angle = (this.angle + rotation) % 360;
    }

    this.polygon.strokeColor = this.toPaperColor(this.current.color);
    this.polygon.fillColor = this.toPaperColor(this.current.fillColor);
    
    this.group.position.set(this.pos.x, this.pos.y);
  }

  // updates polygon to have n points
  updateNPoints = (n) => {
    // reset noise objects due to change in number of points
    this.makeNoiseObjects(n);

    while (this.polygon.segments.length < n) {
      if (this.polygon.segments.length == 0) 
        this.polygon.add(new paper.Point(this.clientPos));
      else
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

  // saves the coordinates of the centre of an element
  setSnapTarget = (item) => {
    this.targetObj = item;
    this.stuckGroup.x = item.left + item.width / 2;
    this.stuckGroup.y = item.top + item.height / 2;
  }

  // updates the active style (called by client)
  setStyle = (style) => {
    // if style is missing, set to default
    if (!(style in this.data.styles))
      style = "default";

    // copy new style values
    for (let prop in defaultStyle) {
      this.target[prop] = this.data.styles[style][prop];
    }

    // update points
    this.target.points = this.target.points.map(p => new paper.Point(p.x * this.data.styles[style].size,
                                                                     p.y * this.data.styles[style].size));
    this.noisyTargetPoints = this.target.points.slice();
    this.updateNPoints(this.target.points.length);

    // handle snap
    if (this.data.styles[style].snap == "rect") {
      let wd2 = this.targetObj.width / 2;
      let hd2 = this.targetObj.height / 2;

      this.target.points = [
        { x: -wd2, y: -hd2 },
        { x: wd2, y: -hd2 },
        { x: wd2, y: hd2 },
        { x: -wd2, y: hd2 }
      ];

      this.updateNPoints(4);
    }
    else if (this.data.styles[style].snap == "free") {
      let wd2 = this.targetObj.width / 2;
      let hd2 = this.targetObj.height / 2;

      let points = 8;

      // use larger length
      let len = wd2 > hd2 ? wd2 : hd2;
      // give some space
      len *= 1.2;

      let deg360 = Math.PI * 2;

      this.target.points = [];

      for (let i = 0; i < points; i++) {
        let deg = deg360 / points * i + Math.PI;
        this.target.points.push({ x: len * Math.cos(deg), y: len * Math.sin(deg) });
      }

      this.updateNPoints(points);
    }


    if (style == "default") {
      this.stuck = false;
      this.updateNPoints(this.target.points.length);
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

  // calculates points with new noise and stores in this.noisyTargetPoints
  makeNoisyPoints = (points) => {
    this.noisyTargetPoints = points.slice();
    this.noisyTargetPoints = this.noisyTargetPoints.map((pt, i) => {
      return {
        x: pt.x + this.noiseArr[i].x * this.maxNoise,
        y: pt.y + this.noiseArr[i].y * this.maxNoise
      }
    });
  }

  // checks to see if information is missing from this.data and fixes it
  patchData = () => {
    // add missing properties of styleset
    for (let key in defaultSyleset) {
      if (!(key in this.data)) {
        this.data[key] = defaultSyleset[key];
      }
    }

    // set default style if missing
    if (!("default" in this.data.styles)) {
      let defaultCopy = {};
      Object.assign(defaultCopy, defaultStyle);
      this.data.styles.default = defaultCopy;
    }

    // fill in incomplete styles with default
    for (let [name, style] of Object.entries(this.data.styles)) {
      let styleCopy = {};
      Object.assign(styleCopy, style);
      // populate copy with filler data
      Object.assign(styleCopy, defaultStyle);
      Object.assign(styleCopy, this.data.styles.default);

      // overwrite with new style
      Object.assign(styleCopy, style);

      this.data.styles[name] = styleCopy;
    }
  }

  // change cursor
  changeCursor = (newData) => {
    // save style
    this.data = newData;

    this.patchData();

    // if current active style is missing, set to default
    if (!(this.activeStyle in this.data.styles))
      this.activeStyle = "default";

    // reset angle
    this.angle = 359.9999;

    // copy style to current values
    this.speed = this.data.speed;
    this.snapSpeed = this.data.snapSpeed;

    for (let prop in defaultStyle) {
      this.current[prop] = this.target[prop] = this.data.styles[this.activeStyle][prop];
    }
    this.current.color = {};
    Object.assign(this.current.color, this.target.color);
    this.current.fillColor = {};
    Object.assign(this.current.fillColor, this.target.fill);
    this.target.points = this.target.points.map(p => new paper.Point(p.x * this.current.size, p.y * this.current.size));
    this.noisyTargetPoints = this.target.points.slice();

    // remove old cursor
    if (this.polygon)
      this.polygon.remove();

    // create new cursor
    this.polygon = new paper.Path({
      segments: this.target.points,
      strokeCap: 'round',
      strokeColor: this.toPaperColor(this.current.color),
      closed: this.current.closed,
      fillColor: this.current.fillColor
    });
    this.group = new paper.Group({
      children: [this.polygon],
      pivot: new paper.Point(0, 0),
      position: new paper.Point(0, 0),
      applyMatrix: false
    });

    // set the style to update the cursor appropriately
    this.setStyle(this.activeStyle);
  }

  // converts between a color object and a paper.Color object
  toPaperColor = (color) => new paper.Color(color.r, color.g, color.b, color.a);
}

let setHoverListeners = () => {
  document.querySelectorAll("[class*=cursor-]").forEach(item => {
    let styleName = item.className.split(' ').filter(c => c.startsWith("cursor-"))[0].substr(7);
    item.addEventListener("mouseenter", ev => {
      cursor.setSnapTarget(ev.currentTarget.getBoundingClientRect());
      cursor.setStyle(styleName);
    })
    item.addEventListener("mouseleave", ev => {
      cursor.setStyle("default");
    })
  });
}