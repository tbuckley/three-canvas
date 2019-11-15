import { Middleware, Context as MWContext } from "./middleware";

export interface Rect {x: number, y: number, width: number, height: number};
export interface Context extends MWContext {
    rect?: Rect;
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

export default function scissor(): Middleware {
    let state: State = NONE_STATE;
    return {
        onRequest(ctx: Context): Context {
            if(ctx.rect) {
                state = merge(state, {type: "partial", rect: ctx.rect});
            } else {
                state = merge(state, FULL_STATE);
            }
            return ctx;
        },

        wrap(ctx, render) {
            if(state.type === "partial") {
                const rect = state.rect;
                ctx.renderer.setScissorTest(true);
                ctx.renderer.setScissor(rect.x, rect.y, rect.width, rect.height);
                render();
                ctx.renderer.setScissorTest(false);
            } else {
                render();
            }
            
            state = NONE_STATE;
        },
    }
}
