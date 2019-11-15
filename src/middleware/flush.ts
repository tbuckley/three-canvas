import { Middleware } from "./middleware";

export default function flush(gl: WebGL2RenderingContext): Middleware {
    return {
        onRequest(ctx) {
            return ctx;
        },
        wrap(render) {
            render();
            gl.flush();
        },
    };
}