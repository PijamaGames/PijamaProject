class Program{
  constructor(name, _vertexShaderName, _fragmentShaderName)
  {
    this.name = name;
    manager.graphics.programs.set(this.name, this);
    this.CreateProgram(_vertexShaderName, _fragmentShaderName);
    this.verticesLocation = gl.getAttribLocation(this.program, 'vertPosition');
    this.texCoordsLocation = gl.getAttribLocation(this.program, 'texCoords');
    this.constUniforms = [];
    this.objUniforms = [];
    this.uniforms = [];
    this.texUnitOffset = 0;
    this.renderers = new Map();

    manager.graphics.SetBuffers(this);
  }

  SetUniforms(uniforms = []){
    this.uniforms = uniforms;
  }
  SetObjUniforms(objUniforms = []){
    this.objUniforms = objUniforms;
  }
  SetConstUniforms(constUniforms = []){
    this.constUniforms = constUniforms;
    this.LoadConstUniforms();
    //Since this info is constant
    //it can be sent only once
  }

  /*
  * Sends the uniform info that
  * stays constant always
  */
  LoadConstUniforms(){
    this.Use();
    let i = 0;
    for(var uniform of this.constUniforms){
      if(uniform.texture){
        uniform.Load(i);
        i+=1;
      } else {
        uniform.Load();
      }
    }
  }

  /*
  * Sends the uniform info that's
  * constant for all objects but dynamic
  * in the game world
  */
  LoadUniforms(){
    let i = this.texUnitOffset;
    for(var uniform of this.uniforms){
      if(uniform.texture){
        uniform.Load(i);
        i+=1;
      } else {
        uniform.Load();
      }
    }
    return i;
  }

  /*
  * Sends the uniform info
  * relative to the object
  */
  LoadObjUniforms(obj, texUnitOffset){
    let i = texUnitOffset;
    for(var uniform of this.objUniforms){
      if(uniform.texture){
        uniform.Load(i);
        i+=1;
      } else {
        //Log(obj);
        uniform.Load(obj);
      }
    }
  }

  Use(){
    gl.useProgram(this.program);
  }

  Render(){
    this.Use();
    let texUnitOffset = this.LoadUniforms();
    for(var [name, renderer] of this.renderers){
      this.LoadObjUniforms(renderer.gameobj, texUnitOffset);
      manager.graphics.Draw();
    }
  }

  CreateProgram(_vertexShaderName, _fragmentShaderName){
    let vertexShaderText = resources.shaders.get(_vertexShaderName);
    let fragmentShaderText = resources.shaders.get(_fragmentShaderName);

    this.vertexShader = gl.createShader(gl.VERTEX_SHADER);
    this.fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(this.vertexShader, vertexShaderText);
    gl.shaderSource(this.fragmentShader, fragmentShaderText);

    gl.compileShader(this.vertexShader);
    if (!gl.getShaderParameter(this.vertexShader, gl.COMPILE_STATUS)) {
      console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(this.vertexShader));
      return;
    }

    gl.compileShader(this.fragmentShader);
    if (!gl.getShaderParameter(this.fragmentShader, gl.COMPILE_STATUS)) {
      console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(this.fragmentShader));
      return;
    }

    this.program = gl.createProgram();
    gl.attachShader(this.program, this.vertexShader);
    gl.attachShader(this.program, this.fragmentShader);
    gl.linkProgram(this.program);
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      console.error('ERROR linking program!', gl.getProgramInfoLog(this.program));
      return;
    }
  }
}
