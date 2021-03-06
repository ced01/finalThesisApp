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
    return delimiter + '<div class="row"><div class="col-md-6"><div id="object-' + indexObj + '" class="object" data-name="' + name + '">' + name + '</div></div><div class="col-md-6"><div id="removeOrAdd-' + indexObj + '" class="icon pull-right" onclick="hideOrShowObj(' + indexObj + ')"><i class="fa fa-minus" aria-hidden="true"></i></div><div class="icon pull-right" onclick="openModalMeshControl(' + indexObj + ');"><i class="fa fa-cog" aria-hidden="true"></i></div></div></div><br><div class="row icon-bar"><div class="col-md-12"><span class="icon" aria-hidden="true"><img id="addOrRemoveNormal-' + indexObj + '" class="imgIcon" onclick="addOrRemoveNormalFromObj(' + indexObj + ')" src="./public/css/icon/Add_normal.png"></span><span class="icon" aria-hidden="true"><img id="addOrRemoveWireframe-' + indexObj + '" class="imgIcon" onclick="addOrRemoveWireframe(' + indexObj + ')" src="./public/css/icon/add_Mesh.png"></span><span class="icon" aria-hidden="true"><img id="addOrRemoveShadding-' + indexObj + '" onclick="addOrRemoveShading(' + indexObj + ')" class="imgIcon" src="./public/css/icon/add_Shadding.png"></span>' + addHtmlForIges + '</div></div>';
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
    if (normals instanceof THREE.LineSegments) {
        normals.geometry.verticesNeedUpdate = true;
        normals.position.x = objPos.x;
        normals.position.y = objPos.y;
        normals.position.z = objPos.z;
    }
}

function computeNormalsToObj(indexObj) {
    var geoNormal = null,
        mesh = globalThreeOBJs.meshes[indexObj].obj,
        pos = globalThreeOBJs.meshes[indexObj].pos,
        vts = null,
        nrs = null,
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

    var globalGeo = new THREE.Geometry();
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

                var v1 = new THREE.Vector3(),
                    v2 = new THREE.Vector3();

                v1.x = (vfc.x + vfa.x + vfb.x) / 3 + pos.x;
                v1.y = (vfc.y + vfa.y + vfb.y) / 3 + pos.y;
                v1.z = (vfc.z + vfa.z + vfb.z) / 3 + pos.z;

                v2.x = v1.x + (nra.x + nrb.x + nrc.x) / norm;
                v2.y = v1.y + (nra.y + nrb.y + nrc.y) / norm;
                v2.z = v1.z + (nra.z + nrb.z + nrc.z) / norm;

                geoNormal.vertices.push(v1);
                geoNormal.vertices.push(v2);

                globalGeo.merge(geoNormal);
            });
        }
    });
    globalThreeOBJs.meshes[indexObj].arrNorm = globalGeo;
}

function addNormalToObj(indexObj) {

    if (globalThreeOBJs.meshes[indexObj].arrNorm == null) {
        computeNormalsToObj(globalThreeOBJs.meshes[indexObj].id);
    }
    var normalMaterial = new THREE.LineBasicMaterial({
            color: 0xe00000,
            linewidth: 0.3
        }),
        normalMesh = globalThreeOBJs.meshes[indexObj].arrNorm;

    if (!(normalMesh instanceof THREE.LineSegments)) {

        normalMesh = new THREE.LineSegments(normalMesh, normalMaterial);
        globalThreeOBJs.meshes[indexObj].arrNorm = normalMesh;
    }
    globalThree.scene.add(normalMesh);
}

