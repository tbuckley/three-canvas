import * as THREE from "three";
import { createRenderer, getContext, createCamera, createThreeConfig } from "../src/threejs";
import createRenderFunc from "../src/createRenderFunc";
import { Context } from "../src/createRenderFunc";
import { Scene, Material } from "three";
import Line from "./stroke/Line";

import { SVGRenderer } from "three/examples/jsm/renderers/SVGRenderer";

const LEFT = -9;
const RIGHT = 9;
const TOP = -9;
const BOTTOM = 9;

class SceneManager {
    render: (ctx: Context) => Promise<void>;

    constructor(canvas: HTMLCanvasElement) {
        const gl = getContext(canvas, false);
        const renderer = createRenderer(gl, false);
        const scene = new Scene();
        scene.background = new THREE.Color(0xffffff);
        const camera = createCamera(0, 0, 400, 400);

        renderer.setSize(400, 400);
        renderer.setPixelRatio(window.devicePixelRatio);

        this.render = createRenderFunc(createThreeConfig({
            gl,
            renderer,
            numFences: 5,
        }), () => {
            renderer.render(scene, camera);
        });

        this.render({});

        const svgRenderer = new SVGRenderer();
        svgRenderer.setSize(400, 400);

        const pointers: {[id: number]: Line} = {};
        const material = new THREE.LineBasicMaterial({color: 0x000000});
        canvas.addEventListener("pointerdown", (e: PointerEvent) => {
            const line = new Line();
            const point = {x: e.offsetX, y: e.offsetY};
            line.extend(new THREE.Vector2(point.x, point.y));
            pointers[e.pointerId] = line;
            scene.add(line.element);
        });
        canvas.addEventListener("pointermove", (e: PointerEvent) => {
            if(e.pointerId in pointers) {
                const point = {x: e.offsetX, y: e.offsetY};
                const lastPoint = pointers[e.pointerId].lastPoint;
                pointers[e.pointerId].extend(new THREE.Vector2(point.x, point.y));
                this.render({
                    rect: {
                        x: Math.min(point.x, lastPoint.x) - 2,
                        y: canvas.height / devicePixelRatio - Math.max(point.y, lastPoint.y) - 2,
                        width: Math.abs(point.x - lastPoint.x) + 4,
                        height: Math.abs(point.y - lastPoint.y) + 4,
                    },
                    immediate: true,
                });
            }
        });
        canvas.addEventListener("pointerup", (e: PointerEvent) => {
            delete pointers[e.pointerId];
            svgRenderer.render(scene, camera);
            document.body.appendChild(svgRenderer.domElement);
        });
        canvas.addEventListener("contextmenu", (e) => {
            e.preventDefault();
        });
        canvas.addEventListener("dragstart", (e) => {
            e.preventDefault();
        });
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