let sin45 = 1 / Math.SQRT2;

// const defaultStyle = {
//   size: 20,
//   rotationSpeed: 0,
//   dotActive: false,
//   smooth: false,
//   noisy: false,
//   closed: true,
//   color: { r: 1, g: 1, b: 1, a: 1 },
//   fill: { r: 0, g: 0, b: 0, a: 0 }
// }

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
        rotationSpeed: 0,
        dotActive: false,
        smooth: false,
        noisy: false,
        closed: true,
        color: { r: 1, g: 1, b: 1, a: 1 },
        fill: { r: 0, g: 0, b: 0, a: 0 }
      },
      hover: {
        size: 30,
        fill: { r: 1, g: 1, b: 1, a: 0.6 }
      },
      snapRect: {
        color: { r: 1, g: 0, b: 0.8, a: 1 },
        fill: { r: 1, g: 0, b: 0.8, a: 0.3 }
      },
      spin: {
        rotationSpeed: 10
      },
      snapFree: {
        smooth: true,
        noisy: true
      }
    }
  },
  {
    name: "diamond",
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
        rotationSpeed: 0,
        dotActive: true,
        smooth: false,
        noisy: false,
        closed: true,
        color: { r: 1, g: 1, b: 1, a: 1 },
        fill: { r: 0, g: 0, b: 0, a: 0 }
      },
      hover: {
        size: 20,
        fill: { r: 1, g: 1, b: 1, a: 0.6 }
      },
      snapRect: {
        color: { r: 1, g: 1, b: 0, a: 1 },
        fill: { r: 1, g: 1, b: 0, a: 0.3 },
        smooth: false
      },
      spin: {
        rotationSpeed: 5
      },
      snapFree: {
        dotActive: false
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
        rotationSpeed: 0,
        dotActive: true,
        smooth: true,
        noisy: false,
        closed: true,
        color: { r: 1, g: 1, b: 1, a: 1 },
        fill: { r: 0, g: 0, b: 0, a: 0 }
      },
      hover: {
        size: 20,
        dotActive: false,
        fill: { r: 1, g: 1, b: 1, a: 0.6 }
      },
      snapRect: {
        dotActive: false,
        smooth: false,
        color: { r: 0, g: 1, b: 0, a: 1 },
        fill: { r: 0, g: 1, b: 0, a: 0.3 }
      },
      spin: {},
      snapFree: {
        dotActive: false
      }
    }
  }
]
