export default function panelOrientation(canvas: HTMLElement) {
    let angle = screen.orientation.angle;

    screen.orientation.addEventListener("change", () => {
        angle = screen.orientation.angle;
        canvas.style.transform = `rotate(-${angle}deg)`;
        // TODO resize
    });
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