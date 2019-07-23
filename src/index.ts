import StylusCanvas from 'stylus-canvas';
import ThreeCanvas from './ThreeCanvas.js';

export default ThreeCanvas;

export async function createThreeCanvas(canvas: StylusCanvas): Promise<ThreeCanvas> {
  await customElements.whenDefined("stylus-canvas");
  await canvas.updateComplete;
  return new ThreeCanvas(canvas);
}