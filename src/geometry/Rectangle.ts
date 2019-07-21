import Point, { IPointState } from './Point';

export interface IRectangleState {
  min: IPointState;
  max: IPointState;
}

export default class Rectangle implements IRectangleState {
  public min: Point;
  public max: Point;

  constructor(state: IRectangleState) {
    this.min = new Point(state.min);
    this.max = new Point(state.max);
  }

  toString(): string {
    return `R(${this.min.toString()}, ${this.max.toString()})`;
  }

  static fromPoint(point: IPointState): Rectangle {
    return new Rectangle({
      min: point,
      max: point,
    });
  }

  static fromPoints(points: IPointState[]): Rectangle {
    let min: Point, max: Point;
    min = max = new Point(points[0]);
    for (var i = 1; i < points.length; i++) {
      min = min.min(points[i]);
      max = max.max(points[i]);
    }
    return new Rectangle({ min, max });
  }

  static fromDimensions(width: number, height: number): Rectangle {
    return new Rectangle({
      min: { x: 0, y: 0 },
      max: { x: width, y: height },
    });
  }

  get width(): number {
    return this.max.x - this.min.x;
  }
  get height(): number {
    return this.max.y - this.min.y;
  }
  get center(): Point {
    return new Point({
      x: (this.width / 2) + this.min.x,
      y: (this.height / 2) + this.min.y,
    });
  }

  public union(r: IRectangleState): Rectangle {
    return new Rectangle({
      min: this.min.min(r.min),
      max: this.max.max(r.max),
    });
  }

  public addPoint(p: IPointState): Rectangle {
    return new Rectangle({
      min: this.min.min(p),
      max: this.max.max(p),
    });
  }

  public expand(p: IPointState): Rectangle {
    return new Rectangle({
      min: this.min.sub(p),
      max: this.max.add(p),
    });
  }

  public rotate(radians: number): Rectangle {
    const min = this.min.rotate(radians);
    const max = this.max.rotate(radians);
    return new Rectangle({
      min: min.min(max),
      max: min.max(max),
    });
  }

  public shift(p: IPointState): Rectangle {
    return new Rectangle({
      min: this.min.add(p),
      max: this.max.add(p),
    });
  }
}
