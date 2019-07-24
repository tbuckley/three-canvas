import * as THREE from "three";
import StylusCanvas from "stylus-canvas";
import { createThreeCanvas } from "../pkg";

const LEFT = -9;
const RIGHT = 9;
const TOP = -9;
const BOTTOM = 9;

async function main() {
    console.log(StylusCanvas);

    const canvas = document.querySelector("stylus-canvas");
    canvas.width = 400;
    canvas.height = 400;

    const tc = await createThreeCanvas(canvas);
    tc.setCameraBounds(-10, -10, 20, 20);

    const material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
    const geometry = new THREE.Geometry();

    geometry.vertices.push(new THREE.Vector3( LEFT, 0, 0) );
    geometry.vertices.push(new THREE.Vector3( 0, BOTTOM, 0) );
    geometry.vertices.push(new THREE.Vector3( RIGHT, 0, 0) );

    const line = new THREE.Line( geometry, material );
    tc.scene.add(line);

    tc.render();

    const geometry2 = new THREE.Geometry();
    geometry2.vertices.push(new THREE.Vector3( RIGHT, 0, 0) );
    geometry2.vertices.push(new THREE.Vector3( 0, TOP, 0) );
    geometry2.vertices.push(new THREE.Vector3( LEFT, 0, 0) );

    const line2 = new THREE.Line( geometry2, material );
    tc.scene.add(line2);

    draw(tc);
    log();
}

async function draw(tc) {
    const INCR = 1;
    for(let position = INCR; position <= 400; position += INCR) {
        await sleep(1);
        tc.renderWithScissor({
            x: position-INCR,
            y: 200,
            width: INCR+1,
            height: 200,
        });
    }
    console.log("done w/ draw!");
}

async function log() {
    const INCR = 1;
    for(let position = INCR; position <= 400; position += INCR) {
        await sleep(1);
    }
    console.log("done w/ log!");
}

function sleep(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
    });
}

main();