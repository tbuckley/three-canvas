import * as THREE from "three";
import { createRenderer, getContext, createCamera, createThreeConfig } from "../src/threejs";
import createRenderFunc from "../src/createRenderFunc";
import { Context } from "../src/createRenderFunc";
import { Scene } from "three";

const LEFT = -9;
const RIGHT = 9;
const TOP = -9;
const BOTTOM = 9;

function loadScene1(scene: Scene) {
    const material = new THREE.LineBasicMaterial( { color: 0xffff00 } );
    const geometry = new THREE.Geometry();

    geometry.vertices.push(new THREE.Vector3( LEFT, 0, 0) );
    geometry.vertices.push(new THREE.Vector3( 0, BOTTOM, 0) );
    geometry.vertices.push(new THREE.Vector3( RIGHT, 0, 0) );

    const line = new THREE.Line( geometry, material );
    scene.add(line);
}
function loadScene2(scene: Scene) {
    const material = new THREE.LineBasicMaterial( { color: 0xffff00 } );
    const geometry = new THREE.Geometry();

    geometry.vertices.push(new THREE.Vector3( RIGHT, 0, 0) );
    geometry.vertices.push(new THREE.Vector3( 0, TOP, 0) );
    geometry.vertices.push(new THREE.Vector3( LEFT, 0, 0) );

    const line = new THREE.Line( geometry, material );
    scene.add(line);
}

class SceneManager {
    render: (ctx: Context) => Promise<void>;

    constructor(canvas: HTMLCanvasElement) {
        const gl = getContext(canvas, true);
        const renderer = createRenderer(gl, true);
        const scene = new Scene();
        const camera = createCamera(-10, -10, 20, 20);

        renderer.setSize(400, 400);
        renderer.setPixelRatio(window.devicePixelRatio);

        this.render = createRenderFunc(createThreeConfig({
            gl,
            renderer,
            numFences: 5,
        }), () => {
            renderer.render(scene, camera);
        });

        loadScene1(scene);
        this.render({immediate: true});

        loadScene2(scene);
        this.draw();
    }

    async draw() {
        const INCR = 1;
        for(let position = INCR; position <= 400; position += INCR) {
            await sleep(1);
            this.render({
                rect: {
                    x: position-INCR,
                    y: 200,
                    width: INCR+1,
                    height: 200,
                },
                immediate: true,
            });
        }
        console.log("done w/ draw!");
    }
}

function sleep(ms: number) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
    });
}

const canvas = document.querySelector("canvas") as HTMLCanvasElement;
canvas.width = 400;
canvas.height = 400;
const manager = new SceneManager(canvas);