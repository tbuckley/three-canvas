import ThreeCanvas from './ThreeCanvas.js';
export default ThreeCanvas;
export async function createThreeCanvas(canvas) {
    await customElements.whenDefined("stylus-canvas");
    await canvas.updateComplete;
    return new ThreeCanvas(canvas);
}
