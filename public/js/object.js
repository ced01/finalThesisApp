function addDomSingleObjName(indexObj, name) {
    var generalhtml = "",
        igeshtml = '<span class="icon" aria-hidden="true"><img id="addOrRemoveGColor-' + indexObj + '" onclick="addOrRemoveGColor(' + indexObj + ')" class="imgIcon" src="./public/css/icon/add_GColor.png"></span>';
    if (globalThreeOBJs.meshes[indexObj] instanceof igesMesh) {
        html = generateHTML(indexObj, name, "<hr>", igeshtml);
    } else {
        if (indexObj == 0) {
            html = generateHTML(indexObj, name, "", "");
        } else {
            html = html = generateHTML(indexObj, name, "<hr>", "");
        }
    }
    $("#objectDiv").append(html);
}

function generateHTML(indexObj, name, delimiter, addHtmlForIges) {
    return delimiter + '<div class="row"><div class="col-md-6"><div id="object-' + indexObj + '" class="object" data-name="' + name + '">' + name + '</div></div><div class="col-md-6"><div id="removeOrAdd-' + indexObj + '" class="glyphicon glyphicon-minus-sign icon pull-right" onclick="hideOrShowObj(' + indexObj + ')"></div><div class="pull-right glyphicon glyphicon-cog icon" onclick="openModalMeshControl(' + indexObj + ');"></div></div></div><br><div class="row icon-bar"><div class="col-md-12"><span class="icon" aria-hidden="true"><img id="addOrRemoveNormal-' + indexObj + '" class="imgIcon" onclick="addOrRemoveNormalFromObj(' + indexObj + ')" src="./public/css/icon/Add_normal.png"></span><span class="icon" aria-hidden="true"><img id="addOrRemoveWireframe-' + indexObj + '" class="imgIcon" onclick="addOrRemoveWireframe(' + indexObj + ')" src="./public/css/icon/add_Mesh.png"></span><span class="icon" aria-hidden="true"><img id="addOrRemoveShadding-' + indexObj + '" onclick="addOrRemoveShading(' + indexObj + ')" class="imgIcon" src="./public/css/icon/add_Shadding.png"></span>' + addHtmlForIges + '</div></div>';
}

function checkName(name) {
    var i = 0;

    globalThreeOBJs.meshes.forEach(function(object) {
        if (object.name === name) {
            globalThreeOBJs.arrNameAlreadyUsed.push(object.name);
        }
    });

    globalThreeOBJs.arrNameAlreadyUsed.forEach(function(nameUsed) {
        if (nameUsed === name) {
            i++;
        }
    });
    if (globalThreeOBJs.arrNameAlreadyUsed[i] != null) {
        name = name + "(" + i + ")";
    }
    return name;
}

function moveNormals(indexObj) {
    var normals = globalThreeOBJs.meshes[indexObj].arrNorm,
        objPos = globalThreeOBJs.meshes[indexObj].pos;
    normals.forEach(function(norm) {
        norm.position.x = objPos.x;
        norm.position.y = objPos.y;
        norm.position.z = objPos.z;
    });
}

function computeNormalsToObj(indexObj) {
    var geoNormal = null,
        normalMaterial = new THREE.LineBasicMaterial({
            color: 0xe00000,
            linewidth: 0.1
        }),
        mesh = globalThreeOBJs.meshes[indexObj].obj,
        pos = globalThreeOBJs.meshes[indexObj].pos,
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
        globalNormals = globalThreeOBJs.meshes[indexObj].arrNorm,
        norm = 1;

    mesh.traverse(function(child) {
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
                norm = Math.sqrt((nra.x + nrb.x + nrc.x) * (nra.x + nrb.x + nrc.x) + (nra.y + nrb.y + nrc.y) * (nra.y + nrb.y + nrc.y) + (nra.z + nrb.z + nrc.z) * (nra.z + nrb.z + nrc.z));

                newVertices = geoNormal.vertices;

                v1x = (vfc.x + vfa.x + vfb.x) / 3 + pos.x;
                v1y = (vfc.y + vfa.y + vfb.y) / 3 + pos.y;
                v1z = (vfc.z + vfa.z + vfb.z) / 3 + pos.z;

                v2x = v1x + (nra.x + nrb.x + nrc.x) / norm;
                v2y = v1y + (nra.y + nrb.y + nrc.y) / norm;
                v2z = v1z + (nra.z + nrb.z + nrc.z) / norm;

                var point1 = new THREE.Vector3(v1x, v1y, v1z),
                    point2 = new THREE.Vector3(v2x, v2y, v2z);

                newVertices.push(point1, point2);
                normal = new THREE.LineSegments(geoNormal, normalMaterial);
                globalThreeOBJs.meshes[indexObj].arrNorm.push(normal);
            });

            initialGeometry = new THREE.BufferGeometry().fromGeometry(newgeo);
        }
    });
}

