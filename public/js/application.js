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
        if (globalThreeOBJs.meshSize >= 3) {
            var reader = new FileReader(),
                fileName = $(this).val().split("\\")[2].split(".")[0];

            reader.addEventListener('load', function() {

                var content = reader.result,
                    instance = new Module.FinalSurface(content, ~~globalThreeOBJs.meshSize);
                instance.computeData();

                var fileString = instance.vertices_output + instance.normals_output + instance.faces_output,
                    loader = new THREE.OBJLoader2(),
                    myObj = loader.parseText(fileString);

                addNameToArray(fileName);
                myObj.traverse(function(child) {
                    if (child instanceof THREE.Mesh) {
                        //child.material.map = texture;
                        child.material = globalThreeOBJs.objMaterials;
                        if (globalThreeOBJs.arrObjName[globalThreeOBJs.arrObjName.length - 1] == "Scene") {
                            child.material = new THREE.MeshBasicMaterial({ color: 0x6666ff, wireframe: false });
                            initialObjColors = "6666ff_rgb(102, 102, 255)";
                        }
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

                instance.delete();
            });
            reader.readAsText(fileInput.files[0]);
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

    globalCam.camera = new THREE.PerspectiveCamera(45, (container.width() / container.height()), 1, 400);
    moveCamera(globalCam.initialCamPos[0], globalCam.initialCamPos[1], globalCam.initialCamPos[2]);
    objectLoader("Scene", false);
    openModalCamControl(globalCam.camera);
    openModalLightControl();
    createAxe(new THREE.Vector3(-30, 0, 0), new THREE.Vector3(30, 0, 0), new THREE.MeshBasicMaterial({ color: 0xff1fff }));
    createAxe(new THREE.Vector3(0, -30, 0), new THREE.Vector3(0, 30, 0), new THREE.MeshBasicMaterial({ color: 0x29ff29 }));
    createAxe(new THREE.Vector3(0, 0, -30), new THREE.Vector3(0, 0, 30), new THREE.MeshBasicMaterial({ color: 0xff8b3d }));
    //globalThree.scene.fog = new THREE.Fog(0x000000, 0.015, 200);
    globalThree.scene.add(globalThree.ambient);
    globalThree.scene.add(globalThree.directionalLight);
    globalThree.directionalLight.position.set(0, 1, 1);
    globalThree.renderer = new THREE.WebGLRenderer();
    globalThree.renderer.setPixelRatio(window.devicePixelRatio);
    globalThree.renderer.setSize(container.width(), container.height());
    //globalThree.renderer.shadowMap.enabled = true;
    container.append(globalThree.renderer.domElement);
}