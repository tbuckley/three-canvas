import { WebGLRenderer, Scene, OrthographicCamera } from "three";

export type RenderFn = () => void;
export type WrapperFn = (render: RenderFn) => void;

export type NextFn = (wrapper?: WrapperFn) => void;

export interface Context {
    renderer: WebGLRenderer;
    scene: Scene;
    camera: OrthographicCamera;
}


export interface Middleware {
    onRequest(ctx: Context): Context;
    wrap(ctx: Context, render: RenderFn): void;
}

// export type Middleware = (ctx: Context, next: NextFn) => void;

export function createRenderer(...middleware: Middleware[]) {
    return function(renderer: WebGLRenderer, scene: Scene, camera: OrthographicCamera) {
        let ctx: Context = {
            renderer,
            scene,
            camera,
        };

        for(let mw of middleware) {
            ctx = mw.onRequest(ctx);
        }

        const calls: {[id: number]: boolean} = {};
        function loop(i: number) {
            console.assert(!(i in calls), `Middleware at index ${i} should only be called once`);
            calls[i] = true;
            if(i < middleware.length) {
                middleware[i].wrap(ctx, () => loop(i+1));
            } else {
                ctx.renderer.render(ctx.scene, ctx.camera);
            }
        }
        loop(0);
    }
}
