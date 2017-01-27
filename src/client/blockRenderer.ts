import * as _ from "lodash";
import * as threejs from "three";
// threejs.OrbitControls is a separate import. Get it and stick it on the threejs module where the type definitions think it is.
import * as x from "three-orbit-controls";
(threejs as any).OrbitControls = x(threejs);

import { IBlock } from '../common/contracts';

export default class BlockRenderer {

    private container: HTMLElement;

    private camera: threejs.PerspectiveCamera;
    private scene: threejs.Scene;
    private renderer: threejs.WebGLRenderer;
    private orbitControl: threejs.OrbitControls;
    private plane: threejs.Mesh;
    private mouse: threejs.Vector2;
    private raycaster: threejs.Raycaster;
    private rollOverMesh: threejs.Mesh;
    private rollOverMaterial: threejs.MeshBasicMaterial;
    private cubeGeo: threejs.BoxGeometry;
    private cubeMaterial: threejs.MeshLambertMaterial;

    private objectsInScene: any[] = [];
    private blocksInScene: threejs.Object3D[] = [];
    private currentBlocksDrawn: IBlock[];

    private readonly blockSize = 50;
    private readonly gridSize = 600;

    constructor(private canvas: HTMLCanvasElement, private colorInHex: string = "#aa0000", private handleNewBlock?: (block: IBlock) => void, private handleBlockRemoval?: (blockId: string) => void) {
        this.container = document.createElement('div');
        document.body.appendChild(this.container);

        this.init();
        this.render();
    }

    public setBlockPaintColor(color: string) {
        this.colorInHex = color;
        this.rollOverMesh.material.setValues({ color: new threejs.Color(color), opacity: 0.5, transparent: true } as threejs.MeshBasicMaterial);
        this.render();
    }

    public setBlocks(blocks: IBlock[]) {
        if (this.currentBlocksDrawn === blocks) {
            return;
        }

        _.each(this.blocksInScene, block => {
            this.scene.remove(block);
        });

        this.blocksInScene = _.map(blocks, block => this.addBlock(block));
        this.currentBlocksDrawn = blocks;

        this.render();
    }

    public addBlock(block: IBlock): threejs.Object3D {
        // Create block.
        const material = this.cubeMaterial.clone();
        material.color.set(block.color);

        const voxel = new threejs.Mesh(this.cubeGeo, material);
        voxel.position.add(new threejs.Vector3(block.position.x, block.position.y, block.position.z));

        this.scene.add(voxel);
        return voxel;
    }

