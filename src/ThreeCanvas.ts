import StylusCanvas from 'stylus-canvas';
import * as THREE from 'three';

import Rectangle from './geometry/Rectangle.js';

export interface ScissorRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default class ThreeCanvas {
  private gl: Promise<WebGL2RenderingContext>;
  private renderer: Promise<THREE.WebGLRenderer>;
  private canvas: StylusCanvas;

  scene: THREE.Scene;
  camera: THREE.Camera;

  constructor(canvas: StylusCanvas) {
    this.canvas = canvas;

    this.gl = canvas.updateComplete.then(() => {
      return canvas.getContext('webgl2', {
        alpha: false, // TODO make optional
        desynchronized: true,
        preserveDrawingBuffer: true,
      }) as WebGL2RenderingContext;
    });
    
    this.renderer = this.gl.then((gl) => {
      return createRenderer(gl, canvas.width, canvas.height);
    });

    this.scene = createScene();
    this.camera = createCamera(-1, -1, 2, 2, 0);

    canvas.addEventListener('canvas-rotate', async () => {
      // Rotate the camera
      const { rotation } = this.canvas;
      this.camera.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), rotation * Math.PI / 180);

      // Inform the renderer
      const renderer = await this.renderer;
      const [width, height] = rotateDimensions(this.canvas.width, this.canvas.height, rotation);
      renderer.setSize(width, height);
    });
  }

  async renderWithScissor(screenRect: ScissorRect) {
    const { rotation, clientWidth, clientHeight } = this.canvas;
    const rect = rotateScissorRect(screenRect, clientWidth, clientHeight, rotation);

    const renderer = await this.renderer;
    renderer.setScissorTest(true);
    renderer.setScissor(rect.min.x, rect.min.y, rect.width, rect.height);

    await this.render();

    renderer.setScissorTest(false);
  }

  async render() {
    const renderer = await this.renderer;
    renderer.render(this.scene, this.camera);
  }

  setCameraBounds(x: number, y: number, width: number, height: number) {
    const { rotation } = this.canvas;
    this.camera = createCamera(x, y, width, height, rotation);
  }
}

function createRenderer(gl: WebGL2RenderingContext, width: number, height: number): THREE.WebGLRenderer {
  const renderer = new THREE.WebGLRenderer({
    canvas: gl.canvas,
    context: gl,
    alpha: false,
    clearColor: 0x000000,
  } as any); // TODO why isn't clearColor recognized?
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  renderer.autoClear = false;
  return renderer;
}

function createScene(): THREE.Scene {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);
  return scene;
}

export function createCamera(x: number, y: number, width: number, height: number, rotation: number): THREE.OrthographicCamera {
  // Rotate width/height if needed
  if(rotation == 90 || rotation == 270) {
    [height, width] = [width, height];
  }

  const center = {
    x: x + (width/2),
    y: y + (height/2),
  };

  // Create the new camera
  const camera = new THREE.OrthographicCamera(-width / 2, width / 2, -height / 2, height / 2);
  camera.position.set(center.x, center.y, 100);
  camera.lookAt(new THREE.Vector3(center.x, center.y, 0));

  camera.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), rotation * Math.PI / 180);

  return camera;
}

function rotateScissorRect(scissorRect: ScissorRect, clientWidth: number, clientHeight: number, rotation: number): Rectangle {
  const radians = -rotation * Math.PI / 180;

  let rect = Rectangle.fromDimensions(scissorRect.width, scissorRect.height)
    .shift({
      x: scissorRect.x,
      y: scissorRect.y,
    });

  switch (rotation) {
    case 0:
      return rect;

    case 90:
      return rect
        .rotate(-rotation * Math.PI / 180)
        .shift({ x: 0, y: clientWidth });

    case 180:
      return rect
        .rotate(-rotation * Math.PI / 180)
        .shift({ x: clientWidth, y: clientHeight });

    case 270:
      return rect
        .rotate(-rotation * Math.PI / 180)
        .shift({ x: clientHeight, y: 0 });
  }
  throw new Error(`unsupported rotation: ${rotation}`);
}

function rotateDimensions(width: number, height: number, rotation: number): [number, number] {
  if(rotation == 90 || rotation == 270) {
    return [height, width];
  }
  return [width, height];
}