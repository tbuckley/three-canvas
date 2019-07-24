export default class FenceManager {
    constructor(numFences) {
        console.assert(numFences > 0);
        this.fences = new Array(numFences);
        this.currentFence = 0;
    }
    drawWithFence(gl, drawFn) {
        let fence = this.fences[this.currentFence];
        if (fence && gl.getSyncParameter(fence, gl.SYNC_STATUS) === gl.UNSIGNALED) {
            console.log("dropped frame");
            return;
        }
        drawFn();
        this.fences[this.currentFence] = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        this.currentFence = (this.currentFence + 1) % this.fences.length;
    }
}
