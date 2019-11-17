export default class RotationManager {
    angle: number;
    canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.angle = screen.orientation.angle;

        screen.orientation.addEventListener("change", () => this.handleOrientationChange());
    }

    handleOrientationChange() {
        this.angle = screen.orientation.angle;
        this.canvas.style.transform = `rotate(-${this.angle}deg)`;
        // TODO resize
    }
}

// Inform the renderer
// const [width, height] = rotateDimensions(this.canvas.width, this.canvas.height, rotation);
// this.renderer.setSize(width, height);
// function rotateDimensions(width: number, height: number, rotation: number): [number, number] {
//   if(rotation == 90 || rotation == 270) {
//     return [height, width];
//   }
//   return [width, height];
// }