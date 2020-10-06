class Uniform{
  constructor(_name, _program, _loadFunc){
    this.name = _name;
    this.program=_program;
    this.location = Graphics.gl.getUniformLocation(this.program.program, this.name);
    this.Load = _loadFunc;
  }
}
