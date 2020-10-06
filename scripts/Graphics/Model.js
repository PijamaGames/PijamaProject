class Model {
  constructor(_name, _objText) {
    //console.log(_name);
    this.name = _name;
    this.ProcessObj(_objText);
  }

  ProcessObj(objText) {
    var lines = objText.match(/[^\r\n]+/g) //objText.split('\n');
    //console.log(lines[5]);
    let v = [];
    let vt = [];
    let indices = [];
    let vtIndices = [];
    let relations = []
    //let vn = [];
    for (var line of lines) {
      var elements = line.split(' ');
      if (elements.length > 0) {
        switch (elements[0]) {
          case 'v':
            v.push(elements[1]);
            v.push(elements[2]);
            v.push(elements[3]);
            break;
          case 'vt':
            vt.push([elements[1], -elements[2]+1.0]);
            break;
            /*case 'vn':
              vn.push(elements[1]);
              vn.push(elements[2]);
              vn.push(elements[3]);
              break;*/
          case 'f':
            //v/vt/n
            if (elements.length > 4) {
              console.error("Trying to load non-triangulated mesh");
              break;
            }
            let v1 = elements[1].split('/');
            let v2 = elements[2].split('/');
            let v3 = elements[3].split('/');

            v1[0] -= 1;
            v2[0] -= 1;
            v3[0] -= 1;
            v1[1] -= 1;
            v2[1] -= 1;
            v3[1] -= 1;

            v1[0] = this.CheckRelations(v, relations, v1[0], v1[1]);
            v2[0] = this.CheckRelations(v, relations, v2[0], v2[1]);
            v3[0] = this.CheckRelations(v, relations, v3[0], v3[1]);

            indices.push(v1[0]);
            indices.push(v2[0]);
            indices.push(v3[0]);

            vtIndices[v1[0]] = v1[1];
            vtIndices[v2[0]] = v2[1];
            vtIndices[v3[0]] = v3[1];

            break;
        }
      }
    }

    this.vertices = new Float32Array(v);
    this.indices = new Uint16Array(indices);

    this.texCoords = new Float32Array(vt.length * 2);
    //console.log(vt);
    //console.log(vtIndices);
    //console.log("vt length: " + vt.length);
    //console.log("vtIndices length: " + vtIndices.length);
    for (var i = 0; i < vtIndices.length; i++) {
      this.texCoords[i * 2] = vt[vtIndices[i]][0];
      this.texCoords[i * 2 + 1] = vt[vtIndices[i]][1];
    }
  }

  CheckRelations(vertices, relations, vertex, texCoord){
    if (relations[vertex] == null) { //If there's no vertex-texture relation yet
      relations[vertex] = [];
      relations[vertex].push([vertex, texCoord]);
    } else { //If there's already relations
      //We first check if we've already created a vertex with the specified texture coordinates
      let created = false;
      let length = relations[vertex].length;
      for (var i = 0; i < length && !created; i++) { //for every relation
        if (relations[vertex][i][1] == texCoord) { //if the relation vertex-coordinate has already been created
          created = true;
          vertex = relations[vertex][i][0]; //Use the specified vertex index for this texture coordinate
        }
      }
      //If it's not been created, we must create a vertex for this texture coordinate
      if (!created) {
        var index = vertices.length / 3;
        vertices.push(vertices[vertex * 3]);
        vertices.push(vertices[vertex * 3 + 1]);
        vertices.push(vertices[vertex * 3 + 2]);

        //console.log("creating vertex for index " + index);
        relations[vertex].push([index, texCoord]);
        vertex = index;
      }
    }
    return vertex;
  }
}
