import { RenderFn } from "./RenderFn";

export interface Context {
    immediate?: boolean;
}

export default class AnimationFrameMiddleware {
    requested: number | null = null;
    wrap(ctx: Context, render: RenderFn) {
        if(ctx.immediate) {
            render();
            if(this.requested !== null) {
                cancelAnimationFrame(this.requested);
                this.requested = null;
            }
        } else if(this.requested === null) {
            this.requested = requestAnimationFrame(() => {
                render();
                this.requested = null;
            });
        }
    }
}
