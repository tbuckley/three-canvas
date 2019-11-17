import { ScissorFunc } from "../createRenderFunc/scissor";
import { WebGLRenderer } from "three";

export default function scissor(renderer: WebGLRenderer): ScissorFunc {
    return function(rect, render) {
        console.log("scissor", rect);
        renderer.setScissorTest(true);
        renderer.setScissor(rect.x, rect.y, rect.width, rect.height);
        render();
        renderer.setScissorTest(false);
    }
}