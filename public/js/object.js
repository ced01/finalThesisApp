function addDomSingleObjName(newObjName, nbObj) {
    var divElement = $("#objectDiv");
    var html = '<hr><div class="row"><div class="col-md-6"><div id="object-' + nbObj + '" class="object" data-name="' + newObjName + '">' + newObjName + '</div></div><div class="col-md-6"><div id="removeOrAdd-' + nbObj + '" class="glyphicon glyphicon-minus-sign icon pull-right" onclick="removeOrAddObjFromScene(' + nbObj + ',1)"></div><div class="pull-right glyphicon glyphicon-cog icon" onclick="openModalMeshControl(' + nbObj + ');"></div></div></div><br><div class="row icon-bar"><div class="col-md-12"><span class="icon" aria-hidden="true"><img id="addOrRemoveNormal-' + nbObj + '" class="imgIcon" onclick="addOrRemoveNormalFromObj(' + nbObj + ')" src="./public/css/icon/add_normal.png"></span><span class="icon" aria-hidden="true"><img id="addOrRemoveWireframe-' + nbObj + '" class="imgIcon" onclick="addOrRemoveWireframe(' + nbObj + ')" src="./public/css/icon/add_Mesh.png"></span><span class="icon" aria-hidden="true"><img id="addOrRemoveShadding-' + nbObj + '" onclick="addOrRemoveShading(' + nbObj + ')" class="imgIcon" src="./public/css/icon/add_Shadding.png"></span></div></div>';
    if (nbObj == 0) {
        html = '<div class="row"><div class="col-md-6"><div id="object-' + nbObj + '" class="object" data-name="' + newObjName + '">' + newObjName + '</div></div><div class="col-md-6"><div id="removeOrAdd-' + nbObj + '" class="glyphicon glyphicon-minus-sign icon pull-right" onclick="removeOrAddObjFromScene(' + nbObj + ',1)"></div><div class="pull-right glyphicon glyphicon-cog icon" onclick="openModalMeshControl(' + nbObj + ');"></div></div></div><br><div class="row icon-bar"><div class="col-md-12"><span class="icon" aria-hidden="true"><img id="addOrRemoveNormal-' + nbObj + '" class="imgIcon" onclick="addOrRemoveNormalFromObj(' + nbObj + ')" src="./public/css/icon/add_normal.png"></span><span class="icon" aria-hidden="true"><img id="addOrRemoveWireframe-' + nbObj + '" class="imgIcon" onclick="addOrRemoveWireframe(' + nbObj + ')" src="./public/css/icon/add_Mesh.png"></span><span class="icon" aria-hidden="true"><img id="addOrRemoveShadding-' + nbObj + '" onclick="addOrRemoveShading(' + nbObj + ')" class="imgIcon" src="./public/css/icon/add_Shadding.png"></span></div></div>';
    }
    divElement.append(html);
}


function addNameToArray(name) {

    var nameArr = globalThreeOBJs.arrObjName,
        nbObj = globalThreeOBJs.meshes.length,
        arrayNamesAreadyUsed = globalThreeOBJs.arrNameAlreadyUsed;
    var i = 0;
    nameArr.forEach(function(n) {
        if (n === name) {
            arrayNamesAreadyUsed[i]++;
            name = name + "(" + arrayNamesAreadyUsed[i] + ")";
        }
        i++;
    });

    addSingleNameArr(name);
    addDomSingleObjName(name, nbObj);
}

function moveNormals(indexObj) {
    var normals = globalThreeOBJs.arrObjNormals[indexObj],
        obj = globalThreeOBJs.meshes[indexObj];
    normals.forEach(function(norm) {
        norm.position.x = obj.position.x;
        norm.position.y = obj.position.y;
        norm.position.z = obj.position.z;
    });
}

