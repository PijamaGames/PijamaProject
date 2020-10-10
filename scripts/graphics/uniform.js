class Uniform{
  constructor(name, program){
    //Object.assign(this, {name, program});
    this.name = name;
    this.program = program;
    this.location = gl.getUniformLocation(this.program.program, this.name);
  }
  Load(){

  }
}

class UniformTex extends Uniform{
  constructor(name, program, textureName){
    super(name, program);
    this.texture = resources.textures.get(textureName);
    this.program.texUnitOffset+=1;
  }
  Load(unit){
    gl.uniform1i(this.location, unit);
    gl.activeTexture(gl.TEXTURE0+unit);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
  }
}

class Uniform1f extends Uniform{
  constructor(name, program, getFunc){
    super(name, program);
    this.getValue = getFunc;
  }
  Load(obj){
    gl.uniform1f(this.location, this.getValue(obj));
  }
}

class Uniform2f extends Uniform{
  constructor(name, program, getFunc){
    super(name, program);
    this.getValue = getFunc;
  }
  Load(obj){
    let v = this.getValue(obj);
    gl.uniform2f(this.location, v.x, v.y);
  }
}
