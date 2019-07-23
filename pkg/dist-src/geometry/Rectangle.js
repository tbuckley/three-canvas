import Point from './Point.js';
export default class Rectangle {
    constructor(state) {
        this.min = new Point(state.min);
        this.max = new Point(state.max);
    }
    toString() {
        return `R(${this.min.toString()}, ${this.max.toString()})`;
    }
    static fromPoint(point) {
        return new Rectangle({
            min: point,
            max: point,
        });
    }
    static fromPoints(points) {
        let min, max;
        min = max = new Point(points[0]);
        for (var i = 1; i < points.length; i++) {
            min = min.min(points[i]);
            max = max.max(points[i]);
        }
        return new Rectangle({ min, max });
    }
    static fromDimensions(width, height) {
        return new Rectangle({
            min: { x: 0, y: 0 },
            max: { x: width, y: height },
        });
    }
    get width() {
        return this.max.x - this.min.x;
    }
    get height() {
        return this.max.y - this.min.y;
    }
    get center() {
        return new Point({
            x: (this.width / 2) + this.min.x,
            y: (this.height / 2) + this.min.y,
        });
    }
    union(r) {
        return new Rectangle({
            min: this.min.min(r.min),
            max: this.max.max(r.max),
        });
    }
    addPoint(p) {
        return new Rectangle({
            min: this.min.min(p),
            max: this.max.max(p),
        });
    }
    expand(p) {
        return new Rectangle({
            min: this.min.sub(p),
            max: this.max.add(p),
        });
    }
    rotate(radians) {
        const min = this.min.rotate(radians);
        const max = this.max.rotate(radians);
        return new Rectangle({
            min: min.min(max),
            max: min.max(max),
        });
    }
    shift(p) {
        return new Rectangle({
            min: this.min.add(p),
            max: this.max.add(p),
        });
    }
}
