let sin45 = 1 / Math.SQRT2;

// style sets for different cursors
// the default is the constant style above
// if a default style is missing from a cursor, it takes on the constant default style
// if a different style is missing, it will be replaced with the default style of that cursor
let cursorSet = [
  {
    name: "triangle",
    styles: {
      default: {
        size: 20,
        points: [
          { x: 0, y: 0 },
          { x: sin45, y: sin45 },
          { x: 0, y: 1 }
        ],
        dotActive: false,
        color: { r: 1, g: 1, b: 1, a: 1 }
      },
      hover: {
        size: 30,
        fill: { r: 1, g: 1, b: 1, a: 0.6 }
      },
      snapRect: {
        snap: "rect",
        color: { r: 1, g: 0, b: 0.8, a: 1 },
        fill: { r: 1, g: 0, b: 0.8, a: 0.3 }
      },
      spin: {
        rotationSpeed: 10
      },
      snapFree: {
        snap: "free",
        smooth: true,
        noisy: true
      }
    }
  },
  {
    name: "diamond",
    speed: 0.2,
    snapSpeed: 0.2,
    styles: {
      default: {
        points: [
          { x: 0, y: -1 },
          { x: 1, y: 0 },
          { x: 0, y: 1 },
          { x: -1, y: 0 }
        ],
        size: 15,
        color: { r: 1, g: 1, b: 1, a: 1 }
      },
      hover: {
        size: 20,
        fill: { r: 1, g: 1, b: 1, a: 0.6 }
      },
      snapRect: {
        snap: "rect",
        dotActive: false,
        color: { r: 1, g: 1, b: 0, a: 1 },
        fill: { r: 1, g: 1, b: 0, a: 0.3 },
        smooth: false
      },
      spin: {
        rotationSpeed: 5
      },
      snapFree: {
        snap: "free",
        dotActive: false
      }
    }
  },
  {
    name: "circle",
    speed: 0.2,
    snapSpeed: 0.2,
    styles: {
      default: {
        points: [
          { x: 0, y: -1 },
          { x: 1, y: 0 },
          { x: 0, y: 1 },
          { x: -1, y: 0 }
        ],
        size: 15,
        dotActive: true,
        smooth: true,
        color: { r: 1, g: 1, b: 1, a: 1 }
      },
      hover: {
        size: 20,
        fill: { r: 1, g: 1, b: 1, a: 0.6 }
      },
      snapRect: {
        snap: "rect",
        dotActive: false,
        smooth: false,
        color: { r: 0, g: 1, b: 0, a: 1 },
        fill: { r: 0, g: 1, b: 0, a: 0.3 }
      },
      spin: {
        points: [
          { x: 0, y: -1 },
          { x: 0.35, y: -0.35 },
          { x: 1, y: 0 },
          { x: 0.35, y: 0.35 },
          { x: 0, y: 1 },
          { x: -0.35, y: 0.35 },
          { x: -1, y: 0 },
          { x: -0.35, y: -0.35 }
        ],
        smooth: false,
        rotationSpeed: 5
      },
      snapFree: {
        snap: "free",
        dotActive: false
      }
    }
  }
];
