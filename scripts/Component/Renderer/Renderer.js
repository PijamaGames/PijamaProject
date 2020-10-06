class Renderer extends Component{

  constructor(_programName, _texName){
    super();
    this.program = Graphics.programs.get(_programName);
    this.texName = _texName;
    this.AssignResources();
  }

  AssignResources(){
    //console.log(gameController.resources);
    this.texture = gameController.resources.textures.get(this.texName);
  }

  SetGameObject(gameObject) {
    this.gameObject = gameObject;
    this.program.renderers.set(this.gameObject.name, this);
    Graphics.depthProgram.renderers.set(this.gameObject.name, this);
  }

  ActivateTextures(){
    let gl = Graphics.gl;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
  }

  Destroy(){
    delete this.program.renderers[this.gameObject.name];
  }
}
