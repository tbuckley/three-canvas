import { Middleware } from "./middleware";

export default function animationFrame(): Middleware {
    let requested = false;
    return {
        onRequest(ctx) {
            return ctx;
        },
        wrap(render) {
            if(!requested) {
                requested = true;
                requestAnimationFrame(() => {
                    render();
                    requested = false;
                });
            }
        }
    }
}