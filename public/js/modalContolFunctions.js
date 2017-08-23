function moveCamera(x, y, z) {
    globalCam.camera.position.x = ~~x;
    globalCam.camera.position.y = ~~y;
    globalCam.camera.position.z = ~~z;
}

function getFormCamPositions() {

    var arrPos = new Array();
    var domPosElements = $('.positionCamControl');

    domPosElements.each(function() {
        if ($(this).length != 0) {
            arrPos.push(parseInt($(this).val()));
        } else {
            console.log("domElement not find")
        }
    });
    return arrPos;
}

function getFormMeshPositions() {

    var arrPos = new Array();
    var domPosElements = $('.positionMeshControl');

    domPosElements.each(function() {
        if ($(this).length != 0) {
            arrPos.push(parseInt($(this).val()));
        } else {
            console.log("domElement not find")
        }
    });
    return arrPos;
}


function onPositionMeshFormfill(currMeshPositions) {

    var positionMeshControl = $(".positionMeshControl"),
        mesh = globalThreeOBJs.meshes[globalThreeOBJs.objOnFocus];

    positionMeshControl.each(function() {

        if ($(this).data("pos") == "meshX") {

            mesh.pos.x = currMeshPositions[0];
        }
        if ($(this).data("pos") == "meshY") {
            mesh.pos.y = currMeshPositions[1];
        }
        if ($(this).data("pos") == "meshZ") {
            mesh.pos.z = currMeshPositions[2];
        }

    });
}

function onPositionCamFormFill(currCamPositions, cam) {
    cam.position.x = ~~currCamPositions[0];
    cam.position.y = ~~currCamPositions[1];
    cam.position.z = ~~currCamPositions[2];
}

function openModalCamControl(camera) {

    $("#camera").on("click", function() {

        var displayArea = $("#displayControlCamera"),
            title = displayArea.data("functionality"),
            modal = $("#camModal"),
            modalContent = $("#cammodalContent"),
            content = displayArea.data("content"),
            btn = $("#cambtnValidation"),
            modalTitle = $(".modal-title");

        modalTitle.html(title);
        modalContent.html(content);
        modal.modal('show');

        btn.on("click", function() {
            var newCamPositions = getFormCamPositions();
            onPositionCamFormFill(newCamPositions, camera);
            $("#currentCamPosX").html(camera.position.x);
            $("#currentCamPosY").html(camera.position.y);
            $("#currentCamPosZ").html(camera.position.z);
            var vect = new THREE.Vector3(newCamPositions[0], newCamPositions[1], newCamPositions[2]);
            camera.lookAt(vect);
            modal.modal('hide');
        });
    });
}

function setFocusOnObject(objFocused) {
    globalCam.camera.lookAt(globalThreeOBJs.meshes[objFocused].pos);
}

function openModalMeshControl(objFoc) {

    var object3d = globalThreeOBJs.meshes[objFoc];
    if (!object3d.hidden) {
        var mesh = object3d.obj,
            displayArea = $("#displayControlMesh"),
            title = displayArea.data("functionality"),
            modal = $("#meshModal"),
            modalContent = $("#modalContent"),
            content = displayArea.data("content"),
            btn = $("#btnValidation"),
            modalTitle = $(".modal-title"),
            hexaRgb = object3d.color.split("_"),
            newHexCol = null,
            newRgbCol = null,
            newobjPosition = null;

        globalThreeOBJs.objOnFocus = objFoc;
        modalTitle.html(" <b> " + object3d.name + " </b> " + title);
        modalContent.html(content);
        modal.modal('show');

        var positions = $(".positionMeshControl");

        positions[0].value = object3d.pos.x;
        positions[1].value = object3d.pos.y;
        positions[2].value = object3d.pos.z;

        $("#meshName").html(object3d.name);
        $(".pick-a-color").pickAColor();
        $(".pick-a-color").val(hexaRgb[0]);
        $(".current-color").css("background-color", hexaRgb[1]);

        $("#btnValidation").on("click", function() {
            newHexCol = $(".hexColor").val();
            rgbColor = $(".current-color").css("background-color");
            newobjPosition = getFormMeshPositions();
            if (newobjPosition[0] != object3d.pos.x || newobjPosition[1] != object3d.pos.y || newobjPosition[2] != object3d.pos.z) {
                if (object3d.sh) {
                    addShade(objFoc, true);
                }
            }
            onPositionMeshFormfill(newobjPosition);
            moveNormals(objFoc);
            $("#currentMeshPosX").html(newobjPosition[0]);
            $("#currentMeshPosY").html(newobjPosition[1]);
            $("#currentMeshPosZ").html(newobjPosition[2]);
            if (!object3d.sh || !object3d.gc) {
                setObjectColor(newHexCol, rgbColor);
            }
            modal.modal('hide');
        });
    }
}