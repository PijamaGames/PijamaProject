class LightSource extends Component{
  constructor(ratio = 6.0, temperature = 1.0, strength = 0.7, edge0=0.5, edge1=1.0){
    super();
    Object.assign(this, {ratio, temperature, strength, edge0, edge1});
    this.type = "lightSource";
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

  GetClosestShadowCasters(){
    let casters = lighting.shadowCasters;
    let lightPos = this.gameobj.transform.position;
    casters = casters.sort((c1,c2)=>{
      let d1 = Vec2.Distance(c1.worldPos, lightPos);
      let d2 = Vec2.Distance(c2.worldPos, lightPos);
      if (d1 < d2){
        return -1;
      }
      else if (d1 > d2){
        return 1;
      }
      return 0;
    });

    let size = casters.length;
    for(var i = 0; i < lighting.shadowCastersPerLight; i++){
      if(i <size){
        let pos = casters[i].worldPos;
        lighting.shadowCastersArr[i*4] = pos.x;
        lighting.shadowCastersArr[i*4+1] = pos.y;
        lighting.shadowCastersArr[i*4+2] = casters[i].gameobj.transform.height;
        lighting.shadowCastersArr[i*4+3] = casters[i].ratio;
      } else {
        lighting.shadowCastersArr[i*4] = 999999999.9999;
        lighting.shadowCastersArr[i*4+1] = 999999999.9999;
        lighting.shadowCastersArr[i*4+2] = 999999999.9999;
        lighting.shadowCastersArr[i*4+3] = 0.0;
      }
    }
    return lighting.shadowCastersArr;
  }
}
