import * as THREE from 'three';
import FenceManager from './FenceManager.js';
import { RenderRequestManager } from './ScissorRect.js';
const DEFAULT_OPTIONS = {
    numFences: 2,
    alpha: false,
};
export default class ThreeCanvas {
    constructor(canvas, options) {
        let fullOptions = DEFAULT_OPTIONS;
        if (options) {
            fullOptions = { ...fullOptions, ...options };
        }
        this.canvas = canvas;
        this.fenceManager = new FenceManager(fullOptions.numFences);
        this.renderRequestManager = new RenderRequestManager();
        this.gl = canvas.getContext('webgl2', {
            alpha: fullOptions.alpha,
            desynchronized: true,
            preserveDrawingBuffer: true,
        });
        this.renderer = createRenderer(this.gl, canvas.width, canvas.height);
        this.scene = createScene();
        this.camera = createCamera(-1, -1, 2, 2, canvas.rotation);
        canvas.addEventListener('canvas-rotate', () => {
            // Rotate the camera
            const { rotation } = this.canvas;
            this.camera.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), rotation * Math.PI / 180);
            // Inform the renderer
            const [width, height] = rotateDimensions(this.canvas.width, this.canvas.height, rotation);
            this.renderer.setSize(width, height);
        });
    }
    renderWithScissor(screenRect) {
        this.renderRequestManager.renderWithScissor(screenRect);
        this.fenceManager.drawWithFence(this.gl, () => {
            this.renderInternal();
        });
    }
    render() {
        this.renderRequestManager.render();
        this.fenceManager.drawWithFence(this.gl, () => {
            this.renderInternal();
        });
    }
    renderInternal() {
        if (this.renderRequestManager.request.type == "scissor") {
            const { rotation, clientWidth, clientHeight } = this.canvas;
            const rect = this.renderRequestManager.getRotated(clientWidth, clientHeight, rotation);
            this.renderer.setScissorTest(true);
            this.renderer.setScissor(rect.min.x, rect.min.y, rect.width, rect.height);
        }
        else {
            this.renderer.setScissorTest(false);
        }
        this.renderer.render(this.scene, this.camera);
        // Must call flush ourselves when using desynchronized
        this.gl.flush();
        this.renderRequestManager.reset();
    }
    setCameraBounds(x, y, width, height) {
        const { rotation } = this.canvas;
        this.camera = createCamera(x, y, width, height, rotation);
    }
}
function createRenderer(gl, width, height) {
    const renderer = new THREE.WebGLRenderer({
        canvas: gl.canvas,
        context: gl,
        alpha: false,
        clearColor: 0x000000,
    }); // TODO why isn't clearColor recognized?
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.autoClear = false;
    return renderer;
}
function createScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    return scene;
}
function createCamera(x, y, width, height, rotation) {
    // Rotate width/height if needed
    if (rotation == 90 || rotation == 270) {
        [height, width] = [width, height];
    }
    const center = {
        x: x + (width / 2),
        y: y + (height / 2),
    };
    // Create the new camera
    const camera = new THREE.OrthographicCamera(-width / 2, width / 2, -height / 2, height / 2);
    camera.position.set(center.x, center.y, 100);
    camera.lookAt(new THREE.Vector3(center.x, center.y, 0));
    camera.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), rotation * Math.PI / 180);
    return camera;
}
function rotateDimensions(width, height, rotation) {
    if (rotation == 90 || rotation == 270) {
        return [height, width];
    }
    return [width, height];
}
