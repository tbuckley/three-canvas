import AnimationFrameManager, { Context as AnimationFrameContext } from "./animationFrame";
import FenceManager, { Config as FenceConfig } from "./fence";
import FlushManager, { Config as FlushConfig } from "./flush";
import ScissorManager, { Config as ScissorConfig, Context as ScissorContext } from "./scissor";
import { RenderFn } from "./RenderFn";

export type Config = FenceConfig & FlushConfig & ScissorConfig;
export type Context = AnimationFrameContext & ScissorContext;

export function createRenderFunc(config: Config, render: RenderFn): (ctx: Context) => void {
    const animationFrame = new AnimationFrameManager();
    const fence = new FenceManager(config);
    const scissor = new ScissorManager(config);
    const flush = new FlushManager(config);

    return function(ctx: Context) {
        scissor.onRequest(ctx);
        animationFrame.wrap(ctx, () => {
            fence.wrap(() => {
                scissor.wrap(() => {
                    flush.wrap(render);
                });
            });
        });
    }
}