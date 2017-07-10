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
        obj = globalThreeOBJs.meshes[globalThreeOBJs.objOnFocus];

    positionMeshControl.each(function() {

        if ($(this).data("pos") == "meshX") {

            obj.position.x = currMeshPositions[0];
        }
        if ($(this).data("pos") == "meshY") {
            obj.position.y = currMeshPositions[1];
        }
        if ($(this).data("pos") == "meshZ") {
            obj.position.z = currMeshPositions[2];
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
            modal = $("#mainModal"),
            modalContent = $("#modalContent"),
            content = displayArea.data("content"),
            btn = $("#btnValidation"),
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

function openModalLightControl() {

    $("#light").on("click", function() {
        alert("bof");
        var displayArea = $("#displayControlLight"),
            title = displayArea.data("functionality"),
            modal = $("#mainModal"),
            modalContent = $("#modalContent"),
            content = displayArea.data("content"),
            btn = $("#btnValidation"),
            modalTitle = $(".modal-title");


        modalTitle.html(title);
        modalContent.html(content);
        modal.modal('show');

        $(".pick-a-color").pickAColor();

        btn.on("click", function() {

        });
    });
}

function setFocusOnObject(objFocused) {


    var objPosition = globalThreeOBJs.meshes[objFocused];
    globalCam.camera.lookAt(objPosition.position);

}

function openModalMeshControl(objFoc) {

    if (globalThreeOBJs.arrObjName[objFoc] != null) {

        var obj = globalThreeOBJs.meshes[objFoc],
            displayArea = $("#displayControlMesh"),
            title = displayArea.data("functionality"),
            modal = $("#mainModal"),
            modalContent = $("#modalContent"),
            content = displayArea.data("content"),
            btn = $("#btnValidation"),
            modalTitle = $(".modal-title"),
            hexaRgb = globalThreeOBJs.hexacolors[objFoc].split("_"),
            newHexCol = null,
            newRgbCol = null,
            newobjPosition = null;

        globalThreeOBJs.objOnFocus = objFoc;
        modalContent.html("");
        modalTitle.html(" <b> " + globalThreeOBJs.arrObjName[objFoc] + " </b> " + title);
        modalContent.html(content);
        modal.modal('show');

        var positions = $(".positionMeshControl"),
            actualPositions = new Array();

        actualPositions[0] = obj.position.x;
        actualPositions[1] = obj.position.y;
        actualPositions[2] = obj.position.z;
        console.log(positions);
        for (var i = 0; i < positions.length; i++) {
            positions[i].value = actualPositions[i];
        }

        $("#meshName").html(globalThreeOBJs.arrObjName[objFoc]);
        $(".pick-a-color").pickAColor();
        $(".pick-a-color").val(hexaRgb[0]);
        $(".current-color").css("background-color", hexaRgb[1]);


        $("#btnValidation").on("click", function() {
            newHexCol = $(".hexColor").val();
            rgbColor = $(".current-color").css("background-color");
            newobjPosition = getFormMeshPositions();
            if (newobjPosition[0] != obj.position.x || newobjPosition[1] != obj.position.y || newobjPosition[2] != obj.position.z) {
                if (globalThreeOBJs.arrNormalBool[objFoc]) {
                    removeNormalFromObj(objFoc);
                }
                if (globalThreeOBJs.arrNormalBool[objFoc]) {
                    addNormalToObj(objFoc);
                }
                if (globalThreeOBJs.shades[objFoc]) {
                    addShade(objFoc, true);
                }
            }
            onPositionMeshFormfill(newobjPosition);

            moveNormals(objFoc);

            $("#currentMeshPosX").html(newobjPosition[0]);
            $("#currentMeshPosY").html(newobjPosition[1]);
            $("#currentMeshPosZ").html(newobjPosition[2]);

            setObjectColor(newHexCol, rgbColor);
            modal.modal('hide');
        });
    }
}