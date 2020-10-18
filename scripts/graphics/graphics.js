var canvas = document.getElementById('game_surface');
var gl;
const tileSize = 32.0;
class Graphics {
  constructor() {
    this.programs = new Map();
    this.fbos = new Map();
    this.lastOutput = null;
    this.output = null;
    this.auxTexture = null;
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

    /*gl.clearColor(1.0, 1.0, 1.0, 1.0);
    //gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.BindFBO('depth');
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    this.programs.get('depth').Render();
    this.programs.get('spriteSheetDepth').Render();

    this.BindFBO('sunDepth');
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    this.programs.get('sunDepth').Render();
    this.programs.get('sunDepthSprite').Render();

    gl.clearColor(0.3, 0.7, 1.0, 1.0); //Blue by default
    this.BindFBO('color');*/
    //gl.enable(gl.DEPTH_TEST);

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.clearColor(1.0,1.0,1.0,1.0);

    this.BindFBO('depth');
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    this.programs.get('depth').Render();
    this.programs.get('spriteDepth').Render();

    this.BindFBO('sunDepth');
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    this.programs.get('sunDepth').Render();
    this.programs.get('spriteSunDepth').Render();

    this.BindFBO('color');
    gl.clearColor(0.3, 0.7, 1.0, 1.0); //Blue by default
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    this.programs.get('color').Render();
    this.programs.get('spriteColor').Render();

    gl.disable(gl.DEPTH_TEST);
    gl.clearColor(1.0,1.0,1.0,1.0);
    this.BindFBO('light');
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    this.programs.get('sunLight').Render();

    this.BindFBO('blurHalf');
    this.programs.get('blurX').Render();
    this.BindFBO('light');
    this.programs.get('blurY').Render();

    this.BindFBO('litColor');
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    this.programs.get('litColor').Render();



    this.BindFBO(null);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    this.programs.get('colorFilter').Render();

    if(DEBUG){
      this.BindFBO(null);
      //gl.enable(gl.BLEND);
      this.BindFBO(null);
      gl.disable(gl.DEPTH_TEST);
      this.programs.get('collider').Render();
    }
    //this.SetBuffers(program);


    /*Test*/
    /*this.BindFBO(null);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    this.auxTexture = this.fbos.get('sunDepth').texture;
    this.programs.get('common').Render();*/
    /*Test*/
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

    let depthFBO = this.CreateFrameBuffer(true);
    this.fbos.set('depth', depthFBO);

    let lightFBO = this.CreateFrameBuffer(false);
    this.fbos.set('light', lightFBO);

    let litColorFBO = this.CreateFrameBuffer(false);
    this.fbos.set('litColor', litColorFBO);

    let blurHalfFBO = this.CreateFrameBuffer(false);
    this.fbos.set('blurHalf', blurHalfFBO);
  }

