import { RenderFn } from "./RenderFn";

export interface Config {
    gl: WebGL2RenderingContext;
    numFences?: number;
    logDroppedFrame?: () => void;
}

const DEFAULT_FENCES = 2;

export default class FenceManager {
    config: Config;
    fences: (WebGLSync | undefined | null)[];
    currentFence: number;

    constructor(config: Config) {
        console.assert(config.gl !== null && config.gl !== undefined);
        this.config = config;

        this.fences = new Array(config.numFences || DEFAULT_FENCES);
        this.currentFence = 0;
    }

    wrap(render: RenderFn) {
        const gl = this.config.gl;
        const fence = this.fences[this.currentFence];
        if(fence && gl.getSyncParameter(fence, gl.SYNC_STATUS) === gl.UNSIGNALED) {
            if(this.config.logDroppedFrame) {
                this.config.logDroppedFrame();
            }
            return;
        }
        render();
        this.fences[this.currentFence] = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        this.currentFence = (this.currentFence + 1) % this.fences.length;
    }
}