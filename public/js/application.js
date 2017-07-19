$(document).ready(function() {

    var container = $("#displayer"),
        fileInput = document.querySelector('#cadFileSelected');

    container.css("width", $(window).width());
    container.css("height", $(window).height());

    globalCam.camera.aspect = container.width() / container.height();
    globalCam.camera.updateProjectionMatrix();
    globalCam.camPosX = $("#currentCamPosX");
    globalCam.camPosY = $("#currentCamPosY");
    globalCam.camPosZ = $("#currentCamPosZ");

    var newSelectedmesh = null;

    $("#meshSize").on('change', function() {
        globalThreeOBJs.meshSize = $(this).val();
    });

    fileInput.addEventListener('change', function() {
        $("#messageDiv").html("File to load -<b>" + $(this).val().split("\\")[2].split(".")[0] + "</b>");
        if (globalThreeOBJs.meshSize >= 3) {
            showLoading();
            if ($("#screenLoad").is(":visible")) {
                var reader = new FileReader(),
                    fileName = $(this).val().split("\\")[2].split(".")[0];

                reader.addEventListener('load', function() {
                    personalLoad(reader, fileName);
                    hideLoading();
                }, false);
                reader.readAsText(fileInput.files[0]);
            }
        } else {
            $("#messageDiv").html("<b>" + $(this).val().split("\\")[2].split(".")[0] + "</b> - minimum mesh size is <b>3</b>");
        }
    });


    var script = document.createElement('script');

    script.onload = function() {
        var stats = new Stats(),
            i;

        var canvas = stats.dom.children;

        for (i = 0; i < stats.dom.children.length; i++) {
            canvas[i].style = "margin-top:-34px;border-radius: 6px;position: absolute;right: 0px;cursor: pointer;opacity: 0.9;"
        }

        stats.dom.style = "border-radius: 6px;cursor: pointer;";
        $("#fps").append(stats.dom);

        requestAnimationFrame(function loop() {
            stats.update();
            requestAnimationFrame(loop)
        });
    };

    script.src = '//rawgit.com/mrdoob/stats.js/master/build/stats.min.js';
    document.head.appendChild(script);

    $(window).on("load", function() {
        globalThreeOBJs.arrObjName = [];
        globalThreeOBJs.meshes = [];
        init(container);
        animate();
        container.mouseup(function() {
            globalCam.freeCam = false;
        });
        container.mousedown(function() {
            globalCam.freeCam = true;
        });
    });

    $(window).on("resize", function() {
        container.css("width", $(window).width());
        container.css("height", $(window).height());
        globalCam.camera.aspect = container.width() / container.height();
        globalCam.camera.updateProjectionMatrix();
        globalThree.renderer.setSize(container.width(), container.height());

    });

    $("#objButton").on("click", function() {
        var domElement = $("#objectDiv");
        if (domElement.height() > globalThreeOBJs.domUlObjLenght) {
            domElement.css("height", domElement.height());
            domElement.css("overflow-y", "scroll");
        }
    });

    container.on("mousemove", function(event) {
        globalMouse.mouseX = (event.clientX - globalMouse.windowHalfX) / 2;
        globalMouse.mouseY = (event.clientY - globalMouse.windowHalfY) / 2;
    });


    document.addEventListener('mousemove', onDocumentMouseMove, false);
    window.addEventListener('resize', onWindowResize, false);

});

function render() {

    var rend = globalThree.renderer,
        sce = globalThree.scene,
        objFocused = globalThreeOBJs.objOnFocus,
        gCam = globalCam,
        cam = gCam.camera,
        camPosition = cam.position,
        domCamX = gCam.camPosX,
        domCamY = gCam.camPosY,
        domCamZ = gCam.camPosZ;

    if (globalCam.freeCam) {
        onMeshHover();
    } else {
        onMousewheel();
    }
    if (domCamX != null && domCamY != null && domCamZ != null) {
        domCamX.html(~~camPosition.x);
        domCamY.html(~~camPosition.y);
        domCamZ.html(~~camPosition.z);
    }
    if (objFocused == 0 || objFocused == undefined) {

        cam.lookAt(sce.position);
    } else {
        setFocusOnObject(objFocused);
    }
    rend.render(sce, cam);
}


function animate() {

    requestAnimationFrame(animate);
    render();
}

function init(container) {


    moveCamera(globalCam.initialCamPos[0], globalCam.initialCamPos[1], globalCam.initialCamPos[2]);
    objectLoader("Scene", false);
    openModalCamControl(globalCam.camera);
    openModalLightControl();
    createAxe(new THREE.Vector3(-30, 0, 0), new THREE.Vector3(30, 0, 0), new THREE.MeshBasicMaterial({ color: 0xff1fff }));
    createAxe(new THREE.Vector3(0, -30, 0), new THREE.Vector3(0, 30, 0), new THREE.MeshBasicMaterial({ color: 0x29ff29 }));
    createAxe(new THREE.Vector3(0, 0, -30), new THREE.Vector3(0, 0, 30), new THREE.MeshBasicMaterial({ color: 0xff8b3d }));
    globalThree.scene.add(globalThree.ambient);
    globalThree.scene.add(globalThree.directionalLight);
    globalThree.directionalLight.position.set(0, 1, 1);
    globalThree.renderer.setPixelRatio(window.devicePixelRatio);
    globalThree.renderer.setSize(container.width(), container.height());
    container.append(globalThree.renderer.domElement);
}