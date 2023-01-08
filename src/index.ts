import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'dat.gui'


const params = {

    plane01: {

        constant: 1,
        negated: false,
        displayHelper: true

    },

    stencilMesh: {
        z: 0
    },

};

const clock = new THREE.Clock();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 1, 100);
camera.position.set(-4, 2, 2);

// LIGHTS
scene.add(new THREE.AmbientLight(0xffffff, 0.9));

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 10, 7.5);
dirLight.castShadow = true;
dirLight.shadow.camera.right = 2;
dirLight.shadow.camera.left = - 2;
dirLight.shadow.camera.top = 2;
dirLight.shadow.camera.bottom = - 2;
dirLight.shadow.mapSize.width = 1024;
dirLight.shadow.mapSize.height = 1024;
scene.add(dirLight);

// RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x453C67);
window.addEventListener('resize', onWindowResize);
document.body.appendChild(renderer.domElement);


// CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 2;
controls.maxDistance = 20;
controls.update();

// GUI
const gui = new GUI();

// initPlanes();
initCube();
animate();

function initCube() {

    const addCubeFace = (objectGeom: THREE.BufferGeometry, objectColor: string, 
        stencilRef: number, planePos: THREE.Vector3, planeRot: THREE.Vector3 ) => {

            // CUBE FACE
            const planeGeom = new THREE.PlaneGeometry();
            const stencilMat = new THREE.MeshPhongMaterial({ color: 'white' });
            stencilMat.depthWrite = false;
            stencilMat.stencilWrite = true;
            stencilMat.stencilRef = stencilRef;
            stencilMat.stencilFunc = THREE.AlwaysStencilFunc;
            stencilMat.stencilZPass = THREE.ReplaceStencilOp;
            const stencilMesh = new THREE.Mesh(planeGeom, stencilMat);
            stencilMesh.position.copy(planePos);
            stencilMesh.rotation.x = planeRot.x;
            stencilMesh.rotation.y = planeRot.y;
            stencilMesh.rotation.z = planeRot.z;
            stencilMesh.scale.multiplyScalar(0.9);
            scene.add(stencilMesh);
        
            // OBJECT INSIDE CUBE
            const objectMat = new THREE.MeshPhongMaterial({ color: objectColor});
            objectMat.stencilWrite = true;
            objectMat.stencilRef = stencilRef;
            objectMat.stencilFunc = THREE.EqualStencilFunc;
            const object = new THREE.Mesh(objectGeom, objectMat);
            scene.add(object);
    }

     addCubeFace(new THREE.ConeGeometry(0.25, 0.5), 'orange', 1, new THREE.Vector3(-0.5,0,0), new THREE.Vector3( 0, -Math.PI / 2,0));
     
}

function initPlanes () {
    const planeGeom = new THREE.PlaneGeometry();
    const stencilMat = new THREE.MeshPhongMaterial({ color: 'green' });
    stencilMat.colorWrite = false;
    stencilMat.depthWrite = false;
    stencilMat.stencilWrite = true;
    stencilMat.stencilRef = 1;
    stencilMat.stencilFunc = THREE.AlwaysStencilFunc;
    stencilMat.stencilZPass = THREE.ReplaceStencilOp;

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {

    const delta = clock.getDelta();
    requestAnimationFrame(animate);
    renderer.render(scene, camera);

}