class Renderer extends Component{
  constructor(programs = [], name = null){
    super();
    this.type = "renderer";
    this.programs = [];
    for(var program of programs){
      this.programs.push(manager.graphics.programs.get(program));
    }
    this.name = name;
  }

  SetGameobj(gameobj){
    this.gameobj = gameobj;
    this.gameobj.renderer = this;

    if(!this.name) this.name = this.gameobj.name;
    for(var program of this.programs){
      program.renderers.set(this.name, this);
    }
  }

  Destroy(){
    for(var program of this.programs){
      program.renderers.delete(this.name);
    }
  }
}