function computeNormalsToObj(indexObj, objPosition) {
    var geoNormal = null,
        normal = null,
        normalMaterial = new THREE.LineBasicMaterial({
            color: 0xe00000
        }),
        obj = globalThreeOBJs.meshes[indexObj],
        pos = objPosition,
        numSideTriangle = 3,
        vts = null,
        nrs = null,
        v1x = 0,
        v1y = 0,
        v1z = 0,
        v2x = 0,
        v2y = 0,
        v2z = 0,
        vfa = 0,
        vfb = 0,
        vfc = 0,
        initialGeometry = null,
        normal = null,
        newgeo = null,
        newVertices = null,
        scene = globalThree.scene,
        globalNormals = globalThreeOBJs.arrObjNormals,
        arrayNormals = new Array(),
        norm = 1;

    obj.traverse(function(child) {
        if (child instanceof THREE.Mesh) {
            initialGeometry = child.geometry;
            newgeo = new THREE.Geometry().fromBufferGeometry(initialGeometry);
            vts = newgeo.vertices;
            faces = newgeo.faces;

            faces.forEach(function(f) {
                geoNormal = new THREE.Geometry();
                nrs = f.vertexNormals;
                vfa = vts[f.a];
                vfb = vts[f.b];
                vfc = vts[f.c];
                nra = nrs[0];
                nrb = nrs[1];
                nrc = nrs[2];
                norm = Math.sqrt(nrb.x * nrb.x + nrb.y * nrb.y + nrb.z * nrb.z);

                newVertices = geoNormal.vertices;

                v1x = (vfb.x + pos.x);
                v1y = (vfb.y + pos.y);
                v1z = (vfb.z + pos.z);

                v2x = v1x + (nrb.x / norm);
                v2y = v1y + (nrb.y / norm);
                v2z = v1z + (nrb.z / norm);

                var point1 = new THREE.Vector3(v1x, v1y, v1z),
                    point2 = new THREE.Vector3(v2x, v2y, v2z);

                newVertices.push(point1, point2, point2);
                normal = new THREE.Line(geoNormal, normalMaterial);
                normal.needsUpdate = true;
                arrayNormals.push(normal);
            });
            faces.needsUpdate = true;
            newgeo.computeFaceNormals();
            newgeo.computeVertexNormals();
            initialGeometry = new THREE.BufferGeometry().fromGeometry(newgeo);
            globalNormals.splice(indexObj, 1);
            globalNormals.splice(indexObj, 0, arrayNormals);

        }
    });
}

function addNormalToObj(indexObj) {

    var normals = globalThreeOBJs.arrObjNormals[indexObj],
        scene = globalThree.scene;

    normals.forEach(function(normal) {
        scene.add(normal);
    });
}

function removeNormalFromObj(indexObj) {

    var normals = globalThreeOBJs.arrObjNormals[indexObj],
        scene = globalThree.scene;

    normals.forEach(function(normal) {
        scene.remove(normal);
    });
}


function addOrRemoveNormalFromObj(indexObj) {

    var domObj = $("#addOrRemoveNormal-" + indexObj),
        normalCondition = !globalThreeOBJs.arrNormalBool[indexObj],
        objName = globalThreeOBJs.arrObjName[indexObj];
    if (objName != null) {
        if (normalCondition) {
            addNormalToObj(indexObj, false);
            domObj.attr("src", "./public/css/icon/remove_normal.png");

        } else {
            removeNormalFromObj(indexObj, false);
            domObj.attr("src", "./public/css/icon/add_normal.png");
        }
        globalThreeOBJs.arrNormalBool.splice(indexObj, 1);
        globalThreeOBJs.arrNormalBool.splice(indexObj, 0, normalCondition);
    }
}

function addShade(indexObj, modifiedFromWf) {
    var domElement = $("#addOrRemoveShadding-" + indexObj),
        shades = globalThreeOBJs.shades,
        obj = globalThreeOBJs.meshes[indexObj],
        objMaterial = new THREE.MeshBasicMaterial({ wireframe: globalThreeOBJs.wireframes[indexObj], vertexColors: THREE.VertexColors }),
        geo = null,
        faces = null;

    domElement.attr("src", "./public/css/icon/remove_Shadding.png");
    obj.traverse(function(child) {
        if (child instanceof THREE.Mesh) {
            child.material = objMaterial;
            geo = new THREE.Geometry().fromBufferGeometry(child.geometry);
            faces = geo.faces;
            faces.forEach(function(f) {
                f.color.setRGB(Math.abs(f.normal.x), Math.abs(f.normal.y), Math.abs(f.normal.z));
            });
            geo.computeFaceNormals();
            geo.computeVertexNormals();
            child.geometry = new THREE.BufferGeometry().fromGeometry(geo);
        }
    });
    if (!modifiedFromWf) {
        shades.splice(indexObj, 1);
        shades.splice(indexObj, 0, false);
    } else {
        shades.splice(indexObj, 1);
        shades.splice(indexObj, 0, true);
    }
}

