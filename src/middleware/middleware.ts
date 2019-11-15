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
    wrap(render: RenderFn): void;
}