  CreatePrograms() {
    let res = new Vec2(canvas.width, canvas.height);
    let tileMap = resources.textures.get('tileMap');

    //COMMON PROGRAM
    let commonProgram = new Program('common', 'vs_common', 'fs_common', true, true);
    commonProgram.SetUniforms([
      new UniformTex('colorTex', ()=>manager.graphics.auxTexture)
    ]);

    //TILE MAP PROGRAM
    let colorProgram = new Program('color', 'vs_color', 'fs_color');
    colorProgram.SetConstUniforms([
      new UniformTex('colorTex', ()=>resources.textures.get('tileMap')),
      new Uniform2f('tileSizeDIVres', () => new Vec2(tileSize/res.x, tileSize/res.y)),
      new Uniform2f('tileMapResDIVtileSize', ()=>new Vec2(tileMap.width / tileSize, tileMap.height / tileSize))
    ]);
    colorProgram.SetUniforms([
      new Uniform2f('cam', ()=>manager.scene.camera.transform.GetWorldPosPerfect())
    ]);
    colorProgram.SetObjUniforms([
      new Uniform2f('numTiles', (obj)=>obj.numTiles),
      new Uniform4f('tint', (obj) => obj.tint),
      new Uniform2f('tile', (obj) => obj.tile),
      new Uniform2f('scale', (obj) => obj.gameobj.transform.scale),
      new Uniform1f('height', (obj) => obj.gameobj.transform.height),
      new Uniform1f('vertical', (obj) => obj.vertical ? 1.0 : 0.0),
      new Uniform2f('center', (obj)=>obj.gameobj.transform.GetWorldCenterPerfect()),
    ]);


    //SPRITE SHEET PROGRAM
    let spriteColorProgram = new Program('spriteColor', 'vs_color', 'fs_color');
    spriteColorProgram.SetConstUniforms([
      new Uniform2f('tileSizeDIVres', () => new Vec2(tileSize/res.x, tileSize/res.y)),
    ]);
    spriteColorProgram.SetUniforms([
      new Uniform2f('cam', ()=>manager.scene.camera.transform.GetWorldPosPerfect())
    ]);
    spriteColorProgram.SetObjUniforms([
      new Uniform2f('numTiles', (obj)=>obj.numTiles),
      new Uniform4f('tint', (obj) => obj.tint),
      new UniformTex('colorTex', (obj)=>obj.spriteSheet),
      new Uniform2f('tileMapResDIVtileSize', (obj)=>
        new Vec2(obj.spriteSheet.width / tileSize, obj.spriteSheet.height / tileSize)),
      new Uniform2f('tile', (obj) => obj.tile),
      new Uniform2f('scale', (obj) => obj.gameobj.transform.scale),
      new Uniform1f('height', (obj) => obj.gameobj.transform.height),
      new Uniform1f('vertical', (obj) => obj.vertical ? 1.0 : 0.0),
      new Uniform2f('center', (obj)=>obj.gameobj.transform.GetWorldCenterPerfect()),
    ]);

    //TILE MAP DEPTH PROGRAM
    let depthProgram = new Program('depth', 'vs_depth', 'fs_depth');
    depthProgram.SetConstUniforms([
      new UniformTex('colorTex', ()=>resources.textures.get('tileMap')),
      new Uniform2f('tileSizeDIVres', () => new Vec2(tileSize/res.x, tileSize/res.y)),
      new Uniform2f('tileMapResDIVtileSize', ()=>new Vec2(tileMap.width / tileSize, tileMap.height / tileSize))
    ]);
    //let camTransform = manager.scene.camera.transform;
    depthProgram.SetUniforms([
      new Uniform2f('cam', ()=>manager.scene.camera.transform.GetWorldPosPerfect())
    ]);
    depthProgram.SetObjUniforms([
      new Uniform2f('numTiles', (obj)=>obj.numTiles),
      new Uniform4f('tint', (obj) => obj.tint),
      new Uniform2f('tile', (obj) => obj.tile),
      new Uniform2f('scale', (obj) => obj.gameobj.transform.scale),
      new Uniform1f('height', (obj) => obj.gameobj.transform.height),
      new Uniform1f('vertical', (obj) => obj.vertical ? 1.0 : 0.0),
      new Uniform2f('center', (obj)=>obj.gameobj.transform.GetWorldCenterPerfect()),
    ]);

    //SPRITE SHEET DEPTH PROGRAM
    let spriteDepthProgram = new Program('spriteDepth', 'vs_depth', 'fs_depth');
    spriteDepthProgram.SetConstUniforms([
      new Uniform2f('tileSizeDIVres', () => new Vec2(tileSize/res.x, tileSize/res.y)),
    ]);
    spriteDepthProgram.SetUniforms([
      new Uniform2f('cam', ()=>manager.scene.camera.transform.GetWorldPosPerfect())
    ]);
    spriteDepthProgram.SetObjUniforms([
      new Uniform2f('numTiles', (obj)=>obj.numTiles),
      new Uniform4f('tint', (obj) => obj.tint),
      new UniformTex('colorTex', (obj)=>obj.spriteSheet),
      new Uniform2f('tileMapResDIVtileSize', (obj)=>
      new Vec2(obj.spriteSheet.width / tileSize, obj.spriteSheet.height / tileSize)),
      new Uniform2f('tile', (obj) => obj.tile),
      new Uniform2f('scale', (obj) => obj.gameobj.transform.scale),
      new Uniform1f('height', (obj) => obj.gameobj.transform.height),
      new Uniform1f('vertical', (obj) => obj.vertical ? 1.0 : 0.0),
      new Uniform2f('center', (obj)=>obj.gameobj.transform.GetWorldCenterPerfect()),
    ]);

    //TILE MAP SUN DEPTH PROGRAM
    let sunDepthProgram = new Program('sunDepth', 'vs_sunDepth', 'fs_depth');
    sunDepthProgram.SetConstUniforms([
      new UniformTex('colorTex', ()=>resources.textures.get('tileMap')),
      new Uniform2f('tileSizeDIVres', () => new Vec2(tileSize/res.x, tileSize/res.y)),
      new Uniform2f('tileMapResDIVtileSize', ()=>new Vec2(tileMap.width / tileSize, tileMap.height / tileSize))
    ]);
    //let camTransform = manager.scene.camera.transform;
    sunDepthProgram.SetUniforms([
      new Uniform2f('cam', ()=>manager.scene.camera.transform.GetWorldPosPerfect()),
      new Uniform1f('shadowLength', ()=>manager.scene.camera.camera.shadowLength)
    ]);
    sunDepthProgram.SetObjUniforms([
      new Uniform2f('numTiles', (obj)=>obj.numTiles),
      new Uniform4f('tint', (obj) => obj.tint),
      new Uniform2f('tile', (obj) => obj.tile),
      new Uniform2f('scale', (obj) => obj.gameobj.transform.scale),
      new Uniform1f('height', (obj) => obj.gameobj.transform.height),
      new Uniform1f('vertical', (obj) => obj.vertical ? 1.0 : 0.0),
      new Uniform2f('center', (obj)=>obj.gameobj.transform.GetWorldCenterPerfect()),
    ]);

    //SPRITE SHEET SUN DEPTH PROGRAM
    let spriteSunDepthProgram = new Program('spriteSunDepth', 'vs_sunDepth', 'fs_depth');
    spriteSunDepthProgram.SetConstUniforms([
      new Uniform2f('tileSizeDIVres', () => new Vec2(tileSize/res.x, tileSize/res.y)),
    ]);
    spriteSunDepthProgram.SetUniforms([
      new Uniform2f('cam', ()=>manager.scene.camera.transform.GetWorldPosPerfect()),
      new Uniform1f('shadowLength', ()=>manager.scene.camera.camera.shadowLength)
    ]);
    spriteSunDepthProgram.SetObjUniforms([
      new Uniform2f('numTiles', (obj)=>obj.numTiles),
      new Uniform4f('tint', (obj) => obj.tint),
      new UniformTex('colorTex', (obj)=>obj.spriteSheet),
      new Uniform2f('tileMapResDIVtileSize', (obj)=>
      new Vec2(obj.spriteSheet.width / tileSize, obj.spriteSheet.height / tileSize)),
      new Uniform2f('tile', (obj) => obj.tile),
      new Uniform2f('scale', (obj) => obj.gameobj.transform.scale),
      new Uniform1f('height', (obj) => obj.gameobj.transform.height),
      new Uniform1f('vertical', (obj) => obj.vertical ? 1.0 : 0.0),
      new Uniform2f('center', (obj)=>obj.gameobj.transform.GetWorldCenterPerfect()),
    ]);

    //SUN LIGHT PROGRAM
    let sunLightProgram = new Program('sunLight', 'vs_common', 'fs_sunLight', true, true);
    sunLightProgram.SetUniforms([
      new UniformTex('depthTex', ()=>this.fbos.get('depth').texture),
      new UniformTex('sunDepthTex', ()=>this.fbos.get('sunDepth').texture),
      new Uniform1f('verticalShadowStrength',()=>manager.scene.camera.camera.verticalShadowStrength),
      new Uniform1f('temperature', ()=>manager.scene.camera.camera.sunTemperature),
    ]);

    //BLUR PROGRAMS
    let blurXProgram = new Program('blurX', 'vs_common', 'fs_blurX', true, true);
    blurXProgram.SetConstUniforms([
      new Uniform4f('channels', ()=>new Float32Array([0.15,3.0,0.0,0.0])),

    ]);
    blurXProgram.SetUniforms([
      new UniformTex('colorTex', ()=>manager.graphics.lastOutput.texture),
      new UniformTex('depthTex', ()=>manager.graphics.fbos.get('depth').texture),
      new Uniform1f('invAspect', ()=>canvas.height/canvas.width),
      new Uniform1f('blurSize', ()=>manager.scene.camera.camera.shadowBlur),
      new Uniform1f('blurEdge0', ()=>manager.scene.camera.camera.shadowBlurE0),
      new Uniform1f('blurEdge1', ()=>manager.scene.camera.camera.shadowBlurE1),
    ]);

    let blurYProgram = new Program('blurY', 'vs_common', 'fs_blurY', true, true);
    blurYProgram.SetConstUniforms([
      new Uniform4f('channels', ()=>new Float32Array([0.15,3.0,0.0,0.0])),

    ]);
    blurYProgram.SetUniforms([
      new UniformTex('colorTex', ()=>manager.graphics.fbos.get('blurHalf').texture),
      new UniformTex('depthTex', ()=>manager.graphics.fbos.get('depth').texture),
      new Uniform1f('blurSize', ()=>manager.scene.camera.camera.shadowBlur),
      new Uniform1f('blurEdge0', ()=>manager.scene.camera.camera.shadowBlurE0),
      new Uniform1f('blurEdge1', ()=>manager.scene.camera.camera.shadowBlurE1),
    ]);

    //LIT COLOR PROGRAM
    let litColorProgram = new Program('litColor', 'vs_common', 'fs_lit', true, true);
    litColorProgram.SetUniforms([
      new UniformTex('lightTex', ()=>manager.graphics.fbos.get('light').texture),
      new UniformTex('colorTex', ()=>manager.graphics.fbos.get('color').texture),
      /*TEMPORAL*/
      new Uniform4f('ambientLight', ()=>manager.scene.camera.camera.ambientLight),
      new Uniform1f('shadowStrength', ()=>manager.scene.camera.camera.shadowStrength),
    ]);

    //COLLIDER PROGRAM
    let colliderProgram = new Program('collider', 'vs_collider', 'fs_collider', false);
    colliderProgram.SetUniforms([
      new Uniform2f('camTransformed', ()=>Vec2.Scale(manager.scene.camera.transform.GetWorldPosPerfect(),2.0).Div(res).Scale(tileSize)),
    ]);
    colliderProgram.SetObjUniforms([
      new Uniform4f('tint', (obj) => obj.tint),
      new Uniform2f('vertDisplacement', (obj) => obj.vertDisplacement),
      new Uniform2f('scaleMULtileSizeDIVres', function(obj){
        return Vec2.Scale(obj.scale, tileSize).Div(res);
      }),
      new Uniform1f('circular', (obj) => obj.circular)
    ]);

    //COLOR FILTER PROGRAM
    let colorFilterProgram = new Program('colorFilter', 'vs_common', 'fs_colorFilter', true, true);
    colorFilterProgram.SetUniforms([
      new UniformTex('colorTex', ()=>manager.graphics.lastOutput.texture),
      new Uniform4f('colorFilter', ()=>manager.scene.camera.camera.colorFilter),
      new Uniform1f('brightness', ()=>manager.scene.camera.camera.brightness),
      new Uniform1f('contrast', ()=>manager.scene.camera.camera.contrast),
    ])

    /*



    let applyLightProgram = new Program('applyLight', 'vs_common', 'fs_lightApply', true, true);
    applyLightProgram.SetUniforms([
      new UniformTex('colorTex', applyLightProgram, ()=>this.fbos.get('color').texture),
      new UniformTex('lightTex', applyLightProgram, ()=>this.fbos.get('light').texture),
      new Uniform4f('ambientLight', applyLightProgram, ()=>manager.scene.camera.camera.ambientLight),
      new Uniform1f('shadowStrength', applyLightProgram, ()=>manager.scene.camera.camera.shadowStrength)
    ]);*/
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
