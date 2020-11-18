class Burnable extends Component{
  constructor(displacement = new Vec2()){
    super();
    this.type = "burnable";
    this.displacement = displacement;
    this.burned = false;
    this.onBurn = function(){};
    this.onEndBurn = function(){};
    this.darken = 0.3;
    this.isBurning = false;
  }

  Destroy(){
    this.fire.Destroy();
    this.gameobj.audioSource.StopAll();
  }

  Burn(){
    if(user && user.isClient) return;
    if(this.isBurning) return;
    this.isBurning = true;
    if(!this.gameobj.audioSource.Playing("fireSound")){
      this.gameobj.audioSource.Loop("fireSound",false);
      this.gameobj.audioSource.Play("fireSound");
    }
    Log("burn");
    if(!this.burned){
      this.gameobj.renderer.tint[0] = this.gameobj.renderer.tint[0] * this.darken;
      this.gameobj.renderer.tint[1] = this.gameobj.renderer.tint[1] * this.darken;
      this.gameobj.renderer.tint[2] = this.gameobj.renderer.tint[2] * this.darken;
    }
    this.fire.SetActive(true);
    this.fire.renderer.tile.x = 0;
    this.fire.renderer.paused = false;
    var that = this;
    this.burned = true;
    this.onBurn(this.gameobj);
    this.fire.renderer.endAnimEvent.AddListener(this, ()=>{
      that.fire.SetActive(false);
      this.onEndBurn(this.gameobj);
      this.isBurning = false;
      this.fire.renderer.paused = true;
      Log("end burn");
    }, true);
  }

  SetOnBurn(func){
    this.onBurn = func;
    return this;
  }

  SetOnEndBurn(func){
    this.onEndBurn = func;
    return this;
  }

  SetGameobj(gameobj){
    this.gameobj = gameobj;
    this.gameobj.burnable = this;

    this.fire = prefabFactory.CreateObj("fire");
    this.fire.SetActive(false);
    this.fire.SetParent(this.gameobj);
    this.fire.renderer.paused = true;
    this.fire.transform.SetWorldPosition(this.gameobj.transform.GetWorldCenter().Copy().Add(this.displacement));
  }
}
