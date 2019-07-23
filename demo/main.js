import * as THREE from "three";
import StylusCanvas from "stylus-canvas";
import ThreeCanvas from "../pkg";

const LEFT = -9;
const RIGHT = 9;
const TOP = -9;
const BOTTOM = 9;

async function main() {
    console.log(StylusCanvas);
    await customElements.whenDefined("stylus-canvas");

    const canvas = document.querySelector("stylus-canvas");
    canvas.width = 400;
    canvas.height = 400;
    const tc = new ThreeCanvas(canvas);

    const material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
    const geometry = new THREE.Geometry();

    geometry.vertices.push(new THREE.Vector3( LEFT, 0, 0) );
    geometry.vertices.push(new THREE.Vector3( 0, BOTTOM, 0) );
    geometry.vertices.push(new THREE.Vector3( RIGHT, 0, 0) );

    const line = new THREE.Line( geometry, material );
    tc.scene.add(line);

    tc.setCameraBounds(-10, -10, 20, 20);

    tc.render();

    await sleep(500);
    console.log("re-rendering");

    const geometry2 = new THREE.Geometry();
    geometry2.vertices.push(new THREE.Vector3( RIGHT, 0, 0) );
    geometry2.vertices.push(new THREE.Vector3( 0, TOP, 0) );
    geometry2.vertices.push(new THREE.Vector3( LEFT, 0, 0) );

    const line2 = new THREE.Line( geometry2, material );
    tc.scene.add(line2);

    const INCR = 5;
    for(let i = INCR; i <= 200; i += INCR) {
        tc.renderWithScissor({
            x: i-INCR,
            y: 200,
            width: INCR,
            height: 200,
        });
        console.log(i-INCR, i);
        await sleep(200);
    }
}

function sleep(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
    });
}

main();