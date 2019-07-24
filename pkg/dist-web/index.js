import { Vector3, WebGLRenderer, Scene, Color, OrthographicCamera } from 'three';

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

class FenceManager {
  constructor(numFences) {
    console.assert(numFences > 0);
    this.fences = new Array(numFences);
    this.currentFence = 0;
  }

  drawWithFence(gl, drawFn) {
    var fence = this.fences[this.currentFence];

    if (fence && gl.getSyncParameter(fence, gl.SYNC_STATUS) === gl.UNSIGNALED) {
      console.log("dropped frame");
      return;
    }

    drawFn();
    this.fences[this.currentFence] = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
    this.currentFence = (this.currentFence + 1) % this.fences.length;
  }

}

class Point {
  constructor(state) {
    this.x = state.x;
    this.y = state.y;
  }

  min(p) {
    return this.apply(p, Math.min);
  }

  max(p) {
    return this.apply(p, Math.max);
  }

  sub(p) {
    return this.apply(p, (a, b) => a - b);
  }

  add(p) {
    return this.apply(p, (a, b) => a + b);
  }

  scale(factor) {
    return new Point({
      x: this.x * factor,
      y: this.y * factor
    });
  }

  multiplyMatrix4(matrix) {
    var vec = new Vector3(this.x, this.y, 0);
    return vec.applyMatrix4(matrix);
  }

  toString() {
    return "P(".concat(Math.round(this.x), ", ").concat(Math.round(this.y), ")");
  }

  apply(p, fn) {
    return new Point({
      x: fn(this.x, p.x),
      y: fn(this.y, p.y)
    });
  }

  rotate(radians) {
    return new Point({
      x: this.x * Math.cos(radians) - this.y * Math.sin(radians),
      y: this.x * Math.sin(radians) + this.y * Math.cos(radians)
    });
  }

}

class Rectangle {
  constructor(state) {
    this.min = new Point(state.min);
    this.max = new Point(state.max);
  }

  toString() {
    return "R(".concat(this.min.toString(), ", ").concat(this.max.toString(), ")");
  }

  static fromPoint(point) {
    return new Rectangle({
      min: point,
      max: point
    });
  }

  static fromPoints(points) {
    var min, max;
    min = max = new Point(points[0]);

    for (var i = 1; i < points.length; i++) {
      min = min.min(points[i]);
      max = max.max(points[i]);
    }

    return new Rectangle({
      min,
      max
    });
  }

  static fromDimensions(width, height) {
    return new Rectangle({
      min: {
        x: 0,
        y: 0
      },
      max: {
        x: width,
        y: height
      }
    });
  }

  get width() {
    return this.max.x - this.min.x;
  }

  get height() {
    return this.max.y - this.min.y;
  }

  get center() {
    return new Point({
      x: this.width / 2 + this.min.x,
      y: this.height / 2 + this.min.y
    });
  }

  union(r) {
    return new Rectangle({
      min: this.min.min(r.min),
      max: this.max.max(r.max)
    });
  }

  addPoint(p) {
    return new Rectangle({
      min: this.min.min(p),
      max: this.max.max(p)
    });
  }

  expand(p) {
    return new Rectangle({
      min: this.min.sub(p),
      max: this.max.add(p)
    });
  }

  rotate(radians) {
    var min = this.min.rotate(radians);
    var max = this.max.rotate(radians);
    return new Rectangle({
      min: min.min(max),
      max: min.max(max)
    });
  }

  shift(p) {
    return new Rectangle({
      min: this.min.add(p),
      max: this.max.add(p)
    });
  }

}

var REQUEST_NONE = {
  type: "none"
};
var REQUEST_FULL = {
  type: "full"
};
class RenderRequestManager {
  constructor() {
    this.request = REQUEST_NONE;
  }

  reset() {
    this.request = REQUEST_NONE;
  }

  render() {
    this.request = REQUEST_FULL;
  }

  renderWithScissor(scissorRect) {
    if (this.request.type == "none") {
      this.request = {
        type: "scissor",
        area: scissorRectToRect(scissorRect)
      };
    } else if (this.request.type == "scissor") {
      var currentArea = this.request.area;
      var newArea = scissorRectToRect(scissorRect);
      this.request = {
        type: "scissor",
        area: currentArea.union(newArea)
      };
    } // Do nothing if it's already full

  }

  getRotated(clientWidth, clientHeight, rotation) {
    if (this.request.type == "scissor") {
      return rotateScissorRect(this.request.area, clientWidth, clientHeight, rotation);
    }

    return null;
  }

}