    private init() {
        this.camera = new threejs.PerspectiveCamera(45, this.canvas.clientWidth / this.canvas.clientHeight, 1, 10000);
        this.camera.position.set(500, 800, 1300);
        this.camera.lookAt(new threejs.Vector3());
        this.scene = new threejs.Scene();

        // Ghost cube.
        const rollOverGeo = new threejs.BoxGeometry(this.blockSize, this.blockSize, this.blockSize);
        this.rollOverMaterial = new threejs.MeshBasicMaterial({ color: 0xff0000, opacity: 0.5, transparent: true });
        this.rollOverMesh = new threejs.Mesh(rollOverGeo, this.rollOverMaterial);

        this.scene.add(this.rollOverMesh);

        // Normal cubes.
        this.cubeGeo = new threejs.BoxGeometry(this.blockSize, this.blockSize, this.blockSize);
        this.cubeMaterial = new threejs.MeshLambertMaterial({ color: this.colorInHex });

        // Create grid
        const geometry = new threejs.Geometry();
        for (var i = - this.gridSize; i <= this.gridSize; i += this.blockSize) {
            geometry.vertices.push(new threejs.Vector3(- this.gridSize, 0, i));
            geometry.vertices.push(new threejs.Vector3(this.gridSize, 0, i));
            geometry.vertices.push(new threejs.Vector3(i, 0, - this.gridSize));
            geometry.vertices.push(new threejs.Vector3(i, 0, this.gridSize));
        }

        const material = new threejs.LineBasicMaterial({ color: 0x000000, opacity: 0.15, transparent: true });
        const line = new threejs.LineSegments(geometry, material);
        this.scene.add(line);

        this.raycaster = new threejs.Raycaster();
        this.mouse = new threejs.Vector2();
        
        const bufferGeometry = new threejs.PlaneBufferGeometry(this.gridSize * 2, this.gridSize * 2);
        bufferGeometry.rotateX(- Math.PI / 2);
        this.plane = new threejs.Mesh(bufferGeometry, new threejs.MeshBasicMaterial({ visible: false }));
        this.scene.add(this.plane);
        this.objectsInScene.push(this.plane);

        // Lights
        this.scene.add(new threejs.AmbientLight(0x606060));
        const directionalLight = new threejs.DirectionalLight(0xffffff);
        directionalLight.position.set(1, 0.75, 0.5).normalize();
        this.scene.add(directionalLight);

        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;

        this.renderer = new threejs.WebGLRenderer({ antialias: true, canvas: this.canvas, alpha: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setViewport(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);

        this.orbitControl = new threejs.OrbitControls(this.camera, this.canvas);
        this.orbitControl.mouseButtons.ORBIT = threejs.MOUSE.RIGHT;
        this.orbitControl.addEventListener("change", () => { this.render(); });

        this.canvas.addEventListener('mousemove', (event) => this.onCanvasMouseMove(event));
        this.canvas.addEventListener('mousedown', (event) => this.onCanvasMouseDown(event));

        window.addEventListener('resize', (event) => this.onWindowResize(event));
    }

    private onWindowResize(event: UIEvent) {
        const width = this.canvas.parentElement && this.canvas.parentElement.clientWidth || 100;
        const height = this.canvas.parentElement && this.canvas.parentElement.clientHeight || 100;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setViewport(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);

        this.renderer.setSize(width, height);
        this.render();
    }

    private getIntersectableObjects() {
        return this.blocksInScene.concat(this.objectsInScene);
    }

    private onCanvasMouseMove(event: MouseEvent) {
        event.preventDefault();

        if (event.shiftKey) {
            // Deleting block?
        } else {
            this.mouse.set((event.offsetX / this.canvas.clientWidth) * 2 - 1, - (event.offsetY / this.canvas.clientHeight) * 2 + 1);

            this.raycaster.setFromCamera(this.mouse, this.camera);
            const intersects = this.raycaster.intersectObjects(this.getIntersectableObjects());
            if (intersects.length > 0) {
                const firstIntersectedObject = intersects[0];
                this.rollOverMesh.position.copy(firstIntersectedObject.point).add(firstIntersectedObject.face.normal);
                this.rollOverMesh.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
            }
        }

        this.render();
    }

    private onCanvasMouseDown(event: MouseEvent) {
        if (event.button !== 0) {
            // Not left click.
            return;
        }
        event.preventDefault();
        this.mouse.set((event.offsetX / this.canvas.clientWidth) * 2 - 1, - (event.offsetY / this.canvas.clientHeight) * 2 + 1);
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.getIntersectableObjects());
        if (intersects.length > 0) {
            var intersect = intersects[0];
            if (event.shiftKey) {
                // Remove cube.
                if (this.handleBlockRemoval) {
                    //this.handleBlockRemoval();
                }
            } else {
                const position = new threejs.Vector3();
                position.copy(intersect.point).add(intersect.face.normal);
                position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);

                if (this.handleNewBlock) {
                    this.handleNewBlock({
                        color: this.colorInHex,
                        position: position
                    });
                }
            }

            this.render();
        }
    }

    public render() {
        this.renderer.render(this.scene, this.camera);
    }

    public renderToImage() {
        this.render();
        return this.renderer.domElement.toDataURL();
    }
}
