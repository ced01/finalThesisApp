$(document).ready(function() {
    var container = $("#displayer");
    container.css("width", $(window).width());
    container.css("height", $(window).height());
    globalCam.camera.aspect = container.width() / container.height();
    globalCam.camera.updateProjectionMatrix();
    globalCam.camPosX = $("#currentCamPosX");
    globalCam.camPosY = $("#currentCamPosY");
    globalCam.camPosZ = $("#currentCamPosZ");

    $("#meshSize").on('change', function() {
        globalThreeOBJs.meshSize = $(this).val();

    });

    document.querySelector('#cadFileSelected').addEventListener('change', function() {
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
                reader.readAsText(document.querySelector('#cadFileSelected').files[0]);
            }
        } else {
            $("#messageDiv").html("<b>" + $(this).val().split("\\")[2].split(".")[0] + "</b> - minimum mesh size is <b>3</b>");
        }
    });




    var script = document.createElement('script');

    script.onload = function() {
        var stats = new Stats();
        stats.dom.style = "border-radius: 6px;cursor: pointer;position:absolute;bottom:10px;right:10px;";
        $("#fps").append(stats.dom);
        requestAnimationFrame(function loop() {
            stats.update();
            requestAnimationFrame(loop)
        });
    };

    script.src = '//rawgit.com/mrdoob/stats.js/master/build/stats.min.js';
    document.head.appendChild(script);

    $(window).on("load", function() {
        init(container);
        animate();
    });

    $(window).on("resize", function() {
        container.css("width", $(window).width());
        container.css("height", $(window).height());
        globalCam.camera.aspect = container.width() / container.height();
        globalThree.renderer.setSize(container.width(), container.height());

    });

    $(".dropdown").on("show.bs.dropdown", function() {

        var domElement = $("#dropdownMesh");
        console.log(domElement.height());
        if (domElement.height() > globalThreeOBJs.domUlObjLenght) {
            domElement.css("height", domElement.height());
            domElement.css("overflow-y", "scroll");
        }

    });
    window.addEventListener('resize', onWindowResize, false);
});

function render() {

    globalCam.camPosX.html(~~globalCam.camera.position.x);
    globalCam.camPosY.html(~~globalCam.camera.position.y);
    globalCam.camPosZ.html(~~globalCam.camera.position.z);
    globalThree.renderer.render(globalThree.scene, globalCam.camera);
}

function animate() {
    requestAnimationFrame(animate);
    globalCam.orbitControls.update();
    render();
}

function init(container) {


    moveCamera(globalCam.initialCamPos[0], globalCam.initialCamPos[1], globalCam.initialCamPos[2]);
    openModalCamControl(globalCam.camera);
    createAxe(new THREE.Vector3(-30, 0, 0), new THREE.Vector3(30, 0, 0), new THREE.MeshBasicMaterial({ color: 0xff1fff }));
    createAxe(new THREE.Vector3(0, -30, 0), new THREE.Vector3(0, 30, 0), new THREE.MeshBasicMaterial({ color: 0x29ff29 }));
    createAxe(new THREE.Vector3(0, 0, -30), new THREE.Vector3(0, 0, 30), new THREE.MeshBasicMaterial({ color: 0xff8b3d }));
    globalThree.scene.add(globalThree.ambient);
    globalThree.scene.add(globalThree.directionalLight);
    globalThree.directionalLight.position.set(0, 1, 1);
    globalThree.renderer.setPixelRatio(window.devicePixelRatio);
    globalThree.renderer.setSize(container.width(), container.height());
    container.append(globalThree.renderer.domElement);
    objectLoader("Scene", false);
    globalCam.orbitControls = new THREE.OrbitControls(globalCam.camera, globalThree.renderer.domElement);
    globalCam.orbitControls.addEventListener('change', render);
}