import * as THREE from "three";
import { createRenderer, getContext, createScene, createCamera, createThreeConfig } from "../src/threejs";
import { createRenderFunc } from "../src/createRenderFunc";
import { Context } from "../src/createRenderFunc/scissor";
import { Scene } from "three";

const LEFT = -9;
const RIGHT = 9;
const TOP = -9;
const BOTTOM = 9;

function loadScene1(scene: Scene) {
    const material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
    const geometry = new THREE.Geometry();

    geometry.vertices.push(new THREE.Vector3( LEFT, 0, 0) );
    geometry.vertices.push(new THREE.Vector3( 0, BOTTOM, 0) );
    geometry.vertices.push(new THREE.Vector3( RIGHT, 0, 0) );

    const line = new THREE.Line( geometry, material );
    scene.add(line);
}
function loadScene2(scene: Scene) {
    const material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
    const geometry = new THREE.Geometry();

    geometry.vertices.push(new THREE.Vector3( RIGHT, 0, 0) );
    geometry.vertices.push(new THREE.Vector3( 0, TOP, 0) );
    geometry.vertices.push(new THREE.Vector3( LEFT, 0, 0) );

    const line = new THREE.Line( geometry, material );
    scene.add(line);
}

class SceneManager {
    render: (ctx: Context) => void;

    constructor(canvas: HTMLCanvasElement) {
        const gl = getContext(canvas, false);
        const renderer = createRenderer(gl, false);
        const scene = createScene();
        const camera = createCamera(-10, -10, 20, 20);

        renderer.setSize(500, 300);
        renderer.setPixelRatio(window.devicePixelRatio);

        // this.render = createRenderFunc(createThreeConfig({
        //     gl,
        //     renderer,
        // }), () => {
        //     renderer.render(scene, camera);
        // });
        this.render = (ctx: any) => {
            console.log("render!");
            renderer.render(scene, camera);
        };
        // renderer.render(scene, camera);
        // renderer.setClearColor(new THREE.Color(255,0,0));
        // renderer.clearColor();
        console.log(gl.getError());
        gl.clearColor(0, 1.0, 1.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.flush();
        gl.clearColor(0, 1.0, 1.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.flush();
        gl.clearColor(0, 1.0, 1.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.flush();
        gl.clearColor(0, 1.0, 1.0, 0.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.flush();
        console.log(gl.getError(), gl.getContextAttributes());
        console.log("cleared to red");

        // loadScene1(scene);
        // this.render({});

        // loadScene2(scene);
        // this.draw();
        // log();
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
            });
        }
        console.log("done w/ draw!");
    }
}

async function log() {
    const INCR = 1;
    for(let position = INCR; position <= 400; position += INCR) {
        await sleep(1);
    }
    console.log("done w/ log!");
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