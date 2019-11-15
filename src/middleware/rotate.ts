import { Middleware, Context as MWContext } from "./middleware";
import { Vector3, Quaternion, OrthographicCamera } from "three";

const Z_AXIS = new Vector3(0, 0, 1);

interface MemoizedResult {
    camera: OrthographicCamera,
    angle: number,
    outputCamera: OrthographicCamera,
}
function getCamera(camera: OrthographicCamera, angle: number): OrthographicCamera {
    if(angle === 0) {
        return camera;
    }

    const newCamera = camera.clone(true);
    
    // Rotate camera
    const rotation =new Quaternion();
    rotation.setFromAxisAngle(Z_AXIS, angle * Math.PI / 180);
    newCamera.applyQuaternion(rotation);

    // Change bounds if needed
    if(angle === 90 || angle === 270) {
        newCamera.left = camera.top;
        newCamera.right = camera.bottom;
        newCamera.top = camera.left;
        newCamera.bottom = camera.right;
    }

    return camera;
}

function getCameraMemoized(memoized: MemoizedResult | null, camera: OrthographicCamera, angle: number): MemoizedResult {
    if(memoized && memoized.camera === camera && memoized.angle === angle) {
        return memoized;
    }
    
    const outputCamera = getCamera(camera, angle);
    return {
        camera: camera,
        angle,
        outputCamera,
    };
}

export interface Context extends MWContext {
    angle?: number;
}

export default function rotate(canvas: HTMLElement): Middleware {
    let angle = screen.orientation.angle;
    let memoized: MemoizedResult | null = null;

    screen.orientation.addEventListener("change", () => {
        angle = screen.orientation.angle;
        canvas.style.transform = `rotate(-${angle}deg)`;
    });

    return {
        onRequest(ctx: Context) {
            memoized = getCameraMemoized(memoized, ctx.camera, angle);
            ctx.camera = memoized.outputCamera;
            ctx.angle = angle;
            return ctx;
        },
        wrap() {},
    };
}