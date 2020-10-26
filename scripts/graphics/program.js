class Program{
  constructor(name, _vertexShaderName, _fragmentShaderName, useTexCoords = true, postProcess = false, isUI = false)
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
    this.renderers = new Set();
    this.isPostProcess = postProcess;
    this.isUI = isUI;
    if(postProcess){
      this.renderers.add('postProcess');
    }
    if(isUI){
      this.uiTileMap = resources.textures.get('uiTileMap');
      this.fontTileMap = resources.textures.get('fontTileMap');
    }
    this.useTexCoords = useTexCoords;

    manager.graphics.SetBuffers(this);
  }

  SetUniformPrograms(uArr){
    for(var u of uArr){
      u.SetProgram(this);
    }
  }

  SetUniforms(uniforms = []){
    this.uniforms = uniforms;
    this.SetUniformPrograms(this.uniforms);

    if(this.isUI){
      this.colorTex;
      //new Uniform2f('tileMapResDIVtileSize', () => new Vec2(uiTileMap.width / tileSize, uiTileMap.height / tileSize)),
      let foundColorTex = false;
      let foundTileMapResDIVtileSize = false;
      let i = 0;
      let size = this.uniforms.length;
      let uniform;
      while((!foundColorTex || !foundTileMapResDIVtileSize) && i < size){
        uniform = this.uniforms[i];
        if(uniform.name === 'colorTex'){
          this.colorTex = uniform;
          foundColorTex = true;
        } else if(uniform.name === 'tileMapResDIVtileSize'){
          this.tileMapResDIVtileSize = uniform;
          foundTileMapResDIVtileSize = true;
        }
        i++;
      }
    }
  }
  SetObjUniforms(objUniforms = []){
    this.objUniforms = objUniforms;
    this.SetUniformPrograms(this.objUniforms);
  }
  SetConstUniforms(constUniforms = []){
    this.constUniforms = constUniforms;
    this.SetUniformPrograms(this.constUniforms);
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
        uniform.Load(i, obj);
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
    for(var renderer of this.renderers){
      if(renderer.active || this.isPostProcess){
        this.LoadObjUniforms(renderer, texUnitOffset);
        manager.graphics.Draw();
      }
    }
  }

  RenderUI(){
    this.Use();
    let texUnitOffset = this.LoadUniforms();
    let notTexts = [];
    for(var renderer of this.renderers){
      if(!renderer.isText){
        notTexts.push(renderer);
      }
    }
    notTexts.sort((e1,e2)=>{
      if(e1.gameobj.transform.height < e2.gameobj.transform.height){
        return -1;
      } else if (e1.gameobj.transform.height > e2.gameobj.transform.height){
        return 1;
      }
      return 0;
    });

    var that = this;
    this.colorTex.getValue = function(){
      return that.uiTileMap;
    };

    this.tileMapResDIVtileSize.getValue = function(){
      return new Vec2(that.uiTileMap.width / tileSize, that.uiTileMap.height / tileSize);
    };
    this.LoadUniforms();
    for(let renderer of notTexts){
      if(renderer.active || this.isPostProcess){
        this.LoadObjUniforms(renderer, texUnitOffset);
        manager.graphics.Draw();
      }
    }

    //CHANGE TILE MAP FOR CHARACTERS
    this.colorTex.getValue = function(){return that.fontTileMap;};
    this.tileMapResDIVtileSize.getValue = function(){
      return new Vec2(that.fontTileMap.width / tileSize, that.fontTileMap.height / tileSize);
    };
    this.LoadUniforms();
    for(var renderer of this.renderers){
      if(renderer.isText && (renderer.active || this.isPostProcess)){
        this.LoadObjUniforms(renderer, texUnitOffset);
        manager.graphics.Draw();
      }
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
