import { Middleware, Context as MWContext } from "./middleware";

export interface Context extends MWContext {
    immediate?: boolean;
}

export default function animationFrame(): Middleware {
    let requested = false;
    return {
        onRequest(ctx: Context) {
            return ctx;
        },
        wrap(ctx: Context, render) {
            if(ctx.immediate) {
                render();
            } else if(!requested) {
                requested = true;
                requestAnimationFrame(() => {
                    render();
                    requested = false;
                });
            }
        },
    };
}