import { Vector3, Quaternion, OrthographicCamera } from "three";

const Z_AXIS = new Vector3(0, 0, 1);

interface MemoizedResult {
    camera: OrthographicCamera,
    angle: number,
    outputCamera: OrthographicCamera,
}

function getRotatedCamera(camera: OrthographicCamera, angle: number): OrthographicCamera {
    if(angle === 0) {
        return camera;
    }

    const newCamera = camera.clone(true);
    
    // Rotate camera
    const rotation = new Quaternion();
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

export type CameraFunc = (camera: OrthographicCamera, angle: number) => OrthographicCamera;

export function createCameraFunc(): CameraFunc {
    let memoized: MemoizedResult | null = null;
    return function(camera, angle) {
        if(!memoized || memoized.camera !== camera || memoized.angle !== angle) {
            const outputCamera = getRotatedCamera(camera, angle);
            memoized = {
                camera: camera,
                angle,
                outputCamera,
            };
        }
        return memoized.outputCamera;
    };
}
