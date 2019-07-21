import { Vector3, Matrix4 } from "three";

export interface IPointState {
  x: number;
  y: number;
}

export default class Point implements IPointState {
  public x: number;
  public y: number;

  constructor(state: IPointState) {
    this.x = state.x;
    this.y = state.y;
  }

  public min(p: IPointState): Point {
    return this.apply(p, Math.min);
  }
  public max(p: IPointState): Point {
    return this.apply(p, Math.max);
  }
  public sub(p: IPointState): Point {
    return this.apply(p, (a, b) => a - b);
  }
  public add(p: IPointState): Point {
    return this.apply(p, (a, b) => a + b);
  }
  public scale(factor: number): Point {
    return new Point({
      x: this.x * factor,
      y: this.y * factor,
    });
  }

  multiplyMatrix4(matrix: Matrix4): IPointState {
    let vec = new Vector3(this.x, this.y, 0);
    return vec.applyMatrix4(matrix);
  }

  toString(): string {
    return `P(${Math.round(this.x)}, ${Math.round(this.y)})`;
  }

  private apply(p: IPointState, fn: (a: number, b: number) => number): Point {
    return new Point({
      x: fn(this.x, p.x),
      y: fn(this.y, p.y),
    });
  }

  public rotate(radians: number): Point {
    return new Point({
      x: this.x * Math.cos(radians) - this.y * Math.sin(radians),
      y: this.x * Math.sin(radians) + this.y * Math.cos(radians),
    });
  }
}
