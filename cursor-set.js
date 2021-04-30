let sin45 = 1 / Math.SQRT2;

let cursorSet = [
  {
    name: "triangle",
    speed: 1,
    snapSpeed: 0.25,
    points: [
      { x: 0, y: 0 },
      { x: sin45, y: sin45 },
      { x: 0, y: 1 }
    ],
    styles: {
      default: {
        size: 20,
        dotActive: false,
        smooth: false,
        closed: true,
        color: { r: 1, g: 1, b: 1, a: 1 },
        fill: { r: 0, g: 0, b: 0, a: 0 }
      },
      hover: {
        size: 30,
        fill: { r: 1, g: 1, b: 1, a: 0.6 }
      },
      snap: {
        color: { r: 1, g: 0, b: 0, a: 1 },
        fill: { r: 1, g: 0, b: 0, a: 0.3 }
      }
    }
  },
  {
    name: "circle",
    speed: 0.2,
    snapSpeed: 0.2,
    points: [
      { x: 0, y: -1 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: -1, y: 0 }
    ],
    styles: {
      default: {
        size: 15,
        dotActive: true,
        smooth: true,
        closed: true,
        color: { r: 1, g: 1, b: 1, a: 1 },
        fill: { r: 0, g: 0, b: 0, a: 0 }
      },
      hover: {
        size: 20,
        fill: { r: 1, g: 1, b: 1, a: 0.6 }
      },
      snap: {
        color: { r: 0, g: 1, b: 0, a: 1 },
        fill: { r: 0, g: 1, b: 0, a: 0.3 },
        smooth: false
      }
    }
  }
]