function addNormalToObj(indexObj) {

    var normals = globalThreeOBJs.meshes[indexObj].arrNorm,
        scene = globalThree.scene;
    normals.forEach(function(n) {
        scene.add(n);
    });
}

function removeNormalFromObj(indexObj) {

    var normals = globalThreeOBJs.meshes[indexObj].arrNorm,
        scene = globalThree.scene;
    normals.forEach(function(n) {
        scene.remove(n);
    });
}

function addOrRemoveNormalFromObj(indexObj) {

    var domObj = $("#addOrRemoveNormal-" + indexObj),
        normalCondition = globalThreeOBJs.meshes[indexObj].n;

    if (globalThreeOBJs.meshes[indexObj].name != null) {
        if (normalCondition) {
            removeNormalFromObj(indexObj, false);
            $("#addOrRemoveNormal-" + indexObj).attr("src", "./public/css/icon/Add_normal.png");
            globalThreeOBJs.meshes[indexObj].n = false;
        } else {
            addNormalToObj(indexObj, false);
            $("#addOrRemoveNormal-" + indexObj).attr("src", "./public/css/icon/remove_normal.png");
            globalThreeOBJs.meshes[indexObj].n = true;
        }
    }
}

function addShade(indexObj, modifiedFromWf) {
    var domElement = $("#addOrRemoveShadding-" + indexObj),
        object3d = globalThreeOBJs.meshes[indexObj],
        geo = null,
        faces = null;

    domElement.attr("src", "./public/css/icon/remove_Shadding.png");
    object3d.obj.traverse(function(child) {
        if (child instanceof THREE.Mesh) {
            child.material = new THREE.MeshBasicMaterial({ wireframe: object3d.wf, side: THREE.DoubleSide, vertexColors: THREE.FaceColors });
            geo = new THREE.Geometry().fromBufferGeometry(child.geometry);
            faces = geo.faces;
            faces.forEach(function(f) {
                f.needsUpdate = true;
                f.color.setRGB(Math.abs(f.normal.x), Math.abs(f.normal.y), Math.abs(f.normal.z));

            });
            child.geometry = new THREE.BufferGeometry().fromGeometry(geo);
        }
    });
    object3d.sh = true;
}

function removeShade(indexObj, modifiedFromCol) {

    var object3d = globalThreeOBJs.meshes[indexObj],
        objMaterial = new THREE.MeshBasicMaterial({ color: "#" + object3d.color.split("_")[0], wireframe: object3d.wf, side: THREE.DoubleSide });
    $("#addOrRemoveShadding-" + indexObj).attr("src", "./public/css/icon/add_Shadding.png");
    object3d.obj.traverse(function(child) {
        if (child instanceof THREE.Mesh) {
            child.material.needsUpdate = true;
            child.material = objMaterial;
        }
    });
    object3d.sh = false;
}

function addOrRemoveShading(indexObj) {

    if (globalThreeOBJs.meshes[indexObj].sh) {
        removeShade(indexObj, false);
    } else {
        addShade(indexObj, false);
    }
}

function addOrRemoveGColor(indexObj) {

    if (globalThreeOBJs.meshes[indexObj].gc) {
        removeGaussianColor(indexObj);
    } else {
        addGaussianColor(indexObj);
    }
}

function addGaussianColor(indexObj) {
    var domElement = $("#addOrRemoveGColor-" + indexObj),
        object3d = globalThreeOBJs.meshes[indexObj];
    if (object3d instanceof igesMesh) {
        var stringColors = object3d.strGcurv,
            geo = null,
            faces = null;
        domElement.attr("src", "./public/css/icon/remove_GColor.png");
        object3d.obj.traverse(function(child) {
            if (child instanceof THREE.Mesh) {
                console.log(object3d.wh);
                child.material = new THREE.MeshBasicMaterial({ wireframe: object3d.wh, side: THREE.DoubleSide, vertexColors: THREE.VertexColors });
                geo = new THREE.Geometry().fromBufferGeometry(child.geometry);
                faces = geo.faces;
                var faceColors = stringColors.split("\n"),
                    nbface = 0;
                var c, f = 0;
                for (c = 0; c < faceColors.length; c++) {
                    if (faceColors[c] != "") {
                        var col = faceColors[c].split("  ");
                        for (f = nbface; f < nbface + 2; f++) {
                            if (faceColors[c] != "" && faces[f] != undefined) {
                                faces[f].color.setRGB(col[0], col[1], col[2]);
                            }
                        }
                        nbface += 2;
                    }
                }
                child.geometry = new THREE.BufferGeometry().fromGeometry(geo);
            }
        });
        object3d.gc = true;
    }
}