function removeShade(indexObj, modifiedFromCol) {
    var domElement = $("#addOrRemoveShadding-" + indexObj),
        wf = globalThreeOBJs.wireframes[indexObj],
        shades = globalThreeOBJs.shades,
        obj = globalThreeOBJs.meshes[indexObj],
        objColor = "#" + globalThreeOBJs.hexacolors[indexObj].split("_")[0],
        objMaterial = new THREE.MeshBasicMaterial({ color: objColor, wireframe: wf });

    domElement.attr("src", "./public/css/icon/add_Shadding.png");
    obj.traverse(function(child) {
        if (child instanceof THREE.Mesh) {
            child.material = objMaterial;
        }
    });
    if (!modifiedFromCol) {
        shades.splice(indexObj, 1);
        shades.splice(indexObj, 0, true);
    } else {
        shades.splice(indexObj, 1);
        shades.splice(indexObj, 0, false);
    }
}

function addOrRemoveShading(indexObj) {

    var shades = globalThreeOBJs.shades,
        sh = !shades[indexObj];

    if (sh) {
        addShade(indexObj, false);
    } else {
        removeShade(indexObj, false);
    }
    shades.splice(indexObj, 1);
    shades.splice(indexObj, 0, sh);
}

function setObjectColor(hexCol, rgbColor) {

    var focus = globalThreeOBJs.objOnFocus,
        obj = globalThreeOBJs.meshes[focus],
        wf = globalThreeOBJs.wireframes[focus];

    globalThreeOBJs.hexacolors.splice(focus, 1);
    globalThreeOBJs.hexacolors.splice(focus, 0, hexCol + "_" + rgbColor);

    objMat = new THREE.MeshBasicMaterial({ color: "#" + hexCol, wireframe: wf });

    if (globalThreeOBJs.shades[focus]) {
        removeShade(focus, true);
    }

    globalThreeOBJs.meshes[focus].traverse(function(child) {
        child.material = objMat;
    });

}

function manageWireframe(indexObj, wf) {
    var hexaColor = "#" + globalThreeOBJs.hexacolors[indexObj].split("_")[0],
        objMat = new THREE.MeshBasicMaterial({ color: hexaColor, wireframe: wf }),
        obj = globalThreeOBJs.meshes[indexObj];

    obj.traverse(function(child) {
        child.material = objMat;
    });
}

function addOrRemoveWireframe(indexObj) {

    var wf = !globalThreeOBJs.wireframes[indexObj],
        objShade = globalThreeOBJs.shades[indexObj],
        domElement = $("#addOrRemoveWireframe-" + indexObj);

    if (wf) {
        domElement.attr("src", "./public/css/icon/remove_Mesh.png");
        manageWireframe(indexObj, wf);
    } else {
        domElement.attr("src", "./public/css/icon/add_Mesh.png");
        manageWireframe(indexObj, wf);
    }

    globalThreeOBJs.wireframes.splice(indexObj, 1);
    globalThreeOBJs.wireframes.splice(indexObj, 0, wf);
    if (objShade) {
        addShade(indexObj, true);
    }
}



function objectLoader(name) {

    var path = "./public/obj/" + name + ".obj",
        numberOfMeshes = globalThreeOBJs.meshes.length,
        initialObjColors = "ffffff_rgb(255, 255, 255)",
        funHelpArr = globalThreeOBJs.helperFunctions;

    if (name != "") {
        addNameToArray(name);
        $("#loadError").html("");
        try {
            globalThreeOBJs.objloader.load(path, function(obj) {
                obj.traverse(function(child) {
                    if (child instanceof THREE.Mesh) {
                        //child.material.map = texture;
                        child.material = globalThreeOBJs.objMaterials;
                        if (globalThreeOBJs.arrObjName[globalThreeOBJs.arrObjName.length - 1] == "Scene") {
                            child.material = new THREE.MeshBasicMaterial({ color: 0x6666ff, wireframe: false });
                            initialObjColors = "6666ff_rgb(102, 102, 255)";
                        }
                    }
                });

                obj.castShadow = true;
                obj.receiveShadow = true;
                obj.needsUpdate = true;
                globalThreeOBJs.arrNameAlreadyUsed.push(0);
                globalThreeOBJs.arrNormalBool.push(false);
                globalThreeOBJs.hexacolors.push(initialObjColors);
                globalThreeOBJs.wireframes.push(false);
                globalThreeOBJs.shades.push(false);
                addIntoObjArr(obj);
                addtoScene(obj);
                computeNormalsToObj(numberOfMeshes, obj.position);
                $("#currentMeshPosX").html(obj.position.x);
                $("#currentMeshPosY").html(obj.position.y);
                $("#currentMeshPosZ").html(obj.position.z);

            }, funHelpArr[0], funHelpArr[1]);

        } catch (error) {}

    } else {
        $("#loadError").html("Object name was empty");
    }
}

