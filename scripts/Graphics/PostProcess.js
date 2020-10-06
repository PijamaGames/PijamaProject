class PostProcess {
  constructor(fragmentShader, _fboRead = null, _fboWrite = null) {
    this.active = true;
    this.fboRead = _fboRead;
    this.fboWrite = _fboWrite;


    let length = Graphics.postProcessEffects.length;
    if (length > 0) {
      var fbo = Graphics.CreateFrameBuffer(false);
      this.fboRead = fbo;
      Graphics.postProcessEffects[length - 1].fboWrite = fbo;
    }
    Graphics.postProcessEffects.push(this);

    Program.CreateProgram(this,
      gameController.resources.shaders.get('vs_postProcess'),
      gameController.resources.shaders.get(fragmentShader)
    );

    this.CreatePlane();
    this.uniforms = [];
  }

  Render() {
    let gl = Graphics.gl;
    //console.log('activating frameBuffer ' + this.fboWrite);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fboWrite);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //gl.clear(/*gl.COLOR_BUFFER_BIT | */gl.DEPTH_BUFFER_BIT);
    gl.disable(gl.DEPTH_TEST);
    gl.useProgram(this.program);
    this.SetBuffers();
    this.SetUniforms();
    this.ActivateTextures();
    gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
    //gl.enable(gl.DEPTH_TEST);
  }

  ActivateTextures(){
    let gl = Graphics.gl;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.fboRead.texture);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, Graphics.depthFBO.texture);
    /*gl.bindTexture(gl.TEXTURE2D, this.fboRead.depthBuffer);
    gl.activeTexture(gl.TEXTURE1);*/
  }

  SetBuffers(){
    let gl = Graphics.gl;
    //TRIANGLE INDICES
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

    //VERTEX POSITIONS
    gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);

    gl.vertexAttribPointer(
      this.verticesLocation, //Attribute location
      2, //Number of elements per attribute
      gl.FLOAT, //Type of elements
      gl.FALSE,
      2 * Float32Array.BYTES_PER_ELEMENT, //Size of an individual vertexShader
      0 //Offset from the beginning of a single vertex to this attribute
    );
    gl.enableVertexAttribArray(this.verticesLocation);

    //TEX COORDS
    gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.texCoords, gl.STATIC_DRAW);
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
      uniform.Load(gameController.currentScene);
    }
  }

  CreatePlane() {
    let gl = Graphics.gl;

    this.vertices = new Float32Array([
      -1.0, -1.0,
      -1.0, 1.0,
      1.0, 1.0,
      1.0, -1.0
    ]);

    this.indices = new Uint16Array([
      0, 2, 1, 0, 3, 2
    ]);

    this.texCoords = new Float32Array([
      0.0, 0.0,
      0.0, 1.0,
      1.0, 1.0,
      1.0, 0.0
    ]);

    this.verticesBuffer = Graphics.gl.createBuffer();
    this.indicesBuffer = Graphics.gl.createBuffer();
    this.texCoordsBuffer = Graphics.gl.createBuffer();

    this.verticesLocation = gl.getAttribLocation(this.program, 'vertPosition');
    this.texCoordsLocation = gl.getAttribLocation(this.program, 'texCoords');
  }
}
