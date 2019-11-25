import * as THREE from 'three';

const MAX_POINTS = 150;
const POINT_CHANNELS = 3;
const MATERIAL = new THREE.LineBasicMaterial({ color: 0x000000 });

function getGeometry(line: THREE.Line): THREE.BufferGeometry {
    return line.geometry as THREE.BufferGeometry;
}
function getPosition(line: THREE.Line): THREE.BufferAttribute {
    return getGeometry(line).attributes.position as THREE.BufferAttribute;
}
function getPositionArray(line: THREE.Line): Float32Array {
    return getPosition(line).array as Float32Array;
}
function getNumPoints(line: THREE.Line): number {
    return getGeometry(line).drawRange.count;
}
function setNeedsUpdate(line: THREE.Line) {
    getPosition(line).needsUpdate = true;
}
function setPoint(arr: Float32Array, index: number, {x, y}: THREE.Vector2) {
    arr[index * POINT_CHANNELS + 0] = x;
    arr[index * POINT_CHANNELS + 1] = y;
    arr[index * POINT_CHANNELS + 2] = 0;
}
function getPoint(arr: Float32Array, index: number): THREE.Vector2 {
    const x = arr[index * POINT_CHANNELS + 0];
    const y = arr[index * POINT_CHANNELS + 1];
    return new THREE.Vector2(x, y);
}
function incrementDrawRange(line: THREE.Line) {
    const geometry = getGeometry(line);
    const drawRange = geometry.drawRange;
    geometry.setDrawRange(drawRange.start, drawRange.count + 1);
}

export default class Fragment {
    private line: THREE.Line;

    constructor() {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(POINT_CHANNELS * MAX_POINTS);
        geometry.addAttribute('position', new THREE.BufferAttribute(positions, POINT_CHANNELS));
        geometry.setDrawRange(0, 0);

        this.line = new THREE.Line(geometry, MATERIAL);
    }

    get element(): THREE.Object3D {
        return this.line;
    }

    extend(point: THREE.Vector2) {
        console.assert(!this.isFull);

        // Add the point
        const arr = getPositionArray(this.line);
        const i = getNumPoints(this.line);
        setPoint(arr, i, point);

        // Tell it about the new point
        incrementDrawRange(this.line);
        setNeedsUpdate(this.line);
    }

    clear() {
        const geometry = getGeometry(this.line);
        geometry.setDrawRange(geometry.drawRange.start, 0);
        setNeedsUpdate(this.line);
    }

    get isFull(): boolean {
        return getNumPoints(this.line) === MAX_POINTS;
    }

    get lastPoint(): THREE.Vector2 {
        const positionArray = getPositionArray(this.line);
        const lastIndex = getNumPoints(this.line) - 1;
        return getPoint(positionArray, lastIndex);
    }
}