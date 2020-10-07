var canvas = document.getElementById('game-surface');
class Graphics {
  static gl;
  static depthProgram;
  static programs;
  static programsOrdered;
  static canvas;
  static postProcessEffects;
  static depthFBO;
  static defaultFBO;

  constructor() {
    Graphics.programs = new Map();
    Graphics.programsOrdered = [];
    Graphics.postProcessEffects=[];
    Graphics.FBOs = [];
  }
  Init() {
    console.log("Creating context");

    var gl = canvas.getContext('webgl');
    Graphics.gl = gl;


    if (!gl) {
      console.log('WebGL not supported, falling back to experimental WebGL');
      gl = canvas.getContext('experimental-webgl');
    }

    if (!gl) alert('Your browser does not support WebGL');

    //canvas.width = window.innerWidth* window.devicePixelRatio;
    //canvas.height = window.innerHeight* window.devicePixelRatio;
    gl.viewport(0,0,canvas.width,canvas.height);

    gl.clearColor(0.3, 0.7, 1.0, 1.0); //Blue by default
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    //gl.enable(gl.CULL_FACE);
    //gl.frontFace(gl.CCW);
    //gl.cullFace(gl.BACK);

    Graphics.depthFBO = Graphics.CreateFrameBuffer(true);
    Graphics.defaultFBO = Graphics.CreateFrameBuffer(true);
  }

  CreatePrograms(){
    let shaders = gameController.resources.shaders;
    /*Program.CreateProgram(this.depthFBO,
      gameController.resources.get(''),
      gameController.resources.get(''));*/
    Graphics.depthProgram = new Program('depth', 0,
      shaders.get('vs_depth'),
      shaders.get('fs_depth'),
      0,
      false
    );
    Graphics.depthProgram.constUniforms.push(
      new Uniform('far', Graphics.depthProgram, function(scene){
        Graphics.gl.uniform1f(this.location, scene.camera.far-scene.camera.near);
      })
    );

    var programC = new Program('opaque', 0, shaders.get('vs_default'), shaders.get('fs_opaque'),1);
    programC.constUniforms.push(new Uniform('screenSize', programC, function(scene){
      Graphics.gl.uniform2f(this.location, canvas.width, canvas.height);
    }));
    programC.constUniforms.push(new Uniform('colorSampler', programC, function(scene){
      Graphics.gl.uniform1i(this.location, 0);
    }));
    programC.constUniforms.push(new Uniform('depthSampler', programC, function(scene){
      Graphics.gl.uniform1i(this.location, 1);
    }));
    programC.constUniforms.push(new Uniform('fogColor', programC, function(scene){
      Graphics.gl.uniform3f(this.location, scene.camera.fogColorX, scene.camera.fogColorY, scene.camera.fogColorZ);
    }));
    programC.constUniforms.push(new Uniform('fogEdges', programC, function(scene){
      Graphics.gl.uniform2f(this.location, scene.camera.fogEdges[0], scene.camera.fogEdges[1]);
    }));
    programC.constTextures.push(Graphics.depthFBO.texture);
  }

  CreatePostProcessEffects(){
    //BLUR HORIZONTAL
    var blurHorizontal = new PostProcess('fs_blurHorizontal',Graphics.defaultFBO);
    blurHorizontal.uniforms.push(new Uniform('colorSampler', blurHorizontal, function(scene){
      Graphics.gl.uniform1i(this.location, 0);
    }));
    blurHorizontal.uniforms.push(new Uniform('depthSampler', blurHorizontal, function(scene){
      Graphics.gl.uniform1i(this.location, 1);
    }));
    blurHorizontal.uniforms.push(new Uniform('invAspect', blurHorizontal, function(scene){
      Graphics.gl.uniform1f(this.location, canvas.height / canvas.width);
    }));
    blurHorizontal.uniforms.push(new Uniform('blurSize', blurHorizontal, function(scene){
      Graphics.gl.uniform1f(this.location, scene.camera.blurSize);
    }));
    blurHorizontal.uniforms.push(new Uniform('focus', blurHorizontal, function(scene){
      Graphics.gl.uniform1f(this.location, scene.camera.focus);
    }));
    blurHorizontal.uniforms.push(new Uniform('dofEdge0', blurHorizontal, function(scene){
      Graphics.gl.uniform1f(this.location, scene.camera.dofEdge0);
    }));
    blurHorizontal.uniforms.push(new Uniform('dofEdge1', blurHorizontal, function(scene){
      Graphics.gl.uniform1f(this.location, scene.camera.dofEdge1);
    }));

    //BLUR VERTICAL
    var blurVertical = new PostProcess('fs_blurVertical');
    blurVertical.uniforms.push(new Uniform('colorSampler', blurVertical, function(scene){
      Graphics.gl.uniform1i(this.location, 0);
    }));
    blurVertical.uniforms.push(new Uniform('depthSampler', blurVertical, function(scene){
      Graphics.gl.uniform1i(this.location, 1);
    }));
    blurVertical.uniforms.push(new Uniform('blurSize', blurVertical, function(scene){
      Graphics.gl.uniform1f(this.location, scene.camera.blurSize);
    }));
    blurVertical.uniforms.push(new Uniform('focus', blurVertical, function(scene){
      Graphics.gl.uniform1f(this.location, scene.camera.focus);
    }));
    blurVertical.uniforms.push(new Uniform('dofEdge0', blurVertical, function(scene){
      Graphics.gl.uniform1f(this.location, scene.camera.dofEdge0);
    }));
    blurVertical.uniforms.push(new Uniform('dofEdge1', blurVertical, function(scene){
      Graphics.gl.uniform1f(this.location, scene.camera.dofEdge1);
    }));
  }

  UpdateDimensions(){
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
    Graphics.gl.viewport(0,0,canvas.width,canvas.height);

    for (var fbo of Graphics.FBOs){
      if(fbo.texture) fbo.texture.UpdateDimensions();
      if(fbo.depthBuffer) fbo.depthBuffer.UpdateDimensions();
    }
  }

  Render(){
    let gl = Graphics.gl;


    gl.enable(gl.DEPTH_TEST);


    gl.bindFramebuffer(gl.FRAMEBUFFER, Graphics.depthFBO);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    Graphics.depthProgram.Render();

    //If there are no post process effects, render to canvas
    if(Graphics.postProcessEffects.length == 0){
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
    else{
      gl.bindFramebuffer(gl.FRAMEBUFFER, Graphics.defaultFBO);
    }

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //console.log("depth test enabled: " + gl.isEnabled(gl.DEPTH_TEST));
    //Render every program
    for(var program of Graphics.programsOrdered)
      program.Render();

    for(var postProcess of Graphics.postProcessEffects){
      postProcess.Render();
    }
  }

  AssignResources(){
    for(var program of Graphics.programsOrdered)
      program.AssignResources();
  }

  static CreateFrameBuffer(hasDepthBuffer = false) {
    var gl = Graphics.gl;

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
    Graphics.FBOs.push(fb);
    return fb;
  }
}
