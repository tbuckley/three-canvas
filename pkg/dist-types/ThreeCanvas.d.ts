import StylusCanvas from 'stylus-canvas';
import * as THREE from 'three';
import { ScissorRect } from './ScissorRect.js';
export interface ThreeCanvasOptions {
    numFences: number;
    alpha: boolean;
}
export default class ThreeCanvas {
    private gl;
    private renderer;
    private canvas;
    private fenceManager;
    private renderRequestManager;
    scene: THREE.Scene;
    camera: THREE.Camera;
    constructor(canvas: StylusCanvas, options?: Partial<ThreeCanvasOptions>);
    renderWithScissor(screenRect: ScissorRect): void;
    render(): void;
    private renderInternal;
    setCameraBounds(x: number, y: number, width: number, height: number): void;
}
