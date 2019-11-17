import { Config as BaseConfig } from "../createRenderFunc";
import { WebGLRenderer, Scene, Color, OrthographicCamera, Vector3 } from "three";
import scissor from "./scissor";

export interface Config {
    gl: WebGL2RenderingContext;
    renderer: WebGLRenderer;
    numFences?: number;
}

export function createThreeConfig(config: Config): BaseConfig {
    return {
        scissorFunc: scissor(config.renderer),
        ...config,
    };
}

export function getContext(canvas: HTMLCanvasElement, alpha: boolean) {
  return canvas.getContext('webgl2', {
    alpha: alpha,
    desynchronized: true,
    preserveDrawingBuffer: true,
  }) as WebGL2RenderingContext;
}

export function createRenderer(gl: WebGL2RenderingContext, alpha: boolean): THREE.WebGLRenderer {
  const renderer = new WebGLRenderer({
    canvas: gl.canvas,
    context: gl,
    alpha: alpha,
    clearColor: 0xFF0000, // TODO set via options
  } as any); // TODO why isn't clearColor recognized?
  renderer.autoClear = false;
  return renderer;
}

export function createCamera(x: number, y: number, width: number, height: number): THREE.OrthographicCamera {
  const center = {
    x: x + (width/2),
    y: y + (height/2),
  };

  // Create the new camera
  const camera = new OrthographicCamera(-width / 2, width / 2, -height / 2, height / 2);
  camera.position.set(center.x, center.y, 100);
  camera.lookAt(new Vector3(center.x, center.y, 0));

  return camera;
}