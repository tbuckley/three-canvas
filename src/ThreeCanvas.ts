import StylusCanvas from 'stylus-canvas';
import * as THREE from 'three';

import FenceManager from './FenceManager.js';
import { ScissorRect, RenderRequestManager } from './ScissorRect.js';

export interface ThreeCanvasOptions {
  numFences: number;
  alpha: boolean;
}

const DEFAULT_OPTIONS: ThreeCanvasOptions = {
  numFences: 2,
  alpha: false,
};

export default class ThreeCanvas {
  private gl: WebGL2RenderingContext;
  private renderer: THREE.WebGLRenderer;
  private canvas: StylusCanvas;

  private fenceManager: FenceManager;
  private renderRequestManager: RenderRequestManager;

  scene: THREE.Scene;
  camera: THREE.Camera;

  constructor(canvas: StylusCanvas, options?: Partial<ThreeCanvasOptions>) {
    let fullOptions = DEFAULT_OPTIONS;
    if(options) {
      fullOptions = {...fullOptions, ...options};
    }

    this.canvas = canvas;

    this.fenceManager = new FenceManager(fullOptions.numFences);
    this.renderRequestManager = new RenderRequestManager();

    this.gl = canvas.getContext('webgl2', {
      alpha: fullOptions.alpha,
      desynchronized: true,
      preserveDrawingBuffer: true,
    }) as WebGL2RenderingContext;

    this.renderer = createRenderer(this.gl, canvas.width, canvas.height);
    this.scene = createScene();
    this.camera = createCamera(-1, -1, 2, 2, canvas.rotation);

    canvas.addEventListener('canvas-rotate', () => {
      // Rotate the camera
      const { rotation } = this.canvas;
      this.camera.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), rotation * Math.PI / 180);

      // Inform the renderer
      const [width, height] = rotateDimensions(this.canvas.width, this.canvas.height, rotation);
      this.renderer.setSize(width, height);
    });
  }

  renderWithScissor(screenRect: ScissorRect) {
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

  private renderInternal() {
    if(this.renderRequestManager.request.type == "scissor") {
      const { rotation, clientWidth, clientHeight } = this.canvas;
      const rect = this.renderRequestManager.getRotated(clientWidth, clientHeight, rotation)!;

      this.renderer.setScissorTest(true);
      this.renderer.setScissor(rect.min.x, rect.min.y, rect.width, rect.height);
    } else {
      this.renderer.setScissorTest(false);
    }

    this.renderer.render(this.scene, this.camera);
    // Must call flush ourselves when using desynchronized
    this.gl.flush();

    this.renderRequestManager.reset();
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
    alpha: false, // TODO set via options
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

function createCamera(x: number, y: number, width: number, height: number, rotation: number): THREE.OrthographicCamera {
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

function rotateDimensions(width: number, height: number, rotation: number): [number, number] {
  if(rotation == 90 || rotation == 270) {
    return [height, width];
  }
  return [width, height];
}