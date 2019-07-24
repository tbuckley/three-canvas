import Rectangle from './geometry/Rectangle.js';
export interface ScissorRect {
    x: number;
    y: number;
    width: number;
    height: number;
}
export declare type RenderRequest = {
    type: "none";
} | {
    type: "scissor";
    area: Rectangle;
} | {
    type: "full";
};
export declare class RenderRequestManager {
    request: RenderRequest;
    constructor();
    reset(): void;
    render(): void;
    renderWithScissor(scissorRect: ScissorRect): void;
    getRotated(clientWidth: number, clientHeight: number, rotation: number): Rectangle | null;
}
