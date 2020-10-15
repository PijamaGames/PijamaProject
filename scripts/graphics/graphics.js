var canvas = document.getElementById('game_surface');
var gl;
const tileSize = 32.0;
class Graphics {
  constructor() {
    this.programs = new Map();
    this.fbos = new Map();
    this.lastOutput = null;
    this.output = null;
    this.InitContext();
  }

  InitContext() {
    gl = canvas.getContext('webgl');
    if (!gl) {
      Log('WebGL not supported, falling back to experimental WebGL');
      gl = canvas.getContext('experimental-webgl');
    }

    if (!gl) alert('Your browser does not support WebGL');
    this.GetExtensions();

    //canvas.width = window.innerWidth* window.devicePixelRatio;
    //canvas.height = window.innerHeight* window.devicePixelRatio;
    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.clearColor(0.3, 0.7, 1.0, 1.0); //Blue by default
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    //gl.disable(gl.BLEND);

    //gl.disable(gl.DEPTH_TEST);
    //gl.enable(gl.CULL_FACE);
    //gl.frontFace(gl.CCW);
    //gl.cullFace(gl.BACK);
    Log('Graphic context initiated');
  }

  GetExtensions() {
    //var available_extensions = gl.getSupportedExtensions();
    //Log(available_extensions);
    //gl.getExtension('EXT_frag_depth');
  }

  LoadResources() {
    this.CreateBuffers();
    this.CreateFrameBuffers();
    this.CreatePrograms();
  }

  Render(scene) {

    this.BindFBO('color');
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    this.programs.get('opaque').Render();
    this.programs.get('spriteSheet').Render();

    this.BindFBO(null)
    this.programs.get('colorFilter').Render();

    this.BindFBO('sunDepth');
    //this.BindFBO(null);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    this.programs.get('sunDepth').Render();
    this.programs.get('sunDepthSprite').Render();

    if(DEBUG){
      this.BindFBO(null);
      //gl.enable(gl.BLEND);
      gl.disable(gl.DEPTH_TEST);
      this.programs.get('collider').Render();
    }
    //this.SetBuffers(program);
  }

  BindFBO(name){
    let fbo
    if(name == null) fbo = null;
    else fbo = this.fbos.get(name);
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    this.lastOutput = this.output;
    this.output = fbo;
  }

  Draw() {
    gl.drawElements(gl.TRIANGLES, this.mesh.indices.length, gl.UNSIGNED_SHORT, 0);
  }

  CreateFrameBuffers(){
    let colorFBO = this.CreateFrameBuffer(true);
    this.fbos.set('color', colorFBO);

    let sunDepthFBO = this.CreateFrameBuffer(true);
    this.fbos.set('sunDepth', sunDepthFBO);
  }

