class Uniform{
  constructor(name, program){
    this.name = name;
    this.program = null;
    this.location = -1;
    if(program) this.SetProgram(program);
  }
  SetProgram(program){
    this.program = program;
    this.location = gl.getUniformLocation(this.program.program, this.name);
  }
  Load(){

  }
}

class UniformTex extends Uniform{
  constructor(name, getFunc, program){
    super(name, program);
    this.getValue = getFunc;
    this.texture = true;
    //this.texture = getFunc();/*resources.textures.get(textureName);*/

  }
  SetProgram(program){
    this.program = program;
    this.location = gl.getUniformLocation(this.program.program, this.name);
    this.program.texUnitOffset+=1;
  }
  Load(unit, obj = null){
    gl.uniform1i(this.location, unit);
    gl.activeTexture(gl.TEXTURE0+unit);
    gl.bindTexture(gl.TEXTURE_2D, this.getValue(obj));
  }
}

class Uniform1f extends Uniform{
  constructor(name, getFunc, program){
    super(name, program);
    this.getValue = getFunc;
  }
  Load(obj){
    gl.uniform1f(this.location, this.getValue(obj));
  }
}

class Uniform2f extends Uniform{
  constructor(name, getFunc, program){
    super(name, program);
    this.getValue = getFunc;
  }
  Load(obj){
    let v = this.getValue(obj);
    gl.uniform2f(this.location, v.x, v.y);
  }
}

class Uniform4f extends Uniform{
  constructor(name, getFunc, program){
    super(name, program);
    this.getValue = getFunc;
  }
  Load(obj){
    let v = this.getValue(obj);
    gl.uniform4f(this.location, v[0], v[1], v[2], v[3]);
  }
}

class Uniform1fv extends Uniform{
  constructor(name, getFunc, program){
    super(name, program);
    this.getValue = getFunc;
  }
  Load(obj){
    let v = this.getValue(obj);
    gl.uniform1fv(this.location, v);

  }
}
