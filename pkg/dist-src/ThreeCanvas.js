import * as THREE from 'three';
import Rectangle from './geometry/Rectangle.js';
export default class ThreeCanvas {
    constructor(canvas) {
        this.canvas = canvas;
        this.gl = canvas.getContext('webgl2', {
            alpha: false,
            desynchronized: true,
            preserveDrawingBuffer: true,
        });
        this.renderer = createRenderer(this.gl, canvas.width, canvas.height);
        this.scene = createScene();
        this.camera = createCamera(-1, -1, 2, 2, 0);
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
        const { rotation, clientWidth, clientHeight } = this.canvas;
        const rect = rotateScissorRect(screenRect, clientWidth, clientHeight, rotation);
        this.renderer.setScissorTest(true);
        this.renderer.setScissor(rect.min.x, rect.min.y, rect.width, rect.height);
        this.render();
        this.renderer.setScissorTest(false);
    }
    render() {
        this.renderer.render(this.scene, this.camera);
        // Must call flush ourselves when using desynchronized
        this.gl.flush();
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
export function createCamera(x, y, width, height, rotation) {
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
function rotateScissorRect(scissorRect, clientWidth, clientHeight, rotation) {
    const radians = -rotation * Math.PI / 180;
    let rect = Rectangle.fromDimensions(scissorRect.width, scissorRect.height)
        .shift({
        x: scissorRect.x,
        y: scissorRect.y,
    });
    switch (rotation) {
        case 0:
            return rect;
        case 90:
            return rect
                .rotate(-rotation * Math.PI / 180)
                .shift({ x: 0, y: clientWidth });
        case 180:
            return rect
                .rotate(-rotation * Math.PI / 180)
                .shift({ x: clientWidth, y: clientHeight });
        case 270:
            return rect
                .rotate(-rotation * Math.PI / 180)
                .shift({ x: clientHeight, y: 0 });
    }
    throw new Error(`unsupported rotation: ${rotation}`);
}
function rotateDimensions(width, height, rotation) {
    if (rotation == 90 || rotation == 270) {
        return [height, width];
    }
    return [width, height];
}
