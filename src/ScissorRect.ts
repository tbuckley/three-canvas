import Rectangle from './geometry/Rectangle.js';

export interface ScissorRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type RenderRequest =
  | {type: "none"}
  | {type: "scissor", area: Rectangle}
  | {type: "full"};

const REQUEST_NONE: RenderRequest = {type: "none"};
const REQUEST_FULL: RenderRequest = {type: "full"};

export class RenderRequestManager {
  request: RenderRequest;

  constructor() {
    this.request = REQUEST_NONE;
  }

  reset() {
    this.request = REQUEST_NONE;
  }

  render() {
    this.request = REQUEST_FULL;
  }

  renderWithScissor(scissorRect: ScissorRect) {
    if(this.request.type == "none") {
      this.request = {
        type: "scissor",
        area: scissorRectToRect(scissorRect),
      };
    } else if(this.request.type == "scissor") {
      const currentArea = this.request.area;
      const newArea = scissorRectToRect(scissorRect);
      this.request = {
        type: "scissor",
        area: currentArea.union(newArea)
      };
    }
    // Do nothing if it's already full
  }

  getRotated(clientWidth: number, clientHeight: number, rotation: number): Rectangle | null {
    if(this.request.type == "scissor") {
      return rotateScissorRect(this.request.area, clientWidth, clientHeight, rotation);
    }
    return null;
  }
}

function scissorRectToRect(scissorRect: ScissorRect): Rectangle {
  let rect = Rectangle.fromDimensions(scissorRect.width, scissorRect.height);
  return rect.shift({
    x: scissorRect.x,
    y: scissorRect.y,
  });
}

function rotateScissorRect(rect: Rectangle, clientWidth: number, clientHeight: number, rotation: number): Rectangle {
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