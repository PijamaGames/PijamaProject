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
    this.lighting = new Lighting();
    this.colorsPerChannel = 12.0; //12.0 is a good number
    this.defaultRes = new Vec2(640, 480);
    this.res = new Vec2(640, 480);
    this.lastRes = this.res.Copy();
    this.portraitRes = new Vec2(480,480);
    this.landscapeRes = this.res.Copy();
    this.aspectRatio = this.res.x / this.res.y;
    this.windowRes = new Vec2(window.innerWidth, window.innerHeight);
    this.InitContext();
    this.CanvasResponsive(true);
  }

  InitContext() {
    gl = canvas.getContext('webgl');
    if (!gl) {
      Log('WebGL not supported, falling back to experimental WebGL');
      gl = canvas.getContext('experimental-webgl');
    }

    if (!gl) alert('Your browser does not support WebGL');
    this.GetExtensions();

    //manager.graphics.res.x = window.innerWidth* window.devicePixelRatio;
    //manager.graphics.res.y = window.innerHeight* window.devicePixelRatio;
    gl.viewport(0, 0, this.res.x, this.res.y);
    console.log(gl);
    //canvas.scale(canvas.width/this.res.x, canvas.height/this.res.y);

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

  CanvasResponsive(forced = false) {
    let newWindowRes = new Vec2(window.innerWidth, window.innerHeight);
    if (!newWindowRes.Equals(this.windowRes) || forced) {
      this.windowRes = newWindowRes;
      let windowAspectRatio = newWindowRes.x / newWindowRes.y;

      if (/*this.aspectRatio*/1.0 > windowAspectRatio) { //Portrait
        console.log("Portrait");
        this.res = this.portraitRes.Copy();
        let h = this.res.x*this.windowRes.y/this.windowRes.x;
        canvas.width = Math.ceil(this.res.x);
        canvas.height = Math.ceil(h);

      } else if (/*this.aspectRatio*/1.0 < windowAspectRatio) { //Landscape
        console.log('Landscape');
        this.res = this.landscapeRes.Copy();
        let w = this.res.y*this.windowRes.x/this.windowRes.y;
        canvas.width = Math.ceil(w);
        canvas.height = Math.ceil(this.res.y);

      } else {
        canvas.width = Math.ceil(this.res.x);
        canvas.height = Math.ceil(this.res.y);
      }
    }
    if(!this.lastRes.Equals(this.res)){
      this.lastRes = this.res.Copy();
      Log(this.res.toString("res: "));
      for(var [key,value] of this.fbos){
        this.UpdateFramebufferDimensions(value);
        //value.texture.UpdateDimensions();
      }
    }
  }

  Render(scene) {

    gl.viewport(0, 0, this.res.x, this.res.y);

    gl.enable(gl.DEPTH_TEST);
    //gl.enable(gl.BLEND);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    this.BindFBO('depth');
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    this.programs.get('depth').Render();
    this.programs.get('spriteDepth').Render();

    this.BindFBO('sunDepth');
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    this.programs.get('sunDepth').Render();
    this.programs.get('spriteSunDepth').Render();

    gl.enable(gl.BLEND);
    this.BindFBO('color');
    gl.clearColor(0.3, 0.7, 1.0, 1.0); //Blue by default
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    this.programs.get('color').Render();
    this.programs.get('spriteColor').Render();
    gl.disable(gl.BLEND);

    gl.disable(gl.DEPTH_TEST);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    this.BindFBO('light');
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    this.programs.get('sunLight').Render();


    //Render all lights
    let size = lighting.lightSources.size;
    //MÁS TARDE SE DEBERÁ COMPROBAR SI EL NÚMERO DE LUCES DENTRO DE LA VISTA ES >0
    if (size > 0) {
      this.BindFBO('light2');
      let pointLightProgram = this.programs.get('pointLight');
      let i = 0;
      for (var light of lighting.lightSources) {
        lighting.currentLightSource = light;
        pointLightProgram.Render();
        if (i < size - 1) {
          this.BindFBO(this.lastOutput.name);
        }
        i++;
      }
    }


    //End render all lights


    this.BindFBO('blurHalf');
    this.programs.get('blurX').Render();
    this.BindFBO('light');
    this.programs.get('blurY').Render();

    this.BindFBO('litColor');
    //gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    this.programs.get('litColor').Render();



    this.BindFBO('colorFilter');
    //gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    this.programs.get('colorFilter').Render();

    this.BindFBO('finalColor');
    this.programs.get('limitColor').Render();

    if (DEBUG_VISUAL) {
      gl.enable(gl.BLEND);
      gl.disable(gl.DEPTH_TEST);
      this.programs.get('collider').Render();
      gl.disable(gl.BLEND);
    }

    gl.viewport(0, 0, canvas.width, canvas.height);

    this.BindFBO(null);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    this.programs.get('surface').Render();
    gl.enable(gl.BLEND);
    this.programs.get('virtualInput').Render();

    //this.SetBuffers(program);


    /*Test*/
    /*this.BindFBO(null);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    this.auxTexture = this.fbos.get('light').texture;
    this.programs.get('common').Render();*/
    /*Test*/
  }

  BindFBO(name) {
    let fbo
    if (name == null) fbo = null;
    else fbo = this.fbos.get(name);
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    this.lastOutput = this.output;
    this.output = fbo;
  }

  Draw() {
    gl.drawElements(gl.TRIANGLES, this.mesh.indices.length, gl.UNSIGNED_SHORT, 0);
  }

  CreateFrameBuffers() {
    let colorFBO = this.CreateFrameBuffer(true);
    colorFBO.name = 'color';
    this.fbos.set(colorFBO.name, colorFBO);

    let sunDepthFBO = this.CreateFrameBuffer(true);
    sunDepthFBO.name = 'sunDepth';
    this.fbos.set(sunDepthFBO.name, sunDepthFBO);

    let depthFBO = this.CreateFrameBuffer(true);
    depthFBO.name = 'depth';
    this.fbos.set(depthFBO.name, depthFBO);

    let lightFBO = this.CreateFrameBuffer(false);
    lightFBO.name = 'light';
    this.fbos.set(lightFBO.name, lightFBO);

    let light2FBO = this.CreateFrameBuffer(false);
    light2FBO.name = 'light2';
    this.fbos.set(light2FBO.name, light2FBO);

    let litColorFBO = this.CreateFrameBuffer(false);
    litColorFBO.name = 'litColor';
    this.fbos.set(litColorFBO.name, litColorFBO);

    let blurHalfFBO = this.CreateFrameBuffer(false);
    blurHalfFBO.name = 'blurHalf';
    this.fbos.set(blurHalfFBO.name, blurHalfFBO);

    let colorFilterFBO = this.CreateFrameBuffer(false);
    colorFilterFBO.name = 'colorFilter';
    this.fbos.set(colorFilterFBO.name, colorFilterFBO);

    let finalColorFBO = this.CreateFrameBuffer(false);
    finalColorFBO.name = 'finalColor';
    this.fbos.set(finalColorFBO.name, finalColorFBO);

  }

  CreatePrograms() {
    let tileMap = resources.textures.get('tileMap');

    //COMMON PROGRAM
    let commonProgram = new Program('common', 'vs_common', 'fs_common', true, true);
    commonProgram.SetUniforms([
      new UniformTex('colorTex', () => manager.graphics.auxTexture)
    ]);

    //TILE MAP PROGRAM
    let colorProgram = new Program('color', 'vs_color', 'fs_color');
    colorProgram.SetConstUniforms([
      new UniformTex('colorTex', () => resources.textures.get('tileMap')),

      new Uniform2f('tileMapResDIVtileSize', () => new Vec2(tileMap.width / tileSize, tileMap.height / tileSize))
    ]);
    colorProgram.SetUniforms([
      new Uniform2f('tileSizeDIVres', () => new Vec2(tileSize / manager.graphics.res.x, tileSize / manager.graphics.res.y)),
      new Uniform2f('cam', () => manager.scene.camera.transform.GetWorldPosPerfect())
    ]);
    colorProgram.SetObjUniforms([
      new Uniform2f('numTiles', (obj) => obj.numTiles),
      new Uniform4f('tint', (obj) => obj.tint),
      new Uniform2f('tile', (obj) => obj.tile),
      new Uniform2f('scale', (obj) => obj.gameobj.transform.scale),
      new Uniform1f('height', (obj) => obj.gameobj.transform.height),
      new Uniform1f('vertical', (obj) => obj.vertical ? 1.0 : 0.0),
      new Uniform2f('center', (obj) => obj.gameobj.transform.GetWorldCenterPerfect()),
    ]);


    //SPRITE SHEET PROGRAM
    let spriteColorProgram = new Program('spriteColor', 'vs_color', 'fs_color');
    spriteColorProgram.SetUniforms([
      new Uniform2f('tileSizeDIVres', () => new Vec2(tileSize / manager.graphics.res.x, tileSize / manager.graphics.res.y)),
      new Uniform2f('cam', () => manager.scene.camera.transform.GetWorldPosPerfect())
    ]);
    spriteColorProgram.SetObjUniforms([
      new Uniform2f('numTiles', (obj) => obj.numTiles),
      new Uniform4f('tint', (obj) => obj.tint),
      new UniformTex('colorTex', (obj) => obj.spriteSheet),
      new Uniform2f('tileMapResDIVtileSize', (obj) =>
        new Vec2(obj.spriteSheet.width / tileSize, obj.spriteSheet.height / tileSize)),
      new Uniform2f('tile', (obj) => obj.tile),
      new Uniform2f('scale', (obj) => obj.gameobj.transform.scale),
      new Uniform1f('height', (obj) => obj.gameobj.transform.height),
      new Uniform1f('vertical', (obj) => obj.vertical ? 1.0 : 0.0),
      new Uniform2f('center', (obj) => obj.gameobj.transform.GetWorldCenterPerfect()),
    ]);

    //TILE MAP DEPTH PROGRAM
    let depthProgram = new Program('depth', 'vs_depth', 'fs_depth');
    depthProgram.SetConstUniforms([
      new UniformTex('colorTex', () => resources.textures.get('tileMap')),
      new Uniform2f('tileMapResDIVtileSize', () => new Vec2(tileMap.width / tileSize, tileMap.height / tileSize))
    ]);
    //let camTransform = manager.scene.camera.transform;
    depthProgram.SetUniforms([
      new Uniform2f('tileSizeDIVres', () => new Vec2(tileSize / manager.graphics.res.x, tileSize / manager.graphics.res.y)),
      new Uniform2f('cam', () => manager.scene.camera.transform.GetWorldPosPerfect())
    ]);
    depthProgram.SetObjUniforms([
      new Uniform2f('numTiles', (obj) => obj.numTiles),
      new Uniform4f('tint', (obj) => obj.tint),
      new Uniform2f('tile', (obj) => obj.tile),
      new Uniform2f('scale', (obj) => obj.gameobj.transform.scale),
      new Uniform1f('height', (obj) => obj.gameobj.transform.height),
      new Uniform1f('vertical', (obj) => obj.vertical ? 1.0 : 0.0),
      new Uniform2f('center', (obj) => obj.gameobj.transform.GetWorldCenterPerfect()),
    ]);

    //SPRITE SHEET DEPTH PROGRAM
    let spriteDepthProgram = new Program('spriteDepth', 'vs_depth', 'fs_depth');
    spriteDepthProgram.SetUniforms([
      new Uniform2f('tileSizeDIVres', () => new Vec2(tileSize / manager.graphics.res.x, tileSize / manager.graphics.res.y)),
      new Uniform2f('cam', () => manager.scene.camera.transform.GetWorldPosPerfect())
    ]);
    spriteDepthProgram.SetObjUniforms([
      new Uniform2f('numTiles', (obj) => obj.numTiles),
      new Uniform4f('tint', (obj) => obj.tint),
      new UniformTex('colorTex', (obj) => obj.spriteSheet),
      new Uniform2f('tileMapResDIVtileSize', (obj) =>
        new Vec2(obj.spriteSheet.width / tileSize, obj.spriteSheet.height / tileSize)),
      new Uniform2f('tile', (obj) => obj.tile),
      new Uniform2f('scale', (obj) => obj.gameobj.transform.scale),
      new Uniform1f('height', (obj) => obj.gameobj.transform.height),
      new Uniform1f('vertical', (obj) => obj.vertical ? 1.0 : 0.0),
      new Uniform2f('center', (obj) => obj.gameobj.transform.GetWorldCenterPerfect()),
    ]);

    //TILE MAP SUN DEPTH PROGRAM
    let sunDepthProgram = new Program('sunDepth', 'vs_sunDepth', 'fs_depth');
    sunDepthProgram.SetConstUniforms([
      new UniformTex('colorTex', () => resources.textures.get('tileMap')),
      new Uniform2f('tileMapResDIVtileSize', () => new Vec2(tileMap.width / tileSize, tileMap.height / tileSize))
    ]);
    //let camTransform = manager.scene.camera.transform;
    sunDepthProgram.SetUniforms([
      new Uniform2f('tileSizeDIVres', () => new Vec2(tileSize / manager.graphics.res.x, tileSize / manager.graphics.res.y)),
      new Uniform2f('cam', () => manager.scene.camera.transform.GetWorldPosPerfect()),
      new Uniform1f('shadowLength', () => lighting.shadowLength)
    ]);
    sunDepthProgram.SetObjUniforms([
      new Uniform2f('numTiles', (obj) => obj.numTiles),
      new Uniform4f('tint', (obj) => obj.tint),
      new Uniform2f('tile', (obj) => obj.tile),
      new Uniform2f('scale', (obj) => obj.gameobj.transform.scale),
      new Uniform1f('height', (obj) => obj.gameobj.transform.height),
      new Uniform1f('vertical', (obj) => obj.vertical ? 1.0 : 0.0),
      new Uniform2f('center', (obj) => obj.gameobj.transform.GetWorldCenterPerfect()),
    ]);

    //SPRITE SHEET SUN DEPTH PROGRAM
    let spriteSunDepthProgram = new Program('spriteSunDepth', 'vs_sunDepth', 'fs_depth');
    spriteSunDepthProgram.SetUniforms([
      new Uniform2f('tileSizeDIVres', () => new Vec2(tileSize / manager.graphics.res.x, tileSize / manager.graphics.res.y)),
      new Uniform2f('cam', () => manager.scene.camera.transform.GetWorldPosPerfect()),
      new Uniform1f('shadowLength', () => lighting.shadowLength)
    ]);

    spriteSunDepthProgram.SetObjUniforms([
      new Uniform2f('numTiles', (obj) => obj.numTiles),
      new Uniform4f('tint', (obj) => obj.tint),
      new UniformTex('colorTex', (obj) => obj.spriteSheet),
      new Uniform2f('tileMapResDIVtileSize', (obj) =>
        new Vec2(obj.spriteSheet.width / tileSize, obj.spriteSheet.height / tileSize)),
      new Uniform2f('tile', (obj) => obj.tile),
      new Uniform2f('scale', (obj) => obj.gameobj.transform.scale),
      new Uniform1f('height', (obj) => obj.gameobj.transform.height),
      new Uniform1f('vertical', (obj) => obj.vertical ? 1.0 : 0.0),
      new Uniform2f('center', (obj) => obj.gameobj.transform.GetWorldCenterPerfect()),
    ]);

    //SUN LIGHT PROGRAM
    let sunLightProgram = new Program('sunLight', 'vs_common', 'fs_sunLight', true, true);
    sunLightProgram.SetUniforms([
      new UniformTex('depthTex', () => this.fbos.get('depth').texture),
      new UniformTex('sunDepthTex', () => this.fbos.get('sunDepth').texture),
      new Uniform1f('verticalShadowStrength', () => lighting.verticalShadowStrength),
      new Uniform1f('temperature', () => lighting.sunTemperature),
      new Uniform1f('strength', () => lighting.sunStrength),
    ]);

    //POINT LIGHT PROGRAM
    let pointLightProgram = new Program('pointLight', 'vs_common', 'fs_light', true, true);
    pointLightProgram.SetUniforms([
      new Uniform2f('tileSizeDIVres', () => new Vec2(tileSize / manager.graphics.res.x, tileSize / manager.graphics.res.y)),
      new Uniform2f('res', () => manager.graphics.res),
      new Uniform1f('ratio', () => lighting.currentLightSource.ratio),
      new Uniform1f('temperature', () => lighting.currentLightSource.temperature),
      new Uniform1f('strength', () => lighting.currentLightSource.strength),
      new Uniform1f('edge0', () => lighting.currentLightSource.edge0),
      new Uniform1f('edge1', () => lighting.currentLightSource.edge1),
      new Uniform2f('center', () => lighting.currentLightSource.gameobj.transform.GetWorldCenterPerfect()),
      new Uniform1f('height', () => lighting.currentLightSource.gameobj.transform.height),
      new Uniform2f('cam', () => manager.scene.camera.transform.GetWorldPosPerfect()),
      new UniformTex('depthTex', () => manager.graphics.fbos.get('depth').texture),
      new UniformTex('lightTex', () => manager.graphics.lastOutput.texture),
      new Uniform1fv('casters', ()=>lighting.currentLightSource.GetClosestShadowCasters()),
      //new Uniform1f('colorsPerChannel', ()=>manager.graphics.colorsPerChannel),
    ]);

    //BLUR PROGRAMS
    let blurXProgram = new Program('blurX', 'vs_common', 'fs_blurX', true, true);
    blurXProgram.SetUniforms([
      new Uniform4f('channels', () => lighting.lightBlurChannels),
      new UniformTex('colorTex', () => manager.graphics.lastOutput.texture),
      new UniformTex('depthTex', () => manager.graphics.fbos.get('depth').texture),
      new Uniform1f('invAspect', () => manager.graphics.res.y / manager.graphics.res.x),
      new Uniform1f('blurSize', () => lighting.shadowBlur),
      new Uniform1f('blurEdge0', () => lighting.shadowBlurE0),
      new Uniform1f('blurEdge1', () => lighting.shadowBlurE1),
    ]);

    let blurYProgram = new Program('blurY', 'vs_common', 'fs_blurY', true, true);
    blurYProgram.SetUniforms([
      new Uniform4f('channels', () => lighting.lightBlurChannels),
      new UniformTex('colorTex', () => manager.graphics.fbos.get('blurHalf').texture),
      new UniformTex('depthTex', () => manager.graphics.fbos.get('depth').texture),
      new Uniform1f('blurSize', () => lighting.shadowBlur),
      new Uniform1f('blurEdge0', () => lighting.shadowBlurE0),
      new Uniform1f('blurEdge1', () => lighting.shadowBlurE1),
    ]);

    //LIT COLOR PROGRAM
    let litColorProgram = new Program('litColor', 'vs_common', 'fs_lit', true, true);
    litColorProgram.SetUniforms([
      new UniformTex('lightTex', () => manager.graphics.fbos.get('light').texture),
      new UniformTex('colorTex', () => manager.graphics.fbos.get('color').texture),
      /*TEMPORAL*/
      new Uniform4f('ambientLight', () => lighting.ambientLight),
      new Uniform1f('shadowStrength', () => lighting.shadowStrength),
    ]);

    //COLLIDER PROGRAM
    let colliderProgram = new Program('collider', 'vs_collider', 'fs_collider', false);
    colliderProgram.SetUniforms([
      new Uniform2f('camTransformed', () => Vec2.Scale(manager.scene.camera.transform.GetWorldPosPerfect(), 2.0).Div(manager.graphics.res).Scale(tileSize)),
    ]);
    colliderProgram.SetObjUniforms([
      new Uniform4f('tint', (obj) => obj.tint),
      new Uniform2f('vertDisplacement', (obj) => obj.vertDisplacement),
      new Uniform2f('scaleMULtileSizeDIVres', function(obj) {
        return Vec2.Scale(obj.scale, tileSize).Div(manager.graphics.res);
      }),
      new Uniform1f('circular', (obj) => obj.circular)
    ]);

    //COLOR FILTER PROGRAM
    let colorFilterProgram = new Program('colorFilter', 'vs_common', 'fs_colorFilter', true, true);
    colorFilterProgram.SetUniforms([
      new UniformTex('colorTex', () => manager.graphics.lastOutput.texture),
      new Uniform4f('colorFilter', () => manager.scene.camera.camera.colorFilter),
      new Uniform1f('brightness', () => manager.scene.camera.camera.brightness),
      new Uniform1f('contrast', () => manager.scene.camera.camera.contrast),
    ]);

    //LIMIT COLOR PROGRAM
    let limitColorProgram = new Program('limitColor', 'vs_common', 'fs_limitColor', true, true);
    limitColorProgram.SetConstUniforms([
      new Uniform1f('colorsPerChannel', () => manager.graphics.colorsPerChannel),
    ]);
    limitColorProgram.SetUniforms([
      new UniformTex('colorTex', () => manager.graphics.lastOutput.texture),
    ]);


    //SURFACE PROGRAM
    let surfaceProgram = new Program('surface', 'vs_surface', 'fs_common', true, true);
    surfaceProgram.SetUniforms([
      new UniformTex('colorTex', ()=>manager.graphics.fbos.get('finalColor').texture),
      new Uniform2f('gameRes', ()=>manager.graphics.res),
      new Uniform2f('canvasRes', ()=>new Vec2(canvas.width, canvas.height)),
    ]);

    //VIRTUAL INPUT PROGRAM
    let virtualInputProgram = new Program('virtualInput','vs_virtualInput', 'fs_virtualInput', true, false);
    virtualInputProgram.SetUniforms([
      new Uniform2f('canvasRes', ()=>new Vec2(canvas.width, canvas.height)),
    ]);
    virtualInputProgram.SetObjUniforms([
      new Uniform2f('anchor', (obj)=>obj.anchor),
      new Uniform2f('position', (obj)=>obj.position),
      new Uniform2f('scale', (obj) => obj.scale),
      new Uniform4f('tint', (obj)=>obj.tint),
      new UniformTex('colorTex', (obj)=>obj.texture),
    ]);


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
    if (program.useTexCoords) {
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

    this.UpdateFBOTexture(fb);

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

    if (hasDepthBuffer) {
      fb.depthBuffer = gl.createRenderbuffer();
      fb.hasDepthBuffer = true;

      this.UpdateDepthBuffer(fb);

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

  UpdateFramebufferDimensions(fb){
    this.UpdateFBOTexture(fb);
    if(fb.hasDepthBuffer){
      this.UpdateDepthBuffer(fb);
    }
  }

  UpdateFBOTexture(fb){
    let tex = fb.texture;
    if (tex.width != manager.graphics.res.x || tex.height != manager.graphics.res.y) {
      gl.bindTexture(gl.TEXTURE_2D, fb.texture);
      tex.width = manager.graphics.res.x;
      tex.height = manager.graphics.res.y;

      const level = 0;
      const internalFormat = gl.RGBA;
      const border = 0;
      const format = gl.RGBA;
      const type = gl.UNSIGNED_BYTE;
      const data = null;

      gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
        manager.graphics.res.x, manager.graphics.res.y, border,
        format, type, data);
      gl.bindTexture(gl.TEXTURE_2D, null);
    }
  }

  UpdateDepthBuffer(fb){
    gl.bindRenderbuffer(gl.RENDERBUFFER, fb.depthBuffer);
    gl.renderbufferStorage(
      gl.RENDERBUFFER,
      gl.DEPTH_COMPONENT16,
      manager.graphics.res.x,
      manager.graphics.res.y
    );
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
  }
}