function scissorRectToRect(scissorRect) {
  var rect = Rectangle.fromDimensions(scissorRect.width, scissorRect.height);
  return rect.shift({
    x: scissorRect.x,
    y: scissorRect.y
  });
}

function rotateScissorRect(rect, clientWidth, clientHeight, rotation) {
  switch (rotation) {
    case 0:
      return rect;

    case 90:
      return rect.rotate(-rotation * Math.PI / 180).shift({
        x: 0,
        y: clientWidth
      });

    case 180:
      return rect.rotate(-rotation * Math.PI / 180).shift({
        x: clientWidth,
        y: clientHeight
      });

    case 270:
      return rect.rotate(-rotation * Math.PI / 180).shift({
        x: clientHeight,
        y: 0
      });
  }

  throw new Error("unsupported rotation: ".concat(rotation));
}

class ThreeCanvas {
  constructor(canvas) {
    this.canvas = canvas;
    this.fenceManager = new FenceManager(2);
    this.renderRequestManager = new RenderRequestManager();
    this.gl = canvas.getContext('webgl2', {
      alpha: false,
      desynchronized: true,
      preserveDrawingBuffer: true
    });
    this.renderer = createRenderer(this.gl, canvas.width, canvas.height);
    this.scene = createScene();
    this.camera = createCamera(-1, -1, 2, 2, 0);
    canvas.addEventListener('canvas-rotate', () => {
      // Rotate the camera
      var {
        rotation
      } = this.canvas;
      this.camera.setRotationFromAxisAngle(new Vector3(0, 0, 1), rotation * Math.PI / 180); // Inform the renderer

      var [width, height] = rotateDimensions(this.canvas.width, this.canvas.height, rotation);
      this.renderer.setSize(width, height);
    });
  }

  renderWithScissor(screenRect) {
    this.renderRequestManager.renderWithScissor(screenRect);
    this.fenceManager.drawWithFence(this.gl, () => {
      this.renderInternal();
    });
  }

  render() {
    this.renderRequestManager.render();
    this.fenceManager.drawWithFence(this.gl, () => {
      this.renderInternal();
    });
  }

  renderInternal() {
    if (this.renderRequestManager.request.type == "scissor") {
      var {
        rotation,
        clientWidth,
        clientHeight
      } = this.canvas;
      var rect = this.renderRequestManager.getRotated(clientWidth, clientHeight, rotation);
      this.renderer.setScissorTest(true);
      this.renderer.setScissor(rect.min.x, rect.min.y, rect.width, rect.height);
    } else {
      this.renderer.setScissorTest(false);
    }

    this.renderer.render(this.scene, this.camera); // Must call flush ourselves when using desynchronized

    this.gl.flush();
    this.renderRequestManager.reset();
  }

  setCameraBounds(x, y, width, height) {
    var {
      rotation
    } = this.canvas;
    this.camera = createCamera(x, y, width, height, rotation);
  }

}

function createRenderer(gl, width, height) {
  var renderer = new WebGLRenderer({
    canvas: gl.canvas,
    context: gl,
    alpha: false,
    clearColor: 0x000000
  }); // TODO why isn't clearColor recognized?

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  renderer.autoClear = false;
  return renderer;
}

function createScene() {
  var scene = new Scene();
  scene.background = new Color(0xffffff);
  return scene;
}

function createCamera(x, y, width, height, rotation) {
  // Rotate width/height if needed
  if (rotation == 90 || rotation == 270) {
    [height, width] = [width, height];
  }

  var center = {
    x: x + width / 2,
    y: y + height / 2
  }; // Create the new camera

  var camera = new OrthographicCamera(-width / 2, width / 2, -height / 2, height / 2);
  camera.position.set(center.x, center.y, 100);
  camera.lookAt(new Vector3(center.x, center.y, 0));
  camera.setRotationFromAxisAngle(new Vector3(0, 0, 1), rotation * Math.PI / 180);
  return camera;
}

function rotateDimensions(width, height, rotation) {
  if (rotation == 90 || rotation == 270) {
    return [height, width];
  }

  return [width, height];
}

function createThreeCanvas(_x) {
  return _createThreeCanvas.apply(this, arguments);
}

function _createThreeCanvas() {
  _createThreeCanvas = _asyncToGenerator(function* (canvas) {
    yield customElements.whenDefined("stylus-canvas");
    yield canvas.updateComplete;
    return new ThreeCanvas(canvas);
  });
  return _createThreeCanvas.apply(this, arguments);
}

export default ThreeCanvas;
export { createThreeCanvas };
