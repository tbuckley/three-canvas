/// <reference types="webgl2" />
export default class FenceManager {
    private fences;
    private currentFence;
    constructor(numFences: number);
    drawWithFence(gl: WebGL2RenderingContext, drawFn: () => void): void;
}