  CreatePrograms() {
    let res = new Vec2(canvas.width, canvas.height);

    //TILE MAP PROGRAM
    let opaqueProgram = new Program('opaque', 'vs_opaque', 'fs_opaque');
    let tileMap = resources.textures.get('tileMap');
    opaqueProgram.SetConstUniforms([
      new UniformTex('colorTex', opaqueProgram, ()=>resources.textures.get('tileMap')),
      new Uniform2f('tileSizeDIVres', opaqueProgram, () => new Vec2(tileSize/res.x, tileSize/res.y)),
      new Uniform2f('tileMapResDIVtileSize', opaqueProgram, ()=>new Vec2(tileMap.width / tileSize, tileMap.height / tileSize))
    ]);
    //let camTransform = manager.scene.camera.transform;
    opaqueProgram.SetUniforms([
      new Uniform2f('camTransformed', opaqueProgram, ()=>Vec2.Scale(manager.scene.camera.transform.GetWorldPosPerfect(),2.0).Div(res).Scale(tileSize)),
      new Uniform2f('camPosition', opaqueProgram, ()=>manager.scene.camera.transform.GetWorldPosPerfect())
    ]);
    opaqueProgram.SetObjUniforms([
      new Uniform2f('numTiles', opaqueProgram, (obj)=>obj.numTiles),
      new Uniform4f('tint', opaqueProgram, (obj) => obj.tint),
      new Uniform2f('tile', opaqueProgram, (obj) => obj.tile),
      new Uniform2f('scale', opaqueProgram, (obj) => obj.gameobj.transform.scale),
      new Uniform1f('height', opaqueProgram, (obj) => obj.gameobj.transform.height),
      new Uniform1f('vertical', opaqueProgram, (obj) => obj.vertical ? 1.0 : 0.0),
      new Uniform2f('vertDisplacement', opaqueProgram, (obj) => obj.vertDisplacement),
      new Uniform2f('scaleMULtileSizeDIVres',opaqueProgram, function(obj){
        return Vec2.Scale(obj.gameobj.transform.scale, tileSize).Div(res);
      }),
      new Uniform1f('floorPos', opaqueProgram, (obj)=>obj.gameobj.transform.floorPos)
    ]);


    //SPRITE SHEET PROGRAM
    let spriteSheetProgram = new Program('spriteSheet', 'vs_opaque', 'fs_opaque');
    spriteSheetProgram.SetConstUniforms([
      new Uniform2f('tileSizeDIVres', spriteSheetProgram, () => new Vec2(tileSize/res.x, tileSize/res.y)),
    ]);
    spriteSheetProgram.SetUniforms([
      new Uniform2f('camTransformed', spriteSheetProgram, ()=>Vec2.Scale(manager.scene.camera.transform.GetWorldPosPerfect(),2.0).Div(res).Scale(tileSize)),
      new Uniform2f('camPosition', spriteSheetProgram, ()=>manager.scene.camera.transform.GetWorldPosPerfect())
    ]);
    spriteSheetProgram.SetObjUniforms([
      new Uniform2f('numTiles', spriteSheetProgram, (obj)=>obj.numTiles),
      new Uniform4f('tint', spriteSheetProgram, (obj) => obj.tint),
      new UniformTex('colorTex', spriteSheetProgram, (obj)=>obj.spriteSheet),
      new Uniform2f('tileMapResDIVtileSize', spriteSheetProgram, (obj)=>
      new Vec2(obj.spriteSheet.width / tileSize, obj.spriteSheet.height / tileSize)),
      new Uniform2f('tile', spriteSheetProgram, (obj) => obj.tile),
      new Uniform2f('scale', spriteSheetProgram, (obj) => obj.gameobj.transform.scale),
      new Uniform1f('height', spriteSheetProgram, (obj) => obj.gameobj.transform.height),
      new Uniform1f('vertical', spriteSheetProgram, (obj) => obj.vertical ? 1.0 : 0.0),
      new Uniform2f('vertDisplacement', spriteSheetProgram, (obj) => obj.vertDisplacement),
      new Uniform2f('scaleMULtileSizeDIVres',spriteSheetProgram, function(obj){
        return Vec2.Scale(obj.gameobj.transform.scale, tileSize).Div(res);
      }),
      new Uniform1f('floorPos', spriteSheetProgram, (obj)=>obj.gameobj.transform.floorPos)
    ]);

    //COLLIDER PROGRAM
    let colliderProgram = new Program('collider', 'vs_collider', 'fs_collider', false);
    colliderProgram.SetUniforms([
      new Uniform2f('camTransformed', colliderProgram, ()=>Vec2.Scale(manager.scene.camera.transform.GetWorldPosPerfect(),2.0).Div(res).Scale(tileSize)),
    ]);
    colliderProgram.SetObjUniforms([
      new Uniform4f('tint', colliderProgram, (obj) => obj.tint),
      new Uniform2f('vertDisplacement', colliderProgram, (obj) => obj.vertDisplacement),
      new Uniform2f('scaleMULtileSizeDIVres',colliderProgram, function(obj){
        return Vec2.Scale(obj.scale, tileSize).Div(res);
      }),
      new Uniform1f('circular', colliderProgram, (obj) => obj.circular)
    ]);

    //COLOR FILTER PROGRAM
    let colorFilterProgram = new Program('colorFilter', 'vs_common', 'fs_colorFilter', true, true);
    colorFilterProgram.SetUniforms([
      new UniformTex('colorTex', colorFilterProgram, ()=>manager.graphics.lastOutput.texture),
      new Uniform4f('colorFilter', colorFilterProgram, ()=>manager.scene.camera.camera.colorFilter),
      new Uniform1f('brightness', colorFilterProgram, ()=>manager.scene.camera.camera.brightness),
      new Uniform1f('contrast', colorFilterProgram, ()=>manager.scene.camera.camera.contrast),
    ])

    //SUN DEPTH PROGRAM
    let sunDepthProgram = new Program('sunDepth', 'vs_sunDepth', 'fs_sunDepth', true);
    sunDepthProgram.SetConstUniforms([
      new UniformTex('colorTex', sunDepthProgram, ()=>resources.textures.get('tileMap')),
      new Uniform2f('tileSizeDIVres', sunDepthProgram, () => new Vec2(tileSize/res.x, tileSize/res.y)),
      new Uniform2f('tileMapResDIVtileSize', sunDepthProgram, ()=>new Vec2(tileMap.width / tileSize, tileMap.height / tileSize))
    ]);
    //let camTransform = manager.scene.camera.transform;
    sunDepthProgram.SetUniforms([
      new Uniform2f('camTransformed', sunDepthProgram, ()=>Vec2.Scale(manager.scene.camera.transform.GetWorldPosPerfect(),2.0).Div(res).Scale(tileSize)),
      new Uniform2f('camPosition', sunDepthProgram, ()=>manager.scene.camera.transform.GetWorldPosPerfect())
    ]);
    sunDepthProgram.SetObjUniforms([
      new Uniform2f('numTiles', sunDepthProgram, (obj)=>obj.numTiles),
      new Uniform2f('tile', sunDepthProgram, (obj) => obj.tile),
      new Uniform2f('scale', sunDepthProgram, (obj) => obj.gameobj.transform.scale),
      new Uniform1f('anchory', sunDepthProgram, (obj) => obj.gameobj.transform.anchor.y),
      new Uniform1f('height', sunDepthProgram, (obj) => obj.gameobj.transform.height),
      new Uniform1f('vertical', sunDepthProgram, (obj) => obj.vertical ? 1.0 : 0.0),
      new Uniform2f('vertDisplacement', sunDepthProgram, (obj) => obj.vertDisplacement),
      new Uniform2f('scaleMULtileSizeDIVres',sunDepthProgram, function(obj){
        return Vec2.Scale(obj.gameobj.transform.scale, tileSize).Div(res);
      }),
      new Uniform1f('floorPos', sunDepthProgram, (obj)=>obj.gameobj.transform.floorPos)
    ]);

    //SUN DEPTH SPRITES PROGRAM
    let sunDepthSpritesProgram = new Program('sunDepthSprite', 'vs_sunDepth', 'fs_sunDepth', true);
    sunDepthSpritesProgram.SetConstUniforms([
      new Uniform2f('tileSizeDIVres', sunDepthSpritesProgram, () => new Vec2(tileSize/res.x, tileSize/res.y)),
    ]);
    sunDepthSpritesProgram.SetUniforms([
      new Uniform2f('camTransformed', sunDepthSpritesProgram, ()=>Vec2.Scale(manager.scene.camera.transform.GetWorldPosPerfect(),2.0).Div(res).Scale(tileSize)),
      new Uniform2f('camPosition', sunDepthSpritesProgram, ()=>manager.scene.camera.transform.GetWorldPosPerfect())
    ]);
    sunDepthSpritesProgram.SetObjUniforms([
      new Uniform2f('numTiles', sunDepthSpritesProgram, (obj)=>obj.numTiles),
      new UniformTex('colorTex', sunDepthSpritesProgram, (obj)=>obj.spriteSheet),
      new Uniform2f('tileMapResDIVtileSize', sunDepthSpritesProgram, (obj)=>
      new Vec2(obj.spriteSheet.width / tileSize, obj.spriteSheet.height / tileSize)),
      new Uniform2f('tile', sunDepthSpritesProgram, (obj) => obj.tile),
      new Uniform2f('scale', sunDepthSpritesProgram, (obj) => obj.gameobj.transform.scale),
      new Uniform1f('anchory', sunDepthSpritesProgram, (obj) => obj.gameobj.transform.anchor.y),
      new Uniform1f('height', sunDepthSpritesProgram, (obj) => obj.gameobj.transform.height),
      new Uniform1f('vertical', sunDepthSpritesProgram, (obj) => obj.vertical ? 1.0 : 0.0),
      new Uniform2f('vertDisplacement', sunDepthSpritesProgram, (obj) => obj.vertDisplacement),
      new Uniform2f('scaleMULtileSizeDIVres',sunDepthSpritesProgram, function(obj){
        return Vec2.Scale(obj.gameobj.transform.scale, tileSize).Div(res);
      }),
      new Uniform1f('floorPos', sunDepthSpritesProgram, (obj)=>obj.gameobj.transform.floorPos)
    ]);
  }