function removeNormalFromObj(indexObj) {
    globalThree.scene.remove(globalThreeOBJs.meshes[indexObj].arrNorm);
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
                f.color.needsUpdate = true;
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
    var object3d = globalThreeOBJs.meshes[indexObj],
        nbface = 0,
        geo = null,
        faces = null;
    if (object3d.strGcurv == "") {
        var instance = new Module.FinalSurface(object3d.file, ~~globalThreeOBJs.meshSize);
        instance.computeGaussian();
        object3d.strGcurv = instance.G_colors_output;
        instance.delete();

        var faceColors = object3d.strGcurv.split("\n"),
            initialArr = new Array("0", "0", "0"),
            currentPoint = initialArr,
            previousPoint = initialArr,
            meshQPoint = initialArr,
            qm = parseInt(globalThreeOBJs.meshSize),
            c;

        for (c = 0; c < faceColors.length - 2; c++) {
            if (c % (qm - 1) != 0) {
                currentPoint = faceColors[c].split("  ");
                if (c - 1 > 0) {
                    previousPoint = faceColors[c - 1].split("  ");
                }
                if (c + qm < faceColors.length - 2) {
                    meshQPoint = faceColors[c + qm].split("  ");
                }
                arr = new Array();
                r = (parseFloat(currentPoint[0]) + parseFloat(previousPoint[0]) + parseFloat(meshQPoint[0])) / 3;
                g = (parseFloat(currentPoint[1]) + parseFloat(previousPoint[1]) + parseFloat(meshQPoint[1])) / 3;
                b = (parseFloat(currentPoint[2]) + parseFloat(previousPoint[2]) + parseFloat(meshQPoint[2])) / 3;
                arr.push(r.toString(), g.toString(), b.toString());
                object3d.arrayColorG.push(arr, arr);

            }
        }
    }
    $("#addOrRemoveGColor-" + indexObj).attr("src", "./public/css/icon/remove_GColor.png");
    object3d.obj.traverse(function(child) {
        if (child instanceof THREE.Mesh) {
            child.material = new THREE.MeshBasicMaterial({ wireframe: object3d.wf, side: THREE.DoubleSide, vertexColors: THREE.FaceColors });
            geo = new THREE.Geometry().fromBufferGeometry(child.geometry);
            faces = geo.faces;
            faces.forEach(function(f) {
                f.color.setRGB(object3d.arrayColorG[nbface][0], object3d.arrayColorG[nbface][1], object3d.arrayColorG[nbface][2]);
                nbface++;
            });
            child.geometry = new THREE.BufferGeometry().fromGeometry(geo);
        }
    });
    object3d.gc = true;
}


function removeGaussianColor(indexObj) {
    var object3d = globalThreeOBJs.meshes[indexObj];
    $("#addOrRemoveGColor-" + indexObj).attr("src", "./public/css/icon/add_GColor.png");
    object3d.obj.traverse(function(child) {
        if (child instanceof THREE.Mesh) {
            child.material = new THREE.MeshBasicMaterial({ color: "#" + object3d.color.split("_")[0], wireframe: object3d.wf, side: THREE.DoubleSide });
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
            child.material = new THREE.MeshBasicMaterial({ color: "#" + hexCol, wireframe: object3d.wf, side: THREE.DoubleSide });;
        });
    }
}

function manageWireframe(indexObj, wirfra) {

    var object3d = globalThreeOBJs.meshes[indexObj];
    object3d.obj.traverse(function(child) {
        if (globalThreeOBJs.meshes[indexObj].sh || globalThreeOBJs.meshes[indexObj].gc) {
            child.material = new THREE.MeshBasicMaterial({ wireframe: wirfra, side: THREE.DoubleSide, vertexColors: THREE.FaceColors });
        } else {
            child.material = new THREE.MeshBasicMaterial({ color: "#" + object3d.color.split("_")[0], wireframe: wirfra, side: THREE.DoubleSide });
        }
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
                var obj3D = new mesh(numberOfMeshes, object, name, object.position, initialObjColors, false, false, false, false, null, new Array());
                addIntoObjArr(obj3D);
                addDomSingleObjName(obj3D.id, obj3D.name);
                addtoScene(obj3D.obj);
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
        domElement.removeClass("fa-times");
        domElement.addClass("fa-plus");
        globalThree.sceneHasAxes = false;
    } else {
        globalThree.axes = new Array();
        createAxe(new THREE.Vector3(-30, 0, 0), new THREE.Vector3(30, 0, 0), new THREE.MeshBasicMaterial({ color: 0xff1fff }));
        createAxe(new THREE.Vector3(0, -30, 0), new THREE.Vector3(0, 30, 0), new THREE.MeshBasicMaterial({ color: 0x29ff29 }));
        createAxe(new THREE.Vector3(0, 0, -30), new THREE.Vector3(0, 0, 30), new THREE.MeshBasicMaterial({ color: 0xff8b3d }));
        domElement.removeClass("fa-plus");
        domElement.addClass("fa-times");
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
        domObj.html("<i class='fa fa-minus' aria-hidden='true'></i>");

    } else {
        globalThree.scene.remove(object3d.obj);
        if (object3d.n) {
            removeNormalFromObj(indexObj);
        }
        object3d.hidden = true;
        domObj.html("<i class='fa fa-plus' aria-hidden='true'></i>");
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