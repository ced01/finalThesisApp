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
        c1, c2, c3, c4, c5, c6, c7, c8;

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

        delta = (event.originalEvent.wheelDeltaY * speed);

        c1 = ((vx < -1) && (vy < -1) && (vz < -1));
        c2 = (vx < 1 && vy < 1 && vz < 1);
        c3 = ((vx < -1) && vy < 1 && vz < 1);
        c4 = (vx < 1 && (vy < -1) && vz < 1);
        c5 = (vx < 1 && vy < 1 && (vz < -1));
        c6 = (vx < 1 && (vy < -1) && (vz < -1));
        c7 = ((vx < -1) && vy < 1 && (vz < -1));
        c4 = ((vx < -1) && (vy < -1) && vz < 1);

        if (c1 || c2 || c3 || c4 || c5 || c6 || c7 || c8) {
            cam.position.x += delta;
            cam.position.y += delta;
            cam.position.z += delta;
        } else {
            cam.position.x -= delta * (vx / norm);
            cam.position.y -= delta * (vy / norm);
            cam.position.z -= delta * (vz / norm);
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