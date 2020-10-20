class LightSource extends Component{
  constructor(ratio = 6.0, temperature = 1.0, strength = 0.7, edge0=0.5, edge1=1.0){
    super();
    Object.assign(this, {ratio, temperature, strength, edge0, edge1});
  }

  Destroy(){
    this.gameobj.lights.delete(this);
    lighting.lightSources.delete(this);
  }

  Update(){
    return;
    if(input.GetKeyPressed('KeyT')){
      this.ratio+=manager.delta*2.0;
    }
    if(input.GetKeyPressed('KeyG')){
      this.ratio-=manager.delta*2.0;
    }
  }

  SetGameobj(gameobj){
    this.gameobj = gameobj;
    if(!this.gameobj.lights)
      this.gameobj.lights = new Set();

    this.gameobj.lights.add(this);
    lighting.lightSources.add(this);
  }
}
