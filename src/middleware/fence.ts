import { Middleware, Context as MWContext } from "./middleware";

export interface Context extends MWContext {
    gl?: WebGL2RenderingContext;
    logDroppedFrame?: () => void;
}

export default function fence(gl: WebGL2RenderingContext, numFences: number, logDroppedFrame?: () => void): Middleware {
    const fences: (WebGLSync | undefined | null)[] = new Array(numFences);
    let currentFence = 0;
    return {
        onRequest(ctx: Context): Context {
            return ctx;
        },
        wrap(render) {
            const fence = fences[currentFence];
            if(fence && gl.getSyncParameter(fence, gl.SYNC_STATUS) === gl.UNSIGNALED) {
                if(logDroppedFrame) {
                    logDroppedFrame();
                }
                return;
            }
            render();
            fences[currentFence] = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
            currentFence = (currentFence + 1) % fences.length;
        },
    };
}