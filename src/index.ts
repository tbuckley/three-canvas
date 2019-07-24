import StylusCanvas from 'stylus-canvas';
import ThreeCanvas, { ThreeCanvasOptions } from './ThreeCanvas.js';

export default ThreeCanvas;

export async function createThreeCanvas(canvas: StylusCanvas, options?: Partial<ThreeCanvasOptions>): Promise<ThreeCanvas> {
  await customElements.whenDefined("stylus-canvas");
  await canvas.updateComplete;
  return new ThreeCanvas(canvas, options);
}