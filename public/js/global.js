var globalThree = {

    renderer: new THREE.WebGLRenderer(),
    scene: new THREE.Scene(),
    ambient: new THREE.AmbientLight(0xffeedd),
    directionalLight: new THREE.DirectionalLight(0xffeedd),
    axes: new Array(),
    sceneHasAxes: true

};
var globalCam = {
    camera: new THREE.PerspectiveCamera(50, 1, 0.1, 10000),
    orbitControl: null,
    initialCamPos: [21, 12, 22],
    freeCam: false,
    camPosX: null,
    camPosY: null,
    camPosZ: null
};

var globalThreeOBJs = {

    meshes: new Array(),
    arrNameAlreadyUsed: new Array(null),
    objloader: new THREE.OBJLoader2(),
    dragControl: null,
    initialObjPos: [0, 0, 0],
    helperFunctions: [onProgress],
    domUlObjLenght: 120,
    meshSize: 3,
    objOnFocus: 0
};

class mesh {
    constructor(id, obj, name, pos, color, wf, sh, n, hidden, arrNorm, arrShade) {
        this.id = id;
        this.obj = obj;
        this.name = name;
        this.pos = pos;
        this.color = color;
        this.wf = wf;
        this.sh = sh;
        this.n = n;
        this.hidden = hidden;
        this.arrNorm = arrNorm;
        this.arrShade = arrShade;
    }
};

class igesMesh extends mesh {
    constructor(id, obj, name, pos, color, wf, sh, n, hidden, arrNorm, arrShade, file, gc, strGcurv) {
        super(id, obj, name, pos, color, wf, sh, n, hidden, arrNorm, arrShade);
        this.file = file;
        this.gc = gc;
        this.strGcurv = strGcurv;
    }
};

function onProgress(xhr) {
    if (xhr.lengthComputable) {
        var percentComplete = xhr.loaded / xhr.total * 100;
        console.log(Math.round(percentComplete, 2) + '% downloaded');
    }
}

function onWindowResize() {

    globalCam.camera.aspect = window.innerWidth / window.innerHeight;
    globalCam.camera.updateProjectionMatrix();
    globalThree.renderer.setSize(window.innerWidth, window.innerHeight);

}