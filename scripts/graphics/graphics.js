var canvas = document.getElementById('game_surface');
var gl;
class Graphics{
  constructor(){
    this.programs = new Map();
    this.InitContext();
  }

  InitContext(){
    gl = canvas.getContext('webgl');
    if (!gl) {
      Log('WebGL not supported, falling back to experimental WebGL');
      gl = canvas.getContext('experimental-webgl');
    }

    if (!gl) alert('Your browser does not support WebGL');

    //canvas.width = window.innerWidth* window.devicePixelRatio;
    //canvas.height = window.innerHeight* window.devicePixelRatio;
    gl.viewport(0,0,canvas.width,canvas.height);

    gl.clearColor(0.3, 0.7, 1.0, 1.0); //Blue by default
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    //gl.disable(gl.DEPTH_TEST);
    //gl.enable(gl.CULL_FACE);
    //gl.frontFace(gl.CCW);
    //gl.cullFace(gl.BACK);
    Log('Graphic context initiated');
  }

  LoadResources(){
    this.CreateBuffers();
    this.CreatePrograms();
  }

  Render(scene){

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    this.programs.get('opaque').Render();
    //this.SetBuffers(program);

  }

  Draw(){
    gl.drawElements(gl.TRIANGLES, this.mesh.indices.length, gl.UNSIGNED_SHORT, 0);
  }

  CreatePrograms(){

    let opaqueProgram = new Program('opaque', 'vs_opaque', 'fs_opaque');
    let tileMap = resources.textures.get('tileMap');
    opaqueProgram.SetConstUniforms([
      new UniformTex('tileMap', opaqueProgram, 'tileMap'),
      new Uniform2f('tileMapRes', opaqueProgram, ()=>new Vec2(tileMap.width, tileMap.height))
    ]);
    opaqueProgram.SetUniforms([
      new Uniform2f('camPosition', opaqueProgram, ()=>manager.scene.camera.transform.position)
    ]);
    /*uniform vec2 anchor;
    uniform vec2 scale;
    uniform vec2 position;
    uniform float height;*/
    opaqueProgram.SetObjUniforms([
      new Uniform2f('tile', opaqueProgram, (obj)=>obj.renderer.tile),
      new Uniform2f('anchor', opaqueProgram, (obj)=>obj.transform.anchor),
      new Uniform2f('scale', opaqueProgram, (obj)=>obj.transform.scale),
      new Uniform2f('position', opaqueProgram, (obj)=>obj.transform.position),
      new Uniform1f('height', opaqueProgram, (obj)=>obj.transform.height),
      new Uniform1f('vertical', opaqueProgram, (obj)=>obj.renderer.vertical ? 1.0 : 0.0)
    ]);
  }

  CreateBuffers(){
    this.mesh = new Object();
    this.mesh.vertices= new Float32Array([
      -1,-1,
      -1,1,
      1,1,
      1,-1
    ]);
    this.mesh.indices = new Uint16Array([
      0,2,1,0,3,2
    ]);
    this.mesh.texCoords = new Float32Array([
      0,0,
      0,1,
      1,1,
      1,0
    ]);

    this.verticesBuffer = gl.createBuffer();
    this.indicesBuffer = gl.createBuffer();
    this.texCoordsBuffer = gl.createBuffer();

    //TRIANGLE INDICES
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.mesh.indices, gl.STATIC_DRAW);

    //VERTEX POSITIONS
    gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.mesh.vertices, gl.STATIC_DRAW);

    //TEX COORDS
    gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.mesh.texCoords, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  SetBuffers(program){
    //TRIANGLE INDICES
    //gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
    //gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.mesh.indices, gl.STATIC_DRAW);

    program.Use();
    //VERTEX POSITIONS
    gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer);
    //gl.bufferData(gl.ARRAY_BUFFER, this.mesh.vertices, gl.STATIC_DRAW);

    gl.vertexAttribPointer(
      program.verticesLocation, //Attribute location
      2, //Number of elements per attribute
      gl.FLOAT, //Type of elements
      gl.FALSE,
      2 * Float32Array.BYTES_PER_ELEMENT, //Size of an individual vertexShader
      0 //Offset from the beginning of a single vertex to this attribute
    );
    gl.enableVertexAttribArray(program.verticesLocation);

    //TEX COORDS
    gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordsBuffer);
    //gl.bufferData(gl.ARRAY_BUFFER, this.mesh.texCoords, gl.STATIC_DRAW);
    //console.log(program.texCoordsLocation);
    gl.vertexAttribPointer(
      program.texCoordsLocation, //Attribute location
      2, //Number of elements per attribute
      gl.FLOAT, //Type of elements
      gl.FALSE,
      2 * Float32Array.BYTES_PER_ELEMENT, //Size of an individual vertexShader
      0 //Offset from the beginning of a single vertex to this attribute
    );
    gl.enableVertexAttribArray(program.texCoordsLocation);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }
}
