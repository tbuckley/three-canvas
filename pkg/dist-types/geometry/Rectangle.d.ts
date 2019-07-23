import Point, { IPointState } from './Point.js';
export interface IRectangleState {
    min: IPointState;
    max: IPointState;
}
export default class Rectangle implements IRectangleState {
    min: Point;
    max: Point;
    constructor(state: IRectangleState);
    toString(): string;
    static fromPoint(point: IPointState): Rectangle;
    static fromPoints(points: IPointState[]): Rectangle;
    static fromDimensions(width: number, height: number): Rectangle;
    readonly width: number;
    readonly height: number;
    readonly center: Point;
    union(r: IRectangleState): Rectangle;
    addPoint(p: IPointState): Rectangle;
    expand(p: IPointState): Rectangle;
    rotate(radians: number): Rectangle;
    shift(p: IPointState): Rectangle;
}
