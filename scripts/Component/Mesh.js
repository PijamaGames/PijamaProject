class Mesh extends Component{
  get type() {
    return "Mesh";
  }

  constructor(_modelName){
    super();
    //vertex pos, triangle index, normals, tex coords
    let model = gameController.resources.models.get(_modelName);
    //console.log(model);
    if(model){
      this.model = model;
      this.vertices = model.vertices;
      this.indices = model.indices;
      this.texCoords = model.texCoords;
      //this.normals = model.normals;
    }
    else{
      this.vertices = new Float32Array(0);
      this.indices = new Uint16Array(0);
      this.texCoords = new Float32Array(0);
      this.DefaultPlane();
      //this.normals = new Float32Array(0);
    }
  }

  SetVertices(_vertices){
    this.vertices = new Float32Array(_vertices);
  }
  SetIndices(_indices){
    this.indices = new Uint16Array(_indices);
  }
  /*SetNormals(_normals){
    this.normals = new Float32Array(_normals);
  }*/
  SetTexCoords(_texCoords){
    this.texCoords = new Float32Array(_texCoords);
  }

  DefaultPlane(){
    this.SetVertices([
      -0.5,-0.5,0.0,
      -0.5,0.5,0.0,
       0.5,0.5,0.0,
       0.5,-0.5,0.0
    ]);
    this.SetIndices([
      0,2,1,0,3,2
    ]);
    this.SetTexCoords([
      0.0,0.0,
      0.0,1.0,
      1.0,1.0,
      1.0,0.0
    ]);
  }

}
