import StylusCanvas from 'stylus-canvas';
import * as THREE from 'three';
export interface ScissorRect {
    x: number;
    y: number;
    width: number;
    height: number;
}
export default class ThreeCanvas {
    private gl;
    private renderer;
    private canvas;
    scene: THREE.Scene;
    camera: THREE.Camera;
    constructor(canvas: StylusCanvas);
    renderWithScissor(screenRect: ScissorRect): void;
    render(): void;
    setCameraBounds(x: number, y: number, width: number, height: number): void;
}
export declare function createCamera(x: number, y: number, width: number, height: number, rotation: number): THREE.OrthographicCamera;
