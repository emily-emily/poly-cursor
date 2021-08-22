# poly-cursor

A project that explores creative polygon-based cursors.

Check out the demo [here](https://emily-emily.github.io/poly-cursor/).

**Note**: work in progress, hoping to package it to integrate easily into other projects.

## Made with
- paper.js
- simplex-noise.js

Inspired by https://tympanus.net/Tutorials/CustomCursors/index.html

## Usage
### Quickstart
```html
<!-- link css -->
<link rel="stylesheet" href="cursor.css" />

<!-- create canvas -->
<canvas id="cursor-canvas" resize></canvas>

<!-- giving a classname "cursor-yourStyle" sets the style of the cursor on hover to yourStyle -->
<div class="cursor-coolStyle">div content</div>

<!-- link js -->
<script type="text/javascript" src="cursor.js"></script>
```

```javascript
// define a cursor styleset:
let sin45 = 1 / Math.SQRT2;
let cursorStyleset = {
  points: [
    { x: 0, y: 0 },
    { x: sin45, y: sin45 },
    { x: 0, y: 1 }
  ],
  styles: {
    fill: {
      fill: { r: 1, g: 1, b: 1, a: 0.6 }
    },
    grow: {
      size: 30
    }
  }
};

// create a new Cursor object
let cursor = new Cursor(cursorStyleset);

// change the style of the cursor on an event
let onEvent = () => {
  cursor.setStyle("fill");
};

let onAnotherEvent = () => {
  cursor.setStyle("default");
}
```

### Styling
The cursor styleset is an object that includes all of the styling related info of the cursor.

Styleset properties:
| Property Name | Type   | Default | Description |
| ------------- | ------ | ------- | ----------- |
| name          | string | ""      | name of cursor; currently does nothing |
| speed         | number | 1       | indicates how quickly the cursor follows the user's actual position |
| snapSpeed     | number | 0.25    | indicates how quickly the cursor snaps to an object |
| styles        | object | {}      | styles that the cursor can take on, where the key of each style is the name |

Style properties:
| Property Name | Type   | Default                    | Description |
| ------------- | ------ | -------------------------- | ----------- |
| points        | array  | []                         | array of points that make up the cursor |
| size          | number | 20                         | size in pixels to scale the points by |
| rotationSpeed | number | 0                          | rotation speed in degrees per frame |
| dotActive     | bool   | true                       | specifies whether a dot is shown at 0,0 |
| smooth        | bool   | false                      | specifies whether the cursor's lines should be smoothed |
| noisy         | bool   | false                      | specifies whether to add noise to the cursor |
| closed        | bool   | true                       | specifies whether the polygon should close |
| snap          | string | null                       | how to snap to an object (null, "free", "rect") |
| color         | color  | { r: 0, g: 0, b: 0, a: 0 } | line color |
| fill          | color  | { r: 0, g: 0, b: 0, a: 0 } | fill color |

Notes:
- In points, (0,0) is the position of the user's cursor
- Color values range from 0 to 1
- Missing properties are filled in with default values
- The style "default" is always present. If it is not specified, the default style will be substituted

### Changing the style
#### 1. Class names
Adding "cursor-styleName" to an element will apply the style styleName to the cursor when it hovers over that element, and apply default styling when it leaves the element.

Note that you must call `setHoverListeners` to set these up and apply the event listeners.

#### 2. Setting it up manually
The following are functions in Cursor (to be called `cursor.x()`).

`setStyle(style)` takes the name of the style as a string and changes the cursor's style.

`setSnapTarget(boundingRect)` takes the bounding rectangle of the element and sets a new target for the cursor to snap to.

`changeCursor(newCursor)` takes a new cursor and overwrites the current cursor data.
