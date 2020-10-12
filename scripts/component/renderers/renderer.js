class Renderer extends Component{
  constructor(programs = [], tile = new Vec2(), vertical = true){
    super();
    this.type = "renderer";
    this.programs = [];
    for(var program of programs){
      this.programs.push(manager.graphics.programs.get(program));
    }
    this.name = null;
    this.tile = tile;
    this.vertical = vertical;
    this.tint = new Float32Array([1,1,1,1]);
  }

  SetTint(r=1.0,g=1.0,b=1.0,a=1.0){
    this.tint[0] = r;
    this.tint[1] = g;
    this.tint[2] = b;
    this.tint[3] = a;
  }

  get vertDisplacement(){
    let pos = this.gameobj.transform.GetWorldPosPerfect();
    let scl = this.gameobj.transform.scale;
    let acr = this.gameobj.transform.anchor;
    let h = this.gameobj.transform.height;
    return new Vec2(
      (pos.x/scl.x-acr.x)*2.0+1.0,
      ((pos.y+h)/scl.y-acr.y)*2.0+1.0
    )
  }

  /*get verticalF(){
    if(this.vertical === true) return 1.0;
    else return 0.0;
  }*/

  SetGameobj(gameobj){
    this.gameobj = gameobj;
    this.gameobj.renderer = this;

    this.name = this.gameobj.key;
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
