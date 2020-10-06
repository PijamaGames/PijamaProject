class Program {
  constructor(_name, _order, _vertexShaderText, _fragmentShaderText, _textureUnitOffset = 0, _addToProgramList = true) {
    this.name = _name;
    this.order = _order;
    this.textureUnitOffset = _textureUnitOffset;

    if(_addToProgramList){
      Graphics.programs.set(this.name,this);
      Graphics.programsOrdered.push(this);
      Graphics.programsOrdered.sort(function(a,b){return b.order-a.order});
    }

    this.renderers = new Map();
    Program.CreateProgram(this, _vertexShaderText, _fragmentShaderText);

    this.verticesBuffer = Graphics.gl.createBuffer();
    this.indicesBuffer = Graphics.gl.createBuffer();
    //this.normalsBuffer = Graphics.gl.createBuffer();
    this.texCoordsBuffer = Graphics.gl.createBuffer();

    this.GetAttribLocations();
    this.uniforms = [];
    this.constUniforms = [];
    this.constTextures = [];
    this.uniforms.push(
      new Uniform('mWorld', this, function(gameObject) {
        Graphics.gl.uniformMatrix4fv(this.location, Graphics.gl.FALSE, gameObject.transform.modelMat);
      }
    ));

    this.viewUniform = new Uniform('mView', this, function(camera) {
      Graphics.gl.uniformMatrix4fv(this.location, Graphics.gl.FALSE, camera.viewMat);
    });
    //this.constUniforms.push(this.viewUniform);

    this.projUniform = new Uniform('mProj', this, function(camera) {
      Graphics.gl.uniformMatrix4fv(this.location, Graphics.gl.FALSE, camera.projMat);
    });
    //this.constUniforms.push(this.projUniform);
  }

  GetAttribLocations() {
    let gl = Graphics.gl;
    this.verticesLocation = gl.getAttribLocation(this.program, 'vertPosition');
    //this.normalsLocation = gl.getAttribLocation(this.program, 'normals');
    this.texCoordsLocation = gl.getAttribLocation(this.program, 'texCoords');
  }

  SetBuffers(mesh) {
    let gl = Graphics.gl;
    //TRIANGLE INDICES
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.indices, gl.STATIC_DRAW);

    //VERTEX POSITIONS
    gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, mesh.vertices, gl.STATIC_DRAW);

    gl.vertexAttribPointer(
      this.verticesLocation, //Attribute location
      3, //Number of elements per attribute
      gl.FLOAT, //Type of elements
      gl.FALSE,
      3 * Float32Array.BYTES_PER_ELEMENT, //Size of an individual vertexShader
      0 //Offset from the beginning of a single vertex to this attribute
    );
    gl.enableVertexAttribArray(this.verticesLocation);

    //TEX COORDS
    gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, mesh.texCoords, gl.STATIC_DRAW);
    //console.log(this.texCoordsLocation);
    gl.vertexAttribPointer(
      this.texCoordsLocation, //Attribute location
      2, //Number of elements per attribute
      gl.FLOAT, //Type of elements
      gl.FALSE,
      2 * Float32Array.BYTES_PER_ELEMENT, //Size of an individual vertexShader
      0 //Offset from the beginning of a single vertex to this attribute
    );
    gl.enableVertexAttribArray(this.texCoordsLocation);
  }

  SetUniforms(renderer) {
    for (var uniform of this.uniforms) {
      uniform.Load(renderer.gameObject);
    }
  }

  SetConstUniforms(){
    this.viewUniform.Load(gameController.currentScene.camera);
    this.projUniform.Load(gameController.currentScene.camera);

    for (var uniform of this.constUniforms) {
      uniform.Load(gameController.currentScene);
    }
  }

  SetConstTextures(){
    for(var i = 0; i < this.constTextures.length; i++){
      Graphics.gl.activeTexture(Graphics.gl.TEXTURE0+this.textureUnitOffset+i);
      Graphics.gl.bindTexture(Graphics.gl.TEXTURE_2D, this.constTextures[i]);
    }
  }

  Render() {
    var renderer;
    var mesh;
    Graphics.gl.useProgram(this.program);
    this.SetConstUniforms();
    this.SetConstTextures();
    //Graphics.gl.isEnabled(Graphics.gl.DEPTH_TEST);

    for (var [key,value] of this.renderers) {
      renderer = value;
      mesh = renderer.gameObject.mesh;
      if (mesh) {
        this.SetBuffers(mesh);
        this.SetUniforms(renderer);
        renderer.ActivateTextures();
        Graphics.gl.drawElements(Graphics.gl.TRIANGLES, mesh.indices.length, Graphics.gl.UNSIGNED_SHORT, 0);
      }
    }

  }

  static CreateProgram(program, vertexShaderText, fragmentShaderText) {
    let gl = Graphics.gl;
    program.vertexShader = gl.createShader(gl.VERTEX_SHADER);
    program.fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);


    gl.shaderSource(program.vertexShader, vertexShaderText);
    gl.shaderSource(program.fragmentShader, fragmentShaderText);

    gl.compileShader(program.vertexShader);
    if (!gl.getShaderParameter(program.vertexShader, gl.COMPILE_STATUS)) {
      console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(program.vertexShader));
      return;
    }

    gl.compileShader(program.fragmentShader);
    if (!gl.getShaderParameter(program.fragmentShader, gl.COMPILE_STATUS)) {
      console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(program.fragmentShader));
      return;
    }

    program.program = gl.createProgram();
    gl.attachShader(program.program, program.vertexShader);
    gl.attachShader(program.program, program.fragmentShader);
    gl.linkProgram(program.program);
    if (!gl.getProgramParameter(program.program, gl.LINK_STATUS)) {
      console.error('ERROR linking program!', gl.getProgramInfoLog(program.program));
      return;
    }
  }
}
