import { RenderFn } from "./RenderFn";

export interface Config {
    gl: WebGL2RenderingContext;
}

export default class FlushManager {
    config: Config
    
    constructor(config: Config) {
        console.assert(config.gl !== null && config.gl !== undefined);
        this.config = config;
    }
    
    wrap(render: RenderFn) {
        render();
        this.config.gl.flush();
    }
}