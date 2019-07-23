import { Matrix4 } from "three";
export interface IPointState {
    x: number;
    y: number;
}
export default class Point implements IPointState {
    x: number;
    y: number;
    constructor(state: IPointState);
    min(p: IPointState): Point;
    max(p: IPointState): Point;
    sub(p: IPointState): Point;
    add(p: IPointState): Point;
    scale(factor: number): Point;
    multiplyMatrix4(matrix: Matrix4): IPointState;
    toString(): string;
    private apply;
    rotate(radians: number): Point;
}
