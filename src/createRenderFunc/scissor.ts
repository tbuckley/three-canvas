import { RenderFn } from "./RenderFn";

export interface Rect {x: number, y: number, width: number, height: number};
export interface Context {
    rect?: Rect;
}

export type ScissorFunc = (rect: Rect, render: RenderFn) => void;
export interface Config {
    scissorFunc: ScissorFunc;
}

type State =
    | {type: "none"}
    | {type: "partial", rect: Rect}
    | {type: "full"};

const NONE_STATE: State = {type: "none"};
const FULL_STATE: State = {type: "full"};

function mergeRect(a: Rect, b: Rect): Rect {
    const minx = Math.min(a.x, b.x);
    const miny = Math.min(a.y, b.y);
    const maxx = Math.max(a.x+a.width, b.x+b.width);
    const maxy = Math.max(a.y+a.height, b.y+b.height);
    return {
        x: minx,
        y: miny,
        width: maxx - minx,
        height: maxy - miny,
    };
}

function merge(a: State, b: State): State {
    if(a.type === "none") {
        return b;
    }
    if(b.type === "none") {
        return a;
    }
    if(a.type === "full" || b.type === "full") {
        return FULL_STATE;
    }
    return {
        type: "partial",
        rect: mergeRect(a.rect, b.rect),
    };
}


export default class ScissorManager {
    config: Config;
    state: State = NONE_STATE;
    
    constructor(config: Config) {
        this.config = config;
    }

    onRequest(ctx: Context): Context {
        console.log("ScissorManager, ctx: ", ctx);
        if(ctx.rect) {
            this.state = merge(this.state, {type: "partial", rect: ctx.rect});
        } else {
            this.state = FULL_STATE;
        }
        return ctx;
    }

    wrap(render: RenderFn) {
        if(this.state.type === "partial") {
            this.config.scissorFunc(this.state.rect, render);
        } else {
            render();
        }
        
        this.state = NONE_STATE;
    }
}
