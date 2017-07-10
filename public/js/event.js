function onMousewheel() {

    var norm = 0,
        obj = null,
        posObj = null,
        cam = null,
        posCam = null,
        delta = 0,
        vx = 0,
        vy = 0,
        vz = 0,
        c1 = false,
        c2 = false,
        c3 = false,
        c4 = false,
        c5 = false,
        c6 = false,
        c7 = false,
        c8 = false;

    $("#displayer").on("mousewheel", function(event) {



        obj = globalThreeOBJs.meshes[globalThreeOBJs.objOnFocus];
        posObj = obj.position;
        cam = globalCam.camera;
        posCam = cam.position;
        speed = globalMouse.seepMouseWheel;
        vx = posCam.x - posObj.x;
        vy = posCam.y - posObj.y;
        vz = posCam.z - posObj.z;
        norm = Math.sqrt(vx * vx + vy * vy + vz * vz);

        delta = event.originalEvent.deltaY * speed;

        c1 = ((vx < -1) && (vy < -1) && (vz < -1));
        c2 = (vx < 1 && vy < 1 && vz < 1);
        c3 = ((vx < -1) && vy < 1 && vz < 1);
        c4 = (vx < 1 && (vy < -1) && vz < 1);
        c5 = (vx < 1 && vy < 1 && (vz < -1));
        c6 = (vx < 1 && (vy < -1) && (vz < -1));
        c7 = ((vx < -1) && vy < 1 && (vz < -1));
        c8 = ((vx < -1) && (vy < -1) && vz < 1);

        if (c1 || c2 || c3 || c4 || c5 || c6 || c7 || c8) {
            cam.position.x -= delta;
            cam.position.y -= delta;
            cam.position.z -= delta;
        } else {
            cam.position.x += delta * (vx / norm);
            cam.position.y += delta * (vy / norm);
            cam.position.z += delta * (vz / norm);
        }


    });
}

function onMeshHover() {
    var camPos = globalCam.camera.position,
        mouse = globalMouse,
        mx = mouse.mouseX,
        whx = mouse.windowHalfX,
        my = mouse.mouseY,
        why = mouse.windowHalfY;
    if (mx < whx) {
        camPos.x -= (-mx + camPos.x * 3) * 0.03;
    } else {
        camPos.x += (-mx + camPos.x * 3) * 0.03;
    }
    if (my < why) {
        camPos.y -= (-my + camPos.y * 3) * 0.03;
    } else {
        camPos.y += (-my + camPos.y * 3) * 0.03;
    }
}

function personalLoad(reader, fileName) {


    var content = reader.result,
        instance = new Module.FinalSurface(content, ~~globalThreeOBJs.meshSize);

    instance.computeData();

    var fileString = instance.vertices_output + instance.normals_output + instance.faces_output,
        gaussianColors = instance.colors_output,
        loader = new THREE.OBJLoader2(),
        myObj = loader.parseText(fileString);




    addNameToArray(fileName);
    myObj.traverse(function(child) {
        if (child instanceof THREE.Mesh) {
            child.material = globalThreeOBJs.objMaterials;
        }
    });
    myObj.needsUpdate = true;
    globalThreeOBJs.arrNameAlreadyUsed.push(0);
    globalThreeOBJs.arrNormalBool.push(false);
    globalThreeOBJs.hexacolors.push("ffffff_rgb(255, 255, 255)");
    globalThreeOBJs.wireframes.push(false);
    globalThreeOBJs.shades.push(false);
    addIntoObjArr(myObj);
    addtoScene(myObj);
    computeNormalsToObj(globalThreeOBJs.meshes.length - 1, myObj.position);
    globalThreeOBJs.gaussianCurvature.push([globalThreeOBJs.meshes.length - 1, gaussianColors]);
    console.log(globalThreeOBJs.gaussianCurvature);
    instance.delete();

}

function showLoading() {
    $("#screenLoad").attr('hidden', false);
}

function hideLoading() {
    $("#screenLoad").attr('hidden', true);
}