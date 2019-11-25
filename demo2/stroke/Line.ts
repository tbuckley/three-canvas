import * as THREE from 'three';
import Fragment from './Fragment.js';

export default class Line {
  private group: THREE.Group;
  private activeFragment: Fragment;

  constructor() {
    this.group = new THREE.Group();
    this.activeFragment = this.addFragment();
  }

  get element(): THREE.Object3D {
    return this.group;
  }

  private addFragment() {
    const fragment = new Fragment();
    this.group.add(fragment.element);
    return fragment;
  }

  extend(point: THREE.Vector2) {
    if (this.activeFragment.isFull) {
      const lastPoint = this.activeFragment.lastPoint;
      this.activeFragment = this.addFragment();
      this.activeFragment.extend(lastPoint);
    }

    this.activeFragment.extend(point);
  }

  get lastPoint(): THREE.Vector2 {
    return this.activeFragment.lastPoint;
  }
}
