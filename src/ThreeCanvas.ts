import * as THREE from 'three';

export default class ThreeCanvas {
  private gl: WebGL2RenderingContext;
  private renderer: THREE.WebGLRenderer;

  canvas: HTMLCanvasElement;
  scene: THREE.Scene;
  camera: THREE.Camera;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;


    canvas.addEventListener('canvas-rotate', () => {

    });
  }
}
