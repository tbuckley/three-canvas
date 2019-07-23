import { Vector3 } from "three";
export default class Point {
    constructor(state) {
        this.x = state.x;
        this.y = state.y;
    }
    min(p) {
        return this.apply(p, Math.min);
    }
    max(p) {
        return this.apply(p, Math.max);
    }
    sub(p) {
        return this.apply(p, (a, b) => a - b);
    }
    add(p) {
        return this.apply(p, (a, b) => a + b);
    }
    scale(factor) {
        return new Point({
            x: this.x * factor,
            y: this.y * factor,
        });
    }
    multiplyMatrix4(matrix) {
        let vec = new Vector3(this.x, this.y, 0);
        return vec.applyMatrix4(matrix);
    }
    toString() {
        return `P(${Math.round(this.x)}, ${Math.round(this.y)})`;
    }
    apply(p, fn) {
        return new Point({
            x: fn(this.x, p.x),
            y: fn(this.y, p.y),
        });
    }
    rotate(radians) {
        return new Point({
            x: this.x * Math.cos(radians) - this.y * Math.sin(radians),
            y: this.x * Math.sin(radians) + this.y * Math.cos(radians),
        });
    }
}
