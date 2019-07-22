import * as THREE from "three";
import StylusCanvas from "stylus-canvas";
import ThreeCanvas from "../pkg";

async function main() {
    console.log(StylusCanvas);
    await customElements.whenDefined("stylus-canvas");

    const canvas = document.querySelector("stylus-canvas");
    canvas.width = 400;
    canvas.height = 400;
    const tc = new ThreeCanvas(canvas);

    const material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
    const geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3( -10, 0, 0) );
    geometry.vertices.push(new THREE.Vector3( 0, 10, 0) );
    geometry.vertices.push(new THREE.Vector3( 10, 0, 0) );

    const line = new THREE.Line( geometry, material );

    tc.scene.add(line);

    tc.setCameraBounds(-10, -10, 20, 20);

    tc.render();
}

main();