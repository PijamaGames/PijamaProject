class Renderer extends Component{
  constructor(tile = new Vec2(), numTiles = new Vec2(1,1), vertical = true, alpha = 1.0, programs = null){
    super();
    this.type = "renderer";
    if(programs == null){
      programs = ['color', 'depth', 'sunDepth', 'mask'];
    }
    this.programs = [];
    for(var program of programs){
      this.programs.push(manager.graphics.programs.get(program));
    }
    this.name = null;
    this.tile = tile;
    this.numTiles = numTiles;
    this.vertical = vertical;
    this.tint = new Float32Array([1,1,1,alpha]);
  }

  SetTint(r=1.0,g=1.0,b=1.0,a=1.0){
    this.tint[0] = r;
    this.tint[1] = g;
    this.tint[2] = b;
    this.tint[3] = a;
  }

  SetGameobj(gameobj){
    this.gameobj = gameobj;
    this.gameobj.renderer = this;

    this.name = this.gameobj.key;
    for(var program of this.programs){
      if(program)
        program.renderers.add(this);
    }
  }

  Destroy(){
    for(var program of this.programs){
      program.renderers.delete(this);
    }
  }
}
