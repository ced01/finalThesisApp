var globalThree = {

    renderer: null,
    scene: new THREE.Scene(),
    ambient: new THREE.AmbientLight(0xffeedd),
    directionalLight: new THREE.DirectionalLight(0xffeedd),
    axes: new Array(),
    sceneHasAxes: true

};
var globalCam = {
    camera: new THREE.PerspectiveCamera(45, (window.innerWidth / window.innerHeight), 1, 6000),
    initialCamPos: [21, 12, 22],
    freeCam: false,
    camPosX: null,
    camPosY: null,
    camPosZ: null
};

var globalThreeOBJs = {

    meshes: new Array(),
    meshSize: 3,
    hexacolors: new Array(),
    wireframes: new Array(),
    shades: new Array(),
    objOnFocus: 0,
    arrObjName: new Array(),
    arrNameAlreadyUsed: new Array(),
    arrObjNormals: new Array(),
    arrNormalBool: new Array(),
    objMaterials: new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: false }),
    objloader: new THREE.OBJLoader(),
    initialObjPos: [0, 0, 0],
    helperFunctions: [onProgress, onError],
    domUlObjLenght: 120
};

var globalMouse = {
    windowHalfX: window.innerWidth / 2,
    windowHalfY: window.innerHeight / 2,
    mouseX: 0,
    mouseY: 0,
    seepMouseWheel: 0.00001
};

function onProgress(xhr) {
    if (xhr.lengthComputable) {
        var percentComplete = xhr.loaded / xhr.total * 100;
        console.log(Math.round(percentComplete, 2) + '% downloaded');
    }
}

function onError(xhr) {}

function onWindowResize() {

    globalMouse.windowHalfX = window.innerWidth / 2;
    globalMouse.windowHalfY = window.innerHeight / 2;
    globalCam.camera.aspect = window.innerWidth / window.innerHeight;
    globalCam.camera.updateProjectionMatrix();
    globalThree.renderer.setSize(window.innerWidth, window.innerHeight);

}

function onDocumentMouseMove(event) {
    globalMouse.mouseX = (event.clientX - globalMouse.windowHalfX) / 2;
    globalMouse.mouseY = (event.clientY - globalMouse.windowHalfY) / 2;
}