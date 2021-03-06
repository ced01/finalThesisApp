function showLoading() {
    $("#screenLoad").attr('hidden', false);
}

function hideLoading() {
    $("#screenLoad").attr('hidden', true);
}

function personalLoad(reader, fileName) {
    var content = reader.result,
        instance = new Module.FinalSurface(content, ~~globalThreeOBJs.meshSize),
        fileString = "",
        gaussianColors = "",
        loader = new THREE.OBJLoader2(),
        myObj = null,
        obj3DIges = null;
    instance.computeData();
    fileName = checkName(fileName);
    fileString = instance.vertices_output + instance.normals_output + instance.faces_output;
    instance.delete();
    myObj = loader.parseText(fileString);
    myObj.traverse(function(child) {
        if (child instanceof THREE.Mesh) {
            child.material = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                side: THREE.DoubleSide,
                wireframe: false
            });
        }
    });
    obj3DIges = new igesMesh(globalThreeOBJs.meshes.length, myObj, fileName, myObj.position, "ffffff_rgb(255, 255, 255)", false, false, false, false, null, new Array(), content, false, "", new Array());
    addIntoObjArr(obj3DIges);
    addDomSingleObjName(obj3DIges.id, obj3DIges.name);
    addtoScene(obj3DIges.obj);
    $("#messageDiv").html("Last file loaded - <b>" + fileName + "</b>");
}