  CreateBuffers() {
    this.mesh = new Object();
    this.mesh.vertices = new Float32Array([
      -1, -1,
      -1, 1,
      1, 1,
      1, -1
    ]);
    this.mesh.indices = new Uint16Array([
      0, 2, 1, 0, 3, 2
    ]);
    this.mesh.texCoords = new Float32Array([
      0, 0,
      0, 1,
      1, 1,
      1, 0
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

  SetBuffers(program) {
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
    if(program.useTexCoords){
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
    }


    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  CreateFrameBuffer(hasDepthBuffer = false) {

    //CREATE FRAMEBUFFER AND TEXTURE
    var fb = gl.createFramebuffer();
    fb.texture = gl.createTexture();

    fb.texture.UpdateDimensions = function(){
      if(this.width != canvas.width || this.height != canvas.height){
        gl.bindTexture(gl.TEXTURE_2D, fb.texture);
        this.width = canvas.width;
        this.height = canvas.height;

        const level = 0;
        const internalFormat = gl.RGBA;
        const border = 0;
        const format = gl.RGBA;
        const type = gl.UNSIGNED_BYTE;
        const data = null;

        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
          canvas.width, canvas.height, border,
          format, type, data);
        gl.bindTexture(gl.TEXTURE_2D, null);
      }
    }
    fb.texture.UpdateDimensions();

    gl.bindTexture(gl.TEXTURE_2D, fb.texture);
    // set the filtering so we don't need mips
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.bindTexture(gl.TEXTURE_2D, null);

    //ATTACH TEXTURE
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      fb.texture,
      0
    );

    if(hasDepthBuffer){
      fb.depthBuffer = gl.createRenderbuffer();

      fb.depthBuffer.UpdateDimensions = function(){
        gl.bindRenderbuffer(gl.RENDERBUFFER, fb.depthBuffer);
        gl.renderbufferStorage(
          gl.RENDERBUFFER,
          gl.DEPTH_COMPONENT16,
          canvas.width,
          canvas.height
        );
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
      };
      fb.depthBuffer.UpdateDimensions();

      gl.bindRenderbuffer(gl.RENDERBUFFER, fb.depthBuffer);
      gl.framebufferRenderbuffer(
        gl.FRAMEBUFFER,
        gl.DEPTH_ATTACHMENT,
        gl.RENDERBUFFER,
        fb.depthBuffer
      );

      gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    }


    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
      console.error('attachments do not work');
    }
    //Graphics.FBOs.push(fb);
    return fb;
  }
}