function createAxe(startPoint, endPoint, mat) {
    var geo = new THREE.Geometry(),
        vertices = geo.vertices,
        axe = null;

    vertices.push(startPoint, endPoint, endPoint);
    axe = new THREE.Line(geo, mat);
    globalThree.axes.push(axe);
    globalThree.scene.add(axe);
}

function removeAxes() {
    globalThree.axes.forEach(function(axe) {
        console.log(axe);
        globalThree.scene.remove(axe);
    });
}

function addOrRemoveAxes() {
    var domElement = $("#axes");
    if (globalThree.sceneHasAxes) {
        removeAxes();
        domElement.removeClass("glyphicon-minus-sign");
        domElement.addClass("glyphicon-plus-sign");
        globalThree.sceneHasAxes = false;
    } else {
        globalThree.axes = new Array();
        createAxe(new THREE.Vector3(-30, 0, 0), new THREE.Vector3(30, 0, 0), new THREE.MeshBasicMaterial({ color: 0xff1fff }));
        createAxe(new THREE.Vector3(0, -30, 0), new THREE.Vector3(0, 30, 0), new THREE.MeshBasicMaterial({ color: 0x29ff29 }));
        createAxe(new THREE.Vector3(0, 0, -30), new THREE.Vector3(0, 0, 30), new THREE.MeshBasicMaterial({ color: 0xff8b3d }));
        domElement.removeClass("glyphicon-plus-sign");
        domElement.addClass("glyphicon-minus-sign");
        globalThree.sceneHasAxes = true;
    }
}

function removeOrAddObjFromScene(indexObj, nbToRemove) {

    var domObj = $("#removeOrAdd-" + indexObj),
        name = null;

    manageWireframe(indexObj, globalThreeOBJs.wireframes[indexObj]);

    if (globalThreeOBJs.arrObjName[indexObj] != null) {
        globalThree.scene.remove(globalThreeOBJs.meshes[indexObj]);
        globalThreeOBJs.arrObjName.splice(indexObj, nbToRemove);
        globalThreeOBJs.arrObjName.splice(indexObj, 0, null);
        if (globalThreeOBJs.arrNormalBool[indexObj]) {
            removeNormalFromObj(indexObj);
        }

        domObj.removeClass("glyphicon-minus-sign");
        domObj.addClass("glyphicon-plus-sign");
    } else {
        name = $("#object-" + indexObj).data("name");
        globalThree.scene.add(globalThreeOBJs.meshes[indexObj]);
        globalThreeOBJs.arrObjName.splice(indexObj, nbToRemove);
        globalThreeOBJs.arrObjName.splice(indexObj, 0, name);
        if (globalThreeOBJs.arrNormalBool[indexObj]) {
            addNormalToObj(indexObj);
        }
        if (globalThreeOBJs.shades[indexObj]) {
            addShade(indexObj, true)
        }
        domObj.removeClass("glyphicon-plus-sign");
        domObj.addClass("glyphicon-minus-sign");
    }


}


function addIntoObjArr(obj) {
    globalThreeOBJs.meshes.push(obj);
}

function addSingleNameArr(name) {
    globalThreeOBJs.arrObjName.push(name);
}

function addtoScene(obj) {
    globalThree.scene.add(obj);
}

//https: //github.com/blueimp/jQuery-File-Upload
//http://jscolor.com/
//https://www.npmjs.com/package/thread-js
//http://learningthreejs.com/blog/2013/06/25/monitor-rendering-performance-within-threejs/
//https://jsperf.com/