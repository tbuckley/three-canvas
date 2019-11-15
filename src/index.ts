import { OrthographicCamera, Scene, WebGLRenderer } from "three";
import { Context, Middleware } from "./middleware/middleware";

import MW from "./middleware";

export type RenderFunc = (ctx: Context) => void;

export const Middlewares = MW;

export function createRenderFunc(...middleware: Middleware[]) {
  return function(ctx: any) {
    for(let mw of middleware) {
      ctx = mw.onRequest(ctx);
    }

    const calls: {[id: number]: boolean} = {};
    function loop(i: number) {
      console.assert(!(i in calls), `Middleware at index ${i} should only be called once`);
      calls[i] = true;
      if(i < middleware.length) {
        middleware[i].wrap(() => loop(i+1));
      } else {
        ctx.renderer.render(ctx.scene, ctx.camera);
      }
    }
    loop(0);
  }
}

// function getContext(canvas: HTMLCanvasElement, alpha: boolean) {
//   return canvas.getContext('webgl2', {
//     alpha: alpha,
//     desynchronized: true,
//     preserveDrawingBuffer: true,
//   }) as WebGL2RenderingContext;
// }

// function createRenderer(gl: WebGL2RenderingContext, width: number, height: number): THREE.WebGLRenderer {
//   const renderer = new THREE.WebGLRenderer({
//     canvas: gl.canvas,
//     context: gl,
//     alpha: false, // TODO set via options
//     clearColor: 0x000000,
//   } as any); // TODO why isn't clearColor recognized?
//   renderer.setPixelRatio(window.devicePixelRatio);
//   renderer.setSize(width, height);
//   renderer.autoClear = false;
//   return renderer;
// }

// function createScene(): THREE.Scene {
//   const scene = new THREE.Scene();
//   scene.background = new THREE.Color(0xffffff);
//   return scene;
// }

// function createCamera(x: number, y: number, width: number, height: number): THREE.OrthographicCamera {
//   const center = {
//     x: x + (width/2),
//     y: y + (height/2),
//   };

//   // Create the new camera
//   const camera = new THREE.OrthographicCamera(-width / 2, width / 2, -height / 2, height / 2);
//   camera.position.set(center.x, center.y, 100);
//   camera.lookAt(new THREE.Vector3(center.x, center.y, 0));

//   return camera;
// }