function removeGaussianColor(indexObj) {


    var object3d = globalThreeOBJs.meshes[indexObj];
    $("#addOrRemoveGColor-" + indexObj).attr("src", "./public/css/icon/add_GColor.png");
    object3d.obj.traverse(function(child) {
        if (child instanceof THREE.Mesh) {
            child.material = new THREE.MeshBasicMaterial({ color: "#" + object3d.color.split("_")[0], side: THREE.DoubleSide, wireframe: object3d.wh });
        }
    });
    object3d.gc = false;
}

function setObjectColor(hexCol, rgbColor) {

    if (hexCol != undefined || rgbColor != undefined) {
        var focus = globalThreeOBJs.objOnFocus,
            object3d = globalThreeOBJs.meshes[focus];

        object3d.color = hexCol + "_" + rgbColor;
        object3d.obj.traverse(function(child) {
            child.material = new THREE.MeshBasicMaterial({ color: "#" + hexCol, side: THREE.DoubleSide, wireframe: object3d.wf });;
        });
    }
}

function manageWireframe(indexObj, wirfra) {

    var object3d = globalThreeOBJs.meshes[indexObj];
    object3d.obj.traverse(function(child) {
        child.material = new THREE.MeshBasicMaterial({ color: "#" + object3d.color.split("_")[0], wireframe: wirfra, side: THREE.DoubleSide });
    });
    object3d.wf = wirfra;
}

function addOrRemoveWireframe(indexObj) {

    var domElement = $("#addOrRemoveWireframe-" + indexObj);

    if (globalThreeOBJs.meshes[indexObj].wf) {
        domElement.attr("src", "./public/css/icon/add_Mesh.png");
        manageWireframe(indexObj, false);
    } else {
        domElement.attr("src", "./public/css/icon/remove_Mesh.png");
        manageWireframe(indexObj, true);
    }
    if (globalThreeOBJs.meshes[indexObj].sh) {
        addShade(indexObj, true);
    }
    if (globalThreeOBJs.meshes[indexObj].gc) {
        addGaussianColor(indexObj);
    }
}

function objectLoader(name) {

    var path = "./public/obj/" + name + ".obj",
        numberOfMeshes = globalThreeOBJs.meshes.length,
        initialObjColors = "ffffff_rgb(255, 255, 255)",
        funHelpArr = globalThreeOBJs.helperFunctions;


    if (name != "") {
        name = checkName(name);
        $("#loadError").html("");
        try {
            globalThreeOBJs.objloader.load(path, function(object) {
                object.traverse(function(child) {
                    if (child instanceof THREE.Mesh) {
                        child.material.needsUpdate = true;
                        if (name == "Scene" && globalThreeOBJs.meshes.length == 0) {
                            child.material = new THREE.MeshBasicMaterial({ color: 0x6666ff, side: THREE.DoubleSide, wireframe: false, vertexColors: THREE.NoColors });
                            initialObjColors = "6666ff_rgb(102, 102, 255)";
                        } else {
                            child.material = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, wireframe: false, vertexColors: THREE.NoColors });
                        }
                    }
                });

                object.castShadow = true;
                object.receiveShadow = true;
                object.needsUpdate = true;
                var obj3D = new mesh(numberOfMeshes, object, name, object.position, initialObjColors, false, false, false, false, new Array(), new Array());
                addIntoObjArr(obj3D);
                addDomSingleObjName(obj3D.id, obj3D.name);
                addtoScene(obj3D.obj);
                computeNormalsToObj(obj3D.id);
                $("#currentMeshPosX").html(obj3D.pos.x);
                $("#currentMeshPosY").html(obj3D.pos.y);
                $("#currentMeshPosZ").html(obj3D.pos.z);

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

function hideOrShowObj(indexObj) {

    var domObj = $("#removeOrAdd-" + indexObj),
        object3d = globalThreeOBJs.meshes[indexObj];

    if (object3d.hidden) {
        name = $("#object-" + indexObj).data("name");
        globalThree.scene.add(object3d.obj);
        if (object3d.n) {
            addNormalToObj(indexObj);
        }
        if (object3d.sh) {
            addShade(indexObj, true)
        }
        if (object3d instanceof igesMesh && object3d.gc) {
            addGaussianColor(indexObj);
        }
        if (object3d.wh) {
            manageWireframe(indexObj, object3d.wh);
        }
        object3d.hidden = false;
        domObj.removeClass("glyphicon-plus-sign");
        domObj.addClass("glyphicon-minus-sign");

    } else {
        globalThree.scene.remove(object3d.obj);
        if (object3d.n) {
            removeNormalFromObj(indexObj);
        }
        object3d.hidden = true;
        domObj.removeClass("glyphicon-minus-sign");
        domObj.addClass("glyphicon-plus-sign");
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
//http://learningthreejs.com/blog/2013/06/25/monitor-rendering-performance-within-threejs/
//https://jsperf.com/