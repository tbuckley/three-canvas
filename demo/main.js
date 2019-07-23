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

    const INCR = 5;
    let position = INCR;
    function draw() {
        tc.renderWithScissor({
            x: position-INCR,
            y: 200,
            width: INCR+1,
            height: 200,
        });
        if(position <= 400) {
            position += INCR;
            requestAnimationFrame(draw);
        }
    }
    requestAnimationFrame(draw);
}

main();